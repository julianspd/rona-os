/* ============================================================
   Detail — read, then edit, in the same place

   View is the default. Editing is deliberate, because most visits
   are to check something rather than change it, and a screen full
   of live inputs reads as work even when you only came to look.

   Changes save as they are made. There is no Save button, because
   a Save button implies a way to lose what you typed.
   ============================================================ */

import { useState } from 'react';
import { useStore } from '../store';
import { Card } from '../components/Card';
import {
  AreaField, DateField, FieldRow, SelectField, TagField, TextField,
} from '../components/Fields';
import { GROUPS, fieldsFor } from '../lib/fields';
import type { FieldSpec } from '../lib/fields';
import {
  DirectionMark, LocalTime, StatusBadge, FlagBadge, PersonChip,
} from '../components/primitives';
import { EntityDetail } from './Spheres';
import { annualLabel, daysUntilAnnual, untilLabel } from '../lib/dates';
import type { AnyCard, Commitment, Contact, LifeArea } from '../types';
import './detail.css';

type Go = (v: string, id?: string) => void;

export function Detail({ id, go }: { id: string; go: Go }) {
  const { byId, cards, nameOf, update, complete, archive } = useStore();
  const [editing, setEditing] = useState(false);

  const c = byId(id);
  if (!c) {
    return <div className="page"><p className="empty">That item is no longer here.</p></div>;
  }

  // Entities and contacts have their own shapes worth keeping.
  if (c.kind === 'entity') return <EntityDetail id={id} go={go} />;
  if (c.kind === 'contact') return <ContactDetail c={c as Contact} go={go} />;

  const specs = fieldsFor(c.kind);
  const val = (k: string) => (c as unknown as Record<string, unknown>)[k];
  const set = (k: string, v: unknown) => update(c.id, { [k]: v } as Partial<AnyCard>);

  const related = c.relatedIds
    .map(r => cards.find(x => x.id === r))
    .filter(Boolean) as AnyCard[];

  const control = (f: FieldSpec) => {
    switch (f.type) {
      case 'select':
        return <SelectField editing={editing} value={val(f.key) as string}
          options={f.options ?? []} onChange={v => set(f.key, v || undefined)} />;
      case 'date':
        return <DateField editing={editing} value={val(f.key) as string}
          onChange={v => set(f.key, v)} />;
      case 'areas':
        return <AreaField editing={editing} value={(val(f.key) as LifeArea[]) ?? []}
          onChange={v => set(f.key, v)} />;
      case 'tags':
        return <TagField editing={editing} value={(val(f.key) as string[]) ?? []}
          onChange={v => set(f.key, v)} />;
      case 'person':
        return <PersonChip name={nameOf(val(f.key) as string)}
          onClick={() => go('detail', val(f.key) as string)} />;
      case 'longtext':
        return <TextField editing={editing} long value={val(f.key) as string}
          onChange={v => set(f.key, v)} />;
      default:
        return <TextField editing={editing} value={val(f.key) as string}
          onChange={v => set(f.key, v)} />;
    }
  };

  /* An empty field is noise when reading and necessary when editing —
     except where the absence is itself the finding. */
  const visible = (f: FieldSpec) =>
    editing || f.showWhenEmpty || !isBlank(val(f.key));

  return (
    <div className="page detail2">
      <header className="dhead">
        <button className="crumb" onClick={() => go('home')}>← Back</button>

        <div className="dhead__top">
          {editing ? (
            <input
              className="dhead__title dhead__title--edit"
              value={c.title}
              onChange={e => update(c.id, { title: e.target.value })}
            />
          ) : (
            <h1 className="dhead__title">{c.title}</h1>
          )}
          <button
            className={`act ${editing ? 'act--primary' : ''}`}
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Done' : 'Edit'}
          </button>
        </div>

        <div className="dhead__meta">
          <span className="dhead__kind">{c.kind}</span>
          <StatusBadge status={c.status} />
          {c.kind === 'commitment' && <DirectionMark direction={(c as Commitment).direction} />}
          {c.flags.map(f => <FlagBadge key={f} flag={f} />)}
        </div>

        {editing && (
          <p className="dhead__hint">
            Changes save as you make them. There is no save button, and
            nothing here can be lost.
          </p>
        )}
      </header>

      {GROUPS.map(group => {
        const rows = specs.filter(f => f.group === group && visible(f));
        if (!rows.length) return null;
        return (
          <section className="dgroup" key={group}>
            <h2 className="dgroup__h">{group}</h2>
            <div className="dgroup__body">
              {rows.map(f => (
                <FieldRow key={f.key} label={f.label}>{control(f)}</FieldRow>
              ))}
            </div>
          </section>
        );
      })}

      {!!related.length && (
        <section className="dgroup">
          <h2 className="dgroup__h">Connected</h2>
          <ul className="list list-dense">
            {related.map(r => (
              <li key={r.id}><Card card={r} onOpen={rid => go('detail', rid)} /></li>
            ))}
          </ul>
        </section>
      )}

      <div className="dactions">
        <button className="act act--primary" onClick={() => complete(c.id)}>Mark done</button>
        <button className="act" onClick={() => archive(c.id)}>Drop it</button>
      </div>
    </div>
  );
}

function isBlank(v: unknown) {
  if (v === undefined || v === null || v === '') return true;
  return Array.isArray(v) && v.length === 0;
}

/* ---- Contacts keep their own shape --------------------------- */
function ContactDetail({ c, go }: { c: Contact; go: Go }) {
  const { cards, logInteraction } = useStore();
  const theirs = cards.filter(x =>
    x.kind === 'commitment' && (x as Commitment).personId === c.id);

  return (
    <div className="page detail2">
      <header className="dhead">
        <button className="crumb" onClick={() => go('people')}>← People</button>
        <div className="dhead__top">
          <h1 className="dhead__title">{c.title}</h1>
          <button className="act act--primary" onClick={() => logInteraction(c.id)}>
            Logged today
          </button>
        </div>
        <div className="dhead__meta">
          <StatusBadge status={c.strength as never} />
          {c.role && <span>{c.role}{c.organization ? `, ${c.organization}` : ''}</span>}
          <LocalTime city={c.city} timezone={c.timezone} showOffset />
          {c.flags.map(f => <FlagBadge key={f} flag={f} />)}
        </div>
      </header>

      <section className="dgroup">
        <h2 className="dgroup__h">Context</h2>
        <div className="dgroup__body">
          {c.howWeMet && <FieldRow label="How we met"><span className="fval">{c.howWeMet}</span></FieldRow>}
          {c.theyCareAbout && <FieldRow label="Cares about"><span className="fval">{c.theyCareAbout}</span></FieldRow>}
          {c.workingOn && <FieldRow label="Working on"><span className="fval">{c.workingOn}</span></FieldRow>}
          {c.waysICanHelp && <FieldRow label="I can help with"><span className="fval">{c.waysICanHelp}</span></FieldRow>}
          {c.giftIdeas && <FieldRow label="Gift ideas"><span className="fval">{c.giftIdeas}</span></FieldRow>}
          <FieldRow label="Cadence"><span className="fval">Every {c.cadenceDays} days</span></FieldRow>
          {(c.importantDates ?? []).map(d => (
            <FieldRow key={d.label} label={d.label}>
              <span className="fval">{annualLabel(d.date)} · {untilLabel(daysUntilAnnual(d.date))}</span>
            </FieldRow>
          ))}
        </div>
      </section>

      {!!c.channels?.length && (
        <div className="channels">
          <span className="channels__label">Reaches them by</span>
          {c.channels.map(ch => (
            <button key={ch} className="channel" disabled title="Not connected in this demo">{ch}</button>
          ))}
          <span className="channels__note">Not connected yet</span>
        </div>
      )}

      {!!theirs.length && (
        <section className="dgroup">
          <h2 className="dgroup__h">Between you</h2>
          <ul className="list list-dense">
            {theirs.map(x => <li key={x.id}><Card card={x} onOpen={rid => go('detail', rid)} /></li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
