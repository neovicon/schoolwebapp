import type { SessionData } from '../types/auth.types';

export const SESSION_KEY = 'sp_session';

export const session = {
  get(): SessionData | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SessionData;
    } catch {
      return null;
    }
  },

  set(data: SessionData): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  },

  clear(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  isExpired(data: SessionData): boolean {
    if (!data.expiresAt) return false;
    return Date.now() > data.expiresAt;
  },
};
