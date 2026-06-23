import { useState } from 'react';
import { EMOTIONS, DREAM_ELEMENTS, EMOTION_COLORS, type EmotionId } from './emotions';
import { FishSVG } from './FishSVG';
import type { Entry } from './SwimmingFish';
import { DreamIcon, isDreamElement } from './dreamIcons';
import type { Gem } from '../App';

const OVERLAY: React.CSSProperties = {
  position: 'fixed', inset: 0,
  background: 'rgba(30,12,2,0.78)',
  zIndex: 200,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(3px)',
};

const PAPER_BASE: React.CSSProperties = {
  background: '#f7edd8',
  backgroundImage: [
    'repeating-linear-gradient(transparent 0px, transparent 28px, rgba(160,130,80,0.13) 28px, rgba(160,130,80,0.13) 29px)',
    'linear-gradient(to right, rgba(210,120,100,0.18) 0px, rgba(210,120,100,0.18) 1px, transparent 1px, transparent 46px)',
  ].join(', '),
  borderRadius: 4,
  border: '2px solid #c0a070',
  boxShadow: ['0 24px 64px rgba(30,12,2,0.45)', '4px 4px 0 #b89060', 'inset 0 0 0 1px rgba(255,255,255,0.3)'].join(', '),
};

function BinderClip() {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" style={{ display: 'block' }}>
      <path d="M22 28 C22 14 10 4 18 4 C26 4 24 16 24 28" fill="none" stroke="#6a6a6a" strokeWidth="4" strokeLinecap="round"/>
      <path d="M50 28 C50 14 62 4 54 4 C46 4 48 16 48 28" fill="none" stroke="#6a6a6a" strokeWidth="4" strokeLinecap="round"/>
      <rect x="10" y="26" width="52" height="22" rx="4" fill="#7a7a7a" stroke="#555" strokeWidth="1.5"/>
      <rect x="14" y="30" width="44" height="14" rx="3" fill="#909090"/>
      <rect x="14" y="30" width="44" height="6" rx="2" fill="rgba(255,255,255,0.22)"/>
      <circle cx="23" cy="28" r="3.5" fill="#5a5a5a" stroke="#444" strokeWidth="1"/>
      <circle cx="49" cy="28" r="3.5" fill="#5a5a5a" stroke="#444" strokeWidth="1"/>
      <rect x="10" y="44" width="52" height="4" rx="2" fill="#666"/>
    </svg>
  );
}

/* ─── AllEntriesModal ─── */
interface AllEntriesModalProps {
  entries: Entry[];
  gems?: Gem[];
  onClose: () => void;
  onEdit: (entry: Entry) => void;
  onDelete: (id: string) => void;
  onView: (entry: Entry) => void;
}

export function AllEntriesModal({ entries, gems = [], onClose, onEdit, onDelete, onView }: AllEntriesModalProps) {
  const [search, setSearch] = useState('');

  const filtered = entries.filter(e => {
    const emotion = [...EMOTIONS, ...DREAM_ELEMENTS].find(em => em.id === e.emotionId);
    const q = search.toLowerCase();
    return (
      emotion?.name.toLowerCase().includes(q) ||
      e.thoughts.toLowerCase().includes(q) ||
      e.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase().includes(q)
    );
  });

  const filteredGems = gems.filter(g => {
    const emotion = [...EMOTIONS, ...DREAM_ELEMENTS].find(em => em.id === g.emotionId);
    const q = search.toLowerCase();
    const dateStr = g.date ? new Date(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    return (
      !q ||
      emotion?.name.toLowerCase().includes(q) ||
      (g.thoughts || '').toLowerCase().includes(q) ||
      dateStr.toLowerCase().includes(q)
    );
  });

  return (
    <div style={OVERLAY} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Binder clip */}
        <div style={{ position: 'absolute', top: -34, zIndex: 10, pointerEvents: 'none' }}>
          <BinderClip />
        </div>

        <div style={{
          ...PAPER_BASE,
          width: 'min(94vw, 450px)',
          maxHeight: '82vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Hole punches */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 170, paddingTop: 8, pointerEvents: 'none', flexShrink: 0 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(160,120,70,0.25)', border: '1px solid rgba(160,120,70,0.35)' }}/>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(160,120,70,0.25)', border: '1px solid rgba(160,120,70,0.35)' }}/>
          </div>

          {/* Header */}
          <div style={{ padding: '10px 24px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{
                flex: 1, margin: 0, color: '#3a2008',
                fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 700,
              }}>My Entries</h2>
              <span style={{
                fontSize: 11, color: '#9a7040', marginRight: 10,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {entries.length} {entries.length === 1 ? 'fish' : 'fishes'}{gems.length > 0 ? ` · ${gems.length} crystallized` : ''}
              </span>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(160,100,50,0.1)', border: '1.5px solid #c0a070',
                  borderRadius: '50%', width: 28, height: 28,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a5030',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.55)', border: '1.5px solid #c0a070',
              borderRadius: 5, padding: '8px 12px', marginBottom: 14,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a7040" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by feeling, date, or text…"
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: 13, color: '#3a2008', background: 'transparent',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
            </div>
          </div>

          {/* Entry list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
            {filtered.length === 0 && filteredGems.length === 0 ? (
              <div style={{
                textAlign: 'center', color: '#9a7040', padding: '32px 0', fontSize: 14,
                fontFamily: "'Lora', serif", fontStyle: 'italic',
              }}>
                {search ? 'No entries match your search.' : 'No entries yet — start your collection!'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.sort((a, b) => b.date.getTime() - a.date.getTime()).map((entry) => (
                  <EntryListItem
                    key={entry.id} entry={entry}
                    onView={() => onView(entry)}
                    onEdit={() => onEdit(entry)}
                    onDelete={() => onDelete(entry.id)}
                  />
                ))}
              </div>
            )}

            {/* Unfolded section */}
            {filteredGems.length > 0 && (
              <div style={{ marginTop: filtered.length > 0 ? 22 : 0 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(160,120,70,0.25)' }} />
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.10em',
                    textTransform: 'uppercase', color: '#8a6040',
                    fontFamily: "'DM Sans', sans-serif",
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ color: '#a070c0', fontSize: 12 }}>✦</span>
                    Crystallized
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(160,120,70,0.25)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filteredGems.slice().reverse().map((gem) => (
                    <GemListItem key={gem.id} gem={gem} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Gem (unfolded) list item ─── */
function GemListItem({ gem }: { gem: Gem }) {
  const emotion = [...EMOTIONS, ...DREAM_ELEMENTS].find(e => e.id === gem.emotionId);
  const dateStr = gem.date
    ? new Date(gem.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(140,80,200,0.08) 0%, rgba(100,60,160,0.06) 100%)',
      border: '1.5px solid rgba(160,100,220,0.35)',
      borderRadius: 5,
      padding: '10px 12px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '1px 1px 0 rgba(160,100,220,0.20)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(160,100,220,0.18) 0%, rgba(120,70,180,0.12) 100%)',
        border: '1.5px solid rgba(160,100,220,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, flexShrink: 0, color: '#7848a8',
      }}>
        <span style={{ color: '#a070d0', fontSize: 14 }}>✦</span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 7, alignItems: 'baseline', marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#5a3080', fontFamily: "'DM Sans', sans-serif" }}>
            {emotion?.name ?? gem.emotionId}
          </span>
          {dateStr && (
            <span style={{ fontSize: 11, color: '#9a7040', fontFamily: "'DM Sans', sans-serif" }}>{dateStr}</span>
          )}
        </div>
        <p style={{
          fontSize: 12, color: '#7848a8', margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          fontFamily: "'Lora', serif", fontStyle: 'italic',
        }}>
          {gem.thoughts || <span style={{ color: '#b090d0' }}>Crystallized into a gem</span>}
        </p>
      </div>

      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: '#9060c0',
        fontFamily: "'DM Sans', sans-serif",
        background: 'rgba(140,80,200,0.10)',
        border: '1px solid rgba(140,80,200,0.30)',
        borderRadius: 4, padding: '2px 7px', flexShrink: 0,
      }}>
        gem
      </span>
    </div>
  );
}

/* ─── Entry list item ─── */
function EntryListItem({ entry, onView, onEdit, onDelete }: {
  entry: Entry; onView: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const emotion = [...EMOTIONS, ...DREAM_ELEMENTS].find(e => e.id === entry.emotionId)!;
  const dateStr = entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{
      background: 'rgba(255,255,255,0.5)',
      border: '1.5px solid #c8aa78',
      borderRadius: 5,
      padding: '10px 12px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '1px 1px 0 #c0a070',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(201,132,58,0.12)',
        border: '1.5px solid #c8aa78',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0, color: '#6a4a28',
      }}>
        {isDreamElement(entry.emotionId) ? <DreamIcon id={entry.emotionId} size={18} /> : emotion.emoji}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 7, alignItems: 'baseline', marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#3a2008', fontFamily: "'DM Sans', sans-serif" }}>{emotion.name}</span>
          <span style={{ fontSize: 11, color: '#9a7040', fontFamily: "'DM Sans', sans-serif" }}>{dateStr}</span>
        </div>
        <p style={{ fontSize: 12, color: '#6a4a28', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
          {entry.thoughts || <span style={{ color: '#b09060' }}>No thoughts recorded</span>}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
        <button onClick={onView} title="View" style={{
          background: 'none', border: '1.5px solid #c0a070', borderRadius: 5,
          width: 28, height: 28, cursor: 'pointer', color: '#7a5030',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowMenu(!showMenu)} title="More" style={{
            background: 'none', border: '1.5px solid #c0a070', borderRadius: 5,
            width: 28, height: 28, cursor: 'pointer', color: '#7a5030',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
          {showMenu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setShowMenu(false)}/>
              <div style={{
                position: 'absolute', right: 0, top: 32, zIndex: 100,
                background: '#f7edd8', borderRadius: 5,
                boxShadow: '0 4px 20px rgba(40,20,5,0.2), 2px 2px 0 #c0a070',
                border: '1.5px solid #c0a070', overflow: 'hidden', minWidth: 110,
              }}>
                <button onClick={() => { setShowMenu(false); onEdit(); }} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '9px 13px', border: 'none',
                  background: 'none', cursor: 'pointer', fontSize: 13, color: '#3a2008',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button onClick={() => { setShowMenu(false); onDelete(); }} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '9px 13px', border: 'none',
                  background: 'none', cursor: 'pointer', fontSize: 13, color: '#c04030',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── EntryDetailModal ─── */
interface EntryDetailModalProps {
  entry: Entry;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUnfold?: () => void;
}

export function EntryDetailModal({ entry, onClose, onEdit, onDelete, onUnfold }: EntryDetailModalProps) {
  const emotion = [...EMOTIONS, ...DREAM_ELEMENTS].find(e => e.id === entry.emotionId)!;
  const color = EMOTION_COLORS[entry.emotionId];
  const dateStr = entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ ...OVERLAY, zIndex: 210 }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: -34, zIndex: 10, pointerEvents: 'none' }}>
          <BinderClip />
        </div>

        <div style={{ ...PAPER_BASE, width: 'min(94vw, 420px)', overflow: 'hidden' }}>
          {/* Hole punches */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 160, paddingTop: 8, pointerEvents: 'none' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(160,120,70,0.25)', border: '1px solid rgba(160,120,70,0.35)' }}/>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(160,120,70,0.25)', border: '1px solid rgba(160,120,70,0.35)' }}/>
          </div>

          {/* Header */}
          <div style={{ padding: '10px 18px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'rgba(201,132,58,0.12)', border: '2px solid #c0a070',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0, color: '#5a3e24',
            }}>
              {isDreamElement(entry.emotionId) ? <DreamIcon id={entry.emotionId} size={22} /> : emotion.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#3a2008', fontFamily: "'DM Sans', sans-serif" }}>{emotion.name}</div>
              <div style={{ fontSize: 11, color: '#9a7040', fontFamily: "'DM Sans', sans-serif" }}>{dateStr}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={onEdit} title="Edit" style={{
                background: 'rgba(255,255,255,0.5)', border: '1.5px solid #c0a070', borderRadius: 5,
                width: 30, height: 30, cursor: 'pointer', color: '#7a5030',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              {onUnfold && isDreamElement(entry.emotionId) && (
                <button onClick={onUnfold} title="Crystallize into gem" style={{
                  background: 'linear-gradient(135deg, #8060c0 0%, #a080d8 100%)',
                  border: '2px solid #6040a0', borderRadius: 5,
                  padding: '0 10px', height: 30, cursor: 'pointer', color: '#fdf6e8',
                  fontSize: 11, fontWeight: 700, fontFamily: "'Lora', serif",
                  display: 'flex', alignItems: 'center', gap: 4,
                  transition: 'filter 0.15s',
                  boxShadow: '2px 2px 0 #503080',
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3L8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg> Crystallize
                </button>
              )}
              <button onClick={onDelete} title="Delete" style={{
                background: 'rgba(255,255,255,0.5)', border: '1.5px solid #f0a090', borderRadius: 5,
                width: 30, height: 30, cursor: 'pointer', color: '#c04030',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
              <button onClick={onClose} title="Close" style={{
                background: 'rgba(160,100,50,0.1)', border: '1.5px solid #c0a070', borderRadius: 5,
                width: 30, height: 30, cursor: 'pointer', color: '#7a5030',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Fish display */}
          <div style={{
            margin: '0 18px',
            background: `linear-gradient(135deg, ${color}18, ${color}30)`,
            border: '2px solid #c0a070',
            borderRadius: 4, minHeight: 130,
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            position: 'relative',
            backgroundImage: `linear-gradient(135deg, ${color}18, ${color}30), repeating-linear-gradient(transparent 0px, transparent 28px, rgba(255,255,255,0.12) 28px, rgba(255,255,255,0.12) 29px)`,
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.2) 0%, transparent 60%)', pointerEvents: 'none' }}/>
            <div style={{ animation: 'fish-swim-preview 2.5s ease-in-out infinite' }}>
              <FishSVG emotionId={entry.emotionId} width={135} />
            </div>
          </div>

          {/* Thoughts */}
          <div style={{ padding: '14px 18px 20px' }}>
            {entry.thoughts ? (
              <p style={{ fontSize: 14, color: '#4a2e10', margin: 0, lineHeight: 1.75, fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
                "{entry.thoughts}"
              </p>
            ) : (
              <p style={{ fontSize: 13, color: '#a08050', margin: 0, fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
                No thoughts recorded for this entry.
              </p>
            )}
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, opacity: 0.7 }}/>
              <span style={{ fontSize: 11, color: '#9a7040', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Feeling {emotion.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}