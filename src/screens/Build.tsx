/* ============================================================
   Build status

   Ordered by what someone opening it actually wants, which is not
   the same as what there is most of:

     what changed → what we need from you → what is next →
     what already works (folded away) → what is waiting or closed

   The inventory of everything built is the bulk of the page and
   the least urgent part of it, so it stays folded until asked for.

   Plain language throughout. This gets read aloud on calls by
   people who did not write the code.
   ============================================================ */

import { useEffect, useState } from 'react';
import {
  AGENDA, DECISIONS, ITEMS, RECENT, REVIEW, SEND_TO, STANDING, STATUS_LABEL,
} from '../data/roadmap';
import type { BuildStatus, Decision } from '../data/roadmap';
import {
  buildMailto, canPersist, clearAnswers, downloadAnswers, formatAnswers,
  lastSent, loadAnswers, markSent, saveAnswers,
} from '../lib/answers';
import type { Answers } from '../lib/answers';
import { todayLabel } from '../lib/dates';
import './build.css';

/* ---- A settled decision ------------------------------------- */
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
  const [answers, setAnswers] = useState<Answers>(() => loadAnswers());
  const [copied, setCopied] = useState(false);
  const [sentAt, setSentAt] = useState<string | null>(() => lastSent());
  const [showBuilt, setShowBuilt] = useState(false);

  useEffect(() => { saveAnswers(answers); }, [answers]);

  const settled = DECISIONS.filter(d => d.resolved);
  const open = DECISIONS.filter(d => !d.resolved);
  const gates = open.filter(d => d.gate);
  const rest = open.filter(d => !d.gate);

  const answeredCount = open.filter(d => answers[d.id]?.trim()).length;
  const plan = buildMailto(SEND_TO.email, open, answers, todayLabel);
  const fullText = () => formatAnswers(open, answers, todayLabel);

  const noteSent = () => { markSent(todayLabel); setSentAt(todayLabel); };
  const download = () => { downloadAnswers(fullText(), 'rona-os-decisions.md'); noteSent(); };
  const copyOut = async () => {
    try {
      await navigator.clipboard.writeText(fullText());
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    } catch { window.prompt('Copy your answers:', fullText()); }
  };

  const of = (s: BuildStatus) => ITEMS.filter(i => i.status === s);
  const built = of('built');
  const partial = of('partial');

  const asked = RECENT.filter(r => r.asked);
  const extra = RECENT.filter(r => !r.asked);

  return (
    <div className="page build">
      <header className="page__head">
        <p className="greet__date">Build status · updated {REVIEW.updated}</p>
        <h1 className="page__title">Where things stand</h1>
        <p className="build__standing">{STANDING}</p>
        <hr className="rule-gold" style={{ marginTop: 'var(--s5)' }} />
      </header>

      {/* ---- 1. What changed ---- */}
      <section className="sec">
        <header className="sec__head">
          <h2 className="sec__title">
            Since the last call
            <span className="sec__count">{RECENT.length}</span>
          </h2>
        </header>

        <p className="build__lead">
          Everything asked for on {REVIEW.lastReview} is built.
        </p>
        <ul className="build__list">
          {asked.map(r => (
            <li key={r.title} className="newitem newitem--asked">
              <span className="newitem__tag">You asked</span>
              <p className="newitem__t">{r.title}</p>
              <p className="newitem__n">{r.note}</p>
            </li>
          ))}
        </ul>

        <p className="build__lead build__lead--sub">And beyond that.</p>
        <ul className="build__list">
          {extra.map(r => (
            <li key={r.title} className="newitem">
              <p className="newitem__t">{r.title}</p>
              <p className="newitem__n">{r.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- 2. What we need ---- */}
      <section className="sec">
        <header className="sec__head">
          <h2 className="sec__title">
            What we need from you
            <span className="sec__count">{answeredCount} of {open.length} answered</span>
          </h2>
        </header>

        <p className="build__lead">
          Two of these gate everything else, and neither is a technical
          question. “Not sure yet” is a useful answer, and so is “ask me again
          after the next call”.
        </p>

        <div className="answers__bar">
          <div className="answers__status">
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
              <button className="act act--primary" disabled>Send to {SEND_TO.name}</button>
            )}
            <button className="act" onClick={download} disabled={!answeredCount}>Download</button>
            <button className="act" onClick={copyOut} disabled={!answeredCount}>
              {copied ? 'Copied' : 'Copy'}
            </button>
            {!!answeredCount && (
              <button className="act" onClick={() => {
                if (window.confirm('Clear every answer on this page? This cannot be undone.')) {
                  clearAnswers(); setAnswers({});
                }
              }}>Clear</button>
            )}
          </div>
          {!!answeredCount && !plan.viable && (
            <p className="answers__warn">
              These answers are longer than an email link can carry safely. Use
              <strong> Download</strong> or <strong>Copy</strong> instead, so nothing
              arrives cut short.
            </p>
          )}
        </div>

        <ul className="build__list">
          {[...gates, ...rest].map(d => (
            <DecisionCard key={d.id} d={d} value={answers[d.id] ?? ''}
              onChange={v => setAnswers(p => ({ ...p, [d.id]: v }))} />
          ))}
        </ul>

        {!!settled.length && (
          <>
            <p className="build__lead build__settledhead">
              Already settled — {settled.length} answered on the last call.
            </p>
            <ul className="build__list">
              {settled.map(d => <SettledCard key={d.id} d={d} />)}
            </ul>
          </>
        )}
      </section>

      {/* ---- 3. What is next ---- */}
      <Group title="Next up" note="Buildable now, nothing blocking them."
        items={of('next')} tone="next" />

      {/* ---- 4. What already works — folded, because it is the bulk
             of the page and the least urgent part of it ---- */}
      <section className="sec">
        <button className="fold" onClick={() => setShowBuilt(!showBuilt)} aria-expanded={showBuilt}>
          <span className="fold__label">
            {showBuilt ? 'Hide what already works' : 'Everything that already works'}
          </span>
          <span className="fold__n">{built.length} working · {partial.length} partly there</span>
          <span className={`rest__chev ${showBuilt ? 'rest__chev--up' : ''}`} aria-hidden="true">⌄</span>
        </button>
        {showBuilt && (
          <div className="fold__body">
            <Group title="Working now" items={built} tone="built" bare />
            <Group title="Partly there" items={partial} tone="partial" bare />
          </div>
        )}
      </section>

      {/* ---- 5. Waiting and closed ---- */}
      <Group title="Waiting on a decision" note="Each names the question holding it up."
        items={of('blocked')} tone="blocked" showBlocker />
      <Group title="Deliberately later" items={of('later')} tone="later" />
      <Group title="Ruled out" note="Closed, not postponed." items={of('ruled-out')} tone="ruled-out" />

      {/* ---- 6. The call ---- */}
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
          Dates run on the real calendar, but the demo content keeps its own
          spacing — so the story stays the same however long the site sits
          unopened. “Eleven days overdue” does not quietly become forty.
        </p>
      </section>
    </div>
  );
}

/* ---- A status group ------------------------------------------ */
function Group({ title, note, items, tone, showBlocker, bare }: {
  title: string;
  note?: string;
  items: typeof ITEMS;
  tone: BuildStatus;
  showBlocker?: boolean;
  bare?: boolean;
}) {
  if (!items.length) return null;
  return (
    <section className={bare ? 'foldgroup' : 'sec'}>
      <header className={bare ? 'foldgroup__head' : 'sec__head'}>
        <h2 className={bare ? 'foldgroup__h' : 'sec__title'}>
          {title}
          <span className="sec__count">{items.length}</span>
        </h2>
      </header>
      {note && <p className="build__lead">{note}</p>}
      <ul className="build__list">
        {items.map(i => (
          <li key={i.id} className="bitem">
            <span className={`chipst st-${tone}`}>{STATUS_LABEL[tone]}</span>
            <div className="bitem__body">
              <p className="bitem__title">{i.title}</p>
              <p className="bitem__note">{i.note}</p>
              {showBlocker && i.blockedBy && (
                <p className="bitem__blocked">
                  Waiting on: {DECISIONS.find(d => d.id === i.blockedBy)?.question}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
