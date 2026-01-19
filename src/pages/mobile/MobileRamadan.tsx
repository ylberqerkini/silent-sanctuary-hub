import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  Calendar, 
  Clock, 
  BookOpen,
  Sparkles,
  WifiOff,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { useRamadan } from "@/hooks/use-ramadan";
import { RamadanCalendar } from "@/components/mobile/RamadanCalendar";
import { SuhoorIftarTimes } from "@/components/mobile/SuhoorIftarTimes";
import { DailyDuas } from "@/components/mobile/DailyDuas";

export default function MobileRamadan() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("times");
  const { 
    progress, 
    isRamadan, 
    currentRamadanDay, 
    daysUntilRamadan,
    resetProgress 
  } = useRamadan();
  const [isOnline] = useState(navigator.onLine);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald/20 to-gold/20 rounded-xl">
            <Moon className="h-6 w-6 text-emerald" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{t("ramadanMode") || "Ramadan Mode"}</h1>
            <p className="text-xs text-muted-foreground">
              {isRamadan 
                ? `${t("day") || "Day"} ${currentRamadanDay} ${t("of") || "of"} 30`
                : daysUntilRamadan > 0 
                  ? `${daysUntilRamadan} ${t("daysUntilRamadan") || "days until Ramadan"}`
                  : t("prepareForRamadan") || "Prepare for Ramadan"
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="outline" className="bg-muted text-muted-foreground">
              <WifiOff className="h-3 w-3 mr-1" />
              {t("offline") || "Offline"}
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {progress && (
        <div className="grid grid-cols-3 gap-2">
          <Card className="border-emerald/20">
            <CardContent className="p-3 text-center">
              <Sparkles className="h-4 w-4 text-gold mx-auto mb-1" />
              <p className="text-2xl font-bold text-emerald">
                {progress.totalFasted}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {t("daysFasted") || "Days Fasted"}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-emerald/20">
            <CardContent className="p-3 text-center">
              <Calendar className="h-4 w-4 text-emerald mx-auto mb-1" />
              <p className="text-2xl font-bold">
                {30 - progress.totalFasted}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {t("daysRemaining") || "Remaining"}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-emerald/20">
            <CardContent className="p-3 text-center">
              <Moon className="h-4 w-4 text-gold mx-auto mb-1" />
              <p className="text-2xl font-bold text-gold">
                {Math.round((progress.totalFasted / 30) * 100)}%
              </p>
              <p className="text-[10px] text-muted-foreground">
                {t("complete") || "Complete"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50">
          <TabsTrigger 
            value="times" 
            className="flex items-center gap-1.5 data-[state=active]:bg-emerald data-[state=active]:text-white"
          >
            <Clock className="h-4 w-4" />
            <span className="text-xs">{t("times") || "Times"}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="calendar" 
            className="flex items-center gap-1.5 data-[state=active]:bg-emerald data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-xs">{t("calendar") || "Calendar"}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="duas" 
            className="flex items-center gap-1.5 data-[state=active]:bg-emerald data-[state=active]:text-white"
          >
            <BookOpen className="h-4 w-4" />
            <span className="text-xs">{t("duas") || "Duas"}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="times" className="mt-4">
          <SuhoorIftarTimes />
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <RamadanCalendar />
        </TabsContent>

        <TabsContent value="duas" className="mt-4">
          <DailyDuas />
        </TabsContent>
      </Tabs>

      {/* Last Updated */}
      {progress && (
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            {t("lastUpdated") || "Last updated"}: {new Date(progress.lastUpdated).toLocaleString()}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetProgress}
            className="text-xs text-muted-foreground"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            {t("resetProgress") || "Reset Progress"}
          </Button>
        </div>
      )}
    </div>
  );
}
