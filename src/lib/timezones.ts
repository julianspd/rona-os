/* ============================================================
   The other person's local time

   The point is not the clock. It is not sending a follow-up that
   lands at somebody's 3am, and knowing before you pick up the phone
   whether they are likely awake.
   ============================================================ */

/** City to zone. A contact can override with its own `timezone`. */
export const CITY_ZONES: Record<string, string> = {
  'Oakland': 'America/Los_Angeles',
  'San Francisco': 'America/Los_Angeles',
  'Point Reyes': 'America/Los_Angeles',
  'Sacramento': 'America/Los_Angeles',
  'Napa': 'America/Los_Angeles',
  'Los Angeles': 'America/Los_Angeles',
  'Portland': 'America/Los_Angeles',
  'Seattle': 'America/Los_Angeles',
  'Chicago': 'America/Chicago',
  'New York': 'America/New_York',
  'Oslo': 'Europe/Oslo',
  'Dublin': 'Europe/Dublin',
};

export function zoneFor(city?: string, override?: string): string | undefined {
  if (override) return override;
  if (!city) return undefined;
  return CITY_ZONES[city];
}

export interface LocalClock {
  /** "3:42 PM" */
  label: string;
  /** 0–23 in that zone */
  hour: number;
  /** Roughly reachable — 8am to 9pm */
  awake: boolean;
  /** Hours ahead of, or behind, Rona */
  offsetFromHome: number;
  sameAsHome: boolean;
}

const HOME = 'America/Los_Angeles';

function hourIn(zone: string, at: Date): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: zone, hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(at);
  return Number(parts.find(p => p.type === 'hour')?.value ?? 0);
}

export function localClock(zone: string, at: Date = new Date()): LocalClock {
  const label = new Intl.DateTimeFormat('en-US', {
    timeZone: zone, hour: 'numeric', minute: '2-digit',
  }).format(at);

  const hour = hourIn(zone, at);
  const homeHour = hourIn(HOME, at);

  // Wrap into -12..+12 so "ahead by 9" never reads as "behind by 15".
  let offset = hour - homeHour;
  if (offset > 12) offset -= 24;
  if (offset < -12) offset += 24;

  return {
    label,
    hour,
    awake: hour >= 8 && hour < 21,
    offsetFromHome: offset,
    sameAsHome: offset === 0,
  };
}

/** "3 hours ahead", "2 behind", or nothing when it is the same clock. */
export function offsetLabel(c: LocalClock): string | null {
  if (c.sameAsHome) return null;
  const n = Math.abs(c.offsetFromHome);
  return `${n} ${n === 1 ? 'hour' : 'hours'} ${c.offsetFromHome > 0 ? 'ahead' : 'behind'}`;
}
