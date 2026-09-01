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
  lastCall: '30 August 2026',
  updated: '2 September 2026',
  prepared: 'Julian',
  stage: 'High-fidelity prototype on invented data',
};

/** One paragraph, for anyone who reads nothing else on this page. */
export const STANDING = `Supabase exists and Rona owns it, and her personal
Gmail is confirmed personal — so the email track is unblocked and the ingestion
pipeline can start now, before any credential arrives. What is still open is
mostly consent rather than engineering: which inbox is home, whether the system
may reply as well as read, and how far back the first sync should reach.`;

/* ---- What changed since the last call ------------------------
   Put first because it is what anyone actually opens this page
   for. The full inventory below is reference, not news. */
export const RECENT: { title: string; note: string; asked: boolean }[] = [
  { asked: true, title: 'Being told when you keep postponing something',
    note: 'Every snooze is counted. On the third the item asks outright — drop it, keep it and mean it, or hand it off. Keeping raises its importance, so recommitting costs something.' },
  { asked: true, title: 'The other person’s local time',
    note: 'On every contact, live. Turns amber and says “likely asleep” outside their working hours, so a follow-up never lands at somebody’s 3am.' },
  { asked: true, title: 'Birthdays and important dates',
    note: 'Fourteen across the contacts, ordered by what is next, with gift notes. Anyone with a date inside a week also surfaces on Home.' },
  { asked: true, title: 'Built for the phone first',
    note: 'Confirmed as the primary surface, so the layout was rebuilt around it. This also took four rounds to get right — the page was blank on the handset because the navigation bar was covering the whole screen. One missing line; everything had been rendering underneath the entire time.' },
  { asked: true, title: 'Capture floats above the keyboard',
    note: 'It was sitting behind it. iOS does not shrink the page when the keyboard opens, so the sheet now measures the keyboard and sits on top of it.' },
  { asked: false, title: 'The weekly review',
    note: 'In the sidebar, with a gold dot once a week has passed without one — a review that has to be found does not get done. The Friday sit-down, already answered from your own data. Two decisions only: which three things next week, and what to stop carrying. Closing it sets your three, drops what you chose, and keeps a record. This is the one that turns the system into a habit.' },
  { asked: false, title: 'Dropped & postponed',
    note: 'There was no way to see anything dropped, which made “nothing is destroyed” an empty promise. Everything dropped can now be brought back, and everything being pushed is listed with its count.' },
  { asked: false, title: 'Editing anything, in place',
    note: 'Opening an item gives a proper record with every field clickable where it sits — colour-coded menus on a pointer, bottom sheets on a phone. No edit mode to enter, and changes save as you make them.' },
  { asked: false, title: 'Every screen has an address',
    note: 'The URL follows you. Back and forward work, a refresh lands where you were, and any screen can be sent as a link.' },
  { asked: false, title: 'Spheres grouped',
    note: 'Eighteen tiles became three groups — where the work is, what comes due, and the longer view. Build status and the design system moved to the foot of the page; they are ours, not Rona’s.' },
];

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
  { id: 'weekly', group: 'Life areas', status: 'built', title: 'Weekly review',
    note: 'In the sidebar, with a gold dot once a week has passed without one — a review that has to be found does not get done. The Friday sit-down, already answered from your own data — what closed, what went late, what stopped moving, who has gone quiet, what is coming due. Then the two decisions a review exists to force: which three things next week, and what to stop carrying. Closing it sets your three on Home, drops what you chose, and keeps a record so you can see the line between weeks.' },
  { id: 'docs', group: 'Life areas', status: 'built', title: 'Documents & decision log',
    note: 'Documents surface from the thing they belong to. Decisions record what was chosen, why, and when to revisit.' },

  /* ---- Foundations ---- */
  { id: 'snooze', group: 'The daily loop', status: 'built', title: 'Being told when you keep postponing something',
    note: 'Every postponement is counted. On the third the item stops going quiet and asks outright — drop it, keep it and mean it, or hand it off. Keeping it raises its importance, so recommitting costs something. Blunt on purpose.' },
  { id: 'timezones', group: 'The daily loop', status: 'built', title: 'The other person’s local time',
    note: 'On every contact, live, updating each minute. Turns amber and says “likely asleep” outside 8am to 9pm their time, so a follow-up never lands at their 3am. The hours difference shows on their full record.' },
  { id: 'birthdays', group: 'Life areas', status: 'built', title: 'Birthdays and important dates',
    note: 'One list, ordered by what is next, replacing the Instagram, Facebook and two-calendar morning check. Includes gift notes, because remembering the date is the easy half. Anyone with a date inside a week also surfaces on Home as worth reaching out to.' },
  { id: 'urls', group: 'Foundations', status: 'built', title: 'Every screen has an address',
    note: 'The URL follows you — /today, /commitments, /properties, /review. Back and forward work, a refresh lands where you were rather than at the top, and any screen can be sent as a link. The browser tab names the section too.' },
  { id: 'undo', group: 'Foundations', status: 'built', title: 'Undo, and a way back',
    note: 'Every action can be reversed for a few seconds afterwards. Past that, nothing is gone either — anything dropped, archived or completed sits under Dropped & postponed and can be brought back.' },
  { id: 'edit', group: 'Foundations', status: 'built', title: 'Viewing and editing an item',
    note: 'Opening anything shows a record grouped into essentials, context and people. Every field is its own control — click a status and the options appear where the status was, click a date and it becomes a calendar in place. No edit mode to enter. Options are colour coded: life areas and what an item needs get their own hues, importance shares the urgency ramp because it is the same question asked twice. On a phone the menus become bottom sheets. Changes save as they are made.' },
  { id: 'archive', group: 'Foundations', status: 'built', title: 'Dropped & postponed',
    note: 'Two lists that belong together. Everything dropped or finished, restorable. And everything currently being pushed down the road, with the count — the prompt on a card calls out one item, this is the habit seen whole.' },
  { id: 'mobile', group: 'Foundations', status: 'built', title: 'Phone experience',
    note: 'Now built for the phone first. Actions take their own row rather than fighting the title for width, every target is at least 44px, filters scroll in one row instead of wrapping into three, and the capture sheet stays above the keyboard. Add it to your home screen and it opens without Safari around it.' },
  { id: 'design', group: 'Foundations', status: 'built', title: 'Visual system',
    note: 'Editorial and restrained. Gold means importance and ownership; a separate, quieter scale carries urgency.' },
  { id: 'ai', group: 'Foundations', status: 'partial', title: 'Suggestions',
    note: 'Capture suggests a type and shows its reasoning, but the rules are hand-written. Nothing is learning yet, and the stalled, at-risk and dormant labels are written into the demo data by hand.' },

  /* ---- Next, and buildable now ---- */
  { id: 'calendar', group: 'Next', status: 'next', title: 'Calendar view',
    note: 'A read-only week and month so the shape of her time is visible, ahead of connecting the real one.' },
  { id: 'today-plus', group: 'Next', status: 'next', title: 'Today as a command centre',
    note: 'Meeting context, the people and documents attached to it, and somewhere for notes to land afterwards.' },
  { id: 'brief', group: 'Next', status: 'next', title: 'Meeting briefs',
    note: 'Before a meeting: who this person is, what you owe each other, what is open between you.' },

  { id: 'profiles', group: 'Life areas', status: 'built', title: 'Client profiles on contacts',
    note: 'Her template, section for section, editable in place. It switches on per contact rather than applying to everyone, because her own heading says top accounts and growth targets — decision power and reporting lines mean nothing for an aunt. Her document is called profile COMPLETION, so the product measures exactly that and names what is missing rather than showing a bare percentage.' },

  /* ---- Blocked on a decision ---- */
  { id: 'data', group: 'Real data', status: 'blocked', blockedBy: 'accounts', title: 'Saved data',
    note: 'The database now exists and Rona owns it. Free tier is roughly half a gigabyte, which is ample for recent mail and nowhere near enough for a 1999 archive — which is why the first sync should be date-bound rather than everything.' },
  { id: 'submit', group: 'Real data', status: 'blocked', blockedBy: 'accounts', title: 'Answers arriving on their own',
    note: 'Sending your answers currently opens your email with everything filled in — you still press send. Having them land straight in an inbox, with no step in between, needs the database set up first.' },
  { id: 'login', group: 'Real data', status: 'blocked', blockedBy: 'accounts', title: 'Login',
    note: 'No accounts exist yet. Required before any real information goes in.' },
  { id: 'gcal', group: 'Real data', status: 'next', title: 'Google Calendar',
    note: 'The single most valuable connection — it is where she actually lives, and it is currently doing a task manager’s job. Four calendars to pull from, either merged or kept as separate layers.' },
  { id: 'ingest', group: 'Real data', status: 'next', title: 'Reading her email',
    note: 'Three personal inboxes, read over a standard mail connection rather than a “Connect Google” button — one credential per inbox that she creates and can revoke herself, with no weekly re-approval and no Google review process. The pipeline can be built now: with no credential present it logs and exits cleanly, so none of the work waits on her.' },
  { id: 'reply', group: 'Real data', status: 'blocked', blockedBy: 'reply-consent', title: 'Replying from inside the system',
    note: 'Drafts a reply, threads it correctly so it does not detach in her Gmail, and sends only after she approves. The approval check sits in the sending code itself, so no screen or script can go around it.' },
  { id: 'drive', group: 'Real data', status: 'later', title: 'Drive & Docs',
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
    consequence: 'Everything rested on this. Her company had already refused Slack, so if Google were company-managed the same answer would likely have applied.',
    resolved: { on: '30 August 2026', answer: 'Personal, and there are three of them — mercadoare (main contact and outreach), ronacado (recruiter and consulting offers, rarely read) and rona.mercado (preferred for scheduling and outbound). All personal Gmail, so no IT department can block them. Her work email is a separate matter and stays out; forwarding is the only route in, and that is a policy question rather than a technical one.' },
  },
  {
    id: 'slack-control', gate: true, owner: 'Rona',
    question: 'Is the Slack workspace controlled by her company?',
    consequence: 'If it is, Slack becomes an approval process rather than a piece of work we can schedule.',
    resolved: { on: '16 August 2026', answer: 'Yes, and her company IT will not permit an outside app. Slack is out of scope — not deferred, closed.' },
  },
  {
    id: 'reply-consent', gate: true, owner: 'Rona',
    question: 'May the system reply as you, or only read?',
    consequence: 'The notes say read-only, but the credential we use grants sending too, and replying from inside the system is most of its value. Nothing would ever send without you pressing approve — and that check lives in the code that sends, not in a screen someone could route around. But it is a bigger permission than was agreed, so it needs a yes rather than an assumption.',
  },
  {
    id: 'mailbox-home', gate: true, owner: 'Rona',
    question: 'Which of the three inboxes is the system’s home, and which does it send from?',
    consequence: 'All three can be read. Only one should be the address replies come from, or people end up with threads split across two of your accounts. The notes point at rona.mercado, since that is already the one you use for scheduling and outbound.',
  },
  {
    id: 'work-forward', gate: true, owner: 'Rona',
    question: 'Does forwarding work email to a personal account breach your employer’s policy?',
    consequence: 'Technically it takes two minutes. But most IT policies prohibit it outright, and this is the department that just refused Slack. Worth knowing the answer before doing it rather than after — it is your call and your risk, and it should be a knowing one.',
  },
  {
    id: 'sync-window', gate: false, owner: 'Rona & Julian',
    question: 'How far back should the first sync reach?',
    consequence: 'The archive runs to 1999. Reading all of it would blow past the free database tier and cost real money to classify, most of it spent on decade-old calendar invites. Suggest the last twelve to twenty-four months to start. The older mail is a search problem, not a working set, and deserves its own answer later.',
  },
  {
    id: 'profile-depth', gate: false, owner: 'Rona',
    question: 'Does the full client profile apply to every contact, or only key accounts?',
    consequence: 'Your own template says “required for every top account and growth target”, which suggests the latter. Decision power and reporting lines mean nothing for your aunt or your contractor, and thirty empty fields on a personal contact make the record feel like a form. Suggest a base record for everyone, with the full profile switched on per contact.',
  },
  {
    id: 'strength-scale', gate: false, owner: 'Rona',
    question: 'Relationship strength — your 1 to 5, or the named tiers already built?',
    consequence: 'The system currently uses Inner Circle, Active, Warm, New and Dormant, and those names drive how often it nudges you. A number is easier to score and harder to act on. They can coexist, but one of them has to be the one that sets the rhythm.',
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
    resolved: { on: '30 August 2026', answer: 'Done. Rona created the Supabase account herself — free tier, personal organisation, Americas region — renamed the project Rona OS, and invited Julian and Jonathan as developers. The free tier is enough until real volume arrives.' },
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
  { minutes: 10, what: 'Open Home on her own phone', why: 'Can she say what her day looks like without being talked through it? That is the whole product test, and the phone is where she will actually do it.' },
  { minutes: 10, what: 'Walk a weekly review end to end', why: 'The newest thing here and the one most likely to decide whether this becomes a habit or a demo.' },
  { minutes: 5, what: 'Snooze something three times', why: 'She asked to be called out on this. Worth seeing whether the way it asks lands as helpful or as nagging.' },
  { minutes: 5, what: 'Capture three real thoughts', why: 'Is it genuinely faster than her pen? That is the bar it has to clear.' },
  { minutes: 20, what: 'The open decisions', why: 'Above all whether her Gmail and Calendar are personal or managed. A third of what is left waits on that answer.' },
];
