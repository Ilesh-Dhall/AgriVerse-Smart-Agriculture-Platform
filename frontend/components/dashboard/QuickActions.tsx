import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button className="justify-start" variant="secondary">
          Ask AI About My Crops
        </Button>
        <Button className="justify-start" variant="secondary">
          Check Today&apos;s Weather
        </Button>
        <Button className="justify-start" variant="secondary">
          View Market Prices
        </Button>
        <Button className="justify-start" variant="secondary">
          <ImageIcon className="h-4 w-4 mr-2" /> Upload Crop Photo
        </Button>
        <Button className="justify-start">Emergency Crop Issue</Button>
      </CardContent>
    </Card>
  );
}
