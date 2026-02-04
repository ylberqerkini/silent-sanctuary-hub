import { useState, useEffect, useCallback } from 'react';

export interface NearbyMosque {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
  distance: number;
  distanceText: string;
  source: 'database' | 'openstreetmap';
}

interface UseNearbyMosquesResult {
  mosques: NearbyMosque[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Calculate distance between two coordinates in meters using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function useNearbyMosques(
  latitude?: number,
  longitude?: number,
  limit: number = 5
): UseNearbyMosquesResult {
  const [mosques, setMosques] = useState<NearbyMosque[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMosques = useCallback(async () => {
    if (!latitude || !longitude) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use Overpass API to fetch mosques from OpenStreetMap
      // Search within a large radius but only return top results by distance
      const searchRadiusMeters = 50000; // 50km search radius to find enough mosques
      
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="place_of_worship"]["religion"="muslim"](around:${searchRadiusMeters},${latitude},${longitude});
          way["amenity"="place_of_worship"]["religion"="muslim"](around:${searchRadiusMeters},${latitude},${longitude});
          node["building"="mosque"](around:${searchRadiusMeters},${latitude},${longitude});
          way["building"="mosque"](around:${searchRadiusMeters},${latitude},${longitude});
        );
        out center;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(overpassQuery)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch mosques');
      }

      const data = await response.json();

      const fetchedMosques: NearbyMosque[] = data.elements
        .map((element: any) => {
          // For ways, use center coordinates
          const lat = element.lat || element.center?.lat;
          const lon = element.lon || element.center?.lon;

          if (!lat || !lon) return null;

          const distance = calculateDistance(latitude, longitude, lat, lon);
          const tags = element.tags || {};

          return {
            id: `osm-${element.id}`,
            name: tags.name || tags['name:en'] || tags['name:ar'] || 'Mosque',
            address: tags['addr:street'] 
              ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}`.trim()
              : tags['addr:full'] || null,
            city: tags['addr:city'] || null,
            country: tags['addr:country'] || null,
            latitude: lat,
            longitude: lon,
            distance,
            distanceText: formatDistance(distance),
            source: 'openstreetmap' as const,
          };
        })
        .filter((m: NearbyMosque | null): m is NearbyMosque => m !== null)
        .sort((a: NearbyMosque, b: NearbyMosque) => a.distance - b.distance)
        .slice(0, limit); // Only return top nearest mosques

      setMosques(fetchedMosques);
    } catch (err) {
      console.error('Error fetching nearby mosques:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch mosques');
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude, limit]);

  useEffect(() => {
    fetchMosques();
  }, [fetchMosques]);

  return {
    mosques,
    isLoading,
    error,
    refetch: fetchMosques,
  };
}
