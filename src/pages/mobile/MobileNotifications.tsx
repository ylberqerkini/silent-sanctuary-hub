import { Bell, Volume2, VolumeX, Smartphone, Clock, Check, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PushNotificationSetup } from "@/components/mobile/PushNotificationSetup";
import { usePushNotifications } from "@/hooks/use-push-notifications";
const recentNotifications = [
  {
    id: 1,
    title: "Masjid Al-Noor Detected",
    message: "Your phone was silenced. May your prayers be accepted.",
    time: "2 hours ago",
    type: "detection",
  },
  {
    id: 2,
    title: "Streak Milestone! 🔥",
    message: "You've reached a 10-day streak! Keep it up!",
    time: "Yesterday",
    type: "streak",
  },
  {
    id: 3,
    title: "Jummah Reminder",
    message: "Don't forget Jummah prayer at Islamic Center at 1:00 PM",
    time: "2 days ago",
    type: "reminder",
  },
];

export default function MobileNotifications() {
  const { notifications: pushNotifications, clearNotifications, sendLocalMosqueAlert } = usePushNotifications();
  
  const [settings, setSettings] = useState({
    autoSilent: true,
    detectionAlerts: true,
    streakReminders: true,
    prayerReminders: false,
    vibrate: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  
  // Combine mock notifications with real push notifications
  const allNotifications = [
    ...pushNotifications.map(n => ({
      id: parseInt(n.id) || Date.now(),
      title: n.title,
      message: n.body,
      time: getRelativeTime(n.receivedAt),
      type: n.type,
    })),
    ...recentNotifications,
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Notifications
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage alerts and silent mode
        </p>
      </div>

      {/* Push Notification Setup */}
      <PushNotificationSetup />

      {/* Test Notification Button (for demo) */}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={() => sendLocalMosqueAlert('Masjid Al-Noor')}
      >
        <Bell className="mr-2 h-4 w-4" />
        Test Mosque Detection Alert
      </Button>

      {/* Auto Silent Mode Card */}
      <Card className="border-emerald/30 bg-gradient-to-br from-emerald/10 to-emerald/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald/20">
                <VolumeX className="h-6 w-6 text-emerald" />
              </div>
              <div>
                <h3 className="font-medium">Auto Silent Mode</h3>
                <p className="text-xs text-muted-foreground">
                  Automatically silence when entering a mosque
                </p>
              </div>
            </div>
            <Switch
              checked={settings.autoSilent}
              onCheckedChange={() => toggleSetting("autoSilent")}
            />
          </div>
          {settings.autoSilent && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald/10 p-2 text-xs text-emerald">
              <Check className="h-4 w-4" />
              <span>Your phone will silence automatically in mosques</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Alert Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Detection Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Get notified when entering a mosque
                </p>
              </div>
            </div>
            <Switch
              checked={settings.detectionAlerts}
              onCheckedChange={() => toggleSetting("detectionAlerts")}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Streak Reminders</p>
                <p className="text-xs text-muted-foreground">
                  Daily reminders to maintain your streak
                </p>
              </div>
            </div>
            <Switch
              checked={settings.streakReminders}
              onCheckedChange={() => toggleSetting("streakReminders")}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Prayer Reminders</p>
                <p className="text-xs text-muted-foreground">
                  Get notified before prayer times
                </p>
              </div>
            </div>
            <Switch
              checked={settings.prayerReminders}
              onCheckedChange={() => toggleSetting("prayerReminders")}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Vibration</p>
                <p className="text-xs text-muted-foreground">
                  Vibrate when silencing phone
                </p>
              </div>
            </div>
            <Switch
              checked={settings.vibrate}
              onCheckedChange={() => toggleSetting("vibrate")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent</CardTitle>
            {allNotifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearNotifications}
                className="h-8 px-2 text-muted-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {allNotifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            allNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 rounded-lg bg-muted/30 p-3"
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                    notification.type === "detection"
                      ? "bg-emerald/20"
                      : notification.type === "streak"
                      ? "bg-gold/20"
                      : "bg-primary/20"
                  }`}
                >
                  {notification.type === "detection" ? (
                    <VolumeX className="h-4 w-4 text-emerald" />
                  ) : notification.type === "streak" ? (
                    <span className="text-sm">🔥</span>
                  ) : (
                    <Bell className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}
