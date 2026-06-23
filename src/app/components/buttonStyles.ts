import type { CSSProperties } from 'react';

/* ─── Primary button — warm amber gradient with flat offset shadow ─── */
export const PRIMARY_BTN: CSSProperties = {
  padding: '11px 24px',
  background: 'linear-gradient(135deg, #c9843a 0%, #e0a548 100%)',
  border: '2px solid #a06828',
  borderRadius: 7,
  color: '#fdf6e8',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: "'Lora', serif",
  letterSpacing: '0.04em',
  boxShadow: '2px 2px 0 #7a4810',
  transition: 'filter 0.15s, transform 0.15s',
};

export const PRIMARY_BTN_DISABLED: CSSProperties = {
  ...PRIMARY_BTN,
  background: '#e8dcc8',
  border: '2px solid #c4b090',
  color: '#a89070',
  cursor: 'not-allowed',
  boxShadow: 'none',
};

/* ─── Secondary button — transparent with amber border ─── */
export const SECONDARY_BTN: CSSProperties = {
  padding: '10px 20px',
  background: 'transparent',
  border: '2px solid #c0a070',
  borderRadius: 7,
  color: '#9a7040',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "'DM Sans', sans-serif",
  transition: 'background 0.15s',
};

/* ─── Danger button — red gradient with flat shadow ─── */
export const DANGER_BTN: CSSProperties = {
  padding: '10px 20px',
  background: 'linear-gradient(135deg, #b03020 0%, #d04030 100%)',
  border: '2px solid #8a2010',
  borderRadius: 7,
  color: '#fdf6e8',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 700,
  fontFamily: "'Lora', serif",
  boxShadow: '2px 2px 0 #6a1808',
  transition: 'filter 0.15s',
};
