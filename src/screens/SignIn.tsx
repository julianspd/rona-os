/* ============================================================
   Sign in

   The first thing she ever sees, and the only screen in the product
   with nothing to scan — so it gets the editorial voice and one
   button, rather than a form.
   ============================================================ */

import { useAuth } from '../lib/auth';
import { todayLabel } from '../lib/dates';
import './signin.css';

export function SignIn() {
  const { signIn, error } = useAuth();

  return (
    <div className="signin">
      <div className="signin__box">
        <div className="signin__brand">
          <span className="signin__mono">R</span>
          <span className="signin__name">Rona OS</span>
        </div>

        <p className="signin__date">{todayLabel}</p>
        <h1 className="signin__h">Good morning, Rona.</h1>
        <p className="signin__p">
          Everything that deserves your attention today, in one place.
          Sign in with the Google account you want this to belong to.
        </p>

        <hr className="rule-gold signin__rule" />

        <button className="signin__btn" onClick={signIn}>
          Continue with Google
        </button>

        {error && <p className="signin__err">{error}</p>}

        <p className="signin__note">
          Your data is yours. It sits in your own database, and nothing is
          shared with anyone.
        </p>
      </div>
    </div>
  );
}
