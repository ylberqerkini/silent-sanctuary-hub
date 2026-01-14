import { Clock, Sun, Sunset, Moon, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrayerTimes, PrayerTimes } from '@/hooks/use-prayer-times';

interface PrayerTimesCardProps {
  latitude?: number;
  longitude?: number;
  compact?: boolean;
}

// Default coordinates for Pristina, Kosovo (for Albanian users)
const DEFAULT_LATITUDE = 42.6629;
const DEFAULT_LONGITUDE = 21.1655;

const PRAYER_ICONS: Record<string, React.ReactNode> = {
  Fajr: <Moon className="h-4 w-4" />,
  Sunrise: <Sun className="h-4 w-4" />,
  Dhuhr: <Sun className="h-4 w-4" />,
  Asr: <Sun className="h-4 w-4" />,
  Maghrib: <Sunset className="h-4 w-4" />,
  Isha: <Moon className="h-4 w-4" />,
};

const PRAYER_NAMES_AR: Record<string, string> = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

export function PrayerTimesCard({ latitude, longitude, compact = false }: PrayerTimesCardProps) {
  // Use provided coordinates or fall back to Pristina, Kosovo
  const effectiveLatitude = latitude ?? DEFAULT_LATITUDE;
  const effectiveLongitude = longitude ?? DEFAULT_LONGITUDE;
  
  const { prayerTimes, isLoading, error, nextPrayer, currentPrayer, refetch } = usePrayerTimes(
    effectiveLatitude,
    effectiveLongitude
  );

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-emerald/10 to-gold/5 border-emerald/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-emerald" />
        </CardContent>
      </Card>
    );
  }

  if (error || !prayerTimes) {
    return (
      <Card className="bg-card/80 border-destructive/20">
        <CardContent className="py-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {error || 'Could not load prayer times'}
          </p>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const timings = prayerTimes.timings;
  const hijriDate = prayerTimes.date.hijri;
  const prayerList = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-emerald/10 to-gold/5 border-emerald/20 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald" />
              <span className="text-sm font-medium">Prayer Times</span>
            </div>
            {nextPrayer && (
              <Badge variant="gold" className="text-xs">
                {nextPrayer.name} in {nextPrayer.remainingTime}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {prayerList.filter(p => p !== 'Sunrise').map((prayer) => (
              <div
                key={prayer}
                className={`text-center p-2 rounded-lg ${
                  currentPrayer === prayer
                    ? 'bg-emerald/20 border border-emerald/30'
                    : nextPrayer?.name === prayer
                    ? 'bg-gold/20 border border-gold/30'
                    : 'bg-background/50'
                }`}
              >
                <p className="text-[10px] text-muted-foreground uppercase">{prayer}</p>
                <p className="text-sm font-semibold">{formatTime12h(timings[prayer])}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-emerald/10 to-gold/5 border-emerald/20 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald" />
              Prayer Times
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {hijriDate.day} {hijriDate.month.en} {hijriDate.year} AH
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={refetch} className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        {/* Next Prayer Highlight */}
        {nextPrayer && (
          <div className="mb-4 p-3 rounded-xl bg-emerald/20 border border-emerald/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald uppercase tracking-wider">Next Prayer</p>
                <p className="text-xl font-bold text-emerald">{nextPrayer.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatTime12h(nextPrayer.time)}</p>
                <p className="text-xs text-muted-foreground">in {nextPrayer.remainingTime}</p>
              </div>
            </div>
          </div>
        )}

        {/* All Prayer Times */}
        <div className="space-y-2">
          {prayerList.map((prayer) => {
            const isNext = nextPrayer?.name === prayer;
            const isCurrent = currentPrayer === prayer;
            
            return (
              <div
                key={prayer}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isNext
                    ? 'bg-gold/10 border border-gold/20'
                    : isCurrent
                    ? 'bg-emerald/10 border border-emerald/20'
                    : 'bg-background/30 hover:bg-background/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    isNext ? 'bg-gold/20 text-gold' : isCurrent ? 'bg-emerald/20 text-emerald' : 'bg-muted text-muted-foreground'
                  }`}>
                    {PRAYER_ICONS[prayer]}
                  </div>
                  <div>
                    <p className={`font-medium ${isNext || isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {prayer}
                    </p>
                    <p className="text-xs text-muted-foreground font-arabic">
                      {PRAYER_NAMES_AR[prayer]}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${isNext || isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {formatTime12h(timings[prayer])}
                  </p>
                  {isNext && (
                    <Badge variant="gold" className="text-[10px] mt-1">
                      Up Next
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge variant="approved" className="text-[10px] mt-1">
                      Current
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function formatTime12h(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export default PrayerTimesCard;
