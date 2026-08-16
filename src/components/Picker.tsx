/* ============================================================
   Option picker

   A dropdown on a pointer, a bottom sheet on a phone. Same
   options, same colours, two shapes — because a menu anchored to
   a 30px pill is fine with a cursor and miserable with a thumb.

   Single-select closes on choice. Multi-select stays open, because
   picking three life areas should not mean opening the menu three
   times.
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useIsMobile } from '../lib/useIsMobile';
import './picker.css';

export interface Option {
  value: string;
  label?: string;
  /** Categorical hue, where the dimension has one. */
  color?: string;
  /** Ordinal tone class, where it does not. */
  tone?: string;
}

interface Props {
  options: Option[];
  selected: string[];
  onSelect: (value: string) => void;
  multi?: boolean;
  /** What sits in the row and opens the menu. */
  trigger: ReactNode;
  label: string;
  allowClear?: boolean;
  onClear?: () => void;
}

export function Picker({
  options, selected, onSelect, multi, trigger, label, allowClear, onClear,
}: Props) {
  const [open, setOpen] = useState(false);
  const [flip, setFlip] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  /* Close on an outside tap or Escape. */
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent | TouchEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('touchstart', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('touchstart', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  /* Open upward when there is no room below. */
  useEffect(() => {
    if (!open || isMobile || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    setFlip(window.innerHeight - r.bottom < 260);
  }, [open, isMobile]);

  const list = (
    <ul className="pick__list" role="listbox" aria-label={label}>
      {allowClear && (
        <li>
          <button
            className={`pick__opt ${!selected.length ? 'pick__opt--on' : ''}`}
            onClick={() => { onClear?.(); setOpen(false); }}
          >
            <span className="pick__swatch pick__swatch--none" aria-hidden="true" />
            <span className="pick__label pick__label--none">Not set</span>
          </button>
        </li>
      )}
      {options.map(o => {
        const on = selected.includes(o.value);
        return (
          <li key={o.value}>
            <button
              className={`pick__opt ${on ? 'pick__opt--on' : ''} ${o.tone ? `tone-${o.tone}` : ''}`}
              style={o.color ? ({ '--oc': o.color } as React.CSSProperties) : undefined}
              role="option"
              aria-selected={on}
              onClick={() => { onSelect(o.value); if (!multi) setOpen(false); }}
            >
              <span className="pick__swatch" aria-hidden="true" />
              <span className="pick__label">{o.label ?? o.value}</span>
              {on && <span className="pick__tick" aria-hidden="true">✓</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="pick" ref={wrap}>
      <button
        className="pick__trigger"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {trigger}
        <span className="pick__chev" aria-hidden="true">⌄</span>
      </button>

      {open && !isMobile && (
        <div className={`pick__menu ${flip ? 'pick__menu--up' : ''}`}>{list}</div>
      )}

      {open && isMobile && (
        <div className="pick__sheet" onClick={() => setOpen(false)}>
          <div className="pick__sheetbox" onClick={e => e.stopPropagation()}>
            <div className="pick__rule" />
            <p className="pick__sheeth">{label}</p>
            {list}
            <button className="act pick__done" onClick={() => setOpen(false)}>
              {multi ? 'Done' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
