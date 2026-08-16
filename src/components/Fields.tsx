/* ============================================================
   Field controls

   The same row reads and edits. Nothing moves when the mode
   changes — the value simply becomes the control that sets it,
   in the same place, at the same size. Layouts that reflow on
   edit make you find your place again every time.

   Multi-select is chips, not a native multiple select. Native
   multi-select on a phone is close to unusable, and chips are
   already the vocabulary the capture sheet uses.
   ============================================================ */

import { useState } from 'react';
import type { ReactNode } from 'react';
import type { LifeArea } from '../types';
import {
  ALL_LIFE_AREAS, ATTENTION_COLOR, IMPORTANCE_TONE, LIFE_AREA_COLOR, statusTone,
} from '../lib/fields';
import { Picker } from './Picker';
import type { Option } from './Picker';
import { absoluteLabel, relativeLabel, urgencyOf } from '../lib/dates';
import './fields.css';

export function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="frow">
      <div className="frow__label">{label}</div>
      <div className="frow__value">{children}</div>
    </div>
  );
}

export function Empty({ text = 'Not set' }: { text?: string }) {
  return <span className="fempty">{text}</span>;
}

/* ---- Single select ------------------------------------------
   Always live. The value is the trigger, so there is no mode to
   enter — you click the thing you want to change. */
export function SelectField({ value, options, onChange, label, field }: {
  value?: string;
  options: readonly string[];
  onChange: (v: string | undefined) => void;
  label: string;
  /** Decides how the options are coloured. */
  field?: 'status' | 'importance' | 'attention' | 'plain';
}) {
  const opts: Option[] = options.map(o => {
    if (field === 'importance') return { value: o, tone: IMPORTANCE_TONE[o as keyof typeof IMPORTANCE_TONE] };
    if (field === 'attention') return { value: o, color: ATTENTION_COLOR[o as keyof typeof ATTENTION_COLOR] };
    if (field === 'status') return { value: o, tone: `st-${statusTone(o)}` };
    return { value: o };
  });
  const chosen = opts.find(o => o.value === value);

  return (
    <Picker
      label={label}
      options={opts}
      selected={value ? [value] : []}
      onSelect={v => onChange(v)}
      allowClear
      onClear={() => onChange(undefined)}
      trigger={
        value ? (
          <span
            className={`fpill ${chosen?.tone ? `tone-${chosen.tone}` : ''}`}
            style={chosen?.color ? ({ '--oc': chosen.color } as React.CSSProperties) : undefined}
          >
            <span className="fpill__dot" aria-hidden="true" />{value}
          </span>
        ) : <Empty />
      }
    />
  );
}

/* ---- Life areas ---------------------------------------------
   The one categorical dimension in the product, so the one place
   categorical colour is spent. Colour identifies; it never ranks. */
export function AreaField({ value, onChange }: {
  value: LifeArea[];
  onChange: (v: LifeArea[]) => void;
}) {
  const toggle = (a: string) =>
    onChange(value.includes(a as LifeArea)
      ? value.filter(x => x !== a)
      : [...value, a as LifeArea]);

  return (
    <Picker
      label="Life areas"
      multi
      options={ALL_LIFE_AREAS.map(a => ({ value: a, color: LIFE_AREA_COLOR[a] }))}
      selected={value}
      onSelect={toggle}
      trigger={
        value.length ? (
          <span className="areas">
            {value.map(a => (
              <span key={a} className="area area--on"
                style={{ '--la': LIFE_AREA_COLOR[a] } as React.CSSProperties}>
                <span className="area__dot" aria-hidden="true" />{a}
              </span>
            ))}
          </span>
        ) : <Empty />
      }
    />
  );
}

/* ---- Free tags ----------------------------------------------- */
export function TagField({ value, onChange }: {
  value: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <Editable onEdit={() => setOpen(true)}>
        {value.length
          ? <span className="areas">{value.map(t => <span key={t} className="ftag">{t}</span>)}</span>
          : <Empty />}
      </Editable>
    );
  }
  return (
    <input
      className="finput"
      autoFocus
      value={value.join(', ')}
      placeholder="Comma separated"
      onBlur={() => setOpen(false)}
      onKeyDown={e => e.key === 'Enter' && setOpen(false)}
      onChange={e => onChange(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
    />
  );
}

/* ---- Dates ---------------------------------------------------
   Read as relative, edited as absolute. "In three days" is what
   she needs to know; a calendar is what she needs to change it. */
export function DateField({ value, onChange }: {
  value?: string; onChange: (v: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <Editable onEdit={() => setOpen(true)}>
        {value ? (
          <span className={`fdate u-${urgencyOf(value)}`}>
            {relativeLabel(value)}
            <span className="fdate__abs">{absoluteLabel(value)}</span>
          </span>
        ) : <Empty text="No date" />}
      </Editable>
    );
  }
  return (
    <input
      type="date"
      className="finput finput--date"
      autoFocus
      value={value ?? ''}
      onBlur={() => setOpen(false)}
      onChange={e => onChange(e.target.value || undefined)}
    />
  );
}

/* ---- Text ---------------------------------------------------- */
export function TextField({ value, onChange, placeholder, long }: {
  value?: string;
  onChange: (v: string | undefined) => void;
  placeholder?: string;
  long?: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <Editable onEdit={() => setOpen(true)}>
        {value ? <span className="fval">{value}</span> : <Empty text={placeholder} />}
      </Editable>
    );
  }
  return long ? (
    <textarea
      className="finput finput--long"
      rows={3}
      autoFocus
      value={value ?? ''}
      placeholder={placeholder}
      onBlur={() => setOpen(false)}
      onChange={e => onChange(e.target.value || undefined)}
    />
  ) : (
    <input
      className="finput"
      autoFocus
      value={value ?? ''}
      placeholder={placeholder}
      onBlur={() => setOpen(false)}
      onKeyDown={e => e.key === 'Enter' && setOpen(false)}
      onChange={e => onChange(e.target.value || undefined)}
    />
  );
}


/* ---- Click to edit ------------------------------------------
   Text and dates have no option list, so they get the same
   affordance a different way: the value is a button, and clicking
   it becomes the input, in place. */
export function Editable({ children, onEdit }: { children: ReactNode; onEdit: () => void }) {
  return (
    <button className="fedit" onClick={onEdit}>
      {children}
      <span className="fedit__pen" aria-hidden="true">✎</span>
    </button>
  );
}
