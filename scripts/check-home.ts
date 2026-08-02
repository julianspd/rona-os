/* Verifies the PRD's own acceptance criteria against the fixtures.
   Not a test suite — a check that the data actually exercises the design. */

import { buildHome, inboxCount } from '../src/lib/home';
import type { AnyCard } from '../src/types';
import { contacts } from '../src/fixtures/people';
import {
  commitments, tasks, delegations, reminders, projects, opportunities,
  entities, goals, events, documents, decisions, inboxItems,
} from '../src/fixtures/data';

const ALL: AnyCard[] = [
  ...contacts, ...commitments, ...tasks, ...delegations, ...reminders,
  ...projects, ...opportunities, ...entities, ...goals, ...events,
  ...documents, ...decisions, ...inboxItems,
];

const sections = buildHome(ALL);

console.log('\n=== Home sections (PRD §9.1 order) ===');
for (const s of sections) {
  const mark = s.items.length ? '✓' : '· hidden';
  console.log(
    `${mark.padEnd(9)} ${s.title.padEnd(34)} ${String(s.items.length).padStart(2)}/${s.cap}`
  );
  for (const i of s.items) console.log(`            – ${i.title.slice(0, 68)}`);
}
console.log(`✓         Inbox                              ${inboxCount(ALL)}`);

/* ---- H.1: no item may appear twice -------------------------- */
const seen = new Map<string, string>();
let dupes = 0;
for (const s of sections) {
  for (const i of s.items) {
    if (seen.has(i.id)) {
      console.log(`\n✗ H.1 VIOLATION: "${i.title}" in both ${seen.get(i.id)} and ${s.title}`);
      dupes++;
    }
    seen.set(i.id, s.title);
  }
}
console.log(`\nH.1 de-duplication: ${dupes === 0 ? '✓ no item appears twice' : `✗ ${dupes} duplicates`}`);

/* ---- FX-8: every section exercised -------------------------- */
const empty = sections.filter(s => !s.items.length);
console.log(`FX-8 every section exercised: ${empty.length === 0
  ? '✓ all 15 populated'
  : `✗ empty — ${empty.map(s => s.title).join(', ')}`}`);

/* ---- MD-4: volumes ------------------------------------------ */
const counts: [string, number, number][] = [
  ['contacts', contacts.length, 40],
  ['tasks', tasks.length, 30],
  ['commitments', commitments.length, 20],
  ['opportunities', opportunities.length, 12],
  ['entities', entities.length, 10],
  ['reminders', reminders.length, 25],
  ['projects', projects.length, 8],
  ['goals', goals.length, 6],
  ['inbox items', inboxItems.length, 15],
];
console.log('\n=== MD-4 volume targets ===');
for (const [name, actual, target] of counts) {
  console.log(`${actual >= target ? '✓' : '✗'} ${name.padEnd(15)} ${actual} (≥${target})`);
}

/* ---- FX-7: ~70% of dated items at urgency "later" ----------- */
import { urgencyOf } from '../src/lib/dates';
const dated = ALL.filter(c => c.dueDate);
const later = dated.filter(c => urgencyOf(c.dueDate) === 'later').length;
const pct = Math.round((later / dated.length) * 100);
console.log(`\nFX-7 urgency distribution: ${pct}% of ${dated.length} dated items at "later" (target ~70%)`);

const dist: Record<string, number> = {};
for (const c of dated) dist[urgencyOf(c.dueDate)] = (dist[urgencyOf(c.dueDate)] ?? 0) + 1;
console.log('  ', dist);

/* ---- FX-7 (revised, PRD H.8.3): strong-colour share ≤25% ---- */
const STRONG = new Set(['overdue', 'today', 'soon']);
const strong = dated.filter(c => STRONG.has(urgencyOf(c.dueDate))).length;
const strongPct = Math.round((strong / dated.length) * 100);
console.log(`FX-7 (revised) strong-colour share: ${strongPct}% ${strongPct <= 25 ? '✓' : '✗'} (limit 25%)`);

/* ---- §14.4 volume test, numeric half -----------------------
   The visual half needs a human. This is the proxy: how much
   does Home actually put on screen, and how much of it shouts? */
const rendered = sections.reduce((n, s) => n + s.items.length, 0);
const renderedStrong = sections.flatMap(s => s.items)
  .filter(c => STRONG.has(urgencyOf(c.dueDate))).length;
console.log(`\n=== §14.4 volume test (numeric half) ===`);
console.log(`Home renders ${rendered} items across ${sections.filter(s => s.items.length).length} visible sections`);
console.log(`  of which ${renderedStrong} carry strong colour (${Math.round(renderedStrong / rendered * 100)}%)`);
console.log(`  total fixture cards: ${ALL.length} — Home shows ${Math.round(rendered / ALL.length * 100)}% of them`);
console.log(`\n${rendered <= 45 ? '✓' : '✗'} Home item count within a scannable range (≤45)`);
