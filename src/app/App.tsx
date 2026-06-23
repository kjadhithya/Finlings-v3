import { useState, useRef, useEffect, useCallback } from 'react';
import { Aquarium } from './components/Aquarium';
import { SwimmingFish, type Entry } from './components/SwimmingFish';
import { NewEntryModal, EditEntryModal } from './components/NewEntryModal';
import { AllEntriesModal, EntryDetailModal } from './components/AllEntriesModal';
import { HomePage, CreateTankModal, type Tank, type TankType } from './components/HomePage';
import logoRaw from '../imports/pasted_text/logo-2.svg?raw';

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const GLOBAL_STYLES = `
  html, body { background: #0e0a06 !important; margin: 0; padding: 0; }
  @keyframes fish-swim-preview {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50%       { transform: translateY(-14px) rotate(2deg); }
  }
  @keyframes bubble-mouth {
    0%   { transform: translateY(0) translateX(0) scale(1);   opacity: 0.85; }
    40%  { opacity: 0.65; }
    100% { transform: translateY(-88px) translateX(var(--bdx)) scale(0.6); opacity: 0; }
  }
  @keyframes happy-jiggle {
    0%,100% { transform: rotate(-5deg) scaleY(0.97); }
    25%     { transform: rotate(0deg)  scaleY(1.03); }
    50%     { transform: rotate(5deg)  scaleY(0.97); }
    75%     { transform: rotate(0deg)  scaleY(1.03); }
  }
  @keyframes sleep-z {
    0%   { transform: translateX(0) translateY(0) scale(0.8); opacity: 0; }
    10%  { opacity: 0.7; }
    100% { transform: translateX(40px) translateY(-80px) scale(1.2); opacity: 0; }
  }
  @keyframes dream-sparkle-out {
    0%   { opacity: 0; transform: translate(0,0) scale(0.4); }
    20%  { opacity: 1; transform: translate(var(--sx), var(--sy)) scale(1.1); }
    100% { opacity: 0; transform: translate(var(--sx2), var(--sy2)) scale(0.3); }
  }
  @keyframes stardust-fade {
    0%   { opacity: 0.85; transform: scale(1) translateY(0); }
    100% { opacity: 0; transform: scale(0.2) translateY(-14px); }
  }
  @keyframes gem-fall {
    0%   { transform: translateY(var(--gem-start-y, -170px)) scale(1.7) rotate(0deg); opacity: 0; filter: brightness(4) saturate(1.8); }
    12%  { opacity: 1; transform: translateY(var(--gem-start-y, -170px)) scale(1.7) rotate(-4deg); filter: brightness(2.5); }
    38%  { transform: translateY(var(--gem-start-y, -170px)) scale(1.0) rotate(2deg); filter: brightness(1.3); }
    78%  { transform: translateY(0px) scale(1.02) rotate(var(--gem-tilt)); filter: brightness(1.1); }
    90%  { transform: translateY(-5px) scale(0.97) rotate(var(--gem-tilt)); }
    100% { transform: translateY(0px) scale(1) rotate(var(--gem-tilt)); opacity: 1; filter: brightness(1) drop-shadow(0 3px 10px rgba(160,140,255,0.5)); }
  }
  @keyframes gem-settled-pulse {
    0%,100% { filter: drop-shadow(0 2px 6px rgba(160,140,255,0.4)) brightness(1); }
    50%      { filter: drop-shadow(0 2px 14px rgba(180,160,255,0.75)) brightness(1.15); }
  }
  @keyframes gem-drop-to-floor {
    0%   { transform: translateY(var(--gem-drop-from)) rotate(var(--gem-tilt)); }
    15%  { transform: translateY(calc(var(--gem-drop-from) * 0.85)) rotate(var(--gem-tilt)); }
    72%  { transform: translateY(0px) scale(1.04) rotate(var(--gem-tilt)); }
    84%  { transform: translateY(-7px) scale(0.96) rotate(var(--gem-tilt)); }
    100% { transform: translateY(0px) scale(1) rotate(var(--gem-tilt)); filter: drop-shadow(0 3px 10px rgba(160,140,255,0.5)); }
  }
  @keyframes preview-sparkle {
    0%, 100% { opacity: 0.2; transform: translate(-50%,-50%) scale(0.5); }
    50%       { opacity: 1;   transform: translate(-50%,-50%) scale(1.15); }
  }
  @keyframes unfold-flash {
    0%   { opacity: 1; filter: brightness(1); transform: scale(1); }
    20%  { opacity: 1; filter: brightness(5) saturate(3); transform: scale(1.4); }
    55%  { opacity: 0.5; filter: brightness(2); transform: scale(1.1); }
    100% { opacity: 0; filter: brightness(0); transform: scale(0.05); }
  }
  @keyframes sparkle-fall {
    0%   { opacity: 1; transform: translate(0,0) scale(1) rotate(0deg); }
    15%  { opacity: 1; transform: translate(var(--sfx), calc(var(--sfy) * 0.1)) scale(1.2) rotate(var(--sfr)); }
    60%  { opacity: 0.85; }
    100% { opacity: 0; transform: translate(var(--sfx), var(--sfy)) scale(0.3) rotate(calc(var(--sfr) * 3)); }
  }
`;

const TANKS_STORAGE_KEY = 'finlings_tanks';
const TANK_ENTRIES_PREFIX = 'finlings_entries_';
const TANK_GEMS_PREFIX = 'finlings_gems_';

export interface Gem { id: string; emotionId: string; xPct: number; thoughts?: string; date?: string; fishYPct?: number; }

function loadGems(tankId: string): Gem[] {
  try { return JSON.parse(localStorage.getItem(TANK_GEMS_PREFIX + tankId) || '[]'); } catch { return []; }
}
function saveGems(tankId: string, gems: Gem[]) {
  try { localStorage.setItem(TANK_GEMS_PREFIX + tankId, JSON.stringify(gems)); } catch {}
}

function loadTanks(): Tank[] {
  try {
    const raw = localStorage.getItem(TANKS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Tank[];
  } catch {
    return [];
  }
}

function saveTanks(tanks: Tank[]) {
  try {
    localStorage.setItem(TANKS_STORAGE_KEY, JSON.stringify(tanks));
  } catch {}
}

function loadEntries(tankId: string): Entry[] {
  try {
    const raw = localStorage.getItem(TANK_ENTRIES_PREFIX + tankId);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Omit<Entry, 'date'> & { date: string }>;
    return parsed.map(e => ({ ...e, date: new Date(e.date) }));
  } catch {
    return [];
  }
}

function saveEntries(tankId: string, entries: Entry[]) {
  try {
    localStorage.setItem(TANK_ENTRIES_PREFIX + tankId, JSON.stringify(entries));
  } catch {}
}

/* ─── App Loader ─── */
import loaderFishRaw from '../imports/Group_84-1.svg?raw';

const LOADER_STYLES = `
  @keyframes loader-fish-bob {
    0%,100% { transform: translateY(0px) rotate(-2deg); }
    50%      { transform: translateY(-10px) rotate(2deg); }
  }
  @keyframes loader-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes loader-text-pulse {
    0%,100% { opacity: 0.55; letter-spacing: 0.16em; }
    50%      { opacity: 0.95; letter-spacing: 0.22em; }
  }
`;

function AppLoader() {
  const scaledFish = loaderFishRaw
    .replace(/(<svg[^>]*?)\s+width="[^"]*"/, '$1 width="56"')
    .replace(/(<svg[^>]*?)\s+height="[^"]*"/, '$1 height="56"');

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0e0a06',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16,
      zIndex: 9999,
      animation: 'loader-fade-in 0.4s ease',
    }}>
      <style>{LOADER_STYLES}</style>

      <div style={{
        animation: 'loader-fish-bob 2.2s ease-in-out infinite',
        lineHeight: 0,
      }}
      dangerouslySetInnerHTML={{ __html: scaledFish }} />

      <p style={{
        margin: 0,
        fontFamily: "'DM Sans', sans-serif",
        fontStyle: 'normal',
        fontSize: 13,
        fontWeight: 500,
        color: '#d4b878',
        animation: 'loader-text-pulse 2.4s ease-in-out infinite',
        letterSpacing: '0.08em',
        userSelect: 'none',
      }}>
        Just Keep Swimming...
      </p>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tanks, setTanks] = useState<Tank[]>(loadTanks);
  const [currentTank, setCurrentTank] = useState<Tank | null>(null);
  const [showCreateTank, setShowCreateTank] = useState(false);
  const [gems, setGems] = useState<Gem[]>([]);

  // Per-tank state
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<Entry | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeFishId, setActiveFishId] = useState<string | null>(null);
  const [newestEntryId, setNewestEntryId] = useState<string | null>(null);
  const [editingTankName, setEditingTankName] = useState(false);
  const [tankNameDraft, setTankNameDraft] = useState('');

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1400); return () => clearTimeout(t); }, []);

  const aquariumRef = useRef<HTMLDivElement>(null);
  const [tankBounds, setTankBounds] = useState({ w: 800, h: 500 });

  useEffect(() => {
    function measure() {
      if (!aquariumRef.current) return;
      const w = aquariumRef.current.offsetWidth;
      const h = aquariumRef.current.offsetHeight;
      setTankBounds({ w: w - 20, h: h * 0.74 - 20 });
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (aquariumRef.current) ro.observe(aquariumRef.current);
    return () => ro.disconnect();
  }, [currentTank]);

  // Load entries when opening a tank
  function openTank(tank: Tank) {
    setCurrentTank(tank);
    setEntries(loadEntries(tank.id));
    setGems(loadGems(tank.id));
  }

  function goHome() {
    setCurrentTank(null);
    setEntries([]);
    setShowNewEntry(false);
    setShowAllEntries(false);
    setEditingEntry(null);
    setViewingEntry(null);
    setActiveFishId(null);
  }

  function handleCreateTank(data: Omit<Tank, 'id' | 'createdAt'>) {
    const tank: Tank = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...tanks, tank];
    setTanks(updated);
    saveTanks(updated);
    openTank(tank);
  }

  // Persist entries whenever they change
  useEffect(() => {
    if (currentTank) {
      saveEntries(currentTank.id, entries);
    }
  }, [entries, currentTank]);

  const handleAddEntry = useCallback((data: Omit<Entry, 'id'>) => {
    const id = generateId();
    setEntries(prev => [...prev, { ...data, id }]);
    setNewestEntryId(id);
    setTimeout(() => setNewestEntryId(null), 2500);
  }, []);

  const handleEditEntry = useCallback((updated: Entry) => {
    setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
    setViewingEntry(null);
  }, []);

  const handleDeleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    setViewingEntry(null);
  }, []);

  const handleGemMove = useCallback((id: string, newXPct: number) => {
    if (!currentTank) return;
    setGems(prev => {
      const next = prev.map(g => g.id === id ? { ...g, xPct: newXPct } : g);
      saveGems(currentTank.id, next);
      return next;
    });
  }, [currentTank]);

  const handleUnfold = useCallback((entry: Entry, xPct?: number, fishYPct?: number) => {
    if (!currentTank) return;
    setEntries(prev => prev.filter(e => e.id !== entry.id));
    setViewingEntry(null);
    setActiveFishId(null);
    const gem: Gem = {
      id: entry.id,
      emotionId: entry.emotionId,
      xPct: xPct ?? 40 + Math.random() * 20,
      thoughts: entry.thoughts,
      date: entry.date.toISOString(),
      fishYPct,
    };
    setGems(prev => {
      const next = [...prev, gem];
      saveGems(currentTank.id, next);
      return next;
    });
  }, [currentTank]);

  const handleViewEntry = useCallback((entry: Entry) => {
    setShowAllEntries(false);
    setViewingEntry(entry);
  }, []);

  if (loading) return <AppLoader />;

  // ── Home Page ──
  if (!currentTank) {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#e2d5b5' }}>
        <div style={{
          width: 'calc(100vw / 1.16)',
          height: 'calc(100vh / 1.16)',
          transform: 'scale(1.16)',
          transformOrigin: 'top left',
        }}>
          <style>{GLOBAL_STYLES}</style>
          <HomePage
            tanks={tanks}
            onOpenTank={openTank}
            onCreateTank={() => setShowCreateTank(true)}
            onRefresh={() => setTanks(loadTanks())}
            onRenameTank={(id, newName) => {
              setTanks(prev => {
                const next = prev.map(t => t.id === id ? { ...t, name: newName } : t);
                saveTanks(next);
                return next;
              });
            }}
            onDeleteTank={(id) => {
              setTanks(prev => {
                const next = prev.filter(t => t.id !== id);
                saveTanks(next);
                return next;
              });
              try { localStorage.removeItem('finlings_entries_' + id); } catch {}
            }}
          />
          {showCreateTank && (
            <CreateTankModal
              onClose={() => setShowCreateTank(false)}
              onCreate={handleCreateTank}
            />
          )}
        </div>
      </div>
    );
  }

  // ── Tank View (Journal) ──
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#0e0a06' }}>
    <div style={{
      width: 'calc(100vw / 1.16)',
      height: 'calc(100vh / 1.16)',
      transform: 'scale(1.16)',
      transformOrigin: 'top left',
      display: 'flex',
      flexDirection: 'column',
      background: '#0e0a06',
      fontFamily: "'DM Sans', -apple-system, sans-serif",
    }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── Header ── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '14px 22px',
        background: '#140c04',
        flexShrink: 0,
        gap: 12,
        position: 'relative',
      }}>
        {/* Home icon */}
        <button
          onClick={goHome}
          title="Back to Home"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 34, height: 34,
            background: 'transparent',
            border: '1.5px solid #3a2a10',
            borderRadius: 7,
            color: '#b09060',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,168,83,0.1)'; e.currentTarget.style.color = '#e8d090'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#b09060'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
            <path d="M9 21V12h6v9"/>
          </svg>
        </button>

        <div
          style={{ lineHeight: 0, flexShrink: 0 }}
          dangerouslySetInnerHTML={{
            __html: logoRaw
              .replace(/width="[^"]*"/, 'width="150"')
              .replace(/height="[^"]*"/, 'height="44"'),
          }}
        />

        {/* Tank name — center */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}>
          {/* Type label: icon left of type name, row together, centered above tank name */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: currentTank.type === 'dreams' ? '#8a6aca' : '#7a8850',
            opacity: 0.85,
          }}>
            {currentTank.type === 'dreams' ? (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            )}
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              {currentTank.type === 'dreams' ? 'Dreams' : 'Journal'}
            </span>
          </div>

          {/* Name + edit button row */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {editingTankName ? (
            <input
              autoFocus
              value={tankNameDraft}
              onChange={e => setTankNameDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const trimmed = tankNameDraft.trim();
                  if (trimmed) {
                    const updated = { ...currentTank, name: trimmed };
                    setCurrentTank(updated);
                    setTanks(prev => {
                      const next = prev.map(t => t.id === updated.id ? updated : t);
                      saveTanks(next);
                      return next;
                    });
                  }
                  setEditingTankName(false);
                }
                if (e.key === 'Escape') setEditingTankName(false);
              }}
              onBlur={() => {
                const trimmed = tankNameDraft.trim();
                if (trimmed) {
                  const updated = { ...currentTank, name: trimmed };
                  setCurrentTank(updated);
                  setTanks(prev => {
                    const next = prev.map(t => t.id === updated.id ? updated : t);
                    saveTanks(next);
                    return next;
                  });
                }
                setEditingTankName(false);
              }}
              style={{
                background: 'transparent',
                borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                borderBottom: '1.5px solid #c8a860',
                color: '#c8a860',
                fontFamily: "'Lora', serif",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: '0.06em',
                outline: 'none',
                textAlign: 'center',
                width: Math.max(120, tankNameDraft.length * 9),
                padding: '0 2px',
              }}
            />
          ) : (
            <span style={{
              color: '#c8a860',
              fontFamily: "'Lora', serif",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
            }}>
              {currentTank.name}
            </span>
          )}
          {!editingTankName && (
            <button
              onClick={() => { setTankNameDraft(currentTank.name); setEditingTankName(true); }}
              title="Rename tank"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 20, height: 20,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#7a6030',
                padding: 0,
                flexShrink: 0,
                transition: 'color 0.15s',
                position: 'absolute',
                left: 'calc(100% + 3px)',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#c8a860'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#7a6030'; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}
          </div>{/* end name+edit row */}
        </div>{/* end center row */}

        <div style={{ flex: 1 }} />

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(prev => !prev)}
          style={{
            padding: '0 12px',
            background: 'transparent',
            border: '1.5px solid #3a2a10',
            borderRadius: 7,
            color: '#e8d090',
            cursor: 'pointer',
            fontSize: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 36,
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,168,83,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        <button
          onClick={() => setShowAllEntries(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '0 14px',
            background: 'transparent',
            border: '1.5px solid #3a2a10',
            borderRadius: 7,
            color: '#b09060',
            cursor: 'pointer',
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            height: 36,
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,168,83,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          {/* Stack icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          My Entries
          {entries.length > 0 && (
            <span style={{
              background: '#3a2a10', color: '#e8d090',
              borderRadius: 20, padding: '1px 7px',
              fontSize: 11, fontWeight: 600,
            }}>
              {entries.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowNewEntry(true)}
          style={{
            padding: '0 18px',
            background: 'linear-gradient(135deg, #c9843a 0%, #e0a548 100%)',
            border: '2px solid #a06828',
            borderRadius: 7,
            color: '#fdf6e8',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Lora', serif",
            boxShadow: '2px 2px 0 #7a4810',
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            lineHeight: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.07)'; }}
          onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
        >
          + New Entry
        </button>
      </header>

      {/* ── Aquarium ── */}
      <div style={{ flex: 1, padding: '14px', boxSizing: 'border-box' }}>
        <Aquarium
          containerRef={aquariumRef}
          isDarkMode={isDarkMode}
          entries={entries}
          tankType={currentTank.type}
          initialTheme={currentTank.aquariumTheme}
          gems={gems}
          onGemMove={handleGemMove}
          onThemeChange={(theme) => {
            const updated = { ...currentTank, aquariumTheme: theme };
            setCurrentTank(updated);
            setTanks(prev => {
              const next = prev.map(t => t.id === updated.id ? updated : t);
              saveTanks(next);
              return next;
            });
          }}
        >
          {entries.length === 0 && gems.length === 0 && (
            <div style={{
              background: 'rgba(20,10,2,0.72)',
              border: '1px solid rgba(255,220,150,0.25)',
              borderRadius: 16,
              padding: '24px 36px',
              textAlign: 'center',
              boxShadow: '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,220,150,0.15)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}>
              <div style={{ fontSize: 28 }}>🐟</div>
              <p style={{ fontSize: 15, color: '#fdf0d0', margin: 0, fontFamily: "'Lora', serif", fontStyle: 'italic', fontWeight: 700 }}>
                Your tank feels empty
              </p>
              <p style={{ fontSize: 12, color: '#e8c888', margin: 0, fontWeight: 500 }}>
                Add your first fish by recording a feeling
              </p>
              <button
                onClick={() => setShowNewEntry(true)}
                style={{
                  marginTop: 12,
                  padding: '11px 24px',
                  background: 'linear-gradient(135deg, #c9843a 0%, #e0a548 100%)',
                  border: '2px solid #a06828',
                  borderRadius: 8,
                  color: '#fdf6e8',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'Lora', serif",
                  boxShadow: '2px 2px 0 #7a4810',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  lineHeight: 1,
                  letterSpacing: '0.03em',
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
              >
                + Add your first entry
              </button>
            </div>
          )}

          {entries.map((entry) => (
            <SwimmingFish
              key={entry.id}
              entry={entry}
              bounds={tankBounds}
              containerRef={aquariumRef}
              onViewDetail={handleViewEntry}
              onEdit={(e) => setEditingEntry(e)}
              onDelete={(id) => { handleDeleteEntry(id); setActiveFishId(null); }}
              onUnfold={handleUnfold}
              isNew={newestEntryId === entry.id}
              isActive={activeFishId === entry.id}
              onActivate={() => setActiveFishId(entry.id)}
              onDeactivate={() => setActiveFishId(null)}
              allEntries={entries}
            />
          ))}
        </Aquarium>
      </div>

      {showNewEntry && <NewEntryModal onClose={() => setShowNewEntry(false)} onGenerate={handleAddEntry} tankType={currentTank.type} />}
      {showAllEntries && (
        <AllEntriesModal
          entries={entries}
          gems={gems}
          onClose={() => setShowAllEntries(false)}
          onEdit={(entry) => { setShowAllEntries(false); setEditingEntry(entry); }}
          onDelete={handleDeleteEntry}
          onView={handleViewEntry}
        />
      )}
      {editingEntry && <EditEntryModal entry={editingEntry} onClose={() => setEditingEntry(null)} onSave={handleEditEntry} tankType={currentTank.type} />}
      {viewingEntry && (
        <EntryDetailModal
          entry={viewingEntry}
          onClose={() => setViewingEntry(null)}
          onEdit={() => { setEditingEntry(viewingEntry); setViewingEntry(null); }}
          onDelete={() => handleDeleteEntry(viewingEntry.id)}
          onUnfold={() => handleUnfold(viewingEntry)}
        />
      )}
    </div>
    </div>
  );
}