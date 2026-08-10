/* ============================================================
   Decision answers — the one thing that persists

   The product itself deliberately keeps nothing: refresh and the
   demo resets. This is the single exception, and it earns it —
   someone typing considered answers into a review page should not
   lose them to an accidental reload.

   Still front-end only. Answers live in this browser and go
   nowhere on their own; that is exactly why the Build screen also
   offers a copy-out. A field that silently strands its input is
   worse than no field.
   ============================================================ */

const KEY = 'rona-os.decision-answers.v1';

export type Answers = Record<string, string>;

/** Private browsing and locked-down browsers can throw on access. */
function storage(): Storage | null {
  try {
    const s = window.localStorage;
    const probe = '__probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

export const canPersist = storage() !== null;

export function loadAnswers(): Answers {
  const s = storage();
  if (!s) return {};
  try {
    const raw = s.getItem(KEY);
    return raw ? (JSON.parse(raw) as Answers) : {};
  } catch {
    return {};
  }
}

export function saveAnswers(a: Answers): void {
  const s = storage();
  if (!s) return;
  try {
    s.setItem(KEY, JSON.stringify(a));
  } catch {
    /* Quota or policy. Nothing useful to do; the copy-out still works. */
  }
}

export function clearAnswers(): void {
  storage()?.removeItem(KEY);
}

export interface DecisionLike { id: string; question: string; owner: string; gate: boolean }

/** Formatted for pasting into an email or a message. */
export function formatAnswers(
  decisions: DecisionLike[],
  answers: Answers,
  today: string,
  answeredOnly = false,
): string {
  const done = decisions.filter(d => answers[d.id]?.trim()).length;
  const list = answeredOnly ? decisions.filter(d => answers[d.id]?.trim()) : decisions;

  const lines = [
    'Rona OS — decisions',
    `${done} of ${decisions.length} answered · ${today}`,
    '',
  ];

  for (const d of list) {
    const a = answers[d.id]?.trim();
    lines.push(`${d.gate ? '[GATES EVERYTHING] ' : ''}${d.question}`);
    lines.push(a ? a : '— not yet answered —');
    lines.push('');
  }

  return lines.join('\n');
}

/* ============================================================
   Sending

   There is no server, so "submit" means handing the answers to
   something Rona already has: her mail client, or a file. Both
   happen entirely on her machine — the page makes no network
   request either way.

   A real submit — answers landing straight in an inbox or a
   database without her pressing send — needs the backend, which
   is on the blocked list for a reason.
   ============================================================ */

/** Mail clients truncate long URLs. Below this we can use mailto safely. */
const MAILTO_LIMIT = 1600;

export interface SendPlan {
  href: string;
  /** True when the body is short enough to survive a mailto URL. */
  viable: boolean;
  length: number;
}

export function buildMailto(
  to: string,
  decisions: DecisionLike[],
  answers: Answers,
  today: string,
): SendPlan {
  const done = decisions.filter(d => answers[d.id]?.trim()).length;
  const subject = `Rona OS — decisions (${done} of ${decisions.length} answered)`;
  // Only answered questions, to stay well inside the URL ceiling.
  const body = formatAnswers(decisions, answers, today, true);
  const href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { href, viable: href.length <= MAILTO_LIMIT, length: href.length };
}

/** Saves to disk. No network, no upload, nothing leaves the machine. */
export function downloadAnswers(text: string, filename: string): void {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---- A record of the last send, so she is not left guessing --- */
const SENT_KEY = 'rona-os.decision-answers-sent.v1';

export function markSent(label: string): void {
  try { storage()?.setItem(SENT_KEY, label); } catch { /* nothing to do */ }
}

export function lastSent(): string | null {
  return storage()?.getItem(SENT_KEY) ?? null;
}
