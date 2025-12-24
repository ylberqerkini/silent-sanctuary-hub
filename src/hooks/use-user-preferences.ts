import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export interface UserPreferences {
  auto_silent: boolean;
  detection_alerts: boolean;
  streak_reminders: boolean;
  prayer_reminders: boolean;
  vibrate: boolean;
  push_token: string | null;
}

const defaultPreferences: UserPreferences = {
  auto_silent: true,
  detection_alerts: true,
  streak_reminders: true,
  prayer_reminders: false,
  vibrate: true,
  push_token: null,
};

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  // Fetch preferences
  useEffect(() => {
    if (!user) {
      setPreferences(defaultPreferences);
      setLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching preferences:', error);
        toast.error('Failed to load preferences');
      } else if (data) {
        setPreferences({
          auto_silent: data.auto_silent,
          detection_alerts: data.detection_alerts,
          streak_reminders: data.streak_reminders,
          prayer_reminders: data.prayer_reminders,
          vibrate: data.vibrate,
          push_token: data.push_token,
        });
      }
      setLoading(false);
    };

    fetchPreferences();
  }, [user]);

  // Update preferences
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!user) {
      // Update local state only for non-authenticated users
      setPreferences(prev => ({ ...prev, ...updates }));
      return;
    }

    const { error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to save preferences');
    } else {
      setPreferences(prev => ({ ...prev, ...updates }));
    }
  }, [user]);

  // Toggle a preference
  const togglePreference = useCallback((key: keyof Omit<UserPreferences, 'push_token'>) => {
    updatePreferences({ [key]: !preferences[key] });
  }, [preferences, updatePreferences]);

  // Save push token
  const savePushToken = useCallback(async (token: string) => {
    await updatePreferences({ push_token: token });
  }, [updatePreferences]);

  return {
    preferences,
    loading,
    updatePreferences,
    togglePreference,
    savePushToken,
  };
}
