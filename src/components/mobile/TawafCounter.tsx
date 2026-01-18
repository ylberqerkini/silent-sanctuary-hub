import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Plus, Minus, Check, RefreshCw, Volume2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

const TAWAF_STORAGE_KEY = 'tawaf-counter';
const TOTAL_ROUNDS = 7;

interface TawafState {
  count: number;
  completedAt?: string;
}

export function TawafCounter() {
  const { language } = useLanguage();
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TAWAF_STORAGE_KEY);
      if (stored) {
        const state: TawafState = JSON.parse(stored);
        setCount(state.count);
        if (state.count >= TOTAL_ROUNDS) {
          setIsComplete(true);
        }
      }
    } catch (error) {
      console.error('Failed to load Tawaf progress:', error);
    }
  }, []);

  // Save to localStorage whenever count changes
  const saveProgress = useCallback((newCount: number) => {
    try {
      const state: TawafState = {
        count: newCount,
        completedAt: newCount >= TOTAL_ROUNDS ? new Date().toISOString() : undefined
      };
      localStorage.setItem(TAWAF_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save Tawaf progress:', error);
    }
  }, []);

  const increment = useCallback(() => {
    if (count < TOTAL_ROUNDS) {
      const newCount = count + 1;
      setCount(newCount);
      saveProgress(newCount);
      
      // Vibrate if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      if (newCount === TOTAL_ROUNDS) {
        setIsComplete(true);
        setShowCelebration(true);
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100, 50, 200]);
        }
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  }, [count, saveProgress]);

  const decrement = useCallback(() => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      saveProgress(newCount);
      setIsComplete(false);
      
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }
  }, [count, saveProgress]);

  const reset = useCallback(() => {
    setCount(0);
    setIsComplete(false);
    setShowCelebration(false);
    try {
      localStorage.removeItem(TAWAF_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset Tawaf progress:', error);
    }
  }, []);

  const progress = (count / TOTAL_ROUNDS) * 100;

  const roundLabels = language === 'en' 
    ? ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th']
    : ['1-rë', '2-të', '3-të', '4-të', '5-të', '6-të', '7-të'];

  return (
    <div className="space-y-4">
      {/* Main Counter Card */}
      <Card className={`overflow-hidden transition-all ${
        isComplete 
          ? 'bg-gradient-to-br from-emerald/20 to-gold/10 border-emerald/40' 
          : 'bg-gradient-to-br from-emerald/10 to-background'
      }`}>
        <CardContent className="p-6">
          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center justify-center gap-2">
              <RotateCcw className="h-5 w-5 text-emerald" />
              {language === 'en' ? 'Tawaf Counter' : 'Numëruesi i Tavafit'}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'en' 
                ? 'Track your 7 rounds around the Kaaba' 
                : 'Ndiqni 7 rrotullimet tuaja rreth Qabes'}
            </p>
          </div>

          {/* Large Counter Display */}
          <div className="relative flex items-center justify-center my-6">
            {/* Circular progress background */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/30"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - count / TOTAL_ROUNDS)}`}
                  strokeLinecap="round"
                  className="text-emerald transition-all duration-500"
                />
              </svg>
              
              {/* Counter number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {isComplete ? (
                  <div className="flex flex-col items-center">
                    <Check className="h-12 w-12 text-emerald animate-bounce" />
                    <span className="text-sm font-medium text-emerald mt-1">
                      {language === 'en' ? 'Complete!' : 'Përfundoi!'}
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="text-5xl font-bold text-foreground">{count}</span>
                    <span className="text-sm text-muted-foreground">
                      {language === 'en' ? `of ${TOTAL_ROUNDS}` : `nga ${TOTAL_ROUNDS}`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Celebration message */}
          {showCelebration && (
            <div className="text-center mb-4 animate-pulse">
              <p className="text-emerald font-medium">
                🎉 {language === 'en' ? 'Masha\'Allah! Tawaf Complete!' : 'Masha\'Allah! Tavafi Përfundoi!'} 🎉
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'en' 
                  ? 'Now pray 2 Rakaat behind Maqam Ibrahim' 
                  : 'Tani falni 2 rekate pas Mekamit të Ibrahimit'}
              </p>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-full text-lg"
              onClick={decrement}
              disabled={count === 0}
            >
              <Minus className="h-6 w-6" />
            </Button>
            
            <Button
              variant="default"
              size="lg"
              className="h-20 w-20 rounded-full text-xl bg-emerald hover:bg-emerald/90"
              onClick={increment}
              disabled={count >= TOTAL_ROUNDS}
            >
              <Plus className="h-8 w-8" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-full text-lg"
              onClick={reset}
              disabled={count === 0}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>

          {/* Current round label */}
          {!isComplete && count > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {language === 'en' 
                ? `Currently on ${roundLabels[count - 1]} round` 
                : `Aktualisht në rrotullimin e ${roundLabels[count - 1]}`}
            </p>
          )}

          {/* Tap hint */}
          {count === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {language === 'en' 
                ? 'Tap + after completing each round' 
                : 'Shtypni + pasi të përfundoni çdo rrotullim'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Round indicators */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              {language === 'en' ? 'Rounds' : 'Rrotullimet'}
            </span>
            <Badge variant="secondary" className="bg-emerald/10 text-emerald">
              {count}/{TOTAL_ROUNDS}
            </Badge>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: TOTAL_ROUNDS }).map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  index < count 
                    ? 'bg-emerald text-white' 
                    : index === count 
                      ? 'bg-emerald/20 border-2 border-emerald text-emerald'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < count ? (
                  <Check className="h-3 w-3" />
                ) : (
                  index + 1
                )}
              </div>
            ))}
          </div>
          
          <Progress value={progress} className="h-1.5 bg-muted mt-3" />
        </CardContent>
      </Card>

      {/* Duas reminder */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0">
              <Volume2 className="h-4 w-4 text-emerald" />
            </div>
            <div>
              <h4 className="font-medium text-sm">
                {language === 'en' ? 'Remember to recite' : 'Mos harroni të recitoni'}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'en' 
                  ? 'Between Yemeni Corner and Black Stone:' 
                  : 'Midis Qoshes Jemeni dhe Gurit të Zi:'}
              </p>
              <p className="text-xs text-emerald mt-1 italic">
                "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
