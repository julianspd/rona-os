/* ============================================================
   App shell — navigation, capture, undo
   ============================================================ */

import { useEffect, useState } from 'react';
import { StoreProvider, useStore } from './store';
import { Home } from './screens/Home';
import { Commitments, Detail, Inbox, People, Search, Tasks, Today } from './screens/Lists';
import { EntityDetail, EntityList, SphereGrid } from './screens/Spheres';
import { Bills, Decisions, Documents, Goals, Opportunities, Projects, Renewals } from './screens/Pipeline';
import { Styleguide } from './screens/Styleguide';
import type { EntityType } from './types';
import './styles/tokens.css';
import './app.css';

/* Six primary destinations plus Spheres. Not twenty. */
const NAV = [
  { key: 'home', label: 'Home' },
  { key: 'today', label: 'Today' },
  { key: 'inbox', label: 'Inbox' },
  { key: 'commitments', label: 'Commitments' },
  { key: 'people', label: 'People' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'search', label: 'Search' },
  { key: 'spheres', label: 'Spheres' },
];

/* Mobile carries five: two, capture, two. The rest sit behind More. */
const MOBILE_PRIMARY = ['home', 'today'];
const MOBILE_SECONDARY = ['commitments', 'search'];

function useIsMobile() {
  const [m, setM] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const h = (e: MediaQueryListEvent) => setM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return m;
}

/* ---- Prototype banner — honest, and visually subordinate ------ */
function PrototypeBanner() {
  const [open, setOpen] = useState(true);
  const { fixtureState, setFixtureState } = useStore();
  if (!open) return null;
  return (
    <div className="banner">
      <span>
        <strong>Prototype.</strong> Fictional data, resets on reload.
        Stalled, at-risk and dormant flags are hand-authored, not detected.
      </span>
      <button
        className="banner__toggle"
        onClick={() => setFixtureState(fixtureState === 'primary' ? 'quiet' : 'primary')}
      >
        {fixtureState === 'primary' ? 'View a quiet day' : 'View a full day'}
      </button>
      <button className="banner__x" onClick={() => setOpen(false)} aria-label="Dismiss">×</button>
    </div>
  );
}

/* ---- Quick Capture — a signature moment ---------------------- */
function QuickCapture({ onClose }: { onClose: () => void }) {
  const { capture } = useStore();
  const [text, setText] = useState('');
  const [hint, setHint] = useState<'Task' | 'Person' | 'Commitment' | 'Idea' | 'Renewal' | undefined>();

  const submit = () => {
    if (!text.trim()) return;
    capture(text.trim(), hint);
    onClose();
  };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div className="sheet" onClick={onClose} role="dialog" aria-label="Capture">
      <div className="sheet__box" onClick={e => e.stopPropagation()}>
        <div className="sheet__rule" />
        <div className="sheet__main">
          <div className="sheet__eyebrow">Capture</div>
          <input
            className="sheet__input"
            placeholder="What's on your mind?"
            value={text}
            autoFocus
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
          {/* Hints pre-fill. They never block. */}
          <div className="sheet__hints">
            {(['Task', 'Person', 'Commitment', 'Idea', 'Renewal'] as const).map(h => (
              <button
                key={h}
                className={`hint ${hint === h ? 'hint--on' : ''}`}
                onClick={() => setHint(hint === h ? undefined : h)}
                aria-pressed={hint === h}
              >{h}</button>
            ))}
          </div>
        </div>
        <div className="sheet__foot">
          <span className="sheet__note">Goes to Inbox. Nothing else required.</span>
          <button className="act act--primary" onClick={submit}>Capture</button>
        </div>
      </div>
    </div>
  );
}

/* ---- Undo -------------------------------------------------- */
function Toast() {
  const { toast, clearToast } = useStore();
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 5000);
    return () => clearTimeout(t);
  }, [toast, clearToast]);
  if (!toast) return null;
  return (
    <div className="toast" role="status">
      <span>{toast.message}</span>
      <button onClick={() => { toast.undo(); clearToast(); }}>Undo</button>
    </div>
  );
}

function Shell() {
  const [view, setView] = useState<string>('home');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [more, setMore] = useState(false);
  const isMobile = useIsMobile();

  const go = (v: string, id?: string) => {
    if ((v === 'detail' || v === 'detail-entity') && id) { setDetailId(id); setView(v); }
    else setView(v);
    setMore(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCapturing(true); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const item = (key: string, label: string) => (
    <li key={key}>
      <button
        className={`rail__item ${view === key ? 'rail__item--on' : ''}`}
        onClick={() => go(key)}
        aria-current={view === key ? 'page' : undefined}
      >
        {label}
      </button>
    </li>
  );

  const nav = (key: string) => NAV.find(n => n.key === key)!;

  return (
    <div className="shell">
      <PrototypeBanner />

      <div className="shell__body">
        <nav className="rail" aria-label="Primary">
          {!isMobile && (
            <div className="rail__brand">
              <span className="rail__mono">R</span>
              <span className="rail__brandname">Rona OS</span>
            </div>
          )}

          {isMobile ? (
            <>
              <ul className="rail__list">
                {MOBILE_PRIMARY.map(k => item(k, nav(k).label))}
              </ul>
              <button className="rail__capture" onClick={() => setCapturing(true)} aria-label="Capture">+</button>
              <ul className="rail__list">
                {MOBILE_SECONDARY.map(k => item(k, nav(k).label))}
                <li className="rail__more">
                  <button className="rail__item" onClick={() => setMore(true)}>More</button>
                </li>
              </ul>
            </>
          ) : (
            <>
              <ul className="rail__list">
                {NAV.slice(0, 5).map(n => item(n.key, n.label))}
                <li className="rail__div" aria-hidden="true" />
                {NAV.slice(5).map(n => item(n.key, n.label))}
              </ul>
              <button className="rail__capture" onClick={() => setCapturing(true)}>
                Capture <span className="rail__kbd">⌘K</span>
              </button>
            </>
          )}
        </nav>

        <main className="main">
          {view === 'home' && <Home go={go} />}
          {view === 'today' && <Today go={go} />}
          {view === 'inbox' && <Inbox go={go} />}
          {view === 'commitments' && <Commitments go={go} />}
          {view === 'people' && <People go={go} />}
          {view === 'tasks' && <Tasks go={go} />}
          {view === 'search' && <Search go={go} />}
          {view === 'spheres' && <SphereGrid go={go} />}
          {view === 'projects' && <Projects go={go} />}
          {view === 'opportunities' && <Opportunities go={go} />}
          {view === 'bills' && <Bills go={go} />}
          {view === 'renewals' && <Renewals go={go} />}
          {view === 'goals' && <Goals go={go} />}
          {view === 'documents' && <Documents go={go} />}
          {view === 'decisions' && <Decisions go={go} />}
          {view === 'styleguide' && <Styleguide />}
          {view.startsWith('entity:') && (
            <EntityList type={view.split(':')[1] as EntityType} go={go} />
          )}
          {view === 'detail-entity' && detailId && <EntityDetail id={detailId} go={go} />}
          {view === 'detail' && detailId && <Detail id={detailId} go={go} />}
        </main>
      </div>

      {more && (
        <div className="more" onClick={() => setMore(false)}>
          <div className="more__box" onClick={e => e.stopPropagation()}>
            <div className="sheet__eyebrow">Everything else</div>
            <ul className="more__list">
              {NAV.filter(n => ![...MOBILE_PRIMARY, ...MOBILE_SECONDARY].includes(n.key)).map(n => (
                <li key={n.key}>
                  <button className="more__item" onClick={() => go(n.key)}>{n.label}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {capturing && <QuickCapture onClose={() => setCapturing(false)} />}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
