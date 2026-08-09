/* ============================================================
   Session store — PRD Appendix C
   No persistence. No server. Everything resets on reload (ST-4).
   ============================================================ */

import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AnyCard, CardKind, FixtureState, InboxItem } from './types';
import { bills } from './fixtures/bills';
import { contacts as fxContacts } from './fixtures/people';
import {
  commitments, tasks, delegations, reminders, projects, opportunities,
  entities, goals, events, documents, decisions, inboxItems,
} from './fixtures/data';
import { shiftDate, ANCHOR_ISO } from './lib/dates';

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
  const [cards, setCards] = useState<AnyCard[]>(ALL);
  const [fixtureState, setFixtureState] = useState<FixtureState>('primary');
  const [top3, setTop3] = useState<string[]>(['t5', 't1', 't2']);
  const [toast, setToast] = useState<Toast | null>(null);
  const [seq, setSeq] = useState(0);
  /** Open question: does Rona want amounts stored at all? Built so
      either answer works, and she can decide by using it. */
  const [showAmounts, setShowAmounts] = useState(true);

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

  const snooze = useCallback((id: string, days: number) =>
    patch(id, c => ({
      ...c,
      dueDate: c.dueDate ? shiftDate(c.dueDate, days) : undefined,
      lastTouched: ANCHOR_ISO,
    }) as AnyCard, `Snoozed ${days} days`), [patch]);

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
    complete, archive, snooze, followUp, logInteraction, capture, convertInbox,
    markPaid, showAmounts, setShowAmounts,
    toast, clearToast: () => setToast(null),
  }), [visible, fixtureState, top3, complete, archive, snooze, followUp,
      logInteraction, capture, convertInbox, markPaid, showAmounts, toast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}
