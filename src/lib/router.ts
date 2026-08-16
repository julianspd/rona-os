/* ============================================================
   URLs

   Every screen gets an address. Which means the back button works,
   a link can be sent, and refreshing lands you where you were
   rather than at the top.

   Entity lists get the plural people actually say — /properties,
   not /entity:property. If a URL is going to be visible it should
   read like language.
   ============================================================ */

import type { EntityType } from '../types';

export interface Route { view: string; id?: string }

/** view → slug. Home is the root, so it has none. */
const SLUGS: Record<string, string> = {
  home: '',
  today: 'today',
  inbox: 'inbox',
  commitments: 'commitments',
  people: 'people',
  tasks: 'tasks',
  search: 'search',
  spheres: 'spheres',
  projects: 'projects',
  opportunities: 'opportunities',
  renewals: 'renewals',
  bills: 'bills',
  goals: 'goals',
  documents: 'documents',
  decisions: 'decisions',
  dates: 'dates',
  archive: 'archive',
  review: 'review',
  build: 'build',
  styleguide: 'design-system',
};

const ENTITY_SLUGS: Record<EntityType, string> = {
  venture: 'ventures',
  consulting: 'consulting',
  nonprofit: 'nonprofit',
  property: 'properties',
  vehicle: 'vehicles',
  trip: 'travel',
  other: 'other',
};

const BY_SLUG = Object.fromEntries(
  Object.entries(SLUGS).filter(([, v]) => v).map(([k, v]) => [v, k]),
);
const ENTITY_BY_SLUG = Object.fromEntries(
  Object.entries(ENTITY_SLUGS).map(([k, v]) => [v, k]),
);

export function toPath(view: string, id?: string): string {
  if (view === 'detail' || view === 'detail-entity') return id ? `/item/${id}` : '/';
  if (view.startsWith('entity:')) {
    const t = view.split(':')[1] as EntityType;
    return `/${ENTITY_SLUGS[t] ?? 'other'}`;
  }
  const slug = SLUGS[view];
  return slug ? `/${slug}` : '/';
}

export function fromPath(pathname: string): Route {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/');
  const head = parts[0] ?? '';

  if (!head) return { view: 'home' };
  if (head === 'item' && parts[1]) return { view: 'detail', id: parts[1] };
  if (ENTITY_BY_SLUG[head]) return { view: `entity:${ENTITY_BY_SLUG[head]}` };
  if (BY_SLUG[head]) return { view: BY_SLUG[head] };

  // Anything unrecognised — including /debug — simply opens Home.
  return { view: 'home' };
}

/** Where the slug and the section's real name differ, the tab uses
    the name. A URL can be terse; a tab should read like the product. */
const TAB_NAMES: Record<string, string> = {
  dates: 'Birthdays & dates',
  archive: 'Dropped & postponed',
  build: 'Build status',
  review: 'Weekly review',
  bills: 'Bills & obligations',
  renewals: 'Renewals & life admin',
  decisions: 'Decision log',
  projects: 'Work & projects',
  styleguide: 'Design system',
  nonprofit: 'Nonprofit & community',
  consulting: 'Consulting & advisory',
};

/** What the browser tab says. The section name, which is the point. */
export function titleFor(view: string, name?: string): string {
  const base = 'Rona OS';
  if (view === 'detail' || view === 'detail-entity') {
    return name ? `${name} · ${base}` : base;
  }
  if (view.startsWith('entity:')) {
    const t = view.split(':')[1] as EntityType;
    const slug = ENTITY_SLUGS[t] ?? '';
    return `${TAB_NAMES[slug] ?? cap(slug)} · ${base}`;
  }
  if (view === 'home') return base;
  return `${TAB_NAMES[view] ?? cap(SLUGS[view] ?? view)} · ${base}`;
}

function cap(s: string) {
  return s.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
}
