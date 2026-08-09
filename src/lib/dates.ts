/* ============================================================
   Dates, urgency, and the demo calendar

   Two things are true at once here, and keeping them apart is the
   whole trick:

   1. The fixtures were authored against a fixed ANCHOR date. All
      RELATIVE language — "11 days overdue", "in 3 days" — is
      computed from that anchor, so the story never changes. The
      overdue commitment is overdue by the same amount today as it
      will be in six months.

   2. Every date the user SEES is shifted onto the real calendar in
      Rona's timezone. So the demo shows genuine dates, on a genuine
      today, without the data decaying as time passes.

   Point the app straight at the real date instead and the demo rots:
   within a month every item is overdue and the whole screen is red.
   ============================================================ */

import type { Urgency } from '../types';

const DAY = 86_400_000;

/** Rona is Pacific. Named zone, so it follows daylight saving. */
export const TIMEZONE = 'America/Los_Angeles';

/** The date the fixtures were written against. Never changes. */
export const ANCHOR_ISO = '2026-07-31';
const ANCHOR = new Date(2026, 6, 31);

/** Today, as it is in Rona's timezone rather than the server's. */
function todayInZone(): Date {
  // en-CA formats as YYYY-MM-DD, which parses cleanly.
  const iso = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const TODAY = todayInZone();

/** How far the authored calendar has to move to meet the real one. */
export const SHIFT_DAYS = Math.round((TODAY.getTime() - ANCHOR.getTime()) / DAY);

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

/** The real-calendar date an authored date corresponds to. */
export function realDate(iso: string): Date {
  return addDays(parseDate(iso), SHIFT_DAYS);
}

/**
 * Whole days from "today". Computed against the ANCHOR, deliberately —
 * this is what keeps the demo's story stable over time.
 */
export function daysFromToday(iso?: string): number | undefined {
  if (!iso) return undefined;
  return Math.round((parseDate(iso).getTime() - ANCHOR.getTime()) / DAY);
}

/** The five-step scale. Derived from the date, nothing else. */
export function urgencyOf(iso?: string): Urgency {
  const d = daysFromToday(iso);
  if (d === undefined) return 'later';   // "no date" sits at Later
  if (d < 0) return 'overdue';
  if (d === 0) return 'today';
  if (d <= 7) return 'soon';
  if (d <= 30) return 'upcoming';
  return 'later';
}

/**
 * Relative first. "11 days overdue" changes behaviour in a way that
 * "29 July" does not.
 */
export function relativeLabel(iso?: string): string {
  const d = daysFromToday(iso);
  if (d === undefined) return 'no date set';
  if (d < -1) return `${Math.abs(d)} days overdue`;
  if (d === -1) return 'yesterday';
  if (d === 0) return 'today';
  if (d === 1) return 'tomorrow';
  if (d <= 6) return realDate(iso!).toLocaleDateString('en-US', { weekday: 'long' });
  if (d <= 30) return `in ${d} days`;
  return absoluteLabel(iso);
}

/** The real calendar date, formatted. */
export function absoluteLabel(iso?: string): string {
  if (!iso) return '—';
  return realDate(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Full date, for headers. */
export function longLabel(iso?: string): string {
  if (!iso) return '—';
  return realDate(iso).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

/** Days elapsed since a past date — for "147 days" style staleness. */
export function daysSince(iso?: string): number | undefined {
  const d = daysFromToday(iso);
  return d === undefined ? undefined : -d;
}

/** Today, written out. Recomputed per render so a session left open
    overnight does not keep insisting it is yesterday. */
export function todayLabelNow(): string {
  return todayInZone().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

export const todayLabel = todayLabelNow();

/** Shift an authored date by n days — used by recurring roll-forward. */
export function shiftDate(iso: string, days: number): string {
  const d = addDays(parseDate(iso), days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
