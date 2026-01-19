import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Check, 
  X, 
  Calendar, 
  Moon, 
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRamadan, RamadanDay } from "@/hooks/use-ramadan";
import { format, isSameDay } from "date-fns";
import { useLanguage } from "@/hooks/use-language";

interface RamadanCalendarProps {
  onDaySelect?: (day: RamadanDay) => void;
}

export function RamadanCalendar({ onDaySelect }: RamadanCalendarProps) {
  const { t } = useLanguage();
  const { 
    progress, 
    isRamadan, 
    currentRamadanDay, 
    daysUntilRamadan,
    toggleFast 
  } = useRamadan();
  
  const [selectedDay, setSelectedDay] = useState<number | null>(currentRamadanDay || 1);
  const [viewWeek, setViewWeek] = useState(0); // 0-4 for weeks of Ramadan

  if (!progress) return null;

  const totalFasted = progress.days.filter(d => d.isFasted).length;
  const progressPercent = (totalFasted / 30) * 100;

  // Get days for current view (show 7 days at a time)
  const startIdx = viewWeek * 7;
  const visibleDays = progress.days.slice(startIdx, startIdx + 7);
  const today = new Date();

  const handleDayClick = (day: RamadanDay) => {
    setSelectedDay(day.day);
    onDaySelect?.(day);
  };

  const selectedDayData = progress.days.find(d => d.day === selectedDay);

  return (
    <div className="space-y-4">
      {/* Countdown or Current Day */}
      {!isRamadan && daysUntilRamadan > 0 && (
        <Card className="bg-gradient-to-br from-emerald/20 to-gold/10 border-emerald/30">
          <CardContent className="p-4 text-center">
            <Moon className="h-8 w-8 text-gold mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {t("ramadanStartsIn") || "Ramadan starts in"}
            </p>
            <p className="text-3xl font-bold text-emerald">
              {daysUntilRamadan} {t("days") || "days"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      <Card className="border-emerald/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald" />
              {t("fastingProgress") || "Fasting Progress"}
            </span>
            <Badge variant="outline" className="bg-emerald/10 text-emerald border-emerald/30">
              {totalFasted}/30
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={progressPercent} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(progressPercent)}% {t("completed") || "completed"}</span>
            <span>{30 - totalFasted} {t("remaining") || "remaining"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewWeek(Math.max(0, viewWeek - 1))}
          disabled={viewWeek === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {t("week") || "Week"} {viewWeek + 1} {t("of") || "of"} 5
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewWeek(Math.min(4, viewWeek + 1))}
          disabled={viewWeek === 4}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {visibleDays.map((day) => {
          const isToday = isSameDay(day.gregorianDate, today);
          const isSelected = selectedDay === day.day;
          const isPast = day.gregorianDate < today;
          
          return (
            <button
              key={day.day}
              onClick={() => handleDayClick(day)}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-lg transition-all aspect-square",
                "border-2",
                isSelected 
                  ? "border-emerald bg-emerald/10" 
                  : "border-transparent",
                isToday && !isSelected && "border-gold/50 bg-gold/5",
                day.isFasted && "bg-emerald/20",
                !day.isFasted && isPast && "bg-muted/30 opacity-60"
              )}
            >
              <span className={cn(
                "text-lg font-semibold",
                day.isFasted && "text-emerald",
                isToday && "text-gold"
              )}>
                {day.day}
              </span>
              
              {day.isFasted && (
                <Check className="h-3 w-3 text-emerald absolute bottom-1" />
              )}
              
              {isToday && (
                <div className="absolute -top-1 -right-1">
                  <Star className="h-3 w-3 text-gold fill-gold" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Details */}
      {selectedDayData && (
        <Card className="border-emerald/20 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">
                  {t("day") || "Day"} {selectedDayData.day}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(selectedDayData.gregorianDate, "EEEE, MMMM d")}
                </p>
              </div>
              <Button
                variant={selectedDayData.isFasted ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFast(selectedDayData.day)}
                className={cn(
                  selectedDayData.isFasted && "bg-emerald hover:bg-emerald/90"
                )}
              >
                {selectedDayData.isFasted ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    {t("fasted") || "Fasted"}
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    {t("markFasted") || "Mark as Fasted"}
                  </>
                )}
              </Button>
            </div>
            
            {isSameDay(selectedDayData.gregorianDate, today) && (
              <div className="flex items-center gap-2 text-xs text-gold bg-gold/10 rounded-lg p-2">
                <Sparkles className="h-3 w-3" />
                <span>{t("todayMessage") || "Today - Make the most of this blessed day!"}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
