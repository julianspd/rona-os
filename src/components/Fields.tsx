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

import type { ReactNode } from 'react';
import type { LifeArea } from '../types';
import { ALL_LIFE_AREAS, LIFE_AREA_COLOR } from '../lib/fields';
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

/* ---- Single select ------------------------------------------ */
export function SelectField({ value, options, onChange, editing, placeholder }: {
  value?: string;
  options: readonly string[];
  onChange: (v: string) => void;
  editing: boolean;
  placeholder?: string;
}) {
  if (!editing) return value ? <span className="fval">{value}</span> : <Empty text={placeholder} />;
  return (
    <div className="fselect">
      <select value={value ?? ''} onChange={e => onChange(e.target.value)}>
        <option value="">— not set —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="fselect__mark" aria-hidden="true">⌄</span>
    </div>
  );
}

/* ---- Life areas ---------------------------------------------
   The one categorical dimension in the product, so the one place
   categorical colour is spent. Colour identifies; it never ranks. */
export function AreaField({ value, onChange, editing }: {
  value: LifeArea[];
  onChange: (v: LifeArea[]) => void;
  editing: boolean;
}) {
  const toggle = (a: LifeArea) =>
    onChange(value.includes(a) ? value.filter(x => x !== a) : [...value, a]);

  if (!editing) {
    if (!value.length) return <Empty />;
    return (
      <span className="areas">
        {value.map(a => (
          <span key={a} className="area area--on" style={{ '--la': LIFE_AREA_COLOR[a] } as React.CSSProperties}>
            <span className="area__dot" aria-hidden="true" />{a}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className="areas areas--edit">
      {ALL_LIFE_AREAS.map(a => {
        const on = value.includes(a);
        return (
          <button
            key={a}
            type="button"
            className={`area ${on ? 'area--on' : ''}`}
            style={{ '--la': LIFE_AREA_COLOR[a] } as React.CSSProperties}
            aria-pressed={on}
            onClick={() => toggle(a)}
          >
            <span className="area__dot" aria-hidden="true" />{a}
          </button>
        );
      })}
    </span>
  );
}

/* ---- Free tags ----------------------------------------------- */
export function TagField({ value, onChange, editing }: {
  value: string[]; onChange: (v: string[]) => void; editing: boolean;
}) {
  if (!editing) {
    if (!value.length) return <Empty />;
    return <span className="areas">{value.map(t => <span key={t} className="ftag">{t}</span>)}</span>;
  }
  return (
    <input
      className="finput"
      value={value.join(', ')}
      placeholder="Comma separated"
      onChange={e => onChange(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
    />
  );
}

/* ---- Dates ---------------------------------------------------
   Read as relative, edited as absolute. "In three days" is what
   she needs to know; a calendar is what she needs to change it. */
export function DateField({ value, onChange, editing }: {
  value?: string; onChange: (v: string | undefined) => void; editing: boolean;
}) {
  if (!editing) {
    if (!value) return <Empty text="No date" />;
    return (
      <span className={`fdate u-${urgencyOf(value)}`}>
        {relativeLabel(value)}
        <span className="fdate__abs">{absoluteLabel(value)}</span>
      </span>
    );
  }
  return (
    <input
      type="date"
      className="finput finput--date"
      value={value ?? ''}
      onChange={e => onChange(e.target.value || undefined)}
    />
  );
}

/* ---- Text ---------------------------------------------------- */
export function TextField({ value, onChange, editing, placeholder, long }: {
  value?: string;
  onChange: (v: string | undefined) => void;
  editing: boolean;
  placeholder?: string;
  long?: boolean;
}) {
  if (!editing) return value ? <span className="fval">{value}</span> : <Empty text={placeholder} />;
  return long ? (
    <textarea
      className="finput finput--long"
      rows={3}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value || undefined)}
    />
  ) : (
    <input
      className="finput"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value || undefined)}
    />
  );
}
