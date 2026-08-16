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
export interface Sphere {
  key: string;
  label: string;
  kind: 'entity' | 'view';
  entityType?: EntityType;
  view?: string;
  blurb: string;
}

export const SPHERES: Sphere[] = [
  { key: 'projects',   label: 'Work & projects',       kind: 'view',   view: 'projects',   blurb: 'Initiatives, milestones, risk' },
  { key: 'opps',       label: 'Opportunities',          kind: 'view',   view: 'opportunities', blurb: 'The growth pipeline' },
  { key: 'ventures',   label: 'Ventures',               kind: 'entity', entityType: 'venture',    blurb: 'Owned businesses' },
  { key: 'consulting', label: 'Consulting & advisory',  kind: 'entity', entityType: 'consulting', blurb: 'Clients and the practice' },
  { key: 'nonprofit',  label: 'Nonprofit & community',  kind: 'entity', entityType: 'nonprofit',  blurb: 'Board and community work' },
  { key: 'properties', label: 'Properties',             kind: 'entity', entityType: 'property',   blurb: 'Aliases only' },
  { key: 'vehicles',   label: 'Vehicles',               kind: 'entity', entityType: 'vehicle',    blurb: 'Renewals and service' },
  { key: 'travel',     label: 'Travel',                 kind: 'entity', entityType: 'trip',       blurb: 'Trips and what to combine' },
  { key: 'bills',      label: 'Bills & obligations',    kind: 'view',   view: 'bills',      blurb: 'Nothing missed' },
  { key: 'renewals',   label: 'Renewals & life admin',  kind: 'view',   view: 'renewals',   blurb: 'The next 90 days' },
  { key: 'dates',      label: 'Birthdays & dates',      kind: 'view',   view: 'dates',      blurb: 'Everything that comes round yearly' },
  { key: 'goals',      label: 'Goals',                  kind: 'view',   view: 'goals',      blurb: 'Stated, and staffed or not' },
  { key: 'documents',  label: 'Documents',              kind: 'view',   view: 'documents',  blurb: 'Links, held by the thing they belong to' },
  { key: 'decisions',  label: 'Decision log',           kind: 'view',   view: 'decisions',  blurb: 'What was decided, and why' },
  { key: 'archive',    label: 'Dropped & postponed',    kind: 'view',   view: 'archive',    blurb: 'Nothing is destroyed; bring it back' },
  { key: 'build',      label: 'Build status',           kind: 'view',   view: 'build',      blurb: 'What works, what is next, what we need' },
  { key: 'styleguide', label: 'Design system',          kind: 'view',   view: 'styleguide', blurb: 'Tokens, components, states' },
];
