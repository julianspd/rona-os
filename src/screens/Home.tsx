/* ============================================================
   Home — the attention dashboard.
   Understandable in under sixty seconds. Not a widget board.
   ============================================================ */

import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { buildHome, inboxCount } from '../lib/home';
import { SectionBlock } from '../components/SectionBlock';
import { Card } from '../components/Card';
import { todayLabel } from '../lib/dates';
import { useAuth } from '../lib/auth';
import type { AnyCard } from '../types';
import './home.css';

/* Section titles read as an editor wrote them, not a system. */
const TITLES: Record<string, string> = {
  meetings: 'Today’s schedule',
  iowe: 'You owe',
  waiting: 'Waiting on others',
  opps: 'Opportunities needing movement',
  risk: 'At risk',
  delegation: 'Delegation check-ins',
  reconnect: 'Worth reconnecting with',
  renewals: 'Coming due',
  health: 'Wellbeing',
  travel: 'Travel',
};

/* The morning briefing. What genuinely changes the shape of the day. */
const CORE = ['meetings', 'iowe', 'waiting'];

/* Real, but not what she needs in the first sixty seconds.
   Held one interaction away, with counts visible so nothing hides. */
const DEFERRED = ['opps', 'risk', 'delegation', 'reconnect', 'renewals', 'health', 'travel'];

/* Core sections show three and link out. The full list lives in
   the module, which is where working — as opposed to scanning — happens. */
const CORE_CAP = 3;

export function Home({ go, onCapture }: {
  go: (view: string, id?: string) => void;
  onCapture?: () => void;
}) {
  const { cards, top3 } = useStore();
  const { account } = useAuth();

  const sections = useMemo(() => buildHome(cards), [cards]);
  const s = (key: string) => sections.find(x => x.key === key)!;
  const inbox = inboxCount(cards);

  const top3Cards = top3
    .map(id => cards.find(c => c.id === id))
    .filter(Boolean) as AnyCard[];

  const attention = ['decide', 'review', 'connect', 'do'].map(s);
  const hasAttention = attention.some(a => a.items.length);

  const [showRest, setShowRest] = useState(false);
  const deferred = DEFERRED.map(s).filter(d => d.items.length);
  const deferredCount = deferred.reduce((n, d) => n + d.items.length, 0);

  const renderSection = (key: string, cap: number) => {
    const sec = s(key);
    const target =
      key === 'iowe' || key === 'waiting' ? 'commitments'
      : key === 'reconnect' ? 'people'
      : key === 'opps' ? 'opportunities'
      : key === 'risk' ? 'projects'
      : key === 'renewals' ? 'renewals'
      : undefined;
    return (
      <SectionBlock
        key={key}
        title={TITLES[key] ?? sec.title}
        items={sec.items}
        cap={cap}
        keyOf={c => c.id}
        renderItem={c => <Card card={c} onOpen={id => go('detail', id)} />}
        onShowAll={target ? () => go(target) : undefined}
      />
    );
  };

  /* The brief: one sentence of orientation, drawn from real counts.
     Not a summary of everything — a statement of the shape of the day. */
  const overdue = s('overdue').items.length;
  const meetings = s('meetings').items.length;
  const decisions = s('decide').items.length;
  const brief = [
    overdue ? `${overdue} overdue commitment${overdue > 1 ? 's' : ''}` : null,
    meetings ? `${meetings} meeting${meetings > 1 ? 's' : ''} today` : null,
    decisions ? `${decisions} decision${decisions > 1 ? 's' : ''} waiting on you` : null,
  ].filter(Boolean);

  return (
    <div className="home">
      {/* ---- The morning greeting — the one editorial moment ---- */}
      <header className="greet">
        <p className="greet__date">{todayLabel}</p>
        <h1 className="greet__line">Good morning, Rona.</h1>
        {!!brief.length && (
          <p className="greet__brief">
            {brief.slice(0, -1).join(', ')}
            {brief.length > 1 ? ', and ' : ''}
            {brief[brief.length - 1]}.
          </p>
        )}
        <hr className="rule-gold greet__rule" />
      </header>

      {/* Signed in with nothing in it, every section below hides
          itself and the page reads as broken rather than calm. This
          is what she meets on Monday morning, alone. */}
      {account && cards.length === 0 && (
        <section className="firstrun">
          <p className="firstrun__h">Nothing here yet, and that is right.</p>
          <p className="firstrun__p">
            This fills up from what you put in it. Three things worth doing first —
            it takes about ten minutes and then it starts working for you.
          </p>
          <ol className="firstrun__list">
            <li className="firstrun__step">
              <span className="firstrun__n">1</span>
              <div>
                <button className="firstrun__do" onClick={onCapture}>Capture a thought</button>
                <p className="firstrun__why">
                  Anything on your mind. It goes to your inbox and you decide what it
                  is later — that is the whole point of it.
                </p>
              </div>
            </li>
            <li className="firstrun__step">
              <span className="firstrun__n">2</span>
              <div>
                <button className="firstrun__do" onClick={() => go('people')}>Add someone who matters</button>
                <p className="firstrun__why">
                  Five or ten people you should not lose touch with. Tell it how often
                  and it will tell you when it has been too long.
                </p>
              </div>
            </li>
            <li className="firstrun__step">
              <span className="firstrun__n">3</span>
              <div>
                <button className="firstrun__do" onClick={() => go('commitments')}>Write down what you owe</button>
                <p className="firstrun__why">
                  One promise you have made and one you are waiting on. This is the part
                  nothing else you use keeps track of.
                </p>
              </div>
            </li>
          </ol>
        </section>
      )}

      {/* ---- Overdue — outranks everything, by order not by volume ---- */}
      <SectionBlock
        title="Overdue"
        items={s('overdue').items}
        cap={s('overdue').cap}
        emphasis="overdue"
        keyOf={c => c.id}
        renderItem={c => <Card card={c} onOpen={id => go('detail', id)} />}
        onShowAll={() => go('commitments')}
      />

      {/* ---- Top three — curated, gold-marked ---- */}
      <SectionBlock
        title="Top three"
        items={top3Cards}
        cap={3}
        alwaysRender
        keyOf={c => c.id}
        renderItem={c => <Card card={c} marked onOpen={id => go('detail', id)} />}
      />

      {/* ---- Executive attention ---- */}
      {hasAttention && (
        <section className="sec">
          <header className="sec__head">
            <h2 className="sec__title">Requires you</h2>
          </header>
          <div className="attn">
            {attention.map(bucket => (
              bucket.items.length ? (
                <div className="attn__col" key={bucket.key}>
                  <div className="attn__label">{bucket.title}</div>
                  <ul className="attn__list">
                    {bucket.items.map(c => (
                      <li key={c.id}>
                        <button className="attn__item" onClick={() => go('detail', c.id)}>
                          {c.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            ))}
          </div>
        </section>
      )}

      {/* ---- The briefing proper ---- */}
      {CORE.map(key => renderSection(key, CORE_CAP))}

      {/* ---- Everything else, one interaction away.
             Counts stay visible so nothing is hidden, only deferred. ---- */}
      {!!deferredCount && (
        <section className="rest">
          <button
            className="rest__toggle"
            onClick={() => setShowRest(!showRest)}
            aria-expanded={showRest}
          >
            <span className="rest__label">
              {showRest ? 'Hide the rest of the day' : 'The rest of the day'}
            </span>
            <span className="rest__summary">
              {deferred.map(d => `${d.items.length} ${(TITLES[d.key] ?? d.title).toLowerCase()}`).join(' · ')}
            </span>
            <span className={`rest__chev ${showRest ? 'rest__chev--up' : ''}`} aria-hidden="true">⌄</span>
          </button>

          {showRest && (
            <div className="rest__body">
              {DEFERRED.map(key => renderSection(key, s(key).cap))}
            </div>
          )}
        </section>
      )}

      {/* ---- Inbox — a count, never an alarm ---- */}
      <div className="home__inbox">
        <span className="tnum">{inbox}</span>
        <span>{inbox === 1 ? 'item waiting to be filed' : 'items waiting to be filed'}</span>
        <button className="act" onClick={() => go('inbox')}>Process inbox</button>
      </div>
    </div>
  );
}
