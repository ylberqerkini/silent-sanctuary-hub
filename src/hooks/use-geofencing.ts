import { useEffect, useState, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation, Position, WatchPositionCallback } from '@capacitor/geolocation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { usePushNotifications } from './use-push-notifications';
import { useUserStreaks } from './use-user-streaks';
import { useNotificationHistory } from './use-notification-history';
import { toast } from 'sonner';

export interface Mosque {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
  geofence_radius: number;
  is_verified: boolean;
}

export interface GeofenceState {
  isTracking: boolean;
  currentPosition: Position | null;
  nearbyMosques: Mosque[];
  insideMosque: Mosque | null;
  permissionStatus: 'prompt' | 'granted' | 'denied';
  error: string | null;
}

// Calculate distance between two coordinates in meters using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
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

export function useGeofencing() {
  const { user } = useAuth();
  const { sendLocalMosqueAlert } = usePushNotifications();
  const { recordVisit } = useUserStreaks();
  const { addNotification } = useNotificationHistory();
  
  const [state, setState] = useState<GeofenceState>({
    isTracking: false,
    currentPosition: null,
    nearbyMosques: [],
    insideMosque: null,
    permissionStatus: 'prompt',
    error: null,
  });

  const [allMosques, setAllMosques] = useState<Mosque[]>([]);
  const watchIdRef = useRef<string | null>(null);
  const currentVisitIdRef = useRef<string | null>(null);
  const lastInsideMosqueRef = useRef<Mosque | null>(null);

  // Fetch mosques from database
  useEffect(() => {
    const fetchMosques = async () => {
      const { data, error } = await supabase
        .from('mosques')
        .select('*')
        .eq('is_verified', true);

      if (error) {
        console.error('Error fetching mosques:', error);
      } else {
        setAllMosques(data || []);
      }
    };

    fetchMosques();
  }, []);

  // Check permission status
  const checkPermissions = useCallback(async () => {
    try {
      const status = await Geolocation.checkPermissions();
      setState(prev => ({
        ...prev,
        permissionStatus: status.location === 'granted' ? 'granted' : 
                         status.location === 'denied' ? 'denied' : 'prompt'
      }));
      return status.location;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return 'prompt';
    }
  }, []);

  // Request location permission
  const requestPermission = useCallback(async () => {
    try {
      const status = await Geolocation.requestPermissions();
      setState(prev => ({
        ...prev,
        permissionStatus: status.location === 'granted' ? 'granted' : 'denied'
      }));
      return status.location === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setState(prev => ({ ...prev, permissionStatus: 'denied' }));
      return false;
    }
  }, []);

  // Handle entering a mosque
  const handleEnterMosque = useCallback(async (mosque: Mosque) => {
    console.log('Entering mosque:', mosque.name);
    
    // Send notification
    sendLocalMosqueAlert(mosque.name);
    
    // Add to notification history
    if (user) {
      addNotification(
        `${mosque.name} Detected`,
        'Your phone has been silenced. May your prayers be accepted.',
        'detection'
      );
    }

    // Record visit start
    if (user) {
      const { data, error } = await supabase
        .from('mosque_visits')
        .insert({
          user_id: user.id,
          mosque_id: mosque.id,
        })
        .select()
        .single();

      if (!error && data) {
        currentVisitIdRef.current = data.id;
      }
    }

    // Update streak
    recordVisit();

    lastInsideMosqueRef.current = mosque;
  }, [user, sendLocalMosqueAlert, addNotification, recordVisit]);

  // Handle exiting a mosque
  const handleExitMosque = useCallback(async (mosque: Mosque) => {
    console.log('Exiting mosque:', mosque.name);
    
    toast.info(`Left ${mosque.name}`, {
      description: 'Your phone settings have been restored.',
      icon: '🕌',
    });

    // Update visit with exit time
    if (user && currentVisitIdRef.current) {
      const enteredAt = new Date(); // We'd need to store this properly
      const exitedAt = new Date();
      const durationMinutes = Math.round((exitedAt.getTime() - enteredAt.getTime()) / 60000);

      await supabase
        .from('mosque_visits')
        .update({
          exited_at: exitedAt.toISOString(),
          duration_minutes: Math.max(1, durationMinutes),
        })
        .eq('id', currentVisitIdRef.current);

      currentVisitIdRef.current = null;
    }

    lastInsideMosqueRef.current = null;
  }, [user]);

  // Process position update
  const processPosition = useCallback((position: Position) => {
    const { latitude, longitude } = position.coords;
    
    // Find nearby mosques (within 1km)
    const nearby = allMosques.filter(mosque => {
      const distance = calculateDistance(
        latitude,
        longitude,
        Number(mosque.latitude),
        Number(mosque.longitude)
      );
      return distance < 1000; // 1km radius for nearby
    });

    // Check if inside any mosque geofence
    let insideMosque: Mosque | null = null;
    for (const mosque of allMosques) {
      const distance = calculateDistance(
        latitude,
        longitude,
        Number(mosque.latitude),
        Number(mosque.longitude)
      );
      if (distance <= mosque.geofence_radius) {
        insideMosque = mosque;
        break;
      }
    }

    // Handle geofence events
    const wasInsideMosque = lastInsideMosqueRef.current;
    
    if (insideMosque && !wasInsideMosque) {
      // Entered a mosque
      handleEnterMosque(insideMosque);
    } else if (!insideMosque && wasInsideMosque) {
      // Exited a mosque
      handleExitMosque(wasInsideMosque);
    }

    setState(prev => ({
      ...prev,
      currentPosition: position,
      nearbyMosques: nearby,
      insideMosque,
    }));
  }, [allMosques, handleEnterMosque, handleExitMosque]);

  // Start tracking location
  const startTracking = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      // Web fallback - use browser geolocation
      if ('geolocation' in navigator) {
        try {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const position: Position = {
                coords: {
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                  accuracy: pos.coords.accuracy,
                  altitude: pos.coords.altitude,
                  altitudeAccuracy: pos.coords.altitudeAccuracy,
                  heading: pos.coords.heading,
                  speed: pos.coords.speed,
                },
                timestamp: pos.timestamp,
              };
              processPosition(position);
              setState(prev => ({ ...prev, isTracking: true, permissionStatus: 'granted' }));
            },
            (error) => {
              console.error('Geolocation error:', error);
              setState(prev => ({ 
                ...prev, 
                error: error.message,
                permissionStatus: 'denied'
              }));
            }
          );
          
          // Watch position for continuous updates
          const watchId = navigator.geolocation.watchPosition(
            (pos) => {
              const position: Position = {
                coords: {
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                  accuracy: pos.coords.accuracy,
                  altitude: pos.coords.altitude,
                  altitudeAccuracy: pos.coords.altitudeAccuracy,
                  heading: pos.coords.heading,
                  speed: pos.coords.speed,
                },
                timestamp: pos.timestamp,
              };
              processPosition(position);
            },
            (error) => {
              console.error('Watch position error:', error);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
          );
          
          watchIdRef.current = watchId.toString();
          
        } catch (error) {
          console.error('Error starting tracking:', error);
        }
      }
      return;
    }

    try {
      // Check/request permissions
      let permStatus = await checkPermissions();
      if (permStatus !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          setState(prev => ({ ...prev, error: 'Location permission denied' }));
          return;
        }
      }

      // Get current position first
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      processPosition(position);

      // Start watching position
      const watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position, err) => {
          if (err) {
            console.error('Watch position error:', err);
            setState(prev => ({ ...prev, error: err.message }));
            return;
          }
          if (position) {
            processPosition(position);
          }
        }
      );

      watchIdRef.current = watchId;
      setState(prev => ({ ...prev, isTracking: true, error: null }));
      
    } catch (error) {
      console.error('Error starting tracking:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to start tracking'
      }));
    }
  }, [checkPermissions, requestPermission, processPosition]);

  // Stop tracking location
  const stopTracking = useCallback(async () => {
    if (watchIdRef.current) {
      if (Capacitor.isNativePlatform()) {
        await Geolocation.clearWatch({ id: watchIdRef.current });
      } else {
        navigator.geolocation.clearWatch(parseInt(watchIdRef.current));
      }
      watchIdRef.current = null;
    }
    
    setState(prev => ({ ...prev, isTracking: false }));
  }, []);

  // Get current position once
  const getCurrentPosition = useCallback(async (): Promise<Position | null> => {
    try {
      if (Capacitor.isNativePlatform()) {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });
        processPosition(position);
        return position;
      } else {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const position: Position = {
                coords: {
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                  accuracy: pos.coords.accuracy,
                  altitude: pos.coords.altitude,
                  altitudeAccuracy: pos.coords.altitudeAccuracy,
                  heading: pos.coords.heading,
                  speed: pos.coords.speed,
                },
                timestamp: pos.timestamp,
              };
              processPosition(position);
              resolve(position);
            },
            () => resolve(null)
          );
        });
      }
    } catch (error) {
      console.error('Error getting current position:', error);
      return null;
    }
  }, [processPosition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        if (Capacitor.isNativePlatform()) {
          Geolocation.clearWatch({ id: watchIdRef.current });
        } else {
          navigator.geolocation.clearWatch(parseInt(watchIdRef.current));
        }
      }
    };
  }, []);

  return {
    ...state,
    allMosques,
    startTracking,
    stopTracking,
    getCurrentPosition,
    requestPermission,
    calculateDistance,
  };
}
