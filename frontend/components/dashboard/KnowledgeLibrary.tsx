import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function KnowledgeLibrary() {
  return (
    <article id="knowledge" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Knowledge Library
          </CardTitle>
          <CardDescription>
            Curated practices and policy updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>ICAR Wheat Irrigation Guidelines — explainable steps</li>
            <li>IMD District Forecast — using it for farm planning</li>
            <li>PM‑KISAN & subsidies — eligibility and timelines</li>
          </ul>
        </CardContent>
      </Card>
    </article>
  );
}
