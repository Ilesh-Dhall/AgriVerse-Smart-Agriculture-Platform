import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function FinancialPlanning() {
  return (
    <article id="finance" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" /> Financial Planning
          </CardTitle>
          <CardDescription>
            Track costs vs returns and explore schemes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="rounded-md border p-3 bg-card">
            <div className="text-sm text-muted-foreground">Budget Used</div>
            <div className="text-2xl font-semibold">₹ 48,500</div>
          </div>
          <div className="rounded-md border p-3 bg-card">
            <div className="text-sm text-muted-foreground">
              Expected Returns
            </div>
            <div className="text-2xl font-semibold">₹ 72,000</div>
          </div>
          <div className="rounded-md border p-3 bg-card">
            <div className="text-sm text-muted-foreground">Schemes</div>
            <div className="text-2xl font-semibold">3 available</div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
