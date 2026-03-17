import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CloudSun } from "lucide-react";

export default function WeatherClimate() {
  return (
    <article id="weather" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudSun className="h-5 w-5" /> Weather & Climate
          </CardTitle>
          <CardDescription>
            7‑day forecast and crop impact insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { d: "Mon", t: "31°C", rain: "0.2mm" },
            { d: "Tue", t: "33°C", rain: "—" },
            { d: "Wed", t: "30°C", rain: "1.1mm" },
            { d: "Thu", t: "29°C", rain: "—" },
            { d: "Fri", t: "28°C", rain: "2.0mm" },
            { d: "Sat", t: "30°C", rain: "—" },
            { d: "Sun", t: "31°C", rain: "—" },
          ].map((f) => (
            <div key={f.d} className="rounded-md border p-3 bg-card">
              <div className="text-sm text-muted-foreground">{f.d}</div>
              <div className="text-xl font-semibold">{f.t}</div>
              <div className="text-xs text-muted-foreground">
                Rain: {f.rain}
              </div>
            </div>
          ))}
          <div className="sm:col-span-2 lg:col-span-4 rounded-md border p-4 bg-background">
            <div className="text-sm mb-2">Crop Impact</div>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>Wheat: Irrigate mid‑week; avoid afternoon watering.</li>
              <li>Tomato: Watch for leaf curl after Friday showers.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
