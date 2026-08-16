/* ============================================================
   Spheres — PRD Appendix A.1, §8.9
   One EntityList + one EntityDetail cover five of the source
   brief's modules. This file is the payoff for §7.2.
   ============================================================ */

import { useStore } from '../store';
import { Card } from '../components/Card';
import { ENTITY_CONFIG, SPHERES } from '../lib/entityConfig';
import type { AnyCard, Commitment, Contact, Delegation, Entity, EntityType, Reminder } from '../types';
import { DateLabel, NextActionLine, PersonChip, StatusBadge } from '../components/primitives';
import { longLabel } from '../lib/dates';
import './spheres.css';

type Go = (v: string, id?: string) => void;

/* ---- A.1 — the Spheres grid -------------------------------- */
export function SphereGrid({ go }: { go: Go }) {
  const { cards } = useStore();

  const count = (s: typeof SPHERES[number]) => {
    if (s.kind === 'entity') {
      return cards.filter(c => c.kind === 'entity'
        && (c as Entity).entityType === s.entityType
        && c.status !== 'Archived').length;
    }
    const map: Record<string, (c: AnyCard) => boolean> = {
      projects: c => c.kind === 'project' && c.status !== 'Archived',
      opportunities: c => c.kind === 'opportunity',
      bills: c => c.kind === 'bill' && (c as { paymentStatus?: string }).paymentStatus !== 'Paid',
      renewals: c => c.kind === 'reminder',
      dates: c => c.kind === 'contact' && !!(c as { importantDates?: unknown[] }).importantDates?.length,
      archive: c => c.status === 'Archived' || (c.snoozeCount ?? 0) > 0,
      goals: c => c.kind === 'goal',
      documents: c => c.kind === 'document',
      decisions: c => c.kind === 'decision',
    };
    return cards.filter(map[s.view!] ?? (() => false)).length;
  };

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">Spheres</h1>
        <p className="page__sub">
          Everything outside the daily loop. Nothing here is a separate system —
          each is a view over the same cards.
        </p>
      </header>

      <div className="grid">
        {SPHERES.map(s => (
          <button
            key={s.key}
            className="tile"
            onClick={() => go(s.kind === 'entity' ? `entity:${s.entityType}` : s.view!)}
          >
            <span className="tile__label">{s.label}</span>
            <span className="tile__blurb">{s.blurb}</span>
            {count(s) > 0 && <span className="tile__n tnum">{count(s)}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---- EntityList — one screen, configured per type ----------- */
export function EntityList({ type, go }: { type: EntityType; go: Go }) {
  const { cards } = useStore();
  const cfg = ENTITY_CONFIG[type];
  const items = cards.filter(c => c.kind === 'entity' && (c as Entity).entityType === type);
  const active = items.filter(c => c.status !== 'Archived');
  const archived = items.filter(c => c.status === 'Archived');

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">{cfg.plural}</h1>
        <p className="page__sub">{cfg.blurb}</p>
      </header>

      <ul className="list list-dense">
        {active.map(c => <li key={c.id}><Card card={c} onOpen={id => go('detail-entity', id)} /></li>)}
      </ul>

      {!!archived.length && (
        <section className="sec" style={{ marginTop: 'var(--s6)' }}>
          <header className="sec__head"><h2 className="sec__title">Archived</h2></header>
          <ul className="list list-dense">
            {archived.map(c => <li key={c.id}><Card card={c} onOpen={id => go('detail-entity', id)} /></li>)}
          </ul>
        </section>
      )}
    </div>
  );
}

/* ---- EntityDetail — FR-ENT-2 -------------------------------- */
export function EntityDetail({ id, go }: { id: string; go: Go }) {
  const { byId, cards } = useStore();
  const e = byId(id) as Entity | undefined;
  if (!e || e.kind !== 'entity') {
    return <div className="page"><p className="empty">Not found.</p></div>;
  }
  const cfg = ENTITY_CONFIG[e.entityType];

  /* FR-ENT-2 — every entity surfaces the same six panels. */
  const linked = (pred: (c: AnyCard) => boolean) =>
    cards.filter(c => c.id !== e.id && pred(c) &&
      (c.relatedIds.includes(e.id) || e.relatedIds.includes(c.id) ||
       (c as Reminder).parentId === e.id ||
       (c as Delegation).projectId === e.id));

  const tasks = linked(c => c.kind === 'task' || c.kind === 'delegation' || c.kind === 'project');
  const comms = cards.filter(c => c.kind === 'commitment' &&
    (c.relatedIds.includes(e.id) ||
     (e.contactIds ?? []).includes((c as Commitment).personId))) as Commitment[];
  const rems = cards.filter(c => c.kind === 'reminder' && (c as Reminder).parentId === e.id);
  const docs = linked(c => c.kind === 'document');
  const people = (e.contactIds ?? [])
    .map(cid => cards.find(c => c.id === cid))
    .filter(Boolean) as Contact[];

  /* Trips carry a real date rather than a literal string, so it moves
     with the calendar instead of going stale. */
  const dateRow: [string, string][] = e.entityType === 'trip' && e.dueDate
    ? [['Departs', longLabel(e.dueDate)]]
    : [];

  const ordered = [
    ...dateRow,
    ...cfg.fieldOrder.filter(k => e.typeFields[k]).map(k => [k, e.typeFields[k]] as const),
    ...Object.entries(e.typeFields).filter(([k]) => !cfg.fieldOrder.includes(k)),
  ];

  return (
    <div className="page">
      <header className="page__head">
        <button className="crumb" onClick={() => go(`entity:${e.entityType}`)}>← {cfg.plural}</button>
        <h1 className="page__title">{e.title}</h1>
        <div className="page__meta">
          <StatusBadge status={e.status} />
          {cfg.showRole && e.role && <span>{e.role}</span>}
          <NextActionLine text={e.nextAction} />
        </div>
      </header>

      {/* FR-ENT-3 / FR-ENT-4 — the field that separates meaningful from busy */}
      {cfg.showWhyItMatters && e.whyItMatters && (
        <blockquote className="why">
          <span className="why__label">Why does this matter?</span>
          {e.whyItMatters}
        </blockquote>
      )}

      <dl className="fields">
        {ordered.map(([k, v]) => (
          <div className="field" key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>

      <Panel title="Key contacts" empty={!people.length}>
        <div className="chips">
          {people.map(p => <PersonChip key={p.id} name={p.title} onClick={() => go('detail', p.id)} />)}
        </div>
      </Panel>

      <Panel title="Commitments" empty={!comms.length}>
        <ul className="list list-dense">
          {comms.map(c => <li key={c.id}><Card card={c} onOpen={cid => go('detail', cid)} /></li>)}
        </ul>
      </Panel>

      <Panel title="Work" empty={!tasks.length}>
        <ul className="list list-dense">
          {tasks.map(c => <li key={c.id}><Card card={c} onOpen={cid => go('detail', cid)} /></li>)}
        </ul>
      </Panel>

      <Panel title="Reminders" empty={!rems.length}>
        <ul className="list list-dense">
          {rems.map(c => <li key={c.id}><Card card={c} onOpen={cid => go('detail', cid)} /></li>)}
        </ul>
      </Panel>

      <Panel title="Documents" empty={!docs.length}>
        <ul className="list list-dense">
          {docs.map(c => (
            <li key={c.id} className="docrow">
              <span>{c.title}</span>
              {c.dueDate && <DateLabel iso={c.dueDate} prefix="expires" />}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/* P6 — empty panels render nothing, not an empty state. */
function Panel({ title, empty, children }: { title: string; empty: boolean; children: React.ReactNode }) {
  if (empty) return null;
  return (
    <section className="sec">
      <header className="sec__head"><h2 className="sec__title">{title}</h2></header>
      {children}
    </section>
  );
}
