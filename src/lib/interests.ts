export type InterestSource = 'expertise' | 'portfolio';

export interface InterestRecord {
  id: string;
  source: InterestSource;
  createdAt: string;
  service?: string;
  name?: string;
  businessName?: string;
  contactNumber?: string;
  email?: string;
  projectNum?: string;
  projectTitle?: string;
  projectCategory?: string;
}

const INTERESTS_STORAGE_KEY = 'indraam_admin_interests_v1';

function hasWindow() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getInterests(): InterestRecord[] {
  if (!hasWindow()) return [];

  try {
    const raw = window.localStorage.getItem(INTERESTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as InterestRecord[];
  } catch {
    return [];
  }
}

export function addInterest(
  payload: Omit<InterestRecord, 'id' | 'createdAt'>
): InterestRecord | null {
  if (!hasWindow()) return null;

  const nextItem: InterestRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    ...payload,
  };

  const existing = getInterests();
  const next = [nextItem, ...existing];
  window.localStorage.setItem(INTERESTS_STORAGE_KEY, JSON.stringify(next));
  return nextItem;
}

export function clearInterests() {
  if (!hasWindow()) return;
  window.localStorage.removeItem(INTERESTS_STORAGE_KEY);
}
