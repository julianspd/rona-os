/* ============================================================
   Phase 1 list screens — Today, Inbox, Commitments, People, Search
   All composed from CardList + the shared card library (B.2/B.3).
   ============================================================ */

import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Card } from '../components/Card';
import { daysFromToday, daysSince, todayLabel } from '../lib/dates';
import { EntityDetail } from './Spheres';
import type { AnyCard, Commitment, Contact } from '../types';
import './lists.css';

const OPEN = new Set(['Complete', 'Archived', 'Fulfilled', 'Released', 'Closed']);
const isOpen = (c: AnyCard) => !OPEN.has(c.status);

function Page({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">{title}</h1>
        {sub && <p className="page__sub">{sub}</p>}
      </header>
      {children}
    </div>
  );
}

function Tabs({ tabs, active, onChange }: {
  tabs: { key: string; label: string; count: number }[];
  active: string; onChange: (k: string) => void;
}) {
  return (
    <div className="tabs">
      {tabs.map(t => (
        <button
          key={t.key}
          className={`tab ${active === t.key ? 'tab--on' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}<span className="tab__n">{t.count}</span>
        </button>
      ))}
    </div>
  );
}

function List({ items, go }: { items: AnyCard[]; go: (v: string, id?: string) => void }) {
  if (!items.length) return <p className="empty">Nothing here.</p>;
  return (
    <ul className="list list-dense">
      {items.map(c => <li key={c.id}><Card card={c} onOpen={id => go('detail', id)} /></li>)}
    </ul>
  );
}

/* ---- Today -------------------------------------------------- */
export function Today({ go }: { go: (v: string, id?: string) => void }) {
  const { cards } = useStore();
  const items = cards.filter(c => {
    if (!isOpen(c)) return false;
    const d = daysFromToday(c.dueDate ?? (c.kind === 'event' ? (c as never as { start: string }).start : undefined));
    return d !== undefined && d <= 0;
  });
  return (
    <Page title="Today" sub={todayLabel}>
      <List items={items} go={go} />
    </Page>
  );
}

/* ---- Inbox — FR-CAP-5 --------------------------------------- */
export function Inbox({ go }: { go: (v: string, id?: string) => void }) {
  const { cards } = useStore();
  const items = cards.filter(c => c.kind === 'inbox' && c.status === 'Inbox');
  return (
    <Page title="Inbox" sub="Captured, not yet filed. A full inbox is normal.">
      <List items={items} go={go} />
    </Page>
  );
}

/* ---- Commitments — FR-COM-4 --------------------------------- */
export function Commitments({ go }: { go: (v: string, id?: string) => void }) {
  const { cards } = useStore();
  const all = cards.filter(c => c.kind === 'commitment' && isOpen(c)) as Commitment[];

  const overdue = all.filter(c =>
    c.status === 'Overdue' || (c.dueDate && (daysFromToday(c.dueDate) ?? 0) < 0));
  const iOwe = all.filter(c => c.direction === 'I Owe');
  const waiting = all.filter(c => c.direction === 'They Owe');
  const high = all.filter(c => c.importance === 'Critical' || c.importance === 'High');
  const week = all.filter(c => {
    const d = daysFromToday(c.dueDate ?? c.followUpDate);
    return d !== undefined && d >= 0 && d <= 7;
  });

  const [tab, setTab] = useState('iowe');
  const map: Record<string, Commitment[]> = { iowe: iOwe, waiting, overdue, week, high };

  return (
    <Page title="Commitments" sub="A promise between two people. Different from a task.">
      <Tabs
        active={tab} onChange={setTab}
        tabs={[
          { key: 'iowe', label: 'I owe', count: iOwe.length },
          { key: 'waiting', label: 'Waiting on', count: waiting.length },
          { key: 'overdue', label: 'Overdue', count: overdue.length },
          { key: 'week', label: 'Due this week', count: week.length },
          { key: 'high', label: 'High importance', count: high.length },
        ]}
      />
      <List items={map[tab]} go={go} />
    </Page>
  );
}

/* ---- People — FR-CRM-6 -------------------------------------- */
export function People({ go }: { go: (v: string, id?: string) => void }) {
  const { cards } = useStore();
  const all = cards.filter(c => c.kind === 'contact') as Contact[];

  const reconnect = all.filter(c => (daysSince(c.lastInteraction) ?? 0) > c.cadenceDays);
  const inner = all.filter(c => c.strength === 'Inner Circle');
  const dormant = all.filter(c => c.flags.includes('dormant'));
  const fresh = all.filter(c => c.strength === 'New');

  const [tab, setTab] = useState('all');
  const map: Record<string, Contact[]> = { all, reconnect, inner, dormant, fresh };

  return (
    <Page title="People" sub="Relationship intelligence, not a contact database.">
      <Tabs
        active={tab} onChange={setTab}
        tabs={[
          { key: 'all', label: 'All', count: all.length },
          { key: 'reconnect', label: 'Reconnect', count: reconnect.length },
          { key: 'inner', label: 'Inner circle', count: inner.length },
          { key: 'dormant', label: 'Dormant', count: dormant.length },
          { key: 'fresh', label: 'New', count: fresh.length },
        ]}
      />
      <List items={map[tab]} go={go} />
    </Page>
  );
}

/* ---- Tasks -------------------------------------------------- */
export function Tasks({ go }: { go: (v: string, id?: string) => void }) {
  const { cards } = useStore();
  const all = cards.filter(c => (c.kind === 'task' || c.kind === 'delegation') && isOpen(c));

  const mine = all.filter(c => c.owner === 'Me');
  const delegated = all.filter(c => c.owner === 'Delegated');
  const waiting = all.filter(c => c.owner === 'Waiting on other');
  const delegatable = all.filter(c => c.flags.includes('delegatable'));

  const [tab, setTab] = useState('mine');
  const map: Record<string, AnyCard[]> = { mine, delegated, waiting, delegatable };

  return (
    <Page title="Tasks" sub="Mine, delegated, or waiting — three states, visible at a glance.">
      <Tabs
        active={tab} onChange={setTab}
        tabs={[
          { key: 'mine', label: 'Mine', count: mine.length },
          { key: 'delegated', label: 'Delegated', count: delegated.length },
          { key: 'waiting', label: 'Waiting', count: waiting.length },
          { key: 'delegatable', label: 'Could delegate', count: delegatable.length },
        ]}
      />
      <List items={map[tab]} go={go} />
    </Page>
  );
}

/* ---- Search — FR-SCH-2: context, never titles alone --------- */
export function Search({ go }: { go: (v: string, id?: string) => void }) {
  const { cards } = useStore();
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return cards.filter(c =>
      c.title.toLowerCase().includes(term) ||
      c.lifeAreas.some(a => a.toLowerCase().includes(term)) ||
      c.status.toLowerCase().includes(term) ||
      (c.notes ?? '').toLowerCase().includes(term)
    ).slice(0, 40);
  }, [q, cards]);

  return (
    <Page title="Search">
      <input
        className="search"
        placeholder="Search people, commitments, projects, anything…"
        value={q}
        onChange={e => setQ(e.target.value)}
        autoFocus
      />
      {q.trim().length >= 2 && (
        <p className="page__sub">{results.length} result{results.length === 1 ? '' : 's'}</p>
      )}
      <ul className="list list-dense">
        {results.map(c => (
          <li key={c.id}>
            <button className="res" onClick={() => go('detail', c.id)}>
              <span className="res__kind">{c.kind}</span>
              <span className="res__title">{c.title}</span>
              {/* FR-SCH-2 — context, not just the title */}
              <span className="res__ctx">
                {c.status}
                {c.lifeAreas.length ? ` · ${c.lifeAreas.join(', ')}` : ''}
                {c.nextAction ? ` · next: ${c.nextAction}` : ''}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Page>
  );
}

/* ---- Detail — DetailShell (B.3) ----------------------------- */
export function Detail({ id, go }: { id: string; go: (v: string, id?: string) => void }) {
  const { byId, cards, nameOf } = useStore();
  const c = byId(id);
  if (!c) return <Page title="Not found"><p className="empty">That item is no longer here.</p></Page>;

  // Entities get the configured detail layout wherever they are opened from.
  if (c.kind === 'entity') return <EntityDetail id={id} go={go} />;

  const related = c.relatedIds.map(r => cards.find(x => x.id === r)).filter(Boolean) as AnyCard[];

  const fields: [string, string | undefined][] = [
    ['Status', c.status],
    ['Importance', c.importance],
    ['Attention', c.attentionType],
    ['Owner', c.owner],
    ['Due', c.dueDate],
    ['Next action', c.nextAction],
    ['Life areas', c.lifeAreas.join(', ') || undefined],
    ...(c.kind === 'commitment' ? [
      ['Direction', (c as Commitment).direction] as [string, string],
      ['Person', nameOf((c as Commitment).personId)] as [string, string],
      ['Created', (c as Commitment).createdDate] as [string, string],
    ] : []),
    ...(c.kind === 'contact' ? [
      ['Strength', (c as Contact).strength] as [string, string],
      ['Cadence', `${(c as Contact).cadenceDays} days`] as [string, string],
      ['Last interaction', (c as Contact).lastInteraction] as [string, string],
      ['How we met', (c as Contact).howWeMet] as [string, string | undefined],
      ['They care about', (c as Contact).theyCareAbout] as [string, string | undefined],
      ['Working on', (c as Contact).workingOn] as [string, string | undefined],
      ['Ways I can help', (c as Contact).waysICanHelp] as [string, string | undefined],
    ] : []),
  ];

  return (
    <Page title={c.title} sub={c.kind}>
      <div className="detail">
        <dl className="fields">
          {fields.filter(([, v]) => v).map(([k, v]) => (
            <div className="field" key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>

        {!!related.length && (
          <section className="sec">
            <header className="sec__head"><h2 className="sec__title">Related</h2></header>
            <ul className="list list-dense">
              {related.map(r => <li key={r.id}><Card card={r} onOpen={rid => go('detail', rid)} /></li>)}
            </ul>
          </section>
        )}
      </div>
    </Page>
  );
}
