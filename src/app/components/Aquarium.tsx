import { useState, useRef, useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import { AquariumScroll } from './ScrollInsight';
import type { Entry } from './SwimmingFish';

import frame2Raw   from '../../imports/Frame_2.svg?raw';
import frame3Raw   from '../../imports/Frame_3.svg?raw';
import frame4Raw   from '../../imports/Frame_4.svg?raw';
import frame5Raw   from '../../imports/Frame_5.svg?raw';
import group1Raw   from '../../imports/Group-1.svg?raw';
import group2Raw   from '../../imports/Group-2.svg?raw';
import group3Raw   from '../../imports/Group-3.svg?raw';
import group4Raw   from '../../imports/Group-4.svg?raw';
import groupRaw    from '../../imports/Group.svg?raw';
import turtleRaw   from '../../imports/pasted_text/abstract-shapes.svg?raw';
import sandcastleRaw  from '../../imports/pasted_text/abstract-shape.svg?raw';
import kelpTreeRaw    from '../../imports/pasted_text/pasted-attachment-1.txt?raw';
import creepersRaw    from '../../imports/pasted_text/logo-icon.svg?raw';
import leafIconARaw   from '../../imports/pasted_text/leaf-icon.svg?raw';
import leafIconBRaw   from '../../imports/pasted_text/leaf-icon-1.svg?raw';
import coralPebble1Raw from '../../imports/Group-5.svg?raw';
import coralPebble2Raw from '../../imports/Group2.svg?raw';
import coralPebble3Raw from '../../imports/Group3.svg?raw';
import dreamPlantARaw   from '../../imports/pasted_text/abstract-shapes-2.svg?raw';
import dreamPlantBRaw   from '../../imports/pasted_text/leaf-icon-5.svg?raw';
import dreamPlantCRaw   from '../../imports/pasted_text/pasted-attachment-2.txt?raw';
import dreamBackdropRaw from '../../imports/pasted_text/abstract-shapes-1.svg?raw';
import shipRaw          from '../../imports/ship.svg?raw';
import gemLuciaRaw      from '../../imports/Gem_Lucia.svg?raw';
import gemMemoraRaw     from '../../imports/gem_Memora.svg?raw';
import gemUmbraRaw      from '../../imports/Gem_Umbra.svg?raw';
import gemFantasiaRaw   from '../../imports/Gem_Fantasia.svg?raw';
import gemOddiaRaw      from '../../imports/Gen_Oddia.svg?raw';
import gemOracleaRaw    from '../../imports/Gem_Oraclea.svg?raw';

export type AquariumTheme = 'coral' | 'kelp' | 'dreams';

/* ─── Keyframes ─── */
const KEYFRAMES = `
  @keyframes plant-sway-gentle {
    0%,100% { transform: rotate(-2deg); }
    50%      { transform: rotate(2deg); }
  }
  @keyframes plant-sway-med {
    0%,100% { transform: rotate(-3.5deg); }
    50%      { transform: rotate(3.5deg); }
  }
  @keyframes plant-sway-strong {
    0%,100% { transform: rotate(-5deg); }
    50%      { transform: rotate(5deg); }
  }
  @keyframes bubble-rise {
    0%   { transform: translateY(0) translateX(0); opacity: 0; }
    8%   { opacity: 0.7; }
    85%  { opacity: 0.4; }
    100% { transform: translateY(-110vh) translateX(var(--bx)); opacity: 0; }
  }
  @keyframes ray-pulse {
    0%,100% { opacity: 0.04; }
    50%      { opacity: 0.14; }
  }
  @keyframes caustic {
    0%,100% { transform: scale(1) translate(0,0); opacity: 0.05; }
    33%      { transform: scale(1.04) translate(4px,-2px); opacity: 0.10; }
    66%      { transform: scale(0.97) translate(-3px,3px); opacity: 0.06; }
  }
  @keyframes turtle-hover-lift {
    0%   { transform: translateY(0); }
    100% { transform: translateY(-15px); }
  }
  @keyframes cloud-drift {
    0%   { transform: translateX(0) translateY(0); opacity: 0; }
    10%  { opacity: 0.25; }
    85%  { opacity: 0.18; }
    100% { transform: translateX(var(--cloud-dx)) translateY(var(--cloud-dy)); opacity: 0; }
  }
  @keyframes cloud-pulse {
    0%,100% { opacity: 0.15; }
    50%     { opacity: 0.28; }
  }
  @keyframes wave-flow {
    0%   { transform: translateX(0) scaleY(1); }
    50%  { transform: translateX(-15%) scaleY(1.08); }
    100% { transform: translateX(-30%) scaleY(1); }
  }
  @keyframes glare-sweep {
    0%   { transform: translateX(-100%) rotate(15deg); opacity: 0; }
    10%  { opacity: 0.4; }
    90%  { opacity: 0.3; }
    100% { transform: translateX(200%) rotate(15deg); opacity: 0; }
  }
  @keyframes sparkle-twinkle {
    0%,100% { opacity: 0; transform: scale(0.5); }
    50%      { opacity: 1; transform: scale(1); }
  }
  @keyframes dream-float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-8px) rotate(3deg); }
    66%      { transform: translateY(-4px) rotate(-2deg); }
  }
  @keyframes dream-orb-a {
    0%   { transform: translate(0%, 0%) scale(1); }
    25%  { transform: translate(8%, -12%) scale(1.15); }
    50%  { transform: translate(15%, 5%) scale(0.92); }
    75%  { transform: translate(4%, 14%) scale(1.08); }
    100% { transform: translate(0%, 0%) scale(1); }
  }
  @keyframes dream-orb-b {
    0%   { transform: translate(0%, 0%) scale(1); }
    30%  { transform: translate(-10%, 8%) scale(1.12); }
    60%  { transform: translate(-4%, -15%) scale(0.88); }
    100% { transform: translate(0%, 0%) scale(1); }
  }
  @keyframes dream-orb-c {
    0%   { transform: translate(0%, 0%) scale(1); }
    20%  { transform: translate(12%, 6%) scale(0.94); }
    55%  { transform: translate(-8%, -10%) scale(1.18); }
    80%  { transform: translate(6%, 8%) scale(0.96); }
    100% { transform: translate(0%, 0%) scale(1); }
  }
  @keyframes dream-orb-d {
    0%   { transform: translate(0%, 0%) scale(1); }
    35%  { transform: translate(-14%, -6%) scale(1.10); }
    65%  { transform: translate(10%, 12%) scale(0.90); }
    100% { transform: translate(0%, 0%) scale(1); }
  }
  @keyframes firefly-drift {
    0%   { transform: translate(0, 0); opacity: 0; }
    8%   { opacity: 1; }
    50%  { transform: translate(var(--ffx), var(--ffy)); opacity: 0.85; }
    92%  { opacity: 0.7; }
    100% { transform: translate(var(--ffx2), var(--ffy2)); opacity: 0; }
  }
  @keyframes firefly-pulse {
    0%,100% { opacity: 0.55; }
    50%      { opacity: 1; }
  }
`;

/* ─── Helpers ─── */
function scaleSvgTo(raw: string, targetW: number): string {
  const wm = raw.match(/width="([\d.]+)(?:px)?"/);
  const hm = raw.match(/height="([\d.]+)(?:px)?"/);
  const origW = wm ? parseFloat(wm[1]) : 100;
  const origH = hm ? parseFloat(hm[1]) : 100;
  const targetH = Math.round(targetW * origH / origW);
  return raw
    .replace(/(<svg[^>]*?) width="[^"]*"/, `$1 width="${targetW}"`)
    .replace(/(<svg[^>]*?) height="[^"]*"/, `$1 height="${targetH}"`);
}

/* ─── Plant definitions ─── */
interface PlantSpec {
  raw: string;
  targetW: number;
  left: string;
  mirror: boolean;
  zIndex: number;
  swayDur: number;
  swayDelay: number;
  swayType: 'gentle' | 'med' | 'strong';
}

// THEME 1: Coral Garden - diverse, colorful, mixed heights
const PLANTS_CORAL: PlantSpec[] = [
  // Left side - clustered small plants
  { raw: group3Raw, targetW: 50, left: '2%',   mirror: false, zIndex: 7, swayDur: 3.8, swayDelay: -0.8, swayType: 'gentle' },
  { raw: frame5Raw, targetW: 42, left: '6%',   mirror: false, zIndex: 8, swayDur: 3.2, swayDelay: -1.5, swayType: 'gentle' },
  
  // Near sandcastle - medium plants
  { raw: frame3Raw, targetW: 68, left: '18%',  mirror: false, zIndex: 8, swayDur: 3.5, swayDelay: -0.5, swayType: 'med'    },
  { raw: group4Raw, targetW: 44, left: '24%',  mirror: false, zIndex: 7, swayDur: 3.0, swayDelay: -1.2, swayType: 'med'    },
  
  // Center - tall feature plants
  { raw: group1Raw, targetW: 115,left: '35%',  mirror: false, zIndex: 5, swayDur: 5.0, swayDelay: -1.8, swayType: 'gentle' },
  { raw: group2Raw, targetW: 105,left: '42%',  mirror: false, zIndex: 6, swayDur: 4.6, swayDelay: -2.2, swayType: 'gentle' },
  { raw: frame2Raw, targetW: 75, left: '48%',  mirror: false, zIndex: 8, swayDur: 3.8, swayDelay: -0.8, swayType: 'gentle' },
  
  // Center-right - medium variety
  { raw: frame4Raw, targetW: 62, left: '56%',  mirror: false, zIndex: 7, swayDur: 3.4, swayDelay: -1.5, swayType: 'med'    },
  { raw: group3Raw, targetW: 55, left: '62%',  mirror: false, zIndex: 8, swayDur: 3.6, swayDelay: -0.6, swayType: 'gentle' },
  
  // Right side - tall and medium mix
  { raw: group2Raw, targetW: 95, left: '72%',  mirror: true,  zIndex: 6, swayDur: 4.8, swayDelay: -2.0, swayType: 'gentle' },
  { raw: frame2Raw, targetW: 70, left: '78%',  mirror: true,  zIndex: 7, swayDur: 3.7, swayDelay: -1.0, swayType: 'gentle' },
  
  // Far right - small accent plants
  { raw: frame4Raw, targetW: 48, left: '88%',  mirror: true,  zIndex: 8, swayDur: 3.3, swayDelay: -0.5, swayType: 'med'    },
  { raw: groupRaw,  targetW: 46, left: '94%',  mirror: true,  zIndex: 8, swayDur: 4.0, swayDelay: -1.3, swayType: 'gentle' },
];

// THEME 3: Dreams — new plant SVG, varied sizes along the floor
// zIndex 7 — rendered before water overlay so they sit behind it (one layer back)
// All plants small and uniform (55-68px) — abstract-shapes-2 is wider (320×446) so needs less width
const PLANTS_DREAMS: PlantSpec[] = [
  { raw: dreamPlantBRaw, targetW: 52,  left: '1%',  mirror: false, zIndex: 7, swayDur: 5.2, swayDelay: -1.0, swayType: 'gentle' },
  { raw: dreamPlantCRaw, targetW: 54,  left: '7%',  mirror: true,  zIndex: 8, swayDur: 5.8, swayDelay: -0.4, swayType: 'gentle' },
  { raw: dreamPlantARaw, targetW: 62,  left: '14%', mirror: false, zIndex: 7, swayDur: 6.0, swayDelay: -2.0, swayType: 'gentle' },
  { raw: dreamPlantBRaw, targetW: 56,  left: '22%', mirror: false, zIndex: 8, swayDur: 5.5, swayDelay: -1.5, swayType: 'gentle' },
  { raw: dreamPlantCRaw, targetW: 58,  left: '31%', mirror: true,  zIndex: 7, swayDur: 5.0, swayDelay: -0.8, swayType: 'gentle' },
  { raw: dreamPlantARaw, targetW: 66,  left: '40%', mirror: false, zIndex: 7, swayDur: 6.5, swayDelay: -2.5, swayType: 'gentle' },
  { raw: dreamPlantBRaw, targetW: 60,  left: '49%', mirror: true,  zIndex: 8, swayDur: 5.6, swayDelay: -1.2, swayType: 'gentle' },
  { raw: dreamPlantCRaw, targetW: 55,  left: '58%', mirror: false, zIndex: 7, swayDur: 5.3, swayDelay: -0.6, swayType: 'gentle' },
  { raw: dreamPlantARaw, targetW: 64,  left: '67%', mirror: true,  zIndex: 8, swayDur: 6.2, swayDelay: -1.8, swayType: 'gentle' },
  { raw: dreamPlantBRaw, targetW: 57,  left: '76%', mirror: false, zIndex: 7, swayDur: 5.4, swayDelay: -2.2, swayType: 'gentle' },
  { raw: dreamPlantCRaw, targetW: 53,  left: '84%', mirror: true,  zIndex: 8, swayDur: 5.7, swayDelay: -0.9, swayType: 'gentle' },
  { raw: dreamPlantARaw, targetW: 60,  left: '91%', mirror: false, zIndex: 7, swayDur: 5.9, swayDelay: -1.4, swayType: 'gentle' },
  { raw: dreamPlantBRaw, targetW: 52,  left: '97%', mirror: true,  zIndex: 8, swayDur: 5.1, swayDelay: -0.3, swayType: 'gentle' },
];

// THEME 2: Kelp Forest - tall, dramatic, flowing plants
const PLANTS_KELP: PlantSpec[] = [
  { raw: group1Raw, targetW: 140, left: '2%',   mirror: false, zIndex: 6, swayDur: 6.5, swayDelay: 0,    swayType: 'strong'  },
  { raw: group2Raw, targetW: 120, left: '9%',   mirror: false, zIndex: 7, swayDur: 5.8, swayDelay: -1.5, swayType: 'strong'  },
  { raw: frame3Raw, targetW: 85,  left: '16%',  mirror: false, zIndex: 8, swayDur: 4.2, swayDelay: -0.8, swayType: 'med'     },
  { raw: group1Raw, targetW: 150, left: '23%',  mirror: false, zIndex: 5, swayDur: 7.0, swayDelay: -2.2, swayType: 'strong'  },
  { raw: frame2Raw, targetW: 90,  left: '30%',  mirror: false, zIndex: 8, swayDur: 4.8, swayDelay: -1.0, swayType: 'med'     },
  { raw: group2Raw, targetW: 130, left: '38%',  mirror: false, zIndex: 6, swayDur: 6.2, swayDelay: -3.0, swayType: 'strong'  },
  { raw: frame4Raw, targetW: 75,  left: '46%',  mirror: false, zIndex: 7, swayDur: 4.5, swayDelay: -1.8, swayType: 'med'     },
  { raw: group1Raw, targetW: 135, left: '52%',  mirror: true,  zIndex: 6, swayDur: 6.8, swayDelay: -0.5, swayType: 'strong'  },
  { raw: frame3Raw, targetW: 80,  left: '60%',  mirror: true,  zIndex: 8, swayDur: 4.0, swayDelay: -2.5, swayType: 'med'     },
  { raw: group2Raw, targetW: 125, left: '67%',  mirror: true,  zIndex: 7, swayDur: 6.0, swayDelay: -1.2, swayType: 'strong'  },
  { raw: frame2Raw, targetW: 85,  left: '75%',  mirror: true,  zIndex: 8, swayDur: 4.6, swayDelay: -3.5, swayType: 'med'     },
  { raw: group1Raw, targetW: 145, left: '85%',  mirror: true,  zIndex: 5, swayDur: 7.2, swayDelay: -0.8, swayType: 'strong'  },
  { raw: frame4Raw, targetW: 70,  left: '92%',  mirror: true,  zIndex: 7, swayDur: 4.3, swayDelay: -2.0, swayType: 'med'     },
];

/* ─── Bubbles ─── */
const BUBBLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: 3 + (i / 21) * 94 + Math.sin(i * 1.7) * 2,
  size: 3 + (i % 5) * 2.2,
  dur: 5 + (i % 8) * 1.1,
  delay: -(i * 0.9),
  bx: `${(Math.sin(i * 2.3) > 0 ? 1 : -1) * (5 + (i % 5) * 3)}px`,
}));

const BUBBLES_CORAL_BIG = Array.from({ length: 7 }, (_, i) => ({
  id: i + 200,
  x: 8 + (i / 6) * 84 + Math.sin(i * 2.9) * 4,
  size: 20 + (i % 3) * 8,
  dur: 9 + (i % 4) * 2,
  delay: -(i * 3.1),
  bx: `${(Math.cos(i * 1.4) > 0 ? 1 : -1) * (10 + (i % 3) * 6)}px`,
}));

/* ─── Extra bubbles for dreams dark mode ─── */
const DREAM_BUBBLES_DARK = Array.from({ length: 18 }, (_, i) => ({
  id: i + 500,
  x: 1 + (i / 17) * 97 + Math.sin(i * 2.1) * 3.5,
  size: 2 + (i % 6) * 2.5,
  dur: 3.5 + (i % 8) * 1.2,
  delay: -(i * 0.55),
  bx: `${(Math.sin(i * 1.9) > 0 ? 1 : -1) * (3 + (i % 5) * 4)}px`,
}));

/* ─── Pebble gradient definitions ─── */
const PEBBLE_GRADIENTS_CORAL = [
  { id: 'pc0', light: '#e2d4ba', mid: '#b0987a', dark: '#6e5a3e' },
  { id: 'pc1', light: '#d8cec0', mid: '#a89888', dark: '#6a5e52' },
  { id: 'pc2', light: '#ccd4d8', mid: '#8ea2a8', dark: '#546068' },
  { id: 'pc3', light: '#dac8b8', mid: '#a88870', dark: '#6a5040' },
  { id: 'pc4', light: '#d0c8ba', mid: '#9c9082', dark: '#5e5448' },
  { id: 'pc5', light: '#c8d8dc', mid: '#8aaab0', dark: '#4e6a70' },
  { id: 'pc6', light: '#e0d0c0', mid: '#b4a080', dark: '#72604a' },
  { id: 'pc7', light: '#d4d0c8', mid: '#a0a098', dark: '#5e5e56' },
];

const PEBBLE_GRADIENTS_KELP = [
  { id: 'pk0', light: '#b8d0c0', mid: '#6a9a7a', dark: '#38584a' },
  { id: 'pk1', light: '#a8c4b4', mid: '#5e8a6e', dark: '#2e5040' },
  { id: 'pk2', light: '#c0d4c8', mid: '#78a88a', dark: '#40604e' },
  { id: 'pk3', light: '#b0ccc0', mid: '#649682', dark: '#364e42' },
  { id: 'pk4', light: '#a0b8b0', mid: '#5a8878', dark: '#2a4840' },
  { id: 'pk5', light: '#b8c8bc', mid: '#6e9080', dark: '#3c5244' },
];


const PEBBLES = Array.from({ length: 72 }, (_, i) => {
  const sizeVariant = i % 6;
  return {
    id: i,
    x: 0.5 + (i / 71) * 98 + Math.sin(i * 2.7) * 1.8 + Math.cos(i * 1.3) * 1.2,
    y: 82 + Math.abs(Math.sin(i * 1.9)) * 15 + (i % 3) * 1.5,
    rx: 1.6 + (sizeVariant < 2 ? 0.8 : sizeVariant < 4 ? 2.2 : 3.8) + Math.sin(i * 0.7) * 0.6,
    ry: 1.0 + (sizeVariant < 2 ? 0.5 : sizeVariant < 4 ? 1.4 : 2.4) + Math.cos(i * 0.9) * 0.4,
    rot: (i * 53) % 170,
    opacity: 0.82 + (i % 5) * 0.036,
    gradIdx: i % 8,
  };
});

/* ─── Coral SVG pebble scatter ─── */
const CORAL_SVG_PEBBLES = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  left: 1 + (i / 31) * 97 + Math.sin(i * 2.3) * 2.2,
  bottom: Math.abs(Math.sin(i * 1.7)) * 5,
  scale: 0.75 + (i % 5) * 0.18 + Math.abs(Math.sin(i * 0.9)) * 0.1,
  type: i % 3 as 0 | 1 | 2,
  opacity: 0.72 + (i % 4) * 0.07,
}));

/* ─── Plant renderer ─── */
function PlantEl({ spec, isDarkMode, isDreams }: { spec: PlantSpec; isDarkMode?: boolean; isDreams?: boolean }) {
  const html = scaleSvgTo(spec.raw, spec.targetW);
  const swayAnim = `plant-sway-${spec.swayType} ${spec.swayDur}s ease-in-out ${spec.swayDelay}s infinite alternate`;

  const inner = (
    <div
      style={{
        transformOrigin: 'bottom center',
        animation: swayAnim,
        lineHeight: 0,
        opacity: isDreams ? (isDarkMode ? 0.52 : 0.68) : isDarkMode ? 0.45 : 0.85,
        filter: isDreams
          ? (isDarkMode
              ? 'saturate(0.90) brightness(0.42) hue-rotate(28deg)'
              : 'saturate(0.95) brightness(0.72) hue-rotate(28deg)')
          : isDarkMode
            ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.4)) saturate(0.2) hue-rotate(-10deg) brightness(0.38)'
            : 'drop-shadow(0 1px 3px rgba(0,0,0,0.12)) saturate(0.4) hue-rotate(-10deg) brightness(0.75)',
        transition: 'opacity 0.5s ease, filter 0.5s ease',
      }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  return (
    <div style={{ position: 'absolute', bottom: 0, left: spec.left, zIndex: spec.zIndex, pointerEvents: 'none' }}>
      {spec.mirror ? <div style={{ transform: 'scaleX(-1)' }}>{inner}</div> : inner}
    </div>
  );
}

/* ─── Turtle ─── */
const TURTLE_SVG = scaleSvgTo(turtleRaw, 110);
const SANDCASTLE_SVG = scaleSvgTo(sandcastleRaw, 200);
const KELP_TREE_SVG  = scaleSvgTo(kelpTreeRaw,  260);
const LEAF_A_SVG = scaleSvgTo(leafIconARaw, 210);
const LEAF_B_SVG = scaleSvgTo(leafIconBRaw, 148);

const CREEPERS_SVG   = creepersRaw
  .replace(/(<svg[^>]*?)\s+width="[^"]*"/, '$1 width="100%"')
  .replace(/(<svg[^>]*?)\s+height="[^"]*"/, '$1 height="auto"');


function TurtleWithBubble() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        position: 'relative',
        cursor: 'pointer',
        display: 'inline-block',
        animation: hovered ? 'turtle-hover-lift 0.3s ease-out forwards' : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          marginBottom: 10,
          background: 'rgba(248,242,228,0.97)',
          borderRadius: 10,
          padding: '8px 13px',
          fontSize: 13,
          color: '#3a2008',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          border: '1.5px solid #c0a070',
          fontFamily: "'Lora', serif",
          fontStyle: 'italic',
          pointerEvents: 'none',
          zIndex: 40,
        }}>
          I was promised snacks.
          <div style={{
            position: 'absolute', bottom: -8, right: 22,
            width: 0, height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: '8px solid rgba(248,242,228,0.97)',
          }}/>
          <div style={{
            position: 'absolute', bottom: -9, right: 21,
            width: 0, height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '9px solid #c0a070',
            zIndex: -1,
          }}/>
        </div>
      )}
      <div
        style={{ filter: 'sepia(0.25) hue-rotate(8deg) saturate(1.3) brightness(0.88) contrast(1.05) drop-shadow(0 2px 8px rgba(40,20,0,0.3))' }}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: TURTLE_SVG }}
      />
    </div>
  );
}

/* ─── Dreams pebble gradients — blue-purple-mauve ─── */
const PEBBLE_GRADIENTS_DREAMS = [
  { id: 'pd0', light: '#c8c8e8', mid: '#8080c8', dark: '#3838a0' },
  { id: 'pd1', light: '#d0c0e0', mid: '#9070c0', dark: '#503090' },
  { id: 'pd2', light: '#c0c8e0', mid: '#7080c8', dark: '#304098' },
  { id: 'pd3', light: '#d8c0d8', mid: '#a070b0', dark: '#603080' },
  { id: 'pd4', light: '#c8cce8', mid: '#7888c8', dark: '#3848a8' },
  { id: 'pd5', light: '#dcc0c8', mid: '#a07890', dark: '#704060' },
];

/* ─── Ship SVG (precomputed at ~75% of ~500px tank = 375px height) ─── */
// ship.svg viewport: 842×897 → aspect 0.939
const SHIP_SVG = (() => {
  const targetH = 460;
  const targetW = Math.round(targetH * (842 / 897));
  return shipRaw
    .replace(/(<svg[^>]*?)\s+width="[^"]*"/, `$1 width="${targetW}"`)
    .replace(/(<svg[^>]*?)\s+height="[^"]*"/, `$1 height="${targetH}"`);
})();

/* ─── Dreams back-layer botanical backdrop (abstract-shapes-1.svg 2874×1585) ─── */
// Slightly bigger than before — further back visually via lower opacity/z-index
// width 460 → height ≈ 254px
const DREAM_BACKDROP_SVG = (() => {
  const targetW = 460;
  const targetH = Math.round(targetW * (1585 / 2874));
  return dreamBackdropRaw
    .replace(/(<svg[^>]*?)\s+width="[^"]*"/, `$1 width="${targetW}"`)
    .replace(/(<svg[^>]*?)\s+height="[^"]*"/, `$1 height="${targetH}"`);
})();

/* ─── Gem SVGs (each scaled to ~28px wide, aspect-proportioned) ─── */
const GEM_SVGS: Record<string, string> = {
  lucia:    scaleSvgTo(gemLuciaRaw,    28),
  memora:   scaleSvgTo(gemMemoraRaw,   28),
  umbra:    scaleSvgTo(gemUmbraRaw,    28),
  fantasia: scaleSvgTo(gemFantasiaRaw, 28),
  oddia:    scaleSvgTo(gemOddiaRaw,    28),
  oraclea:  scaleSvgTo(gemOracleaRaw,  28),
};

/* ─── Sparkles for Dreams theme ─── */
const DREAM_SPARKLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: 4 + (i / 27) * 92 + Math.sin(i * 2.1) * 4,
  y: 5 + (i / 27) * 75 + Math.cos(i * 1.8) * 6,
  size: 1.5 + (i % 4) * 1.2,
  dur: 2.5 + (i % 5) * 0.8,
  delay: -(i * 0.4),
}));

/* ─── Extra bubbles for Dreams theme — varied sizes ─── */
const DREAM_BUBBLES = Array.from({ length: 14 }, (_, i) => ({
  id: i + 300,
  x: 1 + (i / 13) * 97 + Math.sin(i * 3.1) * 3,
  size: 2.5 + (i % 7) * 3.2,
  dur: 4 + (i % 9) * 1.4,
  delay: -(i * 0.65),
  bx: `${(Math.sin(i * 1.7) > 0 ? 1 : -1) * (4 + (i % 6) * 4)}px`,
}));

/* ─── Fireflies for Dreams theme ─── */
const FIREFLIES = Array.from({ length: 18 }, (_, i) => {
  const seed = i * 137.508; // golden angle seeding
  return {
    id: i,
    // Start position — scattered across swim zone
    startX: 5 + ((seed * 7.3) % 90),
    startY: 8 + ((seed * 3.7) % 72),
    // Drift destinations
    dx: ((Math.sin(seed) * 18) + (i % 2 === 0 ? 12 : -12)),
    dy: ((Math.cos(seed) * 14) + (i % 3 === 0 ? 10 : -8)),
    dx2: ((Math.sin(seed + 1) * 25) + (i % 2 === 0 ? -8 : 16)),
    dy2: ((Math.cos(seed + 1) * 18) + (i % 3 === 0 ? -12 : 6)),
    size: 1.0 + (i % 5) * 0.6 + Math.abs(Math.sin(i * 1.7)) * 0.9,
    driftDur: 5 + (i % 7) * 1.4,
    pulseDur: 1.8 + (i % 5) * 0.5,
    delay: -(i * 0.9),
    pulseDelay: -(i * 0.4),
    // Color variant: mostly warm green-white, occasional blue-white
    colorVar: i % 5,
  };
});

/* ─── Main Aquarium ─── */
export function Aquarium({
  children,
  containerRef,
  gems = [],
  isDarkMode = false,
  entries = [],
  tankType,
  showThemeSelector,
  initialTheme,
  onThemeChange,
  onGemMove,
}: {
  children?: React.ReactNode;
  containerRef?: RefObject<HTMLDivElement | null>;
  isDarkMode?: boolean;
  entries?: Entry[];
  tankType?: 'journal' | 'dreams';
  showThemeSelector?: boolean;
  initialTheme?: AquariumTheme;
  onThemeChange?: (theme: AquariumTheme) => void;
  onGemMove?: (id: string, newXPct: number) => void;
  gems?: Array<{ id: string; emotionId: string; xPct: number; fishYPct?: number }>;
}) {
  const [theme, setTheme] = useState<AquariumTheme>(initialTheme ?? (tankType === 'dreams' ? 'dreams' : 'coral'));
  const showSelector = showThemeSelector !== false;

  // Gem drag state
  const [draggingGem, setDraggingGem] = useState<{
    id: string; x: number; y: number; offsetX: number; offsetY: number; tiltDeg: number;
  } | null>(null);
  const [droppingGems, setDroppingGems] = useState<Record<string, { xPct: number; dropFromPx: number; tiltDeg: number }>>({});
  const draggingGemRef = useRef(draggingGem);
  draggingGemRef.current = draggingGem;
  const onGemMoveRef = useRef(onGemMove);
  onGemMoveRef.current = onGemMove;

  // Global pointer handlers so drag works even when gem div re-renders
  useEffect(() => {
    if (!draggingGem) return;
    function onMove(e: PointerEvent) {
      const dg = draggingGemRef.current;
      if (!dg || !containerRef?.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Keep the exact click point under the pointer
      setDraggingGem(prev => prev ? {
        ...prev,
        x: e.clientX - rect.left - prev.offsetX,
        y: e.clientY - rect.top  - prev.offsetY,
      } : null);
    }
    function onUp(e: PointerEvent) {
      const dg = draggingGemRef.current;
      if (!dg || !containerRef?.current) return;
      const containerEl = containerRef.current;
      const rect = containerEl.getBoundingClientRect();
      const containerH = containerEl.offsetHeight;
      const containerW = containerEl.offsetWidth;
      const relX = e.clientX - rect.left;

      const newXPct = Math.max(3, Math.min(95, (relX / containerW) * 100));
      // gem center Y when released (in container coords)
      const relY = dg.y; // dg.y is already the gem-center Y
      // floor gem-center ≈ containerH * 0.97 - 14px (half gem height)
      const floorCenterY = containerH * 0.97 - 14;
      const dropFromPx = relY - floorCenterY; // negative = above floor

      onGemMoveRef.current?.(dg.id, newXPct);
      const gemId = dg.id;
      const tiltDeg = dg.tiltDeg;
      setDroppingGems(prev => ({ ...prev, [gemId]: { xPct: newXPct, dropFromPx, tiltDeg } }));
      setTimeout(() => {
        setDroppingGems(prev => { const n = { ...prev }; delete n[gemId]; return n; });
      }, 1800);
      setDraggingGem(null);
    }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, [draggingGem?.id, containerRef]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGemPointerDown = useCallback((e: React.PointerEvent, gem: { id: string; xPct: number }, tiltDeg: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!containerRef?.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Grab gem at its exact center — compute center from the element's bounding rect
    const gemEl = e.currentTarget as HTMLElement;
    // Place gem center exactly under pointer (no offset) for precise dragging
    const ptrX = e.clientX - rect.left;
    const ptrY = e.clientY - rect.top;
    setDraggingGem({ id: gem.id, x: ptrX, y: ptrY, offsetX: 0, offsetY: 0, tiltDeg });
  }, [containerRef]);

  function changeTheme(t: AquariumTheme) {
    setTheme(t);
    onThemeChange?.(t);
  }

  // Theme-specific configurations
  const themeConfig = {
    coral: {
      plants: PLANTS_CORAL,
      pebbleColors: PEBBLE_GRADIENTS_CORAL,
      lightBg: 'linear-gradient(180deg, #7fc5d5 0%, #6bb5ca 22%, #90c6e6 48%, #6eb4dd 74%, #5aa4d4 100%)',
      darkBg: 'linear-gradient(180deg, #0a3240 0%, #0b3847 15%, #0c3e4e 30%, #0d4455 45%, #0e4a5c 60%, #0d4251 75%, #0b3a47 90%, #09303c 100%)',
      lightSubstrate: 'linear-gradient(180deg, rgba(160,225,240,0) 0%, rgba(140,210,228,0.5) 30%, #a0c8d4 62%, #88b8c8 100%)',
      darkSubstrate: 'linear-gradient(180deg, rgba(80,70,50,0) 0%, rgba(70,60,45,0.4) 30%, #5a4d3c 62%, #4a3d2c 100%)',
      depthOverlay: 'linear-gradient(180deg, rgba(5,30,50,0) 0%, rgba(10,40,60,0.15) 60%, rgba(5,25,45,0.30) 100%)',
      causticOpacity: isDarkMode ? 0.02 : 0.10,
      rayOpacity: isDarkMode ? 0.03 : 0.14,
      cloudOpacity: isDarkMode ? 0.08 : 0.25,
      waveOpacity: isDarkMode ? 0.03 : 0.12,
      glareOpacity: isDarkMode ? 0.05 : 0.15,
    },
    kelp: {
      plants: PLANTS_KELP,
      pebbleColors: PEBBLE_GRADIENTS_KELP,
      lightBg: 'linear-gradient(180deg, #6b9ea8 0%, #5d8f9a 22%, #7aa4b0 48%, #548592 74%, #4a7884 100%)',
      darkBg: 'linear-gradient(180deg, #192d34 0%, #1a3239 15%, #1b373e 30%, #1c3c43 45%, #1d4148 60%, #1c3a40 75%, #1a3238 90%, #182a30 100%)',
      lightSubstrate: 'linear-gradient(180deg, rgba(90,140,120,0) 0%, rgba(80,130,110,0.5) 30%, #708a7c 62%, #5a7468 100%)',
      darkSubstrate: 'linear-gradient(180deg, rgba(70,65,55,0) 0%, rgba(60,55,45,0.4) 30%, #504a3e 62%, #403a30 100%)',
      depthOverlay: 'linear-gradient(180deg, rgba(10,25,20,0) 0%, rgba(15,35,30,0.15) 60%, rgba(8,20,18,0.30) 100%)',
      causticOpacity: isDarkMode ? 0.02 : 0.10,
      rayOpacity: isDarkMode ? 0.03 : 0.14,
      cloudOpacity: isDarkMode ? 0.08 : 0.25,
      waveOpacity: isDarkMode ? 0.03 : 0.12,
      glareOpacity: isDarkMode ? 0.05 : 0.15,
    },
    dreams: {
      plants: PLANTS_DREAMS,
      pebbleColors: PEBBLE_GRADIENTS_DREAMS,
      // Light: retro periwinkle-blue — no green, cornflower-blue vintage feel
      lightBg: 'linear-gradient(180deg, #5068a8 0%, #445c9c 20%, #3a5090 42%, #30447e 64%, #28386c 84%, #1e2c5a 100%)',
      // Dark: deep retro indigo — rich, slightly warm midnight
      darkBg:  'linear-gradient(180deg, #180c30 0%, #140a2a 25%, #110824 50%, #0d061e 75%, #09041a 100%)',
      lightSubstrate: 'linear-gradient(180deg, rgba(52,38,18,0) 0%, rgba(48,34,14,0.14) 22%, rgba(44,30,12,0.38) 48%, rgba(50,36,14,0.70) 72%, rgba(40,28,10,0.88) 100%)',
      darkSubstrate:  'linear-gradient(180deg, rgba(28,20,8,0) 0%, rgba(25,18,6,0.12) 22%, rgba(22,16,5,0.38) 48%, rgba(24,17,6,0.72) 72%, rgba(18,12,4,0.88) 100%)',
      depthOverlay: isDarkMode
        ? 'linear-gradient(180deg, rgba(4,4,20,0) 0%, rgba(4,4,24,0.16) 60%, rgba(3,3,18,0.34) 100%)'
        : 'linear-gradient(180deg, rgba(20,20,80,0) 0%, rgba(20,20,80,0.10) 60%, rgba(16,16,70,0.22) 100%)',
      causticOpacity: isDarkMode ? 0.07 : 0.14,
      rayOpacity:     isDarkMode ? 0.09 : 0.20,
      cloudOpacity:   isDarkMode ? 0.45 : 0.50,
      waveOpacity:    isDarkMode ? 0.07 : 0.10,
      glareOpacity:   isDarkMode ? 0.08 : 0.14,
    },
  };

  const config = themeConfig[theme];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        flex: 1,
        height: '100%',
        overflow: 'hidden',
        borderRadius: 14,
        background: isDarkMode ? config.darkBg : config.lightBg,
        transition: 'background 0.5s ease',
        '--aq-h': containerRef?.current ? `${containerRef.current.offsetHeight}px` : '500px',
      } as React.CSSProperties}
    >
      <style>{KEYFRAMES}</style>

      {/* Theme Selector — hidden for Dreams tank and in preview mode */}
      {showSelector && tankType !== 'dreams' && (
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 110,
          display: 'flex',
          gap: 10,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '8px 12px',
          borderRadius: 20,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)',
          border: '1px solid rgba(255,255,255,0.22)',
        }}>
          <button
            onClick={() => changeTheme('coral')}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: theme === 'coral' ? '3px solid #5aa4d4' : '2px solid #b8cdd8',
              background: 'linear-gradient(135deg, #7fc5d5 0%, #5aa4d4 100%)',
              cursor: 'pointer',
              boxShadow: theme === 'coral' ? '0 0 0 2px rgba(90,164,212,0.3)' : 'none',
              transition: 'all 0.2s ease', position: 'relative',
            }}
            title="Coral Garden"
          >
            {theme === 'coral' && <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}/>}
          </button>
          <button
            onClick={() => changeTheme('kelp')}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: theme === 'kelp' ? '3px solid #4a7884' : '2px solid #8a9a94',
              background: 'linear-gradient(135deg, #6b9ea8 0%, #4a7884 100%)',
              cursor: 'pointer',
              boxShadow: theme === 'kelp' ? '0 0 0 2px rgba(74,120,132,0.3)' : 'none',
              transition: 'all 0.2s ease', position: 'relative',
            }}
            title="Kelp Forest"
          >
            {theme === 'kelp' && <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}/>}
          </button>
        </div>
      )}

      {/* Caustic shimmer */}
      {[
        { cx:'28%', cy:'18%', rx:'20%', ry:'11%', delay:0   },
        { cx:'62%', cy:'32%', rx:'17%', ry:'9%',  delay:2   },
        { cx:'48%', cy:'58%', rx:'22%', ry:'8%',  delay:4   },
        { cx:'18%', cy:'52%', rx:'13%', ry:'7%',  delay:1.5 },
        { cx:'78%', cy:'24%', rx:'15%', ry:'8%',  delay:3   },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute', top: c.cy, left: c.cx,
          width: c.rx, height: c.ry,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
          animation: `caustic ${5 + i * 0.8}s ease-in-out ${c.delay}s infinite`,
          pointerEvents: 'none',
          opacity: config.causticOpacity,
        }}/>
      ))}

      {/* Light rays */}
      {[10, 24, 40, 57, 70, 84].map((left, i) => (
        <div key={i} style={{
          position: 'absolute', top: 0,
          left: `${left}%`,
          width: `${2 + (i % 3) * 1.0}%`,
          height: '65%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
          transform: `skewX(${-8 + i * 3}deg)`,
          transformOrigin: 'top center',
          animation: `ray-pulse ${4.5 + i * 0.6}s ease-in-out ${i * 0.75}s infinite`,
          pointerEvents: 'none',
          opacity: config.rayOpacity,
        }}/>
      ))}

      {/* Ethereal clouds */}
      {[
        { x: '12%', y: '15%', w: 120, h: 60, dur: 18, delay: 0, dx: '25vw', dy: '-8vh' },
        { x: '65%', y: '25%', w: 90, h: 50, dur: 22, delay: -5, dx: '-20vw', dy: '6vh' },
        { x: '35%', y: '45%', w: 110, h: 55, dur: 20, delay: -10, dx: '18vw', dy: '-5vh' },
        { x: '80%', y: '35%', w: 85, h: 45, dur: 24, delay: -8, dx: '-30vw', dy: '10vh' },
        { x: '22%', y: '58%', w: 95, h: 48, dur: 19, delay: -12, dx: '22vw', dy: '-7vh' },
        { x: '55%', y: '50%', w: 100, h: 52, dur: 21, delay: -15, dx: '-25vw', dy: '8vh' },
      ].map((cloud, i) => (
        <div
          key={`cloud-${i}`}
          style={{
            position: 'absolute',
            left: cloud.x,
            top: cloud.y,
            width: cloud.w,
            height: cloud.h,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(180,235,255,0.35) 0%, rgba(150,220,240,0.12) 40%, transparent 70%)',
            filter: 'blur(18px)',
            transform: 'translate(-50%, -50%)',
            animation: `cloud-drift ${cloud.dur}s ease-in-out ${cloud.delay}s infinite`,
            '--cloud-dx': cloud.dx,
            '--cloud-dy': cloud.dy,
            pointerEvents: 'none',
            zIndex: 2,
            opacity: config.cloudOpacity,
          } as React.CSSProperties}
        />
      ))}

      {/* Pulsing clouds */}
      {[
        { x: '18%', y: '30%', w: 70, dur: 8 },
        { x: '72%', y: '42%', w: 60, dur: 9.5 },
        { x: '45%', y: '20%', w: 65, dur: 7.5 },
        { x: '88%', y: '55%', w: 55, dur: 10 },
      ].map((cloud, i) => (
        <div
          key={`cloud-pulse-${i}`}
          style={{
            position: 'absolute',
            left: cloud.x,
            top: cloud.y,
            width: cloud.w,
            height: cloud.w * 0.6,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(200,245,255,0.25) 0%, rgba(170,230,250,0.08) 50%, transparent 100%)',
            filter: 'blur(14px)',
            transform: 'translate(-50%, -50%)',
            animation: `cloud-pulse ${cloud.dur}s ease-in-out ${-i * 2}s infinite`,
            pointerEvents: 'none',
            zIndex: 2,
          } as React.CSSProperties}
        />
      ))}

      {/* Flowing waves */}
      {[
        { y: '18%', delay: 0 },
        { y: '45%', delay: -5 },
        { y: '68%', delay: -10 },
      ].map((wave, i) => (
        <div
          key={`wave-${i}`}
          style={{
            position: 'absolute',
            top: wave.y,
            left: 0,
            width: '200%',
            height: '8%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(180,230,255,0.08) 25%, rgba(150,215,240,0.12) 50%, rgba(180,230,255,0.08) 75%, transparent 100%)',
            filter: 'blur(8px)',
            animation: `wave-flow ${15 + i * 3}s linear ${wave.delay}s infinite`,
            pointerEvents: 'none',
            zIndex: 1,
            opacity: config.waveOpacity,
          }}
        />
      ))}

      {/* Glare sweeps */}
      {[
        { delay: 0, dur: 18 },
        { delay: -9, dur: 20 },
      ].map((glare, i) => (
        <div
          key={`glare-${i}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            filter: 'blur(30px)',
            animation: `glare-sweep ${glare.dur}s ease-in-out ${glare.delay}s infinite`,
            pointerEvents: 'none',
            zIndex: 3,
            opacity: config.glareOpacity,
          }}
        />
      ))}

      {/* Bubbles */}
      {BUBBLES.map(b => (
        <div key={b.id} style={{
          position: 'absolute',
          bottom: '16%', left: `${b.x}%`,
          width: b.size, height: b.size,
          borderRadius: '50%',
          border: theme === 'dreams'
            ? '1.5px solid rgba(180,190,255,0.70)'
            : '1.5px solid rgba(255,255,255,0.72)',
          background: theme === 'dreams'
            ? 'radial-gradient(circle at 35% 32%, rgba(210,215,255,0.55), rgba(140,150,255,0.08))'
            : 'radial-gradient(circle at 35% 32%, rgba(255,255,255,0.55), rgba(200,240,255,0.08))',
          animation: `bubble-rise ${b.dur}s linear ${b.delay}s infinite`,
          '--bx': b.bx,
          pointerEvents: 'none',
        } as React.CSSProperties}/>
      ))}

      {/* Dreams — yellow/white sparkles */}
      {theme === 'dreams' && DREAM_SPARKLES.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.size,
          height: s.size,
          borderRadius: '50%',
          background: s.id % 3 === 0
            ? 'rgba(230,230,255,0.92)'
            : s.id % 3 === 1
              ? 'rgba(210,200,255,0.85)'
              : 'rgba(240,220,255,0.88)',
          boxShadow: `0 0 ${s.size * 2.5}px ${s.size * 1.2}px ${s.id % 2 === 0 ? 'rgba(180,170,255,0.40)' : 'rgba(200,160,255,0.35)'}`,
          animation: `sparkle-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          pointerEvents: 'none',
          zIndex: 3,
        }}/>
      ))}

      {/* Dreams — many varied bubbles */}
      {theme === 'dreams' && DREAM_BUBBLES.map(b => (
        <div key={b.id} style={{
          position: 'absolute',
          bottom: '16%', left: `${b.x}%`,
          width: b.size, height: b.size,
          borderRadius: '50%',
          border: `${b.size > 12 ? '2px' : '1.5px'} solid rgba(200,180,255,0.60)`,
          background: 'radial-gradient(circle at 33% 28%, rgba(240,220,255,0.50), rgba(180,140,255,0.06))',
          animation: `bubble-rise ${b.dur}s linear ${b.delay}s infinite`,
          '--bx': b.bx,
          pointerEvents: 'none',
        } as React.CSSProperties}/>
      ))}

      {/* Dreams — pale yellow firefly orbs (zIndex 8: below fish zone at 10, so never covers the empty-state card) */}
      {theme === 'dreams' && FIREFLIES.map(ff => {
        // All pale yellow shades — slight variation between warm cream, lemon, soft gold
        const dotColor = [
          'rgba(255,248,180,0.95)',
          'rgba(255,244,160,0.90)',
          'rgba(252,240,190,0.92)',
          'rgba(255,252,200,0.88)',
          'rgba(248,236,150,0.90)',
        ][ff.colorVar];
        const glowColor = [
          'rgba(255,240,120,0.60)',
          'rgba(255,235,100,0.55)',
          'rgba(250,235,140,0.58)',
          'rgba(255,248,160,0.52)',
          'rgba(245,228,100,0.55)',
        ][ff.colorVar];
        return (
          <div
            key={`ff-${ff.id}`}
            style={{
              position: 'absolute',
              left: `${ff.startX}%`,
              top: `${ff.startY}%`,
              width: ff.size,
              height: ff.size,
              borderRadius: '50%',
              background: dotColor,
              boxShadow: `0 0 ${ff.size * 3}px ${ff.size * 1.8}px ${glowColor}`,
              animation: [
                `firefly-drift ${ff.driftDur}s ease-in-out ${ff.delay}s infinite`,
                `firefly-pulse ${ff.pulseDur}s ease-in-out ${ff.pulseDelay}s infinite`,
              ].join(', '),
              '--ffx':  `${ff.dx}px`,
              '--ffy':  `${ff.dy}px`,
              '--ffx2': `${ff.dx2}px`,
              '--ffy2': `${ff.dy2}px`,
              pointerEvents: 'none',
              zIndex: 8,
            } as React.CSSProperties}
          />
        );
      })}

      {/* Large bubbles — coral theme only */}
      {theme === 'coral' && BUBBLES_CORAL_BIG.map(b => (
        <div key={b.id} style={{
          position: 'absolute',
          bottom: '16%', left: `${b.x}%`,
          width: b.size, height: b.size,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.55)',
          background: 'radial-gradient(circle at 33% 30%, rgba(255,255,255,0.45), rgba(200,240,255,0.04))',
          animation: `bubble-rise ${b.dur}s linear ${b.delay}s infinite`,
          '--bx': b.bx,
          pointerEvents: 'none',
        } as React.CSSProperties}/>
      ))}

      {/* Fish swim zone */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: '22%', zIndex: 10,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {children}
      </div>

      {/* Substrate */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%',
        background: isDarkMode ? config.darkSubstrate : config.lightSubstrate,
        zIndex: 4,
      }}/>


      {/* Coral SVG pebbles — zIndex 4 (on top of substrate, below plants 5-8, below water 9) */}
      {theme === 'coral' && CORAL_SVG_PEBBLES.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            bottom: p.bottom,
            left: `${p.left}%`,
            zIndex: 4,
            opacity: isDarkMode ? p.opacity * 0.45 : p.opacity,
            transform: `scale(${p.scale})`,
            transformOrigin: 'bottom center',
            lineHeight: 0,
            pointerEvents: 'none',
            filter: isDarkMode ? 'brightness(0.5) saturate(0.4)' : 'brightness(1.8) saturate(0.6)',
            transition: 'opacity 0.5s ease, filter 0.5s ease',
          }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: [coralPebble1Raw, coralPebble2Raw, coralPebble3Raw][p.type] }}
        />
      ))}

      {/* Dreams — botanical backdrop: left corner, pushed further back (z1, behind ship) */}
      {theme === 'dreams' && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          zIndex: 1, lineHeight: 0, pointerEvents: 'none',
          opacity: isDarkMode ? 0.32 : 0.45,
          filter: isDarkMode
            ? 'saturate(0.55) brightness(0.16) hue-rotate(55deg) blur(0.8px)'
            : 'saturate(0.65) brightness(0.38) hue-rotate(55deg) blur(0.6px)',
        }} dangerouslySetInnerHTML={{ __html: DREAM_BACKDROP_SVG }}/>
      )}

      {/* Dreams — sandy pebbles at the base (reuse coral pebble SVGs with sand-coloured filter) */}
      {theme === 'dreams' && CORAL_SVG_PEBBLES.map(p => (
        <div
          key={`dp-${p.id}`}
          style={{
            position: 'absolute',
            bottom: p.bottom,
            left: `${p.left}%`,
            zIndex: 5,
            opacity: isDarkMode ? p.opacity * 0.70 : p.opacity * 0.90,
            transform: `scale(${p.scale * 1.05})`,
            transformOrigin: 'bottom center',
            lineHeight: 0,
            pointerEvents: 'none',
            filter: isDarkMode
              ? 'saturate(0.50) brightness(0.30) sepia(0.55) contrast(1.2)'
              : 'saturate(0.55) brightness(0.75) sepia(0.50) contrast(1.15)',
          }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: [coralPebble1Raw, coralPebble2Raw, coralPebble3Raw][p.type] }}
        />
      ))}

      {/* Plants — rendered BEFORE water overlay so dreams plants (z7-8) sit behind it */}
      {config.plants.map((p, i) => <PlantEl key={i} spec={p} isDarkMode={isDarkMode} isDreams={theme === 'dreams'} />)}

      {/* Water layer overlay - tones down things behind it */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0, height: '100%',
        background: theme === 'dreams'
          ? (isDarkMode
              ? 'linear-gradient(180deg, rgba(3,3,18,0.05) 0%, rgba(4,4,22,0.12) 40%, rgba(3,3,18,0.22) 75%, rgba(2,2,14,0.34) 100%)'
              : 'linear-gradient(180deg, rgba(20,20,80,0.05) 0%, rgba(20,20,80,0.10) 40%, rgba(16,16,70,0.18) 75%, rgba(12,12,60,0.26) 100%)')
          : 'linear-gradient(180deg, rgba(90,180,200,0.08) 0%, rgba(80,160,190,0.15) 40%, rgba(70,140,170,0.25) 75%, rgba(60,120,150,0.35) 100%)',
        zIndex: 9,
        pointerEvents: 'none',
      }}/>

      {/* Dreams — ship: true floor level (bottom:0 so substrate covers hull base), right-of-centre */}
      {theme === 'dreams' && (
        <div style={{
          position: 'absolute',
          bottom: 0,       // anchored to tank floor — substrate covers hull base
          right: '8%',     // slightly left of right edge so full silhouette is visible
          zIndex: 2,
          lineHeight: 0, pointerEvents: 'none',
          opacity: isDarkMode ? 0.60 : 0.42,
          filter: isDarkMode
            ? 'saturate(0.40) brightness(0.60) hue-rotate(210deg) drop-shadow(0 8px 30px rgba(20,30,120,0.75))'
            : 'saturate(0.50) brightness(0.80) hue-rotate(210deg) drop-shadow(0 8px 30px rgba(30,50,180,0.50))',
        }} dangerouslySetInnerHTML={{ __html: SHIP_SVG }}/>
      )}

      {/* Dreams — magical color washes (blue, purple, rose-pink) */}
      {theme === 'dreams' && (() => {
        const m = isDarkMode ? 1.25 : 1;
        return (
          <>
            {/* Retro dusty violet — upper left */}
            <div style={{
              position: 'absolute', top: '-20%', left: '-12%',
              width: '70%', height: '68%', borderRadius: '50%',
              background: `radial-gradient(ellipse at 42% 42%, rgba(110,70,180,${(0.42*m).toFixed(2)}) 0%, rgba(90,55,160,${(0.20*m).toFixed(2)}) 40%, transparent 70%)`,
              filter: 'blur(52px)', animation: 'dream-orb-a 16s ease-in-out infinite',
              pointerEvents: 'none', zIndex: 3,
            }}/>
            {/* Retro dusty rose — upper right */}
            <div style={{
              position: 'absolute', top: '-10%', right: '-8%',
              width: '58%', height: '60%', borderRadius: '50%',
              background: `radial-gradient(ellipse at 55% 38%, rgba(185,80,130,${(0.36*m).toFixed(2)}) 0%, rgba(165,65,115,${(0.18*m).toFixed(2)}) 42%, transparent 72%)`,
              filter: 'blur(56px)', animation: 'dream-orb-b 20s ease-in-out infinite',
              pointerEvents: 'none', zIndex: 3,
            }}/>
            {/* Retro muted teal — center */}
            <div style={{
              position: 'absolute', top: '28%', left: '18%',
              width: '62%', height: '50%', borderRadius: '50%',
              background: `radial-gradient(ellipse at 50% 50%, rgba(55,95,160,${(0.30*m).toFixed(2)}) 0%, rgba(40,78,140,${(0.14*m).toFixed(2)}) 48%, transparent 74%)`,
              filter: 'blur(58px)', animation: 'dream-orb-c 24s ease-in-out infinite',
              pointerEvents: 'none', zIndex: 3,
            }}/>
            {/* Retro mauve — bottom right */}
            <div style={{
              position: 'absolute', bottom: '6%', right: '-2%',
              width: '52%', height: '50%', borderRadius: '50%',
              background: `radial-gradient(ellipse at 50% 58%, rgba(140,70,180,${(0.38*m).toFixed(2)}) 0%, rgba(120,55,160,${(0.18*m).toFixed(2)}) 46%, transparent 72%)`,
              filter: 'blur(48px)', animation: 'dream-orb-d 18s ease-in-out infinite',
              pointerEvents: 'none', zIndex: 3,
            }}/>
            {/* Retro dusky coral — bottom left */}
            <div style={{
              position: 'absolute', bottom: '8%', left: '-6%',
              width: '48%', height: '48%', borderRadius: '50%',
              background: `radial-gradient(ellipse at 42% 55%, rgba(175,70,120,${(0.32*m).toFixed(2)}) 0%, rgba(155,55,105,${(0.15*m).toFixed(2)}) 46%, transparent 72%)`,
              filter: 'blur(50px)', animation: 'dream-orb-a 22s ease-in-out -8s infinite',
              pointerEvents: 'none', zIndex: 3,
            }}/>
          </>
        );
      })()}

      {/* Dreams dark mode — lots more bubbles */}
      {theme === 'dreams' && isDarkMode && DREAM_BUBBLES_DARK.map(b => (
        <div key={b.id} style={{
          position: 'absolute',
          bottom: '14%', left: `${b.x}%`,
          width: b.size, height: b.size,
          borderRadius: '50%',
          border: `${b.size > 10 ? '1.5px' : '1px'} solid rgba(180,180,255,0.55)`,
          background: 'radial-gradient(circle at 32% 28%, rgba(220,220,255,0.45), rgba(140,120,255,0.06))',
          animation: `bubble-rise ${b.dur}s linear ${b.delay}s infinite`,
          '--bx': b.bx,
          pointerEvents: 'none',
        } as React.CSSProperties}/>
      ))}

      {/* Coral Garden Decorations */}
      {theme === 'coral' && theme !== 'dreams' && (
        <>
          {/* Sandcastle - HUGE at the back */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '5%',
            zIndex: 5,
            lineHeight: 0,
            opacity: isDarkMode ? 0.35 : 0.72,
            filter: isDarkMode
              ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.5)) brightness(0.32) saturate(0.3)'
              : 'drop-shadow(0 4px 12px rgba(0,0,0,0.25)) brightness(0.82)',
            pointerEvents: 'none',
            transform: 'scale(1.8)',
            transformOrigin: 'bottom left',
            transition: 'opacity 0.5s ease, filter 0.5s ease',
            maskImage: 'linear-gradient(to top, transparent 0%, black 28%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 28%)',
          }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: SANDCASTLE_SVG }}
          />

        </>
      )}

      {/* Kelp Forest Decorations */}
      {theme === 'kelp' && (
        <>
          {/* Background corner plants — half-height, faded, behind all other plants */}
          <div style={{
            position: 'absolute', bottom: 0, left: '1%', zIndex: 1, lineHeight: 0,
            opacity: isDarkMode ? 0.18 : 0.30,
            filter: 'saturate(0.35) brightness(0.68)',
            pointerEvents: 'none',
            transition: 'opacity 0.5s ease, filter 0.5s ease',
          }} dangerouslySetInnerHTML={{ __html: LEAF_A_SVG }} />

          <div style={{
            position: 'absolute', bottom: 0, right: '1%', zIndex: 1, lineHeight: 0,
            opacity: isDarkMode ? 0.18 : 0.30,
            filter: 'saturate(0.35) brightness(0.68)',
            pointerEvents: 'none',
            transition: 'opacity 0.5s ease, filter 0.5s ease',
          }} dangerouslySetInnerHTML={{ __html: LEAF_B_SVG }} />

          {/* Creepers hanging from top — behind water overlay (zIndex 2 < water 9) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              lineHeight: 0,
              opacity: isDarkMode ? 0.18 : 0.38,
              filter: isDarkMode
                ? 'brightness(0.38) saturate(0.45) hue-rotate(5deg)'
                : 'brightness(0.82) saturate(0.7) hue-rotate(5deg)',
              pointerEvents: 'none',
              transition: 'opacity 0.5s ease, filter 0.5s ease',
            }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: CREEPERS_SVG }}
          />

          {/* Kelp tree landmark at bottom-right */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: '6%',
              zIndex: 5,
              lineHeight: 0,
              opacity: isDarkMode ? 0.30 : 0.68,
              filter: isDarkMode
                ? 'drop-shadow(0 4px 14px rgba(0,0,0,0.55)) brightness(0.28) saturate(0.25)'
                : 'drop-shadow(0 4px 14px rgba(0,0,0,0.22)) brightness(0.78) saturate(0.85)',
              pointerEvents: 'none',
              transform: 'scale(2.0)',
              transformOrigin: 'bottom right',
              transition: 'opacity 0.5s ease, filter 0.5s ease',
              maskImage: 'linear-gradient(to top, transparent 0%, black 28%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 28%)',
            }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: KELP_TREE_SVG }}
          />
        </>
      )}

      {/* Depth overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
        background: config.depthOverlay,
        zIndex: 7,
        pointerEvents: 'none',
      }}/>

      {/* Turtle — journal/kelp only */}
      {theme !== 'dreams' && (
        <div style={{ position: 'absolute', bottom: '2%', right: '8%', zIndex: 26 }}>
          <TurtleWithBubble />
        </div>
      )}

      {/* Scroll — journal/kelp only */}
      {theme !== 'dreams' && (
        <div style={{ position: 'absolute', bottom: '2%', right: '2%', zIndex: 26 }}>
          <AquariumScroll entries={entries} />
        </div>
      )}

      {/* Gems — dream fish unfolded; sit on the floor, draggable, fall on release */}
      {theme === 'dreams' && gems.map((gem, i) => {
        const isNewest = i === gems.length - 1 && !droppingGems[gem.id] && draggingGem?.id !== gem.id;
        const gemSvg = GEM_SVGS[gem.emotionId] ?? GEM_SVGS.lucia;
        const tiltDeg = ((i * 47 + 11) % 37) - 18;
        const isDraggingThis = draggingGem?.id === gem.id;
        const dropInfo = droppingGems[gem.id];
        const isDropping = !!dropInfo;

        // During drag: gem center follows pointer exactly (no jump from click offset)
        if (isDraggingThis && draggingGem) {
          return (
            <div key={gem.id} style={{
              position: 'absolute',
              left: draggingGem.x,
              top: draggingGem.y,
              zIndex: 30,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              cursor: 'grabbing',
              filter: 'drop-shadow(0 8px 22px rgba(160,130,255,0.7)) brightness(1.25)',
            }}>
              <div style={{ lineHeight: 0, transform: `rotate(${tiltDeg}deg)` }}
                dangerouslySetInnerHTML={{ __html: gemSvg }} />
            </div>
          );
        }

        // After release: slow gravity fall to floor
        if (isDropping) {
          return (
            <div key={gem.id} style={{
              position: 'absolute',
              left: `${dropInfo.xPct}%`,
              bottom: '3%',
              zIndex: 10,
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              '--gem-tilt': `${dropInfo.tiltDeg}deg`,
              '--gem-drop-from': `${dropInfo.dropFromPx}px`,
            } as React.CSSProperties}>
              <div style={{ lineHeight: 0, animation: 'gem-drop-to-floor 1.6s cubic-bezier(0.3,0,0.7,1) forwards' }}
                dangerouslySetInnerHTML={{ __html: gemSvg }} />
            </div>
          );
        }

        // Settled / newest-falling
        return (
          <div key={gem.id} style={{
            position: 'absolute',
            left: `${gem.xPct}%`,
            bottom: '3%',
            zIndex: 10,
            transform: 'translateX(-50%)',
            pointerEvents: 'all',
            cursor: 'grab',
            '--gem-tilt': `${tiltDeg}deg`,
            // --gem-start-y: offset from floor anchor to fish position (negative = above floor)
            // fish zone is top 78% of container; fishYPct is 0–100 within that zone
            // floor anchor is at 97% from top → offset = fishYPct * 0.78% - 97% of container
            '--gem-start-y': gem.fishYPct != null
              ? `calc((${gem.fishYPct} * 0.78 / 100 - 0.97) * var(--aq-h, 500px))`
              : '-170px',
          } as React.CSSProperties}
          onPointerDown={(e) => handleGemPointerDown(e, gem, tiltDeg)}
          >
            <div style={{
              lineHeight: 0,
              transform: isNewest ? undefined : `rotate(${tiltDeg}deg)`,
              animation: isNewest
                ? 'gem-fall 3.0s cubic-bezier(0.3,0,0.6,1) forwards'
                : 'gem-settled-pulse 3.5s ease-in-out infinite',
            }}
            dangerouslySetInnerHTML={{ __html: gemSvg }} />
          </div>
        );
      })}

      {/* Frame */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'none',
        borderRadius: 14,
        border: theme === 'dreams'
          ? (isDarkMode ? '6px solid rgba(10,12,50,0.75)' : '6px solid rgba(30,40,140,0.50)')
          : '6px solid rgba(30,60,80,0.35)',
        boxShadow: theme === 'dreams'
          ? (isDarkMode
              ? 'inset 0 2px 12px rgba(60,50,200,0.28), 0 4px 24px rgba(4,4,30,0.80)'
              : 'inset 0 2px 12px rgba(60,50,180,0.20), 0 4px 24px rgba(40,30,180,0.35)')
          : 'inset 0 2px 12px rgba(0,60,80,0.08), 0 4px 20px rgba(0,0,0,0.25)',
      }}/>
    </div>
  );
}