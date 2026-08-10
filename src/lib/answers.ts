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

/** Formatted for pasting into an email or a message. */
export function formatAnswers(
  decisions: { id: string; question: string; owner: string; gate: boolean }[],
  answers: Answers,
  today: string,
): string {
  const done = decisions.filter(d => answers[d.id]?.trim()).length;

  const lines = [
    'Rona OS — decisions',
    `${done} of ${decisions.length} answered · ${today}`,
    '',
  ];

  for (const d of decisions) {
    const a = answers[d.id]?.trim();
    lines.push(`${d.gate ? '[GATES EVERYTHING] ' : ''}${d.question}`);
    lines.push(a ? a : '— not yet answered —');
    lines.push('');
  }

  return lines.join('\n');
}
