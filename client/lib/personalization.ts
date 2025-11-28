export const PERSONALIZATION_STORAGE_KEY = 'dashboard-personalization-preferences';

export type ThemePreference = 'system' | 'light' | 'dark';
export type DensityPreference = 'comfortable' | 'compact';
export type AccentPreference = 'violet' | 'blue' | 'emerald' | 'amber' | 'rose';

export type PersonalizationPreferences = {
  theme: ThemePreference;
  density: DensityPreference;
  accent: AccentPreference;
};

export const defaultPersonalizationPrefs: PersonalizationPreferences = {
  theme: 'system',
  density: 'comfortable',
  accent: 'violet',
};

export const accentOptions: AccentPreference[] = ['violet', 'blue', 'emerald', 'amber', 'rose'];

export const accentSamples: Record<AccentPreference, string> = {
  violet: 'bg-violet-500/80',
  blue: 'bg-sky-500/80',
  emerald: 'bg-emerald-500/80',
  amber: 'bg-amber-500/80',
  rose: 'bg-rose-500/80',
};

export function mergePersonalizationPrefs(
  next?: Partial<PersonalizationPreferences> | null,
): PersonalizationPreferences {
  if (!next) return defaultPersonalizationPrefs;
  return {
    ...defaultPersonalizationPrefs,
    ...next,
  };
}

export function applyPersonalizationToDocument(prefs: PersonalizationPreferences) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.accent = prefs.accent;
  document.documentElement.dataset.density = prefs.density;
}
