/* ============================================================
   Diagnostics

   A blank screen tells you nothing, and I cannot open a browser on
   the device where it happens. This makes the failure legible from
   the phone itself.

   Two parts:
     - an error boundary, so a thrown component paints the error
       instead of leaving white space
     - a panel at #debug reporting what the device actually thinks,
       which is the information I keep having to guess at

   The panel only appears with #debug in the URL, so nothing here
   shows up in a client demo.
   ============================================================ */

import { Component, useEffect, useState } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

/* ---- Error boundary ---------------------------------------- */
interface State { error: Error | null; stack: string }

export class ErrorTrap extends Component<{ children: ReactNode }, State> {
  state: State = { error: null, stack: '' };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ stack: info.componentStack ?? '' });
    // Also to the console, for anyone with a laptop attached.
    console.error('Rona OS crashed:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="crash">
        <h1 className="crash__h">Something broke.</h1>
        <p className="crash__p">
          This is a real error, not a blank page. Send this screen on and it
          can be fixed properly.
        </p>
        <pre className="crash__pre">{String(this.state.error?.message ?? this.state.error)}</pre>
        {!!this.state.stack && (
          <pre className="crash__pre crash__pre--dim">{this.state.stack.trim().slice(0, 900)}</pre>
        )}
      </div>
    );
  }
}

/* ---- What the device actually thinks ------------------------ */
export function DebugPanel() {
  /* Accept every form of it. A hash gets dropped by some keyboards and
     autocompletes, and a wrong guess costs another round trip. */
  const { hash, search, pathname } = window.location;
  const on = /debug/.test(hash) || /debug/.test(search) || /debug/.test(pathname);
  if (!on) return null;

  const mq = (q: string) => {
    try { return window.matchMedia(q).matches ? 'yes' : 'no'; }
    catch { return 'unsupported'; }
  };

  const supports = (prop: string, val: string) => {
    try { return CSS.supports(prop, val) ? 'yes' : 'no'; }
    catch { return 'unsupported'; }
  };

  const rows: [string, string][] = [
    ['viewport', `${window.innerWidth} × ${window.innerHeight}`],
    ['screen', `${window.screen.width} × ${window.screen.height}`],
    ['pixel ratio', String(window.devicePixelRatio)],
    ['mobile query matches', mq('(max-width: 760px)')],
    ['range syntax works', mq('(width <= 760px)')],
    ['supports dvh', supports('height', '100dvh')],
    ['supports env()', supports('padding', 'env(safe-area-inset-bottom)')],
    ['supports :has', supports('selector(:has(a))', '') === 'unsupported' ? 'n/a' : 'checked'],
    ['localStorage', (() => {
      try { window.localStorage.setItem('_p', '1'); window.localStorage.removeItem('_p'); return 'available'; }
      catch { return 'blocked'; }
    })()],
    ['user agent', navigator.userAgent],
  ];

  return (
    <div className="debug">
      <p className="debug__h">Diagnostics</p>
      <dl className="debug__list">
        {rows.map(([k, v]) => (
          <div className="debug__row" key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      <LayoutReport />
    </div>
  );
}

/* ---- Where things actually ended up -------------------------
   Everything above says the device is capable. So the question is
   no longer what it supports, but where it put things. Measured
   after paint, on the device, because reading the stylesheet from
   here has now been wrong three times.                           */
function LayoutReport() {
  const [rows, setRows] = useState<[string, string][]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      const box = (sel: string) => {
        const el = document.querySelector(sel);
        if (!el) return `${sel} — NOT IN DOM`;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return `x${Math.round(r.x)} y${Math.round(r.y)} ${Math.round(r.width)}×${Math.round(r.height)} · ${cs.position} · ${cs.display}`;
      };
      const kids = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? String(el.childElementCount) : 'absent';
      };
      const flex = (sel: string) => {
        const el = document.querySelector(sel);
        if (!el) return 'absent';
        const cs = getComputedStyle(el);
        return `${cs.flexDirection} / align:${cs.alignItems} / order:${cs.order}`;
      };

      setRows([
        ['.env', box('.env')],
        ['.shell__body', box('.shell__body')],
        ['.shell__body flex', flex('.shell__body')],
        ['.main', box('.main')],
        ['.main children', kids('.main')],
        ['.home', box('.home')],
        ['.home children', kids('.home')],
        ['.greet', box('.greet')],
        ['.greet__line', box('.greet__line')],
        ['.rail', box('.rail')],
        ['.rail flex', flex('.rail')],
        ['doc scrollHeight', String(document.documentElement.scrollHeight)],
        ['body scrollHeight', String(document.body.scrollHeight)],
      ]);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  if (!rows.length) return null;
  return (
    <>
      <p className="debug__h" style={{ marginTop: 10 }}>Layout</p>
      <dl className="debug__list">
        {rows.map(([k, v]) => (
          <div className="debug__row" key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
    </>
  );
}
