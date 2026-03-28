import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import posthog from 'posthog-js';
import { Sentry } from '@/instrument';
import type { LookupGroupDto } from '@/lib/api';

const STORAGE_KEY = 'wedding_rsvp_guest';

interface GuestContextValue {
  group: LookupGroupDto | null;
  setGroup: (group: LookupGroupDto | null) => void;
  logout: () => void;
  displayName: string;
}

const GuestContext = createContext<GuestContextValue | null>(null);

function loadStored(): LookupGroupDto | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LookupGroupDto;
    if (!parsed || !parsed._id || !Array.isArray(parsed.guests)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveStored(group: LookupGroupDto | null): void {
  try {
    if (group) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(group));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

function displayNameForGroup(group: LookupGroupDto): string {
  return (
    group.name?.trim() ||
    (group.guests[0]
      ? `${group.guests[0].firstName} ${group.guests[0].lastName}`
      : '')
  );
}

function identifyUser(group: LookupGroupDto): void {
  const name = displayNameForGroup(group);
  const guestNames = group.guests.map(
    (g) => `${g.firstName} ${g.lastName}`,
  );

  try {
    posthog.identify(group._id, {
      name,
      guest_names: guestNames,
      guest_count: group.guests.length,
    });
  } catch {
    // PostHog may not be initialized
  }

  Sentry.setUser({ id: group._id, username: name });
}

function deidentifyUser(): void {
  try {
    posthog.reset();
  } catch {
    // PostHog may not be initialized
  }

  Sentry.setUser(null);
}

export function GuestProvider({ children }: { children: ReactNode }) {
  const [group, setGroupState] = useState<LookupGroupDto | null>(loadStored);
  const identifiedOnMount = useRef(false);

  useEffect(() => {
    if (!identifiedOnMount.current && group) {
      identifyUser(group);
      identifiedOnMount.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    saveStored(group);
  }, [group]);

  const setGroup = useCallback((next: LookupGroupDto | null) => {
    setGroupState(next);
    if (next) {
      identifyUser(next);
    }
  }, []);

  const logout = useCallback(() => {
    setGroupState(null);
    saveStored(null);
    deidentifyUser();
  }, []);

  const displayName = group ? displayNameForGroup(group) : '';

  const value: GuestContextValue = {
    group,
    setGroup,
    logout,
    displayName,
  };

  return (
    <GuestContext.Provider value={value}>{children}</GuestContext.Provider>
  );
}

export function useGuest() {
  const ctx = useContext(GuestContext);
  if (!ctx) {
    throw new Error('useGuest must be used within GuestProvider');
  }
  return ctx;
}

export function useGuestOptional() {
  return useContext(GuestContext);
}
