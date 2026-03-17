import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="rounded-md border p-3 bg-card">
          Heavy rain expected — plan drainage.
        </div>
        <div className="rounded-md border p-3 bg-card">
          Tomato prices up 15% — good time to sell.
        </div>
        <div className="rounded-md border p-3 bg-card">
          Subsidy deadline in 5 days — submit documents.
        </div>
      </CardContent>
    </Card>
  );
}
