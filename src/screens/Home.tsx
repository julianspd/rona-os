/* ============================================================
   Home — the attention dashboard.
   Understandable in under sixty seconds. Not a widget board.
   ============================================================ */

import { useMemo } from 'react';
import { useStore } from '../store';
import { buildHome, inboxCount } from '../lib/home';
import { SectionBlock } from '../components/SectionBlock';
import { Card } from '../components/Card';
import { todayLabel } from '../lib/dates';
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

export function Home({ go }: { go: (view: string, id?: string) => void }) {
  const { cards, top3 } = useStore();

  const sections = useMemo(() => buildHome(cards), [cards]);
  const s = (key: string) => sections.find(x => x.key === key)!;
  const inbox = inboxCount(cards);

  const top3Cards = top3
    .map(id => cards.find(c => c.id === id))
    .filter(Boolean) as AnyCard[];

  const attention = ['decide', 'review', 'connect', 'do'].map(s);
  const hasAttention = attention.some(a => a.items.length);

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

      {/* ---- Everything else, in priority order.
             Each hides itself when empty. ---- */}
      {['meetings', 'iowe', 'waiting', 'opps', 'risk', 'delegation',
        'reconnect', 'renewals', 'health', 'travel'].map(key => {
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
            cap={sec.cap}
            keyOf={c => c.id}
            renderItem={c => <Card card={c} onOpen={id => go('detail', id)} />}
            onShowAll={target ? () => go(target) : undefined}
          />
        );
      })}

      {/* ---- Inbox — a count, never an alarm ---- */}
      <div className="home__inbox">
        <span className="tnum">{inbox}</span>
        <span>{inbox === 1 ? 'item waiting to be filed' : 'items waiting to be filed'}</span>
        <button className="act" onClick={() => go('inbox')}>Process inbox</button>
      </div>
    </div>
  );
}
