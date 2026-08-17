/* ============================================================
   Saved reviews

   A review you cannot look back at is just a form. The point of
   doing one every week is the line between them — what you said
   you would carry, and whether you did.

   Kept in this browser, like the decision answers. The product
   still persists nothing else; this earns the exception for the
   same reason those did. Real reflection should not be lost to a
   stray refresh.
   ============================================================ */

const KEY = 'rona-os.reviews.v1';

export interface SavedReview {
  /** The real date it was closed, as written. */
  closedOn: string;
  /** The same date, sortable — so "how long since the last one" is
      a question the product can answer rather than guess at. */
  closedISO?: string;
  /** Titles, not ids — a record should still read after the data moves. */
  bigThree: string[];
  dropped: string[];
  note: string;
  counts: {
    finished: number;
    stillOwed: number;
    waitingOn: number;
    stalled: number;
    postponed: number;
  };
}

function storage(): Storage | null {
  try {
    const s = window.localStorage;
    s.setItem('__p', '1'); s.removeItem('__p');
    return s;
  } catch { return null; }
}

export function loadReviews(): SavedReview[] {
  const s = storage();
  if (!s) return [];
  try {
    const raw = s.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedReview[]) : [];
  } catch { return []; }
}

export function saveReview(r: SavedReview): SavedReview[] {
  const all = [r, ...loadReviews()].slice(0, 24);
  try { storage()?.setItem(KEY, JSON.stringify(all)); } catch { /* nothing to do */ }
  return all;
}

export function clearReviews(): void {
  storage()?.removeItem(KEY);
}

/** Days since the last review, or null if there has never been one. */
export function daysSinceLastReview(todayIso: string): number | null {
  const [last] = loadReviews();
  if (!last?.closedISO) return null;
  const d = (a: string) => { const [y, m, dd] = a.split('-').map(Number); return new Date(y, m - 1, dd).getTime(); };
  return Math.round((d(todayIso) - d(last.closedISO)) / 86_400_000);
}

/** A review is due if none has been done, or the last was a week ago. */
export function reviewDue(todayIso: string): boolean {
  const since = daysSinceLastReview(todayIso);
  return since === null || since >= 7;
}
