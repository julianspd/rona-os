/* ============================================================
   BUILD STATUS — real project data
   ------------------------------------------------------------
   NOTE ON LOCATION: this lives in src/data/, not src/fixtures/.
   Everything in fixtures/ is invented demo content. This is the
   actual state of the work. Keeping the two apart means "is this
   real?" never has to be asked twice.
   ============================================================ */

export type BuildStatus = 'built' | 'partial' | 'next' | 'blocked' | 'later' | 'ruled-out';

export const STATUS_LABEL: Record<BuildStatus, string> = {
  built: 'Working now',
  partial: 'Partly there',
  next: 'Next up',
  blocked: 'Waiting on a decision',
  later: 'Deliberately later',
  'ruled-out': 'Ruled out',
};

export interface BuildItem {
  id: string;
  title: string;
  group: string;
  status: BuildStatus;
  /** Plain language. What it does, or what is missing. */
  note: string;
  /** Decision id that has to be answered first. */
  blockedBy?: string;
}

export interface Decision {
  id: string;
  question: string;
  owner: string;
  /** Why it matters — what changes depending on the answer. */
  consequence: string;
  gate: boolean;
  /** Settled on a call. Answered questions must stop being asked. */
  resolved?: { answer: string; on: string };
}

/* ---- The last review this reflects ------------------------- */
export const REVIEW = {
  lastReview: '16 August 2026',
  prepared: 'Julian',
  stage: 'High-fidelity prototype on invented data',
};

/** Where answered decisions are sent. Change this and nothing else. */
export const SEND_TO = {
  email: 'julian@thededicationagency.com',
  name: 'Julian',
};

/* ============================================================
   Features
   ============================================================ */

export const ITEMS: BuildItem[] = [
  /* ---- The daily loop ---- */
  { id: 'home', group: 'The daily loop', status: 'built', title: 'Home — the morning briefing',
    note: 'Greeting, anything overdue, top three, what needs deciding or reviewing, today’s schedule, what she owes and is owed. Everything else sits behind one line she can open.' },
  { id: 'capture', group: 'The daily loop', status: 'built', title: 'Capture',
    note: 'One line of text from anywhere, on desktop or phone. Suggests a type and says why. Files nothing on its own yet — the ambition is that it files correctly by itself, which comes after the suggestions have proved trustworthy.' },
  { id: 'inbox', group: 'The daily loop', status: 'built', title: 'Inbox',
    note: 'Holding area for captured thoughts. Each one files as the type it was marked, and can be redirected in one tap.' },
  { id: 'commitments', group: 'The daily loop', status: 'built', title: 'Commitments',
    note: 'What she owes against what she is waiting on, kept visually distinct. Plus overdue, due this week, and high importance.' },
  { id: 'people', group: 'The daily loop', status: 'built', title: 'People',
    note: 'Searchable. Defaults to who is furthest past the contact rhythm their relationship deserves, rather than to alphabetical.' },
  { id: 'tasks', group: 'The daily loop', status: 'built', title: 'Tasks',
    note: 'Split by hers, delegated, waiting on someone, and could be delegated.' },
  { id: 'search', group: 'The daily loop', status: 'built', title: 'Search',
    note: 'Across everything at once, with enough context in each result to tell things apart.' },
  { id: 'today', group: 'The daily loop', status: 'partial', title: 'Today',
    note: 'Shows meetings, what is due, and what is overdue. Not yet a command centre — no meeting context, linked documents or notes.' },

  /* ---- Life areas ---- */
  { id: 'projects', group: 'Life areas', status: 'built', title: 'Work & projects',
    note: 'Active work with a derived at-risk view and a decisions-needed view.' },
  { id: 'opps', group: 'Life areas', status: 'built', title: 'Opportunities',
    note: 'Pipeline by stage. Anything without a next move is flagged, because that absence is the finding.' },
  { id: 'entities', group: 'Life areas', status: 'built', title: 'Ventures, consulting, nonprofit, properties, vehicles, travel',
    note: 'Six areas, one consistent layout. Each shows status, next action, people, commitments, reminders and documents.' },
  { id: 'bills', group: 'Life areas', status: 'built', title: 'Bills & obligations',
    note: 'Name, due date, amount, category, recurrence, payment status, reminder schedule and who pays. Amounts can be hidden entirely.' },
  { id: 'renewals', group: 'Life areas', status: 'built', title: 'Renewals & life admin',
    note: 'Everything coming due in the next ninety days, laid out by how close it is.' },
  { id: 'goals', group: 'Life areas', status: 'built', title: 'Goals',
    note: 'Flags any goal with no project attached — stated, but not actually being worked on.' },
  { id: 'docs', group: 'Life areas', status: 'built', title: 'Documents & decision log',
    note: 'Documents surface from the thing they belong to. Decisions record what was chosen, why, and when to revisit.' },

  /* ---- Foundations ---- */
  { id: 'undo', group: 'Foundations', status: 'built', title: 'Undo on every change',
    note: 'Nothing is ever hard-deleted. Every action can be reversed for a few seconds after it happens.' },
  { id: 'mobile', group: 'Foundations', status: 'built', title: 'Phone experience',
    note: 'A genuine phone layout with capture at the centre of the bar. Confirmed as the primary way she will use this, so the phone view leads and the desktop follows.' },
  { id: 'design', group: 'Foundations', status: 'built', title: 'Visual system',
    note: 'Editorial and restrained. Gold means importance and ownership; a separate, quieter scale carries urgency.' },
  { id: 'ai', group: 'Foundations', status: 'partial', title: 'Suggestions',
    note: 'Capture suggests a type and shows its reasoning, but the rules are hand-written. Nothing is learning yet, and the stalled, at-risk and dormant labels are written into the demo data by hand.' },

  /* ---- Next, and buildable now ---- */
  { id: 'calendar', group: 'Next', status: 'next', title: 'Calendar view',
    note: 'A read-only week and month so the shape of her time is visible, ahead of connecting the real one.' },
  { id: 'today-plus', group: 'Next', status: 'next', title: 'Today as a command centre',
    note: 'Meeting context, the people and documents attached to it, and somewhere for notes to land afterwards.' },
  { id: 'weekly', group: 'Next', status: 'next', title: 'Weekly review',
    note: 'The Friday sit-down: wins, misses, what stalled, what she is owed, and next week’s big three. This is what turns the system into a habit.' },
  { id: 'brief', group: 'Next', status: 'next', title: 'Meeting briefs',
    note: 'Before a meeting: who this person is, what you owe each other, what is open between you.' },

  { id: 'snooze', group: 'Next', status: 'next', title: 'Being told when you keep postponing something',
    note: 'After the third snooze the item stops going quiet and asks directly: kill it, keep it, or hand it to someone. Rona named this as the habit she wants the system to call out, so it should be blunt rather than gentle.' },
  { id: 'timezones', group: 'Next', status: 'next', title: 'The other person’s local time',
    note: 'On contacts, and on anything with someone waiting at the other end, so a follow-up is not sent at their 3am.' },
  { id: 'birthdays', group: 'Next', status: 'next', title: 'Birthdays and important dates in one place',
    note: 'Replaces checking Instagram stories, Facebook and two calendars every morning. One view, one list, gift ideas alongside.' },

  /* ---- Blocked on a decision ---- */
  { id: 'data', group: 'Real data', status: 'blocked', blockedBy: 'accounts', title: 'Saved data',
    note: 'Right now nothing persists — refreshing resets everything. Supabase, owned by Rona, roughly $10–15 a month, with two-factor set up alongside Jonathan.' },
  { id: 'submit', group: 'Real data', status: 'blocked', blockedBy: 'accounts', title: 'Answers arriving on their own',
    note: 'Sending your answers currently opens your email with everything filled in — you still press send. Having them land straight in an inbox, with no step in between, needs the database set up first.' },
  { id: 'login', group: 'Real data', status: 'blocked', blockedBy: 'accounts', title: 'Login',
    note: 'No accounts exist yet. Required before any real information goes in.' },
  { id: 'gcal', group: 'Real data', status: 'blocked', blockedBy: 'employer', title: 'Google Calendar',
    note: 'The single most valuable connection — it is where she actually lives, and it is currently doing a task manager’s job. Four calendars to pull from, either merged or kept as separate layers.' },
  { id: 'gmail', group: 'Real data', status: 'blocked', blockedBy: 'employer', title: 'Gmail',
    note: 'Read-only on the existing inbox — no new account. Surfaces what needs a reply without sending, deleting or reorganising anything.' },
  { id: 'drive', group: 'Real data', status: 'blocked', blockedBy: 'employer', title: 'Drive & Docs',
    note: 'Attach files and meeting transcripts to the right people and meetings without copying anything.' },

  /* ---- Deliberately later ---- */
  { id: 'slack', group: 'Ruled out', status: 'ruled-out', title: 'Slack',
    note: 'Her company IT will not permit an outside app. This is settled rather than postponed — anything arriving from Slack will have to be shared in by hand.' },
  { id: 'messaging', group: 'Deliberately later', status: 'later', title: 'WhatsApp & iMessage',
    note: 'Her personal accounts still cannot be read directly. But a separate number dedicated to the system can receive messages properly, which is a real route rather than a workaround — worth trying once the database exists.' },
  { id: 'meetings', group: 'Deliberately later', status: 'later', title: 'Zoom & transcripts',
    note: 'Transcripts already land in Google Docs, so connecting Drive covers most of this.' },
  { id: 'family', group: 'Deliberately later', status: 'later', title: 'Family calendar & Telegram assistant',
    note: 'Agreed to leave the existing family setup untouched during the first pilot.' },
  { id: 'career', group: 'Deliberately later', status: 'later', title: 'Evidence bank & career record',
    note: 'A place to capture wins as they happen, so a CV, bio or nomination never has to be rebuilt from memory.' },
  { id: 'money', group: 'Deliberately later', status: 'later', title: 'Anything financial beyond bills',
    note: 'Forecasting, planning and account aggregation stay out until the bills feature has proved useful.' },
];

/* ============================================================
   Open decisions
   ============================================================ */

export const DECISIONS: Decision[] = [
  {
    id: 'employer', gate: true, owner: 'Rona',
    question: 'Are her Gmail and Calendar personal accounts, or managed by her employer?',
    consequence: 'This is now the question everything rests on. Her company has already refused Slack, so if Google is company-managed too, the same answer likely applies and the whole connected plan needs rethinking. If those accounts are personal, none of that applies and we can proceed.',
  },
  {
    id: 'slack-control', gate: true, owner: 'Rona',
    question: 'Is the Slack workspace controlled by her company?',
    consequence: 'If it is, Slack becomes an approval process rather than a piece of work we can schedule.',
    resolved: { on: '16 August 2026', answer: 'Yes, and her company IT will not permit an outside app. Slack is out of scope — not deferred, closed.' },
  },
  {
    id: 'top3', gate: false, owner: 'Rona',
    question: 'Which three things must be on Home every single morning?',
    consequence: 'The highest-value question on this list. The answer could reorder the entire screen, and we have just spent a cycle refining that order.',
  },
  {
    id: 'hide', gate: false, owner: 'Rona',
    question: 'Which parts of Home would she happily never see by default?',
    consequence: 'Home is already collapsed to a briefing. This tells us whether we collapsed the right things.',
  },
  {
    id: 'accounts', gate: false, owner: 'Rona & Kavas',
    question: 'Who owns the database, hosting and code accounts?',
    consequence: 'These should be in her name or her organisation’s, with the development team invited in. Nothing real should be stored until this is settled.',
    resolved: { on: '16 August 2026', answer: 'Rona owns the Supabase account and server, roughly $10–15 a month. Security and two-factor setup to be done with Jonathan.' },
  },
  {
    id: 'gmail-fresh', gate: false, owner: 'Rona',
    question: 'Start a fresh Gmail inbox, or connect the existing one?',
    consequence: 'A fresh inbox is a separate migration project with its own plan, not a setting we switch on.',
    resolved: { on: '16 August 2026', answer: 'No new account. Connect the existing inbox, read-only, so notifications surface without anything being sent, moved or reorganised.' },
  },
  {
    id: 'calendar-truth', gate: false, owner: 'Rona',
    question: 'Of the four calendars, which is the authoritative one?',
    consequence: 'We know there are four and that we can either consolidate them or read all four. Still open is which one wins when they disagree, and which should stay out of the work view entirely.',
  },
  {
    id: 'amounts', gate: false, owner: 'Rona',
    question: 'Should bill amounts be stored, or only due dates and paid status?',
    consequence: 'Built to work either way, so she can decide by using it rather than in the abstract.',
  },
  {
    id: 'paid-by', gate: false, owner: 'Rona',
    question: 'Who marks a bill as paid — her, or someone else?',
    consequence: 'Changes whether bills need to be shared with anyone, which changes when access controls are needed.',
  },
];

/* ============================================================
   Suggested shape for the review
   ============================================================ */

export const AGENDA: { minutes: number; what: string; why: string }[] = [
  { minutes: 10, what: 'Open Home cold', why: 'Can she say what her day looks like without being talked through it? That is the whole product test.' },
  { minutes: 5, what: 'Commitments', why: 'Does owing someone versus waiting on someone match how she actually thinks about obligations?' },
  { minutes: 5, what: 'Capture three real thoughts', why: 'Is it genuinely faster than her pen? That is the bar it has to clear.' },
  { minutes: 10, what: 'Bills', why: 'Are these the right fields, and does she want the amounts stored at all?' },
  { minutes: 20, what: 'The open decisions', why: 'Particularly the employer question — a no there changes everything downstream.' },
];
