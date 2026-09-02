/* ============================================================
   Who is signed in

   Google sign-in, because she already lives in Google and it is one
   tap with no password to create or forget.

   Worth stating plainly since the opposite warning was given about
   Gmail: signing in with Google uses basic profile scopes. These are
   NOT the restricted Gmail scopes that carry a weeks-long security
   review. Sign-in is a short setup with no review. The two are
   unrelated and should not be confused.

   With no credentials configured this reports "not connected" and
   the app runs on fixtures, so none of the work waits on setup.
   ============================================================ */

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { isConnected, supabase } from './db';

export interface Account {
  id: string;
  email?: string;
  name?: string;
}

interface AuthState {
  /** Null when signed out, or when running on fixtures. */
  account: Account | null;
  /** False until the first session check settles, to avoid a flash. */
  ready: boolean;
  connected: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(!isConnected);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    const read = (u: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null) =>
      setAccount(u ? {
        id: u.id,
        email: u.email,
        name: (u.user_metadata?.full_name as string | undefined)
          ?? (u.user_metadata?.name as string | undefined),
      } : null);

    supabase.auth.getSession().then(({ data }) => {
      read(data.session?.user ?? null);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      read(session?.user ?? null);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(() => ({
    account,
    ready,
    connected: isConnected,
    error,
    signIn: async () => {
      if (!supabase) return;
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) setError(error.message);
    },
    signOut: async () => {
      await supabase?.auth.signOut();
      setAccount(null);
    },
  }), [account, ready, error]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const a = useContext(Ctx);
  if (!a) throw new Error('useAuth must be used inside AuthProvider');
  return a;
}
