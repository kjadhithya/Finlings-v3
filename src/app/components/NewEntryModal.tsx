import { useState } from 'react';
import { EMOTIONS, DREAM_ELEMENTS, type EmotionId } from './emotions';
import { FishSVG } from './FishSVG';
import type { Entry } from './SwimmingFish';
import type { TankType } from './HomePage';
import { PRIMARY_BTN, PRIMARY_BTN_DISABLED, SECONDARY_BTN } from './buttonStyles';
import { DreamIcon } from './dreamIcons';

import angryRaw from '../../imports/angry__.svg?raw';
import anxiousRaw from '../../imports/anxious__.svg?raw';
import calmRaw from '../../imports/calm__.svg?raw';
import confidentRaw from '../../imports/confident__.svg?raw';
import cryingRaw from '../../imports/crying__.svg?raw';
import excitedRaw from '../../imports/Excited__.svg?raw';
import gratefulRaw from '../../imports/grateful__.svg?raw';
import happyRaw from '../../imports/Happy__.svg?raw';
import lonelyRaw from '../../imports/lonely__.svg?raw';
import lovedRaw from '../../imports/Loved__.svg?raw';
import meltingRaw from '../../imports/Melting__.svg?raw';
import neutralRaw from '../../imports/neutral__.svg?raw';
import sadRaw from '../../imports/sad__.svg?raw';
import stressedRaw from '../../imports/stressed__.svg?raw';
import tiredRaw from '../../imports/Tired__.svg?raw';
import thoughtfulRaw from '../../imports/thougtful__.svg?raw';

const EMOTION_SVGS: Partial<Record<string, string>> = {
  happy: happyRaw,
  excited: excitedRaw,
  loved: lovedRaw,
  grateful: gratefulRaw,
  confident: confidentRaw,
  calm: calmRaw,
  lonely: lonelyRaw,
  anxious: anxiousRaw,
  angry: angryRaw,
  crying: cryingRaw,
  melting: meltingRaw,
  neutral: neutralRaw,
  sad: sadRaw,
  stressed: stressedRaw,
  tired: tiredRaw,
  thoughtful: thoughtfulRaw,
};

function scaleSvg(raw: string, size: number): string {
  return raw
    .replace(/(<svg[^>]*)\s+width="[^"]*"/, `$1 width="${size}"`)
    .replace(/(<svg[^>]*)\s+height="[^"]*"/, `$1 height="${size}"`);
}

/* ─── Shared paper form styles ─── */
const OVERLAY: React.CSSProperties = {
  position: 'fixed', inset: 0,
  background: 'rgba(30,12,2,0.78)',
  zIndex: 200,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(3px)',
};

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
  width: 'min(94vw, 490px)',
  maxHeight: '88vh',
  overflowY: 'auto',
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#7a5030',
  fontFamily: "'DM Sans', sans-serif",
  marginBottom: 8,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

/* ─── Binder clip SVG ─── */
function BinderClip() {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" style={{ display: 'block' }}>
      {/* Left wire handle */}
      <path d="M22 28 C22 14 10 4 18 4 C26 4 24 16 24 28" fill="none" stroke="#6a6a6a" strokeWidth="4" strokeLinecap="round"/>
      {/* Right wire handle */}
      <path d="M50 28 C50 14 62 4 54 4 C46 4 48 16 48 28" fill="none" stroke="#6a6a6a" strokeWidth="4" strokeLinecap="round"/>
      {/* Clip body */}
      <rect x="10" y="26" width="52" height="22" rx="4" fill="#7a7a7a" stroke="#555" strokeWidth="1.5"/>
      <rect x="14" y="30" width="44" height="14" rx="3" fill="#909090"/>
      {/* Sheen */}
      <rect x="14" y="30" width="44" height="6" rx="2" fill="rgba(255,255,255,0.22)"/>
      {/* Rivets */}
      <circle cx="23" cy="28" r="3.5" fill="#5a5a5a" stroke="#444" strokeWidth="1"/>
      <circle cx="49" cy="28" r="3.5" fill="#5a5a5a" stroke="#444" strokeWidth="1"/>
      {/* Bottom lip */}
      <rect x="10" y="44" width="52" height="4" rx="2" fill="#666"/>
    </svg>
  );
}

/* ─── Close button ─── */
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

/* ─── NewEntryModal ─── */
interface NewEntryModalProps {
  onClose: () => void;
  onGenerate: (entry: Omit<Entry, 'id'>) => void;
  tankType?: TankType;
}

export function NewEntryModal({ onClose, onGenerate, tankType = 'journal' }: NewEntryModalProps) {
  const [thoughts, setThoughts] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionId | null>(null);
  const [step, setStep] = useState<'form' | 'ready'>('form');
  const isDreams = tankType === 'dreams';

  return (
    <div style={OVERLAY} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Binder clip – overlaps the top edge */}
        <div style={{ position: 'absolute', top: -34, zIndex: 10, pointerEvents: 'none' }}>
          <BinderClip />
        </div>

        <div style={PAPER}>
          {/* Top hole-punch decorations */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 160, paddingTop: 8, marginBottom: -4, pointerEvents: 'none' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(160,120,70,0.25)', border: '1px solid rgba(160,120,70,0.35)' }}/>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(160,120,70,0.25)', border: '1px solid rgba(160,120,70,0.35)' }}/>
          </div>

          {step === 'form' ? (
            <FormStep
              thoughts={thoughts} setThoughts={setThoughts}
              selectedEmotion={selectedEmotion} setSelectedEmotion={setSelectedEmotion}
              canGenerate={selectedEmotion !== null}
              onGenerate={() => setStep('ready')}
              onClose={onClose}
              isDreams={isDreams}
            />
          ) : (
            <ReadyStep
              emotionId={selectedEmotion!}
              onDone={() => { onGenerate({ emotionId: selectedEmotion!, thoughts, date: new Date() }); onClose(); }}
              onClose={onClose}
              isDreams={isDreams}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface FormStepProps {
  thoughts: string; setThoughts: (v: string) => void;
  selectedEmotion: EmotionId | null; setSelectedEmotion: (v: EmotionId) => void;
  canGenerate: boolean; onGenerate: () => void; onClose: () => void;
  isDreams: boolean;
}

function FormStep({ thoughts, setThoughts, selectedEmotion, setSelectedEmotion, canGenerate, onGenerate, onClose, isDreams }: FormStepProps) {
  const [hoveredEmotion, setHoveredEmotion] = useState<EmotionId | null>(null);
  const elements = isDreams ? DREAM_ELEMENTS : EMOTIONS;

  return (
    <div style={{ padding: '22px 28px 28px' }}>
      <CloseBtn onClick={onClose} />

      <h2 style={{
        textAlign: 'center', color: '#3a2008', margin: '0 0 22px',
        fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 700,
      }}>
        {isDreams ? 'Enter your dream.' : 'How are you feeling today?'}
      </h2>

      {/* Thoughts / Dream text */}
      <div style={{ marginBottom: 18 }}>
        <div style={SECTION_LABEL}>
          <span style={{ color: '#c9843a' }}>✦</span> {isDreams ? 'ENTER DREAM' : 'Your thoughts'}
        </div>
        <textarea
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          placeholder={isDreams ? 'Describe your dream…' : 'Today I feel…'}
          rows={4}
          style={{
            width: '100%', boxSizing: 'border-box',
            borderTop: 'none', borderLeft: 'none', borderRight: 'none',
            borderBottom: '2px solid #c0a070',
            background: 'transparent',
            outline: 'none', resize: 'none',
            padding: '6px 48px 8px 0',
            fontSize: 14, color: '#3a2008',
            fontFamily: "'Lora', serif", fontStyle: 'italic',
            lineHeight: 1.9,
          }}
        />
      </div>

      {/* Emotion / Element grid */}
      <div style={{ marginBottom: 26 }}>
        <div style={SECTION_LABEL}>
          <span style={{ color: '#c9843a' }}>✦</span> {isDreams ? 'Select element' : 'Select your emotion'}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDreams ? 'repeat(6, 1fr)' : 'repeat(8, 1fr)',
          gap: isDreams ? 10 : 6,
          overflow: 'visible',
        }}>
          {elements.map((em) => (
            <div key={em.id} style={{ position: 'relative' }}>
              <button
                onClick={() => setSelectedEmotion(em.id as EmotionId)}
                onMouseEnter={() => setHoveredEmotion(em.id as EmotionId)}
                onMouseLeave={() => setHoveredEmotion(null)}
                style={{
                  width: '100%',
                  border: selectedEmotion === em.id ? '2.5px solid #c9843a' : '2px solid transparent',
                  background: selectedEmotion === em.id ? 'rgba(201,132,58,0.15)' : 'rgba(160,100,40,0.07)',
                  borderRadius: 8, padding: isDreams ? '10px 3px' : '7px 3px', cursor: 'pointer',
                  fontSize: isDreams ? 24 : 19,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.13s ease', aspectRatio: '1',
                  boxShadow: selectedEmotion === em.id ? '0 2px 8px rgba(201,132,58,0.3)' : 'none',
                  color: selectedEmotion === em.id ? '#5a3010' : '#7a5030',
                }}
              >
                {isDreams ? (
                  <DreamIcon id={em.id} size={26} />
                ) : EMOTION_SVGS[em.id] ? (
                  <span
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22 }}
                    dangerouslySetInnerHTML={{ __html: scaleSvg(EMOTION_SVGS[em.id]!, 22) }}
                  />
                ) : (
                  em.emoji
                )}
              </button>
              {hoveredEmotion === em.id && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 5px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(58,32,8,0.92)',
                  color: '#f8f0de',
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: 'nowrap',
                  zIndex: 20,
                  pointerEvents: 'none',
                }}>
                  {em.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        style={{ ...(canGenerate ? PRIMARY_BTN : PRIMARY_BTN_DISABLED), width: '100%', padding: '13px' }}
        onMouseEnter={e => { if (canGenerate) e.currentTarget.style.filter = 'brightness(1.07)'; }}
        onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
      >
        {'Generate your fish'}
      </button>
    </div>
  );
}

function ReadyStep({ emotionId, onDone, onClose, isDreams }: { emotionId: EmotionId; onDone: () => void; onClose: () => void; isDreams: boolean }) {
  const allElements = [...EMOTIONS, ...DREAM_ELEMENTS];
  const emotion = allElements.find(e => e.id === emotionId)!;
  return (
    <div style={{ padding: '22px 28px 28px', textAlign: 'center' }}>
      <CloseBtn onClick={onClose} />

      <h2 style={{
        color: '#3a2008', margin: '0 0 4px',
        fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 700,
      }}>
        Your fish is ready!
      </h2>

      {/* Fish preview with sparkles */}
      <div style={{
        background: 'rgba(100,160,200,0.15)',
        border: '2px solid #c0a070',
        borderRadius: 6, padding: '28px 20px', marginBottom: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 130,
        backgroundImage: 'repeating-linear-gradient(transparent 0px, transparent 28px, rgba(100,160,200,0.08) 28px, rgba(100,160,200,0.08) 29px)',
        position: 'relative', overflow: 'visible',
      }}>
        {/* Water caustic hint */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 30%, rgba(180,220,255,0.18) 0%, transparent 60%)', pointerEvents: 'none', borderRadius: 6 }}/>
        {/* Sparkles orbiting the fish */}
        {[
          { deg: 0,   r: 72, sz: 13, color: '#ffd700', delay: 0    },
          { deg: 60,  r: 68, sz: 10, color: '#c4b5fd', delay: 0.3  },
          { deg: 120, r: 74, sz: 11, color: '#7dd3fc', delay: 0.6  },
          { deg: 180, r: 70, sz: 14, color: '#f9a8d4', delay: 0.9  },
          { deg: 240, r: 66, sz: 10, color: '#86efac', delay: 1.2  },
          { deg: 300, r: 76, sz: 12, color: '#fde68a', delay: 1.5  },
        ].map((sp, i) => (
          <span key={i} style={{
            position: 'absolute',
            top: `calc(50% + ${Math.sin(sp.deg * Math.PI / 180) * sp.r}px)`,
            left: `calc(50% + ${Math.cos(sp.deg * Math.PI / 180) * sp.r}px)`,
            transform: 'translate(-50%, -50%)',
            fontSize: sp.sz,
            color: sp.color,
            animation: `preview-sparkle ${1.6 + i * 0.2}s ease-in-out ${-sp.delay}s infinite`,
            pointerEvents: 'none',
            userSelect: 'none',
            textShadow: `0 0 8px ${sp.color}`,
          }}>✦</span>
        ))}
        <div style={{ animation: 'fish-swim-preview 2s ease-in-out infinite', position: 'relative', zIndex: 1 }}>
          <FishSVG emotionId={emotionId} width={140} />
        </div>
      </div>

      <button
        onClick={onDone}
        style={{
          ...PRIMARY_BTN,
          width: '100%',
          padding: '13px',
          background: 'linear-gradient(135deg, #4a7a45 0%, #6a9e60 100%)',
          border: '2px solid #385e34',
          boxShadow: '2px 2px 0 #264023',
        }}
        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.07)'; }}
        onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
      >
        Done
      </button>
    </div>
  );
}

/* ─── EditEntryModal ─── */
interface EditEntryModalProps {
  entry: Entry;
  onClose: () => void;
  onSave: (updated: Entry) => void;
  tankType?: TankType;
}

export function EditEntryModal({ entry, onClose, onSave, tankType = 'journal' }: EditEntryModalProps) {
  const [thoughts, setThoughts] = useState(entry.thoughts);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionId>(entry.emotionId);
  const isDreams = tankType === 'dreams';
  const elements = isDreams ? DREAM_ELEMENTS : EMOTIONS;

  return (
    <div style={OVERLAY} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: -34, zIndex: 10, pointerEvents: 'none' }}>
          <BinderClip />
        </div>

        <div style={PAPER}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 160, paddingTop: 8, marginBottom: -4, pointerEvents: 'none' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(160,120,70,0.25)', border: '1px solid rgba(160,120,70,0.35)' }}/>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(160,120,70,0.25)', border: '1px solid rgba(160,120,70,0.35)' }}/>
          </div>

          <div style={{ padding: '22px 28px 28px' }}>
            <CloseBtn onClick={onClose} />

            <h2 style={{ textAlign: 'center', color: '#3a2008', margin: '0 0 22px', fontFamily: "'Lora', serif", fontSize: 20 }}>
              Edit Entry
            </h2>

            <div style={{ marginBottom: 18 }}>
              <div style={SECTION_LABEL}><span style={{ color: '#c9843a' }}>✦</span> {isDreams ? 'ENTER DREAM' : 'Your thoughts'}</div>
              <textarea
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                placeholder={isDreams ? 'Describe your dream…' : 'Today I feel…'}
                rows={4}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                  borderBottom: '2px solid #c0a070', background: 'transparent',
                  outline: 'none', resize: 'none', padding: '6px 0 8px',
                  fontSize: 14, color: '#3a2008', fontFamily: "'Lora', serif", fontStyle: 'italic', lineHeight: 1.9,
                }}
              />
            </div>

            <div style={{ marginBottom: 26 }}>
              <div style={SECTION_LABEL}><span style={{ color: '#c9843a' }}>✦</span> {isDreams ? 'Select element' : 'Select your emotion'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: isDreams ? 'repeat(6, 1fr)' : 'repeat(8, 1fr)', gap: isDreams ? 10 : 6 }}>
                {elements.map((em) => (
                  <button
                    key={em.id} onClick={() => setSelectedEmotion(em.id as EmotionId)} title={em.name}
                    style={{
                      border: selectedEmotion === em.id ? '2.5px solid #c9843a' : '2px solid transparent',
                      background: selectedEmotion === em.id ? 'rgba(201,132,58,0.15)' : 'rgba(160,100,40,0.07)',
                      borderRadius: 8, padding: isDreams ? '10px 3px' : '7px 3px', cursor: 'pointer',
                      fontSize: isDreams ? 24 : 19,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.13s ease', aspectRatio: '1',
                      color: selectedEmotion === em.id ? '#5a3010' : '#7a5030',
                    }}
                  >
                    {isDreams ? (
                      <DreamIcon id={em.id} size={26} />
                    ) : EMOTION_SVGS[em.id] ? (
                      <span
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26 }}
                        dangerouslySetInnerHTML={{ __html: scaleSvg(EMOTION_SVGS[em.id]!, 26) }}
                      />
                    ) : (
                      em.emoji
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { onSave({ ...entry, thoughts, emotionId: selectedEmotion }); onClose(); }}
              style={{ ...PRIMARY_BTN, width: '100%', padding: '13px' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}