/* ============================================================
   Slice 6 — Opportunities, Projects, Goals, Renewals, Documents,
   Decision log. All composed from the shared card library.
   ============================================================ */

import { useState } from 'react';
import { useStore } from '../store';
import { Card } from '../components/Card';
import { DateLabel, FlagBadge, StatusBadge } from '../components/primitives';
import { daysFromToday } from '../lib/dates';
import type {
  AnyCard, Bill, Decision, DocumentCard, Goal, Opportunity, OpportunityStage, Project, Reminder,
} from '../types';
import './spheres.css';

type Go = (v: string, id?: string) => void;

const ACTIVE_STAGES: OpportunityStage[] = [
  'Identified', 'Intro Requested', 'Connected', 'Discovery', 'Qualified',
  'Proposal/Scope', 'Negotiation', 'Decision Pending',
];

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
        <button key={t.key} className={`tab ${active === t.key ? 'tab--on' : ''}`} onClick={() => onChange(t.key)}>
          {t.label}<span className="tab__n">{t.count}</span>
        </button>
      ))}
    </div>
  );
}

/* ---- Opportunities — FR-OPP-1..8 ---------------------------- */
export function Opportunities({ go }: { go: Go }) {
  const { cards } = useStore();
  const all = cards.filter(c => c.kind === 'opportunity') as Opportunity[];

  const active = all.filter(o => ACTIVE_STAGES.includes(o.stage));
  const stalled = all.filter(o => o.flags.includes('stalled') || !o.nextMove);
  const closed = all.filter(o => o.stage === 'Won' || o.stage === 'Lost');
  const nurture = all.filter(o => o.stage === 'Nurture' || o.stage === 'Paused');
  const high = active.filter(o => (o.probability ?? 0) >= 45);

  const [tab, setTab] = useState('active');

  /* FR-OPP-8 — list is the default. Grouped by stage, not a board. */
  const body = () => {
    if (tab === 'active') {
      return ACTIVE_STAGES.map(stage => {
        const items = active.filter(o => o.stage === stage);
        if (!items.length) return null;           // hide-when-empty
        return (
          <div key={stage}>
            <div className="stage">
              <span className="stage__name">{stage}</span>
              <span className="stage__n">{items.length}</span>
              <span className="stage__line" />
            </div>
            <ul className="list list-dense">
              {items.map(o => <li key={o.id}><Card card={o} onOpen={id => go('detail', id)} /></li>)}
            </ul>
          </div>
        );
      });
    }
    const map: Record<string, Opportunity[]> = { stalled, closed, nurture, high };
    const items = map[tab] ?? [];
    return (
      <ul className="list list-dense">
        {items.map(o => (
          <li key={o.id}>
            <Card card={o} onOpen={id => go('detail', id)} />
            {/* FR-OPP-7 — the archive reads as a learning asset */}
            {o.outcome && <p className="outcome">{o.outcome}</p>}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Page title="Opportunities" sub="What must happen next to move this forward?">
      <Tabs
        active={tab} onChange={setTab}
        tabs={[
          { key: 'active', label: 'Active pipeline', count: active.length },
          { key: 'stalled', label: 'Stalled / no next move', count: stalled.length },
          { key: 'high', label: 'High potential', count: high.length },
          { key: 'nurture', label: 'Nurture & paused', count: nurture.length },
          { key: 'closed', label: 'Won / lost', count: closed.length },
        ]}
      />
      {body()}
    </Page>
  );
}

/* ---- Projects — FR-TSK-5..7 --------------------------------- */
export function Projects({ go }: { go: Go }) {
  const { cards } = useStore();
  const all = cards.filter(c => c.kind === 'project') as Project[];

  const active = all.filter(p => p.status === 'Active' || p.status === 'Blocked');
  const risk = all.filter(p => p.flags.includes('at-risk'));
  const decisions = all.filter(p => p.decisionRequired);
  const waiting = all.filter(p => p.status === 'Waiting' || p.status === 'On Hold');

  const [tab, setTab] = useState('active');
  const map: Record<string, Project[]> = { active, risk, decisions, waiting, all };

  return (
    <Page title="Work & projects" sub="At risk is derived from the fixtures, not set by hand on this screen.">
      <Tabs
        active={tab} onChange={setTab}
        tabs={[
          { key: 'active', label: 'Active', count: active.length },
          { key: 'risk', label: 'At risk', count: risk.length },
          { key: 'decisions', label: 'Decisions needed', count: decisions.length },
          { key: 'waiting', label: 'Waiting / on hold', count: waiting.length },
          { key: 'all', label: 'All', count: all.length },
        ]}
      />
      <ul className="list list-dense">
        {map[tab].map(p => (
          <li key={p.id}>
            <Card card={p} onOpen={id => go('detail', id)} />
            {tab === 'decisions' && p.decisionRequired && (
              <p className="outcome">Decision: {p.decisionRequired}</p>
            )}
          </li>
        ))}
      </ul>
    </Page>
  );
}

/* ---- Goals — FR-GOL-2 --------------------------------------- */
export function Goals({ go }: { go: Go }) {
  const { cards } = useStore();
  const all = cards.filter(c => c.kind === 'goal') as Goal[];
  const notStaffed = all.filter(g => g.projectIds.length === 0);

  return (
    <Page
      title="Goals"
      sub="A goal with no project attached is something you say matters, not something you are doing."
    >
      {!!notStaffed.length && (
        <div className="warnbox">
          <strong>{notStaffed.length} goals have no active project.</strong>{' '}
          Stated, but not staffed.
        </div>
      )}
      <ul className="list list-dense">
        {all.map(g => (
          <li key={g.id}>
            <Card card={g} onOpen={id => go('detail', id)} />
            {g.whyItMatters && <p className="outcome">{g.whyItMatters}</p>}
          </li>
        ))}
      </ul>
    </Page>
  );
}

/* ---- Renewals — FR-REM-6, the 90-day view ------------------- */
export function Renewals({ go }: { go: Go }) {
  const { cards } = useStore();
  const all = (cards.filter(c => c.kind === 'reminder') as Reminder[])
    .filter(r => r.status !== 'Complete' && r.status !== 'Archived')
    .sort((a, b) => (daysFromToday(a.dueDate) ?? 999) - (daysFromToday(b.dueDate) ?? 999));

  /* FR-REM-2 — the ladder, made visible as the organising structure */
  const rungs: [string, (d: number) => boolean][] = [
    ['Due today', d => d <= 0],
    ['Within 7 days', d => d <= 7],
    ['Within 14 days', d => d <= 14],
    ['Within 30 days', d => d <= 30],
    ['Within 60 days', d => d <= 60],
    ['Within 90 days', d => d <= 90],
    ['Later', () => true],
  ];

  const placed = new Set<string>();
  const groups = rungs.map(([label, test]) => {
    const items = all.filter(r => {
      if (placed.has(r.id)) return false;
      const d = daysFromToday(r.dueDate);
      if (d === undefined || !test(d)) return false;
      placed.add(r.id);
      return true;
    });
    return { label, items };
  });

  return (
    <Page title="Renewals & life admin" sub="One engine serving vehicles, properties, documents, health and subscriptions.">
      {groups.map(g => g.items.length ? (
        <div key={g.label}>
          <div className="stage">
            <span className="stage__name">{g.label}</span>
            <span className="stage__n">{g.items.length}</span>
            <span className="stage__line" />
          </div>
          <ul className="list list-dense">
            {g.items.map(r => <li key={r.id}><Card card={r} onOpen={id => go('detail', id)} /></li>)}
          </ul>
        </div>
      ) : null)}
    </Page>
  );
}

/* ---- Bills & obligations -----------------------------------
   The narrowest useful financial feature: nothing is missed.
   Not a ledger, not forecasting, not account aggregation.       */
export function Bills({ go }: { go: Go }) {
  const { cards, showAmounts, setShowAmounts } = useStore();
  const all = (cards.filter(c => c.kind === 'bill') as Bill[])
    .sort((a, b) => (daysFromToday(a.dueDate) ?? 999) - (daysFromToday(b.dueDate) ?? 999));

  const open = all.filter(b => b.paymentStatus !== 'Paid');
  const needsAction = open.filter(b => b.paymentStatus !== 'Autopay');
  const overdue = needsAction.filter(b => (daysFromToday(b.dueDate) ?? 99) < 0);
  const soon = open.filter(b => {
    const d = daysFromToday(b.dueDate);
    return d !== undefined && d >= 0 && d <= 30;
  });
  const autopay = open.filter(b => b.paymentStatus === 'Autopay');
  const paid = all.filter(b => b.paymentStatus === 'Paid');

  const [tab, setTab] = useState('soon');
  const map: Record<string, Bill[]> = { soon, action: needsAction, autopay, paid, all: open };

  const total = (list: Bill[]) => list.reduce((n, b) => n + (b.amount ?? 0), 0);

  return (
    <Page
      title="Bills & obligations"
      sub="Built to stop something being missed — not to model money. No accounts, no balances, no institutions."
    >
      {!!overdue.length && (
        <div className="warnbox">
          <strong>{overdue.length} past its due date.</strong>{' '}
          {overdue.map(b => b.title).join(' · ')}
        </div>
      )}

      <Tabs
        active={tab} onChange={setTab}
        tabs={[
          { key: 'soon', label: 'Next 30 days', count: soon.length },
          { key: 'action', label: 'Needs you', count: needsAction.length },
          { key: 'autopay', label: 'On autopay', count: autopay.length },
          { key: 'all', label: 'All open', count: open.length },
          { key: 'paid', label: 'Settled', count: paid.length },
        ]}
      />

      {/* Whether amounts are stored at all is an open question, so the
          interface works either way and Rona can decide by using it. */}
      <div className="billbar">
        <button className="act" onClick={() => setShowAmounts(!showAmounts)}>
          {showAmounts ? 'Hide amounts' : 'Show amounts'}
        </button>
        {showAmounts && !!map[tab].length && (
          <span className="billbar__total">
            {tab === 'paid' ? 'Settled' : 'Expected'}{' '}
            <span className="tnum">
              {total(map[tab]).toLocaleString('en-US', {
                style: 'currency', currency: 'USD', maximumFractionDigits: 0,
              })}
            </span>
          </span>
        )}
      </div>

      <ul className="list list-dense">
        {map[tab].map(b => <li key={b.id}><Card card={b} onOpen={id => go('detail', id)} /></li>)}
      </ul>

      {!map[tab].length && <p className="empty">Nothing here.</p>}
    </Page>
  );
}

/* ---- Documents — FR-DOC-1..4 -------------------------------- */
export function Documents({ go }: { go: Go }) {
  const { cards, nameOf } = useStore();
  const all = cards.filter(c => c.kind === 'document') as DocumentCard[];
  return (
    <Page title="Documents" sub="Links only. Surfaced from the thing they belong to, never a folder tree.">
      <ul className="list list-dense">
        {all.map(d => (
          <li key={d.id}>
            <button className="res" onClick={() => d.relatedIds[0] && go('detail', d.relatedIds[0])}>
              <span className="res__kind">{d.docType}{d.version ? ` · ${d.version}` : ''}</span>
              <span className="res__title">{d.title}</span>
              <span className="res__ctx">
                {d.relatedIds.length ? `belongs to ${nameOf(d.relatedIds[0])}` : 'unattached'}
                {d.expiresOn ? ' · ' : ''}
              </span>
              {d.expiresOn && <DateLabel iso={d.expiresOn} prefix="expires" />}
            </button>
          </li>
        ))}
      </ul>
    </Page>
  );
}

/* ---- Decision log — FR-DEC-1..3 ----------------------------- */
export function Decisions({ go }: { go: Go }) {
  const { cards } = useStore();
  const all = cards.filter(c => c.kind === 'decision') as Decision[];
  return (
    <Page title="Decision log" sub="What was decided, why, and when to look at it again.">
      <ul className="list">
        {all.map(d => (
          <li key={d.id} className="dec">
            <div className="dec__head">
              <span className="dec__title">{d.title}</span>
              <StatusBadge status={d.status} />
              {d.flags.map(f => <FlagBadge key={f} flag={f} />)}
            </div>
            {d.context && <p className="dec__row"><em>Context.</em> {d.context}</p>}
            {!!d.optionsConsidered?.length && (
              <p className="dec__row"><em>Options.</em> {d.optionsConsidered.join(' · ')}</p>
            )}
            {d.decisionMade && <p className="dec__row"><em>Decided.</em> {d.decisionMade}</p>}
            {d.rationale && <p className="dec__row"><em>Because.</em> {d.rationale}</p>}
            {d.outcome && <p className="dec__row"><em>Outcome.</em> {d.outcome}</p>}
            {d.revisitDate && (
              <p className="dec__row"><em>Revisit.</em> <DateLabel iso={d.revisitDate} /></p>
            )}
            {!!d.relatedIds.length && (
              <button className="act" onClick={() => go('detail-entity', d.relatedIds[0])}>
                Open related
              </button>
            )}
          </li>
        ))}
      </ul>
    </Page>
  );
}

export type { AnyCard };
