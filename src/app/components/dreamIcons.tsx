import { DREAM_ELEMENTS } from './emotions';

const DREAM_IDS = new Set(DREAM_ELEMENTS.map(e => e.id));
export function isDreamElement(id: string): boolean { return DREAM_IDS.has(id); }

interface IconProps { size?: number; color?: string; }
const SW = 1.5; // shared stroke width

/* Lucia — crescent moon, outline */
function MoonIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

/* Memora — butterfly, fully outline, clean antennae */
function ButterflyIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      {/* Upper wings */}
      <path d="M12 11 C11 7.5 7 2 3 4 C0 6 2.5 12.5 8 13 C10 13.2 12 12 12 11z" strokeWidth="1.4"/>
      <path d="M12 11 C13 7.5 17 2 21 4 C24 6 21.5 12.5 16 13 C14 13.2 12 12 12 11z" strokeWidth="1.4"/>
      {/* Lower wings */}
      <path d="M12 13 C9.5 14 5 14 4.5 17.5 C4 21 8.5 21 11 17.5 C12 16 12 14 12 13z" strokeWidth="1.4"/>
      <path d="M12 13 C14.5 14 19 14 19.5 17.5 C20 21 15.5 21 13 17.5 C12 16 12 14 12 13z" strokeWidth="1.4"/>
      {/* Body — outlined ellipse */}
      <ellipse cx="12" cy="13" rx="1.1" ry="4" strokeWidth="1.2"/>
      {/* Antennae — clean curved lines, no tip circles */}
      <path d="M11.3 10 C10 8 8.5 6 7 4.5" strokeWidth="1"/>
      <path d="M12.7 10 C14 8 15.5 6 17 4.5" strokeWidth="1"/>
    </svg>
  );
}

/* Umbra — wavy mist lines */
function MistIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round">
      <path d="M3 9 Q6 6 9 9 Q12 12 15 9 Q18 6 21 9"/>
      <path d="M3 14 Q6 11 9 14 Q12 17 15 14 Q18 11 21 14"/>
      <path d="M5 19 Q8 17 11 19 Q14 21 17 19"/>
    </svg>
  );
}

/* Fantasia — 4-pointed star, outline */
function SparkleIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"/>
      {/* Small accent dots as tiny outline circles */}
      <circle cx="5" cy="5" r="1.1" strokeWidth="1.2"/>
      <circle cx="19" cy="5" r="0.85" strokeWidth="1.2"/>
      <circle cx="19" cy="19" r="0.85" strokeWidth="1.2"/>
    </svg>
  );
}

/* Oddia — attached icon (two face-shields with eye/mouth details), outline style to match other icons */
function MasksIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 55" fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <path d="M63.9205 1.32437C63.9078 0.988467 63.7271 0.680767 63.44 0.506967C63.1524 0.331167 62.7955 0.314567 62.4927 0.458167C48.2036 7.22867 35.4136 7.12417 23.3892 0.135867C23.0884 -0.0409325 22.7193 -0.0438327 22.4126 0.119267C22.1064 0.284267 21.9082 0.596767 21.8882 0.943467C21.6091 5.86537 21.6629 10.3753 22.0163 14.4155C14.8979 14.658 8.10326 12.9362 1.69636 9.21487C1.39606 9.03907 1.02646 9.03417 0.720258 9.19827C0.414058 9.36327 0.215358 9.67487 0.195358 10.0215C-1.18014 33.9209 4.69736 48.3819 18.1637 54.2315C20.3011 55.1603 22.8576 55.1059 24.9923 53.9835C29.6861 51.5166 33.4076 47.9422 36.1813 43.2248C37.4445 44.0034 38.6584 44.6486 39.8639 45.171C42.0551 46.1128 44.6049 46.0184 46.6891 44.9142C59.13 38.383 64.7662 24.1252 63.9205 1.32437ZM24.0616 52.214C22.4971 53.0382 20.5909 53.1046 18.9605 52.3976C6.65096 47.05 1.13186 33.7394 2.11036 11.7345C14.4676 18.3274 27.4736 17.6637 40.2715 11.9786C40.7745 33.05 35.4654 46.2199 24.0616 52.214ZM41.1472 28.9729C41.4913 28.9056 41.845 28.8595 42.2159 28.8595C44.8453 28.8595 47.0601 30.674 47.6524 33.1486H40.2261C40.5755 31.8099 40.8868 30.4234 41.1472 28.9729ZM45.7555 43.1447C44.2013 43.9689 42.2955 44.0402 40.6569 43.3342C39.5109 42.8379 38.3481 42.2157 37.1312 41.4596C38.116 39.5271 38.9645 37.4288 39.666 35.1487H48.8C49.0734 35.1487 49.3352 35.0364 49.5236 34.8391C49.7126 34.6409 49.8117 34.3743 49.799 34.1008C49.6042 30.0403 46.2736 26.8596 42.216 26.8596C41.9621 26.8596 41.7174 26.8912 41.4704 26.915C42.1867 22.0102 42.447 16.5258 42.2253 10.4055C42.2131 10.0696 42.0329 9.76187 41.7458 9.58707C41.4577 9.41227 41.1027 9.39567 40.7985 9.53727C35.0345 12.2607 29.4321 13.8333 24.0099 14.2947C23.6995 10.7772 23.6228 6.88697 23.8053 2.65637C35.4967 8.89857 48.319 8.98057 61.9684 2.89957C62.4898 23.9748 57.1807 37.1476 45.7555 43.1447Z"/>
      <path d="M17.311 27.6425C17.5332 27.6425 17.7514 27.5683 17.9297 27.4286C18.1704 27.2382 18.311 26.9491 18.311 26.6425C18.311 23.5295 15.7803 21.0439 12.7129 21.0439C9.71879 21.0439 7.12549 23.4619 7.12549 26.6425C7.12549 26.953 7.26999 27.247 7.51659 27.4355C7.76419 27.625 8.08449 27.6923 8.38429 27.6084C11.1099 26.877 14.0352 26.8789 17.0762 27.6143C17.1538 27.6338 17.2329 27.6425 17.311 27.6425ZM9.36279 25.3437C10.5319 22.3053 14.9318 22.3399 16.0796 25.3671C13.8595 24.9822 11.6077 24.9459 9.36279 25.3437Z"/>
      <path d="M30.4351 21.0439C27.4454 21.0439 24.8477 23.4554 24.8477 26.6425C24.8477 26.953 24.9922 27.247 25.2388 27.4355C25.4859 27.625 25.8072 27.6923 26.1065 27.6084C28.8326 26.8789 31.7574 26.8828 34.7979 27.6143C34.8755 27.6338 34.9546 27.6426 35.0328 27.6426C35.255 27.6426 35.4732 27.5684 35.6515 27.4287C35.8922 27.2383 36.0328 26.9492 36.0328 26.6426C36.0328 23.5291 33.5026 21.0439 30.4351 21.0439ZM27.085 25.3437C28.2375 22.3401 32.6403 22.3052 33.8013 25.3671C31.5813 24.9822 29.33 24.9459 27.085 25.3437Z"/>
      <path d="M51.4292 11.4036C49.8882 11.4036 48.4341 12.0091 47.3398 13.1038C46.2446 14.1858 45.6411 15.6409 45.6411 17.2024C45.6411 17.5129 45.7856 17.8069 46.0322 17.9954C46.209 18.1311 46.4233 18.2024 46.6411 18.2024C46.7275 18.2024 46.8144 18.1917 46.8999 18.1682C49.751 17.4045 52.8105 17.4065 55.9937 18.1741C56.292 18.2483 56.606 18.177 56.8467 17.9886C57.0874 17.7982 57.228 17.5091 57.228 17.2025C57.228 15.6546 56.6264 14.2005 55.5346 13.1087C54.4355 12.009 52.9775 11.4036 51.4292 11.4036ZM51.3096 15.5969C50.1402 15.5969 48.9908 15.6994 47.8653 15.9035C48.0513 15.3879 48.3502 14.9172 48.7501 14.5226C50.1974 13.0744 52.6817 13.0841 54.1202 14.5226C54.523 14.9259 54.8243 15.4044 55.0098 15.9269C53.7578 15.7063 52.5229 15.5969 51.3096 15.5969Z"/>
      <path d="M27.7433 34.637H14.5627C14.2893 34.637 14.0275 34.7493 13.8386 34.9475C13.6497 35.1457 13.5505 35.4123 13.5637 35.6858C13.7615 39.7415 17.095 42.9192 21.1531 42.9192C25.2117 42.9192 28.5452 39.7415 28.7425 35.6858C28.7557 35.4124 28.6561 35.1458 28.4676 34.9475C28.2785 34.7493 28.0168 34.637 27.7433 34.637ZM21.153 40.9192C18.5231 40.9192 16.3063 39.1077 15.7116 36.637H26.5949C26.0002 39.1077 23.7829 40.9192 21.153 40.9192Z"/>
    </svg>
  );
}

/* Oraclea — crystal ball on stand */
function CrystalBallIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="7"/>
      {/* Inner shimmer waves */}
      <path d="M5.8 10 Q8.5 7.5 12 10 Q15.5 12.5 18.2 10" strokeWidth="1.1" strokeOpacity="0.7"/>
      <path d="M7.2 13 Q9.5 11 12 13 Q14.5 15 16.8 13" strokeWidth="0.9" strokeOpacity="0.5"/>
      {/* Gleam */}
      <path d="M8.5 6.8 Q10 5.8 11.5 6.3" strokeWidth="1" strokeOpacity="0.55"/>
      {/* Stand */}
      <ellipse cx="12" cy="20" rx="3.5" ry="1.3"/>
      <line x1="12" y1="17" x2="12" y2="18.8"/>
    </svg>
  );
}

const ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  lucia:    MoonIcon,
  memora:   ButterflyIcon,
  umbra:    MistIcon,
  fantasia: SparkleIcon,
  oddia:    MasksIcon,
  oraclea:  CrystalBallIcon,
};

export function DreamIcon({ id, size = 20, color }: { id: string; size?: number; color?: string }) {
  const Icon = ICONS[id];
  if (!Icon) return null;
  return <Icon size={size} color={color} />;
}
