'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  PERSONALIZATION_STORAGE_KEY,
  applyPersonalizationToDocument,
  defaultPersonalizationPrefs,
  mergePersonalizationPrefs,
  type PersonalizationPreferences,
} from '@/lib/personalization';

export function PersonalizationInitializer() {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applyPrefs = (prefs: PersonalizationPreferences) => {
      applyPersonalizationToDocument(prefs);
      setTheme(prefs.theme);
    };

    const hydrate = () => {
      try {
        const stored = window.localStorage.getItem(PERSONALIZATION_STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : null;
        applyPrefs(mergePersonalizationPrefs(parsed));
      } catch (error) {
        console.error('Failed to hydrate personalization preferences', error);
        applyPrefs(defaultPersonalizationPrefs);
      }
    };

    hydrate();

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== PERSONALIZATION_STORAGE_KEY) return;
      try {
        const parsed = event.newValue ? JSON.parse(event.newValue) : null;
        applyPrefs(mergePersonalizationPrefs(parsed));
      } catch (error) {
        console.error('Failed to sync personalization preferences', error);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [setTheme]);

  return null;
}
