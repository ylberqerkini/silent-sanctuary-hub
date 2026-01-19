import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Bookmark,
  Share2,
  Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RAMADAN_DUAS, useRamadan } from "@/hooks/use-ramadan";
import { useLanguage } from "@/hooks/use-language";

export function DailyDuas() {
  const { t } = useLanguage();
  const { currentRamadanDay, isRamadan } = useRamadan();
  
  // Default to current day if in Ramadan, otherwise day 1
  const defaultDay = isRamadan && currentRamadanDay > 0 ? currentRamadanDay : 1;
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [savedDuas, setSavedDuas] = useState<number[]>([]);

  const currentDua = RAMADAN_DUAS[selectedDay - 1];

  const handlePrevious = () => {
    setSelectedDay(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setSelectedDay(prev => Math.min(30, prev + 1));
  };

  const toggleSaved = () => {
    setSavedDuas(prev => 
      prev.includes(selectedDay)
        ? prev.filter(d => d !== selectedDay)
        : [...prev, selectedDay]
    );
  };

  const isSaved = savedDuas.includes(selectedDay);

  return (
    <div className="space-y-4">
      {/* Day Navigator */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={selectedDay === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t("previous") || "Previous"}
        </Button>
        
        <div className="text-center">
          <Badge 
            variant="outline" 
            className={cn(
              "bg-emerald/10 text-emerald border-emerald/30",
              selectedDay === currentRamadanDay && "bg-gold/10 text-gold border-gold/30"
            )}
          >
            {selectedDay === currentRamadanDay && (
              <Star className="h-3 w-3 mr-1 fill-current" />
            )}
            {t("day") || "Day"} {selectedDay}
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={selectedDay === 30}
        >
          {t("next") || "Next"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Quick Day Selection */}
      <ScrollArea className="w-full">
        <div className="flex gap-1.5 pb-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full text-xs font-medium transition-all",
                selectedDay === day
                  ? "bg-emerald text-white"
                  : day === currentRamadanDay
                  ? "bg-gold/20 text-gold border border-gold/30"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Dua Card */}
      {currentDua && (
        <Card className="border-emerald/20 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald/10 to-gold/10 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald" />
                <span className="font-medium text-sm">
                  {t("duaForDay") || "Dua for Day"} {selectedDay}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleSaved}
                >
                  <Bookmark 
                    className={cn(
                      "h-4 w-4",
                      isSaved && "fill-gold text-gold"
                    )} 
                  />
                </Button>
              </div>
            </div>
          </div>

          <CardContent className="p-5 space-y-5">
            {/* Arabic Text */}
            <div className="text-center">
              <p 
                className="text-2xl leading-loose font-arabic text-foreground"
                dir="rtl"
              >
                {currentDua.arabic}
              </p>
            </div>

            {/* Transliteration */}
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
                {t("transliteration") || "Transliteration"}
              </p>
              <p className="text-sm italic text-foreground/80">
                {currentDua.transliteration}
              </p>
            </div>

            {/* Translation */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {t("translation") || "Translation"}
              </p>
              <p className="text-base text-foreground">
                {currentDua.translation}
              </p>
            </div>

            {/* English Meaning */}
            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                {t("meaning") || "Meaning"}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentDua.english}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Duas Count */}
      {savedDuas.length > 0 && (
        <div className="text-center text-xs text-muted-foreground">
          <Bookmark className="h-3 w-3 inline mr-1" />
          {savedDuas.length} {t("duasSaved") || "duas saved"}
        </div>
      )}
    </div>
  );
}
