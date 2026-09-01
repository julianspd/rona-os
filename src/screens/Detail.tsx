/* ============================================================
   Detail — every field is its own control

   No edit mode. The value IS the control: click a status and the
   options appear where the status was; click a date and it becomes
   a calendar in place. Nothing moves, and there is no button to
   press before you are allowed to change something.

   Changes save as they are made. No save button, because a save
   button implies a way to lose what you typed.
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
import { PROFILE, SCORE_MEANING, completeness } from '../lib/profile';
import type { ClientProfile } from '../types';
import type { AnyCard, Commitment, Contact, LifeArea } from '../types';
import './detail.css';

type Go = (v: string, id?: string) => void;

export function Detail({ id, go }: { id: string; go: Go }) {
  const { byId, cards, nameOf, update, complete, archive } = useStore();
  const [renaming, setRenaming] = useState(false);

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

  /** Which option set colours this field. */
  const colouring = (key: string) =>
    key === 'status' ? 'status' as const
    : key === 'importance' ? 'importance' as const
    : key === 'attentionType' ? 'attention' as const
    : 'plain' as const;

  const control = (f: FieldSpec) => {
    switch (f.type) {
      case 'select':
        return <SelectField label={f.label} field={colouring(f.key)}
          value={val(f.key) as string} options={f.options ?? []}
          onChange={v => set(f.key, v)} />;
      case 'date':
        return <DateField value={val(f.key) as string} onChange={v => set(f.key, v)} />;
      case 'areas':
        return <AreaField value={(val(f.key) as LifeArea[]) ?? []} onChange={v => set(f.key, v)} />;
      case 'tags':
        return <TagField value={(val(f.key) as string[]) ?? []} onChange={v => set(f.key, v)} />;
      case 'person':
        return <PersonChip name={nameOf(val(f.key) as string)}
          onClick={() => go('detail', val(f.key) as string)} />;
      case 'longtext':
        return <TextField long value={val(f.key) as string} onChange={v => set(f.key, v)} />;
      default:
        return <TextField value={val(f.key) as string} onChange={v => set(f.key, v)} />;
    }
  };

  /* Everything is editable, so everything shows. An empty row is
     an invitation, not clutter — it is the only way to know the
     field exists at all. */
  const visible = (_f: FieldSpec) => true;

  return (
    <div className="page detail2">
      <header className="dhead">
        <button className="crumb" onClick={() => go('home')}>← Back</button>

        <div className="dhead__top">
          {renaming ? (
            <input
              className="dhead__title dhead__title--edit"
              autoFocus
              value={c.title}
              onBlur={() => setRenaming(false)}
              onKeyDown={e => e.key === 'Enter' && setRenaming(false)}
              onChange={e => update(c.id, { title: e.target.value })}
            />
          ) : (
            <h1 className="dhead__title dhead__title--btn" onClick={() => setRenaming(true)}>
              {c.title}
            </h1>
          )}
        </div>

        <div className="dhead__meta">
          <span className="dhead__kind">{c.kind}</span>
          <StatusBadge status={c.status} />
          {c.kind === 'commitment' && <DirectionMark direction={(c as Commitment).direction} />}
          {c.flags.map(f => <FlagBadge key={f} flag={f} />)}
        </div>

        <p className="dhead__hint">
          Every field here is editable — click it. Changes save as you make
          them, and nothing can be lost.
        </p>
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

/* ---- The client profile ------------------------------------
   Her template, section for section, editable in place like
   everything else. Only rendered for a key account, because
   thirty empty fields on an aunt is a form, not a record.      */
function ProfileBlock({ c }: { c: Contact }) {
  const { update } = useStore();
  const p: ClientProfile = c.profile ?? {};
  const score = completeness(c);

  const set = (k: keyof ClientProfile, v: unknown) =>
    update(c.id, { profile: { ...p, [k]: v } } as never);

  return (
    <>
      {/* Her document is called CLIENT PROFILE COMPLETION, so the
          product measures exactly that — and names what is missing,
          because a percentage on its own is not actionable. */}
      <section className="sec">
        <header className="sec__head">
          <h2 className="sec__title">
            Profile
            <span className="sec__count">{score.filled} of {score.total}</span>
          </h2>
        </header>

        <div className={`pcomplete ${score.percent < 50 ? 'pcomplete--thin' : ''}`}>
          <div className="pcomplete__bar">
            <span className="pcomplete__fill" style={{ width: `${score.percent}%` }} />
          </div>
          <p className="pcomplete__n">{score.percent}% complete</p>
          {!!score.missing.length && (
            <p className="pcomplete__missing">
              <span className="pcomplete__mlabel">Still unknown</span>
              {score.missing.map(f => f.label.toLowerCase()).join(' · ')}
            </p>
          )}
        </div>
      </section>

      {PROFILE.map(sec => (
        <section className="sec" key={sec.key}>
          <header className="sec__head">
            <h2 className="sec__title">{sec.title}</h2>
          </header>
          {sec.note && <p className="psec__note">{sec.note}</p>}
          <div className="dgroup__body">
            {sec.fields.map(f => (
              <FieldRow key={f.key} label={f.label}>
                {f.type === 'select' ? (
                  <SelectField label={f.label} value={p[f.key] as string}
                    options={f.options ?? []} onChange={v => set(f.key, v)} />
                ) : f.type === 'score' ? (
                  <ScoreField value={p.strengthScore} onChange={v => set('strengthScore', v)} />
                ) : (
                  <TextField long={f.type === 'longtext'} value={p[f.key] as string}
                    placeholder={f.hint} onChange={v => set(f.key, v)} />
                )}
              </FieldRow>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

/* Her 1–5, with what each number actually means attached — a bare
   number invites everybody to score it differently. */
function ScoreField({ value, onChange }: {
  value?: number; onChange: (v: number) => void;
}) {
  return (
    <span className="score">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          className={`score__dot ${value && n <= value ? 'score__dot--on' : ''}`}
          onClick={() => onChange(n)}
          title={SCORE_MEANING[n]}
          aria-label={`${n} — ${SCORE_MEANING[n]}`}
        >{n}</button>
      ))}
      {value && <span className="score__meaning">{SCORE_MEANING[value]}</span>}
    </span>
  );
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
          {c.keyAccount && <span className="keytag">Key account</span>}
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

      {c.keyAccount && <ProfileBlock c={c} />}

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
