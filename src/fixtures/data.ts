/* ============================================================
   Fixtures — everything but contacts
   PRD Appendix E. All invented (MD-1). Aliases only (MD-2).
   No medical, financial or credential content (MD-3, §13).
   Dated against FIXED_TODAY = 2026-07-31.

   FX-8: every §9.1 Home section has at least one qualifying item.
   ============================================================ */

import type {
  Commitment, Task, Delegation, Reminder, Project, Opportunity,
  Entity, Goal, EventCard, DocumentCard, Decision, InboxItem,
} from '../types';

const B = {
  owner: 'Me' as const,
  relatedIds: [] as string[],
  tags: [] as string[],
  flags: [],
  importance: 'Normal' as const,
};

/* ============================================================
   COMMITMENTS — the differentiated object (FR-COM-*)
   ============================================================ */
export const commitments: Commitment[] = [
  /* E.3 — the overdue commitment. Home section 0. */
  {
    ...B, kind: 'commitment', id: 'cm1',
    title: 'Draft the autumn fundraising target and send it to Desmond',
    direction: 'I Owe', personId: 'c2', organization: 'Bayfront Youth Collective',
    createdDate: '2026-07-02', dueDate: '2026-07-20',
    status: 'Overdue', importance: 'Critical',
    lifeAreas: ['Nonprofit'], attentionType: 'Do',
    lastTouched: '2026-07-14', flags: [], relatedIds: ['e5', 'p6'],
  },
  /* E.3 — commitment with no due date, created 26 days ago (FR-COM-5) */
  {
    ...B, kind: 'commitment', id: 'cm2',
    title: 'Introduce Cyrus Bell to Ellery for the co-packer conversation',
    direction: 'I Owe', personId: 'c7',
    createdDate: '2026-07-05',
    status: 'Open', importance: 'High',
    lifeAreas: ['Ventures', 'Relationships'], attentionType: 'Connect',
    lastTouched: '2026-07-05', flags: [], relatedIds: ['c4'],
  },
  /* E.3 — Waiting On, aging 19 days */
  {
    ...B, kind: 'commitment', id: 'cm3',
    title: 'Introduction to Halden’s CFO ahead of the expansion conversation',
    direction: 'They Owe', personId: 'c1', organization: 'Halden Athletic',
    createdDate: '2026-07-12', followUpDate: '2026-07-26',
    status: 'Open', importance: 'High',
    lifeAreas: ['Consulting'], attentionType: 'Wait',
    lastTouched: '2026-07-12', flags: [], relatedIds: ['o1', 'c15'],
  },
  {
    ...B, kind: 'commitment', id: 'cm4',
    title: 'Thank-you note to Simone for the Fieldwork invitation',
    direction: 'I Owe', personId: 'c9',
    createdDate: '2026-07-19', dueDate: '2026-08-03',
    status: 'Open', lifeAreas: ['Brand'], attentionType: 'Do',
    lastTouched: '2026-07-19', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm5',
    title: 'Send Ellery the revised Coastline pricing sheet',
    direction: 'I Owe', personId: 'c4', organization: 'Coastline Provisions',
    createdDate: '2026-07-24', dueDate: '2026-08-08',
    status: 'Open', lifeAreas: ['Ventures'], attentionType: 'Do',
    lastTouched: '2026-07-27', flags: [], relatedIds: ['e1'],
  },
  {
    ...B, kind: 'commitment', id: 'cm6',
    title: 'Quote for the Lakeside Unit window repair',
    direction: 'They Owe', personId: 'c10',
    createdDate: '2026-07-25', followUpDate: '2026-08-06',
    status: 'Open', lifeAreas: ['Property'], attentionType: 'Wait',
    lastTouched: '2026-07-25', flags: [], relatedIds: ['e6'],
  },
  {
    ...B, kind: 'commitment', id: 'cm7',
    title: 'Send Priya the VP-track development plan we discussed',
    direction: 'I Owe', personId: 'c3', organization: 'Meridian Grove',
    createdDate: '2026-07-16', dueDate: '2026-09-04',
    status: 'Open', importance: 'High',
    lifeAreas: ['Work', 'Relationships'], attentionType: 'Do',
    lastTouched: '2026-07-30', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm8',
    title: 'Board deck section on programme outcomes',
    direction: 'They Owe', personId: 'c18', organization: 'Bayfront Youth Collective',
    createdDate: '2026-07-22', followUpDate: '2026-08-05',
    status: 'Open', lifeAreas: ['Nonprofit'], attentionType: 'Wait',
    lastTouched: '2026-07-22', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm9',
    title: 'Two introductions I promised Nadia when she moved',
    direction: 'I Owe', personId: 'c6',
    createdDate: '2026-03-06',
    status: 'Open', importance: 'High',
    lifeAreas: ['Relationships'], attentionType: 'Connect',
    lastTouched: '2026-03-06', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm10',
    title: 'Speaking abstract for the Fieldwork autumn programme',
    direction: 'I Owe', personId: 'c9',
    createdDate: '2026-07-19', dueDate: '2026-09-21',
    status: 'Open', lifeAreas: ['Brand', 'Career'], attentionType: 'Do',
    lastTouched: '2026-07-19', flags: [], relatedIds: ['o4'],
  },
  {
    ...B, kind: 'commitment', id: 'cm11',
    title: 'Revised insurance quote for The Cottage',
    direction: 'They Owe', personId: 'c23',
    createdDate: '2026-07-18', followUpDate: '2026-09-10',
    status: 'Open', lifeAreas: ['Property', 'Money'], attentionType: 'Wait',
    lastTouched: '2026-07-18', flags: [], relatedIds: ['e7'],
  },
  {
    ...B, kind: 'commitment', id: 'cm12',
    title: 'Portfolio images for the personal site refresh',
    direction: 'They Owe', personId: 'c25',
    createdDate: '2026-06-30', followUpDate: '2026-09-04',
    status: 'Open', lifeAreas: ['Brand'], attentionType: 'Wait',
    lastTouched: '2026-06-30', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm13',
    title: 'Send Joaquin the advisory scope outline before Chicago',
    direction: 'I Owe', personId: 'c8',
    createdDate: '2026-07-28', dueDate: '2026-08-11',
    status: 'Open', importance: 'High',
    lifeAreas: ['Consulting', 'Travel'], attentionType: 'Do',
    lastTouched: '2026-07-28', flags: [], relatedIds: ['o2', 'e9'],
  },
  {
    ...B, kind: 'commitment', id: 'cm14',
    title: 'Reference call for Yuki’s fractional CMO search',
    direction: 'I Owe', personId: 'c21',
    createdDate: '2026-07-21', dueDate: '2026-09-25',
    status: 'Open', lifeAreas: ['Career'], attentionType: 'Do',
    lastTouched: '2026-07-21', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm15',
    title: 'Grant reporting template from the Ardent Foundation',
    direction: 'They Owe', personId: 'c33',
    createdDate: '2026-07-14', followUpDate: '2026-09-13',
    status: 'Open', lifeAreas: ['Nonprofit'], attentionType: 'Wait',
    lastTouched: '2026-07-14', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm16',
    title: 'Confirm the Marchetti tasting date for the Coastline collaboration',
    direction: 'I Owe', personId: 'c32',
    createdDate: '2026-07-08', dueDate: '2026-09-04',
    status: 'Open', lifeAreas: ['Ventures'], attentionType: 'Do',
    lastTouched: '2026-07-08', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm17',
    title: 'Send Imani the two operating-role contacts I mentioned',
    direction: 'I Owe', personId: 'c11',
    createdDate: '2026-06-14', dueDate: '2026-09-18',
    status: 'Open', lifeAreas: ['Nonprofit', 'Relationships'], attentionType: 'Connect',
    lastTouched: '2026-06-14', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm18',
    title: 'Updated wholesale forecast for the autumn buy',
    direction: 'They Owe', personId: 'c16',
    createdDate: '2026-07-23', followUpDate: '2026-09-01',
    status: 'Open', lifeAreas: ['Ventures'], attentionType: 'Wait',
    lastTouched: '2026-07-23', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm19',
    title: 'Send Aunt Ines the photographs from the spring visit',
    direction: 'I Owe', personId: 'c12',
    createdDate: '2026-07-20', dueDate: '2026-09-12',
    status: 'Open', lifeAreas: ['Personal'], attentionType: 'Do',
    lastTouched: '2026-07-20', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm20',
    title: 'Legal review of the Fieldnote advisory template',
    direction: 'They Owe', personId: 'c27',
    createdDate: '2026-07-17', followUpDate: '2026-09-08',
    status: 'Open', lifeAreas: ['Consulting'], attentionType: 'Wait',
    lastTouched: '2026-07-17', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm21',
    title: 'Send Harriet the brand architecture point of view',
    direction: 'I Owe', personId: 'c13', organization: 'Meridian Grove',
    createdDate: '2026-07-28', dueDate: '2026-08-05',
    status: 'Open', importance: 'High',
    lifeAreas: ['Work'], attentionType: 'Do',
    lastTouched: '2026-07-28', flags: [],
  },
  {
    ...B, kind: 'commitment', id: 'cm22',
    title: 'Warm introduction to the Nordvik board search',
    direction: 'They Owe', personId: 'c31',
    createdDate: '2026-04-04', followUpDate: '2026-09-30',
    status: 'Open', lifeAreas: ['Career'], attentionType: 'Wait',
    lastTouched: '2026-04-04', flags: [],
  },
];

/* ============================================================
   EVENTS — Home section 4
   ============================================================ */
export const events: EventCard[] = [
  { ...B, kind: 'event', id: 'ev1', title: 'Priya — 1:1', start: '2026-07-31', time: '10:00',
    status: 'Scheduled', lifeAreas: ['Work'], lastTouched: '2026-07-29', flags: [], attendeeIds: ['c3'], layer: 'Professional' },
  { ...B, kind: 'event', id: 'ev2', title: 'Bayfront board call', start: '2026-07-31', time: '14:30',
    status: 'Scheduled', lifeAreas: ['Nonprofit'], lastTouched: '2026-07-28', flags: [], attendeeIds: ['c2', 'c18'], layer: 'Nonprofit' },
  { ...B, kind: 'event', id: 'ev3', title: 'Coastline packaging review with Ellery', start: '2026-08-01', time: '09:30',
    status: 'Scheduled', lifeAreas: ['Ventures'], lastTouched: '2026-07-27', flags: [], attendeeIds: ['c4'], layer: 'Venture' },
  { ...B, kind: 'event', id: 'ev4', title: 'Q4 launch steering group', start: '2026-08-03', time: '11:00',
    status: 'Scheduled', lifeAreas: ['Work'], lastTouched: '2026-07-30', flags: [], layer: 'Professional' },
  { ...B, kind: 'event', id: 'ev5', title: 'Annual physical', start: '2026-08-06', time: '08:15',
    status: 'Scheduled', lifeAreas: ['Health'], lastTouched: '2026-07-02', flags: [], attendeeIds: ['c29'], layer: 'Health' },
  { ...B, kind: 'event', id: 'ev6', title: 'Strength session — standing Tuesday', start: '2026-08-04', time: '07:00',
    status: 'Scheduled', lifeAreas: ['Health'], lastTouched: '2026-07-29', flags: [], attendeeIds: ['c30'], layer: 'Health' },
  { ...B, kind: 'event', id: 'ev7', title: 'Fly to Chicago', start: '2026-08-12', time: '06:40',
    status: 'Scheduled', lifeAreas: ['Travel'], lastTouched: '2026-07-26', flags: [], layer: 'Travel' },
  { ...B, kind: 'event', id: 'ev8', title: 'Halden expansion working session', start: '2026-08-13', time: '13:00',
    status: 'Scheduled', lifeAreas: ['Consulting', 'Travel'], lastTouched: '2026-07-26', flags: [], attendeeIds: ['c1'], layer: 'Venture' },
];

/* ============================================================
   PROJECTS — E.3 includes one at risk
   ============================================================ */
export const projects: Project[] = [
  {
    ...B, kind: 'project', id: 'p1', title: 'Meridian Grove — Q4 brand launch',
    objective: 'Land the autumn range with a coherent brand story across every channel',
    status: 'Blocked', importance: 'Critical', lifeAreas: ['Work'],
    nextMilestone: 'Creative lock', milestoneDate: '2026-07-24',
    decisionRequired: 'Whether to hold the launch date or cut the third channel',
    blockers: 'Waiting on legal sign-off for the claims language', blockedDays: 9,
    attentionType: 'Decide', lastTouched: '2026-07-22',
    flags: ['at-risk'], relatedIds: ['c3', 'c13', 'c27'],
  },
  {
    ...B, kind: 'project', id: 'p2', title: 'Meridian Grove — brand architecture refresh',
    objective: 'One naming and hierarchy system across the portfolio',
    status: 'Active', importance: 'High', lifeAreas: ['Work'],
    nextMilestone: 'Draft POV to Harriet', milestoneDate: '2026-08-05',
    attentionType: 'Do', lastTouched: '2026-07-28', flags: [], relatedIds: ['c13'],
  },
  {
    ...B, kind: 'project', id: 'p3', title: 'Coastline — autumn wholesale push',
    objective: 'Twelve new stockists before the holiday buy',
    status: 'Active', lifeAreas: ['Ventures'],
    nextMilestone: 'Forecast from Owen', milestoneDate: '2026-09-01',
    attentionType: 'Do', lastTouched: '2026-07-27', flags: [], relatedIds: ['e1', 'c16'],
  },
  {
    ...B, kind: 'project', id: 'p4', title: 'Coastline — packaging redesign',
    objective: 'Move to a format that survives shipping without doubling cost',
    status: 'Active', importance: 'High', lifeAreas: ['Ventures'],
    decisionRequired: 'Which of the two packaging routes to commit to',
    nextMilestone: 'Decision with Ellery', milestoneDate: '2026-08-01',
    attentionType: 'Decide', lastTouched: '2026-07-27', flags: [], relatedIds: ['e1', 'c17'],
  },
  {
    ...B, kind: 'project', id: 'p5', title: 'Halden Athletic — DTC advisory engagement',
    objective: 'Stand up their in-house brand function over two quarters',
    status: 'Active', importance: 'High', lifeAreas: ['Consulting'],
    nextMilestone: 'Working session in Chicago', milestoneDate: '2026-08-13',
    attentionType: 'Do', lastTouched: '2026-07-29', flags: [], relatedIds: ['e3', 'c1'],
  },
  {
    ...B, kind: 'project', id: 'p6', title: 'Bayfront — autumn fundraising campaign',
    objective: 'Close the operating gap before the fiscal year turns',
    status: 'Active', importance: 'Critical', lifeAreas: ['Nonprofit'],
    nextMilestone: 'Target approved by the board', milestoneDate: '2026-08-14',
    attentionType: 'Do', lastTouched: '2026-07-24', flags: [], relatedIds: ['e5', 'c2'],
  },
  {
    ...B, kind: 'project', id: 'p7', title: 'Lakeside Unit — window and trim repair',
    objective: 'Close the open moisture issue before the winter',
    status: 'Waiting', importance: 'High', lifeAreas: ['Property'],
    nextMilestone: 'Quote from Grant', milestoneDate: '2026-08-06',
    blockers: 'Third week waiting on a quote; the work needs dry weather', blockedDays: 21,
    /* at-risk, but attention type Wait — so H.1 leaves it for the
       "Projects at risk" section rather than Executive Attention (FX-8). */
    attentionType: 'Wait', lastTouched: '2026-07-25',
    flags: ['at-risk'], relatedIds: ['e6', 'c10'],
  },
  {
    ...B, kind: 'project', id: 'p8', title: 'Personal site and bio refresh',
    objective: 'One consistent bio and a portfolio that reflects the last two years',
    status: 'On Hold', lifeAreas: ['Brand'],
    nextMilestone: 'Images from Thandiwe', milestoneDate: '2026-08-04',
    attentionType: 'Wait', lastTouched: '2026-06-30', flags: [], relatedIds: ['c25', 'c38'],
  },
  {
    ...B, kind: 'project', id: 'p9', title: 'Fieldnote Advisory — practice setup',
    objective: 'Templates, terms and a repeatable scoping process',
    status: 'Active', lifeAreas: ['Consulting'],
    nextMilestone: 'Legal review of the template', milestoneDate: '2026-09-08',
    attentionType: 'Wait', lastTouched: '2026-07-17', flags: [], relatedIds: ['e2', 'c27'],
  },
];

/* ============================================================
   DELEGATIONS — E.3 includes one past its check-in
   ============================================================ */
export const delegations: Delegation[] = [
  {
    ...B, kind: 'delegation', id: 'd1',
    title: 'Competitive scan for the Q4 category review',
    personId: 'c3', assignedDate: '2026-07-08',
    definitionOfDone: 'Six competitors, positioning and pricing, one page each, with a point of view on where we are exposed',
    checkInDate: '2026-07-27', dueDate: '2026-08-07',
    status: 'Delegated', importance: 'High', owner: 'Delegated',
    lifeAreas: ['Work'], attentionType: 'Delegate',
    lastTouched: '2026-07-08', flags: [], projectId: 'p1',
  },
  {
    ...B, kind: 'delegation', id: 'd2',
    title: 'Launch analytics dashboard for the steering group',
    personId: 'c36', assignedDate: '2026-07-20',
    definitionOfDone: 'One dashboard the steering group can read without narration',
    checkInDate: '2026-08-04', dueDate: '2026-08-18',
    status: 'Delegated', owner: 'Delegated',
    lifeAreas: ['Work'], attentionType: 'Delegate',
    lastTouched: '2026-07-26', flags: [], projectId: 'p1',
  },
  {
    ...B, kind: 'delegation', id: 'd3',
    title: 'Stockist shortlist for the autumn wholesale push',
    personId: 'c16', assignedDate: '2026-07-15',
    definitionOfDone: 'Thirty candidate stockists, ranked, with a contact name for each',
    checkInDate: '2026-08-05', dueDate: '2026-08-22',
    status: 'Delegated', owner: 'Delegated',
    lifeAreas: ['Ventures'], attentionType: 'Delegate',
    lastTouched: '2026-07-23', flags: [], projectId: 'p3',
  },
  {
    ...B, kind: 'delegation', id: 'd4',
    title: 'Volunteer roster for the autumn fundraiser',
    personId: 'c39', assignedDate: '2026-07-11',
    definitionOfDone: 'Roster filled for both shifts with a named backup for each slot',
    checkInDate: '2026-08-08', dueDate: '2026-08-29',
    status: 'Delegated', owner: 'Delegated',
    lifeAreas: ['Nonprofit'], attentionType: 'Delegate',
    lastTouched: '2026-07-11', flags: [], projectId: 'p6',
  },
  {
    ...B, kind: 'delegation', id: 'd5',
    title: 'Site rebuild — staging environment',
    personId: 'c38', assignedDate: '2026-06-22',
    definitionOfDone: 'Staging site reviewable, with the new bio in place',
    checkInDate: '2026-08-12', dueDate: '2026-09-05',
    status: 'Delegated', owner: 'Delegated',
    lifeAreas: ['Brand'], attentionType: 'Delegate',
    lastTouched: '2026-07-01', flags: [], projectId: 'p8',
  },
];

/* ============================================================
   OPPORTUNITIES — E.3 includes the stalled one
   ============================================================ */
export const opportunities: Opportunity[] = [
  {
    ...B, kind: 'opportunity', id: 'o1',
    title: 'Halden Athletic — retail expansion scope',
    oppType: 'Client expansion', organization: 'Halden Athletic',
    primaryContactId: 'c1', source: 'Marisol Vega',
    strategicValue: 'Doubles the engagement and puts me in front of their board',
    potentialValue: 'Significant', probability: 55,
    stage: 'Proposal/Scope',
    /* FR-OPP-2 — nextMove deliberately absent. The absence is the finding. */
    daysSinceMove: 34,
    decisionMaker: 'Lena Brandt, CFO',
    status: 'Active', importance: 'Critical', lifeAreas: ['Consulting'],
    attentionType: 'Do', lastTouched: '2026-06-27',
    flags: ['stalled'], relatedIds: ['c1', 'c15', 'e3'],
  },
  {
    ...B, kind: 'opportunity', id: 'o2',
    title: 'Northline Partners — advisory role across two portfolio brands',
    oppType: 'Advisory role', organization: 'Northline Partners',
    primaryContactId: 'c8', source: 'Prior engagement',
    strategicValue: 'Recurring advisory income with very little delivery load',
    potentialValue: 'Moderate', probability: 40,
    stage: 'Discovery', nextMove: 'Send the scope outline before the Chicago trip',
    daysSinceMove: 3, decisionMaker: 'Joaquin Reyes',
    status: 'Active', importance: 'High', lifeAreas: ['Consulting', 'Travel'],
    attentionType: 'Do', lastTouched: '2026-07-28', flags: [], relatedIds: ['c8', 'e9'],
  },
  {
    ...B, kind: 'opportunity', id: 'o3',
    title: 'Nordvik Group — non-executive board seat',
    oppType: 'Board opportunity', organization: 'Nordvik Group',
    primaryContactId: 'c31', source: 'Margit Halvorsen',
    strategicValue: 'First formal board seat; the credential compounds',
    potentialValue: 'Modest', probability: 25,
    stage: 'Intro Requested', nextMove: 'Follow up on the warm introduction',
    daysSinceMove: 18,
    status: 'Active', importance: 'High', lifeAreas: ['Career'],
    attentionType: 'Connect', lastTouched: '2026-07-13', flags: [], relatedIds: ['c31'],
  },
  {
    ...B, kind: 'opportunity', id: 'o4',
    title: 'Fieldwork Conference — autumn keynote',
    oppType: 'Speaking opportunity', organization: 'Fieldwork Conference',
    primaryContactId: 'c9', source: 'Simone Ashby',
    strategicValue: 'The right room for the advisory practice',
    potentialValue: 'Modest', probability: 70,
    stage: 'Negotiation', nextMove: 'Send the abstract',
    daysSinceMove: 12,
    status: 'Active', lifeAreas: ['Brand', 'Career'],
    attentionType: 'Do', lastTouched: '2026-07-19', flags: [], relatedIds: ['c9'],
  },
  {
    ...B, kind: 'opportunity', id: 'o5',
    title: 'Marchetti Cellars — Coastline collaboration',
    oppType: 'Partnership', organization: 'Marchetti Cellars',
    primaryContactId: 'c32', source: 'Ellery Nakamura',
    strategicValue: 'Distribution into a channel we cannot reach alone',
    potentialValue: 'Moderate', probability: 35,
    stage: 'Connected', nextMove: 'Confirm the tasting date',
    daysSinceMove: 23,
    status: 'Active', lifeAreas: ['Ventures'],
    attentionType: 'Do', lastTouched: '2026-07-08', flags: [], relatedIds: ['c32', 'e1'],
  },
  {
    ...B, kind: 'opportunity', id: 'o6',
    title: 'Ardent Foundation — multi-year operating grant',
    oppType: 'Sponsorship', organization: 'Ardent Foundation',
    primaryContactId: 'c33', source: 'Colette Mwangi',
    strategicValue: 'Would end the annual scramble for Bayfront',
    potentialValue: 'Significant', probability: 45,
    stage: 'Qualified', nextMove: 'Return the reporting template once it arrives',
    daysSinceMove: 17,
    status: 'Active', importance: 'High', lifeAreas: ['Nonprofit'],
    attentionType: 'Wait', lastTouched: '2026-07-14', flags: [], relatedIds: ['c33', 'e5'],
  },
  {
    ...B, kind: 'opportunity', id: 'o7',
    title: 'Lind & Roe — CMO search, consumer brands',
    oppType: 'Recruiter conversation', organization: 'Lind & Roe',
    primaryContactId: 'c5', source: 'Tobias Lind',
    strategicValue: 'Not now, but worth staying visible for',
    potentialValue: 'Significant', probability: 10,
    stage: 'Nurture', nextMove: 'Check in at the turn of the quarter',
    daysSinceMove: 43,
    status: 'On Hold', lifeAreas: ['Career'],
    attentionType: 'Wait', lastTouched: '2026-06-18', flags: [], relatedIds: ['c5'],
  },
  {
    ...B, kind: 'opportunity', id: 'o8',
    title: 'Tidewater Foods — small-batch co-packing arrangement',
    oppType: 'Collaboration', organization: 'Tidewater Foods',
    primaryContactId: 'c7', source: 'Food systems panel',
    strategicValue: 'Solves Coastline’s production ceiling',
    potentialValue: 'Moderate', probability: 30,
    stage: 'Intro Requested', nextMove: 'Make the introduction to Ellery',
    daysSinceMove: 26,
    status: 'Active', lifeAreas: ['Ventures'],
    attentionType: 'Connect', lastTouched: '2026-07-05', flags: [], relatedIds: ['c7', 'c4'],
  },
  {
    ...B, kind: 'opportunity', id: 'o9',
    title: 'The Fieldnote Letter — quarterly column',
    oppType: 'Collaboration', organization: 'The Fieldnote Letter',
    primaryContactId: 'c26', source: 'Elliot Barnes',
    strategicValue: 'A standing publishing slot forces the writing habit',
    potentialValue: 'Modest', probability: 50,
    stage: 'Discovery', nextMove: 'Send three column ideas',
    daysSinceMove: 52,
    status: 'Active', lifeAreas: ['Brand'],
    attentionType: 'Do', lastTouched: '2026-06-09', flags: ['stalled'], relatedIds: ['c26'],
  },
  {
    ...B, kind: 'opportunity', id: 'o10',
    title: 'Halden Athletic — original advisory engagement',
    oppType: 'Consulting lead', organization: 'Halden Athletic',
    primaryContactId: 'c1', source: 'Marisol Vega',
    stage: 'Won', outcome: 'Won on relationship and speed. The scope was smaller than proposed, which was the right call — it proved the model before committing to two quarters.',
    potentialValue: 'Significant', probability: 100,
    status: 'Complete', lifeAreas: ['Consulting'],
    lastTouched: '2026-04-02', flags: [], relatedIds: ['c1', 'e3'],
  },
  {
    ...B, kind: 'opportunity', id: 'o11',
    title: 'Regional grocery group — brand consulting',
    oppType: 'New business', organization: 'Undisclosed',
    stage: 'Lost', outcome: 'Lost on price. They wanted a full-time hire wearing a consultant’s badge. Correct to walk.',
    potentialValue: 'Moderate', probability: 0,
    status: 'Complete', lifeAreas: ['Consulting'],
    lastTouched: '2026-05-16', flags: [],
  },
  {
    ...B, kind: 'opportunity', id: 'o12',
    title: 'Industry awards — jury invitation',
    oppType: 'Jury opportunity', organization: 'Fieldwork Conference',
    primaryContactId: 'c9', source: 'Simone Ashby',
    stage: 'Paused', nextMove: 'Revisit after the Q4 launch ships',
    daysSinceMove: 61,
    potentialValue: 'Modest', probability: 20,
    status: 'On Hold', lifeAreas: ['Career', 'Brand'],
    lastTouched: '2026-05-31', flags: [], relatedIds: ['c9'],
  },
  {
    ...B, kind: 'opportunity', id: 'o13',
    title: 'Neighborhood Arts Fund — corporate sponsor introduction',
    oppType: 'Introduction', organization: 'Neighborhood Arts Fund',
    primaryContactId: 'c39', source: 'Odalys Ferrer',
    stage: 'Identified', nextMove: 'Decide whether I have the capacity to carry this',
    daysSinceMove: 20,
    potentialValue: 'Modest', probability: 30,
    status: 'Active', lifeAreas: ['Nonprofit'],
    attentionType: 'Decide', lastTouched: '2026-07-11', flags: [], relatedIds: ['e10'],
  },
];

/* ============================================================
   ENTITIES — §7.2, one shape covering five modules
   ============================================================ */
export const entities: Entity[] = [
  {
    ...B, kind: 'entity', id: 'e1', title: 'Coastline Provisions',
    entityType: 'venture', role: 'Co-owner',
    whyItMatters: 'The only thing I own outright. It is small on purpose, and it is the proof that I can build as well as advise.',
    status: 'Active', importance: 'High', lifeAreas: ['Ventures'],
    nextAction: 'Decide the packaging route with Ellery',
    contactIds: ['c4', 'c16', 'c17'],
    typeFields: {
      'Partners': 'Ellery Nakamura (co-owner)',
      'Revenue model': 'Wholesale and direct, small-batch',
      'Current priorities': 'Packaging decision · autumn wholesale push',
      'Open invoices': '2 outstanding',
    },
    lastTouched: '2026-07-27', flags: [], relatedIds: ['p3', 'p4', 'o5'],
  },
  {
    ...B, kind: 'entity', id: 'e2', title: 'Fieldnote Advisory',
    entityType: 'consulting', role: 'Principal',
    whyItMatters: 'The vehicle for everything after the executive role. Worth building properly now while there is no pressure on it.',
    status: 'Active', lifeAreas: ['Consulting'],
    nextAction: 'Legal review of the engagement template',
    contactIds: ['c27'],
    typeFields: {
      'Clients': 'Halden Athletic · Northline (in discovery)',
      'Revenue model': 'Retainer advisory',
      'Current priorities': 'Repeatable scoping process',
    },
    lastTouched: '2026-07-17', flags: [], relatedIds: ['p9'],
  },
  {
    ...B, kind: 'entity', id: 'e3', title: 'Halden Athletic',
    entityType: 'consulting', role: 'Advisor',
    whyItMatters: 'The reference client. If this goes well the practice does not need marketing.',
    status: 'Active', importance: 'High', lifeAreas: ['Consulting'],
    nextAction: 'Set the next move on the expansion scope',
    contactIds: ['c1', 'c15', 'c22'],
    typeFields: {
      'Engagement': 'DTC brand function build',
      'Deliverables': 'Operating model · hiring plan · brand system',
      'Payments due': '1 invoice, due end of August',
    },
    lastTouched: '2026-07-29', flags: [], relatedIds: ['p5', 'o1'],
  },
  {
    ...B, kind: 'entity', id: 'e5', title: 'Bayfront Youth Collective',
    entityType: 'nonprofit', role: 'Board member',
    whyItMatters: 'The work I would keep doing if everything else stopped.',
    status: 'Active', importance: 'High', lifeAreas: ['Nonprofit'],
    nextAction: 'Send Desmond the fundraising target',
    contactIds: ['c2', 'c18', 'c11'],
    typeFields: {
      'Mission': 'Paid apprenticeships for young people leaving care',
      'My role': 'Board member, development committee',
      'Fundraising goal': 'Operating gap closed before the fiscal year turns',
      'Impact goal': 'Forty placements this year',
    },
    lastTouched: '2026-07-24', flags: [], relatedIds: ['p6', 'o6'],
  },
  {
    ...B, kind: 'entity', id: 'e10', title: 'Neighborhood Arts Fund',
    entityType: 'nonprofit', role: 'Informal supporter',
    whyItMatters: 'No board, no title, no obligation. It is the neighbourhood, and that is reason enough.',
    status: 'Incubating', lifeAreas: ['Nonprofit'],
    nextAction: 'Decide whether to carry the sponsor introduction',
    contactIds: ['c39'],
    /* FR-ENT-5 — informal community work, no formal organisation attached */
    typeFields: { 'Mission': 'Small grants for neighbourhood arts projects', 'My role': 'Informal — no board seat' },
    lastTouched: '2026-07-11', flags: [], relatedIds: ['o13'],
  },
  {
    ...B, kind: 'entity', id: 'e6', title: 'Lakeside Unit',
    entityType: 'property', role: 'Owner',
    status: 'Active', lifeAreas: ['Property'],
    nextAction: 'Chase Grant for the window quote',
    contactIds: ['c10', 'c24'],
    typeFields: {
      'Type': 'Two-bedroom flat, tenanted',
      'HOA': 'Quarterly dues, next in October',
      'Open issues': 'Window and trim moisture',
      'Insurance renewal': 'March',
    },
    lastTouched: '2026-07-25', flags: [], relatedIds: ['p7'],
  },
  {
    ...B, kind: 'entity', id: 'e7', title: 'The Cottage',
    entityType: 'property', role: 'Owner',
    status: 'Active', lifeAreas: ['Property'],
    nextAction: 'Revisit the keep-or-sell decision',
    contactIds: ['c23', 'c24'],
    typeFields: {
      'Type': 'Weekend cottage',
      'Insurance renewal': 'Late September',
      'Open issues': 'None',
      'Note': 'Under review — see the decision log',
    },
    lastTouched: '2026-07-18', flags: ['revisit-due'], relatedIds: ['dec1'],
  },
  {
    ...B, kind: 'entity', id: 'e8', title: 'The Sedan',
    entityType: 'vehicle', role: 'Owner',
    status: 'Active', lifeAreas: ['Vehicles'],
    nextAction: 'Renew the registration',
    contactIds: ['c28'],
    typeFields: {
      'Registration renewal': 'End of August',
      'Insurance renewal': 'January',
      'Service': 'Next service due at the autumn interval',
      'Mileage': 'Moderate',
    },
    lastTouched: '2026-07-06', flags: [],
  },
  {
    ...B, kind: 'entity', id: 'e11', title: 'The Wagon',
    entityType: 'vehicle', role: 'Owner',
    status: 'Active', lifeAreas: ['Vehicles'],
    nextAction: 'Book the inspection',
    contactIds: ['c28'],
    typeFields: {
      'Registration renewal': 'February',
      'Inspection': 'Due in the autumn',
      'Service': 'Up to date',
    },
    lastTouched: '2026-06-11', flags: [],
  },
  {
    ...B, kind: 'entity', id: 'e9', title: 'Chicago',
    entityType: 'trip',
    dueDate: '2026-08-12',
    status: 'Active', importance: 'High', lifeAreas: ['Travel', 'Consulting', 'Relationships'],
    nextAction: 'Send Joaquin the scope outline before departure',
    contactIds: ['c1', 'c8', 'c9'],
    typeFields: {
      'Length': 'Three days',
      'Purpose': 'Halden working session',
      'What can be combined': 'Joaquin on the advisory scope · Simone on the keynote · dinner with Marisol',
      'Lodging': 'Booked',
    },
    lastTouched: '2026-07-26', flags: [], relatedIds: ['o2', 'ev7', 'ev8'],
  },
  {
    ...B, kind: 'entity', id: 'e12', title: 'Lisbon',
    entityType: 'trip',
    dueDate: '2026-03-04',
    status: 'Archived', lifeAreas: ['Travel', 'Personal'],
    typeFields: { 'Length': 'Eight days', 'Purpose': 'Personal', 'Follow-ups': 'All closed' },
    lastTouched: '2026-03-14', flags: [],
  },
];

/* ============================================================
   REMINDERS — E.4 renewal ladder, one item per rung
   ============================================================ */
const rem = (
  id: string, title: string, kind: Reminder['reminderKind'], dueDate: string,
  areas: Reminder['lifeAreas'], parentId?: string, extra: Partial<Reminder> = {},
): Reminder => ({
  ...B, kind: 'reminder', id, title, reminderKind: kind, dueDate,
  status: 'Scheduled', lifeAreas: areas, parentId,
  lastTouched: '2026-07-01', flags: [], attentionType: 'Do', ...extra,
});

export const reminders: Reminder[] = [
  /* The financial rungs of this ladder now live in fixtures/bills.ts.
     A bill and a reminder for the same obligation would put it on Home
     twice under different headings — the P4 violation caught in H.8.2.
     Reminders keep what costs nothing: documents, inspections, dates. */
  /* ---- E.4 ladder ---- */
  rem('r1', 'Passport expires', 'renewal', '2026-10-29', ['Travel', 'Personal']),
  rem('r4', 'Bayfront — board materials due', 'due-date', '2026-08-14', ['Nonprofit'], 'e5'),

  /* ---- E.3 — the thrice-postponed errand ---- */
  rem('r7', 'Donate the boxes in the hall closet', 'one-time', '2026-07-28', ['Personal'], undefined,
    { snoozeCount: 3, flags: ['postponed'], status: 'Waiting' }),

  rem('r8', 'The Wagon — inspection due', 'preventive', '2026-09-18', ['Vehicles'], 'e11'),
  rem('r9', 'The Sedan — autumn service', 'preventive', '2026-10-03', ['Vehicles'], 'e8'),
  rem('r11', 'Lakeside Unit — gutter clearance', 'preventive', '2026-09-20', ['Property'], 'e6', { recurrence: 'Twice yearly' }),
  /* P4 "one fact, one place": there is deliberately NO reminder for the
     annual physical (the calendar event ev5 carries it), none for the
     Marisol follow-up (commitment cm3 carries its own followUpDate), and
     none for the Priya check-in (delegation d1 carries its checkInDate).
     Duplicating them would put the same obligation on Home twice. */
  rem('r13', 'Dental check', 'preventive', '2026-11-12', ['Health']),
  rem('r14', 'Eye test', 'preventive', '2026-12-04', ['Health']),
  rem('r20', 'Bayfront — annual filing deadline', 'due-date', '2026-11-30', ['Nonprofit'], 'e5'),
  rem('r21', 'Chicago — check in for the flight', 'one-time', '2026-08-11', ['Travel'], 'e9'),
  rem('r22', 'Aunt Ines — birthday', 'recurring', '2026-08-19', ['Personal', 'Relationships'], 'c12', { recurrence: 'Annual' }),
  rem('r24', 'Cottage — chimney sweep', 'preventive', '2026-10-19', ['Property'], 'e7', { recurrence: 'Annual' }),
  rem('r25', 'Review the Q4 launch retro date', 'one-time', '2026-09-25', ['Work'], 'p1'),
  rem('r27', 'Update the LinkedIn headline after the keynote', 'one-time', '2026-09-30', ['Brand']),
  rem('r31', 'Lakeside Unit — smoke and CO alarm check', 'preventive', '2026-10-22', ['Property'], 'e6', { recurrence: 'Twice yearly' }),
  rem('r32', 'The Cottage — winterise before the first frost', 'preventive', '2026-11-07', ['Property'], 'e7', { recurrence: 'Annual' }),
  rem('r33', 'Bayfront — conflict of interest declaration due', 'due-date', '2026-10-09', ['Nonprofit'], 'e5'),
  rem('r34', 'Meridian Grove — performance review window opens', 'due-date', '2026-09-21', ['Work']),
  rem('r35', 'Fieldwork — speaker materials deadline', 'due-date', '2026-09-11', ['Brand', 'Career']),
  rem('r36', 'Coastline — annual recipe documentation review', 'recurring', '2026-12-05', ['Ventures'], 'e1', { recurrence: 'Annual' }),
  rem('r37', 'Update the household emergency contact list', 'one-time', '2026-10-30', ['Personal']),
  rem('r38', 'Book the autumn photography session', 'one-time', '2026-09-26', ['Brand'], undefined, { flags: ['delegatable'] }),
  rem('r28', 'Coastline — trade show registration closes', 'due-date', '2026-11-14', ['Ventures']),
  rem('r29', 'Lakeside Unit — tenancy renewal window opens', 'due-date', '2026-10-15', ['Property'], 'e6'),
  rem('r30', 'Fieldnote — annual practice review', 'recurring', '2026-12-12', ['Consulting'], 'e2', { recurrence: 'Annual' }),
];

/* ============================================================
   TASKS
   ============================================================ */
const task = (
  id: string, title: string, areas: Task['lifeAreas'], status: Task['status'],
  extra: Partial<Task> = {},
): Task => ({
  ...B, kind: 'task', id, title, lifeAreas: areas, status,
  lastTouched: '2026-07-25', flags: [], attentionType: 'Do', ...extra,
});

export const tasks: Task[] = [
  task('t1', 'Decide whether to hold the Q4 launch date or cut the third channel', ['Work'], 'Next',
    { importance: 'Critical', attentionType: 'Decide', dueDate: '2026-08-03', projectId: 'p1', lastTouched: '2026-07-22' }),
  task('t2', 'Review the board deck before Thursday', ['Nonprofit'], 'Next',
    { importance: 'High', attentionType: 'Review', dueDate: '2026-08-04', projectId: 'p6' }),
  task('t3', 'Decide the Coastline packaging route', ['Ventures'], 'Next',
    { importance: 'High', attentionType: 'Decide', dueDate: '2026-08-01', projectId: 'p4' }),
  task('t4', 'Review the Q4 scope reduction options', ['Work'], 'Next',
    { attentionType: 'Review', dueDate: '2026-08-05', projectId: 'p1' }),
  task('t5', 'Set the next move on the Halden expansion', ['Consulting'], 'Next',
    { importance: 'Critical', dueDate: '2026-08-01', relatedIds: ['o1'] }),
  task('t6', 'Write the brand architecture point of view', ['Work'], 'Active',
    { dueDate: '2026-08-05', projectId: 'p2' }),
  task('t7', 'Book the Chicago ground transport', ['Travel'], 'Next', { dueDate: '2026-08-09', relatedIds: ['e9'] }),
  task('t8', 'Draft three column ideas for the Fieldnote Letter', ['Brand'], 'Next',
    { dueDate: '2026-09-16', relatedIds: ['o9'], flags: ['delegatable'] }),
  task('t9', 'Reconcile the Coastline invoices', ['Ventures', 'Money'], 'Next',
    { dueDate: '2026-09-22', flags: ['delegatable'] }),
  task('t10', 'Pull the quarterly numbers for the accountant', ['Money'], 'Next',
    { dueDate: '2026-10-05', flags: ['delegatable'] }),
  task('t11', 'Update the speaker bio across all three platforms', ['Brand'], 'Next', { dueDate: '2026-09-29' }),
  task('t12', 'Chase the Lakeside window quote', ['Property'], 'Waiting',
    { owner: 'Waiting on other', attentionType: 'Wait', dueDate: '2026-08-06', projectId: 'p7' }),
  task('t13', 'Book the annual physical follow-up slot', ['Health'], 'Next', { dueDate: '2026-08-07' }),
  task('t14', 'Sort the garage before the autumn', ['Personal'], 'Someday', {}),
  task('t15', 'Return the jacket', ['Personal'], 'Next', { dueDate: '2026-09-05' }),
  task('t16', 'Renew the professional association membership', ['Career'], 'Next', { dueDate: '2026-10-25' }),
  task('t17', 'Read the two reports Idris flagged', ['Learning'], 'Next', { dueDate: '2026-09-11' }),
  task('t18', 'Plan the Bayfront volunteer briefing', ['Nonprofit'], 'Active', { dueDate: '2026-10-02', projectId: 'p6' }),
  task('t19', 'Write the Halden working-session agenda', ['Consulting'], 'Next', { dueDate: '2026-08-11', projectId: 'p5' }),
  task('t20', 'Confirm the Marchetti tasting date', ['Ventures'], 'Next', { dueDate: '2026-09-04', relatedIds: ['o5'] }),
  task('t21', 'Draft the Fieldnote engagement terms', ['Consulting'], 'Active', { dueDate: '2026-09-01', projectId: 'p9' }),
  task('t22', 'Choose a photographer date for the new headshots', ['Brand'], 'Waiting',
    { owner: 'Waiting on other', attentionType: 'Wait', dueDate: '2026-08-04', projectId: 'p8' }),
  task('t23', 'Refill the pantry order for the cottage', ['Personal'], 'Someday', {}),
  task('t24', 'Look into the autumn strength programme', ['Health'], 'Someday', {}),
  task('t25', 'Draft the Q4 launch retro format', ['Work'], 'Next', { dueDate: '2026-09-25', projectId: 'p1' }),
  task('t26', 'Compare the two grant reporting formats', ['Nonprofit'], 'Next', { dueDate: '2026-09-24' }),
  task('t27', 'Set up the quarterly review block in the calendar', ['Personal'], 'Next', { dueDate: '2026-09-28' }),
  task('t28', 'Send the Coastline wholesale one-pager to the shortlist', ['Ventures'], 'Next',
    { dueDate: '2026-10-08', projectId: 'p3', flags: ['delegatable'] }),
  task('t29', 'Review the Lakeside tenancy renewal terms', ['Property'], 'Next', { dueDate: '2026-09-15', projectId: 'p7' }),
  task('t30', 'Write the note to Imani with the two contacts', ['Nonprofit', 'Relationships'], 'Next',
    { dueDate: '2026-09-18', relatedIds: ['cm17'] }),
  task('t31', 'Archive the Lisbon trip follow-ups', ['Travel'], 'Complete', { lastTouched: '2026-03-14' }),
  task('t32', 'Set the recurring Tuesday training block', ['Health'], 'Active', { recurrence: 'Weekly, Tuesdays' }),
];

/* ============================================================
   GOALS — E.3 includes one stated but not staffed
   ============================================================ */
export const goals: Goal[] = [
  {
    ...B, kind: 'goal', id: 'g1', title: 'Publish a point of view every quarter',
    area: 'Brand', whyItMatters: 'The advisory practice needs a public argument, not just a network.',
    horizon: 'Annual', successMeasure: 'Four published pieces', progress: 'One published, none drafted',
    projectIds: [],                    /* FR-GOL-2 — not staffed */
    status: 'Active', importance: 'High', lifeAreas: ['Brand', 'Career'],
    lastTouched: '2026-05-02', flags: ['not-staffed'],
  },
  {
    ...B, kind: 'goal', id: 'g2', title: 'Take Fieldnote to two retained clients',
    area: 'Consulting', whyItMatters: 'Two retainers makes the practice real rather than opportunistic.',
    horizon: 'Annual', successMeasure: 'Two signed retainers', progress: 'One signed, one in discovery',
    projectIds: ['p9', 'p5'],
    status: 'Active', importance: 'Critical', lifeAreas: ['Consulting'],
    lastTouched: '2026-07-28', flags: [],
  },
  {
    ...B, kind: 'goal', id: 'g3', title: 'Close the Bayfront operating gap',
    area: 'Nonprofit', whyItMatters: 'The programme cannot plan past one year at a time until this is solved.',
    horizon: 'Annual', successMeasure: 'Multi-year funding committed', progress: 'Grant qualified',
    projectIds: ['p6'],
    status: 'Active', importance: 'High', lifeAreas: ['Nonprofit'],
    lastTouched: '2026-07-24', flags: [],
  },
  {
    ...B, kind: 'goal', id: 'g4', title: 'Coastline pays for itself without my time',
    area: 'Ventures', whyItMatters: 'It should be an asset, not a second job.',
    horizon: '2 years', successMeasure: 'Operating without my weekly involvement', progress: 'Owen taking more of the operations',
    projectIds: ['p3'],
    status: 'Active', lifeAreas: ['Ventures'],
    lastTouched: '2026-07-27', flags: [],
  },
  {
    ...B, kind: 'goal', id: 'g5', title: 'Three training sessions a week, sustained',
    area: 'Health', whyItMatters: 'Everything else degrades when this slips, and it always slips first.',
    horizon: 'Annual', successMeasure: 'Twelve weeks unbroken', progress: 'Five weeks',
    projectIds: [],
    status: 'Active', lifeAreas: ['Health'],
    lastTouched: '2026-07-29', flags: ['not-staffed'],
  },
  {
    ...B, kind: 'goal', id: 'g6', title: 'Decide the property question',
    area: 'Property', whyItMatters: 'Carrying two properties is a decision I have never actually made, only postponed.',
    horizon: 'This quarter', successMeasure: 'A decision recorded either way', progress: 'Revisit date reached',
    projectIds: ['p7'],
    status: 'Active', importance: 'High', lifeAreas: ['Property', 'Money'],
    lastTouched: '2026-07-18', flags: [],
  },
  {
    ...B, kind: 'goal', id: 'g7', title: 'One board seat within eighteen months',
    area: 'Career', whyItMatters: 'The credential compounds, and it is the natural next step after the executive role.',
    horizon: '18 months', successMeasure: 'One non-executive seat', progress: 'One conversation open',
    projectIds: [],
    status: 'Active', lifeAreas: ['Career'],
    lastTouched: '2026-07-13', flags: ['not-staffed'],
  },
];

/* ============================================================
   DECISIONS — E.3 includes one at its revisit date
   ============================================================ */
export const decisions: Decision[] = [
  {
    ...B, kind: 'decision', id: 'dec1', title: 'Whether to keep The Cottage',
    area: 'Property',
    context: 'Bought as a weekend place; used four times in the last year.',
    optionsConsidered: ['Keep and use deliberately', 'Let it seasonally', 'Sell'],
    decisionMade: 'Deferred — revisit in six months with actual usage data',
    rationale: 'Not enough evidence at the time; the decision was emotional rather than practical.',
    revisitDate: '2026-07-29',
    status: 'Open', importance: 'High', lifeAreas: ['Property', 'Money'],
    attentionType: 'Decide', lastTouched: '2026-01-29', flags: ['revisit-due'], relatedIds: ['e7'],
  },
  {
    ...B, kind: 'decision', id: 'dec2', title: 'Take the Halden engagement at reduced scope',
    area: 'Consulting',
    context: 'They wanted two quarters; I had capacity for one.',
    optionsConsidered: ['Full scope', 'Reduced scope', 'Decline'],
    decisionMade: 'Reduced scope, with an expansion conversation at the three-month mark',
    rationale: 'Proving the model mattered more than the fee.',
    revisitDate: '2026-09-15', outcome: 'Correct — the expansion conversation is now open',
    status: 'Complete', lifeAreas: ['Consulting'],
    lastTouched: '2026-04-02', flags: [], relatedIds: ['e3', 'o1'],
  },
  {
    ...B, kind: 'decision', id: 'dec3', title: 'Decline the regional grocery engagement',
    area: 'Consulting',
    context: 'Large fee, full-time expectations.',
    optionsConsidered: ['Take it', 'Negotiate scope', 'Decline'],
    decisionMade: 'Declined',
    rationale: 'It was a job wearing a consulting badge. Taking it would have ended the practice.',
    outcome: 'Correct',
    status: 'Complete', lifeAreas: ['Consulting'],
    lastTouched: '2026-05-16', flags: [], relatedIds: ['o11'],
  },
];

/* ============================================================
   DOCUMENTS — link-only (FR-DOC-4). No files, no uploads.
   ============================================================ */
export const documents: DocumentCard[] = [
  { ...B, kind: 'document', id: 'doc1', title: 'Halden expansion scope — draft 3', docType: 'Proposal',
    status: 'Active', lifeAreas: ['Consulting'], link: '#', version: 'v3',
    lastTouched: '2026-06-27', flags: [], relatedIds: ['o1', 'e3'] },
  { ...B, kind: 'document', id: 'doc2', title: 'Fieldnote engagement template', docType: 'Contract',
    status: 'Waiting', lifeAreas: ['Consulting'], link: '#', version: 'v1',
    lastTouched: '2026-07-17', flags: [], relatedIds: ['e2'] },
  { ...B, kind: 'document', id: 'doc3', title: 'Bayfront board pack — August', docType: 'Board materials',
    status: 'Active', lifeAreas: ['Nonprofit'], link: '#', expiresOn: '2026-08-14',
    lastTouched: '2026-07-24', flags: [], relatedIds: ['e5'] },
  { ...B, kind: 'document', id: 'doc4', title: 'Passport', docType: 'Travel document',
    status: 'Active', lifeAreas: ['Travel', 'Personal'], expiresOn: '2026-10-29',
    lastTouched: '2026-01-10', flags: [] },
  { ...B, kind: 'document', id: 'doc5', title: 'The Cottage — insurance summary', docType: 'Insurance',
    status: 'Active', lifeAreas: ['Property'], link: '#', expiresOn: '2026-09-29',
    lastTouched: '2026-07-18', flags: [], relatedIds: ['e7'] },
  { ...B, kind: 'document', id: 'doc6', title: 'Speaker bio — long and short', docType: 'Bio',
    status: 'Active', lifeAreas: ['Brand', 'Career'], link: '#',
    lastTouched: '2026-05-20', flags: [] },
  { ...B, kind: 'document', id: 'doc7', title: 'Coastline wholesale one-pager', docType: 'Sales material',
    status: 'Active', lifeAreas: ['Ventures'], link: '#', version: 'v2',
    lastTouched: '2026-07-23', flags: [], relatedIds: ['e1', 'p3'] },
  { ...B, kind: 'document', id: 'doc8', title: 'Chicago itinerary', docType: 'Reservation',
    status: 'Active', lifeAreas: ['Travel'], link: '#',
    lastTouched: '2026-07-26', flags: [], relatedIds: ['e9'] },
];

/* ============================================================
   INBOX — MD-4 requires ≥15
   ============================================================ */
const inbox = (id: string, title: string, capturedAt: string, hint?: InboxItem['hint']): InboxItem => ({
  ...B, kind: 'inbox', id, title, capturedAt, hint,
  status: 'Inbox', lifeAreas: [], lastTouched: capturedAt, flags: [],
});

export const inboxItems: InboxItem[] = [
  inbox('i1', 'Call the vet about the autumn check', '2026-07-30', 'Task'),
  inbox('i2', 'Idea — a short series on how brand teams actually get built', '2026-07-30', 'Idea'),
  inbox('i3', 'Marisol mentioned someone at Halden worth meeting — get the name', '2026-07-29', 'Person'),
  inbox('i4', 'Check whether the cottage cover includes the outbuilding', '2026-07-29'),
  inbox('i5', 'Promised Desmond I would look at the sponsorship deck', '2026-07-28', 'Commitment'),
  inbox('i6', 'Book the dentist', '2026-07-28', 'Task'),
  inbox('i7', 'Newsletter renewal — decide whether to keep it', '2026-07-27', 'Renewal'),
  inbox('i8', 'Ellery wants to talk about hiring a second production hand', '2026-07-27'),
  inbox('i9', 'Ask Wilhelmina about the quarterly filing timing', '2026-07-26', 'Task'),
  inbox('i10', 'Idea — Coastline gift boxes for the holidays', '2026-07-26', 'Idea'),
  inbox('i11', 'Someone to introduce to Nadia — the Seattle operator', '2026-07-25', 'Person'),
  inbox('i12', 'Find out when the Nordvik board actually meets', '2026-07-24'),
  inbox('i13', 'Replace the hall light', '2026-07-24', 'Task'),
  inbox('i14', 'Worth writing down: what I would do differently on the Q4 launch', '2026-07-23'),
  inbox('i15', 'Ask Kwame about shifting the Tuesday session earlier', '2026-07-22', 'Task'),
  inbox('i16', 'Look up the food-systems panel recording', '2026-07-21'),
  inbox('i17', 'Gift idea for Aunt Ines — the garden book', '2026-07-20', 'Idea'),
];
