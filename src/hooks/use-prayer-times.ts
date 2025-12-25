import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerTimesData {
  timings: PrayerTimes;
  date: {
    readable: string;
    hijri: {
      date: string;
      month: { en: string; ar: string };
      year: string;
      day: string;
    };
    gregorian: {
      date: string;
      day: string;
      month: { en: string };
      year: string;
    };
  };
  meta: {
    timezone: string;
    method: { name: string };
  };
}

interface UsePrayerTimesResult {
  prayerTimes: PrayerTimesData | null;
  isLoading: boolean;
  error: string | null;
  nextPrayer: { name: string; time: string; remainingTime: string } | null;
  currentPrayer: string | null;
  refetch: () => void;
}

const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export function usePrayerTimes(
  latitude?: number,
  longitude?: number,
  method: number = 2 // ISNA method as default
): UsePrayerTimesResult {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; remainingTime: string } | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);

  const fetchPrayerTimes = useCallback(async () => {
    if (!latitude || !longitude) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const today = format(new Date(), 'dd-MM-yyyy');
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${today}?latitude=${latitude}&longitude=${longitude}&method=${method}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }

      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        setPrayerTimes(data.data);
      } else {
        throw new Error('Invalid response from prayer times API');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prayer times');
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, method]);

  // Calculate next prayer
  useEffect(() => {
    if (!prayerTimes) return;

    const calculateNextPrayer = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const prayers = PRAYER_ORDER.map((name) => {
        const timeStr = prayerTimes.timings[name as keyof PrayerTimes];
        const [hours, minutes] = timeStr.split(':').map(Number);
        return { name, time: timeStr, totalMinutes: hours * 60 + minutes };
      });

      // Find current and next prayer
      let foundCurrent: string | null = null;
      let foundNext: { name: string; time: string; remainingTime: string } | null = null;

      for (let i = 0; i < prayers.length; i++) {
        const prayer = prayers[i];
        const nextIdx = i + 1;

        if (currentTime < prayer.totalMinutes) {
          // This prayer hasn't happened yet - it's the next one
          const diffMinutes = prayer.totalMinutes - currentTime;
          const hours = Math.floor(diffMinutes / 60);
          const mins = diffMinutes % 60;
          foundNext = {
            name: prayer.name,
            time: prayer.time,
            remainingTime: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
          };
          // Current prayer is the previous one
          if (i > 0) {
            foundCurrent = prayers[i - 1].name;
          }
          break;
        }
      }

      // If no next prayer found today, the next is Fajr tomorrow
      if (!foundNext) {
        const fajrTime = prayers[0];
        const minsUntilMidnight = 24 * 60 - currentTime;
        const totalMins = minsUntilMidnight + fajrTime.totalMinutes;
        const hours = Math.floor(totalMins / 60);
        const mins = totalMins % 60;
        foundNext = {
          name: 'Fajr',
          time: fajrTime.time,
          remainingTime: `${hours}h ${mins}m`
        };
        foundCurrent = 'Isha';
      }

      setNextPrayer(foundNext);
      setCurrentPrayer(foundCurrent);
    };

    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [prayerTimes]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  return {
    prayerTimes,
    isLoading,
    error,
    nextPrayer,
    currentPrayer,
    refetch: fetchPrayerTimes
  };
}

// Calculation methods for reference
export const CALCULATION_METHODS = [
  { id: 0, name: 'Shia Ithna-Ashari' },
  { id: 1, name: 'University of Islamic Sciences, Karachi' },
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 3, name: 'Muslim World League' },
  { id: 4, name: 'Umm Al-Qura University, Makkah' },
  { id: 5, name: 'Egyptian General Authority of Survey' },
  { id: 7, name: 'Institute of Geophysics, University of Tehran' },
  { id: 8, name: 'Gulf Region' },
  { id: 9, name: 'Kuwait' },
  { id: 10, name: 'Qatar' },
  { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore' },
  { id: 12, name: 'Union Organization Islamic de France' },
  { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey' },
  { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
  { id: 15, name: 'Moonsighting Committee Worldwide' },
];
