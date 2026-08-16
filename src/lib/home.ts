/* ============================================================
   Home composition — PRD §9.1 + Appendix H.1

   H.1: an item appears in EXACTLY ONE Home section.
   Sections are evaluated in order 0→14. An item lands in the first
   section it qualifies for; if that section is at its cap it
   CASCADES to the next section it qualifies for. If none remain,
   it does not appear on Home at all — it stays in its module.

   Implemented once, here, so the rule cannot drift across 15
   sections (the same reasoning as SectionBlock owning the caps).
   ============================================================ */

import type { AnyCard, AttentionType, Bill, Contact, Commitment, Delegation,
  Entity, EventCard, Opportunity, Project } from '../types';
import { daysFromToday, daysSince, daysUntilAnnual } from './dates';

export interface HomeSection {
  key: string;
  title: string;
  cap: number;
  items: AnyCard[];
  alwaysRender?: boolean;
  emphasis?: 'overdue' | 'normal';
}

const OPEN_STATUSES = new Set(['Complete', 'Archived', 'Fulfilled', 'Released', 'Closed']);
const isOpen = (c: AnyCard) => !OPEN_STATUSES.has(c.status);

/* ---- qualifiers, in §9.1 order ----------------------------- */

const isOverdueCommitment = (c: AnyCard) =>
  c.kind === 'commitment' && isOpen(c) &&
  (c.status === 'Overdue' || (c.dueDate !== undefined && (daysFromToday(c.dueDate) ?? 0) < 0));

/** Executive Attention only claims what genuinely needs the executive. */
const attentionBucket = (bucket: AttentionType) => (c: AnyCard) =>
  isOpen(c) &&
  c.attentionType === bucket &&
  (c.importance === 'Critical' || c.importance === 'High' || c.flags.length > 0);

const isMeetingSoon = (c: AnyCard) => {
  if (c.kind !== 'event') return false;
  const d = daysFromToday((c as EventCard).start);
  return d !== undefined && d >= 0 && d <= 1;
};

const isIOwe = (c: AnyCard) =>
  c.kind === 'commitment' && isOpen(c) && (c as Commitment).direction === 'I Owe';

const isWaitingOn = (c: AnyCard) =>
  c.kind === 'commitment' && isOpen(c) && (c as Commitment).direction === 'They Owe';

const needsMovement = (c: AnyCard) => {
  if (c.kind !== 'opportunity' || !isOpen(c)) return false;
  const o = c as Opportunity;
  return o.flags.includes('stalled') || !o.nextMove || (o.daysSinceMove ?? 0) > 21;
};

const isProjectAtRisk = (c: AnyCard) =>
  c.kind === 'project' && isOpen(c) && (c as Project).flags.includes('at-risk');

const isCheckInDue = (c: AnyCard) => {
  if (c.kind !== 'delegation' || !isOpen(c)) return false;
  const d = daysFromToday((c as Delegation).checkInDate);
  return d !== undefined && d <= 0;
};

/** Past their cadence, or with a date coming up — both are reasons
    to reach out, which is what this section is actually for. */
const needsReconnect = (c: AnyCard) => {
  if (c.kind !== 'contact') return false;
  const k = c as Contact;
  const since = daysSince(k.lastInteraction);
  if (since !== undefined && since > k.cadenceDays) return true;
  return (k.importantDates ?? []).some(d => daysUntilAnnual(d.date) <= 7);
};

/** Reminders and bills share this section — from Rona's side they are
    the same question: what is coming due that I have not handled? */
const isRenewalSoon = (c: AnyCard) => {
  if (c.kind !== 'reminder' && c.kind !== 'bill') return false;
  if (!isOpen(c)) return false;
  if (c.kind === 'bill' && (c as Bill).paymentStatus === 'Paid') return false;
  const d = daysFromToday(c.dueDate);
  return d !== undefined && d <= 30;
};

const isHealthItem = (c: AnyCard) =>
  isOpen(c) && c.lifeAreas.includes('Health') &&
  (c.kind === 'event' || c.kind === 'reminder') &&
  (daysFromToday(c.dueDate ?? (c as EventCard).start) ?? 99) <= 30;

const isNearTrip = (c: AnyCard) => {
  if (c.kind !== 'entity' || !isOpen(c)) return false;
  if ((c as Entity).entityType !== 'trip') return false;
  const d = daysFromToday(c.dueDate);
  return d !== undefined && d >= 0 && d <= 14;
};

/* ---- ordering within a section ----------------------------- */

const IMPORTANCE_RANK = { Critical: 0, High: 1, Normal: 2, Low: 3 } as const;

function rank(c: AnyCard) {
  const due = daysFromToday(c.dueDate) ?? 999;
  return IMPORTANCE_RANK[c.importance] * 1000 + Math.min(due, 999);
}

/* ============================================================
   The builder
   ============================================================ */

interface Spec {
  key: string;
  title: string;
  cap: number;
  qualifies: (c: AnyCard) => boolean;
  alwaysRender?: boolean;
  emphasis?: 'overdue' | 'normal';
}

const SPECS: Spec[] = [
  { key: 'overdue',   title: 'Overdue',                     cap: 3, qualifies: isOverdueCommitment, emphasis: 'overdue' },
  { key: 'decide',    title: 'Decide',                      cap: 3, qualifies: attentionBucket('Decide') },
  { key: 'review',    title: 'Review',                      cap: 3, qualifies: attentionBucket('Review') },
  { key: 'connect',   title: 'Connect',                     cap: 3, qualifies: attentionBucket('Connect') },
  { key: 'do',        title: 'Do',                          cap: 3, qualifies: attentionBucket('Do') },
  { key: 'meetings',  title: 'Meetings & appointments',     cap: 5, qualifies: isMeetingSoon },
  { key: 'iowe',      title: 'I owe',                       cap: 5, qualifies: isIOwe },
  { key: 'waiting',   title: 'Waiting on',                  cap: 5, qualifies: isWaitingOn },
  { key: 'opps',      title: 'Opportunities needing movement', cap: 3, qualifies: needsMovement },
  { key: 'risk',      title: 'Projects at risk',            cap: 3, qualifies: isProjectAtRisk },
  { key: 'delegation',title: 'Delegation check-ins',        cap: 3, qualifies: isCheckInDue },
  { key: 'reconnect', title: 'Relationships to reconnect',  cap: 3, qualifies: needsReconnect },
  { key: 'renewals',  title: 'Renewals & life admin',       cap: 5, qualifies: isRenewalSoon },
  { key: 'health',    title: 'Health',                      cap: 3, qualifies: isHealthItem },
  { key: 'travel',    title: 'Travel',                      cap: 1, qualifies: isNearTrip },
];

export function buildHome(cards: AnyCard[]): HomeSection[] {
  const sections: HomeSection[] = SPECS.map(s => ({
    key: s.key, title: s.title, cap: s.cap, items: [],
    emphasis: s.emphasis,
  }));

  const pool = [...cards].sort((a, b) => rank(a) - rank(b));

  for (const card of pool) {
    // H.1 steps 1–3: first qualifying section with room; else cascade.
    for (let i = 0; i < SPECS.length; i++) {
      if (!SPECS[i].qualifies(card)) continue;
      if (sections[i].items.length >= SPECS[i].cap) continue; // full — cascade
      sections[i].items.push(card);
      break;                                                   // claimed
    }
    // H.1 step 4: qualifying for nothing further means it does not
    // appear on Home. It remains reachable in its module.
  }

  return sections;
}

/** Sections 1–2 of §9.1 render always; they are not item-driven. */
export function inboxCount(cards: AnyCard[]) {
  return cards.filter(c => c.kind === 'inbox' && c.status === 'Inbox').length;
}
