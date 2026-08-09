/* ============================================================
   Assisted capture classification

   Rule-based, not a model. Every suggestion states the phrase that
   triggered it, so Rona can see the reasoning and disagree with it.

   This deliberately SUGGESTS and never files. The founding principle
   is capture before classify; a system that moves things silently
   before it has earned trust is worse than one that does nothing.
   ============================================================ */

export type Hint = 'Task' | 'Person' | 'Commitment' | 'Idea' | 'Renewal';

export interface Suggestion {
  hint: Hint;
  /** The words that caused it. Shown verbatim to the user. */
  because: string;
}

interface Rule { hint: Hint; patterns: RegExp[]; reason: (m: string) => string }

const RULES: Rule[] = [
  {
    hint: 'Commitment',
    patterns: [
      /\b(promised|i owe|owes me|waiting on|get back to|send (?:\w+ ){0,2}to|introduce|intro to|follow up with)\b/i,
      /\b(said (?:he|she|they)(?:'| w)?(?:ould|ll)|agreed to)\b/i,
    ],
    reason: m => `“${m}” describes a promise between two people`,
  },
  {
    hint: 'Renewal',
    patterns: [
      /\b(renew|renewal|expires?|expiring|due|invoice|bill|subscription|premium|registration|insurance|dues|tax)\b/i,
    ],
    reason: m => `“${m}” usually means something with a date attached`,
  },
  {
    hint: 'Idea',
    patterns: [
      /\b(idea|what if|concept|series on|worth writing|thought about|maybe we|could be)\b/i,
    ],
    reason: m => `“${m}” reads as a thought rather than an action`,
  },
  {
    hint: 'Person',
    patterns: [
      /\b(worth meeting|get the name|introduce me|met at|reconnect with|new contact)\b/i,
    ],
    reason: m => `“${m}” points at someone rather than something`,
  },
  {
    hint: 'Task',
    patterns: [
      /\b(call|email|book|check|order|replace|find out|look up|ask|draft|write|review|schedule|confirm)\b/i,
    ],
    reason: m => `“${m}” is something you would do`,
  },
];

/**
 * Returns a suggestion, or null when nothing is confident enough.
 * Silence is a valid answer — a wrong guess costs more than none.
 */
export function classify(text: string): Suggestion | null {
  const t = text.trim();
  if (t.length < 4) return null;

  for (const rule of RULES) {
    for (const p of rule.patterns) {
      const m = t.match(p);
      if (m) return { hint: rule.hint, because: rule.reason(m[0].toLowerCase()) };
    }
  }
  return null;
}
