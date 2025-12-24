import { useEffect } from 'react';
import { Bell, BellOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePushNotifications } from '@/hooks/use-push-notifications';

interface PushNotificationSetupProps {
  compact?: boolean;
}

export function PushNotificationSetup({ compact = false }: PushNotificationSetupProps) {
  const { 
    isSupported, 
    isRegistered, 
    permissionStatus, 
    registerForPush 
  } = usePushNotifications();

  // Auto-register on mount if not already registered
  useEffect(() => {
    if (isSupported && !isRegistered && permissionStatus === 'prompt') {
      // Don't auto-request, let user initiate
    }
  }, [isSupported, isRegistered, permissionStatus]);

  if (compact) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isRegistered ? (
            <CheckCircle className="h-5 w-5 text-emerald" />
          ) : permissionStatus === 'denied' ? (
            <BellOff className="h-5 w-5 text-destructive" />
          ) : (
            <Bell className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium">Push Notifications</p>
            <p className="text-xs text-muted-foreground">
              {isRegistered 
                ? 'Enabled - You\'ll receive mosque alerts' 
                : permissionStatus === 'denied'
                ? 'Denied - Enable in device settings'
                : 'Enable to receive mosque detection alerts'
              }
            </p>
          </div>
        </div>
        {!isRegistered && permissionStatus !== 'denied' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={registerForPush}
          >
            Enable
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-emerald/30 bg-gradient-to-br from-emerald/10 to-emerald/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
            isRegistered 
              ? 'bg-emerald/20' 
              : permissionStatus === 'denied'
              ? 'bg-destructive/20'
              : 'bg-muted'
          }`}>
            {isRegistered ? (
              <Bell className="h-6 w-6 text-emerald" />
            ) : permissionStatus === 'denied' ? (
              <BellOff className="h-6 w-6 text-destructive" />
            ) : (
              <Bell className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">
              {isRegistered 
                ? 'Mosque Alerts Enabled' 
                : 'Enable Mosque Alerts'
              }
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {isRegistered 
                ? 'You\'ll be notified when entering a mosque and your phone will be silenced automatically.'
                : permissionStatus === 'denied'
                ? 'Permission denied. Please enable notifications in your device settings.'
                : 'Get notified when you enter a mosque so your phone can be silenced automatically.'
              }
            </p>
            {!isRegistered && permissionStatus !== 'denied' && (
              <Button 
                variant="islamic" 
                size="sm" 
                className="mt-3"
                onClick={registerForPush}
              >
                <Bell className="mr-2 h-4 w-4" />
                Enable Notifications
              </Button>
            )}
            {isRegistered && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald">
                <CheckCircle className="h-4 w-4" />
                <span>Connected and ready for mosque detection</span>
              </div>
            )}
            {permissionStatus === 'denied' && (
              <div className="mt-3 flex items-center gap-2 text-xs text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Open device settings to enable notifications</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
