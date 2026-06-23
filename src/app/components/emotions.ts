export const EMOTIONS = [
  { id: 'happy',      name: 'Happy',      emoji: '😄' },
  { id: 'excited',    name: 'Excited',    emoji: '🤩' },
  { id: 'loved',      name: 'Loved',      emoji: '😍' },
  { id: 'grateful',   name: 'Grateful',   emoji: '🥹' },
  { id: 'confident',  name: 'Confident',  emoji: '😎' },
  { id: 'calm',       name: 'Calm',       emoji: '😌' },
  { id: 'melting',    name: 'Melting',    emoji: '🫠' },
  { id: 'thoughtful', name: 'Thoughtful', emoji: '🤔' },
  { id: 'neutral',    name: 'Neutral',    emoji: '😶' },
  { id: 'tired',      name: 'Tired',      emoji: '😴' },
  { id: 'lonely',     name: 'Lonely',     emoji: '😔' },
  { id: 'sad',        name: 'Sad',        emoji: '🥺' },
  { id: 'anxious',    name: 'Anxious',    emoji: '😰' },
  { id: 'stressed',   name: 'Stressed',   emoji: '😵' },
  { id: 'angry',      name: 'Angry',      emoji: '😡' },
  { id: 'crying',     name: 'Crying',     emoji: '😭' },
] as const;

export const DREAM_ELEMENTS = [
  { id: 'lucia',    name: 'Lucia',    emoji: '🌙' },
  { id: 'memora',   name: 'Memora',   emoji: '🦋' },
  { id: 'umbra',    name: 'Umbra',    emoji: '🌫️' },
  { id: 'fantasia', name: 'Fantasia', emoji: '✨' },
  { id: 'oddia',    name: 'Oddia',    emoji: '🎭' },
  { id: 'oraclea',  name: 'Oraclea',  emoji: '🔮' },
] as const;

export type JournalEmotionId = typeof EMOTIONS[number]['id'];
export type DreamElementId = typeof DREAM_ELEMENTS[number]['id'];
export type EmotionId = JournalEmotionId | DreamElementId;

export const EMOTION_COLORS: Record<EmotionId, string> = {
  happy:      '#F59E0B',
  excited:    '#EF4444',
  loved:      '#EC4899',
  grateful:   '#8B5CF6',
  confident:  '#3B82F6',
  calm:       '#10B981',
  melting:    '#FBBF24',
  thoughtful: '#6366F1',
  neutral:    '#9CA3AF',
  tired:      '#94A3B8',
  lonely:     '#64748B',
  sad:        '#60A5FA',
  anxious:    '#84CC16',
  stressed:   '#F97316',
  angry:      '#DC2626',
  crying:     '#7DD3FC',
  lucia:      '#C4B5FD',
  memora:     '#FDE68A',
  umbra:      '#94A3B8',
  fantasia:   '#FDE68A',
  oddia:      '#FDA4AF',
  oraclea:    '#A5F3FC',
};

export const FISH_COLORS: Record<EmotionId, { body: string; fin: string; stripe: string; dots: string; outline: string }> = {
  happy:      { body: '#FFE066', fin: '#FF6B35', stripe: '#FFDB4D', dots: '#FF3B3B',  outline: '#D97706' },
  excited:    { body: '#FFD699', fin: '#2E7BFF', stripe: '#FF9955', dots: '#FFE066',  outline: '#EA580C' },
  loved:      { body: '#FFB3E6', fin: '#FF1493', stripe: '#FF88D1', dots: '#FFF5CC',  outline: '#DB2777' },
  grateful:   { body: '#D4BBFF', fin: '#9747FF', stripe: '#BFA3FF', dots: '#F9F5FF',  outline: '#6D28D9' },
  confident:  { body: '#99CFFF', fin: '#0066FF', stripe: '#4DA6FF', dots: '#E6F4FF',  outline: '#1E40AF' },
  calm:       { body: '#80FFB3', fin: '#00CC66', stripe: '#4DFF99', dots: '#E6FFF2',  outline: '#047857' },
  melting:    { body: '#FFF266', fin: '#FFB300', stripe: '#FFE64D', dots: '#FFFBCC',  outline: '#CA8A04' },
  thoughtful: { body: '#B3C5FF', fin: '#5555FF', stripe: '#8CA3FF', dots: '#F0F3FF',  outline: '#3730A3' },
  neutral:    { body: '#E5E7EB', fin: '#6B7280', stripe: '#D1D5DB', dots: '#F9FAFB',  outline: '#4B5563' },
  tired:      { body: '#CCE5FF', fin: '#6B7280', stripe: '#A3D9FF', dots: '#F0F8FF',  outline: '#475569' },
  lonely:     { body: '#C2D3E6', fin: '#5A6B80', stripe: '#8CA3B8', dots: '#F1F5F9',  outline: '#334155' },
  sad:        { body: '#99D9FF', fin: '#0099FF', stripe: '#66C2FF', dots: '#E0F2FE',  outline: '#0369A1' },
  anxious:    { body: '#CCFF66', fin: '#7ACC00', stripe: '#B3FF4D', dots: '#F5FFE6',  outline: '#4D7C0F' },
  stressed:   { body: '#FFD699', fin: '#FF3333', stripe: '#FF8080', dots: '#FFE6E6',  outline: '#B91C1C' },
  angry:      { body: '#FF8080', fin: '#990000', stripe: '#FF4D4D', dots: '#FFE6E6',  outline: '#991B1B' },
  crying:     { body: '#99D9FF', fin: '#0080CC', stripe: '#66B3FF', dots: '#E0F2FE',  outline: '#075985' },
  lucia:      { body: '#DDD6FE', fin: '#7C3AED', stripe: '#C4B5FD', dots: '#EDE9FE',  outline: '#5B21B6' },
  memora:     { body: '#FDE68A', fin: '#D97706', stripe: '#FCD34D', dots: '#FFFBEB',  outline: '#92400E' },
  umbra:      { body: '#CBD5E1', fin: '#475569', stripe: '#94A3B8', dots: '#F1F5F9',  outline: '#334155' },
  fantasia:   { body: '#FEF3C7', fin: '#F59E0B', stripe: '#FDE68A', dots: '#FFFBEB',  outline: '#B45309' },
  oddia:      { body: '#FECDD3', fin: '#E11D48', stripe: '#FDA4AF', dots: '#FFF1F2',  outline: '#9F1239' },
  oraclea:    { body: '#CFFAFE', fin: '#0891B2', stripe: '#A5F3FC', dots: '#ECFEFF',  outline: '#164E63' },
};

export interface FishBehavior {
  baseSpeed: number;
  vertAmplitude: number;
  vertFreq: number;
  bottomBias: boolean;
  edgeBias: boolean;
  centerBias: boolean;
  circular: boolean;
  reverse: boolean;
  pauseInterval: number;
  pauseDuration: number;
  burstChance: number;
  burstMult: number;
  burstDuration: number;
  chaotic: boolean;
  stopStart: boolean;
}

export const BEHAVIORS: Record<EmotionId, FishBehavior> = {
  happy:      { baseSpeed: 160, vertAmplitude: 38, vertFreq: 2.5, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0.10, burstMult: 2.2, burstDuration: 0.7, chaotic: false, stopStart: false },
  excited:    { baseSpeed: 100, vertAmplitude: 25, vertFreq: 1.5, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0.30, burstMult: 3.5, burstDuration: 0.5, chaotic: false, stopStart: false },
  loved:      { baseSpeed: 70,  vertAmplitude: 0,  vertFreq: 0,   bottomBias: false, edgeBias: false, centerBias: false, circular: true,  reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  grateful:   { baseSpeed: 90,  vertAmplitude: 18, vertFreq: 1.0, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  confident:  { baseSpeed: 85,  vertAmplitude: 14, vertFreq: 0.7, bottomBias: false, edgeBias: false, centerBias: true,  circular: false, reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  calm:       { baseSpeed: 38,  vertAmplitude: 14, vertFreq: 0.5, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  melting:    { baseSpeed: 48,  vertAmplitude: 10, vertFreq: 0.8, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: true,  pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  thoughtful: { baseSpeed: 55,  vertAmplitude: 20, vertFreq: 1.0, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 5,   pauseDuration: 1.5, burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  neutral:    { baseSpeed: 68,  vertAmplitude: 5,  vertFreq: 0.4, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  tired:      { baseSpeed: 0,   vertAmplitude: 0,  vertFreq: 0,   bottomBias: true,  edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 0,   pauseDuration: 999, burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  lonely:     { baseSpeed: 14,  vertAmplitude: 7,  vertFreq: 0.3, bottomBias: true,  edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 4,   pauseDuration: 2.5, burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  sad:        { baseSpeed: 28,  vertAmplitude: 10, vertFreq: 0.4, bottomBias: false, edgeBias: true,  centerBias: false, circular: false, reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  anxious:    { baseSpeed: 75,  vertAmplitude: 32, vertFreq: 3.0, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 2,   pauseDuration: 0.4, burstChance: 0.05, burstMult: 2,   burstDuration: 0.3, chaotic: false, stopStart: true  },
  stressed:   { baseSpeed: 145, vertAmplitude: 55, vertFreq: 4.0, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0.08, burstMult: 2.5, burstDuration: 0.4, chaotic: true,  stopStart: false },
  angry:      { baseSpeed: 190, vertAmplitude: 20, vertFreq: 2.0, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0.05, burstMult: 1.8, burstDuration: 0.5, chaotic: false, stopStart: false },
  crying:     { baseSpeed: 24,  vertAmplitude: 12, vertFreq: 0.4, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 3,   pauseDuration: 1.8, burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  lucia:      { baseSpeed: 30,  vertAmplitude: 18, vertFreq: 0.5, bottomBias: false, edgeBias: false, centerBias: false, circular: true,  reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  memora:     { baseSpeed: 55,  vertAmplitude: 30, vertFreq: 2.0, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 3,   pauseDuration: 1.0, burstChance: 0.08, burstMult: 2.0, burstDuration: 0.4, chaotic: false, stopStart: false },
  umbra:      { baseSpeed: 20,  vertAmplitude: 8,  vertFreq: 0.3, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 6,   pauseDuration: 2.5, burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  fantasia:   { baseSpeed: 65,  vertAmplitude: 22, vertFreq: 2.2, bottomBias: false, edgeBias: false, centerBias: false, circular: true,  reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0.10, burstMult: 1.8, burstDuration: 0.3, chaotic: false, stopStart: false },
  oddia:      { baseSpeed: 70,  vertAmplitude: 25, vertFreq: 1.5, bottomBias: false, edgeBias: false, centerBias: false, circular: false, reverse: false, pauseInterval: 2,   pauseDuration: 0.8, burstChance: 0.06, burstMult: 2.2, burstDuration: 0.5, chaotic: false, stopStart: true  },
  oraclea:    { baseSpeed: 40,  vertAmplitude: 10, vertFreq: 0.6, bottomBias: false, edgeBias: false, centerBias: true,  circular: true,  reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
};