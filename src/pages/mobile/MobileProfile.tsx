import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Flame,
  MapPin,
  Calendar,
  ChevronRight,
  LogOut,
  Moon,
  Bell,
  Shield,
  HelpCircle,
  Heart,
  LogIn,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useUserStreaks } from "@/hooks/use-user-streaks";
import { toast } from "sonner";

const menuItems = [
  {
    label: "Notification Settings",
    icon: Bell,
    route: "/mobile/notifications",
  },
  {
    label: "Auto Silent Mode",
    icon: Moon,
    route: "/mobile/notifications",
  },
  {
    label: "Donation History",
    icon: Heart,
    route: "/mobile/donate",
  },
  {
    label: "Privacy & Security",
    icon: Shield,
    route: "#",
  },
  {
    label: "Help & Support",
    icon: HelpCircle,
    route: "#",
  },
];

const streakHistory = [
  { day: "Mon", active: true },
  { day: "Tue", active: true },
  { day: "Wed", active: true },
  { day: "Thu", active: false },
  { day: "Fri", active: true },
  { day: "Sat", active: true },
  { day: "Sun", active: true },
];

export default function MobileProfile() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { streak, loading: streakLoading } = useUserStreaks();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/mobile/auth');
  };

  const stats = [
    { label: "Current Streak", value: streak.current_streak.toString(), icon: Flame, color: "text-gold" },
    { label: "Longest Streak", value: streak.longest_streak.toString(), icon: MapPin, color: "text-emerald" },
    { label: "Weekly Visits", value: streak.weekly_visits.toString(), icon: Calendar, color: "text-primary" },
  ];

  // Guest mode
  if (!user) {
    return (
      <div className="space-y-6">
        {/* Guest Header */}
        <Card className="border-none bg-gradient-to-br from-emerald/20 to-emerald/5">
          <CardContent className="p-6 text-center">
            <Avatar className="mx-auto h-20 w-20 border-4 border-emerald/20">
              <AvatarFallback className="bg-muted text-xl">
                <User className="h-8 w-8 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 font-serif text-xl font-bold">Guest User</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to sync your data across devices
            </p>
            <Button 
              variant="islamic" 
              className="mt-4"
              onClick={() => navigate('/mobile/auth')}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In or Create Account
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground">
          Silent Masjid v1.0.0
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-none bg-gradient-to-br from-emerald/20 to-emerald/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-emerald/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-emerald text-xl text-white">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-serif text-xl font-bold">
                {user.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
              <Badge variant="gold" className="mt-2">
                <Flame className="mr-1 h-3 w-3" />
                {streak.current_streak} Day Streak
              </Badge>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex flex-col items-center p-4 text-center">
              <stat.icon className={`mb-1 h-5 w-5 ${stat.color}`} />
              <p className="font-serif text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Streak */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">This Week</h3>
            <Badge variant="secondary">{streak.weekly_visits}/{streak.weekly_goal} visits</Badge>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {streakHistory.map((day) => (
              <div key={day.day} className="text-center">
                <div
                  className={`mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full ${
                    day.active
                      ? "bg-emerald text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day.active ? (
                    <Flame className="h-5 w-5" />
                  ) : (
                    <span className="text-lg">·</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <Card>
        <CardContent className="p-0">
          {menuItems.map((item, index) => (
            <div key={item.label}>
              <button 
                className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50"
                onClick={() => navigate(item.route)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              {index < menuItems.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Logout */}
      <Button 
        variant="outline" 
        className="w-full text-destructive"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>

      {/* App Version */}
      <p className="text-center text-xs text-muted-foreground">
        Silent Masjid v1.0.0
      </p>
    </div>
  );
}
