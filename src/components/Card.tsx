/* ============================================================
   AttentionCard + variants — PRD Appendix B.2
   Every card extends one base so a card renders identically in a
   list, a Home section and a detail panel.
   ============================================================ */

import type { ReactNode } from 'react';
import type {
  AnyCard, Commitment, Contact, Delegation, EventCard,
  Opportunity, Project, Reminder, Goal, Entity, Task, InboxItem,
} from '../types';
import { urgencyOf, relativeLabel, daysSince, daysFromToday } from '../lib/dates';
import {
  UrgencyDot, StatusBadge, DirectionMark, LifeAreas, PersonChip,
  DateLabel, NextActionLine, FlagBadge, InlineActions,
} from './primitives';
import type { Action } from './primitives';
import { useStore } from '../store';

/* ---- Base -------------------------------------------------- */
export function AttentionCard({
  urgencyDate, title, meta, right, actions, onOpen, marked, done,
}: {
  urgencyDate?: string;
  title: ReactNode;
  meta?: ReactNode;
  right?: ReactNode;
  actions?: Action[];
  onOpen?: () => void;
  /** Gold edge — curation and ownership. Never urgency. */
  marked?: boolean;
  done?: boolean;
}) {
  const u = urgencyOf(urgencyDate);
  return (
    <div
      className={`card u-${u}${marked ? ' card--marked' : ''}${done ? ' card--done' : ''}`}
      onClick={onOpen}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={onOpen ? e => { if (e.key === 'Enter') onOpen(); } : undefined}
    >
      <span className="card__lead"><UrgencyDot urgency={u} /></span>
      <div className="card__body">
        <div className="card__title">{title}</div>
        {meta && <div className="card__meta">{meta}</div>}
      </div>
      <div className="card__right">
        {right}
        {actions && <InlineActions actions={actions} />}
      </div>
    </div>
  );
}

/* ---- Dispatcher -------------------------------------------- */
export function Card({ card, onOpen, marked }: {
  card: AnyCard; onOpen?: (id: string) => void; marked?: boolean;
}) {
  switch (card.kind) {
    case 'commitment':  return <CommitmentCard c={card as Commitment} onOpen={onOpen} marked={marked} />;
    case 'contact':     return <ContactCard c={card as Contact} onOpen={onOpen} />;
    case 'delegation':  return <DelegationCard c={card as Delegation} onOpen={onOpen} />;
    case 'opportunity': return <OpportunityCard c={card as Opportunity} onOpen={onOpen} marked={marked} />;
    case 'project':     return <ProjectCard c={card as Project} onOpen={onOpen} marked={marked} />;
    case 'reminder':    return <ReminderCard c={card as Reminder} onOpen={onOpen} />;
    case 'event':       return <EventRow c={card as EventCard} />;
    case 'goal':        return <GoalCard c={card as Goal} onOpen={onOpen} />;
    case 'entity':      return <EntityCard c={card as Entity} onOpen={onOpen} />;
    case 'inbox':       return <InboxRow c={card as InboxItem} />;
    default:            return <TaskRow c={card as Task} onOpen={onOpen} marked={marked} />;
  }
}

/* ---- CommitmentCard — FR-COM-1, FR-COM-6 -------------------- */
export function CommitmentCard({ c, onOpen, marked }: { c: Commitment; onOpen?: (id: string) => void; marked?: boolean }) {
  const { nameOf, complete, followUp, snooze } = useStore();
  const theirs = c.direction === 'They Owe';

  /* FR-COM-6 — for "They Owe" the primary move is to ASK, not to DO. */
  const actions: Action[] = theirs
    ? [{ label: 'Follow up', onClick: () => followUp(c.id), primary: true }]
    : [
        { label: 'Done', onClick: () => complete(c.id), primary: true },
        { label: 'Snooze', onClick: () => snooze(c.id, 7) },
      ];

  return (
    <AttentionCard
      urgencyDate={c.dueDate ?? c.followUpDate}
      title={c.title}
      onOpen={onOpen ? () => onOpen(c.id) : undefined}
      marked={marked}
      meta={<>
        <DirectionMark direction={c.direction} />
        <PersonChip name={nameOf(c.personId)} />
        <DateLabel iso={c.dueDate ?? c.followUpDate} />
        {c.organization && <><span className="sep">·</span><span>{c.organization}</span></>}
      </>}
      actions={actions}
    />
  );
}

/* ---- ContactCard — FR-CRM-2, FR-CRM-3 ----------------------- */
export function ContactCard({ c, onOpen }: { c: Contact; onOpen?: (id: string) => void }) {
  const { logInteraction } = useStore();
  const since = daysSince(c.lastInteraction) ?? 0;
  const overdue = since > c.cadenceDays;

  return (
    <AttentionCard
      urgencyDate={overdue ? '2026-07-01' : undefined}
      title={c.title}
      onOpen={onOpen ? () => onOpen(c.id) : undefined}
      meta={<>
        <span className={`badge ${c.strength === 'Inner Circle' ? 'badge--filled' : 'badge--muted'}`}>
          {c.strength}
        </span>
        {c.role && <span>{c.role}{c.organization ? `, ${c.organization}` : ''}</span>}
        <span className="sep">·</span>
        <span className={overdue ? 'date u-overdue' : 'date u-later'}>
          {since} days since contact
        </span>
      </>}
      right={c.flags.map(f => <FlagBadge key={f} flag={f} />)}
      actions={[{ label: 'Logged today', onClick: () => logInteraction(c.id), primary: overdue }]}
    />
  );
}

/* ---- DelegationCard — FR-DEL-1, FR-DEL-3 -------------------- */
export function DelegationCard({ c, onOpen }: { c: Delegation; onOpen?: (id: string) => void }) {
  const { nameOf, complete } = useStore();
  const checkIn = daysFromToday(c.checkInDate);
  const overdueCheckIn = checkIn !== undefined && checkIn <= 0;

  return (
    <AttentionCard
      urgencyDate={c.checkInDate}
      title={c.title}
      onOpen={onOpen ? () => onOpen(c.id) : undefined}
      meta={<>
        <PersonChip name={nameOf(c.personId)} />
        {/* FR-DEL-3 — check-in is shown distinctly from the due date */}
        <span className={overdueCheckIn ? 'date u-overdue' : 'date u-later'}>
          check-in {relativeLabel(c.checkInDate)}
        </span>
        <span className="sep">·</span>
        <DateLabel iso={c.dueDate} prefix="due" />
      </>}
      actions={[{ label: 'Check in', onClick: () => complete(c.id), primary: overdueCheckIn }]}
    />
  );
}

/* ---- OpportunityCard — FR-OPP-2: absence is the finding ----- */
export function OpportunityCard({ c, onOpen, marked }: { c: Opportunity; onOpen?: (id: string) => void; marked?: boolean }) {
  return (
    <AttentionCard
      urgencyDate={c.flags.includes('stalled') ? '2026-07-01' : undefined}
      title={c.title}
      onOpen={onOpen ? () => onOpen(c.id) : undefined}
      marked={marked}
      meta={<>
        <StatusBadge status={c.stage as never} />
        <NextActionLine text={c.nextMove} />
        {c.daysSinceMove !== undefined && (
          <><span className="sep">·</span><span>{c.daysSinceMove}d since last move</span></>
        )}
      </>}
      right={c.flags.map(f => <FlagBadge key={f} flag={f} />)}
    />
  );
}

/* ---- ProjectCard ------------------------------------------- */
export function ProjectCard({ c, onOpen, marked }: { c: Project; onOpen?: (id: string) => void; marked?: boolean }) {
  return (
    <AttentionCard
      urgencyDate={c.milestoneDate}
      title={c.title}
      onOpen={onOpen ? () => onOpen(c.id) : undefined}
      marked={marked}
      meta={<>
        <StatusBadge status={c.status} />
        {c.blockedDays !== undefined && <span>blocked {c.blockedDays}d</span>}
        {c.nextMilestone && <>
          <span className="sep">·</span>
          <span>{c.nextMilestone}</span>
          <DateLabel iso={c.milestoneDate} />
        </>}
      </>}
      right={c.flags.map(f => <FlagBadge key={f} flag={f} />)}
    />
  );
}

/* ---- ReminderCard — FR-REM-2, FR-REM-5 ---------------------- */
export function ReminderCard({ c, onOpen }: { c: Reminder; onOpen?: (id: string) => void }) {
  const { complete, snooze, nameOf } = useStore();
  return (
    <AttentionCard
      urgencyDate={c.dueDate}
      title={c.title}
      onOpen={onOpen ? () => onOpen(c.id) : undefined}
      meta={<>
        <DateLabel iso={c.dueDate} />
        <span className="sep">·</span>
        <span>{c.reminderKind}</span>
        {c.parentId && <><span className="sep">·</span><span>{nameOf(c.parentId)}</span></>}
      </>}
      right={c.flags.map(f => <FlagBadge key={f} flag={f} />)}
      actions={[
        { label: c.recurrence ? 'Done — roll on' : 'Done', onClick: () => complete(c.id), primary: true },
        { label: 'Snooze', onClick: () => snooze(c.id, 7) },
      ]}
    />
  );
}

/* ---- EventRow ---------------------------------------------- */
export function EventRow({ c }: { c: EventCard }) {
  const { nameOf } = useStore();
  return (
    <AttentionCard
      urgencyDate={c.start}
      title={<><strong style={{ fontVariantNumeric: 'tabular-nums', marginRight: 10 }}>{c.time}</strong>{c.title}</>}
      meta={<>
        <DateLabel iso={c.start} />
        {c.attendeeIds?.map(id => <PersonChip key={id} name={nameOf(id)} />)}
      </>}
    />
  );
}

/* ---- GoalCard — FR-GOL-2 ----------------------------------- */
export function GoalCard({ c, onOpen }: { c: Goal; onOpen?: (id: string) => void }) {
  return (
    <AttentionCard
      title={c.title}
      onOpen={onOpen ? () => onOpen(c.id) : undefined}
      meta={<>
        <span>{c.area}</span>
        <span className="sep">·</span>
        <span>{c.horizon}</span>
        {c.progress && <><span className="sep">·</span><span>{c.progress}</span></>}
      </>}
      right={c.projectIds.length === 0 ? <FlagBadge flag="not-staffed" /> : undefined}
    />
  );
}

/* ---- EntityCard -------------------------------------------- */
export function EntityCard({ c, onOpen }: { c: Entity; onOpen?: (id: string) => void }) {
  return (
    <AttentionCard
      title={c.title}
      onOpen={onOpen ? () => onOpen(c.id) : undefined}
      meta={<>
        <StatusBadge status={c.status} />
        {c.role && <span>{c.role}</span>}
        <NextActionLine text={c.nextAction} />
      </>}
      right={<LifeAreas areas={c.lifeAreas} />}
    />
  );
}

/* ---- TaskRow ----------------------------------------------- */
export function TaskRow({ c, onOpen, marked }: { c: Task; onOpen?: (id: string) => void; marked?: boolean }) {
  const { complete, snooze } = useStore();
  return (
    <AttentionCard
      urgencyDate={c.dueDate}
      title={c.title}
      marked={marked}
      done={c.status === 'Complete'}
      onOpen={onOpen ? () => onOpen(c.id) : undefined}
      meta={<>
        <StatusBadge status={c.status} />
        <DateLabel iso={c.dueDate} />
        {c.recurrence && <><span className="sep">·</span><span>{c.recurrence}</span></>}
        <LifeAreas areas={c.lifeAreas} max={2} />
      </>}
      right={c.flags.map(f => <FlagBadge key={f} flag={f} />)}
      actions={[
        { label: 'Done', onClick: () => complete(c.id), primary: true },
        { label: 'Snooze', onClick: () => snooze(c.id, 7) },
      ]}
    />
  );
}

/* ---- InboxRow ---------------------------------------------- */
export function InboxRow({ c }: { c: InboxItem }) {
  const { convertInbox, archive } = useStore();
  return (
    <AttentionCard
      title={c.title}
      meta={<>
        <span>captured {relativeLabel(c.capturedAt)}</span>
        {c.hint && <><span className="sep">·</span><span className="la">{c.hint}</span></>}
      </>}
      actions={[
        { label: 'File as task', onClick: () => convertInbox(c.id, 'task'), primary: true },
        { label: 'Archive', onClick: () => archive(c.id) },
      ]}
    />
  );
}
