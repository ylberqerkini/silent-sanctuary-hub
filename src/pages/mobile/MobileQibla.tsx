import { MobileLayout } from '@/components/mobile/MobileLayout';
import { QiblaCompass } from '@/components/mobile/QiblaCompass';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function MobileQibla() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Qibla Finder
        </h1>
        <p className="text-sm text-muted-foreground">
          Find the direction of the Kaaba
        </p>
      </div>

      {/* Compass */}
      <QiblaCompass />

      {/* Instructions */}
      <Card className="bg-muted/30 border-muted">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong className="text-foreground">How to use:</strong> Hold your phone flat and parallel to the ground. 
                The arrow will point towards the Kaaba in Mecca.
              </p>
              <p>
                For best accuracy, calibrate your phone's compass by moving it in a figure-8 pattern.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
