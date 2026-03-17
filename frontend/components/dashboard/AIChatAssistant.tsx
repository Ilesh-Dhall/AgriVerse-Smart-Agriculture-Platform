import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { MessageSquare, Mic } from "lucide-react";

export default function AIChatAssistant() {
  return (
    <article id="ai" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> AI Chat Assistant
          </CardTitle>
          <CardDescription>
            Ask naturally in your language. Templates help you get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              "Crop health",
              "Weather concerns",
              "Market prices",
              "Irrigation advice",
            ].map((t) => (
              <Button key={t} variant="secondary" size="sm">
                {t}
              </Button>
            ))}
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="e.g., When should I irrigate my wheat in Nashik next week?"
              className="flex-1"
            />
            <Button variant="secondary" size="icon" aria-label="Voice input">
              <Mic />
            </Button>
            <Button>Ask</Button>
          </div>
          <div className="rounded-md border p-3 bg-card">
            <div className="text-sm text-muted-foreground">
              Recent conversation
            </div>
            <div className="mt-2 space-y-2 text-sm">
              <p>
                <span className="font-medium">You:</span> Best time to sell
                tomatoes in Pune?
              </p>
              <p>
                <span className="font-medium">AgriVerse:</span> Prices trending
                up 15% next 10 days; optimal window: next Tue–Thu. Sources:
                Agmarknet, local mandi.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
