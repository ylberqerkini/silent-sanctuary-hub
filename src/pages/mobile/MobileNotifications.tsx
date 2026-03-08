import { Bell, Volume2, VolumeX, Smartphone, Clock, Check, Trash2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PushNotificationSetup } from "@/components/mobile/PushNotificationSetup";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useUserPreferences } from "@/hooks/use-user-preferences";
import { useGeofencing } from "@/hooks/use-geofencing";
import { useLanguage } from "@/hooks/use-language";

export default function MobileNotifications() {
  const { notifications: pushNotifications, clearNotifications, sendLocalMosqueAlert } = usePushNotifications();
  const { preferences, togglePreference, loading: preferencesLoading } = useUserPreferences();
  const { isAutoSilentActive, insideMosque, isTracking } = useGeofencing();
  const { t } = useLanguage();

  const allNotifications = pushNotifications.map(n => ({
    id: parseInt(n.id) || Date.now(),
    title: n.title,
    message: n.body,
    time: getRelativeTime(n.receivedAt, t),
    type: n.type,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          {t('notifications')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('manageAlertsAndSilent')}
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
        {t('testMosqueAlert')}
      </Button>

      {/* Auto Silent Mode Card */}
      <Card className={`border-emerald/30 ${isAutoSilentActive ? 'bg-gradient-to-br from-emerald/20 to-emerald/10 ring-2 ring-emerald/50' : 'bg-gradient-to-br from-emerald/10 to-emerald/5'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isAutoSilentActive ? 'bg-emerald animate-pulse' : 'bg-emerald/20'}`}>
                <VolumeX className={`h-6 w-6 ${isAutoSilentActive ? 'text-white' : 'text-emerald'}`} />
              </div>
              <div>
                <h3 className="font-medium">{t('autoSilentMode')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('autoSilentModeDesc')}
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.auto_silent}
              onCheckedChange={() => togglePreference("auto_silent")}
              disabled={preferencesLoading}
            />
          </div>
          
          {isAutoSilentActive && insideMosque && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald p-3 text-sm text-white">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{t('currentlyAtMosque')} {insideMosque.name} - {t('silentModeActive')}</span>
            </div>
          )}
          
          {preferences.auto_silent && !isAutoSilentActive && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald/10 p-2 text-xs text-emerald">
              <Check className="h-4 w-4" />
              <span>
                {isTracking 
                  ? t('monitoringMosques')
                  : t('enableTrackingToDetect')
                }
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('alertSettings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('detectionAlerts')}</p>
                <p className="text-xs text-muted-foreground">{t('detectionAlertsDesc')}</p>
              </div>
            </div>
            <Switch
              checked={preferences.detection_alerts}
              onCheckedChange={() => togglePreference("detection_alerts")}
              disabled={preferencesLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('streakReminders')}</p>
                <p className="text-xs text-muted-foreground">{t('streakRemindersDesc')}</p>
              </div>
            </div>
            <Switch
              checked={preferences.streak_reminders}
              onCheckedChange={() => togglePreference("streak_reminders")}
              disabled={preferencesLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('prayerReminders')}</p>
                <p className="text-xs text-muted-foreground">{t('prayerRemindersDesc')}</p>
              </div>
            </div>
            <Switch
              checked={preferences.prayer_reminders}
              onCheckedChange={() => togglePreference("prayer_reminders")}
              disabled={preferencesLoading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('vibration')}</p>
                <p className="text-xs text-muted-foreground">{t('vibrationDesc')}</p>
              </div>
            </div>
            <Switch
              checked={preferences.vibrate}
              onCheckedChange={() => togglePreference("vibrate")}
              disabled={preferencesLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t('recentNotifications')}</CardTitle>
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
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">{t('noNotifications')}</p>
            </div>
          ) : (
            allNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 rounded-xl bg-muted/30 p-3"
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

function getRelativeTime(date: Date, t: (key: string) => string): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return t('justNow');
  if (diffMins < 60) return `${diffMins} ${t('minAgo')}`;
  if (diffHours < 24) return `${diffHours} ${diffHours > 1 ? t('hoursAgo') : t('hourAgo')}`;
  if (diffDays === 1) return t('yesterday');
  return `${diffDays} ${t('daysAgo')}`;
}