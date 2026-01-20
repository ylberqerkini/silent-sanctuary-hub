import { useState, useEffect } from 'react';
import { Clock, Sun, Sunset, Moon, Loader2, RefreshCw, Sunrise as SunriseIcon, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrayerTimes, PrayerTimes } from '@/hooks/use-prayer-times';
import { useLocationSettings } from '@/hooks/use-location-settings';
import { LocationSelector } from './LocationSelector';
import { cn } from '@/lib/utils';

interface PrayerTimesCardProps {
  latitude?: number;
  longitude?: number;
  compact?: boolean;
}

const PRAYER_ICONS: Record<string, React.ReactNode> = {
  Fajr: <Moon className="h-5 w-5" />,
  Sunrise: <SunriseIcon className="h-5 w-5" />,
  Dhuhr: <Sun className="h-5 w-5" />,
  Asr: <Sun className="h-5 w-5" />,
  Maghrib: <Sunset className="h-5 w-5" />,
  Isha: <Moon className="h-5 w-5" />,
};

const PRAYER_NAMES_AR: Record<string, string> = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

const PRAYER_GRADIENTS: Record<string, string> = {
  Fajr: 'from-indigo-500/20 to-purple-500/20',
  Sunrise: 'from-amber-400/20 to-orange-400/20',
  Dhuhr: 'from-yellow-400/20 to-amber-400/20',
  Asr: 'from-orange-400/20 to-amber-500/20',
  Maghrib: 'from-rose-500/20 to-orange-500/20',
  Isha: 'from-indigo-600/20 to-blue-600/20',
};

export function PrayerTimesCard({ latitude, longitude, compact = false }: PrayerTimesCardProps) {
  const { settings } = useLocationSettings();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Use props coordinates if provided, otherwise use location settings
  const effectiveLatitude = latitude ?? settings.latitude;
  const effectiveLongitude = longitude ?? settings.longitude;
  
  const { prayerTimes, isLoading, error, nextPrayer, currentPrayer, refetch } = usePrayerTimes(
    effectiveLatitude,
    effectiveLongitude
  );

  // Update current time every second for the clock display
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald/5 via-background to-gold/5">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald" />
            <p className="text-sm text-muted-foreground">Loading prayer times...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !prayerTimes) {
    return (
      <Card className="overflow-hidden border-destructive/20 shadow-lg bg-gradient-to-br from-destructive/5 to-background">
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            {error || 'Could not load prayer times'}
          </p>
          <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const timings = prayerTimes.timings;
  const hijriDate = prayerTimes.date.hijri;
  const gregorianDate = prayerTimes.date.gregorian;
  const timezone = prayerTimes.meta.timezone;
  const prayerList = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

  // Format current time
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (compact) {
    return (
      <Card className="overflow-hidden border-0 shadow-xl relative">
        {/* Background gradient based on next prayer */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50",
          nextPrayer ? PRAYER_GRADIENTS[nextPrayer.name] : "from-emerald/10 to-gold/10"
        )} />
        
        <CardContent className="relative p-4">
          {/* Header with location and time */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald/10">
                <Clock className="h-5 w-5 text-emerald" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold">Prayer Times</h3>
                <LocationSelector compact />
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold font-mono tracking-tight">{formattedTime}</p>
              <p className="text-[10px] text-muted-foreground">{timezone.split('/').pop()?.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Next Prayer Highlight */}
          {nextPrayer && (
            <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald/20 via-emerald/15 to-gold/20 border border-emerald/20 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald/30 text-emerald shadow-inner">
                    {PRAYER_ICONS[nextPrayer.name]}
                  </div>
                  <div>
                    <p className="text-xs text-emerald font-medium uppercase tracking-wider">Next Prayer</p>
                    <p className="text-xl font-serif font-bold">{nextPrayer.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold font-mono tracking-tight">{formatTime24h(nextPrayer.time)}</p>
                  <Badge variant="gold" className="text-xs mt-1">
                    in {nextPrayer.remainingTime}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          {/* Prayer Times Grid */}
          <div className="grid grid-cols-3 gap-2">
            {prayerList.filter(p => p !== 'Sunrise').map((prayer) => {
              const isNext = nextPrayer?.name === prayer;
              const isCurrent = currentPrayer === prayer;
              
              return (
                <div
                  key={prayer}
                  className={cn(
                    "relative text-center p-3 rounded-xl transition-all duration-300",
                    isNext
                      ? "bg-gold/20 border-2 border-gold/40 shadow-md scale-105"
                      : isCurrent
                      ? "bg-emerald/20 border-2 border-emerald/40 shadow-md"
                      : "bg-background/60 border border-border/50 hover:bg-background/80"
                  )}
                >
                  <div className={cn(
                    "mx-auto mb-1.5 p-1.5 rounded-lg w-fit",
                    isNext ? "bg-gold/30 text-gold" : isCurrent ? "bg-emerald/30 text-emerald" : "bg-muted text-muted-foreground"
                  )}>
                    {PRAYER_ICONS[prayer]}
                  </div>
                  <p className={cn(
                    "text-[11px] font-medium uppercase tracking-wide",
                    isNext || isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {prayer}
                  </p>
                  <p className={cn(
                    "text-lg font-bold font-mono",
                    isNext ? "text-gold" : isCurrent ? "text-emerald" : "text-foreground"
                  )}>
                    {formatTime24h(timings[prayer])}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full card view
  return (
    <Card className="overflow-hidden border-0 shadow-2xl relative">
      {/* Dynamic background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-40",
        nextPrayer ? PRAYER_GRADIENTS[nextPrayer.name] : "from-emerald/10 to-gold/10"
      )} />
      <div className="absolute inset-0 islamic-pattern opacity-5" />
      
      <CardContent className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-emerald/15 shadow-inner">
                <Clock className="h-6 w-6 text-emerald" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">Prayer Times</h2>
                <LocationSelector compact />
              </div>
            </div>
            {/* Hijri Date */}
            <div className="flex items-center gap-2 mt-3 ml-1">
              <p className="text-sm text-muted-foreground">
                {hijriDate.day} {hijriDate.month.en} {hijriDate.year} AH
              </p>
              <span className="text-muted-foreground/50">•</span>
              <p className="text-xs text-muted-foreground font-arabic">
                {hijriDate.month.ar}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold font-mono tracking-tight">{formattedTime}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {gregorianDate.day} {gregorianDate.month.en} {gregorianDate.year}
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">
              {timezone.split('/').pop()?.replace('_', ' ')} Time
            </p>
          </div>
        </div>

        {/* Next Prayer Hero Section */}
        {nextPrayer && (
          <div className="mb-5 p-5 rounded-2xl bg-gradient-to-r from-emerald/25 via-emerald/20 to-gold/25 border border-emerald/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/20 to-transparent rounded-bl-full" />
            
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-emerald/30 text-emerald shadow-lg">
                  {PRAYER_ICONS[nextPrayer.name]}
                </div>
                <div>
                  <p className="text-xs text-emerald font-semibold uppercase tracking-widest">Next Prayer</p>
                  <p className="text-2xl font-serif font-bold mt-0.5">{nextPrayer.name}</p>
                  <p className="text-xs text-muted-foreground font-arabic mt-1">
                    {PRAYER_NAMES_AR[nextPrayer.name]}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold font-mono tracking-tight">{formatTime24h(nextPrayer.time)}</p>
                <Badge variant="gold" className="text-sm mt-2 px-3 py-1">
                  {nextPrayer.remainingTime}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* All Prayer Times */}
        <div className="space-y-2.5">
          {prayerList.map((prayer) => {
            const isNext = nextPrayer?.name === prayer;
            const isCurrent = currentPrayer === prayer;
            
            return (
              <div
                key={prayer}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl transition-all duration-300",
                  isNext
                    ? "bg-gradient-to-r from-gold/15 to-gold/10 border-2 border-gold/30 shadow-lg"
                    : isCurrent
                    ? "bg-gradient-to-r from-emerald/15 to-emerald/10 border-2 border-emerald/30 shadow-lg"
                    : "bg-background/50 border border-border/40 hover:bg-background/70"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl shadow-sm",
                    isNext 
                      ? "bg-gold/25 text-gold" 
                      : isCurrent 
                      ? "bg-emerald/25 text-emerald" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {PRAYER_ICONS[prayer]}
                  </div>
                  <div>
                    <p className={cn(
                      "font-semibold text-base",
                      isNext ? "text-gold" : isCurrent ? "text-emerald" : "text-foreground"
                    )}>
                      {prayer}
                    </p>
                    <p className="text-xs text-muted-foreground font-arabic">
                      {PRAYER_NAMES_AR[prayer]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className={cn(
                    "text-xl font-bold font-mono",
                    isNext ? "text-gold" : isCurrent ? "text-emerald" : "text-foreground"
                  )}>
                    {formatTime24h(timings[prayer])}
                  </p>
                  {isNext && (
                    <Badge variant="gold" className="text-[10px]">
                      Next
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge variant="approved" className="text-[10px]">
                      Now
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Refresh Button */}
        <div className="mt-4 flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refetch}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Times
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function formatTime24h(time: string): string {
  const timePart = time.split(' ')[0];
  return timePart;
}

export default PrayerTimesCard;
