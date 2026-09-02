# Reading her mail

```bash
npm run mail:check          # prove the credential, before anything else
npm run mail:sync           # pull the last 90 days
npm run mail:sync -- --days 365 --limit 2000
```

Both exit cleanly with no credential set, so they can be scheduled
before anyone has handed one over.

## Settings

| | |
|---|---|
| Host | `imap.gmail.com` |
| Port | `993`, implicit TLS |
| User | the full address |
| Password | the 16-character app password (spaces ignored) |
| Folder | `[Gmail]/All Mail`, matched by its `\All` flag rather than the name |

Later, for replies: `smtp.gmail.com` on `465`, **the same credential**.
Don't introduce a second one.

## What to tell her

1. **myaccount.google.com**, signed in as the mailbox being connected
2. **Security** → turn on **2-Step Verification** — *use a phone number
   or an authenticator app*
3. Search the settings for **App passwords**
4. Name it `Rona OS` → **Create**
5. Share the 16-character code through **1Password**

Step 2 matters more than it looks: if 2-Step Verification is set up with
**only a security key**, Google hides app passwords entirely. A phone
number or authenticator avoids that.

There is no longer an "enable IMAP" step. Google removed the toggle in
January 2025 and IMAP is always on.

## When it will not work

**No App passwords option.** 2-Step Verification is not on yet; or the
account is enrolled in **Advanced Protection**, which blocks app
passwords outright and revokes existing ones; or 2SV uses only a
security key.

**`AUTHENTICATIONFAILED`.** The password is wrong or revoked. Not the
address, and — since IMAP is always on now — almost never a setting.

**`Application-specific password required`.** Somebody handed over their
account password instead of an app password.

## Deliberate limits

**Ninety days by default.** Her archive runs to 1999. Reading all of it
would blow past both the free database tier and Gmail's own IMAP
bandwidth ceiling, and would spend real money classifying decade-old
calendar invites. The old mail is a search problem, not a working set.

**Filenames only, never attachment bodies.** Small files, flat liability.

**One inbox first.** She has three. Three credentials failing at once
tells you nothing about which.

## Where it writes

`ingest/data/messages.json`, keyed by message id so re-runs are safe.
That file is the seam — when the database exists this writes rows
instead and nothing else changes.

`ingest/data/` and `.env.local` are gitignored. Her mail is never
committed.
