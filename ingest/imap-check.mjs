/* ============================================================
   Smoke test — run this before anything else

   A message count proves the credential, the host, and that IMAP is
   switched on, all at once, before a line of pipeline gets written.

     node ingest/imap-check.mjs

   Reads .env.local. With no password set it says so and exits 0,
   so it never fails a script that runs it on a schedule.
   ============================================================ */

import { ImapFlow } from 'imapflow';
import { readFileSync } from 'node:fs';

/* Small hand-rolled reader so this runs identically from the CLI,
   from cron, and from anywhere else — no framework injection. */
function loadEnv(file = '.env.local') {
  try {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch { /* no file yet, which is fine */ }
}
loadEnv();

const user = process.env.GMAIL_USER;
const pass = (process.env.GMAIL_APP_PASSWORD ?? '').replace(/\s/g, '');

if (!user || !pass) {
  console.log('IMAP credentials not configured — nothing to check yet.');
  console.log('Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local when they arrive.');
  process.exit(0);
}

const client = new ImapFlow({
  host: process.env.GMAIL_IMAP_HOST ?? 'imap.gmail.com',
  port: Number(process.env.GMAIL_IMAP_PORT ?? 993),
  secure: true,
  auth: { user, pass },
  logger: false,
});

try {
  await client.connect();
  console.log(`Connected as ${user}`);

  /* All Mail rather than INBOX: Gmail exposes labels as folders, and
     All Mail carries sent as well, which you need for thread
     completeness. The prefix is locale-dependent on old accounts, so
     match the special-use flag rather than hardcoding the string. */
  let box = '[Gmail]/All Mail';
  const list = await client.list();
  const all = list.find(m => m.specialUse === '\\All');
  if (all) box = all.path;

  const lock = await client.getMailboxLock(box);
  console.log(`Folder:      ${box}`);
  console.log(`Messages:    ${client.mailbox.exists.toLocaleString()}`);
  console.log(`uidValidity: ${client.mailbox.uidValidity}`);
  console.log(`uidNext:     ${client.mailbox.uidNext}`);
  lock.release();
  await client.logout();
  console.log('\nCredential, host and IMAP access all confirmed.');
} catch (e) {
  const msg = String(e?.message ?? e);
  console.error(`\nFailed: ${msg}\n`);
  if (/AUTHENTICATIONFAILED/i.test(msg)) {
    console.error('The app password is wrong, or IMAP is switched off for this mailbox.');
    console.error('It does NOT mean the address is wrong.');
    console.error('Gmail → Settings → Forwarding and POP/IMAP → enable IMAP.');
  } else if (/Application-specific password required/i.test(msg)) {
    console.error('That is the account password, not an app password.');
    console.error('Create one at myaccount.google.com/apppasswords (needs 2-Step Verification on).');
  }
  process.exit(1);
}
