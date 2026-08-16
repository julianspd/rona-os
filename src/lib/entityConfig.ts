/* ============================================================
   Entity type configuration — PRD §7.2 / FR-ENT-1

   The whole return on the Entity consolidation: five of the source
   brief's modules (ventures, nonprofits, properties, vehicles, trips)
   are ONE list screen and ONE detail screen, differing only by the
   config below. A new sphere costs an entry here, not a new screen.
   ============================================================ */

import type { EntityType } from '../types';

export interface EntityTypeConfig {
  label: string;
  plural: string;
  blurb: string;
  /** Extra fields shown above typeFields on the detail screen. */
  showWhyItMatters: boolean;
  showRole: boolean;
  /** Order in which typeFields keys are rendered; unlisted keys follow. */
  fieldOrder: string[];
}

export const ENTITY_CONFIG: Record<EntityType, EntityTypeConfig> = {
  venture: {
    label: 'Venture',
    plural: 'Ventures',
    blurb: 'Owned companies and side businesses.',
    showWhyItMatters: true,          // FR-ENT-3
    showRole: true,
    fieldOrder: ['Partners', 'Revenue model', 'Current priorities', 'Open invoices'],
  },
  consulting: {
    label: 'Engagement',
    plural: 'Consulting & advisory',
    blurb: 'Client engagements and the practice itself.',
    showWhyItMatters: true,
    showRole: true,
    fieldOrder: ['Engagement', 'Clients', 'Deliverables', 'Revenue model', 'Payments due', 'Current priorities'],
  },
  nonprofit: {
    label: 'Organisation',
    plural: 'Nonprofit & community',
    blurb: 'Board service, community work, and everything in between.',
    showWhyItMatters: true,
    showRole: true,
    /* FR-ENT-4 */
    fieldOrder: ['Mission', 'My role', 'Fundraising goal', 'Impact goal'],
  },
  property: {
    label: 'Property',
    plural: 'Properties',
    blurb: 'Aliases only — never addresses (FR-ENT-10).',
    showWhyItMatters: false,
    showRole: true,
    /* FR-ENT-6 */
    fieldOrder: ['Type', 'HOA', 'Insurance renewal', 'Open issues', 'Note'],
  },
  vehicle: {
    label: 'Vehicle',
    plural: 'Vehicles',
    blurb: 'Aliases only — no plates, VINs or policy numbers.',
    showWhyItMatters: false,
    showRole: false,
    /* FR-ENT-7 */
    fieldOrder: ['Registration renewal', 'Insurance renewal', 'Inspection', 'Service', 'Mileage'],
  },
  trip: {
    label: 'Trip',
    plural: 'Travel',
    blurb: 'What can be combined while you are there.',
    showWhyItMatters: false,
    showRole: false,
    /* FR-ENT-8 */
    fieldOrder: ['Dates', 'Purpose', 'What can be combined', 'Lodging', 'Follow-ups'],
  },
  other: {
    label: 'Item',
    plural: 'Other',
    blurb: '',
    showWhyItMatters: false,
    showRole: false,
    fieldOrder: [],
  },
};

/** A.1 — the Spheres grid. Entity-backed spheres plus the rest. */
export type SphereGroup = 'work' | 'due' | 'view' | 'meta';

export interface Sphere {
  key: string;
  label: string;
  kind: 'entity' | 'view';
  entityType?: EntityType;
  view?: string;
  blurb: string;
  category: SphereGroup;
}

/* Three groups, cut by what kind of attention each needs rather than
   by what type of record it is. "Properties" and "Bills" are different
   objects but the same question: what is coming at me and when.

   The fourth is not one of Rona's life areas and is not presented as
   one — it is where the work on the product itself lives, kept
   deliberately subordinate at the foot of the page. */
export const SPHERE_GROUPS: { key: SphereGroup; title: string; blurb: string }[] = [
  { key: 'work', title: 'Where the work is',
    blurb: 'The spheres that generate commitments, opportunities and people.' },
  { key: 'due', title: 'What comes due',
    blurb: 'Everything with a date attached, whether or not you put it there.' },
  { key: 'view', title: 'The longer view',
    blurb: 'Stepping back — what you decided, what you are aiming at, what you let go.' },
  { key: 'meta', title: 'Building this',
    blurb: 'Not part of Rona’s system. Where the work on the product is tracked.' },
];

export const SPHERES: Sphere[] = [
  /* ---- Where the work is ---- */
  { key: 'projects',   label: 'Work & projects',       kind: 'view',   view: 'projects',   blurb: 'Initiatives, milestones, risk', category: 'work' },
  { key: 'opps',       label: 'Opportunities',          kind: 'view',   view: 'opportunities', blurb: 'The growth pipeline', category: 'work' },
  { key: 'ventures',   label: 'Ventures',               kind: 'entity', entityType: 'venture',    blurb: 'Owned businesses', category: 'work' },
  { key: 'consulting', label: 'Consulting & advisory',  kind: 'entity', entityType: 'consulting', blurb: 'Clients and the practice', category: 'work' },
  { key: 'nonprofit',  label: 'Nonprofit & community',  kind: 'entity', entityType: 'nonprofit',  blurb: 'Board and community work', category: 'work' },

  /* ---- What comes due ---- */
  { key: 'bills',      label: 'Bills & obligations',    kind: 'view',   view: 'bills',      blurb: 'Nothing missed', category: 'due' },
  { key: 'renewals',   label: 'Renewals & life admin',  kind: 'view',   view: 'renewals',   blurb: 'The next 90 days', category: 'due' },
  { key: 'dates',      label: 'Birthdays & dates',      kind: 'view',   view: 'dates',      blurb: 'Everything that comes round yearly', category: 'due' },
  { key: 'properties', label: 'Properties',             kind: 'entity', entityType: 'property',   blurb: 'Aliases only', category: 'due' },
  { key: 'vehicles',   label: 'Vehicles',               kind: 'entity', entityType: 'vehicle',    blurb: 'Renewals and service', category: 'due' },
  { key: 'travel',     label: 'Travel',                 kind: 'entity', entityType: 'trip',       blurb: 'Trips and what to combine', category: 'due' },

  /* ---- The longer view ---- */
  { key: 'review',     label: 'Weekly review',          kind: 'view',   view: 'review',     blurb: 'Where the week actually went', category: 'view' },
  { key: 'goals',      label: 'Goals',                  kind: 'view',   view: 'goals',      blurb: 'Stated, and staffed or not', category: 'view' },
  { key: 'decisions',  label: 'Decision log',           kind: 'view',   view: 'decisions',  blurb: 'What was decided, and why', category: 'view' },
  { key: 'documents',  label: 'Documents',              kind: 'view',   view: 'documents',  blurb: 'Links, held by the thing they belong to', category: 'view' },
  { key: 'archive',    label: 'Dropped & postponed',    kind: 'view',   view: 'archive',    blurb: 'Nothing is destroyed; bring it back', category: 'view' },

  /* ---- Building this ---- */
  { key: 'build',      label: 'Build status',           kind: 'view',   view: 'build',      blurb: 'What works, what is next, what we need', category: 'meta' },
  { key: 'styleguide', label: 'Design system',          kind: 'view',   view: 'styleguide', blurb: 'Tokens, components, states', category: 'meta' },
];
