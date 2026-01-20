import { useState, useEffect, useCallback } from 'react';

export interface LocationSettings {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  timezone: string;
  isManual: boolean;
}

export interface Country {
  code: string;
  name: string;
  cities: City[];
}

export interface City {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Popular Muslim-majority cities organized by country
export const COUNTRIES: Country[] = [
  {
    code: 'XK',
    name: 'Kosovë',
    cities: [
      { name: 'Prishtinë', latitude: 42.6629, longitude: 21.1655, timezone: 'Europe/Belgrade' },
      { name: 'Prizren', latitude: 42.2139, longitude: 20.7397, timezone: 'Europe/Belgrade' },
      { name: 'Gjakovë', latitude: 42.3824, longitude: 20.4281, timezone: 'Europe/Belgrade' },
      { name: 'Pejë', latitude: 42.6590, longitude: 20.2883, timezone: 'Europe/Belgrade' },
      { name: 'Ferizaj', latitude: 42.3706, longitude: 21.1553, timezone: 'Europe/Belgrade' },
    ]
  },
  {
    code: 'AL',
    name: 'Shqipëri',
    cities: [
      { name: 'Tiranë', latitude: 41.3275, longitude: 19.8187, timezone: 'Europe/Tirane' },
      { name: 'Shkodër', latitude: 42.0693, longitude: 19.5033, timezone: 'Europe/Tirane' },
      { name: 'Berat', latitude: 40.7058, longitude: 19.9522, timezone: 'Europe/Tirane' },
      { name: 'Elbasan', latitude: 41.1125, longitude: 20.0822, timezone: 'Europe/Tirane' },
      { name: 'Vlorë', latitude: 40.4608, longitude: 19.4913, timezone: 'Europe/Tirane' },
    ]
  },
  {
    code: 'MK',
    name: 'North Macedonia',
    cities: [
      { name: 'Skopje', latitude: 41.9981, longitude: 21.4254, timezone: 'Europe/Skopje' },
      { name: 'Tetovo', latitude: 42.0069, longitude: 20.9715, timezone: 'Europe/Skopje' },
      { name: 'Gostivar', latitude: 41.7958, longitude: 20.9086, timezone: 'Europe/Skopje' },
    ]
  },
  {
    code: 'TR',
    name: 'Türkiye',
    cities: [
      { name: 'Istanbul', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul' },
      { name: 'Ankara', latitude: 39.9334, longitude: 32.8597, timezone: 'Europe/Istanbul' },
      { name: 'Izmir', latitude: 38.4237, longitude: 27.1428, timezone: 'Europe/Istanbul' },
      { name: 'Bursa', latitude: 40.1885, longitude: 29.0610, timezone: 'Europe/Istanbul' },
      { name: 'Konya', latitude: 37.8715, longitude: 32.4846, timezone: 'Europe/Istanbul' },
    ]
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    cities: [
      { name: 'Makkah', latitude: 21.4225, longitude: 39.8262, timezone: 'Asia/Riyadh' },
      { name: 'Madinah', latitude: 24.5247, longitude: 39.5692, timezone: 'Asia/Riyadh' },
      { name: 'Riyadh', latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh' },
      { name: 'Jeddah', latitude: 21.5433, longitude: 39.1728, timezone: 'Asia/Riyadh' },
    ]
  },
  {
    code: 'AE',
    name: 'UAE',
    cities: [
      { name: 'Dubai', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
      { name: 'Abu Dhabi', latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai' },
      { name: 'Sharjah', latitude: 25.3463, longitude: 55.4209, timezone: 'Asia/Dubai' },
    ]
  },
  {
    code: 'EG',
    name: 'Egypt',
    cities: [
      { name: 'Cairo', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo' },
      { name: 'Alexandria', latitude: 31.2001, longitude: 29.9187, timezone: 'Africa/Cairo' },
      { name: 'Giza', latitude: 30.0131, longitude: 31.2089, timezone: 'Africa/Cairo' },
    ]
  },
  {
    code: 'MY',
    name: 'Malaysia',
    cities: [
      { name: 'Kuala Lumpur', latitude: 3.1390, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
      { name: 'Shah Alam', latitude: 3.0733, longitude: 101.5185, timezone: 'Asia/Kuala_Lumpur' },
      { name: 'Penang', latitude: 5.4141, longitude: 100.3288, timezone: 'Asia/Kuala_Lumpur' },
    ]
  },
  {
    code: 'ID',
    name: 'Indonesia',
    cities: [
      { name: 'Jakarta', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta' },
      { name: 'Yogyakarta', latitude: -7.7956, longitude: 110.3695, timezone: 'Asia/Jakarta' },
      { name: 'Bandung', latitude: -6.9175, longitude: 107.6191, timezone: 'Asia/Jakarta' },
    ]
  },
  {
    code: 'PK',
    name: 'Pakistan',
    cities: [
      { name: 'Islamabad', latitude: 33.6844, longitude: 73.0479, timezone: 'Asia/Karachi' },
      { name: 'Karachi', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi' },
      { name: 'Lahore', latitude: 31.5204, longitude: 74.3587, timezone: 'Asia/Karachi' },
    ]
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    cities: [
      { name: 'London', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
      { name: 'Birmingham', latitude: 52.4862, longitude: -1.8904, timezone: 'Europe/London' },
      { name: 'Manchester', latitude: 53.4808, longitude: -2.2426, timezone: 'Europe/London' },
    ]
  },
  {
    code: 'US',
    name: 'United States',
    cities: [
      { name: 'New York', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
      { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles' },
      { name: 'Chicago', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago' },
      { name: 'Houston', latitude: 29.7604, longitude: -95.3698, timezone: 'America/Chicago' },
      { name: 'Dearborn', latitude: 42.3223, longitude: -83.1763, timezone: 'America/Detroit' },
    ]
  },
  {
    code: 'DE',
    name: 'Germany',
    cities: [
      { name: 'Berlin', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin' },
      { name: 'Munich', latitude: 48.1351, longitude: 11.5820, timezone: 'Europe/Berlin' },
      { name: 'Cologne', latitude: 50.9375, longitude: 6.9603, timezone: 'Europe/Berlin' },
    ]
  },
  {
    code: 'FR',
    name: 'France',
    cities: [
      { name: 'Paris', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
      { name: 'Marseille', latitude: 43.2965, longitude: 5.3698, timezone: 'Europe/Paris' },
      { name: 'Lyon', latitude: 45.7640, longitude: 4.8357, timezone: 'Europe/Paris' },
    ]
  },
];

const STORAGE_KEY = 'prayer_location_settings';
const DEFAULT_LOCATION: LocationSettings = {
  latitude: 42.6629,
  longitude: 21.1655,
  city: 'Prishtinë',
  country: 'Kosovë',
  timezone: 'Europe/Belgrade',
  isManual: false,
};

export function useLocationSettings() {
  const [settings, setSettings] = useState<LocationSettings>(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [detectedTimezone, setDetectedTimezone] = useState<string>('');

  // Detect browser timezone on mount
  useEffect(() => {
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setDetectedTimezone(browserTz);
  }, []);

  // Load saved settings or detect location
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      
      // Check localStorage first
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings(parsed);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error('Failed to parse saved location settings');
        }
      }

      // Try to get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const newSettings: LocationSettings = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              city: 'Current Location',
              country: 'Auto-detected',
              timezone: browserTz,
              isManual: false,
            };
            setSettings(newSettings);
            setIsLoading(false);
          },
          () => {
            // Use default if geolocation fails
            setIsLoading(false);
          },
          { enableHighAccuracy: false, timeout: 5000 }
        );
      } else {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = useCallback((newSettings: LocationSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  }, []);

  const selectCity = useCallback((country: Country, city: City) => {
    const newSettings: LocationSettings = {
      latitude: city.latitude,
      longitude: city.longitude,
      city: city.name,
      country: country.name,
      timezone: city.timezone,
      isManual: true,
    };
    saveSettings(newSettings);
  }, [saveSettings]);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const newSettings: LocationSettings = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: 'Current Location',
          country: 'Auto-detected',
          timezone: browserTz,
          isManual: false,
        };
        saveSettings(newSettings);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );
  }, [saveSettings]);

  const resetToDefault = useCallback(() => {
    saveSettings(DEFAULT_LOCATION);
  }, [saveSettings]);

  return {
    settings,
    isLoading,
    detectedTimezone,
    countries: COUNTRIES,
    selectCity,
    useCurrentLocation,
    resetToDefault,
  };
}
