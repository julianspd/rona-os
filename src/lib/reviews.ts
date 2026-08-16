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
  /** The real date it was closed. */
  closedOn: string;
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
