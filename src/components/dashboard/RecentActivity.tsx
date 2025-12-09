import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Lightbulb, User } from "lucide-react";

interface Activity {
  id: string;
  type: "mosque" | "donation" | "idea" | "user";
  title: string;
  description: string;
  time: string;
  status?: "pending" | "approved" | "rejected";
}

const activities: Activity[] = [
  {
    id: "1",
    type: "mosque",
    title: "New Mosque Submission",
    description: "Masjid Al-Nur submitted by @user_1234",
    time: "2 minutes ago",
    status: "pending",
  },
  {
    id: "2",
    type: "donation",
    title: "New Donation",
    description: "$50.00 from Anonymous Donor",
    time: "15 minutes ago",
  },
  {
    id: "3",
    type: "idea",
    title: "New Feature Idea",
    description: "Qibla Direction Compass requested",
    time: "1 hour ago",
    status: "pending",
  },
  {
    id: "4",
    type: "user",
    title: "New User Registration",
    description: "ahmed.hassan@email.com joined",
    time: "2 hours ago",
  },
  {
    id: "5",
    type: "mosque",
    title: "Mosque Approved",
    description: "Islamic Center of Peace is now live",
    time: "3 hours ago",
    status: "approved",
  },
];

const typeIcons = {
  mosque: MapPin,
  donation: DollarSign,
  idea: Lightbulb,
  user: User,
};

const typeColors = {
  mosque: "bg-primary/15 text-primary",
  donation: "bg-gold/15 text-gold-dark",
  idea: "bg-accent/15 text-accent",
  user: "bg-success/15 text-success",
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
        Recent Activity
      </h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = typeIcons[activity.type];
          
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeColors[activity.type]}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  {activity.status && (
                    <Badge variant={activity.status}>{activity.status}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground/70">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
