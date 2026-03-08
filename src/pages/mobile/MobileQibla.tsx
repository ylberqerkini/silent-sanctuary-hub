import { QiblaCompass } from '@/components/mobile/QiblaCompass';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function MobileQibla() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          {t('qiblaTitle')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('qiblaSubtitle')}
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
                <strong className="text-foreground">{t('qiblaHowToUse')}</strong>{' '}
                {t('qiblaInstructions')}
              </p>
              <p>{t('qiblaCalibration')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}