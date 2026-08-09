/* ============================================================
   Build status — the development tracker, inside the product.

   Deliberately plain-language. This screen gets read aloud on a
   review call by people who did not write the code.
   ============================================================ */

import { useState } from 'react';
import { AGENDA, DECISIONS, ITEMS, REVIEW, STATUS_LABEL } from '../data/roadmap';
import type { BuildStatus } from '../data/roadmap';
import './build.css';

const ORDER: BuildStatus[] = ['built', 'partial', 'next', 'blocked', 'later'];

export function Build() {
  const [filter, setFilter] = useState<BuildStatus | 'all'>('all');

  const count = (s: BuildStatus) => ITEMS.filter(i => i.status === s).length;
  const shown = filter === 'all' ? ITEMS : ITEMS.filter(i => i.status === filter);

  /* Group in the order the groups first appear, so the daily loop
     leads and the deferred work sits at the bottom. */
  const groups = shown.reduce<Record<string, typeof ITEMS>>((acc, i) => {
    (acc[i.group] ??= []).push(i);
    return acc;
  }, {});

  const gates = DECISIONS.filter(d => d.gate);
  const rest = DECISIONS.filter(d => !d.gate);

  return (
    <div className="page build">
      <header className="page__head">
        <p className="greet__date">Build status</p>
        <h1 className="page__title">What is working, and what is next</h1>
        <p className="page__sub">
          {REVIEW.stage}. Reflects the review of {REVIEW.lastReview}.
        </p>
        <hr className="rule-gold" style={{ marginTop: 'var(--s5)' }} />
      </header>

      {/* ---- The count, in one line ---- */}
      <div className="tally">
        {ORDER.map(s => (
          <button
            key={s}
            className={`tally__cell ${filter === s ? 'tally__cell--on' : ''}`}
            onClick={() => setFilter(filter === s ? 'all' : s)}
            aria-pressed={filter === s}
          >
            <span className={`tally__n tnum st-${s}`}>{count(s)}</span>
            <span className="tally__label">{STATUS_LABEL[s]}</span>
          </button>
        ))}
      </div>

      {filter !== 'all' && (
        <button className="build__clear" onClick={() => setFilter('all')}>
          Showing {STATUS_LABEL[filter].toLowerCase()} only — show everything
        </button>
      )}

      {/* ---- Features ---- */}
      {Object.entries(groups).map(([group, items]) => (
        <section className="sec" key={group}>
          <header className="sec__head">
            <h2 className="sec__title">
              {group}
              <span className="sec__count">{items.length}</span>
            </h2>
          </header>
          <ul className="build__list">
            {items.map(i => (
              <li key={i.id} className="bitem">
                <span className={`chipst st-${i.status}`}>{STATUS_LABEL[i.status]}</span>
                <div className="bitem__body">
                  <p className="bitem__title">{i.title}</p>
                  <p className="bitem__note">{i.note}</p>
                  {i.blockedBy && (
                    <p className="bitem__blocked">
                      Waiting on: {DECISIONS.find(d => d.id === i.blockedBy)?.question}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* ---- Decisions ---- */}
      <section className="sec">
        <header className="sec__head">
          <h2 className="sec__title">
            Decisions we need
            <span className="sec__count">{DECISIONS.length}</span>
          </h2>
        </header>

        <p className="build__lead">
          Two of these gate everything else, and neither is a technical
          question. They are worth answering before more is built.
        </p>

        <ul className="build__list">
          {gates.map(d => (
            <li key={d.id} className="dq dq--gate">
              <span className="dq__flag">Gates everything</span>
              <p className="dq__q">{d.question}</p>
              <p className="dq__why">{d.consequence}</p>
              <p className="dq__owner">{d.owner}</p>
            </li>
          ))}
          {rest.map(d => (
            <li key={d.id} className="dq">
              <p className="dq__q">{d.question}</p>
              <p className="dq__why">{d.consequence}</p>
              <p className="dq__owner">{d.owner}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Agenda ---- */}
      <section className="sec">
        <header className="sec__head">
          <h2 className="sec__title">Suggested shape for the review</h2>
        </header>
        <ul className="build__list">
          {AGENDA.map(a => (
            <li key={a.what} className="ag">
              <span className="ag__min tnum">{a.minutes} min</span>
              <div>
                <p className="ag__what">{a.what}</p>
                <p className="ag__why">{a.why}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="build__footnote">
          Dates run on the real Pacific calendar. The demo content keeps its
          own internal spacing, so the story stays the same however long the
          site sits unopened — “eleven days overdue” does not quietly become
          forty.
        </p>
      </section>
    </div>
  );
}
