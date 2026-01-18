import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'umrah-progress';

interface UmrahProgress {
  completedSteps: string[];
  lastUpdated: string;
  startedAt?: string;
}

export function useUmrahProgress() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const progress: UmrahProgress = JSON.parse(stored);
        setCompletedSteps(progress.completedSteps || []);
      }
    } catch (error) {
      console.error('Failed to load Umrah progress:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save progress to localStorage whenever it changes
  const saveProgress = useCallback((steps: string[]) => {
    try {
      const progress: UmrahProgress = {
        completedSteps: steps,
        lastUpdated: new Date().toISOString(),
        startedAt: steps.length > 0 ? 
          (JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').startedAt || new Date().toISOString()) 
          : undefined
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save Umrah progress:', error);
    }
  }, []);

  const toggleStep = useCallback((stepId: string) => {
    setCompletedSteps(prev => {
      const newSteps = prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId];
      saveProgress(newSteps);
      return newSteps;
    });
  }, [saveProgress]);

  const resetProgress = useCallback(() => {
    setCompletedSteps([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset Umrah progress:', error);
    }
  }, []);

  const getProgressInfo = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const progress: UmrahProgress = JSON.parse(stored);
        return {
          lastUpdated: progress.lastUpdated ? new Date(progress.lastUpdated) : null,
          startedAt: progress.startedAt ? new Date(progress.startedAt) : null
        };
      }
    } catch (error) {
      console.error('Failed to get progress info:', error);
    }
    return { lastUpdated: null, startedAt: null };
  }, []);

  return {
    completedSteps,
    toggleStep,
    resetProgress,
    isLoaded,
    getProgressInfo
  };
}
