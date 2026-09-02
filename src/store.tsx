/* ============================================================
   Session store — PRD Appendix C
   No persistence. No server. Everything resets on reload (ST-4).
   ============================================================ */

import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AnyCard, CardKind, FixtureState, InboxItem } from './types';
import { bills } from './fixtures/bills';
import { contacts as fxContacts } from './fixtures/people';
import {
  commitments, tasks, delegations, reminders, projects, opportunities,
  entities, goals, events, documents, decisions, inboxItems,
} from './fixtures/data';
import { shiftDate, ANCHOR_ISO } from './lib/dates';
import { useAuth } from './lib/auth';
import { fetchCards, fetchPrefs, isConnected, saveCards, savePrefs } from './lib/db';

const ALL: AnyCard[] = [
  ...fxContacts, ...commitments, ...tasks, ...delegations, ...reminders,
  ...projects, ...opportunities, ...entities, ...goals, ...events,
  ...documents, ...decisions, ...inboxItems,
  ...bills,
];

/* FX-9 — the "quiet Tuesday" state. Same fixtures, most of the
   pressure removed, so hide-when-empty (FR-HOME-3) is demonstrable. */
const QUIET_HIDDEN = new Set([
  'cm1', 'cm3', 'cm6', 'cm8', 'cm11', 'cm12', 'cm15', 'cm18', 'cm20', 'cm22',
  'o1', 'o9', 'p1', 'd1', 'r3', 'r5', 'r6', 'r7', 'ev1', 'ev2', 'e9',
  'c6', 'c11', 'r12', 'ev5',
]);

interface Toast { message: string; undo: () => void }

interface Store {
  cards: AnyCard[];
  byId: (id: string) => AnyCard | undefined;
  nameOf: (id: string) => string;
  fixtureState: FixtureState;
  setFixtureState: (s: FixtureState) => void;
  top3: string[];
  setTop3: (ids: string[]) => void;
  complete: (id: string) => void;
  archive: (id: string) => void;
  snooze: (id: string, days: number) => void;
  /** The three ways out of a repeatedly postponed item. */
  killItem: (id: string) => void;
  keepItem: (id: string) => void;
  handOff: (id: string) => void;
  /** Back out of the archive. The counterpart to "nothing is deleted". */
  restore: (id: string) => void;
  /** Edit any field on any card. */
  update: (id: string, patch: Partial<AnyCard>) => void;
  followUp: (id: string) => void;
  logInteraction: (id: string) => void;
  capture: (title: string, hint?: InboxItem['hint']) => void;
  convertInbox: (id: string, kind: CardKind) => void;
  markPaid: (id: string) => void;
  showAmounts: boolean;
  setShowAmounts: (v: boolean) => void;
  toast: Toast | null;
  clearToast: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { account } = useAuth();
  const live = isConnected && !!account;

  /* Fixtures when there is no database or nobody signed in — which is
     the demo, and also what lets all of this ship before setup. */
  const [cards, setCards] = useState<AnyCard[]>(live ? [] : ALL);
  const [fixtureState, setFixtureState] = useState<FixtureState>('primary');
  const [top3, setTop3] = useState<string[]>(live ? [] : ['t5', 't1', 't2']);
  const [toast, setToast] = useState<Toast | null>(null);
  const [seq, setSeq] = useState(0);
  /** Open question: does Rona want amounts stored at all? Built so
      either answer works, and she can decide by using it. */
  const [showAmounts, setShowAmounts] = useState(true);

  /* Everything already written, by identity. Every mutation in this
     file replaces the objects it changes and leaves the rest alone,
     so reference inequality is an exact dirty check — no mutation
     function needs to know persistence exists. */
  const written = useRef(new Map<string, AnyCard>());
  const firstLoad = useRef(false);

  /* ---- Load ---- */
  useEffect(() => {
    if (!live || !account) {
      setCards(ALL);
      written.current.clear();
      firstLoad.current = false;
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [rows, prefs] = await Promise.all([
          fetchCards(account.id),
          fetchPrefs(account.id),
        ]);
        if (cancelled) return;
        setCards(rows);
        rows.forEach(c => written.current.set(c.id, c));
        if (prefs) { setTop3(prefs.top3); setShowAmounts(prefs.showAmounts); }
        firstLoad.current = true;
      } catch {
        if (!cancelled) {
          setToast({ message: 'Could not reach your data — nothing has been lost', undo: () => {} });
        }
      }
    })();
    return () => { cancelled = true; };
  }, [live, account]);

  /* ---- Save ----
     Debounced, because editing a text field fires on every keystroke
     and one write per character is absurd. The screen never waits on
     this: local state has already changed. */
  useEffect(() => {
    if (!live || !account || !firstLoad.current) return;
    const changed = cards.filter(c => written.current.get(c.id) !== c);
    if (!changed.length) return;

    const t = setTimeout(() => {
      saveCards(changed, account.id)
        .then(() => changed.forEach(c => written.current.set(c.id, c)))
        .catch(() => setToast({
          message: 'That did not save. It is still on screen — try again in a moment.',
          undo: () => {},
        }));
    }, 600);
    return () => clearTimeout(t);
  }, [cards, live, account]);

  /* ---- Preferences ---- */
  useEffect(() => {
    if (!live || !account || !firstLoad.current) return;
    const t = setTimeout(() => {
      savePrefs({ top3, showAmounts }, account.id).catch(() => { /* not worth a toast */ });
    }, 600);
    return () => clearTimeout(t);
  }, [top3, showAmounts, live, account]);

  /** ST-3 — every mutation is undoable for a few seconds. */
  const patch = useCallback((id: string, fn: (c: AnyCard) => AnyCard, message: string) => {
    setCards(prev => {
      const next = prev.map(c => (c.id === id ? fn(c) : c));
      setToast({ message, undo: () => setCards(prev) });
      return next;
    });
  }, []);

  const complete = useCallback((id: string) => {
    setCards(prev => {
      const card = prev.find(c => c.id === id);
      // FR-REM-4 — a recurring reminder rolls forward rather than closing.
      if (card?.kind === 'reminder' && card.recurrence && card.dueDate) {
        const next = prev.map(c => c.id === id
          ? { ...c, dueDate: shiftDate(card.dueDate!, 90) } as AnyCard
          : c);
        setToast({ message: `“${card.title}” rolled to its next date`, undo: () => setCards(prev) });
        return next;
      }
      const next = prev.map(c => (c.id === id ? { ...c, status: 'Complete' } as AnyCard : c));
      setToast({ message: `“${card?.title ?? 'Item'}” completed`, undo: () => setCards(prev) });
      return next;
    });
  }, []);

  const archive = useCallback((id: string) =>
    patch(id, c => ({ ...c, status: 'Archived' }) as AnyCard, 'Archived'), [patch]);

  /* Every postponement is counted. Three is where the system stops
     being polite about it — Rona asked to be called out on this. */
  const snooze = useCallback((id: string, days: number) =>
    patch(id, c => ({
      ...c,
      dueDate: c.dueDate ? shiftDate(c.dueDate, days) : undefined,
      snoozeCount: (c.snoozeCount ?? 0) + 1,
      lastTouched: ANCHOR_ISO,
    }) as AnyCard, `Snoozed ${days} days`), [patch]);

  /** Admit it is not going to happen. Archived, never destroyed. */
  const killItem = useCallback((id: string) =>
    patch(id, c => ({ ...c, status: 'Archived', snoozeCount: 0 }) as AnyCard,
      'Dropped — it had been postponed three times'), [patch]);

  /** Recommit. The count resets, so the question is earned again. */
  const keepItem = useCallback((id: string) =>
    patch(id, c => ({ ...c, snoozeCount: 0, importance: 'High', lastTouched: ANCHOR_ISO }) as AnyCard,
      'Kept, and raised'), [patch]);

  /** Editing is silent by design — no toast per keystroke. The card
      itself shows the new value, which is the confirmation. */
  const update = useCallback((id: string, patch: Partial<AnyCard>) =>
    setCards(prev => prev.map(c =>
      c.id === id ? ({ ...c, ...patch, lastTouched: ANCHOR_ISO } as AnyCard) : c)), []);

  /** A promise of "nothing is destroyed" is empty without a way back.
      Returns the item to a live state appropriate to what it is. */
  const restore = useCallback((id: string) =>
    patch(id, c => ({
      ...c,
      status: c.kind === 'commitment' ? 'Open'
        : c.kind === 'entity' || c.kind === 'project' ? 'Active'
        : c.kind === 'inbox' ? 'Inbox'
        : 'Next',
      snoozeCount: 0,
      lastTouched: ANCHOR_ISO,
    }) as AnyCard, 'Brought back'), [patch]);

  /** Someone else's. Flagged rather than assigned — she picks who. */
  const handOff = useCallback((id: string) =>
    patch(id, c => ({
      ...c,
      snoozeCount: 0,
      attentionType: 'Delegate',
      flags: c.flags.includes('delegatable') ? c.flags : [...c.flags, 'delegatable'],
    }) as AnyCard, 'Marked to hand off'), [patch]);

  /** FR-COM-6 — for "They Owe" the move is to ask, not to do. */
  const followUp = useCallback((id: string) =>
    patch(id, c => ({
      ...c, status: 'Follow-up scheduled', lastTouched: ANCHOR_ISO,
    }) as AnyCard, 'Follow-up logged'), [patch]);

  /** FR-CRM-4 — one tap. */
  const logInteraction = useCallback((id: string) =>
    patch(id, c => (c.kind === 'contact'
      ? { ...c, lastInteraction: ANCHOR_ISO, lastTouched: ANCHOR_ISO, flags: [] }
      : c) as AnyCard, 'Interaction logged'), [patch]);

  /** FR-CAP-2 / FR-CAP-3 — text is the only required input. */
  const capture = useCallback((title: string, hint?: InboxItem['hint']) => {
    const item: InboxItem = {
      id: `new-${seq}`, kind: 'inbox', title, hint,
      capturedAt: ANCHOR_ISO, status: 'Inbox', importance: 'Normal',
      lifeAreas: [], owner: 'Me', relatedIds: [], tags: [],
      lastTouched: ANCHOR_ISO, flags: [],
    };
    setSeq(s => s + 1);
    setCards(prev => {
      const next = [item, ...prev];
      setToast({ message: 'Captured to Inbox', undo: () => setCards(prev) });
      return next;
    });
  }, [seq]);

  const convertInbox = useCallback((id: string, kind: CardKind) =>
    patch(id, c => ({ ...c, kind, status: 'Next' }) as AnyCard, `Filed as ${kind}`), [patch]);

  /** The bill ledger is a record of what was settled and when. */
  const markPaid = useCallback((id: string) =>
    patch(id, c => ({
      ...c, paymentStatus: 'Paid', paidOn: ANCHOR_ISO, status: 'Complete',
    }) as AnyCard, 'Marked paid'), [patch]);

  const visible = useMemo(
    () => fixtureState === 'quiet' ? cards.filter(c => !QUIET_HIDDEN.has(c.id)) : cards,
    [cards, fixtureState],
  );

  const value = useMemo<Store>(() => ({
    cards: visible,
    byId: id => visible.find(c => c.id === id),
    nameOf: id => visible.find(c => c.id === id)?.title ?? 'Unknown',
    fixtureState, setFixtureState,
    top3, setTop3,
    complete, archive, snooze, killItem, keepItem, handOff, restore, update,
    followUp, logInteraction, capture, convertInbox,
    markPaid, showAmounts, setShowAmounts,
    toast, clearToast: () => setToast(null),
  }), [visible, fixtureState, top3, complete, archive, snooze, followUp,
      logInteraction, capture, convertInbox, markPaid, showAmounts, toast,
      killItem, keepItem, handOff, restore, update]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}
