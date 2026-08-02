/* ============================================================
   SectionBlock — PRD Appendix B.3
   "The most important component in the build."

   Home's calmness is a property of THIS component, enforced once:
     - the item cap                     (FR-HOME-2, §9.1)
     - hide-when-empty                  (FR-HOME-3, P6)
     - the "show all" affordance
   If these were implemented per-section they would drift, and Home
   would become the cluttered dashboard §9.3 forbids.
   ============================================================ */

import type { ReactNode } from 'react';
import './section.css';

interface Props<T> {
  title: string;
  items: T[];
  cap: number;
  renderItem: (item: T) => ReactNode;
  keyOf: (item: T) => string;
  /** Rendered instead of a count — e.g. Today's date strip. */
  headerRight?: ReactNode;
  onShowAll?: () => void;
  /** Sections 1 & 2 on Home render even when empty (§9.1 "Always"). */
  alwaysRender?: boolean;
  emphasis?: 'overdue' | 'normal';
  children?: ReactNode;
}

export function SectionBlock<T>({
  title, items, cap, renderItem, keyOf,
  headerRight, onShowAll, alwaysRender = false, emphasis = 'normal', children,
}: Props<T>) {
  // FR-HOME-3 — zero items means the section does not exist. No empty states.
  if (!items.length && !alwaysRender && !children) return null;

  const shown = items.slice(0, cap);
  const hidden = items.length - shown.length;

  return (
    <section className={`sec ${emphasis === 'overdue' ? 'sec--overdue' : ''}`}>
      <header className="sec__head">
        <h2 className="sec__title">
          {title}
          {items.length > cap && <span className="sec__count">{items.length}</span>}
        </h2>
        {headerRight}
        {hidden > 0 && onShowAll && (
          <button className="sec__all" onClick={onShowAll}>
            show all {items.length}
          </button>
        )}
      </header>

      {children}

      {!!shown.length && (
        <ul className="sec__list">
          {shown.map(item => <li key={keyOf(item)}>{renderItem(item)}</li>)}
        </ul>
      )}
    </section>
  );
}
