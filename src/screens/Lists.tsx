/* ============================================================
   Phase 1 list screens — Today, Inbox, Commitments, People, Search
   All composed from CardList + the shared card library (B.2/B.3).
   ============================================================ */

import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Card } from '../components/Card';
import { daysFromToday, daysSince, todayLabel } from '../lib/dates';
import { completeness } from '../lib/profile';
import type { CardKind } from '../types';
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

/* ---- Add one directly --------------------------------------
   Capture is for when you do not want to decide yet. This is for
   when you already have — seeding ten people should not mean ten
   trips through the inbox. Type, enter, and it opens for details. */
function AddRow({ kind, label, placeholder, go }: {
  kind: CardKind; label: string; placeholder: string;
  go: (v: string, id?: string) => void;
}) {
  const { addCard } = useStore();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const submit = (thenOpen: boolean) => {
    const t = text.trim();
    if (!t) return;
    const id = addCard(kind, t);
    setText('');
    if (thenOpen) { setOpen(false); go('detail', id); }
  };

  if (!open) {
    return (
      <button className="addrow__open" onClick={() => setOpen(true)}>+ {label}</button>
    );
  }

  return (
    <div className="addrow">
      <input
        className="addrow__input"
        autoFocus
        value={text}
        placeholder={placeholder}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') submit(false);   // keep going, for seeding a list
          if (e.key === 'Escape') { setText(''); setOpen(false); }
        }}
      />
      <button className="act act--primary" onClick={() => submit(true)}>Add & open</button>
      <button className="act" onClick={() => { setText(''); setOpen(false); }}>Done</button>
      <span className="addrow__hint">Enter adds another · Escape closes</span>
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
      <AddRow kind="commitment" label="Add a commitment"
        placeholder="What was promised — you can say who after" go={go} />
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

/* ---- People — FR-CRM-6 --------------------------------------
   Forty contacts is already past the point where an alphabetical
   list is useful. The default answers "who needs me?", not "who
   exists?" — sorted by how far past cadence, weighted by how much
   the relationship matters.                                      */

const STRENGTH_WEIGHT: Record<Contact['strength'], number> = {
  'Inner Circle': 4, 'Active': 2.5, 'New': 2, 'Warm': 1, 'Dormant': 0.5,
};

/** Higher means more overdue, relative to what this relationship deserves. */
function attentionScore(c: Contact) {
  const since = daysSince(c.lastInteraction) ?? 0;
  return ((since - c.cadenceDays) / c.cadenceDays) * STRENGTH_WEIGHT[c.strength];
}

type Sort = 'priority' | 'recent' | 'name' | 'surname' | 'strength';

/** Last token of the name. Handles "Hugh Ellery-Watts" correctly. */
function surnameOf(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

/** The letter a contact files under, following whichever sort is on. */
function initialOf(c: Contact, sort: Sort) {
  const n = sort === 'surname' ? surnameOf(c.title) : c.title;
  const ch = n.charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : '#';
}

const ALPHABET = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export function People({ go }: { go: (v: string, id?: string) => void }) {
  const { cards } = useStore();
  const all = cards.filter(c => c.kind === 'contact') as Contact[];

  const [tab, setTab] = useState('priority');
  const [sort, setSort] = useState<Sort>('priority');
  const [q, setQ] = useState('');
  const [city, setCity] = useState<string>('');

  const cities = useMemo(
    () => [...new Set(all.map(c => c.city).filter(Boolean))].sort() as string[],
    [all],
  );

  const needsAttention = all.filter(c => attentionScore(c) > 0);
  const inner = all.filter(c => c.strength === 'Inner Circle');
  const dormant = all.filter(c => c.flags.includes('dormant'));
  const fresh = all.filter(c => c.strength === 'New');
  const accounts = all.filter(c => c.keyAccount);

  /* The gap worth surfacing: a top account whose profile is thin.
     Being asked to name the decision maker's pressures and having
     nothing to say is the finding, not the percentage. */
  const thin = accounts
    .filter(c => completeness(c).percent < 50)
    .sort((a, b) => completeness(a).percent - completeness(b).percent);

  const base: Record<string, Contact[]> = {
    priority: needsAttention, inner, dormant, fresh, all, accounts,
  };

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = base[tab] ?? all;

    if (term) {
      list = list.filter(c =>
        c.title.toLowerCase().includes(term) ||
        (c.organization ?? '').toLowerCase().includes(term) ||
        (c.role ?? '').toLowerCase().includes(term) ||
        (c.city ?? '').toLowerCase().includes(term) ||
        (c.theyCareAbout ?? '').toLowerCase().includes(term) ||
        (c.workingOn ?? '').toLowerCase().includes(term));
    }
    if (city) list = list.filter(c => c.city === city);

    const sorted = [...list];
    if (sort === 'priority') sorted.sort((a, b) => attentionScore(b) - attentionScore(a));
    if (sort === 'recent') sorted.sort((a, b) => (daysSince(a.lastInteraction) ?? 0) - (daysSince(b.lastInteraction) ?? 0));
    if (sort === 'name') sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'surname') sorted.sort((a, b) =>
      surnameOf(a.title).localeCompare(surnameOf(b.title)) || a.title.localeCompare(b.title));
    if (sort === 'strength') sorted.sort((a, b) =>
      STRENGTH_WEIGHT[b.strength] - STRENGTH_WEIGHT[a.strength] || a.title.localeCompare(b.title));
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, q, city, sort, all]);

  const alphabetical = sort === 'name' || sort === 'surname';

  return (
    <Page
      title="People"
      sub="Relationship intelligence, not an address book. Sorted by who is furthest past the cadence their relationship deserves."
    >
      <input
        className="filterfield"
        placeholder="Search by name, organisation, city, or what they care about…"
        value={q}
        onChange={e => setQ(e.target.value)}
      />

      <AddRow kind="contact" label="Add someone" placeholder="Their name" go={go} />

      <Tabs
        active={tab}
        onChange={k => {
          setTab(k);
          /* Everyone is a directory — you open it to find a person,
             not to see who needs you. So it lands alphabetical, and
             the A–Z appears without anyone having to discover a
             sort control first. */
          if (k === 'all' && sort === 'priority') setSort('surname');
          if (k !== 'all' && sort === 'surname') setSort('priority');
        }}
        tabs={[
          { key: 'priority', label: 'Needs you', count: needsAttention.length },
          { key: 'inner', label: 'Inner circle', count: inner.length },
          { key: 'dormant', label: 'Dormant', count: dormant.length },
          { key: 'fresh', label: 'New', count: fresh.length },
          { key: 'accounts', label: 'Key accounts', count: accounts.length },
          { key: 'all', label: 'Everyone', count: all.length },
        ]}
      />

      {tab === 'accounts' && !!thin.length && (
        <div className="warnbox">
          <strong>{thin.length} of {accounts.length} key accounts are under half complete.</strong>{' '}
          {thin.slice(0, 3).map(c => c.title).join(', ')}
          {thin.length > 3 ? ` and ${thin.length - 3} more` : ''}. Open one to see
          exactly what is missing.
        </div>
      )}

      <div className="controls">
        <span className="controls__label">Sort</span>
        {([
          ['priority', 'Who needs you'], ['recent', 'Last contact'],
          ['name', 'First name'], ['surname', 'Surname'], ['strength', 'Closeness'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            className={`hint ${sort === k ? 'hint--on' : ''}`}
            onClick={() => setSort(k)}
          >{label}</button>
        ))}

        <select
          className="controls__select"
          value={city}
          onChange={e => setCity(e.target.value)}
          aria-label="Filter by city"
        >
          <option value="">Anywhere</option>
          {cities.map(ct => <option key={ct} value={ct}>{ct}</option>)}
        </select>

        <span className="controls__count tnum">{shown.length}</span>
      </div>

      {alphabetical ? <AlphaList items={shown} sort={sort} go={go} /> : <List items={shown} go={go} />}
    </Page>
  );
}

/* ---- A–Z ----------------------------------------------------
   Forty contacts is past the point where scrolling is navigation.
   Letters with nobody behind them stay visible but inert, because
   a jumping strip is harder to hit than a static one.           */
function AlphaList({ items, sort, go }: {
  items: Contact[]; sort: Sort; go: (v: string, id?: string) => void;
}) {
  const groups = new Map<string, Contact[]>();
  for (const c of items) {
    const k = initialOf(c, sort);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(c);
  }

  const jump = (letter: string) =>
    document.getElementById(`alpha-${letter}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (!items.length) return <p className="empty">Nobody matches that.</p>;

  return (
    <>
      <div className="alpha" role="navigation" aria-label="Jump to letter">
        {ALPHABET.map(l => (
          <button
            key={l}
            className={`alpha__l ${groups.has(l) ? '' : 'alpha__l--none'}`}
            onClick={() => groups.has(l) && jump(l)}
            disabled={!groups.has(l)}
            aria-label={groups.has(l) ? `Jump to ${l}` : `No contacts under ${l}`}
          >{l}</button>
        ))}
      </div>

      {[...groups.entries()].map(([letter, list]) => (
        <section className="alphagroup" key={letter} id={`alpha-${letter}`}>
          <div className="alphagroup__head">
            <span className="alphagroup__l">{letter}</span>
            <span className="alphagroup__rule" />
            <span className="alphagroup__n">{list.length}</span>
          </div>
          <ul className="list list-dense">
            {list.map(c => (
              <li key={c.id}><Card card={c} onOpen={id => go('detail', id)} /></li>
            ))}
          </ul>
        </section>
      ))}
    </>
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
