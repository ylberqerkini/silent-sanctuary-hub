import { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { toast } from 'sonner';

interface GeocodedLocation {
  lat: number;
  lon: number;
  displayName: string;
}

interface ManualLocationSearchProps {
  onLocationSelected: (lat: number, lon: number) => void;
}

export function ManualLocationSearch({ onLocationSelected }: ManualLocationSearchProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      toast.error(t('enterCityOrAddress'));
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setResults([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (!response.ok) throw new Error('Geocoding failed');

      const data = await response.json();
      const locations: GeocodedLocation[] = data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        displayName: item.display_name,
      }));

      setResults(locations);
    } catch (err) {
      console.error('Geocoding error:', err);
      toast.error(t('geocodingFailed'));
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <MapPin className="h-4 w-4 text-emerald" />
          {t('manualLocationSearch')}
        </div>
        <p className="text-xs text-muted-foreground">
          {t('manualLocationDescription')}
        </p>
        <div className="flex gap-2">
          <Input
            placeholder={t('enterCityOrAddress')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            variant="islamic"
            size="sm"
            onClick={handleSearch}
            disabled={isSearching || query.trim().length < 2}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {results.map((loc, i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2 rounded-md text-xs hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                onClick={() => {
                  onLocationSelected(loc.lat, loc.lon);
                  setResults([]);
                  setHasSearched(false);
                  toast.success(t('locationSet'));
                }}
              >
                <span className="line-clamp-2 text-foreground">{loc.displayName}</span>
              </button>
            ))}
          </div>
        )}

        {hasSearched && !isSearching && results.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            {t('noLocationResults')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
