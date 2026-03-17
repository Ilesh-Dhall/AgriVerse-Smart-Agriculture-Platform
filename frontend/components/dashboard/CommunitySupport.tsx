import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CommunitySupport() {
  return (
    <article id="community" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Community & Support
          </CardTitle>
          <CardDescription>Connect with farmers and experts.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-md border p-3 bg-card">
            Nearby Farmers — 12
          </div>
          <div className="rounded-md border p-3 bg-card">
            Expert Consultations — slots this week
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
