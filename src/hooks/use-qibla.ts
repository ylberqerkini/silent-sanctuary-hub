import { useState, useEffect, useCallback } from 'react';

// Kaaba coordinates in Mecca
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

interface QiblaData {
  qiblaDirection: number; // Qibla direction in degrees from North
  deviceHeading: number | null; // Current device compass heading
  qiblaFromDevice: number | null; // Degrees to rotate to face Qibla
  isSupported: boolean;
  hasPermission: boolean;
  error: string | null;
}

export function useQibla(latitude?: number, longitude?: number) {
  const [qiblaData, setQiblaData] = useState<QiblaData>({
    qiblaDirection: 0,
    deviceHeading: null,
    qiblaFromDevice: null,
    isSupported: false,
    hasPermission: false,
    error: null,
  });

  // Calculate Qibla direction using the great circle formula
  const calculateQiblaDirection = useCallback((lat: number, lng: number): number => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
    const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

    const y = Math.sin(kaabaLngRad - lngRad);
    const x =
      Math.cos(latRad) * Math.tan(kaabaLatRad) -
      Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    
    // Normalize to 0-360
    qibla = (qibla + 360) % 360;
    
    return qibla;
  }, []);

  // Request device orientation permission (needed for iOS 13+)
  const requestPermission = useCallback(async () => {
    // Check if DeviceOrientationEvent is available
    if (!('DeviceOrientationEvent' in window)) {
      setQiblaData(prev => ({
        ...prev,
        isSupported: false,
        error: 'Device orientation not supported on this device',
      }));
      return false;
    }

    // Check if permission API exists (iOS 13+)
    const DeviceOrientationEvent = window.DeviceOrientationEvent as typeof window.DeviceOrientationEvent & {
      requestPermission?: () => Promise<string>;
    };

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setQiblaData(prev => ({ ...prev, hasPermission: true, isSupported: true }));
          return true;
        } else {
          setQiblaData(prev => ({
            ...prev,
            hasPermission: false,
            error: 'Permission denied for device orientation',
          }));
          return false;
        }
      } catch (error) {
        setQiblaData(prev => ({
          ...prev,
          error: 'Failed to request orientation permission',
        }));
        return false;
      }
    } else {
      // No permission needed (Android, older iOS)
      setQiblaData(prev => ({ ...prev, hasPermission: true, isSupported: true }));
      return true;
    }
  }, []);

  // Handle device orientation event
  useEffect(() => {
    if (!latitude || !longitude) return;

    const qiblaDir = calculateQiblaDirection(latitude, longitude);
    setQiblaData(prev => ({ ...prev, qiblaDirection: qiblaDir }));

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // webkitCompassHeading for iOS, alpha for Android
      let heading: number | null = null;

      if ('webkitCompassHeading' in event) {
        heading = (event as DeviceOrientationEvent & { webkitCompassHeading: number }).webkitCompassHeading;
      } else if (event.alpha !== null) {
        // For Android, alpha gives the rotation around z-axis
        // We need to convert it to compass heading
        heading = 360 - event.alpha;
      }

      if (heading !== null) {
        // Calculate the angle to rotate to face Qibla
        let qiblaFromDevice = qiblaDir - heading;
        // Normalize to -180 to 180 for smoother rotation
        qiblaFromDevice = ((qiblaFromDevice + 180) % 360) - 180;

        setQiblaData(prev => ({
          ...prev,
          deviceHeading: heading,
          qiblaFromDevice,
          isSupported: true,
        }));
      }
    };

    if (qiblaData.hasPermission) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [latitude, longitude, qiblaData.hasPermission, calculateQiblaDirection]);

  // Check support on mount
  useEffect(() => {
    const isSupported = 'DeviceOrientationEvent' in window;
    setQiblaData(prev => ({ ...prev, isSupported }));
  }, []);

  return {
    ...qiblaData,
    requestPermission,
  };
}

// Calculate distance to Kaaba in km
export function calculateDistanceToKaaba(lat: number, lng: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
  const dLng = ((KAABA_LNG - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
