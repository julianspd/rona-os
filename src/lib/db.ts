/* ============================================================
   The database

   Degrades cleanly. With no credentials configured this module
   reports "not connected" and the app runs on fixtures exactly as
   it does today — which is what lets the whole persistence layer
   be built and shipped before Rona has set anything up.

   The card shapes in types.ts are the contract. A row is that
   shape split into three columns: the kind, the title, and
   everything else as jsonb. Splitting it further would mean
   sixteen tables and a migration every time a field is added.
   ============================================================ */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AnyCard } from '../types';

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True once both halves of the credential are present. */
export const isConnected = Boolean(URL && KEY);

export const supabase: SupabaseClient | null = isConnected
  ? createClient(URL!, KEY!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

/* ---- Row ⇄ card --------------------------------------------- */

interface CardRow {
  id: string;
  kind: string;
  title: string;
  data: Record<string, unknown>;
}

function toCard(r: CardRow): AnyCard {
  return { ...(r.data as object), id: r.id, kind: r.kind, title: r.title } as AnyCard;
}

function toRow(c: AnyCard, userId: string) {
  // id, kind and title are columns; everything else rides in jsonb.
  const { id, kind, title, ...rest } = c as AnyCard & Record<string, unknown>;
  return { id, user_id: userId, kind, title: title ?? '', data: rest };
}

/* ---- Cards --------------------------------------------------- */

export async function fetchCards(userId: string): Promise<AnyCard[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('cards')
    .select('id, kind, title, data')
    .eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).map(r => toCard(r as CardRow));
}

/** Upsert, because every write in this app is "make it look like this". */
export async function saveCard(c: AnyCard, userId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('cards')
    .upsert(toRow(c, userId), { onConflict: 'user_id,id' });
  if (error) throw error;
}

export async function saveCards(cs: AnyCard[], userId: string): Promise<void> {
  if (!supabase || !cs.length) return;
  const { error } = await supabase
    .from('cards')
    .upsert(cs.map(c => toRow(c, userId)), { onConflict: 'user_id,id' });
  if (error) throw error;
}

/** Only used by a deliberate reset. The product never hard-deletes. */
export async function deleteCard(id: string, userId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('cards').delete().eq('user_id', userId).eq('id', id);
  if (error) throw error;
}

/* ---- Preferences --------------------------------------------- */

export interface Prefs { top3: string[]; showAmounts: boolean }

export async function fetchPrefs(userId: string): Promise<Prefs | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('prefs')
    .select('top3, show_amounts')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data ? { top3: data.top3 ?? [], showAmounts: data.show_amounts ?? true } : null;
}

export async function savePrefs(p: Prefs, userId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('prefs')
    .upsert({ user_id: userId, top3: p.top3, show_amounts: p.showAmounts });
  if (error) throw error;
}

/* ---- Reviews -------------------------------------------------- */

export async function fetchReviews(userId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('reviews')
    .select('closed_on, closed_iso, payload')
    .eq('user_id', userId)
    .order('closed_iso', { ascending: false })
    .limit(24);
  if (error) throw error;
  return (data ?? []).map(r => ({
    closedOn: r.closed_on, closedISO: r.closed_iso,
    ...(r.payload as object),
  }));
}

export async function saveReviewRow(
  userId: string, closedOn: string, closedISO: string, payload: unknown,
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('reviews')
    .insert({ user_id: userId, closed_on: closedOn, closed_iso: closedISO, payload });
  if (error) throw error;
}

/* ---- Decision answers ----------------------------------------- */

export async function fetchAnswers(userId: string): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data, error } = await supabase
    .from('answers')
    .select('decision_id, answer')
    .eq('user_id', userId);
  if (error) throw error;
  return Object.fromEntries((data ?? []).map(r => [r.decision_id, r.answer]));
}

export async function saveAnswer(
  userId: string, decisionId: string, answer: string,
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('answers')
    .upsert({ user_id: userId, decision_id: decisionId, answer });
  if (error) throw error;
}
