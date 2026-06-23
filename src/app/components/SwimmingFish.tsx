import { useEffect, useRef, useState, useCallback, type RefObject } from 'react';
import { FishSVG } from './FishSVG';
import { EMOTIONS, DREAM_ELEMENTS, EMOTION_COLORS, type EmotionId } from './emotions';
import { DreamIcon, isDreamElement } from './dreamIcons';

export interface Entry {
  id: string;
  emotionId: EmotionId;
  thoughts: string;
  date: Date;
}

interface FishPos {
  x: number;
  y: number;
  facing: 1 | -1;
}

interface SmoothBehavior {
  maxSpeed: number;
  minSpeed: number;
  accel: number;
  turnRate: number;
  wanderRate: number;
  maxWanderAngle: number;
  wallForce: number;
  bottomBias: boolean;
  edgeBias: boolean;
  centerBias: boolean;
  circular: boolean;
  wavyCircle: boolean;
  orbitReverse: boolean;
  waveFreqMult: number;
  waveAmpMult: number;
  reverse: boolean;
  pauseInterval: number;
  pauseDuration: number;
  burstChance: number;
  burstMult: number;
  burstDuration: number;
  chaotic: boolean;
  stopStart: boolean;
  circleRMult?: number; // orbit radius multiplier; defaults to 1 if omitted
}

const SMOOTH: Record<EmotionId, SmoothBehavior> = {
  happy:      { maxSpeed: 55,  minSpeed: 32,  accel: 1.2, turnRate: 2.0, wanderRate: 0.7, maxWanderAngle: 0.35, wallForce: 160, bottomBias: false, edgeBias: false, centerBias: false, circular: true,  wavyCircle: true,  orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  excited:    { maxSpeed: 58,  minSpeed: 35,  accel: 1.4, turnRate: 2.2, wanderRate: 2.2, maxWanderAngle: 0.60, wallForce: 180, bottomBias: false, edgeBias: false, centerBias: false, circular: true,  wavyCircle: true,  orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  loved:      { maxSpeed: 70,  minSpeed: 50,  accel: 1.0, turnRate: 2.0, wanderRate: 0.5, maxWanderAngle: 0.2,  wallForce: 120, bottomBias: false, edgeBias: false, centerBias: false, circular: true,  wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  grateful:   { maxSpeed: 90,  minSpeed: 55,  accel: 1.5, turnRate: 2.5, wanderRate: 0.9, maxWanderAngle: 0.35, wallForce: 160, bottomBias: false, edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  confident:  { maxSpeed: 155, minSpeed: 100, accel: 2.0, turnRate: 1.2, wanderRate: 2.0, maxWanderAngle: 0.72, wallForce: 260, bottomBias: false, edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0.12, burstMult: 1.4, burstDuration: 0.4, chaotic: false, stopStart: false },
  calm:       { maxSpeed: 42,  minSpeed: 22,  accel: 0.8, turnRate: 1.2, wanderRate: 0.4, maxWanderAngle: 0.25, wallForce: 80,  bottomBias: false, edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  melting:    { maxSpeed: 50,  minSpeed: 25,  accel: 0.7, turnRate: 1.0, wanderRate: 0.5, maxWanderAngle: 0.35, wallForce: 90,  bottomBias: false, edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  thoughtful: { maxSpeed: 55,  minSpeed: 30,  accel: 1.0, turnRate: 1.5, wanderRate: 0.7, maxWanderAngle: 0.40, wallForce: 100, bottomBias: false, edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 5,   pauseDuration: 1.8, burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  neutral:    { maxSpeed: 70,  minSpeed: 40,  accel: 1.2, turnRate: 1.5, wanderRate: 0.5, maxWanderAngle: 0.20, wallForce: 130, bottomBias: false, edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  tired:      { maxSpeed: 0,   minSpeed: 0,   accel: 0,   turnRate: 0,   wanderRate: 0,   maxWanderAngle: 0,    wallForce: 0,   bottomBias: true,  edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 0,   pauseDuration: 999, burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  lonely:     { maxSpeed: 18,  minSpeed: 6,   accel: 0.5, turnRate: 0.8, wanderRate: 0.4, maxWanderAngle: 0.25, wallForce: 40,  bottomBias: true,  edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 4,   pauseDuration: 2.5, burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  sad:        { maxSpeed: 30,  minSpeed: 14,  accel: 0.7, turnRate: 1.0, wanderRate: 0.5, maxWanderAngle: 0.30, wallForce: 60,  bottomBias: true,  edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  anxious:    { maxSpeed: 130, minSpeed: 60,  accel: 3.0, turnRate: 4.0, wanderRate: 2.5, maxWanderAngle: 0.65, wallForce: 300, bottomBias: false, edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 2,   pauseDuration: 0.5, burstChance: 0.05, burstMult: 2,   burstDuration: 0.3, chaotic: false, stopStart: true  },
  stressed:   { maxSpeed: 130, minSpeed: 75,  accel: 2.5, turnRate: 3.5, wanderRate: 1.2, maxWanderAngle: 0.35, wallForce: 300, bottomBias: false, edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0.04, burstMult: 1.5, burstDuration: 0.4, chaotic: false, stopStart: false },
  angry:      { maxSpeed: 95,  minSpeed: 55,  accel: 2.2, turnRate: 3.2, wanderRate: 2.0, maxWanderAngle: 0.55, wallForce: 280, bottomBias: false, edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 0,   pauseDuration: 0,   burstChance: 0.04, burstMult: 1.5, burstDuration: 0.3, chaotic: true,  stopStart: false },
  crying:     { maxSpeed: 28,  minSpeed: 12,  accel: 0.6, turnRate: 1.0, wanderRate: 0.6, maxWanderAngle: 0.35, wallForce: 55,  bottomBias: false, edgeBias: false, centerBias: false, circular: false, wavyCircle: false, orbitReverse: false, waveFreqMult: 1,   waveAmpMult: 1,    reverse: false, pauseInterval: 3,   pauseDuration: 1.8, burstChance: 0,    burstMult: 1,   burstDuration: 0,   chaotic: false, stopStart: false },
  // Dream creatures — slow flowing orbits, each with a distinct character
  //                                                                                                                                                               cw/ccw orbit   wave shape
  // Dream creatures — slower speeds, low waveFreqMult for smooth sinuous flows, large circleR
  lucia:      { maxSpeed: 18,  minSpeed: 9,   accel: 0.28, turnRate: 0.4, wanderRate: 0.12, maxWanderAngle: 0.10, wallForce: 40,  bottomBias: false, edgeBias: false, centerBias: false, circular: true,  wavyCircle: true,  orbitReverse: false, waveFreqMult: 1.0, waveAmpMult: 0.30, reverse: false, pauseInterval: 0, pauseDuration: 0, burstChance: 0, burstMult: 1, burstDuration: 0, chaotic: false, stopStart: false, circleRMult: 1.9 },
  memora:     { maxSpeed: 22,  minSpeed: 11,  accel: 0.28, turnRate: 0.4, wanderRate: 0.12, maxWanderAngle: 0.10, wallForce: 45,  bottomBias: false, edgeBias: false, centerBias: false, circular: true,  wavyCircle: true,  orbitReverse: true,  waveFreqMult: 1.3, waveAmpMult: 0.42, reverse: false, pauseInterval: 0, pauseDuration: 0, burstChance: 0, burstMult: 1, burstDuration: 0, chaotic: false, stopStart: false, circleRMult: 1.8 },
  umbra:      { maxSpeed: 15,  minSpeed: 8,   accel: 0.28, turnRate: 0.4, wanderRate: 0.12, maxWanderAngle: 0.10, wallForce: 36,  bottomBias: false, edgeBias: false, centerBias: false, circular: true,  wavyCircle: true,  orbitReverse: false, waveFreqMult: 0.9, waveAmpMult: 0.22, reverse: false, pauseInterval: 0, pauseDuration: 0, burstChance: 0, burstMult: 1, burstDuration: 0, chaotic: false, stopStart: false, circleRMult: 2.1 },
  fantasia:   { maxSpeed: 26,  minSpeed: 13,  accel: 0.28, turnRate: 0.4, wanderRate: 0.12, maxWanderAngle: 0.10, wallForce: 50,  bottomBias: false, edgeBias: false, centerBias: false, circular: true,  wavyCircle: true,  orbitReverse: true,  waveFreqMult: 1.6, waveAmpMult: 0.35, reverse: false, pauseInterval: 0, pauseDuration: 0, burstChance: 0, burstMult: 1, burstDuration: 0, chaotic: false, stopStart: false, circleRMult: 1.7 },
  oddia:      { maxSpeed: 20,  minSpeed: 10,  accel: 0.28, turnRate: 0.4, wanderRate: 0.12, maxWanderAngle: 0.10, wallForce: 42,  bottomBias: false, edgeBias: false, centerBias: false, circular: true,  wavyCircle: true,  orbitReverse: false, waveFreqMult: 1.2, waveAmpMult: 0.28, reverse: false, pauseInterval: 0, pauseDuration: 0, burstChance: 0, burstMult: 1, burstDuration: 0, chaotic: false, stopStart: false, circleRMult: 1.9 },
  oraclea:    { maxSpeed: 17,  minSpeed: 9,   accel: 0.28, turnRate: 0.4, wanderRate: 0.12, maxWanderAngle: 0.10, wallForce: 38,  bottomBias: false, edgeBias: false, centerBias: false, circular: true,  wavyCircle: true,  orbitReverse: true,  waveFreqMult: 1.4, waveAmpMult: 0.38, reverse: false, pauseInterval: 0, pauseDuration: 0, burstChance: 0, burstMult: 1, burstDuration: 0, chaotic: false, stopStart: false, circleRMult: 2.0 },
};

interface AnimState {
  x: number; y: number;
  vx: number; vy: number;
  speed: number;
  facing: 1 | -1;
  wanderAngle: number;
  pauseTimer: number;
  isPaused: boolean;
  burstTimer: number;
  circleAngle: number;
  circleCx: number; circleCy: number; circleR: number;
  lastTime: number;
  stopTimer: number;
  isStopped: boolean;
}

const FISH_W = 108;
const FISH_H = 36;

function lerp(a: number, b: number, t: number) { return a + (b - a) * Math.min(t, 1); }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

/* ─── Animation hook ─── */
function useFishAnimation(
  emotionId: EmotionId,
  bounds: { w: number; h: number },
  isDraggingRef: React.MutableRefObject<boolean>,
  hoverPausedRef: React.MutableRefObject<boolean>,
) {
  const cfg = SMOOTH[emotionId];
  const stateRef = useRef<AnimState | null>(null);
  const [pos, setPos] = useState<FishPos>({ x: bounds.w / 2, y: bounds.h / 2, facing: 1 });

  const getInitialState = useCallback((bw: number, bh: number): AnimState => {
    const facing: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
    let startX: number, startY: number;
    if (cfg.bottomBias)  { startX = FISH_W + Math.random() * (bw - FISH_W * 2); startY = bh - FISH_H * 0.5; }
    else if (cfg.edgeBias) { startX = Math.random() > 0.5 ? FISH_W * 1.2 : bw - FISH_W * 1.2; startY = FISH_H + Math.random() * (bh - FISH_H * 2); }
    else if (cfg.centerBias) { startX = bw * 0.3 + Math.random() * bw * 0.4; startY = bh * 0.3 + Math.random() * bh * 0.4; }
    else { startX = FISH_W + Math.random() * (bw - FISH_W * 2); startY = FISH_H + Math.random() * (bh - FISH_H * 2); }

    const initSpeed = cfg.maxSpeed > 0 ? cfg.minSpeed + Math.random() * (cfg.maxSpeed - cfg.minSpeed) * 0.5 : 0;
    const circleR = (80 + Math.random() * 50) * (cfg.circleRMult ?? 1);
    const circleAngle = Math.random() * Math.PI * 2;
    return {
      x: startX, y: startY, vx: facing * initSpeed, vy: 0, speed: initSpeed,
      facing, wanderAngle: (Math.random() - 0.5) * cfg.maxWanderAngle,
      pauseTimer: cfg.pauseInterval > 0 ? cfg.pauseInterval * (0.5 + Math.random()) : Infinity,
      isPaused: cfg.maxSpeed === 0, burstTimer: 0,
      circleAngle, circleCx: bw * 0.3 + Math.random() * bw * 0.4, circleCy: bh * 0.3 + Math.random() * bh * 0.4, circleR,
      lastTime: 0, stopTimer: cfg.stopStart ? 1.5 + Math.random() * 2 : Infinity, isStopped: false,
    };
  }, [cfg]);

  useEffect(() => {
    if (bounds.w === 0 || bounds.h === 0) return;
    stateRef.current = getInitialState(bounds.w, bounds.h);
    let rafId: number;
    const margin = FISH_W * 0.55, marginY = FISH_H * 0.6;
    const minX = margin, maxX = bounds.w - margin, minY = marginY, maxY = bounds.h - marginY;

    function tick(time: number) {
      const s = stateRef.current!;
      if (!s.lastTime) { s.lastTime = time; rafId = requestAnimationFrame(tick); return; }
      const dt = Math.min((time - s.lastTime) / 1000, 0.05);
      s.lastTime = time;

      // During drag or hover — freeze position, skip physics
      if (isDraggingRef.current || hoverPausedRef.current) {
        const displayFacing = cfg.reverse ? (s.facing === 1 ? -1 : 1) as 1 | -1 : s.facing;
        setPos({ x: s.x, y: s.y, facing: displayFacing });
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (cfg.circular) {
        const orbitSpeed = cfg.wavyCircle ? (cfg.maxSpeed / 65) * 1.0 : 0.85;
        s.circleAngle += orbitSpeed * dt * (cfg.orbitReverse ? -1 : 1);
        let nx: number, ny: number;
        if (cfg.wavyCircle) {
          // Wavy elliptical orbit: each dream creature has unique wave frequency + amplitude
          const freq = cfg.waveFreqMult;
          const amp  = cfg.waveAmpMult;
          nx = s.circleCx + Math.cos(s.circleAngle) * s.circleR * 1.5;
          ny = s.circleCy
            + Math.sin(s.circleAngle) * s.circleR * 0.45
            + Math.sin(s.circleAngle * freq) * s.circleR * amp;
        } else {
          nx = s.circleCx + Math.cos(s.circleAngle) * s.circleR * 1.3;
          ny = s.circleCy + Math.sin(s.circleAngle) * s.circleR * 0.65;
        }
        if (nx < minX + 20 || nx > maxX - 20 || ny < minY + 20 || ny > maxY - 20) {
          s.circleCx = lerp(s.circleCx, bounds.w / 2, 0.04);
          s.circleCy = lerp(s.circleCy, bounds.h / 2, 0.04);
        }
        s.x = clamp(nx, minX, maxX); s.y = clamp(ny, minY, maxY);
        // When orbit reverses direction the sin-based facing must also flip so fish always faces the direction of travel
        s.facing = (Math.sin(s.circleAngle) * (cfg.orbitReverse ? -1 : 1)) > 0 ? -1 : 1;
        setPos({ x: s.x, y: s.y, facing: s.facing });
        rafId = requestAnimationFrame(tick); return;
      }

      if (cfg.maxSpeed === 0) {
        s.x = clamp(s.x, minX, maxX);
        const tiredTargetY = clamp(bounds.h - FISH_H * 0.42, minY, maxY);
        s.y = lerp(s.y, tiredTargetY, Math.min(3.5 * dt, 0.12));
        setPos({ x: s.x, y: s.y, facing: s.facing }); rafId = requestAnimationFrame(tick); return;
      }

      if (s.isPaused) {
        s.pauseTimer -= dt;
        if (s.pauseTimer <= 0) { s.isPaused = false; s.pauseTimer = cfg.pauseInterval > 0 ? cfg.pauseInterval * (0.5 + Math.random()) : Infinity; }
        s.x = clamp(s.x + s.vx * 0.05 * dt, minX, maxX); s.y = clamp(s.y + s.vy * 0.05 * dt, minY, maxY);
        setPos({ x: s.x, y: s.y, facing: s.facing }); rafId = requestAnimationFrame(tick); return;
      }

      if (cfg.stopStart) {
        if (s.isStopped) {
          s.stopTimer -= dt;
          if (s.stopTimer <= 0) { s.isStopped = false; s.stopTimer = 1 + Math.random() * 1.5; if (Math.random() > 0.4) s.facing = s.facing === 1 ? -1 : 1; }
          setPos({ x: s.x, y: s.y, facing: s.facing }); rafId = requestAnimationFrame(tick); return;
        }
        s.stopTimer -= dt;
        if (s.stopTimer <= 0) { s.isStopped = true; s.stopTimer = 0.2 + Math.random() * 0.4; }
      }

      let targetSpeed = cfg.minSpeed + Math.random() * 0.1 * (cfg.maxSpeed - cfg.minSpeed);
      if (s.burstTimer > 0) { targetSpeed = cfg.maxSpeed * cfg.burstMult; s.burstTimer -= dt; }
      else if (cfg.burstChance > 0 && Math.random() < cfg.burstChance * dt * 60) { s.burstTimer = cfg.burstDuration; }
      s.speed = lerp(s.speed, targetSpeed, cfg.accel * dt);

      if (cfg.chaotic && Math.random() < 0.05 * dt * 60) {
        s.wanderAngle = (Math.random() - 0.5) * cfg.maxWanderAngle * 2.5;
        if (Math.random() < 0.3) s.facing = s.facing === 1 ? -1 : 1;
      }

      s.wanderAngle += (Math.random() - 0.5) * cfg.wanderRate * dt * 2;
      s.wanderAngle = clamp(s.wanderAngle, -cfg.maxWanderAngle, cfg.maxWanderAngle);
      s.wanderAngle *= Math.pow(0.97, dt * 60);

      const wallMargin = FISH_W * 0.9;
      let forceX = 0, forceY = 0;
      const ld = s.x - minX, rd = maxX - s.x, td = s.y - minY, bd = maxY - s.y;
      if (ld < wallMargin) { forceX += (1 - ld / wallMargin) * cfg.wallForce; s.wanderAngle *= 0.92; }
      if (rd < wallMargin) { forceX -= (1 - rd / wallMargin) * cfg.wallForce; s.wanderAngle *= 0.92; }
      if (td < wallMargin * 0.7) forceY += (1 - td / (wallMargin * 0.7)) * cfg.wallForce * 0.8;
      if (bd < wallMargin * 0.7) forceY -= (1 - bd / (wallMargin * 0.7)) * cfg.wallForce * 0.8;

      if (s.x < minX + 30 && s.facing === -1) s.facing = 1;
      if (s.x > maxX - 30 && s.facing === 1) s.facing = -1;

      const desiredVx = s.facing * Math.cos(s.wanderAngle) * s.speed + forceX * dt;
      const desiredVy = Math.sin(s.wanderAngle) * s.speed + forceY * dt;
      s.vx = lerp(s.vx, desiredVx, cfg.turnRate * dt);
      s.vy = lerp(s.vy, desiredVy, cfg.turnRate * dt);

      if (cfg.bottomBias) { const ty = maxY - FISH_H * 0.1; s.vy = lerp(s.vy, (ty - s.y) * 0.6, 0.06); }
      if (cfg.edgeBias) { const et = s.x < bounds.w / 2 ? minX + 20 : maxX - 20; s.vx = lerp(s.vx, (et - s.x) * 1.2, 0.08); }
      if (cfg.centerBias) { s.vx = lerp(s.vx, s.vx + (bounds.w / 2 - s.x) * 0.4, 0.05); s.vy = lerp(s.vy, s.vy + (bounds.h / 2 - s.y) * 0.3, 0.05); }

      s.x = clamp(s.x + s.vx * dt, minX, maxX);
      s.y = clamp(s.y + s.vy * dt, minY, maxY);

      if (cfg.pauseInterval > 0 && !s.isPaused) {
        s.pauseTimer -= dt;
        if (s.pauseTimer <= 0) { s.isPaused = true; s.pauseTimer = cfg.pauseDuration; s.vx *= 0.1; s.vy *= 0.1; }
      }

      const displayFacing = cfg.reverse ? (s.facing === 1 ? -1 : 1) as 1 | -1 : s.facing;
      setPos({ x: s.x, y: s.y, facing: displayFacing });
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [emotionId, bounds.w, bounds.h, cfg, getInitialState, isDraggingRef, hoverPausedRef]);

  return { pos, stateRef };
}

const DREAM_IDS = new Set(['lucia','memora','umbra','fantasia','oddia','oraclea']);

/* ─── Bubble particle ─── */
interface BubblePart { id: number; x: number; y: number; size: number; dur: number; dx: number; }

/* ─── Sleep indicator particle ─── */
interface SleepPart { id: number; x: number; y: number; delay: number; size: number; }

/* ─── Sparkle particle (dream fish only) ─── */
interface SparklePart { id: number; x: number; y: number; size: number; dur: number; angle: number; dist: number; glyph: string; }

/* ─── Stardust trail particle ─── */
interface StardustPart { id: number; x: number; y: number; size: number; dur: number; }

/* ─── Dissolve particle ─── */
interface DissolvePart { id: number; x: number; y: number; dx: number; dy: number; size: number; color: string; }

/* ─── Hover card (paper note style) ─── */
interface HoverCardProps {
  entry: Entry;
  fishX: number; fishY: number;
  containerRef: RefObject<HTMLDivElement | null>;
  onViewDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  onUnfold?: () => void;
  isDream?: boolean;
}

function HoverCard({ entry, fishX, fishY, containerRef, onViewDetail, onEdit, onDelete, onClose, onUnfold, isDream }: HoverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const thoughtsRef = useRef<HTMLParagraphElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [truncatedThoughts, setTruncatedThoughts] = useState(entry.thoughts);
  const emotion = [...EMOTIONS, ...DREAM_ELEMENTS].find(e => e.id === entry.emotionId)!;
  const color = EMOTION_COLORS[entry.emotionId];

  // Truncate thoughts to 4 lines
  useEffect(() => {
    if (!thoughtsRef.current || !entry.thoughts) return;
    
    const element = thoughtsRef.current;
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const maxHeight = lineHeight * 4;
    
    let text = entry.thoughts;
    element.textContent = `"${text}"`;
    
    while (element.scrollHeight > maxHeight && text.length > 0) {
      text = text.slice(0, -1);
      element.textContent = `"${text}…"`;
    }
    
    setTruncatedThoughts(text);
  }, [entry.thoughts]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!cardRef.current || !containerRef.current) return;
    const card = cardRef.current;
    const cRect = containerRef.current.getBoundingClientRect();
    const cardW = card.offsetWidth || 240;
    const cardH = card.offsetHeight || 120;
    let left = fishX + 56, top = fishY - cardH / 2;
    const maxLeft = cRect.width - cardW - 12;
    if (left > maxLeft) left = fishX - cardW - 56;
    if (left < 12) left = 12;
    if (top < 12) top = 12;
    if (top > cRect.height - cardH - 12) top = cRect.height - cardH - 12;
    setStyle({ opacity: 1, left, top });
  }, [fishX, fishY, containerRef]);

  const dateStr = entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div ref={cardRef} style={{
      position: 'absolute', ...style, zIndex: 50, pointerEvents: 'all',
      transition: 'opacity 0.15s ease',
      filter: 'drop-shadow(0 6px 18px rgba(40,20,5,0.28))',
    }}>
      {/* Paper note */}
      <div style={{
        background: '#f8f0de',
        backgroundImage: 'repeating-linear-gradient(transparent 0px, transparent 20px, rgba(180,150,100,0.12) 20px, rgba(180,150,100,0.12) 21px)',
        border: '2px solid #c4aa80',
        borderRadius: 6,
        padding: '10px 14px 12px',
        minWidth: 220, maxWidth: 260,
        position: 'relative',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Top fold corner */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 0, height: 0,
          borderStyle: 'solid',
          borderWidth: '0 18px 18px 0',
          borderColor: `transparent #c4aa80 transparent transparent`,
        }}/>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 0, height: 0,
          borderStyle: 'solid',
          borderWidth: '0 16px 16px 0',
          borderColor: `transparent #e8d8b8 transparent transparent`,
        }}/>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
          <span style={{ fontSize: 20, display: 'flex', alignItems: 'center', color: '#5a3e24' }}>
            {isDreamElement(entry.emotionId) ? <DreamIcon id={entry.emotionId} size={20} /> : emotion.emoji}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#8a6a40', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{dateStr}</div>
            <div style={{ fontSize: 13, color: '#3a2512', fontWeight: 500 }}>{emotion.name}</div>
          </div>
          <button onClick={onViewDetail} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, color: '#8a6a40', borderRadius: 4, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#5a4020'} onMouseLeave={(e) => e.currentTarget.style.color = '#8a6a40'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <div style={{ position: 'relative' }}>
            <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, color: '#8a6a40', borderRadius: 4, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#5a4020'} onMouseLeave={(e) => e.currentTarget.style.color = '#8a6a40'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
            {showMenu && (
              <div ref={menuRef} style={{
                position: 'absolute',
                top: 0,
                right: 'calc(100% + 4px)',
                background: '#f8f0de',
                border: '1.5px solid #c4aa80',
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 52,
                minWidth: 90,
                overflow: 'hidden',
              }}>
                <button onClick={(e) => { e.stopPropagation(); onEdit(); setShowMenu(false); }} style={{ display: 'block', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '9px 14px', color: '#5a3e24', fontSize: 13, textAlign: 'left', transition: 'background 0.15s', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={(e) => e.currentTarget.style.background = '#f0e4cc'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                  Edit
                </button>
                <div style={{ height: 1, background: '#e0d0b0', margin: '0 8px' }}/>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); setShowMenu(false); }} style={{ display: 'block', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '9px 14px', color: '#c4524d', fontSize: 13, textAlign: 'left', transition: 'background 0.15s', fontFamily: "'DM Sans', sans-serif" }} onMouseEnter={(e) => e.currentTarget.style.background = '#f0e4cc'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                  Delete
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(138,106,64,0.08)', 
              border: 'none', 
              cursor: 'pointer', 
              padding: 6, 
              color: '#8a6a40', 
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }} 
            onMouseEnter={(e) => { 
              e.currentTarget.style.background = 'rgba(138,106,64,0.15)'; 
              e.currentTarget.style.color = '#5a4020'; 
            }} 
            onMouseLeave={(e) => { 
              e.currentTarget.style.background = 'rgba(138,106,64,0.08)'; 
              e.currentTarget.style.color = '#8a6a40'; 
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {entry.thoughts && (
          <p ref={thoughtsRef} style={{ fontSize: 12, color: '#5a3e24', margin: '0 0 6px', lineHeight: 1.5, fontStyle: 'italic', wordBreak: 'break-word' }}>
            {truncatedThoughts}
          </p>
        )}
        {isDream && onUnfold && (
          <button onClick={(e) => { e.stopPropagation(); onUnfold(); }} style={{
            marginTop: 5, padding: '5px 11px', fontSize: 11, fontWeight: 700,
            fontFamily: "'Lora', serif",
            background: 'linear-gradient(135deg, #8060c0 0%, #a080d8 100%)',
            border: '2px solid #6040a0', borderRadius: 5,
            color: '#fdf6e8', cursor: 'pointer', transition: 'filter 0.15s',
            display: 'flex', alignItems: 'center', gap: 4,
            boxShadow: '2px 2px 0 #503080',
          }}
          onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.07)'; }}
          onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3L8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg> Crystallize
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main SwimmingFish component ─── */
interface SwimmingFishProps {
  entry: Entry;
  bounds: { w: number; h: number };
  containerRef: RefObject<HTMLDivElement | null>;
  onViewDetail: (entry: Entry) => void;
  onEdit?: (entry: Entry) => void;
  onDelete?: (id: string) => void;
  isActive?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
  allEntries?: Entry[];
  isNew?: boolean;
  onUnfold?: (entry: Entry, xPct: number, fishYPct: number) => void;
}

export function SwimmingFish({ entry, bounds, containerRef, onViewDetail, onEdit, onDelete, isActive = false, onActivate, onDeactivate, allEntries = [], isNew = false, onUnfold }: SwimmingFishProps) {
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUnfolding, setIsUnfolding] = useState(false);
  const [dissolveParticles, setDissolveParticles] = useState<DissolvePart[]>([]);
  const isDraggingRef = useRef(false);
  const hoverPausedRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartedRef = useRef(false);
  const fishDivRef = useRef<HTMLDivElement>(null);

  // ── Drop-from-top entry animation ──
  const isNewRef = useRef(isNew);
  const isDroppingRef = useRef(isNew);
  const [dropY, setDropY] = useState(() => isNew ? -640 : 0);
  const [bubbles, setBubbles] = useState<BubblePart[]>([]);
  const [sleepZs, setSleepZs] = useState<SleepPart[]>([]);
  const [sparkles, setSparkles] = useState<SparklePart[]>([]);
  const [stardust, setStardust] = useState<StardustPart[]>([]);
  const bubbleIdRef = useRef(0);
  const sleepIdRef = useRef(0);
  const sparkleIdRef = useRef(0);
  const stardustIdRef = useRef(0);
  const isDream = DREAM_IDS.has(entry.emotionId);

  // Calculate fish size based on age (newer = bigger); dream creatures are larger
  const getFishSize = (): number => {
    if (isDream) return 104;
    const allDates = [entry, ...allEntries].map(e => e.date.getTime()).sort((a, b) => b - a);
    if (allDates.length <= 1) return 88;
    const newestTime = allDates[0];
    const oldestTime = allDates[allDates.length - 1];
    const range = newestTime - oldestTime || 1;
    const age = (newestTime - entry.date.getTime()) / range;
    return Math.round(98 - age * 36);
  };

  const fishSize = getFishSize();

  useEffect(() => {
    if (!isNewRef.current) return;
    const r1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDropY(0);
        const t = setTimeout(() => { isDroppingRef.current = false; }, 2200);
        return () => clearTimeout(t);
      });
    });
    return () => cancelAnimationFrame(r1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { pos, stateRef } = useFishAnimation(entry.emotionId, bounds, isDraggingRef, hoverPausedRef);

  // ── Hover mouth bubbles ──
  useEffect(() => {
    if (!hovered || isDragging) return;
    let active = true;

    function spawnBubble() {
      if (!active) return;
      const s = stateRef.current;
      if (!s) return;
      const facing = SMOOTH[entry.emotionId].reverse ? (s.facing === 1 ? -1 : 1) : s.facing;
      const mouthX = s.x + 20 + (facing === 1 ? 54 : -54);
      const mouthY = s.y + 20 - 6;
      const size = 5 + Math.random() * 13;
      const dur = 1.4 + Math.random() * 1.4;
      const dx = (Math.random() - 0.5) * 35;
      const id = bubbleIdRef.current++;

      setBubbles(prev => [...prev, { id, x: mouthX, y: mouthY, size, dur, dx }]);
      setTimeout(() => { setBubbles(prev => prev.filter(b => b.id !== id)); }, (dur + 0.3) * 1000);

      if (active) setTimeout(spawnBubble, 280 + Math.random() * 220);
    }

    const t = setTimeout(spawnBubble, 80);
    return () => { active = false; clearTimeout(t); };
  }, [hovered, isDragging, stateRef, entry.emotionId]);

  // ── Sparkles for dream fish on hover ──
  useEffect(() => {
    if (!isDream || (!hovered && !isActive) || isDragging) return;
    let active = true;
    const GLYPHS = ['✦', '✧', '⋆', '✦', '✧', '★'];

    function spawnSparkle() {
      if (!active) return;
      const s = stateRef.current;
      if (!s) return;
      const angle = Math.random() * Math.PI * 2;
      const dist = 28 + Math.random() * 40;
      const cx = s.x + 20;
      const cy = s.y + 20;
      const size = 8 + Math.random() * 10;
      const dur = 0.9 + Math.random() * 0.8;
      const id = sparkleIdRef.current++;
      const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

      setSparkles(prev => [...prev, { id, x: cx, y: cy, size, dur, angle, dist, glyph }]);
      setTimeout(() => { setSparkles(prev => prev.filter(sp => sp.id !== id)); }, (dur + 0.2) * 1000);

      if (active) setTimeout(spawnSparkle, 100 + Math.random() * 140);
    }

    const t = setTimeout(spawnSparkle, 40);
    return () => { active = false; clearTimeout(t); };
  }, [isDream, hovered, isActive, isDragging, stateRef]);

  // ── Stardust trail for dream fish ──
  useEffect(() => {
    if (!isDream || isDragging) return;
    let active = true;
    function spawnDust() {
      if (!active) return;
      const s = stateRef.current;
      if (!s) return;
      const id = stardustIdRef.current++;
      const size = 1.2 + Math.random() * 2.2;
      const dur = 0.7 + Math.random() * 0.6;
      setStardust(prev => [...prev, { id, x: s.x + 20 + (Math.random()-0.5)*12, y: s.y + 20 + (Math.random()-0.5)*8, size, dur }]);
      setTimeout(() => setStardust(prev => prev.filter(d => d.id !== id)), (dur + 0.1) * 1000);
      if (active) setTimeout(spawnDust, 90 + Math.random() * 70);
    }
    const t = setTimeout(spawnDust, 120);
    return () => { active = false; clearTimeout(t); };
  }, [isDream, isDragging, stateRef]);

  // ── Click/frozen bubbles ──
  useEffect(() => {
    if (!isActive) return;
    let active = true;

    function spawnBubble() {
      if (!active) return;
      const s = stateRef.current;
      if (!s) return;
      const facing = SMOOTH[entry.emotionId].reverse ? (s.facing === 1 ? -1 : 1) : s.facing;
      const mouthX = s.x + 20 + (facing === 1 ? 54 : -54);
      const mouthY = s.y + 20 - 6;
      const size = 5 + Math.random() * 13;
      const dur = 1.4 + Math.random() * 1.4;
      const dx = (Math.random() - 0.5) * 35;
      const id = bubbleIdRef.current++;

      setBubbles(prev => [...prev, { id, x: mouthX, y: mouthY, size, dur, dx }]);
      setTimeout(() => { setBubbles(prev => prev.filter(b => b.id !== id)); }, (dur + 0.3) * 1000);

      if (active) setTimeout(spawnBubble, 280 + Math.random() * 220);
    }

    const t = setTimeout(spawnBubble, 80);
    return () => { active = false; clearTimeout(t); };
  }, [isActive, stateRef, entry.emotionId]);

  // ── Sleep Z indicators for tired fish ──
  useEffect(() => {
    if (entry.emotionId !== 'tired') return;
    let active = true;

    function spawnZ() {
      if (!active) return;
      const s = stateRef.current;
      if (!s) return;
      const facing = SMOOTH[entry.emotionId].reverse ? (s.facing === 1 ? -1 : 1) : s.facing;
      const mouthX = s.x + 20 + (facing === 1 ? 54 : -54);
      const mouthY = s.y + 20 - 10;
      const size = 20 + Math.random() * 10;
      const delay = Math.random() * 0.3;
      const id = sleepIdRef.current++;

      setSleepZs(prev => [...prev, { id, x: mouthX, y: mouthY, delay, size }]);
      setTimeout(() => { setSleepZs(prev => prev.filter(z => z.id !== id)); }, 3500);

      if (active) setTimeout(spawnZ, 1200 + Math.random() * 800);
    }

    const t = setTimeout(spawnZ, 400);
    return () => { active = false; clearTimeout(t); };
  }, [entry.emotionId, stateRef]);

  // ── Unfold: fish fades out, gem falls from fish position to floor ──
  function handleUnfoldClick() {
    if (!onUnfold || isUnfolding) return;
    setIsUnfolding(true);
    setHovered(false);
    onDeactivate?.();
    const s = stateRef.current;
    const cx = s ? s.x + 20 : bounds.w / 2;
    const cy = s ? s.y + 20 : bounds.h / 2;

    // Small burst of sparkles from the fish position
    const COLORS = [
      'rgba(255,252,200,0.98)', 'rgba(220,200,255,0.95)',
      'rgba(200,240,255,0.95)', 'rgba(255,220,180,0.95)',
      'rgba(255,180,240,0.90)', 'rgba(180,255,220,0.90)',
    ];
    const parts: DissolvePart[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: cx + (Math.random() - 0.5) * 16,
      y: cy + (Math.random() - 0.5) * 8,
      dx: (Math.random() - 0.5) * 60,
      dy: (bounds.h - cy) * (0.5 + Math.random() * 0.5),
      size: 2 + Math.random() * 4,
      color: COLORS[i % COLORS.length],
    }));
    setDissolveParticles(parts);

    // Trigger gem immediately so it starts falling while fish dissolves
    // xPct = fish x as % of fish-zone width (same as tank width since zone spans 100%)
    const xPct = Math.max(3, Math.min(93, (cx / bounds.w) * 100));
    const fishYPct = Math.max(0, Math.min(100, (cy / bounds.h) * 100));
    onUnfold(entry, xPct, fishYPct);
  }

  // ── Freeze control ──
  useEffect(() => {
    if (isActive) hoverPausedRef.current = true;
    else if (!hovered) hoverPausedRef.current = false;
  }, [isActive, hovered]);

  // ── Drag handlers ──
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isDroppingRef.current) return;
    e.preventDefault();
    fishDivRef.current?.setPointerCapture(e.pointerId);
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    dragStartedRef.current = false;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartPosRef.current || !containerRef.current || !stateRef.current) return;

    const dx = e.clientX - dragStartPosRef.current.x;
    const dy = e.clientY - dragStartPosRef.current.y;

    // Initiate drag once pointer moves > 5px
    if (!dragStartedRef.current && Math.hypot(dx, dy) > 5) {
      dragStartedRef.current = true;
      isDraggingRef.current = true;
      setIsDragging(true);
      setHovered(false);
      hoverPausedRef.current = false;
      const rect = containerRef.current.getBoundingClientRect();
      const sx = dragStartPosRef.current.x - rect.left;
      const sy = dragStartPosRef.current.y - rect.top;
      dragOffsetRef.current = {
        x: sx - (stateRef.current.x + 20),
        y: sy - (stateRef.current.y + 20),
      };
    }

    if (!isDraggingRef.current) return;
    const margin = FISH_W * 0.55, marginY = FISH_H * 0.6;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    stateRef.current.x = clamp(mx - dragOffsetRef.current.x, margin, bounds.w - margin);
    stateRef.current.y = clamp(my - dragOffsetRef.current.y, marginY, bounds.h - marginY);
    if (Math.abs(e.movementX) > 1) stateRef.current.facing = e.movementX > 0 ? 1 : -1;
  }, [containerRef, stateRef, bounds]);

  const handlePointerUp = useCallback(() => {
    const wasDragging = dragStartedRef.current;
    isDraggingRef.current = false;
    dragStartedRef.current = false;
    dragStartPosRef.current = null;
    setIsDragging(false);

    if (wasDragging && stateRef.current) {
      const cfg = SMOOTH[entry.emotionId];
      // For circular fish, update the orbit centre to the drop position
      if (cfg.circular) {
        stateRef.current.circleCx = stateRef.current.x;
        stateRef.current.circleCy = stateRef.current.y;
      }
      const spd = Math.max(cfg.minSpeed * 0.6, 14);
      stateRef.current.vx = stateRef.current.facing * spd;
      stateRef.current.vy = 0;
      stateRef.current.speed = spd;
      stateRef.current.isPaused = false;
      stateRef.current.isStopped = false;
    } else if (!wasDragging) {
      // Tap/click → toggle freeze
      if (isActive) onDeactivate?.();
      else onActivate?.();
      setHovered(false);
    }
  }, [stateRef, entry.emotionId, isActive, onActivate, onDeactivate]);

  return (
    <>
      {/* Mouth bubbles */}
      {bubbles.map(b => (
        <div
          key={b.id}
          style={{
            position: 'absolute',
            left: b.x - b.size / 2,
            top: b.y - b.size / 2,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            border: `${b.size > 10 ? 1.8 : 1.2}px solid ${isDream ? 'rgba(200,180,255,0.75)' : 'rgba(255,255,255,0.72)'}`,
            background: isDream
              ? 'radial-gradient(circle at 35% 30%, rgba(230,200,255,0.55) 0%, rgba(160,120,255,0.08) 60%, transparent 100%)'
              : 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.5) 0%, rgba(200,240,255,0.08) 60%, transparent 100%)',
            animation: `bubble-mouth ${b.dur}s ease-out forwards`,
            '--bdx': `${b.dx}px`,
            pointerEvents: 'none',
            zIndex: 40,
          } as React.CSSProperties}
        />
      ))}

      {/* Dream sparkles */}
      {sparkles.map(sp => {
        const tx = Math.cos(sp.angle) * sp.dist;
        const ty = Math.sin(sp.angle) * sp.dist;
        const tx2 = Math.cos(sp.angle) * (sp.dist + 20);
        const ty2 = Math.sin(sp.angle) * (sp.dist + 20);
        return (
          <div
            key={sp.id}
            style={{
              position: 'absolute',
              left: sp.x,
              top: sp.y,
              fontSize: sp.size,
              lineHeight: 1,
              color: ['✦','★'].includes(sp.glyph)
                ? `rgba(255,240,160,${0.7 + Math.random() * 0.3})`
                : `rgba(220,200,255,${0.6 + Math.random() * 0.3})`,
              textShadow: `0 0 ${sp.size * 1.5}px rgba(255,230,120,0.9), 0 0 ${sp.size * 3}px rgba(200,160,255,0.6)`,
              animation: `dream-sparkle-out ${sp.dur}s ease-out forwards`,
              '--sx': `${tx}px`,
              '--sy': `${ty}px`,
              '--sx2': `${tx2}px`,
              '--sy2': `${ty2}px`,
              pointerEvents: 'none',
              zIndex: 42,
              userSelect: 'none',
              transform: 'translate(-50%, -50%)',
            } as React.CSSProperties}
          >
            {sp.glyph}
          </div>
        );
      })}

      {/* Stardust trail */}
      {stardust.map(d => (
        <div key={d.id} style={{
          position: 'absolute', left: d.x - d.size/2, top: d.y - d.size/2,
          width: d.size, height: d.size, borderRadius: '50%',
          background: 'rgba(255,248,200,0.92)',
          boxShadow: `0 0 ${d.size*2}px ${d.size}px rgba(255,230,120,0.55)`,
          animation: `stardust-fade ${d.dur}s ease-out forwards`,
          pointerEvents: 'none', zIndex: 38,
        }}/>
      ))}

      {/* Sparkle-fall particles (drift down to floor) */}
      {dissolveParticles.map((dp, i) => (
        <div key={dp.id} style={{
          position: 'absolute',
          left: dp.x - dp.size / 2,
          top:  dp.y - dp.size / 2,
          width: dp.size, height: dp.size,
          borderRadius: '50%',
          background: dp.color,
          boxShadow: `0 0 ${dp.size * 2.5}px ${dp.size * 1.2}px ${dp.color}`,
          animation: `sparkle-fall ${1.2 + i * 0.025}s cubic-bezier(0.25, 0, 0.55, 1) ${i * 0.02}s forwards`,
          '--sfx': `${dp.dx}px`,
          '--sfy': `${dp.dy}px`,
          '--sfr': `${(Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 180)}deg`,
          pointerEvents: 'none', zIndex: 45,
        } as React.CSSProperties}/>
      ))}

      {/* Sleep Z indicators */}
      {sleepZs.map(z => (
        <div
          key={z.id}
          style={{
            position: 'absolute',
            left: z.x,
            top: z.y,
            fontSize: z.size,
            fontWeight: 600,
            color: 'rgba(80, 60, 40, 0.5)',
            fontFamily: "'Lora', serif",
            fontStyle: 'italic',
            animation: `sleep-z 3s ease-out ${z.delay}s forwards`,
            pointerEvents: 'none',
            zIndex: 40,
          }}
        >
          z
        </div>
      ))}

      {/* Fish element */}
      <div
        ref={fishDivRef}
        onMouseEnter={() => { if (!isDragging && !isActive && !isDroppingRef.current) { setHovered(true); hoverPausedRef.current = true; } }}
        onMouseLeave={() => { if (!isActive) { setHovered(false); hoverPausedRef.current = false; } }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'absolute',
          left: pos.x + 20,
          top: pos.y + 20,
          transform: `translate(-50%, -50%) translateY(${dropY}px)`,
          cursor: isDroppingRef.current ? 'default' : isDragging ? 'grabbing' : 'grab',
          zIndex: hovered || isDragging || isActive ? 30 : 10,
          animation: isUnfolding ? 'unfold-flash 0.65s ease-out forwards' : undefined,
          filter: isDragging
            ? 'drop-shadow(0 6px 18px rgba(40,20,5,0.4))'
            : (hovered || isActive)
              ? 'drop-shadow(0 0 10px rgba(255,220,130,0.75))'
              : undefined,
          transition: isDroppingRef.current && dropY === 0
            ? 'transform 2s cubic-bezier(0.22, 0.9, 0.36, 1), filter 0.2s ease'
            : isDragging ? 'none' : 'filter 0.2s ease',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        <div style={{
          animation: SMOOTH[entry.emotionId].wavyCircle && !isDragging && !isDream
            ? `happy-jiggle ${entry.emotionId === 'excited' ? 1.1 : 1.6}s ease-in-out infinite`
            : undefined,
          lineHeight: 0,
        }}>
          <FishSVG emotionId={entry.emotionId} width={fishSize} flipped={pos.facing === -1} />
        </div>
      </div>

      {(hovered || isActive) && !isDragging && (
        <HoverCard
          entry={entry}
          fishX={pos.x + 20}
          fishY={pos.y + 20}
          containerRef={containerRef}
          onViewDetail={() => { onViewDetail(entry); setHovered(false); onDeactivate?.(); }}
          onEdit={() => { onEdit?.(entry); setHovered(false); onDeactivate?.(); }}
          onDelete={() => { onDelete?.(entry.id); }}
          onClose={() => { setHovered(false); onDeactivate?.(); }}
          onUnfold={isDream ? handleUnfoldClick : undefined}
          isDream={isDream}
        />
      )}
    </>
  );
}