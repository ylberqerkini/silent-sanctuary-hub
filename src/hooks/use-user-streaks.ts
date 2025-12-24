import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_visit_date: string | null;
  weekly_visits: number;
  weekly_goal: number;
}

const defaultStreak: UserStreak = {
  current_streak: 0,
  longest_streak: 0,
  last_visit_date: null,
  weekly_visits: 0,
  weekly_goal: 21,
};

export function useUserStreaks() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<UserStreak>(defaultStreak);
  const [loading, setLoading] = useState(true);

  // Fetch streak data
  useEffect(() => {
    if (!user) {
      setStreak(defaultStreak);
      setLoading(false);
      return;
    }

    const fetchStreak = async () => {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching streak:', error);
      } else if (data) {
        setStreak({
          current_streak: data.current_streak,
          longest_streak: data.longest_streak,
          last_visit_date: data.last_visit_date,
          weekly_visits: data.weekly_visits,
          weekly_goal: data.weekly_goal,
        });
      }
      setLoading(false);
    };

    fetchStreak();
  }, [user]);

  // Record a mosque visit (updates streak)
  const recordVisit = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Check if already visited today
    if (streak.last_visit_date === today) {
      return; // Already recorded today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Calculate new streak
    let newCurrentStreak = 1;
    if (streak.last_visit_date === yesterdayStr) {
      // Continuing streak
      newCurrentStreak = streak.current_streak + 1;
    }

    const newLongestStreak = Math.max(newCurrentStreak, streak.longest_streak);
    const newWeeklyVisits = streak.weekly_visits + 1;

    const { error } = await supabase
      .from('user_streaks')
      .update({
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_visit_date: today,
        weekly_visits: newWeeklyVisits,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error recording visit:', error);
    } else {
      setStreak({
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_visit_date: today,
        weekly_visits: newWeeklyVisits,
        weekly_goal: streak.weekly_goal,
      });
    }
  }, [user, streak]);

  // Update weekly goal
  const updateWeeklyGoal = useCallback(async (goal: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_streaks')
      .update({ weekly_goal: goal })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating goal:', error);
    } else {
      setStreak(prev => ({ ...prev, weekly_goal: goal }));
    }
  }, [user]);

  return {
    streak,
    loading,
    recordVisit,
    updateWeeklyGoal,
  };
}
