/* ============================================================
   The client profile

   Rona's template, section for section. Two things about it
   shaped how this is built:

   1. Her heading says "Required for Every Top Account + Growth
      Target" — so it is a layer that switches on per contact,
      not thirty empty fields on everyone she knows.

   2. Her document is called CLIENT PROFILE *COMPLETION*. The
      metric she cares about is how filled-in these are, so the
      product measures that and says what is missing.
   ============================================================ */

import type { ClientProfile, Contact } from '../types';

export type ProfileFieldType = 'text' | 'longtext' | 'select' | 'score';

export interface ProfileField {
  key: keyof ClientProfile;
  label: string;
  type: ProfileFieldType;
  options?: readonly string[];
  hint?: string;
  /** Counts toward completeness. Some fields are genuinely optional. */
  scored?: boolean;
}

export interface ProfileSection {
  key: string;
  title: string;
  /** Same muted family as life areas, so the two sit together. */
  color: string;
  /** Short fields sit two-up; long ones take the full width. */
  /** Her own annotation, kept because it explains why the section exists. */
  note?: string;
  fields: ProfileField[];
}

export const PROFILE: ProfileSection[] = [
  {
    key: 'core', title: 'Core', color: '#5B6B8A',
    fields: [
      { key: 'team', label: 'Team / division', type: 'text', scored: true },
      { key: 'decisionPower', label: 'Decision power', type: 'select', scored: true,
        options: ['Decision Maker', 'Influencer', 'Champion'] },
      { key: 'reportsTo', label: 'Reports to', type: 'text', scored: true },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'mailingAddress', label: 'Mailing address', type: 'text' },
    ],
  },
  {
    key: 'personal', title: 'Personal context', color: '#8A5A62',
    note: 'This is where deals are actually unlocked.',
    fields: [
      { key: 'hometown', label: 'Hometown / background', type: 'text', scored: true },
      { key: 'family', label: 'Family', type: 'text', scored: true },
      { key: 'interests', label: 'Interests', type: 'longtext', scored: true,
        hint: 'Sport, culture, food, travel, wellness' },
      { key: 'commStyle', label: 'How they like to be dealt with', type: 'select', scored: true,
        options: ['Direct', 'Collaborative', 'Vision-led'] },
    ],
  },
  {
    key: 'values', title: 'Cultural & values signals', color: '#6A7A46',
    note: 'Drives gifting, invitations, partnership ideas, and the timing of an ask.',
    fields: [
      { key: 'causes', label: 'Nonprofits / causes', type: 'longtext', scored: true },
      { key: 'boards', label: 'Boards / advisory roles', type: 'text', scored: true },
      { key: 'community', label: 'Community involvement', type: 'text' },
      { key: 'passionProjects', label: 'Passion projects', type: 'longtext', scored: true },
    ],
  },
  {
    key: 'motivators', title: 'Professional motivators', color: '#5A5B8C',
    fields: [
      { key: 'successLooksLike', label: 'What success looks like for them', type: 'longtext', scored: true },
      { key: 'pressures', label: 'Current pressures', type: 'longtext', scored: true,
        hint: 'Slate volume, internal politics, budget freezes' },
      { key: 'knownFor', label: 'What they want to be known for', type: 'longtext', scored: true },
      { key: 'keepsThemUp', label: 'What keeps them up at night', type: 'longtext' },
    ],
  },
  {
    key: 'status', title: 'Relationship status', color: '#3F7A6E',
    fields: [
      { key: 'strengthScore', label: 'Strength (1–5)', type: 'score', scored: true },
      { key: 'relationshipOwner', label: 'Who owns it internally', type: 'text' },
      { key: 'gaps', label: 'Gaps — who else we need to know', type: 'longtext', scored: true },
    ],
  },
  {
    key: 'strategic', title: 'Strategic opportunities', color: '#7A6248',
    fields: [
      { key: 'trustedWith', label: 'Where we already have trust', type: 'longtext', scored: true },
      { key: 'adjacentTeams', label: 'Adjacent teams to meet', type: 'text', scored: true },
      { key: 'upcomingMoments', label: 'Upcoming moments', type: 'longtext', scored: true,
        hint: 'Launches, anniversaries, reorgs, milestones' },
    ],
  },
];

const SCORED = PROFILE.flatMap(s => s.fields.filter(f => f.scored));

export interface Completeness {
  filled: number;
  total: number;
  percent: number;
  /** The specific gaps, so "incomplete" is actionable rather than a number. */
  missing: ProfileField[];
}

export function completeness(c: Contact): Completeness {
  const p = c.profile ?? {};
  const missing = SCORED.filter(f => {
    const v = p[f.key];
    return v === undefined || v === null || v === '';
  });
  const filled = SCORED.length - missing.length;
  return {
    filled,
    total: SCORED.length,
    percent: Math.round((filled / SCORED.length) * 100),
    missing,
  };
}

/** Which section a field belongs to — so a gap can be coloured by
    the part of the picture it is missing from. */
export function sectionOf(key: string): ProfileSection | undefined {
  return PROFILE.find(s => s.fields.some(f => f.key === key));
}

/* Decision power and communication style are the two option sets
   worth colouring: both change how you approach somebody. */
export const DECISION_COLOR: Record<string, string> = {
  'Decision Maker': '#8A5A62',
  'Influencer': '#5A5B8C',
  'Champion': '#3F7A6E',
};

export const STYLE_COLOR: Record<string, string> = {
  'Direct': '#8A6A52',
  'Collaborative': '#3F7A6E',
  'Vision-led': '#5A5B8C',
};

/** Her five-point score, mapped onto the tiers that drive cadence. */
export const SCORE_MEANING: Record<number, string> = {
  1: 'Barely know them',
  2: 'Acquaintance',
  3: 'Working relationship',
  4: 'Trusted',
  5: 'They take your call',
};
