"use client";

import { MessageCircleMore, Tractor, User, Users } from "lucide-react";
import { useEffect } from "react";
import { communityPageData as data } from "@/data/data";

export default function CommunityPage() {
  useEffect(() => {
    document.title = "Community & Support — AgriVerse";
  }, []);

  return (
    <div
      className="p-6 flex flex-col gap-6"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <div className="flex items-center gap-2 mb-4 text-lg animate-in slide-in-from-bottom-5 duration-300 fade-in">
        <div className="p-2 rounded-lg bg-green-500/10">
          <Users size={40} className="text-3xl text-green-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Community & Support</span>
          <p className="text-sm">Connect with farmers and experts.</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4 animate-in slide-in-from-bottom-5 duration-300 fade-in">
          <div className="rounded-xl border p-4">
            <div className="flex items-center gap-3 mb-3">
              <User />
              <div className="text-sm font-medium text-muted-foreground">
                Nearby Farmers
              </div>
            </div>
            <div className="text-3xl font-bold text-cyan-600 group-hover:scale-105 transition-transform mb-2">
              {data.nearbyFarmers}
            </div>
            <div className="text-xs text-muted-foreground">
              Active in your {data.nearbyFarmerRadius} radius •{" "}
              {data.nearbyFarmersOnline} online now
            </div>
          </div>

          <div className="rounded-xl border p-4 group">
            <div className="flex items-center gap-3 mb-3">
              <Tractor />
              <div className="text-sm font-medium text-muted-foreground">
                Expert Consultations
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600 transition-transform mb-2">
              {data.expertConsultations} slots
            </div>
            <div className="text-xs text-muted-foreground">
              Available this week • Next: {data.expertConsultationTime}
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-6 animate-in slide-in-from-bottom-5 duration-300 fade-in">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircleMore />
            <div className="text-base font-semibold">
              Recent Community Activity
            </div>
          </div>

          <div className="space-y-3">
            {data.recentActivity.map((activity) => {
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background border"
                >
                  <div
                    className={`w-8 h-8 text-foreground rounded-full flex items-center justify-center text-xs font-medium bg-blue-100 dark:bg-blue-800`}
                  >
                    {activity.userInitials}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {activity.time} • {activity.helpfulCount} farmers found
                      this helpful
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
