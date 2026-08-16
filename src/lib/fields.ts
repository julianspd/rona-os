/* ============================================================
   What a card shows, and how each part is edited

   Colour discipline, since this is the screen most tempted to
   break it: gold still means ownership, and the urgency ramp
   still owns dates. The one genuinely categorical dimension is
   life area — fourteen parallel things with no order — so that
   is where categorical colour goes, and nowhere else.

   Everything else keeps the shape language it already has:
   filled, outlined, muted, struck.
   ============================================================ */

import type { AttentionType, CardKind, Importance, LifeArea, Owner, Status } from '../types';

/* ---- Life areas ---------------------------------------------
   Low saturation, similar lightness, so they read as one family
   rather than a rainbow. All clear the contrast floor on white,
   and none of them lands near gold or the urgency reds.        */
export const LIFE_AREA_COLOR: Record<LifeArea, string> = {
  Work:          '#5B6B8A',
  Ventures:      '#3F7A6E',
  Consulting:    '#5A5B8C',
  Nonprofit:     '#6A7A46',
  Relationships: '#8A5A62',
  Property:      '#8A6A52',
  Personal:      '#75587A',
  Vehicles:      '#5F7080',
  Health:        '#55806B',
  Travel:        '#4A7590',
  Money:         '#6B6B3F',
  Brand:         '#8A6080',
  Learning:      '#55707A',
  Career:        '#7A6248',
};

export const ALL_LIFE_AREAS = Object.keys(LIFE_AREA_COLOR) as LifeArea[];

/* ---- Option sets --------------------------------------------- */
export const IMPORTANCE: Importance[] = ['Critical', 'High', 'Normal', 'Low'];
export const ATTENTION: AttentionType[] = ['Decide', 'Review', 'Connect', 'Do', 'Delegate', 'Wait'];
export const OWNER: Owner[] = ['Me', 'Delegated', 'Waiting on other'];

/** Statuses that make sense for a given kind, rather than all twenty. */
export function statusesFor(kind: CardKind): Status[] {
  switch (kind) {
    case 'commitment':
      return ['Open', 'Follow-up scheduled', 'Overdue', 'Fulfilled', 'Released', 'Archived'];
    case 'opportunity':
    case 'entity':
      return ['Active', 'Incubating', 'On Hold', 'Dormant', 'Complete', 'Archived'];
    case 'project':
      return ['Active', 'Blocked', 'Waiting', 'On Hold', 'Complete', 'Archived'];
    case 'goal':
      return ['Active', 'On Hold', 'Complete', 'Archived'];
    case 'reminder':
    case 'bill':
      return ['Scheduled', 'Waiting', 'Complete', 'Archived'];
    default:
      return ['Inbox', 'Next', 'Active', 'Waiting', 'Delegated', 'Blocked',
              'Scheduled', 'On Hold', 'Someday', 'Complete', 'Archived'];
  }
}

/* ---- Which fields a card actually has ------------------------ */
export type FieldKind = 'text' | 'longtext' | 'date' | 'select' | 'areas' | 'tags' | 'person';

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldKind;
  options?: readonly string[];
  /** Rendered together under one heading. */
  group: 'Essentials' | 'Context' | 'People & links';
  /** Shown in view mode even when empty, because the absence matters. */
  showWhenEmpty?: boolean;
}

const COMMON: FieldSpec[] = [
  { key: 'importance', label: 'Importance', type: 'select', options: IMPORTANCE, group: 'Essentials' },
  { key: 'attentionType', label: 'Needs', type: 'select', options: ATTENTION, group: 'Essentials' },
  { key: 'dueDate', label: 'Due', type: 'date', group: 'Essentials' },
  { key: 'owner', label: 'Owner', type: 'select', options: OWNER, group: 'Essentials' },
  { key: 'lifeAreas', label: 'Life areas', type: 'areas', group: 'Context' },
  { key: 'nextAction', label: 'Next move', type: 'text', group: 'Context', showWhenEmpty: true },
  { key: 'tags', label: 'Tags', type: 'tags', group: 'Context' },
  { key: 'notes', label: 'Notes', type: 'longtext', group: 'Context' },
];

const BY_KIND: Partial<Record<CardKind, FieldSpec[]>> = {
  commitment: [
    { key: 'direction', label: 'Direction', type: 'select', options: ['I Owe', 'They Owe'], group: 'Essentials' },
    { key: 'personId', label: 'With', type: 'person', group: 'People & links' },
    { key: 'organization', label: 'Organisation', type: 'text', group: 'People & links' },
    { key: 'followUpDate', label: 'Follow up', type: 'date', group: 'Essentials' },
  ],
  delegation: [
    { key: 'personId', label: 'Delegated to', type: 'person', group: 'People & links' },
    { key: 'definitionOfDone', label: 'Definition of done', type: 'longtext', group: 'Context' },
    { key: 'checkInDate', label: 'Check in', type: 'date', group: 'Essentials' },
  ],
  project: [
    { key: 'objective', label: 'Objective', type: 'longtext', group: 'Context' },
    { key: 'nextMilestone', label: 'Next milestone', type: 'text', group: 'Context' },
    { key: 'milestoneDate', label: 'Milestone date', type: 'date', group: 'Essentials' },
    { key: 'decisionRequired', label: 'Decision required', type: 'text', group: 'Context' },
    { key: 'blockers', label: 'Blockers', type: 'longtext', group: 'Context' },
  ],
  opportunity: [
    { key: 'nextMove', label: 'Next move', type: 'text', group: 'Context', showWhenEmpty: true },
    { key: 'organization', label: 'Organisation', type: 'text', group: 'People & links' },
    { key: 'oppType', label: 'Type', type: 'text', group: 'Essentials' },
    { key: 'decisionMaker', label: 'Decision maker', type: 'text', group: 'People & links' },
  ],
  task: [
    { key: 'recurrence', label: 'Repeats', type: 'text', group: 'Context' },
  ],
  goal: [
    { key: 'whyItMatters', label: 'Why it matters', type: 'longtext', group: 'Context' },
    { key: 'successMeasure', label: 'Measured by', type: 'text', group: 'Context' },
    { key: 'horizon', label: 'Horizon', type: 'text', group: 'Essentials' },
  ],
  bill: [
    { key: 'category', label: 'Category', type: 'text', group: 'Essentials' },
    { key: 'recurrence', label: 'Repeats', type: 'text', group: 'Context' },
  ],
};

export function fieldsFor(kind: CardKind): FieldSpec[] {
  const status: FieldSpec = {
    key: 'status', label: 'Status', type: 'select',
    options: statusesFor(kind), group: 'Essentials',
  };
  return [status, ...(BY_KIND[kind] ?? []), ...COMMON];
}

export const GROUPS = ['Essentials', 'Context', 'People & links'] as const;
