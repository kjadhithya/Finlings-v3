import { useState, useRef, useCallback } from 'react';
import { Aquarium, type AquariumTheme } from './Aquarium';
import logoRaw from '../../imports/pasted_text/logo-4.svg?raw';
import { PRIMARY_BTN, PRIMARY_BTN_DISABLED, SECONDARY_BTN, DANGER_BTN } from './buttonStyles';

export type TankType = 'journal' | 'dreams';

export interface Tank {
  id: string;
  name: string;
  type: TankType;
  createdAt: string;
  aquariumTheme?: AquariumTheme;
}

/* ─── Aquarium thumbnail sizing ─── */
const SRC_W = 700;
const SRC_H = 430;
const THUMB_W = 220;
const THUMB_H = Math.round(THUMB_W * SRC_H / SRC_W); // ≈ 135
const SCALE = THUMB_W / SRC_W;

/* ─── Shared overlay ─── */
const OVERLAY: React.CSSProperties = {
  position: 'fixed', inset: 0,
  background: 'rgba(30,12,2,0.78)',
  zIndex: 200,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(3px)',
};

/* ─── Shared paper styles (matches NewEntryModal exactly) ─── */
const PAPER: React.CSSProperties = {
  background: '#f7edd8',
  backgroundImage: [
    'repeating-linear-gradient(transparent 0px, transparent 28px, rgba(160,130,80,0.13) 28px, rgba(160,130,80,0.13) 29px)',
    'linear-gradient(to right, rgba(210,120,100,0.18) 0px, rgba(210,120,100,0.18) 1px, transparent 1px, transparent 46px)',
  ].join(', '),
  borderRadius: 4,
  border: '2px solid #c0a070',
  boxShadow: [
    '0 24px 64px rgba(30,12,2,0.45)',
    '4px 4px 0 #b89060',
    'inset 0 0 0 1px rgba(255,255,255,0.3)',
  ].join(', '),
  position: 'relative',
  width: 'min(94vw, 460px)',
  maxHeight: '88vh',
  overflowY: 'auto',
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#7a5030',
  fontFamily: "'DM Sans', sans-serif",
  marginBottom: 8,
};

/* ─── Binder clip (same as modals) ─── */
function BinderClip({ scale = 1 }: { scale?: number }) {
  const w = 72 * scale;
  const h = 56 * scale;
  return (
    <svg width={w} height={h} viewBox="0 0 72 56" style={{ display: 'block' }}>
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

/* ─── Hole punches row ─── */
function HolePunches({ gap = 160 }: { gap?: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap, paddingTop: 8, marginBottom: -4, pointerEvents: 'none' }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(160,120,70,0.25)', border: '1px solid rgba(160,120,70,0.35)' }}/>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(160,120,70,0.25)', border: '1px solid rgba(160,120,70,0.35)' }}/>
    </div>
  );
}

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      position: 'absolute', top: 16, right: 16,
      background: 'rgba(160,100,50,0.12)',
      border: '1.5px solid #c0a070',
      borderRadius: '50%', width: 28, height: 28,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#7a5030',
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  );
}

/* ─── Tank type icon components ─── */
function JournalIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="9" y1="7" x2="15" y2="7"/>
      <line x1="9" y1="11" x2="15" y2="11"/>
      <line x1="9" y1="15" x2="13" y2="15"/>
    </svg>
  );
}

function DreamsIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

const TANK_TYPES: { value: TankType; label: string; description: string }[] = [
  { value: 'dreams',  label: 'Dreams',  description: 'Collect dreams that visit you.'  },
  { value: 'journal', label: 'Journal', description: 'A living record of your days.'   },
];

/* ─── Create Tank Modal ─── */
export function CreateTankModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (data: Omit<Tank, 'id' | 'createdAt'>) => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<TankType>('dreams');

  function handleCreate() {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), type });
    onClose();
  }

  return (
    <div style={OVERLAY} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: -34, zIndex: 10, pointerEvents: 'none' }}>
          <BinderClip />
        </div>
        <div style={PAPER}>
          <HolePunches gap={180} />
          <CloseBtn onClick={onClose} />
          <div style={{ padding: '18px 32px 30px' }}>
            <h2 style={{ margin: '0 0 20px', fontFamily: "'Lora', serif", fontSize: 21, fontWeight: 700, color: '#3a2008', letterSpacing: '0.01em' }}>
              New Tank
            </h2>
            <div style={{ marginBottom: 22 }}>
              <div style={SECTION_LABEL}>Tank Name</div>
              <input
                autoFocus value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="e.g. Notes to Self, Little Things…"
                style={{
                  width: '100%', padding: '10px 12px',
                  background: 'rgba(255,255,255,0.55)',
                  border: '2px solid #c0a070', borderRadius: 4,
                  color: '#3a2008', fontSize: 14, fontFamily: "'Lora', serif",
                  outline: 'none', boxSizing: 'border-box',
                  boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.5)',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#a06828'; e.currentTarget.style.background = 'rgba(255,255,255,0.75)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#c0a070'; e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; }}
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <div style={SECTION_LABEL}>Tank Type</div>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                {TANK_TYPES.map(opt => {
                  const selected = type === opt.value;
                  const iconColor = selected ? '#3a2008' : '#6a5030';
                  return (
                    <button key={opt.value} onClick={() => setType(opt.value)} style={{
                      flex: 1, padding: '12px 14px',
                      background: selected ? 'rgba(160,100,40,0.12)' : 'rgba(255,255,255,0.35)',
                      border: `2px solid ${selected ? '#a06828' : '#c0a070'}`,
                      borderRadius: 4, cursor: 'pointer', textAlign: 'center',
                      transition: 'all 0.15s',
                      boxShadow: selected ? '2px 2px 0 #b89060' : 'none',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {opt.value === 'journal' ? <JournalIcon color={iconColor} /> : <DreamsIcon color={iconColor} />}
                        <span style={{ fontFamily: "'Lora', serif", fontSize: 14, fontWeight: 700, color: iconColor }}>
                          {opt.label}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 10.5,
                        color: selected ? '#6a4820' : '#8a6840',

                        lineHeight: 1.35,
                      }}>
                        {opt.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={SECONDARY_BTN}>Cancel</button>
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                style={name.trim() ? PRIMARY_BTN : PRIMARY_BTN_DISABLED}
                onMouseEnter={e => { if (name.trim()) e.currentTarget.style.filter = 'brightness(1.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
              >Create Tank</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tank actions popup ─── */
function TankActionsPopup({ tank, onRename, onDelete, onClose }: {
  tank: Tank;
  onRename: (newName: string) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [nameDraft, setNameDraft] = useState(tank.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function submitRename() {
    const t = nameDraft.trim();
    if (t && t !== tank.name) onRename(t);
    else onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,12,2,0.70)', backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: -34, zIndex: 10, pointerEvents: 'none' }}><BinderClip /></div>
        <div style={{
          background: '#f7edd8',
          backgroundImage: 'repeating-linear-gradient(transparent 0px, transparent 28px, rgba(160,130,80,0.13) 28px, rgba(160,130,80,0.13) 29px)',
          borderRadius: 4, border: '2px solid #c0a070',
          boxShadow: '0 24px 64px rgba(30,12,2,0.45), 4px 4px 0 #b89060, inset 0 0 0 1px rgba(255,255,255,0.3)',
          width: 'min(90vw, 360px)', position: 'relative', padding: '22px 28px 26px',
        }}>
          <HolePunches gap={140} />
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(160,100,50,0.12)', border: '1.5px solid #c0a070', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a5030' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          {!confirmDelete ? (
            <>
              <p style={{ margin: '0 0 14px', fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 700, color: '#3a2008' }}>Edit Tank</p>
              <p style={{ margin: '0 0 6px', fontFamily: "'Lora', serif", fontSize: 11, fontWeight: 700, color: '#7a5030', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tank Name</p>
              <input autoFocus value={nameDraft} onChange={e => setNameDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') submitRename(); if (e.key === 'Escape') onClose(); }}
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 11px', background: 'rgba(255,255,255,0.55)', border: '2px solid #c0a070', borderRadius: 4, color: '#3a2008', fontSize: 14, fontFamily: "'Lora', serif", outline: 'none', marginBottom: 18, boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.5)' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#a06828'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#c0a070'; }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => setConfirmDelete(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#b05030', fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: '0.04em', padding: '4px 0', textDecoration: 'underline', textDecorationColor: 'rgba(176,80,48,0.4)' }}>Delete Tank</button>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={onClose} style={{ ...SECONDARY_BTN, padding: '8px 14px', fontSize: 12 }}>Cancel</button>
                  <button
                    onClick={submitRename}
                    disabled={!nameDraft.trim()}
                    style={nameDraft.trim() ? { ...PRIMARY_BTN, padding: '8px 16px', fontSize: 12 } : { ...PRIMARY_BTN_DISABLED, padding: '8px 16px', fontSize: 12 }}
                    onMouseEnter={e => { if (nameDraft.trim()) e.currentTarget.style.filter = 'brightness(1.07)'; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
                  >Save</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p style={{ margin: '0 0 8px', fontFamily: "'Lora', serif", fontSize: 16, fontWeight: 700, color: '#3a2008' }}>Delete "{tank.name}"?</p>
              <p style={{ margin: '0 0 20px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#7a5030' }}>This will permanently remove the tank and all its entries. This can't be undone.</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setConfirmDelete(false)} style={{ ...SECONDARY_BTN, padding: '8px 14px', fontSize: 12 }}>Cancel</button>
                <button
                  onClick={onDelete}
                  style={{ ...DANGER_BTN, padding: '8px 16px', fontSize: 12 }}
                  onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
                >Yes, Delete</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Washi tape decoration ─── */
function WashiTape({ color = 'rgba(201,132,58,0.28)', angle = -2, width = 80 }: { color?: string; angle?: number; width?: number }) {
  return (
    <div style={{
      position: 'absolute',
      top: -10,
      left: '50%',
      transform: `translateX(-50%) rotate(${angle}deg)`,
      width,
      height: 20,
      backgroundColor: color,
      border: '1px solid rgba(180,120,40,0.2)',
      borderRadius: 2,
      pointerEvents: 'none',
      zIndex: 10,
      backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(255,255,255,0.12) 6px, rgba(255,255,255,0.12) 7px)',
    }}/>
  );
}

/* ─── Type badge stamp ─── */
function TypeStamp({ type }: { type: TankType }) {
  const isJournal = type === 'journal';
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 8px',
      background: isJournal ? 'rgba(201,132,58,0.14)' : 'rgba(80,110,180,0.10)',
      border: `1.5px solid ${isJournal ? 'rgba(160,100,30,0.45)' : 'rgba(60,85,160,0.55)'}`,
      borderRadius: 20,
      boxShadow: 'none',
    }}>
      {isJournal ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7a5020" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2d4080" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 9, fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: isJournal ? '#7a5020' : '#2d4080',
      }}>
        {isJournal ? 'Journal' : 'Dreams'}
      </span>
    </div>
  );
}

/* ─── Single tank card ─── */
function TankCard({ tank, index, onClick, onRename, onDelete }: {
  tank: Tank;
  index: number;
  onClick: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
}) {
  const dummyRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const tapeColors = [
    'rgba(201,132,58,0.32)',
    'rgba(100,160,120,0.32)',
    'rgba(160,100,200,0.28)',
    'rgba(200,100,100,0.28)',
    'rgba(80,140,200,0.28)',
  ];
  const tapeColor = tapeColors[index % tapeColors.length];
  const tapeAngle = ((index * 17 + 7) % 9) - 4; // -4 to +4 degrees

  return (
    <>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Washi tape at top */}
        <WashiTape color={tapeColor} angle={tapeAngle} width={72} />

        {/* Card */}
        <div
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: THUMB_W + 32,
            backgroundColor: '#f8f2e4',
            border: `2px solid ${hovered ? '#b08040' : '#d4b878'}`,
            borderRadius: 12,
            boxShadow: hovered
              ? '6px 6px 0 rgba(100,65,15,0.45), 0 8px 24px rgba(80,50,10,0.14)'
              : '3px 3px 0 rgba(120,85,20,0.28), 0 4px 12px rgba(80,50,10,0.07)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            transform: hovered ? 'translateY(-4px) rotate(0deg)' : `rotate(${((index * 13 + 3) % 5) - 2}deg)`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Edit button — only visible on hover */}
          <button
            onClick={e => { e.stopPropagation(); setShowActions(true); }}
            title="Edit tank"
            style={{
              position: 'absolute', top: 8, right: 8, zIndex: 20,
              width: 28, height: 28,
              background: 'rgba(248,242,228,0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(160,104,40,0.45)',
              borderRadius: 7, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#7a5020',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.18s, background 0.15s, border-color 0.15s',
              padding: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,104,40,0.10)'; e.currentTarget.style.borderColor = '#a06828'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,242,228,0.92)'; e.currentTarget.style.borderColor = 'rgba(160,104,40,0.45)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>

          {/* Aquarium thumbnail */}
          <div style={{
            margin: '14px 12px 0',
            border: '2px solid #d4b878',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: 'inset 0 0 0 1px rgba(160,120,60,0.06)',
            position: 'relative',
            width: THUMB_W,
            height: THUMB_H,
          }}>
            <div style={{
              width: SRC_W, height: SRC_H,
              transform: `scale(${SCALE})`,
              transformOrigin: 'top left',
              pointerEvents: 'none',
            }}>
              <Aquarium containerRef={dummyRef} isDarkMode={false} entries={[]} tankType={tank.type} showThemeSelector={false} initialTheme={tank.aquariumTheme}>
              </Aquarium>
            </div>
            {/* Glass shine */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 45%)',
              borderRadius: 8,
              pointerEvents: 'none',
            }}/>
          </div>

          {/* Card body */}
          <div style={{ padding: '12px 14px 14px' }}>
            {/* Tank name */}
            <div style={{
              fontFamily: "'Lora', serif",
              fontSize: 14, fontWeight: 700,
              color: '#5a3a10',
              letterSpacing: '0.02em',
              marginBottom: 6,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {tank.name}
            </div>

            {/* Type stamp + date */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <TypeStamp type={tank.type} />
              <span style={{
                fontFamily: "'Lora', serif",
                fontSize: 11, fontStyle: 'italic',
                color: '#8a6030',
                flexShrink: 0,
              }}>
                {new Date(tank.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Hover glow */}
          {hovered && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 12,
              background: 'radial-gradient(ellipse at 50% 0%, rgba(160,104,40,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}/>
          )}
        </div>
      </div>

      {showActions && (
        <TankActionsPopup
          tank={tank}
          onRename={name => { onRename(name); setShowActions(false); }}
          onDelete={() => { onDelete(); setShowActions(false); }}
          onClose={() => setShowActions(false)}
        />
      )}
    </>
  );
}

/* ─── Add new tank button — horizontal bar ─── */
function AddNewCard({ onClick, label = 'Add New Tank' }: { onClick: () => void; label?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        maxWidth: 260,
        padding: '14px 20px',
        border: `2px dashed ${hovered ? '#a06828' : 'rgba(140,100,40,0.32)'}`,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        gap: 10, cursor: 'pointer',
        background: hovered ? 'rgba(160,100,35,0.10)' : 'transparent',
        boxShadow: hovered ? '4px 4px 0 rgba(100,65,15,0.35)' : 'none',
        transition: 'all 0.18s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxSizing: 'border-box',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke={hovered ? '#5a3a10' : '#8a6530'} strokeWidth="2.5" strokeLinecap="round"
        style={{ transition: 'stroke 0.18s', flexShrink: 0 }}>
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      <span style={{
        fontFamily: "'Lora', serif",
        fontSize: 13, fontWeight: 700,
        color: hovered ? '#5a3a10' : '#8a6530',
        letterSpacing: '0.04em',
        transition: 'color 0.18s',
      }}>{label}</span>
    </div>
  );
}

/* ─── Paper Boat floating on wave ─── */
function PaperBoat() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 72,
      right: '12%',
      zIndex: 2,
      pointerEvents: 'none',
      animation: 'boat-rock 5s ease-in-out infinite',
      transformOrigin: 'bottom center',
    }}>
      <svg width="54" height="37" viewBox="0 0 64 44" xmlns="http://www.w3.org/2000/svg">
        {/* Hull */}
        <path d="M6,26 L58,26 L50,40 L14,40 Z" fill="#f0e0b0" stroke="#a07830" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Sail left */}
        <path d="M30,6 L30,26 L10,26 Z" fill="#fdf6e8" stroke="#a07830" strokeWidth="1.2" strokeLinejoin="round"/>
        {/* Sail right */}
        <path d="M34,10 L34,26 L54,26 Z" fill="#f7ecd4" stroke="#a07830" strokeWidth="1.2" strokeLinejoin="round"/>
        {/* Mast */}
        <line x1="32" y1="4" x2="32" y2="26" stroke="#8a5c20" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Hull shading */}
        <path d="M6,26 L58,26 L55,32 L9,32 Z" fill="rgba(0,0,0,0.06)"/>
      </svg>
    </div>
  );
}

/* ─── Page-wide notebook paper background ─── */
const PAGE_STYLES = `
  @keyframes float-bubble {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
    50%       { transform: translateY(-18px) scale(1.08); opacity: 0.8; }
  }
  @keyframes sway-fish {
    0%, 100% { transform: rotate(-3deg) translateY(0); }
    50%       { transform: rotate(3deg) translateY(-6px); }
  }
  @keyframes boat-rock {
    0%,100% { transform: rotate(-3deg) translateY(0px); }
    25%     { transform: rotate(0deg)  translateY(-4px); }
    50%     { transform: rotate(3deg)  translateY(0px); }
    75%     { transform: rotate(0deg)  translateY(-4px); }
  }
`;

/* ─── Decorative fish illustration in corner ─── */
function CornerFishDeco({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="90" height="56"
      viewBox="0 0 90 56"
      style={{
        opacity: 0.45,
        transform: flip ? 'scaleX(-1)' : undefined,
        animation: 'sway-fish 4s ease-in-out infinite',
      }}
    >
      {/* Body */}
      <ellipse cx="42" cy="28" rx="28" ry="16" fill="#c9843a" stroke="#8a5010" strokeWidth="2.5"/>
      {/* Tail */}
      <path d="M14 28 L2 14 L2 42 Z" fill="#e0a548" stroke="#8a5010" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* Fin top */}
      <path d="M34 14 Q42 6 50 14" fill="none" stroke="#8a5010" strokeWidth="2" strokeLinecap="round"/>
      {/* Eye */}
      <circle cx="58" cy="24" r="4" fill="#fdf6e8" stroke="#5a3008" strokeWidth="2"/>
      <circle cx="59" cy="24" r="1.5" fill="#3a2008"/>
      {/* Mouth */}
      <path d="M70 28 Q72 30 70 32" fill="none" stroke="#5a3008" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Scales */}
      <path d="M30 20 Q36 16 42 20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
      <path d="M38 22 Q44 18 50 22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
    </svg>
  );
}

/* ─── Decorative bubbles ─── */
function Bubbles() {
  const bubbles = [
    { size: 10, x: '8%', delay: '0s', dur: '3.8s' },
    { size: 6, x: '15%', delay: '0.8s', dur: '3.2s' },
    { size: 8, x: '88%', delay: '0.3s', dur: '4.1s' },
    { size: 5, x: '92%', delay: '1.2s', dur: '2.9s' },
    { size: 7, x: '78%', delay: '0.6s', dur: '3.5s' },
  ];
  return (
    <>
      {bubbles.map((b, i) => (
        <div key={i} style={{
          position: 'fixed',
          bottom: 60,
          left: b.x,
          width: b.size,
          height: b.size,
          borderRadius: '50%',
          border: '1.5px solid rgba(160,104,40,0.35)',
          background: 'rgba(201,132,58,0.06)',
          animation: `float-bubble ${b.dur} ease-in-out infinite`,
          animationDelay: b.delay,
          pointerEvents: 'none',
        }}/>
      ))}
    </>
  );
}

/* ─── Export Modal ─── */
function ExportModal({ tanks, onClose }: { tanks: Tank[]; onClose: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(tanks.map(t => t.id)));
  const [done, setDone] = useState(false);

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function doExport() {
    const exportedTanks = tanks.filter(t => selected.has(t.id));
    const payload: Record<string, unknown> = { version: 1, tanks: exportedTanks };
    for (const tank of exportedTanks) {
      try { payload[`entries_${tank.id}`] = JSON.parse(localStorage.getItem(`finlings_entries_${tank.id}`) || '[]'); } catch { payload[`entries_${tank.id}`] = []; }
      try { payload[`gems_${tank.id}`] = JSON.parse(localStorage.getItem(`finlings_gems_${tank.id}`) || '[]'); } catch { payload[`gems_${tank.id}`] = []; }
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finlings-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDone(true);
    setTimeout(onClose, 1200);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,12,2,0.72)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: -34, zIndex: 10, pointerEvents: 'none' }}><BinderClip /></div>
        <div style={{ ...PAPER, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
          <HolePunches />
          <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 700, color: '#3a2008' }}>Export Tanks</h2>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9a7040', fontFamily: "'DM Sans', sans-serif" }}>Select tanks to include in your backup file.</p>
              </div>
              <CloseBtn onClick={onClose} />
            </div>

            {/* Tank checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tanks.map(tank => (
                <label key={tank.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  background: selected.has(tank.id) ? 'rgba(201,132,58,0.10)' : 'rgba(255,255,255,0.4)',
                  border: `1.5px solid ${selected.has(tank.id) ? '#c8aa78' : '#d4c098'}`,
                  borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
                  userSelect: 'none',
                }}>
                  <input
                    type="checkbox"
                    checked={selected.has(tank.id)}
                    onChange={() => toggle(tank.id)}
                    style={{ width: 16, height: 16, accentColor: '#c9843a', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#3a2008', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tank.name}</div>
                    <div style={{ fontSize: 11, color: '#9a7040', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      {tank.type === 'dreams' ? <DreamsIcon color="#8868c0" /> : <JournalIcon color="#7a8850" />}
                      <span style={{ textTransform: 'capitalize' }}>{tank.type}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={onClose} style={{ ...SECONDARY_BTN, height: 36, padding: '0 16px', fontSize: 13 }}>Cancel</button>
              <button
                onClick={doExport}
                disabled={selected.size === 0 || done}
                style={{ ...(selected.size === 0 ? PRIMARY_BTN_DISABLED : PRIMARY_BTN), height: 36, padding: '0 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {done ? '✓ Exported!' : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export {selected.size} {selected.size === 1 ? 'tank' : 'tanks'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Import Modal ─── */
function ImportModal({ onClose, onImported }: { onClose: () => void; onImported: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [preview, setPreview] = useState<Tank[] | null>(null);
  const [pendingPayload, setPendingPayload] = useState<Record<string, unknown> | null>(null);

  function handleFile(file: File) {
    setStatus('loading');
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target?.result as string) as Record<string, unknown>;
        if (!data.tanks || !Array.isArray(data.tanks)) throw new Error('Invalid backup file.');
        setPendingPayload(data);
        setPreview(data.tanks as Tank[]);
        setStatus('idle');
      } catch (err) {
        setStatus('error');
        setErrorMsg(err instanceof Error ? err.message : 'Could not read file.');
      }
    };
    reader.readAsText(file);
  }

  function doImport() {
    if (!pendingPayload) return;
    const tanks: Tank[] = pendingPayload.tanks as Tank[];
    // Merge with existing tanks (avoid duplicates by id)
    const existingRaw = localStorage.getItem('finlings_tanks');
    const existing: Tank[] = existingRaw ? JSON.parse(existingRaw) : [];
    const existingIds = new Set(existing.map(t => t.id));
    const newTanks = [...existing, ...tanks.filter(t => !existingIds.has(t.id))];
    localStorage.setItem('finlings_tanks', JSON.stringify(newTanks));
    for (const tank of tanks) {
      const entries = pendingPayload[`entries_${tank.id}`];
      const gems = pendingPayload[`gems_${tank.id}`];
      if (entries) localStorage.setItem(`finlings_entries_${tank.id}`, JSON.stringify(entries));
      if (gems) localStorage.setItem(`finlings_gems_${tank.id}`, JSON.stringify(gems));
    }
    setStatus('success');
    setTimeout(() => { onImported(); onClose(); }, 1200);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,12,2,0.72)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: -34, zIndex: 10, pointerEvents: 'none' }}><BinderClip /></div>
        <div style={{ ...PAPER, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
          <HolePunches />
          <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 700, color: '#3a2008' }}>Import Tanks</h2>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9a7040', fontFamily: "'DM Sans', sans-serif" }}>Restore from a Finlings backup file.</p>
              </div>
              <CloseBtn onClick={onClose} />
            </div>

            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              style={{
                border: '2px dashed #c8aa78', borderRadius: 8,
                padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
                background: 'rgba(255,255,255,0.35)', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,132,58,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.35)'; }}
            >
              <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c8aa78" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#7a5030', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                {status === 'loading' ? 'Reading file…' : 'Click or drop your backup file here'}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9a7040', fontFamily: "'DM Sans', sans-serif" }}>.json files only</p>
            </div>

            {/* Error */}
            {status === 'error' && (
              <p style={{ margin: 0, fontSize: 13, color: '#c04030', fontFamily: "'DM Sans', sans-serif", background: 'rgba(192,64,48,0.08)', border: '1px solid rgba(192,64,48,0.25)', borderRadius: 6, padding: '8px 12px' }}>{errorMsg}</p>
            )}

            {/* Preview */}
            {preview && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a5030', fontFamily: "'DM Sans', sans-serif" }}>
                  Found {preview.length} {preview.length === 1 ? 'tank' : 'tanks'}
                </p>
                {preview.map(tank => (
                  <div key={tank.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.4)', border: '1.5px solid #d4c098', borderRadius: 6 }}>
                    {tank.type === 'dreams' ? <DreamsIcon color="#8868c0" /> : <JournalIcon color="#7a8850" />}
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#3a2008', fontFamily: "'DM Sans', sans-serif" }}>{tank.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={onClose} style={{ ...SECONDARY_BTN, height: 36, padding: '0 16px', fontSize: 13 }}>Cancel</button>
              {preview && (
                <button
                  onClick={doImport}
                  disabled={status === 'success'}
                  style={{ ...(status === 'success' ? PRIMARY_BTN_DISABLED : PRIMARY_BTN), height: 36, padding: '0 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {status === 'success' ? '✓ Imported!' : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Import all
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Home Page ─── */
export function HomePage({ tanks, onOpenTank, onCreateTank, onRenameTank, onDeleteTank, onRefresh }: {
  tanks: Tank[];
  onOpenTank: (tank: Tank) => void;
  onCreateTank: () => void;
  onRenameTank: (id: string, newName: string) => void;
  onDeleteTank: (id: string) => void;
  onRefresh?: () => void;
}) {
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      backgroundColor: '#e2d5b5',
      backgroundImage: [
        /* Horizontal ruled lines — warm tan, very subtle */
        'repeating-linear-gradient(transparent 0px, transparent 35px, rgba(140,110,60,0.13) 35px, rgba(140,110,60,0.13) 36px)',
        /* Left margin line */
        'linear-gradient(to right, transparent 55px, rgba(180,100,80,0.12) 55px, rgba(180,100,80,0.12) 57px, transparent 57px)',
      ].join(', '),
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    }}>
      <style>{PAGE_STYLES}</style>

      <Bubbles />

      {/* ── Three sections stacked, spaced apart ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 48,
        width: '100%', maxWidth: 1100,
        paddingLeft: 32, paddingRight: 32,
        paddingTop: 48, paddingBottom: 48,
        position: 'relative', zIndex: 2,
        marginTop: 'auto', marginBottom: 'auto',
      }}>

        {/* ── Section 1: Logo + tagline ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div
            style={{ lineHeight: 0 }}
            dangerouslySetInnerHTML={{
              __html: logoRaw
                .replace(/width="[^"]*"/, 'width="300"')
                .replace(/height="[^"]*"/, 'height="86"'),
            }}
          />
          <div style={{
            padding: '8px 22px',
            background: '#d4c58c',
            border: '1.5px solid rgba(140,100,30,0.35)',
            borderRadius: 8,
            boxShadow: '2px 2px 0 rgba(100,70,20,0.22)',
            transform: 'rotate(-0.5deg)',
          }}>
            <p style={{
              margin: 0,
              fontFamily: "'Lora', serif",
              fontSize: 12.5, fontStyle: 'italic',
              color: '#4a3010',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}>
              ✦ Your thoughts, memories &amp; dreams in living tanks. ✦
            </p>
          </div>
        </div>

        {/* ── Section 2: Collection ── */}
        {tanks.length === 0 ? (
          /* Empty state placeholder */
          <div style={{
            width: 'min(88vw, 320px)',
            backgroundColor: '#f8f2e4',
            border: '2px solid #d4b878',
            borderRadius: 12,
            padding: '36px 28px 28px',
            textAlign: 'center',
            boxShadow: '3px 3px 0 rgba(100,70,20,0.18)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'center', animation: 'sway-fish 3s ease-in-out infinite' }}>
              <svg width="50" height="35" viewBox="0 0 37 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.7771 8.34052C21.6298 8.34052 21.4787 8.30652 21.339 8.22719C20.897 7.98544 20.7346 7.43394 20.9763 6.99202L23.2956 2.74245C23.4467 2.45914 23.3334 2.2136 23.2768 2.12296C23.2239 2.03607 23.069 1.82832 22.763 1.82832H17.452C14.6189 1.82832 12.0012 3.26753 10.4448 5.67754L9.74979 6.74281C9.47026 7.16588 8.90364 7.2792 8.48811 7.00345C8.06882 6.72769 7.95172 6.16109 8.22747 5.74178L8.91874 4.68405C10.8074 1.75282 13.9956 0 17.4519 0H22.763C23.6205 0 24.3986 0.441956 24.8405 1.18237C25.2863 1.93031 25.3127 2.83685 24.8972 3.60747L22.5779 7.86458C22.4117 8.17055 22.0982 8.34052 21.7771 8.34052Z" fill="#c8a860"/>
                <path d="M20.787 25.9055C20.685 25.9055 20.5868 25.8979 20.4848 25.8828C18.0974 25.5466 13.7723 24.4587 11.6041 20.9118C11.3434 20.4811 11.4756 19.9221 11.9063 19.6576C12.3331 19.397 12.8959 19.5292 13.1604 19.9598C14.9395 22.8647 18.6716 23.7825 20.7379 24.0734C20.9003 24.0848 21.0061 24.0168 21.0627 23.9714C21.1572 23.8883 21.2138 23.7675 21.2138 23.6466V18.192C21.2138 17.6896 21.6218 17.2779 22.128 17.2779C22.6304 17.2779 23.0421 17.6858 23.0421 18.192V23.6466C23.0421 24.2963 22.7588 24.9196 22.2639 25.3464C21.8484 25.7128 21.3233 25.9055 20.787 25.9055Z" fill="#c8a860"/>
                <path d="M14.1469 21.494C12.5868 21.494 10.921 21.2409 9.17203 20.6289C6.28228 19.6015 3.4757 17.6977 0.82771 14.9628C-0.275273 13.8107 -0.275273 12.0088 0.823933 10.8605C3.62674 7.9745 6.57316 6.02915 9.59132 5.0659C16.606 2.80327 22.2873 6.32003 25.052 8.61293C25.4789 8.97556 26.0946 8.95668 26.5177 8.5676C28.0475 7.1397 30.62 5.45882 34.1631 5.56075C35.1717 5.59474 36.0745 6.1387 36.5882 7.01128C37.1057 7.89519 37.1359 8.9604 36.6675 9.85944L35.3454 12.3979C35.1717 12.719 35.1717 13.1043 35.3341 13.414L36.6675 15.9638V15.9675C37.1284 16.8703 37.0981 17.9356 36.5806 18.8119C36.0669 19.6883 35.1565 20.2323 34.148 20.2662C30.6388 20.406 28.0475 18.6911 26.4987 17.2594C26.0869 16.8741 25.4788 16.8552 25.0519 17.214C22.9063 19.0046 19.0382 21.494 14.1469 21.494ZM14.1242 6.16862C12.8663 6.16862 11.5329 6.35749 10.1466 6.80323C7.4155 7.67581 4.72215 9.46253 2.13847 12.1256C1.72295 12.5638 1.72295 13.2589 2.14225 13.7008C4.58997 16.2279 7.16244 17.9844 9.78016 18.9136C16.1526 21.1348 21.3506 17.9277 23.8812 15.8161C24.9993 14.8756 26.6614 14.9209 27.738 15.9257C29.0336 17.1232 31.1717 18.5434 34.0879 18.4453C34.4732 18.4339 34.8093 18.2299 35.0058 17.8938C35.206 17.5538 35.2173 17.1609 35.0398 16.8134L33.7101 14.2637C33.2644 13.41 33.2719 12.3938 33.729 11.5477L35.0436 9.02435C35.2211 8.68438 35.206 8.27642 35.0096 7.94022C34.8132 7.59648 34.4807 7.39627 34.103 7.38494C31.1868 7.26406 29.0412 8.70705 27.7532 9.90451C26.6615 10.9056 24.9994 10.9508 23.8813 10.0103C21.9661 8.42002 18.4798 6.16862 14.1242 6.16862Z" fill="#c8a860"/>
                <path d="M9.47537 20.6817C9.34316 20.6817 9.21095 20.6514 9.0863 20.5948C8.63301 20.3795 8.43658 19.8355 8.6519 19.3785C11.4547 13.4441 10.4197 9.01683 9.05608 6.34592C8.82566 5.89641 9.0032 5.34873 9.45271 5.11829C9.90222 4.89165 10.4499 5.06541 10.6803 5.51492C12.2291 8.54817 13.4227 13.5495 10.3026 20.1566C10.1477 20.489 9.81912 20.6817 9.47537 20.6817Z" fill="#c8a860"/>
                <path d="M7.93613 10.6188C7.93613 11.7143 6.29297 11.7143 6.29297 10.6188C6.29297 9.52338 7.93613 9.52338 7.93613 10.6188Z" fill="#e8d090"/>
              </svg>
            </div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 14, fontWeight: 600, color: '#7a5828', marginBottom: 20, lineHeight: 1.5 }}>Record a thought, memory or dream and watch your tank come alive with finlings!</div>

            <button
              onClick={onCreateTank}
              style={{ ...PRIMARY_BTN, display: 'flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.07)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Your First Tank
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
            {/* "My Collection" label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, transparent, rgba(120,90,40,0.5))' }}/>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#7a5a28',
              }}>My Collection</span>
              <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg, rgba(120,90,40,0.5), transparent)' }}/>
            </div>
            {/* Tank cards */}
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: 36, alignItems: 'center', justifyContent: 'center',
            }}>
              {tanks.map((tank, i) => (
                <TankCard
                  key={tank.id}
                  tank={tank}
                  index={i}
                  onClick={() => onOpenTank(tank)}
                  onRename={name => onRenameTank(tank.id, name)}
                  onDelete={() => onDeleteTank(tank.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Section 3: Add New Tank (only when tanks exist) ── */}
        {tanks.length > 0 && <AddNewCard onClick={onCreateTank} label="Add New Tank" />}

        {/* Spacer so Add New Tank clears the fixed wave */}
        <div style={{ height: 80, flexShrink: 0, width: '100%' }} />

      </div>

      {/* ── Bottom wave ── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        pointerEvents: 'none',
        zIndex: 1,
        lineHeight: 0,
      }}>
        <svg
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          style={{ width: '100%', height: 130, display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="rgba(160,120,70,0.18)">
            <animate
              attributeName="d"
              dur="7s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.33;0.66;1"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"
              values={[
                "M0,72 C200,35 400,115 600,75 C800,35 1000,109 1200,69 C1320,49 1400,89 1440,72 L1440,140 L0,140 Z",
                "M0,79 C220,42 420,122 620,82 C820,42 1020,115 1220,75 C1340,55 1410,95 1440,79 L1440,140 L0,140 Z",
                "M0,65 C190,28 390,105 590,65 C790,27 990,102 1190,62 C1310,42 1395,82 1440,65 L1440,140 L0,140 Z",
                "M0,72 C200,35 400,115 600,75 C800,35 1000,109 1200,69 C1320,49 1400,89 1440,72 L1440,140 L0,140 Z",
              ].join(";")}
            />
          </path>
          <path fill="rgba(140,100,50,0.22)">
            <animate
              attributeName="d"
              dur="5s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.25;0.5;0.75;1"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"
              values={[
                "M0,72 C160,32 320,112 480,75 C640,38 800,112 960,72 C1120,32 1280,105 1440,68 L1440,140 L0,140 Z",
                "M0,82 C180,45 340,122 500,85 C660,48 820,122 980,82 C1140,42 1300,115 1440,78 L1440,140 L0,140 Z",
                "M0,67 C150,27 310,107 470,70 C630,33 790,107 950,67 C1110,27 1270,100 1440,63 L1440,140 L0,140 Z",
                "M0,87 C170,47 330,127 490,90 C650,53 810,127 970,87 C1130,47 1290,120 1440,83 L1440,140 L0,140 Z",
                "M0,72 C160,32 320,112 480,75 C640,38 800,112 960,72 C1120,32 1280,105 1440,68 L1440,140 L0,140 Z",
              ].join(";")}
            />
          </path>
        </svg>
      </div>

      <PaperBoat />

      {/* ── Export / Import — top-right separate icon-only buttons ── */}
      <div style={{
        position: 'fixed', top: 18, right: 20, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <button
          onClick={() => setShowImport(true)}
          title="Import tanks from backup"
          aria-label="Import tanks from backup"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32,
            background: 'none',
            border: '1.5px solid rgba(140,100,40,0.38)',
            borderRadius: 7,
            color: 'rgba(80,50,10,0.85)',
            cursor: 'pointer',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(60,35,5,1)'; e.currentTarget.style.borderColor = 'rgba(140,100,40,0.70)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(80,50,10,0.85)'; e.currentTarget.style.borderColor = 'rgba(140,100,40,0.38)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </button>
        <button
          onClick={() => setShowExport(true)}
          title="Export tanks as backup"
          aria-label="Export tanks as backup"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32,
            background: 'none',
            border: '1.5px solid rgba(140,100,40,0.38)',
            borderRadius: 7,
            color: 'rgba(80,50,10,0.85)',
            cursor: 'pointer',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(60,35,5,1)'; e.currentTarget.style.borderColor = 'rgba(140,100,40,0.70)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(80,50,10,0.85)'; e.currentTarget.style.borderColor = 'rgba(140,100,40,0.38)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      </div>

      {showExport && <ExportModal tanks={tanks} onClose={() => setShowExport(false)} />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} onImported={() => { onRefresh?.(); }} />}

    </div>
  );
}
