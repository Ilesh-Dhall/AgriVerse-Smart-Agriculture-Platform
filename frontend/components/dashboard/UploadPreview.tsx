import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function UploadPreview() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex items-center gap-3">
      <label className="inline-flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="hidden"
          aria-label="Upload crop photo"
        />
        <Button variant="secondary" asChild>
          <span className="inline-flex items-center">
            <ImageIcon className="h-4 w-4 mr-2" /> Choose Image
          </span>
        </Button>
      </label>
      {preview ? (
        <Image
          src={preview}
          alt="Uploaded crop leaf preview"
          className="h-16 w-16 rounded-md object-cover border"
          loading="lazy"
        />
      ) : (
        <div className="text-sm text-muted-foreground">No image selected</div>
      )}
    </div>
  );
}
