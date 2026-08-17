/* ============================================================
   The weekly review

   Everything else in this product is consulted. This is the one
   thing that gets scheduled — which is what turns a dashboard
   into a system somebody actually keeps.

   So it is written to be READ, not filled in. Every section
   arrives already answered from her own data; she reacts rather
   than authors. There are exactly two places she has to think:
   what next week's three are, and what she is going to stop
   carrying. Those are the decisions a review exists to force.
   ============================================================ */

import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Card } from '../components/Card';
import { PersonChip } from '../components/primitives';
import { daysFromToday, daysSince, todayISO, todayLabel } from '../lib/dates';
import { loadReviews, saveReview } from '../lib/reviews';
import type { SavedReview } from '../lib/reviews';
import type { AnyCard, Bill, Commitment, Contact, Opportunity } from '../types';
import './review.css';

type Go = (v: string, id?: string) => void;

const CLOSED = new Set(['Complete', 'Archived', 'Fulfilled', 'Released', 'Closed']);
const isOpen = (c: AnyCard) => !CLOSED.has(c.status);

export function Review({ go }: { go: Go }) {
  const { cards, setTop3, top3, killItem } = useStore();
  const [note, setNote] = useState('');
  const [picked, setPicked] = useState<string[]>(top3);
  const [dropped, setDropped] = useState<string[]>([]);
  const [history, setHistory] = useState<SavedReview[]>(() => loadReviews());
  const [closed, setClosed] = useState(false);

  const g = useMemo(() => {
    const finished = cards.filter(c => c.status === 'Complete' || c.status === 'Fulfilled');
    const owed = cards.filter(c => c.kind === 'commitment' && isOpen(c)
      && (c as Commitment).direction === 'I Owe');
    const waiting = cards.filter(c => c.kind === 'commitment' && isOpen(c)
      && (c as Commitment).direction === 'They Owe');
    const overdue = owed.filter(c => (daysFromToday(c.dueDate) ?? 99) < 0);
    const stalled = cards.filter(c =>
      (c.kind === 'opportunity' && isOpen(c) && (c.flags.includes('stalled') || !(c as Opportunity).nextMove))
      || (c.kind === 'project' && isOpen(c) && c.flags.includes('at-risk')));
    const postponed = cards.filter(c => isOpen(c) && (c.snoozeCount ?? 0) > 0)
      .sort((a, b) => (b.snoozeCount ?? 0) - (a.snoozeCount ?? 0));
    const reconnect = (cards.filter(c => c.kind === 'contact') as Contact[])
      .filter(c => (daysSince(c.lastInteraction) ?? 0) > c.cadenceDays)
      .sort((a, b) => (daysSince(b.lastInteraction) ?? 0) - (daysSince(a.lastInteraction) ?? 0));
    const due = cards.filter(c => (c.kind === 'reminder' || c.kind === 'bill') && isOpen(c)
      && (c.kind !== 'bill' || (c as Bill).paymentStatus !== 'Paid')
      && (daysFromToday(c.dueDate) ?? 99) <= 30);
    return { finished, owed, waiting, overdue, stalled, postponed, reconnect, due };
  }, [cards]);

  /* Worth her attention next week: what is important and still open. */
  const candidates = useMemo(() => cards.filter(c =>
    isOpen(c)
    && (c.importance === 'Critical' || c.importance === 'High' || c.flags.length > 0)
    && ['task', 'commitment', 'project', 'opportunity', 'delegation'].includes(c.kind))
    .slice(0, 14), [cards]);

  const toggle = (id: string) =>
    setPicked(p => p.includes(id) ? p.filter(x => x !== id)
      : p.length >= 3 ? p : [...p, id]);

  const nameOf = (id: string) => cards.find(c => c.id === id)?.title ?? id;

  const close = () => {
    dropped.forEach(killItem);
    setTop3(picked);
    setHistory(saveReview({
      closedOn: todayLabel,
      closedISO: todayISO(),
      bigThree: picked.map(nameOf),
      dropped: dropped.map(nameOf),
      note,
      counts: {
        finished: g.finished.length,
        stillOwed: g.owed.length,
        waitingOn: g.waiting.length,
        stalled: g.stalled.length,
        postponed: g.postponed.length,
      },
    }));
    setClosed(true);
    window.scrollTo(0, 0);
  };

  if (closed) {
    return (
      <div className="page review">
        <div className="rvdone">
          <p className="greet__date">Closed {todayLabel}</p>
          <h1 className="rvdone__h">That's the week.</h1>
          <p className="rvdone__p">
            Your three are set and waiting on Home. {dropped.length
              ? `${dropped.length} ${dropped.length === 1 ? 'thing is' : 'things are'} off your plate.`
              : 'Nothing dropped this time.'}
          </p>
          <div className="rvdone__acts">
            <button className="act act--primary" onClick={() => go('home')}>Go to Home</button>
            <button className="act" onClick={() => setClosed(false)}>Back to the review</button>
          </div>
        </div>
        <History history={history} />
      </div>
    );
  }

  return (
    <div className="page review">
      <header className="rvhead">
        <p className="greet__date">Weekly review · {todayLabel}</p>
        <h1 className="rvhead__h">Where the week actually went.</h1>
        <p className="rvhead__p">
          Already answered from your own data. Read it, react to it, and make
          the two decisions at the bottom.
        </p>
        <hr className="rule-gold" />
      </header>

      {/* ---- The week, stated plainly rather than charted ---- */}
      <p className="rvlede">
        You closed <strong>{g.finished.length}</strong>. You still owe{' '}
        <strong>{g.owed.length}</strong> {g.overdue.length ? <>— <em>{g.overdue.length} of them late</em> —</> : null}{' '}
        and are waiting on <strong>{g.waiting.length}</strong>.{' '}
        {g.stalled.length ? <><strong>{g.stalled.length}</strong> {g.stalled.length === 1 ? 'thing has' : 'things have'} stopped moving. </> : null}
        {g.postponed.length ? <>You have pushed <strong>{g.postponed.length}</strong> {g.postponed.length === 1 ? 'thing' : 'things'} down the road.</> : null}
      </p>

      <Block title="Finished" empty="Nothing closed this week." items={g.finished} go={go} />
      <Block title="Late" empty="Nothing overdue. Rare and worth noticing." items={g.overdue} go={go} />
      <Block title="Stopped moving" empty="Everything is moving." items={g.stalled} go={go} />
      <Block title="You are waiting on" empty="Nobody owes you anything." items={g.waiting} go={go} cap={5} />
      <Block title="You still owe" empty="Nothing outstanding." items={g.owed} go={go} cap={5} />
      <Block title="Being pushed" empty="Nothing is slipping." items={g.postponed} go={go} cap={5} />

      {!!g.reconnect.length && (
        <section className="rvsec">
          <h2 className="rvsec__h">Gone quiet</h2>
          <div className="rvpeople">
            {g.reconnect.slice(0, 8).map(p => (
              <span key={p.id} className="rvperson">
                <PersonChip name={p.title} onClick={() => go('detail', p.id)} />
                <span className="rvperson__d">{daysSince(p.lastInteraction)}d</span>
              </span>
            ))}
          </div>
        </section>
      )}

      <Block title="Coming due" empty="Nothing in the next month." items={g.due} go={go} cap={5} />

      {/* ---- Decision one ---- */}
      <section className="rvsec rvsec--ask">
        <h2 className="rvsec__h rvsec__h--ask">Next week, these three</h2>
        <p className="rvsec__p">
          Three, not five. Choosing is the point — {3 - picked.length === 0
            ? 'you have your three'
            : `${3 - picked.length} left to pick`}.
        </p>
        <div className="rvpick">
          {candidates.map(c => (
            <button
              key={c.id}
              className={`rvopt ${picked.includes(c.id) ? 'rvopt--on' : ''}`}
              onClick={() => toggle(c.id)}
              disabled={!picked.includes(c.id) && picked.length >= 3}
            >
              <span className="rvopt__mark" aria-hidden="true" />
              {c.title}
            </button>
          ))}
        </div>
      </section>

      {/* ---- Decision two ---- */}
      <section className="rvsec rvsec--ask">
        <h2 className="rvsec__h rvsec__h--ask">And stop carrying these</h2>
        <p className="rvsec__p">
          Anything you have pushed more than once. Dropping it is a decision,
          not a failure — and nothing is destroyed.
        </p>
        {g.postponed.length ? (
          <div className="rvpick">
            {g.postponed.map(c => (
              <button
                key={c.id}
                className={`rvopt rvopt--drop ${dropped.includes(c.id) ? 'rvopt--on' : ''}`}
                onClick={() => setDropped(d =>
                  d.includes(c.id) ? d.filter(x => x !== c.id) : [...d, c.id])}
              >
                <span className="rvopt__mark" aria-hidden="true" />
                {c.title}
                <span className="rvopt__n">pushed {c.snoozeCount}×</span>
              </button>
            ))}
          </div>
        ) : <p className="empty">Nothing is being pushed around.</p>}
      </section>

      <section className="rvsec">
        <h2 className="rvsec__h">Anything worth remembering</h2>
        <textarea
          className="finput finput--long rvnote"
          rows={3}
          value={note}
          placeholder="One line about the week. Optional, and only for you."
          onChange={e => setNote(e.target.value)}
        />
      </section>

      <div className="rvclose">
        <button className="act act--primary rvclose__btn" onClick={close}>
          Close the week
        </button>
        <span className="rvclose__note">
          Sets your three, drops what you chose, and keeps a record.
        </span>
      </div>

      <History history={history} />
    </div>
  );
}

/* ---- A section that hides itself when there is nothing to say --- */
function Block({ title, items, go, empty, cap = 6 }: {
  title: string; items: AnyCard[]; go: Go; empty: string; cap?: number;
}) {
  return (
    <section className="rvsec">
      <h2 className="rvsec__h">
        {title}
        {!!items.length && <span className="rvsec__n">{items.length}</span>}
      </h2>
      {items.length ? (
        <ul className="list list-dense">
          {items.slice(0, cap).map(c => (
            <li key={c.id}><Card card={c} onOpen={id => go('detail', id)} /></li>
          ))}
          {items.length > cap && (
            <li className="rvmore">and {items.length - cap} more</li>
          )}
        </ul>
      ) : <p className="rvempty">{empty}</p>}
    </section>
  );
}

/* ---- The line between reviews is the actual value -------------- */
function History({ history }: { history: SavedReview[] }) {
  if (!history.length) return null;
  return (
    <section className="rvsec rvhist">
      <h2 className="rvsec__h">Earlier weeks</h2>
      <ul className="rvhist__list">
        {history.map((r, i) => (
          <li key={`${r.closedOn}-${i}`} className="rvhist__row">
            <p className="rvhist__when">{r.closedOn}</p>
            <p className="rvhist__counts">
              closed {r.counts.finished} · owed {r.counts.stillOwed} ·
              waiting {r.counts.waitingOn} · stalled {r.counts.stalled}
            </p>
            {!!r.bigThree.length && (
              <p className="rvhist__three">
                <em>Carried:</em> {r.bigThree.join(' · ')}
              </p>
            )}
            {!!r.dropped.length && (
              <p className="rvhist__dropped"><em>Dropped:</em> {r.dropped.join(' · ')}</p>
            )}
            {r.note && <p className="rvhist__note">{r.note}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
