import io
import json
from pathlib import Path

import torch
import torch.nn as nn
from PIL import Image
import torchvision.transforms as T
from torchvision.models import efficientnet_b3

from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

app = FastAPI(title="AgriVerse Unified Backend API")

class QueryRequest(BaseModel):
    query: str
    top_k: int = 3

# Load Embeddings model
embedding_function = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Load Vector Stores
icar_vectorstore = Chroma(persist_directory="VectorDatabases/embeddings/icar_db", embedding_function=embedding_function)
datagovin_vectorstore = Chroma(persist_directory="VectorDatabases/embeddings/datagovin_db", embedding_function=embedding_function)

# ---------------- Disease Classification Model ----------------

DISEASE_MODEL_PATH = "models/efficientnet/best_checkpoint.pt"
CLASS_NAMES_PATH = "models/efficientnet/class_names.json"
IMG_SIZE = 300

disease_model = None
disease_class_names = []

def build_disease_model(num_classes: int):
    model = efficientnet_b3(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(0.3),
        nn.Linear(in_features, num_classes)
    )
    return model

disease_transform = T.Compose([
    T.Resize(int(IMG_SIZE * 1.1)),
    T.CenterCrop(IMG_SIZE),
    T.ToTensor(),
    T.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def load_disease_model():
    global disease_model, disease_class_names

    with open(CLASS_NAMES_PATH, "r") as f:
        disease_class_names = json.load(f)

    disease_model = build_disease_model(len(disease_class_names))
    state = torch.load(DISEASE_MODEL_PATH, map_location="cpu")
    disease_model.load_state_dict(state)
    disease_model.eval()

load_disease_model()

@app.post("/api/icar/query")
def query_icar(data: QueryRequest):
    results = icar_vectorstore.similarity_search(data.query, k=data.top_k)
    if results:
        combined_text = "\n\n".join([doc.page_content for doc in results])
        return {"context": combined_text}
    return {"context": "No relevant information found in ICAR details."}

@app.post("/api/datagovin/query")
def query_datagovin(data: QueryRequest):
    results = datagovin_vectorstore.similarity_search(data.query, k=data.top_k)
    if results:
        combined_text = "\n\n".join([doc.page_content for doc in results])
        return {"context": combined_text}
    return {"context": "No relevant policy or finance information found."}

@app.post("/api/diseaseclassify/image")
async def disease_classify_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        img = Image.open(io.BytesIO(contents)).convert("RGB")
        x = disease_transform(img).unsqueeze(0)

        with torch.no_grad():
            logits = disease_model(x)
            probs = torch.softmax(logits, dim=1)[0]

        top_prob, top_idx = torch.max(probs, dim=0)

        top5_prob, top5_idx = torch.topk(probs, k=min(5, len(disease_class_names)))

        predictions = []
        for p, idx in zip(top5_prob.tolist(), top5_idx.tolist()):
            predictions.append({
                "class_index": idx,
                "class_name": disease_class_names[idx],
                "probability": round(float(p), 6),
                "confidence_percent": round(float(p) * 100, 2)
            })

        pred_name = disease_class_names[top_idx.item()]

        # parse crop + disease from PlantVillage style labels
        parts = pred_name.split("___")
        crop = parts[0].replace("_", " ") if len(parts) > 0 else pred_name
        disease = parts[1].replace("_", " ") if len(parts) > 1 else pred_name

        healthy = "healthy" in pred_name.lower()

        return {
            "success": True,
            "tool": "plant_disease_classifier",
            "predicted_class_index": int(top_idx.item()),
            "predicted_class_name": pred_name,
            "crop": crop,
            "disease": disease,
            "healthy": healthy,
            "probability": round(float(top_prob.item()), 6),
            "confidence_percent": round(float(top_prob.item()) * 100, 2),
            "top_predictions": predictions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))