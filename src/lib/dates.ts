/* ============================================================
   Dates & urgency
   PRD Q2 — the fixtures are dated against a FIXED today so the
   prototype always shows the same live-looking mix (MD-5).
   ============================================================ */

import type { Urgency } from '../types';

/** PRD Q2, resolved. Matches the Appendix F wireframe header. */
export const FIXED_TODAY = new Date(2026, 6, 31); // 2026-07-31, Friday

const DAY = 86_400_000;

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Whole days from FIXED_TODAY. Negative = in the past. */
export function daysFromToday(iso?: string): number | undefined {
  if (!iso) return undefined;
  const t = new Date(FIXED_TODAY.getFullYear(), FIXED_TODAY.getMonth(), FIXED_TODAY.getDate());
  return Math.round((parseDate(iso).getTime() - t.getTime()) / DAY);
}

/** D.1 — the five-step scale. Derived from the date, nothing else. */
export function urgencyOf(iso?: string): Urgency {
  const d = daysFromToday(iso);
  if (d === undefined) return 'later';   // "no date" sits at Later, per D.1
  if (d < 0) return 'overdue';
  if (d === 0) return 'today';
  if (d <= 7) return 'soon';
  if (d <= 30) return 'upcoming';
  return 'later';
}

/**
 * B.1 — DateLabel is relative-first.
 * "11 days overdue" changes behaviour in a way that "July 20" does not.
 */
export function relativeLabel(iso?: string): string {
  const d = daysFromToday(iso);
  if (d === undefined) return 'no date set';
  if (d < -1) return `${Math.abs(d)} days overdue`;
  if (d === -1) return 'yesterday';
  if (d === 0) return 'today';
  if (d === 1) return 'tomorrow';
  if (d <= 6) return parseDate(iso!).toLocaleDateString('en-US', { weekday: 'long' });
  if (d <= 30) return `in ${d} days`;
  return absoluteLabel(iso);
}

export function absoluteLabel(iso?: string): string {
  if (!iso) return '—';
  return parseDate(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Days elapsed since a past date — for "147 days" style staleness. */
export function daysSince(iso?: string): number | undefined {
  const d = daysFromToday(iso);
  return d === undefined ? undefined : -d;
}

export const todayLabel = FIXED_TODAY.toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric',
});

/** Shift an ISO date by n days — used by recurring-reminder roll-forward (FR-REM-4). */
export function shiftDate(iso: string, days: number): string {
  const d = parseDate(iso);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
