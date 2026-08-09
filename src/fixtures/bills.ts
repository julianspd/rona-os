/* ============================================================
   Fixtures — Bills & obligations
   The first financial feature: stop a bill being missed.

   Content rules (PRD §13) apply with no exceptions here:
   no account numbers, no institutions, no card details, no
   balances, no payment credentials. Names, dates and amounts only.
   Dated against FIXED_TODAY = 2026-07-31.
   ============================================================ */

import type { Bill } from '../types';

const B = {
  kind: 'bill' as const,
  owner: 'Me' as const,
  relatedIds: [] as string[],
  tags: [] as string[],
  flags: [],
  importance: 'Normal' as const,
  status: 'Scheduled' as const,
  attentionType: 'Do' as const,
};

/* Standard ladders. Anything Rona cannot fix in a day gets more notice. */
const SOON = [14, 7, 3, 0];
const AHEAD = [30, 14, 7, 0];
const LONG = [60, 30, 14, 7, 0];

export const bills: Bill[] = [
  /* ---- Overdue — the state the feature exists to prevent ---- */
  {
    ...B, id: 'b1', title: 'Lakeside Unit — quarterly HOA dues',
    category: 'Property', amount: 940, recurrence: 'Quarterly',
    dueDate: '2026-07-28', paymentStatus: 'Due',
    reminderDays: AHEAD, parentId: 'e6', paidBy: 'Rona',
    importance: 'High', lifeAreas: ['Property', 'Money'],
    lastTouched: '2026-07-01', linkLabel: 'Payment page',
  },

  /* ---- Due today ---- */
  {
    ...B, id: 'b2', title: 'Quarterly estimated tax payment',
    category: 'Tax', amount: 6200, recurrence: 'Quarterly',
    dueDate: '2026-07-31', paymentStatus: 'Due',
    reminderDays: LONG, paidBy: 'Rona, with Wilhelmina',
    importance: 'Critical', lifeAreas: ['Money'],
    lastTouched: '2026-07-24', relatedIds: ['c35'],
  },

  /* ---- Within the week ---- */
  {
    ...B, id: 'b3', title: 'Gym membership',
    category: 'Health', amount: 185, recurrence: 'Monthly',
    dueDate: '2026-08-07', paymentStatus: 'Autopay',
    reminderDays: [7, 0], lifeAreas: ['Health', 'Money'],
    lastTouched: '2026-07-07',
  },
  {
    ...B, id: 'b4', title: 'The Sedan — registration renewal',
    category: 'Vehicle', amount: 412, recurrence: 'Annual',
    dueDate: '2026-08-30', paymentStatus: 'Scheduled',
    reminderDays: LONG, parentId: 'e8', paidBy: 'Rona',
    importance: 'High', lifeAreas: ['Vehicles', 'Money'],
    lastTouched: '2026-07-06', linkLabel: 'Renewal notice',
  },

  /* ---- Within the month ---- */
  {
    ...B, id: 'b5', title: 'Lakeside Unit — utilities',
    category: 'Property', amount: 268, recurrence: 'Monthly',
    dueDate: '2026-08-12', paymentStatus: 'Autopay',
    reminderDays: SOON, parentId: 'e6', lifeAreas: ['Property', 'Money'],
    lastTouched: '2026-07-12',
  },
  {
    ...B, id: 'b6', title: 'The Cottage — utilities',
    category: 'Property', amount: 134, recurrence: 'Monthly',
    dueDate: '2026-08-15', paymentStatus: 'Autopay',
    reminderDays: SOON, parentId: 'e7', lifeAreas: ['Property', 'Money'],
    lastTouched: '2026-07-15',
  },
  {
    ...B, id: 'b7', title: 'Coastline Provisions — public liability cover',
    category: 'Insurance', amount: 1450, recurrence: 'Annual',
    dueDate: '2026-08-22', paymentStatus: 'Scheduled',
    reminderDays: LONG, parentId: 'e1', paidBy: 'Ellery',
    lifeAreas: ['Ventures', 'Money'], lastTouched: '2026-07-19',
  },
  {
    ...B, id: 'b8', title: 'Professional association dues',
    category: 'Professional', amount: 640, recurrence: 'Annual',
    dueDate: '2026-08-25', paymentStatus: 'Scheduled',
    reminderDays: AHEAD, lifeAreas: ['Career', 'Money'],
    lastTouched: '2026-06-25',
  },

  /* ---- Beyond thirty days ---- */
  {
    ...B, id: 'b9', title: 'The Cottage — home insurance renewal',
    category: 'Insurance', amount: 2180, recurrence: 'Annual',
    dueDate: '2026-09-29', paymentStatus: 'Scheduled',
    reminderDays: LONG, parentId: 'e7', paidBy: 'Rona',
    importance: 'High', lifeAreas: ['Property', 'Money'],
    lastTouched: '2026-07-18', relatedIds: ['c23'],
  },
  {
    ...B, id: 'b10', title: 'The Wagon — insurance renewal',
    category: 'Vehicle', amount: 1120, recurrence: 'Annual',
    dueDate: '2026-10-04', paymentStatus: 'Scheduled',
    reminderDays: LONG, parentId: 'e11', lifeAreas: ['Vehicles', 'Money'],
    lastTouched: '2026-07-02',
  },
  {
    ...B, id: 'b11', title: 'Lakeside Unit — property tax instalment',
    category: 'Property', amount: 3840, recurrence: 'Twice yearly',
    dueDate: '2026-11-01', paymentStatus: 'Scheduled',
    reminderDays: LONG, parentId: 'e6', paidBy: 'Rona',
    importance: 'High', lifeAreas: ['Property', 'Money'],
    lastTouched: '2026-05-01',
  },
  {
    ...B, id: 'b12', title: 'Newsletter and research subscriptions',
    category: 'Subscription', amount: 96, recurrence: 'Monthly',
    dueDate: '2026-09-14', paymentStatus: 'Autopay',
    reminderDays: [7, 0], lifeAreas: ['Learning', 'Money'],
    lastTouched: '2026-07-14',
  },
  {
    ...B, id: 'b13', title: 'Streaming and household services',
    category: 'Subscription', amount: 74, recurrence: 'Monthly',
    dueDate: '2026-09-02', paymentStatus: 'Autopay',
    reminderDays: [7, 0], lifeAreas: ['Personal', 'Money'],
    lastTouched: '2026-07-02',
  },
  {
    ...B, id: 'b14', title: 'Coastline Provisions — co-packer invoice',
    category: 'Venture', amount: 2760, recurrence: 'Per production run',
    dueDate: '2026-09-08', paymentStatus: 'Scheduled',
    reminderDays: AHEAD, parentId: 'e1', paidBy: 'Ellery',
    lifeAreas: ['Ventures', 'Money'], lastTouched: '2026-07-27',
  },

  /* ---- Recently settled — the record that builds trust ---- */
  {
    ...B, id: 'b15', title: 'Lakeside Unit — quarterly HOA dues',
    category: 'Property', amount: 940, recurrence: 'Quarterly',
    dueDate: '2026-04-28', paymentStatus: 'Paid', paidOn: '2026-04-26',
    status: 'Complete', reminderDays: AHEAD, parentId: 'e6',
    lifeAreas: ['Property', 'Money'], lastTouched: '2026-04-26',
  },
  {
    ...B, id: 'b16', title: 'Quarterly estimated tax payment',
    category: 'Tax', amount: 5900, recurrence: 'Quarterly',
    dueDate: '2026-04-30', paymentStatus: 'Paid', paidOn: '2026-04-29',
    status: 'Complete', reminderDays: LONG,
    lifeAreas: ['Money'], lastTouched: '2026-04-29',
  },
  {
    ...B, id: 'b17', title: 'The Sedan — annual service',
    category: 'Vehicle', amount: 680, recurrence: 'Annual',
    dueDate: '2026-06-12', paymentStatus: 'Paid', paidOn: '2026-06-12',
    status: 'Complete', reminderDays: AHEAD, parentId: 'e8',
    lifeAreas: ['Vehicles', 'Money'], lastTouched: '2026-06-12',
  },
];
