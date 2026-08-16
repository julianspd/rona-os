/* ============================================================
   Birthdays & important dates

   Replaces the morning ritual of checking Instagram stories,
   Facebook and two calendars. One list, ordered by what is next.

   Deliberately includes the gift note, because remembering the
   date is the easy half. Knowing what to send is the part that
   actually gets skipped.
   ============================================================ */

import { useMemo } from 'react';
import { useStore } from '../store';
import { PersonChip, LocalTime } from '../components/primitives';
import { annualLabel, daysUntilAnnual, untilLabel } from '../lib/dates';
import type { Contact } from '../types';
import './dates.css';

interface Entry {
  contact: Contact;
  label: string;
  date: string;
  days: number;
}

const BANDS: [string, (d: number) => boolean][] = [
  ['This week', d => d <= 7],
  ['This month', d => d <= 31],
  ['Next three months', d => d <= 92],
  ['Later in the year', () => true],
];

export function Dates({ go }: { go: (v: string, id?: string) => void }) {
  const { cards, logInteraction } = useStore();

  const entries = useMemo(() => {
    const out: Entry[] = [];
    for (const c of cards) {
      if (c.kind !== 'contact') continue;
      const k = c as Contact;
      for (const d of k.importantDates ?? []) {
        out.push({ contact: k, label: d.label, date: d.date, days: daysUntilAnnual(d.date) });
      }
    }
    return out.sort((a, b) => a.days - b.days);
  }, [cards]);

  const placed = new Set<Entry>();
  const bands = BANDS.map(([name, test]) => ({
    name,
    items: entries.filter(e => {
      if (placed.has(e) || !test(e.days)) return false;
      placed.add(e);
      return true;
    }),
  }));

  const imminent = entries.filter(e => e.days <= 7).length;

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">Birthdays & important dates</h1>
        <p className="page__sub">
          Everything that comes round once a year, in one place. No stories to
          scroll, no second calendar to check.
        </p>
      </header>

      {!!imminent && (
        <p className="datelede">
          <strong>{imminent}</strong> {imminent === 1 ? 'date' : 'dates'} in the next seven days.
        </p>
      )}

      {bands.map(b => b.items.length ? (
        <section className="sec" key={b.name}>
          <header className="sec__head">
            <h2 className="sec__title">
              {b.name}
              <span className="sec__count">{b.items.length}</span>
            </h2>
          </header>

          <ul className="list">
            {b.items.map(e => (
              <li key={`${e.contact.id}-${e.label}`} className={`dcard ${e.days <= 7 ? 'dcard--soon' : ''}`}>
                <div className="dcard__when">
                  <span className="dcard__until">{untilLabel(e.days)}</span>
                  <span className="dcard__date">{annualLabel(e.date)}</span>
                </div>

                <div className="dcard__body">
                  <p className="dcard__label">{e.label}</p>
                  <div className="dcard__who">
                    <PersonChip name={e.contact.title} onClick={() => go('detail', e.contact.id)} />
                    <LocalTime city={e.contact.city} timezone={e.contact.timezone} />
                  </div>
                  {e.contact.giftIdeas && (
                    <p className="dcard__gift">
                      <span className="dcard__gifttag">Idea</span>{e.contact.giftIdeas}
                    </p>
                  )}
                </div>

                <button className="act act--primary" onClick={() => logInteraction(e.contact.id)}>
                  Reached out
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null)}

      {!entries.length && <p className="empty">No dates recorded yet.</p>}
    </div>
  );
}
