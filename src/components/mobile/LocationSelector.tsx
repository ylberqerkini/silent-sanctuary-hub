import { useState } from 'react';
import { MapPin, ChevronDown, ChevronRight, Navigation, Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocationSettings, Country, City } from '@/hooks/use-location-settings';
import { cn } from '@/lib/utils';

interface LocationSelectorProps {
  compact?: boolean;
}

export function LocationSelector({ compact = false }: LocationSelectorProps) {
  const { settings, countries, selectCity, useCurrentLocation, isLoading } = useLocationSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  const handleSelectCity = (country: Country, city: City) => {
    selectCity(country, city);
    setIsOpen(false);
  };

  const handleUseCurrentLocation = () => {
    useCurrentLocation();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "sm" : "default"}
          className={cn(
            "gap-1.5 text-muted-foreground hover:text-foreground",
            compact ? "h-7 px-2 text-xs" : "h-9 px-3"
          )}
        >
          <MapPin className={cn(compact ? "h-3 w-3" : "h-4 w-4", "text-emerald")} />
          <span className="max-w-[120px] truncate">{settings.city}</span>
          <ChevronDown className={cn(compact ? "h-3 w-3" : "h-4 w-4")} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="font-serif flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald" />
            Select Location
          </DialogTitle>
        </DialogHeader>

        {/* Current Location Button */}
        <div className="px-4 pb-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-emerald/30 bg-emerald/5 hover:bg-emerald/10"
            onClick={handleUseCurrentLocation}
            disabled={isLoading}
          >
            <div className="p-1.5 rounded-lg bg-emerald/20">
              <Navigation className="h-4 w-4 text-emerald" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-sm">Use Current Location</p>
              <p className="text-xs text-muted-foreground">Auto-detect via GPS</p>
            </div>
            {!settings.isManual && (
              <Check className="h-4 w-4 text-emerald" />
            )}
          </Button>
        </div>

        {/* Country/City List */}
        <ScrollArea className="h-[400px] px-4 pb-4">
          <div className="space-y-1">
            {countries.map((country) => (
              <div key={country.code} className="overflow-hidden rounded-lg">
                {/* Country Header */}
                <button
                  className={cn(
                    "w-full flex items-center justify-between p-3 text-left transition-colors",
                    expandedCountry === country.code
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setExpandedCountry(
                    expandedCountry === country.code ? null : country.code
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCountryFlag(country.code)}</span>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      expandedCountry === country.code && "rotate-90"
                    )}
                  />
                </button>

                {/* Cities */}
                {expandedCountry === country.code && (
                  <div className="bg-muted/30 py-1">
                    {country.cities.map((city) => {
                      const isSelected = 
                        settings.city === city.name && 
                        settings.country === country.name;
                      
                      return (
                        <button
                          key={city.name}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-2.5 pl-12 text-left transition-colors",
                            isSelected
                              ? "bg-emerald/10 text-emerald"
                              : "hover:bg-muted/50"
                          )}
                          onClick={() => handleSelectCity(country, city)}
                        >
                          <div>
                            <p className={cn("font-medium text-sm", isSelected && "text-emerald")}>
                              {city.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {city.timezone.split('/').pop()?.replace('_', ' ')}
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 text-emerald" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    'XK': '🇽🇰',
    'AL': '🇦🇱',
    'MK': '🇲🇰',
    'TR': '🇹🇷',
    'SA': '🇸🇦',
    'AE': '🇦🇪',
    'EG': '🇪🇬',
    'MY': '🇲🇾',
    'ID': '🇮🇩',
    'PK': '🇵🇰',
    'GB': '🇬🇧',
    'US': '🇺🇸',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
  };
  return flags[code] || '🌍';
}

export default LocationSelector;
