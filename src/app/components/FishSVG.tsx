import { FISH_COLORS, type EmotionId } from './emotions';

// Import real fish SVGs as raw strings so they inline reliably (no external fetch)
import happyRaw      from '../../imports/Happy-1.svg?raw';
import excitedRaw    from '../../imports/Excited-1.svg?raw';
import lovedRaw      from '../../imports/Loved.svg?raw';
import gratefulRaw   from '../../imports/Grateful.svg?raw';
import confidentRaw  from '../../imports/Confident-1.svg?raw';
import calmRaw       from '../../imports/Calm.svg?raw';
import lonelyRaw     from '../../imports/Lonely-1.svg?raw';
import anxiousRaw    from '../../imports/Anxious-1.svg?raw';
import angryRaw      from '../../imports/Group_17.svg?raw';
import cryingRaw     from '../../imports/Crying-1.svg?raw';
import meltingRaw    from '../../imports/pasted_text/abstract-shape-1.svg?raw';
import neutralRaw    from '../../imports/Neutral.svg?raw';
import sadRaw        from '../../imports/Sad.svg?raw';
import stressedRaw   from '../../imports/Stressed-1.svg?raw';
import thoughtfulRaw from '../../imports/Thoughtful.svg?raw';
import tiredRaw      from '../../imports/Tired.svg?raw';
import luciaRaw      from '../../imports/new_Lucia.svg?raw';
import memoraRaw     from '../../imports/new_Memora.svg?raw';
import umbraRaw      from '../../imports/Umbra_new_.svg?raw';
import fantasiaRaw   from '../../imports/new_Fantasia.svg?raw';
import oddiaRaw      from '../../imports/new_Oddia.svg?raw';
import oracleaRaw    from '../../imports/new_Oraclea.svg?raw';

const RAW_SVG: Partial<Record<EmotionId, string>> = {
  happy:     happyRaw,
  excited:   excitedRaw,
  loved:     lovedRaw,
  grateful:  gratefulRaw,
  confident: confidentRaw,
  calm:      calmRaw,
  lonely:    lonelyRaw,
  anxious:   anxiousRaw,
  angry:     angryRaw,
  crying:    cryingRaw,
  melting:   meltingRaw,
  neutral:   neutralRaw,
  sad:       sadRaw,
  stressed:  stressedRaw,
  thoughtful: thoughtfulRaw,
  tired:     tiredRaw,
  lucia:     luciaRaw,
  memora:    memoraRaw,
  umbra:     umbraRaw,
  fantasia:  fantasiaRaw,
  oddia:     oddiaRaw,
  oraclea:   oracleaRaw,
};

/** Extract viewBox aspect ratio from raw SVG string */
function getSvgAspect(raw: string): number {
  const m = raw.match(/viewBox="[^"]*?\s+([\d.]+)\s+([\d.]+)"/);
  if (m) return parseFloat(m[1]) / parseFloat(m[2]);
  // fallback: try width/height attributes
  const w = raw.match(/width="([\d.]+)"/);
  const h = raw.match(/height="([\d.]+)"/);
  if (w && h) return parseFloat(w[1]) / parseFloat(h[1]);
  return 3; // most fish SVGs are roughly 3:1
}

/** Patch the SVG string to use a specific pixel width (height auto via viewBox) */
function scaleSvg(raw: string, width: number): string {
  const aspect = getSvgAspect(raw);
  const height = Math.round(width / aspect);
  return raw
    .replace(/(<svg[^>]*?)\s+width="[^"]*"/, `$1 width="${width}"`)
    .replace(/(<svg[^>]*?)\s+height="[^"]*"/, `$1 height="${height}"`);
}

interface FishSVGProps {
  emotionId: EmotionId;
  /** Width in pixels. Height auto-computed from the SVG's aspect ratio. */
  width?: number;
  /** true = face LEFT, false = face RIGHT (default) */
  flipped?: boolean;
  style?: React.CSSProperties;
}

// Per-emotion size correction multipliers
const SIZE_MULT: Partial<Record<EmotionId, number>> = {
  fantasia: 1.30,
};

export function FishSVG({ emotionId, width = 180, flipped = false, style }: FishSVGProps) {
  const rawSvg = RAW_SVG[emotionId];
  const effectiveWidth = Math.round(width * (SIZE_MULT[emotionId] ?? 1));

  if (rawSvg) {
    // Real fish assets face LEFT by default in the SVG coordinate space.
    // We want facing=false (right-moving) to show the fish facing right,
    // so we mirror with scaleX(-1) when NOT flipped.
    const transform = flipped ? 'scaleX(1)' : 'scaleX(-1)';
    const scaledSvg = scaleSvg(rawSvg, effectiveWidth);

    return (
      <div className="bg-[#72464600] bg-[#72464600] bg-[#72464600] bg-[#7c4a4a00] bg-[#9b505000] bg-[#b64e4e00] bg-[#c54a4a00] bg-[#c8484800] bg-[#c8494900] bg-[#c8494900] bg-[#c74a4a00] bg-[#b75f5f00] bg-[#9c868600] bg-[#96909000] bg-[#94939300] bg-[#92929200] bg-[#93939300] bg-[#94949400] bg-[#9b898900] bg-[#a07a7a00] bg-[#a2757500] bg-[#a3717100] bg-[#a3717100]"
        style={{
          display: 'inline-block',
          lineHeight: 0,
          transform,
          ...style,
        }}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: scaledSvg }}
      />
    );
  }

  // ── Placeholder SVG for emotions without a real fish image yet ──
  const c = FISH_COLORS[emotionId];
  const height = Math.round(width * 0.72);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 130 94"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined, display: 'block', ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={`fish-body-${emotionId}`} cx="60%" cy="40%">
          <stop offset="0%" stopColor={c.stripe} stopOpacity="0.9" />
          <stop offset="70%" stopColor={c.body} stopOpacity="1" />
          <stop offset="100%" stopColor={c.body} stopOpacity="0.85" />
        </radialGradient>
        <linearGradient id={`fish-fin-${emotionId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.fin} stopOpacity="1" />
          <stop offset="100%" stopColor={c.fin} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <path d="M22,47 C14,28 2,14 0,6 C8,12 18,22 24,30 L24,64 C18,72 8,82 0,88 C2,80 14,66 22,47 Z"
        fill={`url(#fish-fin-${emotionId})`} stroke={c.outline} strokeWidth="1" />
      <ellipse cx="68" cy="47" rx="48" ry="34" fill={`url(#fish-body-${emotionId})`} stroke={c.outline} strokeWidth="1.5" />
      <ellipse cx="65" cy="47" rx="32" ry="31" fill={c.stripe} opacity="0.35" />
      <path d="M42,14 Q58,2 80,13 Q72,20 55,20 Q42,20 42,14 Z" fill={`url(#fish-fin-${emotionId})`} stroke={c.outline} strokeWidth="1" />
      <ellipse cx="56" cy="76" rx="17" ry="7" fill={`url(#fish-fin-${emotionId})`} stroke={c.outline} strokeWidth="1" opacity="0.85" />
      <ellipse cx="85" cy="38" rx="18" ry="22" fill="white" opacity="0.15" />
      <circle cx="58" cy="38" r="4.5" fill={c.dots} opacity="0.65" />
      <circle cx="46" cy="33" r="3" fill={c.dots} opacity="0.55" />
      <circle cx="52" cy="56" r="3.5" fill={c.dots} opacity="0.55" />
      <circle cx="70" cy="30" r="2.5" fill={c.dots} opacity="0.45" />
      <circle cx="72" cy="60" r="2" fill={c.dots} opacity="0.4" />
      <path d="M82,24 Q88,47 82,70" stroke={c.outline} strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="100" cy="38" r="11" fill="white" stroke={c.outline} strokeWidth="1" />
      <circle cx="101" cy="38" r="7" fill="#1a1a2e" />
      <circle cx="104" cy="35" r="2.8" fill="white" />
      <circle cx="99" cy="41" r="1.2" fill="white" opacity="0.6" />
      <path d="M116,50 Q122,55 116,59" stroke={c.outline} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="113" cy="46" r="1.5" fill={c.outline} opacity="0.5" />
    </svg>
  );
}