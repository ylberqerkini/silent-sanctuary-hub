import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export function useNotificationHistory() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notification_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data || []);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [user]);

  // Add a notification
  const addNotification = useCallback(async (
    title: string, 
    message: string, 
    type: string = 'general'
  ) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notification_history')
      .insert({
        user_id: user.id,
        title,
        message,
        type,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding notification:', error);
    } else if (data) {
      setNotifications(prev => [data, ...prev]);
    }
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('notification_history')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error marking notification as read:', error);
    } else {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    }
  }, [user]);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('notification_history')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing notifications:', error);
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    unreadCount,
    addNotification,
    markAsRead,
    clearAll,
  };
}
