import { useState } from 'react';
import Group from '../../imports/Group';
import type { Entry } from './SwimmingFish';

/* ─── Insight generation ─── */

const POSITIVE = new Set(['happy', 'excited', 'loved', 'grateful', 'confident']);
const CALM_NEU  = new Set(['calm', 'neutral', 'thoughtful', 'melting']);
const NEGATIVE  = new Set(['sad', 'lonely', 'anxious', 'stressed', 'crying', 'angry', 'tired']);

interface Insight {
  icon: string;
  label: string;
  headline: string;
  story: string;
}

function generateInsight(entries: Entry[]): Insight {
  const last7 = entries.slice(-7);
  const ids   = last7.map(e => e.emotionId);
  const n     = ids.length;
  const cnt   = (id: string) => ids.filter(x => x === id).length;
  const cntSet = (s: Set<string>) => ids.filter(id => s.has(id)).length;
  const unique = new Set(ids).size;
  const posN   = cntSet(POSITIVE);
  const negN   = cntSet(NEGATIVE);

  // 14. Rare Positive Turnaround — first half negative, second half positive
  if (n >= 6) {
    const half = Math.ceil(n / 2);
    const firstNeg = ids.slice(0, half).filter(id => NEGATIVE.has(id)).length;
    const lastPos  = ids.slice(half).filter(id => POSITIVE.has(id)).length;
    if (firstNeg >= 3 && lastPos >= 3) return {
      icon: '🐋', label: 'Rare Positive Turnaround',
      headline: 'The Return of Sunlight',
      story: 'Earlier storms gradually gave way to brighter waters. By week\'s end, colorful fish had begun reclaiming parts of the aquarium once left quiet.',
    };
  }

  // 6. Recovery — first 3 mostly negative, last 4 mostly not-negative
  if (n >= 5) {
    const first3Neg = ids.slice(0, 3).filter(id => NEGATIVE.has(id)).length;
    const last4Pos  = ids.slice(-4).filter(id => !NEGATIVE.has(id)).length;
    if (first3Neg >= 2 && last4Pos >= 3) return {
      icon: '🩹', label: 'Recovery Week',
      headline: 'Clearer Skies Emerging',
      story: 'The week began with rough waters but gradually settled. By the end of the week, brighter fish had started appearing throughout the aquarium.',
    };
  }

  // 1. Mostly Positive — 5+
  if (posN >= 5) return {
    icon: '☀️', label: 'Mostly Positive Week',
    headline: 'Bright Waters Ahead',
    story: 'The aquarium spent most of the week in good spirits. Colorful fish filled the tank, bringing energy, gratitude, and moments worth celebrating.',
  };

  // 7. Stress Peak — stressed + anxious 4+
  if (cnt('stressed') + cnt('anxious') >= 4) return {
    icon: '⛈', label: 'Stress Peak Week',
    headline: 'Strong Currents Detected',
    story: 'Activity in the aquarium felt unusually fast-paced this week. Several fish were spotted swimming in circles, though calmer waters occasionally appeared between the waves.',
  };

  // 5. Mostly Negative — neg > 60 %
  if (negN / n > 0.6) return {
    icon: '🌧', label: 'Mostly Negative Week',
    headline: 'Stormy Week',
    story: 'The aquarium experienced stronger currents than usual. While several fish sought calmer corners of the tank, they continued swimming through the changing tides.',
  };

  // 15. Rare Deep Reflection — thoughtful + calm + sad
  if (cnt('thoughtful') >= 1 && cnt('calm') >= 1 && cnt('sad') >= 1) return {
    icon: '🐚', label: 'Rare Deep Reflection',
    headline: 'Beneath the Surface',
    story: 'This week wasn\'t loud, but it was meaningful. The aquarium spent more time observing than reacting, uncovering quieter stories hidden below the surface.',
  };

  // 3. Reflective — thoughtful 3+
  if (cnt('thoughtful') >= 3) return {
    icon: '🤔', label: 'Reflective Week',
    headline: 'Questions Beneath the Surface',
    story: 'Several fish spent the week exploring deeper waters. The aquarium noticed less urgency and more curiosity as thoughts lingered longer than usual.',
  };

  // 8. Connection — loved + grateful dominate
  if (cnt('loved') + cnt('grateful') >= 3) return {
    icon: '❤️', label: 'Connection Week',
    headline: 'Warm Waters All Around',
    story: 'The aquarium felt especially welcoming this week. Fish were frequently seen gathering together, creating one of the friendliest weeks on record.',
  };

  // 9. Confidence — confident 2+
  if (cnt('confident') >= 2) return {
    icon: '😎', label: 'Confidence Week',
    headline: 'Big Fish Energy',
    story: 'The aquarium carried itself with unusual confidence this week. Several fish seemed eager to explore new territory and claim space in the spotlight.',
  };

  // 10. Low Energy — tired + neutral dominate
  if (cnt('tired') + cnt('neutral') >= 3) return {
    icon: '😴', label: 'Low Energy Week',
    headline: 'Slower Than Usual',
    story: 'The fish spent much of the week conserving energy. Rather than racing through the tank, they preferred steady movement and longer moments of rest.',
  };

  // 12. Repeating Pattern — same emotion 4+
  const maxRepeat = Math.max(...Array.from(new Set(ids)).map(id => cnt(id)));
  if (maxRepeat >= 4) return {
    icon: '🔄', label: 'Repeating Pattern Week',
    headline: 'Familiar Waters',
    story: 'One school of fish dominated the aquarium this week. Whether by habit or circumstance, a familiar feeling kept returning to the surface.',
  };

  // 11. Emotional Growth — 6+ unique
  if (unique >= 6) return {
    icon: '🌈', label: 'Emotional Growth Week',
    headline: 'A Colorful Collection',
    story: 'Rarely does the aquarium see such a wide range of fish in a single week. Every corner of the tank seemed to tell a different story.',
  };

  // 4. Emotionally Mixed — 5+ unique
  if (unique >= 5) return {
    icon: '🎢', label: 'Emotionally Mixed Week',
    headline: 'Many Fish, Many Stories',
    story: 'This week brought a little bit of everything. From bright splashes of joy to quieter moments of reflection, the aquarium remained wonderfully unpredictable.',
  };

  // 13. Unpredictable — frequent pos↔neg swings
  let swings = 0;
  for (let i = 1; i < ids.length; i++) {
    const prev = POSITIVE.has(ids[i - 1]) ? 'pos' : NEGATIVE.has(ids[i - 1]) ? 'neg' : 'neu';
    const curr = POSITIVE.has(ids[i])     ? 'pos' : NEGATIVE.has(ids[i])     ? 'neg' : 'neu';
    if ((prev === 'pos' && curr === 'neg') || (prev === 'neg' && curr === 'pos')) swings++;
  }
  if (swings >= 3) return {
    icon: '🎭', label: 'Unpredictable Week',
    headline: 'The Great Mood Migration',
    story: 'The fish struggled to agree on what kind of week this was. Different schools took turns leading the aquarium, creating a week full of surprises.',
  };

  // 2. Quiet & Peaceful — calm/neutral/thoughtful ≥ 50 %
  if (cntSet(CALM_NEU) >= n * 0.5) return {
    icon: '😌', label: 'Quiet & Peaceful Week',
    headline: 'A Week of Gentle Currents',
    story: 'Nothing rushed through the aquarium this week. The fish seemed content drifting through quieter waters, taking things one current at a time.',
  };

  const earliest = last7[0]?.date;
  const latest   = last7[last7.length - 1]?.date;
  const days = earliest && latest
    ? Math.max(1, Math.round((latest.getTime() - earliest.getTime()) / 86_400_000) + 1)
    : last7.length;
  return {
    icon: '🌊', label: `${days} ${days === 1 ? 'Day' : 'Days'} in the Aquarium`,
    headline: 'The Tank Keeps Moving',
    story: 'Another stretch passed through the aquarium. The fish swam their patterns, each telling their own quiet story beneath the water.',
  };
}

/* ─── Scroll roll bar ─── */
function ScrollRoll({ radius = 'top' }: { radius?: 'top' | 'bottom' }) {
  return (
    <div style={{
      height: 34,
      background: 'linear-gradient(to bottom, #2a1506 0%, #7a4a14 8%, #c8922a 28%, #e8c060 50%, #c8922a 72%, #7a4a14 92%, #2a1506 100%)',
      borderRadius: radius === 'top' ? '10px 10px 4px 4px' : '4px 4px 10px 10px',
      boxShadow: radius === 'top'
        ? '0 6px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,230,150,0.35)'
        : '0 -6px 16px rgba(0,0,0,0.35), inset 0 -1px 0 rgba(255,230,150,0.35)',
      position: 'relative',
    }}>
      {/* Wood grain lines */}
      {[20, 40, 60, 80].map(pct => (
        <div key={pct} style={{
          position: 'absolute', top: '20%', bottom: '20%',
          left: `${pct}%`, width: 1,
          background: 'rgba(0,0,0,0.12)',
        }}/>
      ))}
    </div>
  );
}

/* ─── Scroll popup modal ─── */
function ScrollModal({ entries, onClose }: { entries: Entry[]; onClose: () => void }) {
  const insight = generateInsight(entries);
  const last7   = entries.slice(-7);

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(12,6,0,0.72)',
        zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: 'min(94vw, 560px)', position: 'relative' }}>

        <ScrollRoll radius="top" />

        {/* Scroll body */}
        <div style={{
          background: '#f9eecd',
          backgroundImage: [
            'repeating-linear-gradient(transparent 0px, transparent 26px, rgba(160,130,70,0.1) 26px, rgba(160,130,70,0.1) 27px)',
            'linear-gradient(to right, rgba(200,160,80,0.14) 0px, rgba(200,160,80,0.14) 1px, transparent 1px, transparent 46px)',
          ].join(', '),
          maxHeight: '62vh',
          overflowY: 'auto',
          padding: '30px 44px 34px',
          position: 'relative',
          borderLeft: '3px solid rgba(160,110,40,0.3)',
          borderRight: '3px solid rgba(160,110,40,0.3)',
        }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 14, right: 16,
              background: 'rgba(120,70,20,0.1)',
              border: '1.5px solid rgba(160,110,40,0.4)',
              borderRadius: '50%', width: 28, height: 28,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#7a4a18', flexShrink: 0,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Decorative seal — top right corner */}
          <div style={{
            position: 'absolute', top: 10, right: 46,
            width: 52, height: 52 * (310 / 218),
            opacity: 0.85, pointerEvents: 'none',
          }}>
            <Group />
          </div>

          {/* Masthead */}
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#9a6a28', fontFamily: "'DM Sans', sans-serif", marginBottom: 6,
            }}>
              Finlings Daily Report
            </div>
            <h2 style={{
              margin: 0, fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 700,
              color: '#2e1604', letterSpacing: '0.02em',
            }}>
              Current Currents
            </h2>
            <div style={{
              height: 1, background: 'linear-gradient(to right, transparent, rgba(160,110,40,0.5), transparent)',
              margin: '10px 0 0',
            }}/>
          </div>

          {/* Insight content */}
          <div style={{
            background: 'rgba(200,160,80,0.08)',
            border: '1px solid rgba(160,110,40,0.25)',
            borderRadius: 6, padding: '16px 20px', marginBottom: 20,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#9a6a28',
              fontFamily: "'DM Sans', sans-serif", marginBottom: 6,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span>{insight.icon}</span> {insight.label}
            </div>
            <div style={{
              height: 1, background: 'rgba(160,110,40,0.2)', marginBottom: 12,
            }}/>
            <h3 style={{
              margin: '0 0 8px', fontFamily: "'Lora', serif",
              fontSize: 18, fontWeight: 700, color: '#2e1604',
            }}>
              {insight.headline}
            </h3>
            <p style={{
              margin: 0, fontFamily: "'Lora', serif", fontStyle: 'italic',
              fontSize: 13.5, color: '#4a3010', lineHeight: 1.8,
            }}>
              {insight.story}
            </p>
          </div>

          {/* Footer note */}
          <p style={{
            margin: 0, textAlign: 'center',
            fontSize: 11, color: '#9a7848',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Based on your last {last7.length} {last7.length === 1 ? 'fish' : 'fish'}
          </p>
        </div>

        <ScrollRoll radius="bottom" />
      </div>
    </div>
  );
}

/* ─── Aquarium scroll (exported) ─── */
export function AquariumScroll({ entries }: { entries: Entry[] }) {
  const [hovered, setHovered]     = useState(false);
  const [active, setActive]       = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const hasEntries = entries.length > 0;

  if (!hasEntries) return null;

  function handleClick() {
    setActive(false);
    setModalOpen(true);
  }

  const glowing = hovered || active;

  return (
    <>
      <div
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={() => setActive(true)}
        onMouseUp={() => setActive(false)}
        style={{
          cursor: 'pointer',
          display: 'inline-block',
          animation: hovered ? 'turtle-hover-lift 0.3s ease-out forwards' : undefined,
          filter: glowing
            ? 'drop-shadow(0 0 10px rgba(255,220,130,0.8)) drop-shadow(0 2px 8px rgba(180,120,30,0.5))'
            : 'drop-shadow(0 2px 6px rgba(40,20,0,0.22))',
          transition: 'filter 0.2s ease',
          width: 52,
          height: Math.round(52 * 310.398 / 218.435),
          position: 'relative',
        }}
      >
        <Group />
      </div>

      {modalOpen && (
        <ScrollModal entries={entries} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
