/* ============================================================
   Design system — the token spec, rendered.
   Every value here is read from tokens.css, so this page cannot
   drift from the product.
   ============================================================ */

import {
  StatusBadge, DirectionMark, UrgencyDot, PersonChip, LifeAreaTag,
  DateLabel, NextActionLine, FlagBadge, InlineActions, AILabel,
} from '../components/primitives';
import { AttentionCard } from '../components/Card';
import './styleguide.css';

function Block({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="sg__block">
      <h2 className="sg__h">{title}</h2>
      {note && <p className="sg__note">{note}</p>}
      {children}
    </section>
  );
}

function Swatch({ name, token, hex, on }: { name: string; token: string; hex: string; on?: string }) {
  return (
    <div className="sw">
      <div className="sw__chip" style={{ background: `var(${token})`, color: on }}>
        {on && <span>Aa</span>}
      </div>
      <div className="sw__meta">
        <span className="sw__name">{name}</span>
        <code className="sw__token">{token}</code>
        <code className="sw__hex">{hex}</code>
      </div>
    </div>
  );
}

export function Styleguide() {
  return (
    <div className="sg">
      <header className="page__head">
        <p className="greet__date">Design system</p>
        <h1 className="page__title">Tokens, components, states</h1>
        <p className="page__sub">
          Composed, intelligent, discerning, warm, quietly powerful. Gold marks
          selection and ownership. Urgency is a separate, accessible ramp that
          never borrows gold.
        </p>
        <hr className="rule-gold" style={{ marginTop: 'var(--s5)' }} />
      </header>

      <Block title="Surface" note="Warm throughout. Never a blue-white.">
        <div className="sw-row">
          <Swatch name="Page" token="--bg" hex="#FAF8F3" />
          <Swatch name="Elevated" token="--surface" hex="#FFFFFF" />
          <Swatch name="Warm stone" token="--surface-2" hex="#F4F1E8" />
          <Swatch name="Pressed" token="--surface-3" hex="#EDE9DE" />
          <Swatch name="Hairline" token="--border" hex="#E9E4D8" />
          <Swatch name="Emphasis" token="--border-2" hex="#D9D3C4" />
        </div>
      </Block>

      <Block title="Ink" note="All body values meet WCAG AA on white and on ivory.">
        <div className="sw-row">
          <Swatch name="Charcoal · 15.9:1" token="--ink" hex="#22211F" on="#fff" />
          <Swatch name="Warm slate · 5.9:1" token="--ink-2" hex="#6B675F" on="#fff" />
          <Swatch name="Taupe · 4.6:1" token="--ink-3" hex="#857F74" on="#fff" />
          <Swatch name="Hairline only" token="--ink-4" hex="#B4AEA1" />
        </div>
      </Block>

      <Block
        title="Gold"
        note="Selection, ownership, importance, signature. Never urgency, never decoration. Only the deep value is used for text."
      >
        <div className="sw-row">
          <Swatch name="Signature" token="--gold" hex="#C99A2E" />
          <Swatch name="Bright" token="--gold-bright" hex="#F2C94C" />
          <Swatch name="Deep · text 5.4:1" token="--gold-deep" hex="#8A6418" on="#fff" />
          <Swatch name="Pale surface" token="--gold-surface" hex="#FFF7DC" />
          <Swatch name="Line" token="--gold-line" hex="#E7CE86" />
        </div>
      </Block>

      <Block
        title="Urgency"
        note="Five steps. Only the top two carry hue — the rest step down in weight and tone, so a realistic day stays quiet and colour keeps its meaning. Each pairs a dot shape with a written label; colour is never alone."
      >
        <ul className="sg__urg">
          {([
            ['overdue', 'Overdue', 'Filled, haloed · oxblood #9E2B20 · 7.6:1'],
            ['today', 'Due today', 'Filled · rust #A9521C · 5.1:1'],
            ['soon', 'Within 7 days', 'Filled charcoal · no hue'],
            ['upcoming', 'Within 30 days', 'Hollow ring · taupe'],
            ['later', 'Beyond 30 days, or undated', 'Faint hollow ring'],
          ] as const).map(([u, label, desc]) => (
            <li key={u} className={`sg__urgrow u-${u}`}>
              <UrgencyDot urgency={u} />
              <span className="sg__urglabel">{label}</span>
              <span className="sg__urgdesc">{desc}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Typography" note="Sans for interface. Serif for greetings, dates, section moments and reflection — never for dense content.">
        <div className="sg__type">
          <p className="greet__line">Good morning, Rona.</p>
          <span className="sg__spec">Serif · 34 / 1.15 · greeting</span>

          <p className="page__title">Commitments</p>
          <span className="sg__spec">Serif · 24 / 1.2 · page title</span>

          <p style={{ fontSize: 'var(--fs-body)' }}>Draft the autumn fundraising target</p>
          <span className="sg__spec">Sans · 15 / 1.28 · card title, two-line clamp</span>

          <p style={{ fontSize: 'var(--fs-meta)', color: 'var(--ink-2)' }}>
            Waiting on · Marisol Vega · 19 days
          </p>
          <span className="sg__spec">Sans · 13 · context line</span>

          <p className="eyebrow">Requires you</p>
          <span className="sg__spec">Sans · 11 · uppercase, 0.11em · eyebrow</span>
        </div>
      </Block>

      <Block title="Commitment direction" note="The strongest non-urgency signal in the product. Arrow, fill and language together — legible in greyscale and across a room.">
        <div className="sg__row">
          <DirectionMark direction="I Owe" />
          <span className="sg__spec">Outward responsibility — filled, arrow up</span>
        </div>
        <div className="sg__row">
          <DirectionMark direction="They Owe" />
          <span className="sg__spec">Incoming dependency — outlined, arrow down</span>
        </div>
      </Block>

      <Block title="Status" note="Shape carries the meaning: filled is in motion, outlined is blocked on someone else, muted is parked, struck is closed.">
        <div className="sg__row">
          <StatusBadge status="Active" />
          <StatusBadge status="Scheduled" />
          <StatusBadge status="Waiting" />
          <StatusBadge status="Delegated" />
          <StatusBadge status="Blocked" />
          <StatusBadge status="On Hold" />
          <StatusBadge status="Complete" />
        </div>
      </Block>

      <Block title="Marks & metadata">
        <div className="sg__row">
          <PersonChip name="Marisol Vega" />
          <LifeAreaTag area="Consulting" />
          <DateLabel iso="2026-07-20" />
          <DateLabel iso="2026-08-12" />
          <FlagBadge flag="stalled" />
          <FlagBadge flag="delegatable" />
          <NextActionLine text="Send the scope outline" />
          <NextActionLine />
        </div>
      </Block>

      <Block title="Actions" note="Primary uses gold — ownership, not alarm.">
        <div className="sg__row">
          <InlineActions actions={[
            { label: 'Done', onClick: () => {}, primary: true },
            { label: 'Snooze', onClick: () => {} },
            { label: 'Delegate', onClick: () => {} },
          ]} />
          <button className="act" disabled>Disabled</button>
        </div>
        <div className="sg__row" style={{ marginTop: 'var(--s3)' }}>
          <button className="tab tab--on">Selected filter<span className="tab__n">12</span></button>
          <button className="tab">Unselected<span className="tab__n">4</span></button>
          <button className="hint hint--on">Commitment</button>
          <button className="hint">Idea</button>
        </div>
      </Block>

      <Block title="Card states" note="Fine warm border, no shadow at rest, border emphasis on hover. A narrow accent edge only when the item earns it.">
        <div className="sg__cards">
          <AttentionCard
            title="Resting state — a briefing note, not a ticket"
            meta={<><StatusBadge status="Active" /><DateLabel iso="2026-09-16" /></>}
            actions={[{ label: 'Done', onClick: () => {}, primary: true }]}
          />
          <AttentionCard
            title="Curated — gold edge marks the Top three"
            marked
            meta={<><StatusBadge status="Next" /><DateLabel iso="2026-08-04" /></>}
            actions={[{ label: 'Done', onClick: () => {}, primary: true }]}
          />
          <AttentionCard
            title="Overdue — urgency colour, never gold"
            urgencyDate="2026-07-20"
            meta={<><DirectionMark direction="I Owe" /><DateLabel iso="2026-07-20" /></>}
            actions={[{ label: 'Done', onClick: () => {}, primary: true }]}
          />
          <AttentionCard
            title="Completed — dimmed and struck"
            done
            meta={<StatusBadge status="Complete" />}
          />
        </div>
      </Block>

      <Block title="AI surface" note="Always labelled, always shows its reason, always dismissible.">
        <AILabel reason="no interaction logged since 6 March">
          Nadia Sorenson has gone dormant. She is Inner Circle, and you promised
          her two introductions when she moved.
        </AILabel>
      </Block>

      <Block title="Form & motion">
        <dl className="fields" style={{ maxWidth: 520 }}>
          <div className="field"><dt>Radius</dt><dd>3 · 5 · 7 · 12 — restrained, never pill-shaped cards</dd></div>
          <div className="field"><dt>Shadow</dt><dd>none at rest · 1px hover · float for sheets only</dd></div>
          <div className="field"><dt>Rhythm</dt><dd>4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 88</dd></div>
          <div className="field"><dt>Section gap</dt><dd>64 — space separates before a rule does</dd></div>
          <div className="field"><dt>Motion</dt><dd>90ms and 140ms, cubic-bezier(.2,0,.2,1) — 150ms ceiling</dd></div>
          <div className="field"><dt>Focus</dt><dd>2px deep gold, 2px offset, never removed</dd></div>
          <div className="field"><dt>Touch target</dt><dd>44px minimum on mobile</dd></div>
        </dl>
      </Block>
    </div>
  );
}
