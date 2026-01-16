import { useState } from 'react';
import { Info, RotateCcw, Smartphone, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

const calibrationSteps = [
  {
    step: 1,
    title: 'Hold Your Phone',
    description: 'Hold your phone flat in front of you, parallel to the ground.',
    icon: Smartphone,
  },
  {
    step: 2,
    title: 'Move in Figure-8',
    description: 'Move your phone in a figure-8 pattern 3-4 times. Rotate your wrist as you trace the pattern.',
    icon: RotateCcw,
  },
  {
    step: 3,
    title: 'Check Accuracy',
    description: 'The compass should now provide more accurate readings. If still inaccurate, repeat the process.',
    icon: CheckCircle2,
  },
];

interface CompassCalibrationGuideProps {
  variant?: 'button' | 'link';
}

export function CompassCalibrationGuide({ variant = 'button' }: CompassCalibrationGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const resetSteps = () => setCurrentStep(0);

  return (
    <Dialog onOpenChange={(open) => !open && resetSteps()}>
      <DialogTrigger asChild>
        {variant === 'button' ? (
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <Info className="h-4 w-4" />
            Calibration Guide
          </Button>
        ) : (
          <button className="inline-flex items-center gap-1 text-xs text-emerald hover:underline">
            <Info className="h-3 w-3" />
            Learn to calibrate
          </button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-sm mx-4 rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-emerald" />
            Compass Calibration
          </DialogTitle>
          <DialogDescription>
            Improve compass accuracy by calibrating your device's magnetometer
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2">
            {calibrationSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'w-8 bg-emerald' 
                    : index < currentStep 
                      ? 'w-2 bg-emerald/50' 
                      : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Current step content */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-emerald/10 flex items-center justify-center">
              {(() => {
                const StepIcon = calibrationSteps[currentStep].icon;
                return (
                  <StepIcon 
                    className={`h-10 w-10 text-emerald ${
                      currentStep === 1 ? 'animate-spin' : ''
                    }`}
                    style={currentStep === 1 ? { animationDuration: '3s' } : {}}
                  />
                );
              })()}
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Step {calibrationSteps[currentStep].step}: {calibrationSteps[currentStep].title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {calibrationSteps[currentStep].description}
              </p>
            </div>

            {/* Figure-8 animation for step 2 */}
            {currentStep === 1 && (
              <div className="relative w-32 h-24 mx-auto mt-4">
                <svg 
                  viewBox="0 0 100 60" 
                  className="w-full h-full text-emerald/30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                >
                  <path d="M50,30 C50,10 80,10 80,30 C80,50 50,50 50,30 C50,10 20,10 20,30 C20,50 50,50 50,30" />
                </svg>
                <div 
                  className="absolute w-3 h-3 bg-emerald rounded-full animate-figure-eight"
                  style={{
                    animation: 'figureEight 2s ease-in-out infinite',
                  }}
                />
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            {currentStep < calibrationSteps.length - 1 ? (
              <Button
                className="flex-1 bg-emerald hover:bg-emerald/90"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
              </Button>
            ) : (
              <DialogClose asChild>
                <Button className="flex-1 bg-emerald hover:bg-emerald/90">
                  Done
                </Button>
              </DialogClose>
            )}
          </div>

          {/* Tips section */}
          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Tips for better accuracy:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Stay away from metal objects and electronics</li>
              <li>Remove phone cases with magnetic mounts</li>
              <li>Calibrate outdoors for best results</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
