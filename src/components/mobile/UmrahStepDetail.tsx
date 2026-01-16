import { 
  CheckCircle2, 
  Circle, 
  MapPin, 
  Clock, 
  BookOpen,
  Lightbulb,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Language } from '@/hooks/use-language';

interface UmrahStep {
  id: string;
  titleEn: string;
  titleSq: string;
  descriptionEn: string;
  descriptionSq: string;
  icon: React.ElementType;
  location: string;
  duration: string;
  details: {
    instructionsEn: string[];
    instructionsSq: string[];
    duasEn?: string[];
    duasSq?: string[];
    tipsEn?: string[];
    tipsSq?: string[];
  };
}

interface UmrahStepDetailProps {
  step: UmrahStep;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: () => void;
  language: Language;
}

export function UmrahStepDetail({
  step,
  isOpen,
  onClose,
  isCompleted,
  onToggleComplete,
  language,
}: UmrahStepDetailProps) {
  const StepIcon = step.icon;
  const instructions = language === 'en' ? step.details.instructionsEn : step.details.instructionsSq;
  const duas = language === 'en' ? step.details.duasEn : step.details.duasSq;
  const tips = language === 'en' ? step.details.tipsEn : step.details.tipsSq;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
        <SheetHeader className="p-4 pb-2 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center">
                <StepIcon className="h-5 w-5 text-emerald" />
              </div>
              <div>
                <SheetTitle className="text-left text-lg font-serif">
                  {language === 'en' ? step.titleEn : step.titleSq}
                </SheetTitle>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {step.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {step.duration}
                  </span>
                </div>
              </div>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(85vh-140px)] p-4">
          <div className="space-y-6">
            {/* Description */}
            <p className="text-muted-foreground">
              {language === 'en' ? step.descriptionEn : step.descriptionSq}
            </p>

            {/* Instructions */}
            <div>
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald" />
                {language === 'en' ? 'Step-by-Step Instructions' : 'Udhëzime Hap pas Hapi'}
              </h3>
              <ol className="space-y-3">
                {instructions.map((instruction, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald/10 text-emerald text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Duas */}
            {duas && duas.length > 0 && (
              <div>
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-emerald" />
                  {language === 'en' ? 'Recommended Duas' : 'Lutjet e Rekomanduara'}
                </h3>
                <div className="space-y-3">
                  {duas.map((dua, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg bg-emerald/5 border border-emerald/20"
                    >
                      <p className="text-sm italic text-foreground">{dua}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {tips && tips.length > 0 && (
              <div>
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-gold" />
                  {language === 'en' ? 'Helpful Tips' : 'Këshilla të Dobishme'}
                </h3>
                <ul className="space-y-2">
                  {tips.map((tip, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-gold">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Complete button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t safe-area-bottom">
          <Button
            onClick={onToggleComplete}
            className={`w-full gap-2 ${
              isCompleted 
                ? 'bg-emerald/10 text-emerald hover:bg-emerald/20' 
                : 'bg-emerald hover:bg-emerald/90'
            }`}
            variant={isCompleted ? 'outline' : 'default'}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                {language === 'en' ? 'Completed' : 'Përfunduar'}
              </>
            ) : (
              <>
                <Circle className="h-4 w-4" />
                {language === 'en' ? 'Mark as Complete' : 'Shëno si të Përfunduar'}
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
