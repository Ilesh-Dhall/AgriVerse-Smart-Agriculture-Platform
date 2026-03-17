import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import UploadPreview from "./UploadPreview";

export default function CropHealthMonitor() {
  return (
    <article id="health" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" /> Crop Health
          </CardTitle>
          <CardDescription>
            Upload leaf images to get likely issues and remedies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <UploadPreview />
          <div className="rounded-md border p-3 bg-card text-sm text-muted-foreground">
            Tip: Take photos in daylight, focus on affected leaves, include both
            sides.
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
