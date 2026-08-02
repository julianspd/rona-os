/* ============================================================
   Primitives — PRD Appendix B.1
   ============================================================ */

import type { ReactNode } from 'react';
import type { Flag, LifeArea, Status, Urgency } from '../types';
import { relativeLabel, absoluteLabel, urgencyOf } from '../lib/dates';
import './primitives.css';

/* ---- UrgencyDot — D.1 -------------------------------------- */
export function UrgencyDot({ urgency }: { urgency: Urgency }) {
  const label: Record<Urgency, string> = {
    overdue: 'Overdue', today: 'Due today', soon: 'Due soon',
    upcoming: 'Upcoming', later: 'Later',
  };
  return <span className={`dot u-${urgency}`} role="img" aria-label={label[urgency]} />;
}

/* ---- StatusBadge — D.2: shape, not colour alone ------------- */
const OUTLINED = ['Waiting', 'Delegated', 'Blocked'];
const FILLED = ['Active', 'Next', 'Scheduled', 'Open'];
const MUTED = ['On Hold', 'Someday', 'Nurture', 'Incubating', 'Exploring', 'Dormant', 'Inbox'];
const DONE = ['Complete', 'Archived', 'Fulfilled', 'Released', 'Closed'];

export function StatusBadge({ status }: { status: Status }) {
  const shape =
    OUTLINED.includes(status) ? 'outlined'
    : FILLED.includes(status) ? 'filled'
    : DONE.includes(status) ? 'done'
    : MUTED.includes(status) ? 'muted'
    : 'muted';
  return <span className={`badge badge--${shape}`}>{status}</span>;
}

/* ---- Direction — the strongest non-urgency signal in the system.
   FR-COM-1. Outward responsibility vs incoming dependency, carried
   by arrow direction, fill and language — legible in greyscale. */
export function DirectionMark({ direction }: { direction: 'I Owe' | 'They Owe' }) {
  const mine = direction === 'I Owe';
  return (
    <span className={`dir ${mine ? 'dir--mine' : 'dir--theirs'}`}>
      <span className="dir__arrow" aria-hidden="true">{mine ? '↑' : '↓'}</span>
      {mine ? 'I owe' : 'Waiting on'}
    </span>
  );
}

/* ---- LifeAreaTag ------------------------------------------- */
export function LifeAreaTag({ area }: { area: LifeArea }) {
  return <span className="la">{area}</span>;
}

export function LifeAreas({ areas, max = 3 }: { areas: LifeArea[]; max?: number }) {
  return (
    <span className="la-row">
      {areas.slice(0, max).map(a => <LifeAreaTag key={a} area={a} />)}
    </span>
  );
}

/* ---- PersonChip -------------------------------------------- */
export function PersonChip({ name, onClick }: { name: string; onClick?: () => void }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('');
  const El = onClick ? 'button' : 'span';
  return (
    <El className="chip" onClick={onClick}>
      <span className="chip__av" aria-hidden="true">{initials}</span>
      {name}
    </El>
  );
}

/* ---- DateLabel — relative first ----------------------------- */
export function DateLabel({ iso, prefix }: { iso?: string; prefix?: string }) {
  const u = urgencyOf(iso);
  return (
    <span className={`date u-${u}`} title={absoluteLabel(iso)}>
      {prefix ? `${prefix} ` : ''}{relativeLabel(iso)}
    </span>
  );
}

/* ---- NextActionLine — P2: absence is the finding ------------ */
export function NextActionLine({ text }: { text?: string }) {
  if (!text) return <span className="next next--missing">No next move set</span>;
  return <span className="next">{text}</span>;
}

/* ---- FlagBadge --------------------------------------------- */
const FLAG_LABEL: Record<Flag, string> = {
  'stalled': 'Stalled',
  'at-risk': 'At risk',
  'dormant': 'Dormant',
  'postponed': 'Postponed 3×',
  'delegatable': 'Could delegate',
  'not-staffed': 'Not staffed',
  'revisit-due': 'Revisit due',
};

export function FlagBadge({ flag }: { flag: Flag }) {
  return <span className={`flag flag--${flag}`}>{FLAG_LABEL[flag]}</span>;
}

/* ---- InlineActions — UX-2 ---------------------------------- */
export interface Action { label: string; onClick: () => void; primary?: boolean }

export function InlineActions({ actions }: { actions: Action[] }) {
  if (!actions.length) return null;
  return (
    <span className="acts">
      {actions.map(a => (
        <button
          key={a.label}
          className={`act ${a.primary ? 'act--primary' : ''}`}
          onClick={e => { e.stopPropagation(); a.onClick(); }}
        >
          {a.label}
        </button>
      ))}
    </span>
  );
}

/* ---- AILabel — UX-11 / AI-1, AI-2 --------------------------- */
export function AILabel({ reason, children }: { reason: string; children: ReactNode }) {
  return (
    <div className="ai">
      <div className="ai__tag">AI suggestion</div>
      <div>{children}</div>
      <div className="ai__why">Why: {reason}</div>
    </div>
  );
}

/* ---- Small shared bits ------------------------------------- */
export function Meta({ children }: { children: ReactNode }) {
  return <div className="meta">{children}</div>;
}

/** The signature gold rule. Used once per major moment, never as trim. */
export function GoldRule() {
  return <hr className="rule-gold" />;
}
