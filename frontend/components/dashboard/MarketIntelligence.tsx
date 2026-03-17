import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LineChart as LineChartIcon } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  Line,
} from "recharts";

const priceData = [
  { day: "Mon", price: 1800 },
  { day: "Tue", price: 1750 },
  { day: "Wed", price: 1900 },
  { day: "Thu", price: 2050 },
  { day: "Fri", price: 1980 },
  { day: "Sat", price: 2100 },
  { day: "Sun", price: 2150 },
];

export default function MarketIntelligence() {
  return (
    <article id="market" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5" /> Market Intelligence
          </CardTitle>
          <CardDescription>
            Current prices and short‑term trends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-md border p-3 bg-card">
              <div className="text-sm text-muted-foreground">Tomato — Pune</div>
              <div className="text-2xl font-semibold">₹ 2,150/q</div>
            </div>
            <div className="rounded-md border p-3 bg-card">
              <div className="text-sm text-muted-foreground">
                Wheat — Nashik
              </div>
              <div className="text-2xl font-semibold">₹ 2,020/q</div>
            </div>
            <div className="rounded-md border p-3 bg-card">
              <div className="text-sm text-muted-foreground">
                Onion — Lasalgaon
              </div>
              <div className="text-2xl font-semibold">₹ 1,850/q</div>
            </div>
          </div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <RechartTooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
