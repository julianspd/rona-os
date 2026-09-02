/* ============================================================
   Read her mail

     node ingest/imap-sync.mjs [--days 90] [--limit 500]

   Writes to ingest/data/messages.json for now. That file is the seam:
   when the database exists this writes rows instead, and nothing else
   about the script changes.

   With no credential configured it logs and exits 0 rather than
   throwing, so it can be wired to a schedule before the password
   arrives and never flaps.

   Deliberately bounded by date. Her archive runs to 1999 and reading
   all of it would blow past the free database tier and spend real
   money classifying decade-old calendar invites. The old mail is a
   search problem, not a working set.
   ============================================================ */

import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

const OUT = 'ingest/data/messages.json';
const STATE = 'ingest/data/state.json';

function loadEnv(file = '.env.local') {
  try {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch { /* no file yet */ }
}
loadEnv();

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};

const DAYS = Number(arg('days', 90));
const LIMIT = Number(arg('limit', 500));

const user = process.env.GMAIL_USER;
const pass = (process.env.GMAIL_APP_PASSWORD ?? '').replace(/\s/g, '');

if (!user || !pass) {
  console.log('IMAP credentials not configured — nothing to sync.');
  process.exit(0);
}

const readJson = (f, fallback) => {
  try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return fallback; }
};
const writeJson = (f, v) => {
  if (!existsSync(dirname(f))) mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, JSON.stringify(v, null, 2));
};

const state = readJson(STATE, {});
const store = readJson(OUT, {});   // keyed by message id, so re-runs are safe

const client = new ImapFlow({
  host: 'imap.gmail.com', port: 993, secure: true,
  auth: { user, pass }, logger: false,
});

/** Root of the References chain, else the subject with Re:/Fwd: stripped. */
function threadKey(parsed) {
  const refs = parsed.references;
  if (refs) return Array.isArray(refs) ? refs[0] : String(refs).split(/\s+/)[0];
  return (parsed.subject ?? '').replace(/^((re|fwd|fw)\s*:\s*)+/i, '').trim().toLowerCase();
}

const addr = a => a?.value?.[0]?.address?.toLowerCase() ?? '';

try {
  await client.connect();

  let box = '[Gmail]/All Mail';
  const all = (await client.list()).find(m => m.specialUse === '\\All');
  if (all) box = all.path;

  const lock = await client.getMailboxLock(box);
  const key = `${user}:${box}`;
  const prev = state[key] ?? { lastUid: 0, uidValidity: null };

  // Gmail renumbered everything — start over rather than sync nonsense.
  if (prev.uidValidity && String(prev.uidValidity) !== String(client.mailbox.uidValidity)) {
    console.log('uidValidity changed — resyncing from the start.');
    prev.lastUid = 0;
  }

  const since = new Date(Date.now() - DAYS * 86_400_000);
  console.log(`${user} · ${box}`);
  console.log(`${client.mailbox.exists.toLocaleString()} messages in the folder`);
  console.log(`Reading the last ${DAYS} days, up to ${LIMIT}, from uid ${prev.lastUid + 1}\n`);

  let seen = 0, added = 0, highest = prev.lastUid;

  for await (const msg of client.fetch(
    { uid: `${prev.lastUid + 1}:*`, since },
    { uid: true, source: true, envelope: true },
  )) {
    // IMAP returns the highest-uid message even when the range exceeds
    // it. Without this you refetch the newest message forever.
    if (msg.uid <= prev.lastUid) continue;
    if (seen >= LIMIT) break;
    seen++;
    highest = Math.max(highest, msg.uid);

    const parsed = await simpleParser(msg.source);
    const id = parsed.messageId ?? `uid-${msg.uid}`;
    if (store[id]) continue;

    const from = addr(parsed.from);
    store[id] = {
      id,
      account: user,
      uid: msg.uid,
      date: parsed.date?.toISOString() ?? null,
      subject: parsed.subject ?? '',
      from,
      fromName: parsed.from?.value?.[0]?.name ?? '',
      to: (parsed.to?.value ?? []).map(v => v.address?.toLowerCase()).filter(Boolean),
      // Whose side of the conversation this is
      direction: from === user.toLowerCase() ? 'outbound' : 'inbound',
      threadKey: threadKey(parsed),
      snippet: (parsed.text ?? '').replace(/\s+/g, ' ').trim().slice(0, 400),
      // Filenames only, never bodies. Keeps the file small and the
      // liability surface flat.
      attachments: (parsed.attachments ?? []).map(a => a.filename).filter(Boolean),
    };
    added++;

    if (added % 25 === 0) {
      writeJson(OUT, store);
      state[key] = { lastUid: highest, uidValidity: String(client.mailbox.uidValidity) };
      writeJson(STATE, state);
      process.stdout.write(`  ${added} saved\r`);
      await new Promise(r => setTimeout(r, 250));  // Gmail throttles the impatient
    }
  }

  writeJson(OUT, store);
  state[key] = { lastUid: highest, uidValidity: String(client.mailbox.uidValidity) };
  writeJson(STATE, state);

  lock.release();
  await client.logout();

  const total = Object.keys(store).length;
  console.log(`\nRead ${seen}, saved ${added} new. ${total} held in ${OUT}.`);
  console.log(`Delete ${STATE} to force a full resync.`);
} catch (e) {
  console.error(`\nFailed: ${e?.message ?? e}`);
  console.error('Run `node ingest/imap-check.mjs` to test the credential on its own.');
  process.exit(1);
}
