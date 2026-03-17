import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Sprout } from "lucide-react";

export default function FarmProfile() {
  return (
    <article id="farm" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5" /> My Farm
          </CardTitle>
          <CardDescription>
            Your farm details, crops and seasonal plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="rounded-md border p-3 bg-card">
            <div className="text-sm text-muted-foreground">Farm Size</div>
            <div className="text-2xl font-semibold">4.5 acres</div>
          </div>
          <div className="rounded-md border p-3 bg-card">
            <div className="text-sm text-muted-foreground">Location</div>
            <div className="text-2xl font-semibold">Nashik, MH</div>
          </div>
          <div className="rounded-md border p-3 bg-card">
            <div className="text-sm text-muted-foreground">Current Crops</div>
            <div className="text-2xl font-semibold">Wheat, Tomato</div>
          </div>
          <div className="md:col-span-3 rounded-md border p-4 bg-background">
            <div className="text-sm mb-2">Crop Calendar</div>
            <div className="grid grid-cols-12 gap-1 text-xs">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded bg-secondary/60 flex items-center justify-center"
                >
                  M{i + 1}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
