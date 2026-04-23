import os
import json
import time
import argparse
from pathlib import Path
from tqdm.auto import tqdm

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torch.amp import GradScaler
from torch.optim.lr_scheduler import OneCycleLR

import torchvision.transforms as T
from torchvision.datasets import ImageFolder
from torchvision.models import efficientnet_b3, EfficientNet_B3_Weights


# --------------------------
# Args
# --------------------------
def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--data", default="../dataset")
    p.add_argument("--output", default="../models/efficientnet")
    p.add_argument("--epochs", type=int, default=10)
    p.add_argument("--batch", type=int, default=160)
    p.add_argument("--workers", type=int, default=0)
    p.add_argument("--lr", type=float, default=1e-3)
    p.add_argument("--img_size", type=int, default=300)
    p.add_argument("--freeze_epochs", type=int, default=5)
    p.add_argument("--compile", action="store_true")
    return p.parse_args()


# --------------------------
# Transforms
# --------------------------
def get_transforms(size, split):
    mean = [0.485, 0.456, 0.406]
    std = [0.229, 0.224, 0.225]

    if split == "train":
        return T.Compose([
            T.RandomResizedCrop(size, scale=(0.8, 1.0)),
            T.RandomHorizontalFlip(),
            T.ToTensor(),
            T.Normalize(mean, std),
        ])
    else:
        return T.Compose([
            T.Resize(int(size * 1.1)),
            T.CenterCrop(size),
            T.ToTensor(),
            T.Normalize(mean, std),
        ])


# --------------------------
# Model
# --------------------------
def build_model(num_classes, freeze=True):
    model = efficientnet_b3(weights=EfficientNet_B3_Weights.IMAGENET1K_V1)

    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(in_features, num_classes)
    )

    if freeze:
        for name, param in model.named_parameters():
            if "classifier" not in name:
                param.requires_grad = False

    return model


def unfreeze(model):
    for p in model.parameters():
        p.requires_grad = True


# --------------------------
# Train
# --------------------------
def train_one_epoch(model, loader, optimizer, criterion, scaler, scheduler, device, epoch):
    model.train()

    total_loss = 0
    correct = 0
    total = 0

    pbar = tqdm(loader, desc=f"Train {epoch}", leave=False)

    for imgs, labels in pbar:
        imgs = imgs.to(device, non_blocking=True).to(memory_format=torch.channels_last)
        labels = labels.to(device, non_blocking=True)

        optimizer.zero_grad(set_to_none=True)

        with torch.autocast("cuda", dtype=torch.bfloat16):
            out = model(imgs)
            loss = criterion(out, labels)

        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()
        scheduler.step()

        bs = imgs.size(0)
        total_loss += loss.item() * bs
        correct += (out.argmax(1) == labels).sum().item()
        total += bs

        pbar.set_postfix(
            loss=f"{total_loss/total:.4f}",
            acc=f"{correct/total:.4f}"
        )

    return total_loss / total, correct / total


@torch.no_grad()
def validate(model, loader, criterion, device, epoch):
    model.eval()

    total_loss = 0
    correct = 0
    total = 0

    pbar = tqdm(loader, desc=f"Valid {epoch}", leave=False)

    for imgs, labels in pbar:
        imgs = imgs.to(device, non_blocking=True).to(memory_format=torch.channels_last)
        labels = labels.to(device, non_blocking=True)

        with torch.autocast("cuda", dtype=torch.bfloat16):
            out = model(imgs)
            loss = criterion(out, labels)

        bs = imgs.size(0)
        total_loss += loss.item() * bs
        correct += (out.argmax(1) == labels).sum().item()
        total += bs

        pbar.set_postfix(
            loss=f"{total_loss/total:.4f}",
            acc=f"{correct/total:.4f}"
        )

    return total_loss / total, correct / total

# --------------------------
# Export
# --------------------------
def export_model(model, output_dir, img_size, class_names):
    model.eval().cpu()

    dummy = torch.randn(1, 3, img_size, img_size)

    onnx_path = output_dir / "efficientnet_plant.onnx"
    torch.onnx.export(
        model,
        dummy,
        str(onnx_path),
        input_names=["image"],
        output_names=["logits"],
        dynamic_axes={"image": {0: "batch"}, "logits": {0: "batch"}},
        opset_version=17
    )

    ts_path = output_dir / "efficientnet_plant.torchscript.pt"
    traced = torch.jit.trace(model, dummy)
    traced.save(str(ts_path))

    with open(output_dir / "class_names.json", "w") as f:
        json.dump(class_names, f, indent=2)


# --------------------------
# Main
# --------------------------
def main():
    args = parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    print("[config]", device)

    train_ds = ImageFolder(
        os.path.join(args.data, "train"),
        transform=get_transforms(args.img_size, "train")
    )

    valid_ds = ImageFolder(
        os.path.join(args.data, "valid"),
        transform=get_transforms(args.img_size, "valid")
    )

    class_names = train_ds.classes
    num_classes = len(class_names)

    print("[data]", num_classes, "classes")

    train_loader = DataLoader(
        train_ds,
        batch_size=args.batch,
        shuffle=True,
        num_workers=args.workers,
        pin_memory=True,
        persistent_workers=args.workers > 0
    )

    valid_loader = DataLoader(
        valid_ds,
        batch_size=args.batch * 2,
        shuffle=False,
        num_workers=args.workers,
        pin_memory=True,
        persistent_workers=args.workers > 0
    )

    model = build_model(num_classes, freeze=True).to(device)
    model = model.to(memory_format=torch.channels_last)

    if args.compile:
        model = torch.compile(model)

    optimizer = optim.AdamW(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=args.lr,
        weight_decay=1e-4
    )

    scheduler = OneCycleLR(
        optimizer,
        max_lr=args.lr,
        total_steps=args.epochs * len(train_loader)
    )

    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    scaler = GradScaler("cuda")

    best_acc = 0.0

    for epoch in range(1, args.epochs + 1):
        t0 = time.time()

        if epoch == args.freeze_epochs + 1:
            unfreeze(model)
        
        tr_loss, tr_acc = train_one_epoch(
            model, train_loader, optimizer,
            criterion, scaler, scheduler, device, epoch
        )
        
        val_loss, val_acc = validate(
            model, valid_loader, criterion, device, epoch
        )

        print(
            f"Epoch {epoch:02d}/{args.epochs} | "
            f"tr_acc={tr_acc:.4f} | "
            f"val_acc={val_acc:.4f} | "
            f"{time.time()-t0:.1f}s"
        )

        if val_acc > best_acc:
            best_acc = val_acc
            torch.save(model.state_dict(), output_dir / "best_checkpoint.pt")

    print("[done] best val_acc =", best_acc)

    # reload best model
    best_model = build_model(num_classes, freeze=False)
    best_model.load_state_dict(torch.load(output_dir / "best_checkpoint.pt"))

    export_model(best_model, output_dir, args.img_size, class_names)
    print("[export] complete")


if __name__ == "__main__":
    main()