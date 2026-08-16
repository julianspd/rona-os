/* ============================================================
   Rona OS — card shapes
   PRD §7. This is a RENDERING CONTRACT, not a database schema.
   Plain in-memory objects. No persistence, no keys, no server.
   ============================================================ */

export type LifeArea =
  | 'Work' | 'Ventures' | 'Consulting' | 'Nonprofit' | 'Relationships'
  | 'Property' | 'Personal' | 'Vehicles' | 'Health' | 'Travel'
  | 'Money' | 'Brand' | 'Learning' | 'Career';

export type Importance = 'Critical' | 'High' | 'Normal' | 'Low';

export type AttentionType = 'Decide' | 'Review' | 'Connect' | 'Do' | 'Delegate' | 'Wait';

export type TimeHorizon = 'Today' | 'This Week' | 'This Month' | 'Later';

export type Owner = 'Me' | 'Delegated' | 'Waiting on other';

/* §11 — universal status vocabulary */
export type Status =
  | 'Inbox' | 'Next' | 'Active' | 'Waiting' | 'Delegated' | 'Blocked'
  | 'Scheduled' | 'On Hold' | 'Complete' | 'Archived'
  | 'Exploring' | 'Incubating' | 'Someday'
  | 'Open' | 'Follow-up scheduled' | 'Overdue' | 'Fulfilled' | 'Released'
  | 'Dormant' | 'Closed';

/* §7.3 — pre-authored in fixtures, NEVER computed (see PRD §3.2, R8) */
export type Flag =
  | 'stalled' | 'at-risk' | 'dormant' | 'postponed'
  | 'delegatable' | 'not-staffed' | 'revisit-due';

/* D.1 — the five-step urgency scale */
export type Urgency = 'overdue' | 'today' | 'soon' | 'upcoming' | 'later';

export type CardKind =
  | 'inbox' | 'task' | 'commitment' | 'delegation' | 'contact' | 'reminder'
  | 'note' | 'project' | 'opportunity' | 'entity' | 'goal' | 'document'
  | 'event' | 'interaction' | 'decision' | 'evidence' | 'bill';

/* ---- §7.3 attributes every card carries -------------------- */
export interface BaseCard {
  id: string;
  kind: CardKind;
  title: string;
  lifeAreas: LifeArea[];
  status: Status;
  importance: Importance;
  attentionType?: AttentionType;
  timeHorizon?: TimeHorizon;
  dueDate?: string;          // ISO, relative to FIXED_TODAY
  nextAction?: string;
  nextActionDate?: string;
  owner: Owner;
  relatedIds: string[];
  tags: string[];
  lastTouched: string;
  flags: Flag[];
  notes?: string;
  /** How many times this has been pushed down the road. Anything can be
      postponed, so this belongs on every card, not just reminders. */
  snoozeCount?: number;
}

/* ---- Tier 1 ------------------------------------------------ */

export interface InboxItem extends BaseCard {
  kind: 'inbox';
  capturedAt: string;
  hint?: 'Task' | 'Person' | 'Commitment' | 'Idea' | 'Renewal';
}

export interface Task extends BaseCard {
  kind: 'task';
  projectId?: string;
  recurrence?: string;
}

/** FR-COM-1 — direction is the dominant visual signal. */
export interface Commitment extends BaseCard {
  kind: 'commitment';
  direction: 'I Owe' | 'They Owe';
  personId: string;
  organization?: string;
  createdDate: string;
  followUpDate?: string;
}

export interface Delegation extends BaseCard {
  kind: 'delegation';
  personId: string;
  assignedDate: string;
  definitionOfDone: string;   // FR-DEL-1 — required, not optional
  checkInDate?: string;       // FR-DEL-3 — distinct from dueDate
  projectId?: string;
}

export type Strength = 'Inner Circle' | 'Active' | 'Warm' | 'New' | 'Dormant';

export type Channel = 'Gmail' | 'Slack' | 'WhatsApp' | 'iMessage' | 'Zoom' | 'Google Meet';

export interface Contact extends BaseCard {
  kind: 'contact';
  organization?: string;
  role?: string;
  strength: Strength;
  cadenceDays: number;        // FR-CRM-3 — lives in fixtures, see PRD H.6
  lastInteraction: string;
  city?: string;
  howWeMet?: string;
  theyCareAbout?: string;
  workingOn?: string;
  waysICanHelp?: string;
  importantDates?: { label: string; date: string }[];
  /** Kept because remembering is the easy part; knowing what to send is not. */
  giftIdeas?: string;
  /** How Rona actually reaches this person. Displayed as intent, not
      as a live connection — none of these are wired to anything. */
  channels?: Channel[];
  /** Overrides the city lookup when someone is not where you think. */
  timezone?: string;
}

export type ReminderKind =
  | 'one-time' | 'recurring' | 'due-date' | 'renewal'
  | 'follow-up' | 'waiting-on' | 'check-in' | 'preventive';

export interface Reminder extends BaseCard {
  kind: 'reminder';
  reminderKind: ReminderKind;
  parentId?: string;          // FR-REM-3 — vehicle / property / document
  recurrence?: string;
}

/* ---- Tier 2 ------------------------------------------------ */

export interface Project extends BaseCard {
  kind: 'project';
  objective?: string;
  stakeholderIds?: string[];
  nextMilestone?: string;
  milestoneDate?: string;
  decisionRequired?: string;
  blockers?: string;
  blockedDays?: number;
}

export type OpportunityStage =
  | 'Identified' | 'Intro Requested' | 'Connected' | 'Discovery'
  | 'Qualified' | 'Proposal/Scope' | 'Negotiation' | 'Decision Pending'
  | 'Won' | 'Lost' | 'Paused' | 'Nurture';

export interface Opportunity extends BaseCard {
  kind: 'opportunity';
  oppType: string;
  organization?: string;
  primaryContactId?: string;
  source?: string;
  strategicValue?: string;
  potentialValue?: string;
  probability?: number;
  stage: OpportunityStage;
  /** FR-OPP-2 — absence is the finding, so it is deliberately optional. */
  nextMove?: string;
  daysSinceMove?: number;
  decisionMaker?: string;
  outcome?: string;
}

export type EntityType =
  | 'venture' | 'consulting' | 'nonprofit' | 'property' | 'vehicle' | 'trip' | 'other';

/** §7.2 — one shape covers five of the brief's modules. */
export interface Entity extends BaseCard {
  kind: 'entity';
  entityType: EntityType;
  role?: string;
  whyItMatters?: string;      // FR-ENT-3
  contactIds?: string[];
  typeFields: Record<string, string>;
}

export interface Goal extends BaseCard {
  kind: 'goal';
  area: LifeArea;
  whyItMatters?: string;
  horizon?: string;
  successMeasure?: string;
  projectIds: string[];       // FR-GOL-2 — empty means "stated but not staffed"
  progress?: string;
}

export interface EventCard extends BaseCard {
  kind: 'event';
  start: string;
  time?: string;
  attendeeIds?: string[];
  layer?: string;
}

export interface DocumentCard extends BaseCard {
  kind: 'document';
  docType?: string;
  link?: string;              // FR-DOC-4 — link only, never a file
  expiresOn?: string;
  version?: string;
}

export interface Decision extends BaseCard {
  kind: 'decision';
  area?: string;
  context?: string;
  optionsConsidered?: string[];
  decisionMade?: string;
  rationale?: string;
  revisitDate?: string;
  outcome?: string;
}

export interface Interaction extends BaseCard {
  kind: 'interaction';
  personId: string;
  when: string;
  summary?: string;
}

/* ---- Bills & obligations -----------------------------------
   Deliberately narrow. The first financial feature exists to stop
   a bill being missed — not to model money. No account numbers,
   no balances, no institutions, no payment credentials. Ever.    */

export type BillCategory =
  | 'Household' | 'Property' | 'Vehicle' | 'Insurance' | 'Subscription'
  | 'Professional' | 'Health' | 'Tax' | 'Venture';

export type PaymentStatus = 'Scheduled' | 'Due' | 'Paid' | 'Autopay';

export interface Bill extends BaseCard {
  kind: 'bill';
  category: BillCategory;
  /** Optional by design — whether Rona wants amounts stored is an open
      question, so the interface works with or without them. */
  amount?: number;
  recurrence?: string;
  paymentStatus: PaymentStatus;
  paidOn?: string;
  /** Days before the due date at which this surfaces. */
  reminderDays: number[];
  /** A payment page or supporting document. Never a credential. */
  link?: string;
  linkLabel?: string;
  /** The property, vehicle or venture this belongs to. */
  parentId?: string;
  /** Who marks it paid — an open question worth making explicit. */
  paidBy?: string;
}

export type AnyCard =
  | InboxItem | Task | Commitment | Delegation | Contact | Reminder
  | Project | Opportunity | Entity | Goal | EventCard | DocumentCard
  | Decision | Interaction | Bill;

/* ---- Fixture-state toggle — FX-9 --------------------------- */
export type FixtureState = 'primary' | 'quiet';
