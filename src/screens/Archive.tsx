/* ============================================================
   Dropped & postponed

   Two things live here, and they belong together.

   The archive, because "nothing is ever destroyed" is an empty
   promise if there is nowhere to look. Anything dropped, archived
   or completed is here, and can be brought back.

   And the postponement pattern. The prompt on a card calls out one
   item on its third snooze. This is the habit seen whole — every
   item currently being pushed down the road, and how far. Rona
   asked to be called out on this; one card at a time only shows
   her the symptom.
   ============================================================ */

import { useState } from 'react';
import { useStore } from '../store';
import { Card } from '../components/Card';
import { DateLabel, StatusBadge } from '../components/primitives';
import type { AnyCard } from '../types';
import './archive.css';

type Go = (v: string, id?: string) => void;

const GONE = new Set(['Archived', 'Complete', 'Fulfilled', 'Released', 'Closed']);

export function Archive({ go }: { go: Go }) {
  const { cards, restore } = useStore();

  const archived = cards.filter(c => c.status === 'Archived');
  const done = cards.filter(c => c.status === 'Complete' || c.status === 'Fulfilled');

  /* Still live, and already being pushed. Sorted by how many times. */
  const slipping = cards
    .filter(c => !GONE.has(c.status) && (c.snoozeCount ?? 0) > 0)
    .sort((a, b) => (b.snoozeCount ?? 0) - (a.snoozeCount ?? 0));

  const atThreshold = slipping.filter(c => (c.snoozeCount ?? 0) >= 3);

  const [tab, setTab] = useState(slipping.length ? 'slipping' : 'archived');
  const map: Record<string, AnyCard[]> = { slipping, archived, done };

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">Dropped & postponed</h1>
        <p className="page__sub">
          Nothing here was destroyed. Anything dropped can be brought back,
          and anything you keep pushing is listed with the count.
        </p>
      </header>

      {!!atThreshold.length && (
        <p className="arclede">
          <strong>{atThreshold.length}</strong>{' '}
          {atThreshold.length === 1 ? 'item has' : 'items have'} been postponed
          three times or more. Each one is asking you to decide.
        </p>
      )}

      <div className="tabs">
        {([
          ['slipping', 'Being postponed', slipping.length],
          ['archived', 'Dropped', archived.length],
          ['done', 'Completed', done.length],
        ] as const).map(([k, label, n]) => (
          <button
            key={k}
            className={`tab ${tab === k ? 'tab--on' : ''}`}
            onClick={() => setTab(k)}
          >
            {label}<span className="tab__n">{n}</span>
          </button>
        ))}
      </div>

      {tab === 'slipping' && (
        <ul className="list">
          {slipping.map(c => (
            <li key={c.id}>
              {/* The card carries its own prompt once it hits three, so
                  the decision is offered here exactly as it is elsewhere. */}
              <Card card={c} onOpen={id => go('detail', id)} />
              <p className="arcnote">
                Pushed <strong>{c.snoozeCount}</strong>{' '}
                {c.snoozeCount === 1 ? 'time' : 'times'}
                {c.dueDate && <> · now <DateLabel iso={c.dueDate} /></>}
              </p>
            </li>
          ))}
          {!slipping.length && <p className="empty">Nothing is being pushed around.</p>}
        </ul>
      )}

      {(tab === 'archived' || tab === 'done') && (
        <ul className="list">
          {map[tab].map(c => (
            <li key={c.id} className="arcrow">
              <div className="arcrow__body">
                <p className="arcrow__title">{c.title}</p>
                <div className="arcrow__meta">
                  <StatusBadge status={c.status} />
                  <span>{c.kind}</span>
                  {!!c.snoozeCount && (
                    <><span className="sep">·</span><span>pushed {c.snoozeCount}× first</span></>
                  )}
                </div>
              </div>
              <button className="act act--primary" onClick={() => restore(c.id)}>
                Bring back
              </button>
            </li>
          ))}
          {!map[tab].length && (
            <p className="empty">
              {tab === 'archived' ? 'Nothing has been dropped.' : 'Nothing finished yet.'}
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
