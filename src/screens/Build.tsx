/* ============================================================
   Build status — the development tracker, inside the product.

   Deliberately plain-language. This screen gets read aloud on a
   review call by people who did not write the code.
   ============================================================ */

import { useEffect, useState } from 'react';
import { AGENDA, DECISIONS, ITEMS, REVIEW, SEND_TO, STATUS_LABEL } from '../data/roadmap';
import type { BuildStatus, Decision } from '../data/roadmap';
import {
  buildMailto, canPersist, clearAnswers, downloadAnswers, formatAnswers,
  lastSent, loadAnswers, markSent, saveAnswers,
} from '../lib/answers';
import type { Answers } from '../lib/answers';
import { todayLabel } from '../lib/dates';
import './build.css';

const ORDER: BuildStatus[] = ['built', 'partial', 'next', 'blocked', 'later', 'ruled-out'];

/* ---- A decision already settled on a call -------------------
   It keeps its place in the list so the record is complete, but it
   stops asking. Being asked something you already answered is the
   fastest way to make a system feel like it was not listening.   */
function SettledCard({ d }: { d: Decision }) {
  return (
    <li className="dq dq--settled">
      <div className="dq__head">
        <span className="dq__settledflag">Settled {d.resolved!.on}</span>
      </div>
      <p className="dq__q">{d.question}</p>
      <p className="dq__answer">{d.resolved!.answer}</p>
    </li>
  );
}

/* ---- One decision, with somewhere to answer it --------------- */
function DecisionCard({ d, value, onChange }: {
  d: Decision; value: string; onChange: (v: string) => void;
}) {
  const answered = value.trim().length > 0;
  return (
    <li className={`dq ${d.gate ? 'dq--gate' : ''} ${answered ? 'dq--answered' : ''}`}>
      <div className="dq__head">
        {d.gate && <span className="dq__flag">Gates everything</span>}
        {answered && <span className="dq__done">Answered</span>}
      </div>
      <p className="dq__q">{d.question}</p>
      <p className="dq__why">{d.consequence}</p>

      <label className="dq__label" htmlFor={`ans-${d.id}`}>Your answer</label>
      <textarea
        id={`ans-${d.id}`}
        className="dq__input"
        value={value}
        rows={2}
        placeholder="Type here — including “not sure yet, ask me again”"
        onChange={e => onChange(e.target.value)}
      />

      <p className="dq__owner">{d.owner}</p>
    </li>
  );
}

export function Build() {
  const [filter, setFilter] = useState<BuildStatus | 'all'>('all');
  const [answers, setAnswers] = useState<Answers>(() => loadAnswers());
  const [copied, setCopied] = useState(false);

  useEffect(() => { saveAnswers(answers); }, [answers]);

  const setAnswer = (id: string, v: string) =>
    setAnswers(prev => ({ ...prev, [id]: v }));

  const [sentAt, setSentAt] = useState<string | null>(() => lastSent());

  const settled = DECISIONS.filter(d => d.resolved);
  const open = DECISIONS.filter(d => !d.resolved);
  const gates = open.filter(d => d.gate);
  const rest = open.filter(d => !d.gate);

  const answeredCount = open.filter(d => answers[d.id]?.trim()).length;
  const unanswered = open.length - answeredCount;
  const plan = buildMailto(SEND_TO.email, open, answers, todayLabel);

  const fullText = () => formatAnswers(open, answers, todayLabel);

  /* Recorded on click; the anchor itself does the opening. Scripted
     redirects to mailto are unreliable, especially on phones. */
  const noteSent = () => { markSent(todayLabel); setSentAt(todayLabel); };

  const download = () => {
    downloadAnswers(fullText(), 'rona-os-decisions.md');
    markSent(todayLabel);
    setSentAt(todayLabel);
  };

  const copyOut = async () => {
    try {
      await navigator.clipboard.writeText(fullText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked — put it on screen so it can still be selected.
      window.prompt('Copy your answers:', fullText());
    }
  };

  const count = (s: BuildStatus) => ITEMS.filter(i => i.status === s).length;
  const shown = filter === 'all' ? ITEMS : ITEMS.filter(i => i.status === filter);

  /* Group in the order the groups first appear, so the daily loop
     leads and the deferred work sits at the bottom. */
  const groups = shown.reduce<Record<string, typeof ITEMS>>((acc, i) => {
    (acc[i.group] ??= []).push(i);
    return acc;
  }, {});


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
            <span className="sec__count">{answeredCount} of {open.length} answered</span>
          </h2>
        </header>

        <p className="build__lead">
          Two of these gate everything else, and neither is a technical
          question. Answer what you can — “not sure yet” is a useful answer,
          and so is “ask me again after the next call”.
        </p>

        {/* The send is honest about what it does: it hands the answers to
            her mail client. Nothing leaves the page by itself. */}
        <div className="answers__bar">
          <div className="answers__status">
            <p className="answers__count">
              {answeredCount
                ? <>{answeredCount} answered{unanswered ? `, ${unanswered} still open` : ' — all of them'}</>
                : 'Nothing answered yet'}
            </p>
            <p className="answers__note">
              {canPersist
                ? `Saved in this browser as you type. Sending opens your email to ${SEND_TO.name} — nothing leaves this page until you press send there.`
                : 'This browser will not let the page save your typing. Send or download before closing the tab.'}
            </p>
            {sentAt && <p className="answers__sent">Last sent {sentAt}</p>}
          </div>

          <div className="answers__acts">
            {answeredCount && plan.viable ? (
              <a className="act act--primary" href={plan.href} onClick={noteSent}>
                Send to {SEND_TO.name}
              </a>
            ) : (
              <button className="act act--primary" disabled>
                Send to {SEND_TO.name}
              </button>
            )}
            <button className="act" onClick={download} disabled={!answeredCount}>
              Download
            </button>
            <button className="act" onClick={copyOut} disabled={!answeredCount}>
              {copied ? 'Copied' : 'Copy'}
            </button>
            {!!answeredCount && (
              <button
                className="act"
                onClick={() => {
                  if (window.confirm('Clear every answer on this page? This cannot be undone.')) {
                    clearAnswers();
                    setAnswers({});
                  }
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Mail clients truncate long links. Better to say so than to
              let a long answer arrive silently cut in half. */}
          {!!answeredCount && !plan.viable && (
            <p className="answers__warn">
              These answers are longer than an email link can carry safely.
              Use <strong>Download</strong> or <strong>Copy</strong> instead, so
              nothing arrives cut short.
            </p>
          )}
        </div>

        <ul className="build__list">
          {[...gates, ...rest].map(d => (
            <DecisionCard
              key={d.id}
              d={d}
              value={answers[d.id] ?? ''}
              onChange={v => setAnswer(d.id, v)}
            />
          ))}
        </ul>

        {!!settled.length && (
          <>
            <p className="build__lead build__settledhead">
              Already settled — {settled.length} answered on the last call, kept
              here as a record.
            </p>
            <ul className="build__list">
              {settled.map(d => <SettledCard key={d.id} d={d} />)}
            </ul>
          </>
        )}
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
