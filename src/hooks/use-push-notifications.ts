import { useEffect, useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { 
  PushNotifications, 
  PushNotificationSchema, 
  Token, 
  ActionPerformed 
} from '@capacitor/push-notifications';
import { toast } from 'sonner';

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  receivedAt: Date;
  type: 'detection' | 'streak' | 'reminder' | 'general';
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  // Check if running on native platform
  useEffect(() => {
    const checkSupport = () => {
      const supported = Capacitor.isNativePlatform();
      setIsSupported(supported);
      return supported;
    };
    
    checkSupport();
  }, []);

  // Request permission and register for push notifications
  const registerForPush = useCallback(async () => {
    if (!isSupported) {
      console.log('Push notifications not supported on web');
      toast.info('Push notifications are only available in the native app');
      return false;
    }

    try {
      // Check current permission status
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        // Request permission
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        setPermissionStatus('denied');
        toast.error('Push notification permission denied');
        return false;
      }

      setPermissionStatus('granted');

      // Register with the platform
      await PushNotifications.register();
      setIsRegistered(true);
      
      return true;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      toast.error('Failed to register for push notifications');
      return false;
    }
  }, [isSupported]);

  // Set up listeners
  useEffect(() => {
    if (!isSupported) return;

    // On success, we should be able to receive notifications
    const tokenListener = PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token:', token.value);
      setToken(token.value);
      setIsRegistered(true);
      toast.success('Push notifications enabled');
    });

    // Some error during registration
    const errorListener = PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
      toast.error('Failed to register for notifications');
    });

    // When a notification is received while app is in foreground
    const foregroundListener = PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push notification received:', notification);
        
        const newNotification: NotificationData = {
          id: notification.id || Date.now().toString(),
          title: notification.title || 'Notification',
          body: notification.body || '',
          data: notification.data,
          receivedAt: new Date(),
          type: (notification.data?.type as NotificationData['type']) || 'general',
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        // Show toast for mosque detection alerts
        if (notification.data?.type === 'detection') {
          toast.success(notification.title || 'Mosque Detected', {
            description: notification.body,
            icon: '🕌',
          });
        } else {
          toast(notification.title || 'Notification', {
            description: notification.body,
          });
        }
      }
    );

    // When user taps on a notification
    const tapListener = PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push notification action performed:', notification);
        
        // Handle navigation based on notification type
        const type = notification.notification.data?.type;
        if (type === 'detection') {
          // Could navigate to mosques page
          window.location.href = '/mobile/mosques';
        } else if (type === 'streak') {
          // Navigate to profile
          window.location.href = '/mobile/profile';
        }
      }
    );

    // Cleanup listeners on unmount
    return () => {
      tokenListener.then(l => l.remove());
      errorListener.then(l => l.remove());
      foregroundListener.then(l => l.remove());
      tapListener.then(l => l.remove());
    };
  }, [isSupported]);

  // Send a local notification (for testing/demo purposes)
  const sendLocalMosqueAlert = useCallback(async (mosqueName: string) => {
    if (!isSupported) {
      // Simulate notification on web for testing
      toast.success(`Mosque Detected: ${mosqueName}`, {
        description: 'Your phone has been silenced. May your prayers be accepted.',
        icon: '🕌',
        duration: 5000,
      });
      
      setNotifications(prev => [{
        id: Date.now().toString(),
        title: `${mosqueName} Detected`,
        body: 'Your phone has been silenced. May your prayers be accepted.',
        receivedAt: new Date(),
        type: 'detection',
      }, ...prev]);
      
      return;
    }

    try {
      await PushNotifications.createChannel({
        id: 'mosque-detection',
        name: 'Mosque Detection',
        description: 'Alerts when entering a mosque',
        importance: 5,
        visibility: 1,
        vibration: true,
      });

      // Note: Local notifications would require @capacitor/local-notifications
      // This is for remote push notifications
      console.log('Would send local notification for:', mosqueName);
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }, [isSupported]);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    if (isSupported) {
      PushNotifications.removeAllDeliveredNotifications();
    }
  }, [isSupported]);

  return {
    isSupported,
    isRegistered,
    token,
    permissionStatus,
    notifications,
    registerForPush,
    sendLocalMosqueAlert,
    clearNotifications,
  };
}
