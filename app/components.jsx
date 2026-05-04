/* global React */
const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

// ─── Icons (Phosphor-style line, 24px viewbox) ───
const Icon = ({ name, size = 20, color = "currentColor", weight = 1.75, style }) => {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth: weight, strokeLinecap: "round", strokeLinejoin: "round", style };
  const paths = {
    shield: <><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z"/></>,
    flame: <><path d="M12 3c1.5 3 4.5 4.5 4.5 8.5A4.5 4.5 0 0 1 12 16a4.5 4.5 0 0 1-4.5-4.5C7.5 9 9 7 9 5c1 1.5 2 2 3 -2z"/></>,
    alarm: <><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2"/><path d="M5 5 3 7"/><path d="M19 5l2 2"/></>,
    camera: <><path d="M3 8h3l2-3h8l2 3h3v11H3z"/><circle cx="12" cy="13" r="3.5"/></>,
    calc: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M11 11h2M14 11h2M8 15h2M11 15h2M14 15h2M8 19h8"/></>,
    shake: <><path d="M9 3a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4z"/><path d="M3 10l-1 2 1 2M21 10l1 2-1 2"/></>,
    qr: <><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3M14 17v4M18 14v3M21 17h-3M21 21v-3"/></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></>,
    foot: <><path d="M9 5c-2 0-3 2-3 4s1 4 1 6c0 2 2 3 4 3s4-1 4-3-1-4-1-6 0-4-2-4z"/><circle cx="6" cy="14" r="1.5"/></>,
    grid: <><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    headset: <><path d="M4 16v-4a8 8 0 0 1 16 0v4"/><rect x="3" y="14" width="4" height="6" rx="1"/><rect x="17" y="14" width="4" height="6" rx="1"/></>,
    book: <><path d="M5 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H5zM19 4h-1a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h1z"/></>,
    leaf: <><path d="M5 19c0-7 5-13 14-14-1 9-7 14-14 14zM5 19c4-4 6-6 8-8"/></>,
    barbell: <><path d="M3 10v4M5 8v8M19 8v8M21 10v4M5 12h14"/></>,
    pen: <><path d="M16 3l5 5-12 12H4v-5z"/></>,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
    unlock: <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7-3"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    check: <><path d="M5 13l4 4 10-10"/></>,
    checkCircle: <><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></>,
    x: <><path d="M5 5l14 14M19 5L5 19"/></>,
    chevR: <><path d="M9 5l7 7-7 7"/></>,
    chevL: <><path d="M15 5l-7 7 7 7"/></>,
    chevDown: <><path d="M5 9l7 7 7-7"/></>,
    chevUp: <><path d="M5 15l7-7 7 7"/></>,
    arrowR: <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    share: <><circle cx="6" cy="12" r="2.5"/><circle cx="17" cy="6" r="2.5"/><circle cx="17" cy="18" r="2.5"/><path d="M8 11l7-4M8 13l7 4"/></>,
    users: <><circle cx="9" cy="9" r="3.5"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5"/><path d="M16 8a3 3 0 0 1 0 6M21 19c0-2-1.5-3.5-3.5-4.5"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 14v-4l-2-1-1-2 1-2-3-3-2 1-2-1-1-2H8L7 5 5 4 2 7l1 2-1 2-2 1v4l2 1 1 2-1 2 3 3 2-1 2 1 1 2h4l1-2 2-1z"/></>,
    upi: <><path d="M5 5l8 14L21 5l-8 5z"/></>,
    sparkle: <><path d="M12 3l1.8 5.5L19 10l-5.2 1.5L12 17l-1.8-5.5L5 10l5.2-1.5z"/><path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8L16.5 18.5l1.8-.7z"/></>,
    moon: <><path d="M21 13a8 8 0 0 1-10-10 8 8 0 1 0 10 10z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></>,
    bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/></>,
    mood: <><circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M8 14c1 1.5 2.5 2 4 2s3-.5 4-2"/></>,
    heart: <><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></>,
    edit: <><path d="M14 4l6 6-10 10H4v-6z"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M6 7v13h12V7M10 11v6M14 11v6"/></>,
    diamond: <><path d="M6 4h12l3 6-9 10L3 10z"/><path d="M6 4l3 6h6l3-6M3 10h18"/></>,
    apple: <><path d="M12 7c-2 0-3 1-4 1s-3-1-3 2c0 4 3 11 6 11 1 0 2-1 3-1s2 1 3 1c2 0 5-6 5-9 0-2-1-3-3-3z"/><path d="M14 4c0 2-1 3-2 3"/></>,
    spotify: <><circle cx="12" cy="12" r="9"/><path d="M7 9c4-1 8-1 11 1M7 13c3-1 7-1 9 1M8 16c2-.5 5-.5 7 0.5"/></>,
    health: <><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/><path d="M9 12h2v-2h2v2h2"/></>,
    calendar: <><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M4 10h16M9 4v4M15 4v4"/></>,
    cloud: <><path d="M7 15a4 4 0 0 1 1-8 5 5 0 0 1 9 1 4 4 0 0 1 0 8z"/></>,
    devices: <><rect x="3" y="5" width="11" height="9" rx="1.5"/><rect x="14" y="9" width="7" height="11" rx="1.5"/><path d="M7 18h4M9 14v4"/></>,
    refresh: <><path d="M4 12a8 8 0 0 1 14-5l3 1M20 12a8 8 0 0 1-14 5l-3-1M19 4v4h-4M5 20v-4h4"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9z"/></>,
    accessibility: <><circle cx="12" cy="5" r="2"/><path d="M5 9h14M9 9v4l-2 7M15 9v4l2 7M9 13h6"/></>,
    gift: <><rect x="3" y="9" width="18" height="11" rx="2"/><path d="M3 13h18M12 9v11M9 9c-2 0-3-3 0-3s3 3 3 3-1-3-3-3M15 9c2 0 3-3 0-3s-3 3-3 3"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></>,
    play: <><path d="M7 5v14l12-7z"/></>,
    duo: <><circle cx="12" cy="12" r="9"/><path d="M9 8c1.5 0 2.5 1 3 2 .5-1 1.5-2 3-2"/><circle cx="9.5" cy="11" r="1"/><circle cx="14.5" cy="11" r="1"/></>,
    digi: <><path d="M5 4h11l4 4v12H5z"/><path d="M16 4v4h4M9 12h6M9 16h4"/></>,
    whatsapp: <><circle cx="12" cy="12" r="9"/><path d="M16 13c-1 1.5-3 1.5-4 1l-3 .5.5-3c-.5-1-.5-3 1-4 2-1.5 5-.5 6 1 .5 2 0 3.5-.5 4.5z"/></>,
  };
  return <svg {...props}>{paths[name] || paths.info}</svg>;
};

// ─── Phone shell (custom — Alarm Shield doesn't use iOS-26 chrome) ───
function Phone({ children, dark = true }) {
  return (
    <div style={{
      width: 393, height: 852, borderRadius: 56, overflow: 'hidden',
      position: 'relative',
      background: dark ? 'var(--ink)' : 'var(--cream)',
      boxShadow:
        '0 0 0 2px rgba(255,255,255,0.6) inset,' +
        '0 0 0 11px #1a1410,' +
        '0 0 0 12px #3a2a20,' +
        '0 0 0 13px rgba(255,255,255,0.15),' +
        '0 50px 120px rgba(80,40,20,0.35),' +
        '0 20px 50px rgba(80,40,20,0.25),' +
        '0 8px 16px rgba(80,40,20,0.15)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Dynamic Island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 122, height: 36, borderRadius: 22, background: '#2A1810', zIndex: 100,
      }}/>
      {/* Status bar */}
      <StatusBar dark={dark}/>
      {/* Content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {/* Home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 134, height: 5, borderRadius: 3,
        background: dark ? 'rgba(251,247,240,0.5)' : 'rgba(15,14,26,0.35)',
        zIndex: 100,
      }}/>
    </div>
  );
}

function StatusBar({ dark = true, time = "6:30" }) {
  const c = dark ? "var(--text-on-dark)" : "var(--text-primary)";
  return (
    <div style={{
      height: 54, paddingTop: 18, padding: '18px 32px 0',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexShrink: 0, position: 'relative', zIndex: 10,
    }}>
      <span style={{ fontSize: 16, fontWeight: 600, color: c, letterSpacing: -0.2 }}>{time}</span>
      <div style={{ width: 122 }}/>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: c }}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="0.5"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.5"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5"/>
        </svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 3C9.7 3 11.7 3.8 13.2 5.2L14.3 4.1C12.5 2.4 10.1 1.3 7.5 1.3C4.9 1.3 2.5 2.4 0.7 4.1L1.8 5.2C3.3 3.8 5.3 3 7.5 3z" opacity="0.8"/>
          <path d="M7.5 6.3C8.8 6.3 10 6.8 10.9 7.7L12 6.6C10.7 5.4 9.2 4.6 7.5 4.6C5.8 4.6 4.3 5.4 3 6.6L4.1 7.7C5 6.8 6.2 6.3 7.5 6.3z"/>
          <circle cx="7.5" cy="9.7" r="1.3"/>
        </svg>
        {/* battery */}
        <svg width="25" height="11" viewBox="0 0 25 11" fill="none">
          <rect x="0.5" y="0.5" width="21" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.4"/>
          <rect x="2" y="2" width="18" height="7" rx="1.2" fill="currentColor"/>
          <path d="M23 4v3c0.7-.2 1.2-.9 1.2-1.5 0-.6-.5-1.3-1.2-1.5z" fill="currentColor" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Buttons ───
function Button({ children, kind = "primary", size = "lg", icon, iconRight, fullWidth, onClick, disabled, style, ariaLabel }) {
  const [pressed, setPressed] = useState(false);
  const heights = { lg: 56, md: 48, sm: 40 };
  const styles = {
    primary: {
      background: 'linear-gradient(180deg, #F89366 0%, #EE7A48 60%, #D26536 100%)',
      color: '#FFFBF5',
      fontWeight: 600,
      boxShadow: '0 1px 0 rgba(255,255,255,0.4) inset, 0 -1px 0 rgba(122,46,14,0.3) inset, 0 8px 20px rgba(238,122,72,0.35), 0 2px 6px rgba(238,122,72,0.25)',
    },
    secondary: {
      background: 'linear-gradient(180deg, #FFFBF5 0%, #FFEFE0 100%)',
      color: 'var(--text-primary)',
      border: '1px solid rgba(245,217,192,0.8)',
      fontWeight: 500,
      boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 1px 3px rgba(80,40,20,0.06)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--sunrise-500)',
      fontWeight: 500,
    },
    dashed: {
      background: 'var(--ink-soft)',
      color: 'var(--sunrise-500)',
      border: '1px dashed var(--ink-line)',
      fontWeight: 500,
    },
    danger: {
      background: 'transparent',
      color: 'var(--danger)',
      fontWeight: 500,
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        height: heights[size],
        width: fullWidth ? '100%' : undefined,
        padding: '0 20px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontSize: size === "lg" ? 16 : 14, letterSpacing: 0.02,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 120ms var(--ease-overshoot), background 160ms ease',
        ...styles[kind], ...style,
      }}>
      {icon && <Icon name={icon} size={18}/>}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={18}/>}
    </button>
  );
}

// ─── Toggle ───
function Toggle({ on, onChange, size = "md" }) {
  const w = size === "sm" ? 36 : 44;
  const h = size === "sm" ? 22 : 26;
  const k = h - 4;
  return (
    <button onClick={() => onChange?.(!on)}
      style={{
        width: w, height: h, padding: 0, borderRadius: 999, border: 'none',
        background: on ? 'var(--sunrise-500)' : 'var(--ink-elevated)',
        position: 'relative', cursor: 'pointer',
        transition: 'background 160ms ease', flexShrink: 0,
      }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? w - k - 2 : 2,
        width: k, height: k, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        transition: 'left 200ms var(--ease-overshoot)',
      }}/>
    </button>
  );
}

// ─── Streak Ring ───
function StreakRing({ value = 47, max = 100, size = 96, stroke = 6, label, glow = true, animate = true }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const [animated, setAnimated] = useState(animate ? 0 : pct);
  const gid = useMemo(() => `g${Math.random().toString(36).slice(2,8)}`, []);
  const gid2 = useMemo(() => `gh${Math.random().toString(36).slice(2,8)}`, []);
  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setAnimated(pct), 50);
    return () => clearTimeout(t);
  }, [pct, animate]);

  // Leading-edge sparkle position (-π/2 starts at top, sweeping clockwise)
  const angle = animated * 2 * Math.PI - Math.PI / 2;
  const headX = size/2 + r * Math.cos(angle);
  const headY = size/2 + r * Math.sin(angle);

  return (
    <div style={{ position: 'relative', width: size, height: size,
      filter: glow ? 'drop-shadow(0 8px 24px rgba(238,122,72,0.42)) drop-shadow(0 0 36px rgba(255,176,136,0.55))' : undefined }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FFE39B"/>
            <stop offset="30%"  stopColor="#FFD66E"/>
            <stop offset="65%"  stopColor="#FFB088"/>
            <stop offset="100%" stopColor="#EE7A48"/>
          </linearGradient>
          <radialGradient id={gid2}>
            <stop offset="0%"   stopColor="#FFFBF5" stopOpacity="0.95"/>
            <stop offset="55%"  stopColor="#FFD66E" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#EE7A48" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {/* Outer track */}
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(122,46,14,0.12)" strokeWidth={stroke} fill="none"/>
        {/* Inner depth ring */}
        <circle cx={size/2} cy={size/2} r={Math.max(r - stroke - 2, 4)} stroke="rgba(122,46,14,0.05)" strokeWidth={1} fill="none"/>
        {/* Progress */}
        <circle cx={size/2} cy={size/2} r={r}
          stroke={`url(#${gid})`} strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - animated)}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1400ms cubic-bezier(0.4,0,0.2,1)' }}/>
        {/* Leading-edge sparkle */}
        {animated > 0.02 && (
          <>
            <circle cx={headX} cy={headY} r={stroke * 1.7} fill={`url(#${gid2})`} style={{ transition: 'all 1400ms cubic-bezier(0.4,0,0.2,1)' }}/>
            <circle cx={headX} cy={headY} r={Math.max(stroke * 0.45, 2)} fill="#FFFBF5" style={{ transition: 'all 1400ms cubic-bezier(0.4,0,0.2,1)' }}/>
          </>
        )}
      </svg>
    </div>
  );
}

// ─── Sheet (bottom) ───
function Sheet({ open, onClose, children, height = '70%', title }) {
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) setMounted(true);
    else { const t = setTimeout(() => setMounted(false), 320); return () => clearTimeout(t); }
  }, [open]);
  if (!mounted) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      pointerEvents: open ? 'auto' : 'none',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
        opacity: open ? 1 : 0, transition: 'opacity 280ms var(--ease-out-expo)',
      }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height, background: 'var(--ink-elevated)',
        borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms var(--ease-out-expo)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, background: 'var(--text-on-dark-soft)', opacity: 0.6, borderRadius: 999 }}/>
        </div>
        {title && <div className="t-heading-md" style={{ padding: '12px 24px 8px', color: 'var(--text-on-dark)' }}>{title}</div>}
        <div className="scene-scroll" style={{ flex: 1, padding: '8px 20px 28px' }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Modal (centered) ───
function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 220 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', animation: 'fadeIn 200ms ease' }}/>
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        width: 320, background: 'var(--ink-elevated)',
        borderRadius: 'var(--radius-xl)', padding: 24,
        animation: 'slideUp 280ms var(--ease-out-expo)',
      }}>
        {title && <div className="t-heading-sm" style={{ marginBottom: 12 }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

// ─── Top bar ───
function TopBar({ leading, title, trailing, onBack }) {
  return (
    <div style={{
      height: 52, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {onBack && (
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'var(--text-on-dark)', display: 'flex', alignItems: 'center', gap: 4, padding: 6, marginLeft: -6, cursor: 'pointer' }}>
            <Icon name="chevL" size={22}/>
          </button>
        )}
        {leading}
      </div>
      <div className="t-heading-sm" style={{ color: 'var(--text-on-dark)' }}>{title}</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{trailing}</div>
    </div>
  );
}

// ─── Tab bar ───
function TabBar({ active, onChange }) {
  const tabs = [
    { id: "alarms", label: "Alarms", icon: "alarm" },
    { id: "streak", label: "Streak", icon: "flame" },
    { id: "you",    label: "You",    icon: "users" },
  ];
  return (
    <div style={{
      height: 64 + 24, padding: '8px 16px 24px',
      background: 'var(--ink-elevated)',
      borderTop: '1px solid var(--ink-line)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      flexShrink: 0,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: 8,
            color: active === t.id ? 'var(--sunrise-500)' : 'var(--text-on-dark-soft)',
          }}>
          <Icon name={t.icon} size={24} weight={active === t.id ? 2.25 : 1.75}/>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.04 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Toast ───
const ToastContext = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, kind = "info") => {
    const id = Math.random();
    setToasts(t => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2400);
  }, []);
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, zIndex: 300, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.kind === "success" ? 'var(--success)' :
                        t.kind === "warning" ? 'var(--warning)' :
                        t.kind === "error"   ? 'var(--danger)' : 'var(--ink-elevated)',
            color: t.kind === "info" ? 'var(--text-on-dark)' : '#0F0E1A',
            padding: '10px 18px', borderRadius: 999,
            fontSize: 14, fontWeight: 500,
            boxShadow: 'var(--shadow-md)',
            animation: 'slideUp 280ms var(--ease-out-expo)',
            maxWidth: 320, textAlign: 'center',
          }}>{t.msg}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
const useToast = () => useContext(ToastContext);

// ─── Premium tag ───
function PremiumTag({ size = "sm" }) {
  return (
    <span style={{
      background: 'var(--sunrise-500)', color: '#FFFBF5',
      padding: size === "sm" ? '2px 8px' : '4px 10px',
      borderRadius: 'var(--radius-sm)',
      fontSize: 11, fontWeight: 700, letterSpacing: 0.04,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      boxShadow: '0 2px 8px rgba(238,122,72,0.3)',
    }}>Premium</span>
  );
}

// ─── Settings row + group ───
function SettingsGroup({ children, header }) {
  const kids = React.Children.toArray(children);
  return (
    <div style={{ marginBottom: 20 }}>
      {header && (
        <div className="t-label-sm" style={{ color: 'var(--text-on-dark-soft)', padding: '0 4px 8px' }}>{header}</div>
      )}
      <div style={{ background: 'var(--ink-soft)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {kids.map((c, i) => (
          <React.Fragment key={i}>
            {c}
            {i < kids.length - 1 && <div style={{ height: 1, background: 'var(--ink-line)', marginLeft: 16 }}/>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function SettingsRow({ label, sublabel, value, trailing, premium, onClick, icon, iconColor }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', minHeight: 56, padding: '12px 16px',
      background: 'none', border: 'none', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      color: 'var(--text-on-dark)',
    }}>
      {icon && (
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: iconColor || 'var(--ink-elevated)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon name={icon} size={18}/>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="t-body-md" style={{ color: 'var(--text-on-dark)' }}>{label}</div>
        {sublabel && <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)', marginTop: 2 }}>{sublabel}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {value && <span className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>{value}</span>}
        {premium && <PremiumTag/>}
        {trailing}
      </div>
    </button>
  );
}

// ─── Paywall (reusable, per PRD §5.9) ───
function Paywall({ open, onClose, triggerFeatureName, onSuccess, onStudent }) {
  const toast = useToast();
  const featureMap = {
    "AI Morning Brief": { icon: "sparkle", desc: "Replaces your social feed with what matters" },
    "Spotify wake": { icon: "spotify", desc: "Wake to a track from your library" },
    "Apple Health sync": { icon: "health", desc: "Auto-track your shielded mornings" },
    "Apple Watch": { icon: "devices", desc: "Companion app for your wrist" },
    "Custom alarm sounds": { icon: "play", desc: "Five premium sound packs" },
    "Reading mission": { icon: "book", desc: "Verified by your Kindle" },
    "Meditation mission": { icon: "leaf", desc: "Headspace / Calm integration" },
    "Gym check-in": { icon: "barbell", desc: "Verified by GPS at your gym" },
    "Duolingo handoff": { icon: "duo", desc: "5 minutes of streaks before scrolling" },
    "AI personality": { icon: "sparkle", desc: "Stoic / Funny / Brutal / Encouraging" },
    "Friend-paid commitment": { icon: "users", desc: "Send to a friend instead of charity" },
    "Streak insurance via UPI": { icon: "refresh", desc: "Pay ₹100 to recover your streak" },
    "Public commitment": { icon: "globe", desc: "Make it public for accountability" },
    "Multi-device sync": { icon: "devices", desc: "Mac, iPad, Android" },
    "Cloud backup": { icon: "cloud", desc: "Restore on any device" },
    "Custom alarm sound packs": { icon: "play", desc: "Sunrise, Forest, Cafe, Boutique, Generative" },
  };
  const ctx = featureMap[triggerFeatureName] || null;
  if (!open) return null;
  const headline = triggerFeatureName ? `Unlock ${triggerFeatureName}` : "Unlock the morning you actually want";

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 250 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', animation: 'fadeIn 200ms ease' }}/>
      <div className="scene-scroll" style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: '92%', background: 'var(--ink)',
        borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)',
        animation: 'slideUp 320ms var(--ease-out-expo)',
        padding: '16px 24px 28px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ink-soft)', border: 'none', color: 'var(--text-on-dark-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={18}/>
          </button>
        </div>

        <div className="t-heading-lg" style={{ color: 'var(--text-on-dark)', textWrap: 'balance', marginBottom: 16 }}>
          {headline}
        </div>

        {ctx && (
          <div style={{
            background: 'linear-gradient(135deg, var(--ink-soft), var(--ink-elevated))',
            border: '1px solid var(--ink-line)',
            borderRadius: 'var(--radius-lg)', padding: 14,
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--sunrise-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}>
              <Icon name={ctx.icon} size={22}/>
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-body-md" style={{ fontWeight: 600 }}>{triggerFeatureName}</div>
              <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>{ctx.desc}</div>
            </div>
          </div>
        )}

        {/* Lifetime — primary */}
        <button onClick={() => { onSuccess?.(); toast?.("Premium activated (mock)", "success"); onClose(); }}
          style={{
            width: '100%', padding: '18px 20px', borderRadius: 'var(--radius-lg)',
            background: 'var(--sunrise-500)', color: 'var(--ink)', border: 'none',
            display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start',
            cursor: 'pointer', marginBottom: 10,
            boxShadow: '0 12px 32px rgba(248,147,102,0.22)',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <span className="t-label-sm" style={{ fontWeight: 700 }}>★ LIFETIME</span>
            <span style={{ marginLeft: 'auto', background: 'rgba(15,14,26,0.15)', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: 0.04 }}>MOST POPULAR IN INDIA</span>
          </div>
          <div className="t-heading-md" style={{ fontWeight: 700 }}>₹499 once. Forever yours.</div>
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          <button onClick={() => { onSuccess?.(); toast?.("Premium activated (mock)", "success"); onClose(); }}
            style={{ background: 'var(--ink-soft)', border: '1px solid var(--ink-line)', color: 'var(--text-on-dark)', padding: '14px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left' }}>
            <div className="t-label-sm" style={{ color: 'var(--text-on-dark-soft)' }}>ANNUAL</div>
            <div className="t-heading-sm" style={{ marginTop: 4 }}>₹249/yr</div>
            <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>₹0.68/day</div>
          </button>
          <button onClick={() => { onSuccess?.(); toast?.("Premium activated (mock)", "success"); onClose(); }}
            style={{ background: 'var(--ink-soft)', border: '1px solid var(--ink-line)', color: 'var(--text-on-dark)', padding: '14px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left' }}>
            <div className="t-label-sm" style={{ color: 'var(--text-on-dark-soft)' }}>MONTHLY</div>
            <div className="t-heading-sm" style={{ marginTop: 4 }}>₹29/mo</div>
            <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>₹0.97/day</div>
          </button>
        </div>

        <button onClick={onStudent} style={{ background: 'none', border: 'none', color: 'var(--sunrise-500)', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: 0, marginBottom: 20 }}>
          Student? <span style={{ textDecoration: 'underline' }}>Verify</span>
        </button>

        <div style={{ height: 1, background: 'var(--ink-line)', margin: '0 -4px 18px' }}/>

        <div className="t-label-md" style={{ color: 'var(--text-on-dark)', marginBottom: 12 }}>What you get</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {[
            { i: "sparkle", t: "AI-powered features" },
            { i: "lock",    t: "Premium integrations" },
            { i: "upi",     t: "UPI commitment family" },
            { i: "leaf",    t: "Specialty rituals" },
            { i: "devices", t: "Cross-device & content" },
          ].map(x => (
            <div key={x.t} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-on-dark-soft)' }}>
              <Icon name="check" size={18} color="var(--success)"/>
              <span className="t-body-md">{x.t}</span>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-on-dark-soft)', fontSize: 15, cursor: 'pointer', width: '100%', padding: 14 }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}

// ─── Student verify (DigiLocker) ───
function StudentVerify({ open, onClose, onVerified }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 260 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%',
        background: 'var(--ink)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '16px 24px 28px',
        animation: 'slideUp 320ms var(--ease-out-expo)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ink-soft)', border: 'none', color: 'var(--text-on-dark-soft)', cursor: 'pointer' }}><Icon name="x" size={18}/></button>
        </div>
        <div className="t-heading-lg" style={{ marginTop: 12, marginBottom: 12 }}>Student pricing</div>
        <div className="t-body-md" style={{ color: 'var(--text-on-dark-soft)', marginBottom: 20 }}>
          ₹19/month or ₹149/year. About 60% off standard premium. Verify once, valid 12 months.
        </div>
        <Button kind="primary" fullWidth icon="digi" iconRight="arrowR"
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              toast?.("Student status verified — pricing updated", "success");
              onVerified?.();
              onClose();
            }, 1500);
          }}>
          {loading ? "Verifying…" : "Verify with DigiLocker"}
        </Button>
        <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)', marginTop: 16, marginBottom: 16 }}>
          We use DigiLocker to verify your student status. We don't store your documents.
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--sunrise-500)', cursor: 'pointer', padding: 0, fontSize: 14, fontWeight: 500 }}>
          Use a college email instead
        </button>
      </div>
    </div>
  );
}

// ─── Segmented control ───
function Segmented({ value, onChange, options, ariaLabel }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} style={{
      display: 'flex',
      background: 'rgba(122,46,14,0.07)',
      borderRadius: 11,
      padding: 3,
      gap: 2,
    }}>
      {options.map(opt => {
        const sel = value === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={sel}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              padding: '9px 10px',
              background: sel ? 'linear-gradient(135deg, #FFD66E, #EE7A48)' : 'transparent',
              color: sel ? '#FFFBF5' : '#7A2E0E',
              border: 'none',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: 0.2,
              boxShadow: sel
                ? '0 3px 10px rgba(238,122,72,0.35), inset 0 1px 0 rgba(255,255,255,0.4)'
                : 'none',
              transition: 'all 220ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >{opt.label}</button>
        );
      })}
    </div>
  );
}

// ─── Demo jump button — sized to match Segmented inner pill ───
function DemoJumpButton({ icon, label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '9px 10px',
        background: hover ? 'rgba(238,122,72,0.18)' : 'rgba(255,255,255,0.55)',
        border: '1px solid ' + (hover ? 'rgba(238,122,72,0.4)' : 'rgba(245,217,192,0.8)'),
        borderRadius: 8,
        color: '#7A2E0E',
        fontSize: 12.5, fontWeight: 600, letterSpacing: 0.2,
        cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-start',
        transition: 'all 180ms ease',
        textAlign: 'left',
      }}>
      <Icon name={icon} size={13}/>
      <span>{label}</span>
    </button>
  );
}

// ─── Journey control panel — floating top-right demo controls ───
function JourneyPanel({ isFirstTime, onChangeUserType, isPremium, onChangePlan, onJumpWake, onJumpSuccess, onJumpShield, onJumpPaywall }) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        position: 'fixed', top: 24, right: 24, zIndex: 9999,
        background: 'linear-gradient(135deg, #FFD66E, #EE7A48)',
        color: '#FFFBF5',
        border: '1px solid rgba(255,255,255,0.4)',
        padding: '10px 16px',
        borderRadius: 999,
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.4,
        boxShadow: '0 8px 22px rgba(238,122,72,0.4), inset 0 1px 0 rgba(255,255,255,0.4)',
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: 'inherit',
      }} aria-label="Open demo controls">
        <Icon name="sparkle" size={14}/> View as
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      width: 260,
      background: 'linear-gradient(160deg, #FFFBF5 0%, #FFEFE0 100%)',
      border: '1px solid rgba(255,255,255,0.85)',
      borderRadius: 18,
      padding: '16px 16px 18px',
      boxShadow:
        '0 1px 0 rgba(255,255,255,0.95) inset,' +
        '0 -1px 0 rgba(245,217,192,0.5) inset,' +
        '0 14px 40px rgba(80,40,20,0.18),' +
        '0 0 0 1px rgba(245,217,192,0.4)',
      animation: 'slideUp 320ms cubic-bezier(0.16, 1, 0.3, 1)',
      fontFamily: 'inherit',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 9,
            background: 'linear-gradient(135deg, #FFD66E, #EE7A48)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFFBF5',
            boxShadow: '0 4px 10px rgba(238,122,72,0.35), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}>
            <Icon name="sparkle" size={14} weight={2.2}/>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2A1810', letterSpacing: 0.7, textTransform: 'uppercase', lineHeight: 1.1 }}>View as</div>
            <div style={{ fontSize: 10, color: 'rgba(122,46,14,0.55)', marginTop: 2, letterSpacing: 0.2 }}>demo controls</div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Collapse demo controls"
          style={{
            background: 'rgba(122,46,14,0.06)',
            border: 'none',
            width: 26, height: 26, borderRadius: 7,
            cursor: 'pointer',
            color: 'rgba(122,46,14,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'inherit',
          }}>
          <Icon name="chevDown" size={14}/>
        </button>
      </div>

      {/* User type */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontSize: 9.5, fontWeight: 700, color: 'rgba(122,46,14,0.55)',
          letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 6,
        }}>User</div>
        <Segmented
          ariaLabel="User type"
          value={isFirstTime ? "first" : "returning"}
          onChange={(v) => onChangeUserType(v === "first")}
          options={[
            { value: "first",     label: "First-time" },
            { value: "returning", label: "Returning" },
          ]}/>
      </div>

      {/* Plan */}
      <div>
        <div style={{
          fontSize: 9.5, fontWeight: 700, color: 'rgba(122,46,14,0.55)',
          letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 6,
        }}>Plan</div>
        <Segmented
          ariaLabel="Plan tier"
          value={isPremium ? "premium" : "free"}
          onChange={(v) => onChangePlan(v === "premium")}
          options={[
            { value: "free",    label: "Free" },
            { value: "premium", label: "Premium" },
          ]}/>
      </div>

      {/* Demo jumps */}
      {(onJumpWake || onJumpSuccess || onJumpShield || onJumpPaywall) && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(245,217,192,0.8)' }}>
          <div style={{
            fontSize: 9.5, fontWeight: 700, color: 'rgba(122,46,14,0.55)',
            letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 8,
          }}>Demo jumps</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {onJumpWake    && <DemoJumpButton icon="bell"    label="Wake"    onClick={onJumpWake}/>}
            {onJumpSuccess && <DemoJumpButton icon="flame"   label="Streak"  onClick={onJumpSuccess}/>}
            {onJumpShield  && <DemoJumpButton icon="shield"  label="Shield"  onClick={onJumpShield}/>}
            {onJumpPaywall && <DemoJumpButton icon="diamond" label="Paywall" onClick={onJumpPaywall}/>}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  Icon, Phone, StatusBar, Button, Toggle, StreakRing, Sheet, Modal,
  TopBar, TabBar, ToastProvider, useToast, PremiumTag,
  SettingsGroup, SettingsRow, Paywall, StudentVerify,
  Segmented, JourneyPanel,
});
