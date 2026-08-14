import type { HistoryItem, UserSettings } from "@/types";

const HISTORY_KEY = "vent2corp-history";
const FAVORITES_KEY = "vent2corp-favorites";
const SETTINGS_KEY = "vent2corp-settings";

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  defaultTone: "professional",
  defaultRecipient: "manager",
  defaultPlatform: "slack",
};

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addHistoryItem(item: HistoryItem): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  const updated = [item, ...history].slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function deleteHistoryItem(id: string): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  const updated = history.filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

export function getFavorites(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(item: HistoryItem): boolean {
  if (typeof window === "undefined") return false;
  const favorites = getFavorites();
  const exists = favorites.some((f) => f.id === item.id || f.original === item.original);
  let updated: HistoryItem[];
  if (exists) {
    updated = favorites.filter((f) => f.id !== item.id && f.original !== item.original);
  } else {
    updated = [item, ...favorites];
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return !exists;
}

export function isFavorite(idOrOriginal: string): boolean {
  if (typeof window === "undefined") return false;
  const favorites = getFavorites();
  return favorites.some((f) => f.id === idOrOriginal || f.original === idOrOriginal);
}

export function getSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<UserSettings>): void {
  if (typeof window === "undefined") return;
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
}
