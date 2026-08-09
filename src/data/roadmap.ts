/* ============================================================
   BUILD STATUS — real project data
   ------------------------------------------------------------
   NOTE ON LOCATION: this lives in src/data/, not src/fixtures/.
   Everything in fixtures/ is invented demo content. This is the
   actual state of the work. Keeping the two apart means "is this
   real?" never has to be asked twice.
   ============================================================ */

export type BuildStatus = 'built' | 'partial' | 'next' | 'blocked' | 'later';

export const STATUS_LABEL: Record<BuildStatus, string> = {
  built: 'Working now',
  partial: 'Partly there',
  next: 'Next up',
  blocked: 'Waiting on a decision',
  later: 'Deliberately later',
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
}

/* ---- The last review this reflects ------------------------- */
export const REVIEW = {
  lastReview: '9 August 2026',
  prepared: 'Julian',
  stage: 'High-fidelity prototype on invented data',
};

/* ============================================================
   Features
   ============================================================ */

export const ITEMS: BuildItem[] = [
  /* ---- The daily loop ---- */
  { id: 'home', group: 'The daily loop', status: 'built', title: 'Home — the morning briefing',
    note: 'Greeting, anything overdue, top three, what needs deciding or reviewing, today’s schedule, what she owes and is owed. Everything else sits behind one line she can open.' },
  { id: 'capture', group: 'The daily loop', status: 'built', title: 'Capture',
    note: 'One line of text from anywhere, on desktop or phone. Suggests a type and says why it suggested it. Files nothing on its own.' },
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
    note: 'A genuine phone layout with capture at the centre of the bar, not a squeezed desktop screen.' },
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

  /* ---- Blocked on a decision ---- */
  { id: 'data', group: 'Real data', status: 'blocked', blockedBy: 'accounts', title: 'Saved data',
    note: 'Right now nothing persists — refreshing resets everything. Needs the database set up under her ownership.' },
  { id: 'login', group: 'Real data', status: 'blocked', blockedBy: 'accounts', title: 'Login',
    note: 'No accounts exist yet. Required before any real information goes in.' },
  { id: 'gcal', group: 'Real data', status: 'blocked', blockedBy: 'employer', title: 'Google Calendar',
    note: 'The single most valuable connection — it is where she actually lives, and it is currently doing a task manager’s job.' },
  { id: 'gmail', group: 'Real data', status: 'blocked', blockedBy: 'employer', title: 'Gmail',
    note: 'Read-only, and only messages she selects. Nothing sent, deleted or reorganised during the pilot.' },
  { id: 'drive', group: 'Real data', status: 'blocked', blockedBy: 'employer', title: 'Drive & Docs',
    note: 'Attach files and meeting transcripts to the right people and meetings without copying anything.' },

  /* ---- Deliberately later ---- */
  { id: 'slack', group: 'Deliberately later', status: 'later', title: 'Slack',
    note: 'Straightforward technically, but likely needs her employer’s approval to install anything.' },
  { id: 'messaging', group: 'Deliberately later', status: 'later', title: 'WhatsApp & iMessage',
    note: 'Neither can genuinely be connected — Apple offers no way in, and WhatsApp’s business tools do not reach a personal account. The realistic path is sharing a message into the system by hand.' },
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
    question: 'Does her employer allow outside apps to connect to Google Workspace?',
    consequence: 'If not, the Google-first plan does not work and the whole approach needs rethinking. Worth answering before any development time goes into it.',
  },
  {
    id: 'slack-control', gate: true, owner: 'Rona',
    question: 'Is the Slack workspace controlled by her company?',
    consequence: 'If it is, Slack becomes an approval process rather than a piece of work we can schedule.',
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
  },
  {
    id: 'gmail-fresh', gate: false, owner: 'Rona',
    question: 'Start a fresh Gmail inbox, or connect the existing one?',
    consequence: 'A fresh inbox is a separate migration project with its own plan, not a setting we switch on.',
  },
  {
    id: 'calendar-truth', gate: false, owner: 'Rona',
    question: 'Which calendar is the authoritative one?',
    consequence: 'Determines what Today and the calendar view treat as the truth when they disagree.',
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
