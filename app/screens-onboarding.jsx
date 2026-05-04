/* global React */
const { useState, useEffect, useRef } = React;

// ─── Splash — sunrise reveal ───
function SplashScreen({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      flex: 1, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg, #FFE5CE 0%, #FFD9B8 60%, #FFC299 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Rising sun rays */}
      <div style={{ position: 'absolute', bottom: '-50%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'conic-gradient(from 90deg at 50% 100%, transparent 0deg, transparent 230deg, rgba(255,214,110,0.45) 250deg, rgba(255,214,110,0.6) 270deg, rgba(255,214,110,0.45) 290deg, transparent 310deg, transparent 360deg)',
          animation: 'sunRays 24s linear infinite',
          transformOrigin: '50% 100%',
        }}/>
      </div>
      {/* Sun disc */}
      <div style={{
        width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, #FFFBF5 0%, #FFD66E 40%, #EE7A48 100%)',
        boxShadow: '0 0 80px rgba(238,122,72,0.5), 0 0 160px rgba(255,214,110,0.4)',
        animation: 'splashRise 1400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        position: 'relative', zIndex: 2,
      }}/>

      <div style={{ marginTop: 28, animation: 'fadeIn 800ms 700ms ease both', position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div className="t-display-lg" style={{ fontFamily: 'var(--font-display)', color: '#2A1810', fontWeight: 400, fontStyle: 'italic', letterSpacing: -0.5 }}>
          alarm shield
        </div>
        <div className="t-body-sm" style={{ color: '#7A2E0E', marginTop: 6, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
          Win the morning
        </div>
      </div>

      <style>{`
        @keyframes splashRise {
          from { transform: translateY(160px) scale(0.4); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Onboarding ───
function ProgressDots({ count, current }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 22 : 6, height: 6, borderRadius: 999,
          background: i <= current ? 'var(--sunrise-500)' : 'rgba(122,46,14,0.18)',
          transition: 'width 320ms var(--ease-out-expo), background 240ms ease',
          boxShadow: i === current ? '0 2px 8px rgba(238,122,72,0.4)' : 'none',
        }}/>
      ))}
    </div>
  );
}

function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [q3, setQ3] = useState(null);
  const [why, setWhy] = useState("");
  const [time, setTime] = useState({ h: 6, m: 30, ampm: "AM" });
  const [mission, setMission] = useState("Photo");

  const headerStep = step === 0 ? 0 : step <= 4 ? 1 : step === 5 ? 2 : 3;

  // Each step renders inside a sliding container for a smooth transition between scenes.
  const slide = (
    <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'slideIn 380ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
      {step === 0 && <OnbHook onNext={() => setStep(1)}/>}
      {step === 1 && <OnbTileQuiz q={1}
        prompt={<>How often do you check your phone <em style={{ color: 'var(--sunrise-700)', fontStyle: 'italic' }}>in a day</em>?</>}
        sub="be honest with yourself"
        emoji="📱"
        tiles={[
          { v: "<50",     big: "<50",   l: "a day",   reaction: "rare!",   bg: "linear-gradient(135deg, #FFE8DC, #FCC9A8)" },
          { v: "50–100",  big: "50–100",l: "a day",   reaction: "average", bg: "linear-gradient(135deg, #FFD9B8, #FFB088)" },
          { v: "100–150", big: "100+",  l: "a day",   reaction: "ouch",    bg: "linear-gradient(135deg, #FFB088, #FF8C5A)" },
          { v: "150+",    big: "150+",  l: "every day",reaction: "yikes",   bg: "linear-gradient(135deg, #FF8C5A, #FF6B6B)" },
        ]} value={q1} onSelect={(v) => { setQ1(v); setTimeout(() => setStep(2), 500); }}/>}
      {step === 2 && <OnbTileQuiz q={2}
        prompt={<>How long before you <em style={{ color: 'var(--sunrise-700)', fontStyle: 'italic' }}>scroll</em> in the morning?</>}
        sub="first social app — Instagram, TikTok, X…"
        emoji="🌅"
        tiles={[
          { v: "<1 min",    big: "< 1",   l: "minute",  reaction: "the worst", bg: "linear-gradient(135deg, #FF6B6B, #EE7A48)" },
          { v: "1–10 min",  big: "1–10",  l: "minutes", reaction: "common",    bg: "linear-gradient(135deg, #FFB088, #FF8C5A)" },
          { v: "10–30 min", big: "10–30", l: "minutes", reaction: "decent",    bg: "linear-gradient(135deg, #FFD66E, #FFB088)" },
          { v: "30+ min",   big: "30+",   l: "minutes", reaction: "champion",  bg: "linear-gradient(135deg, #6FD6A6, #FFD66E)" },
          { v: "never",     big: "never", l: "do that", reaction: "legend",    bg: "linear-gradient(135deg, #7CC4E8, #6FD6A6)" },
          { v: "depends",   big: "varies",l: "day to day",reaction: "fair",    bg: "linear-gradient(135deg, #B8A5E8, #7CC4E8)" },
        ]} value={q2} onSelect={(v) => { setQ2(v); setTimeout(() => setStep(3), 500); }}/>}
      {step === 3 && <OnbWishCards q={3} value={q3} onSelect={(v) => { setQ3(v); setTimeout(() => setStep(4), 500); }}/>}
      {step === 4 && <OnbCalc q1={q1} q3={q3} onNext={() => setStep(5)}/>}
      {step === 5 && <OnbWhy why={why} setWhy={setWhy} q3={q3} onNext={() => setStep(6)}/>}
      {step === 6 && <OnbAlarm time={time} setTime={setTime} mission={mission} setMission={setMission} onDone={() => onDone({ why, mission, alarmTime: time })}/>}
    </div>
  );

  return (
    <div style={{ flex: 1, background: 'linear-gradient(180deg, #FFFBF5 0%, #FFEFE0 100%)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Decorative dawn glow */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,110,0.4), transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: -40, left: -60, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,107,0.18), transparent 70%)', pointerEvents: 'none' }}/>

      <div style={{ padding: '14px 24px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <ProgressDots count={4} current={headerStep}/>
        <button onClick={onDone} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Skip</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2, overflow: 'hidden' }}>
        {slide}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(40px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-6px) rotate(var(--r, 0deg)); }
        }
      `}</style>
    </div>
  );
}

// ─── Hook — animated, with phone illustration ───
function OnbHook({ onNext }) {
  return (
    <div style={{ flex: 1, padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      {/* Phone in a hand illustration with floating apps */}
      <div style={{ position: 'relative', height: 280, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
        {/* Glow */}
        <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,110,0.5), transparent 70%)', top: 10 }}/>

        {/* Phone */}
        <div style={{
          position: 'relative', width: 110, height: 200, borderRadius: 22,
          background: 'linear-gradient(180deg, #2A1810 0%, #4a3025 100%)',
          border: '3px solid #1a0f08',
          boxShadow: '0 20px 50px rgba(80,40,20,0.4), 0 8px 16px rgba(80,40,20,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
          padding: 8, animation: 'float-card 4s ease-in-out infinite',
        }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 14, background: 'linear-gradient(135deg, #FFD66E 0%, #EE7A48 100%)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, padding: 8 }}>
            {Array.from({length: 9}).map((_, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 6, aspectRatio: '1' }}/>
            ))}
          </div>
        </div>

        {/* Floating app emojis (the time-eaters) */}
        {[
          { e: "📷", l: -50, t: 30, r: -8, d: 0 },
          { e: "🎵", l: 130, t: 20, r: 12, d: 0.6 },
          { e: "💬", l: -65, t: 130, r: -15, d: 1.2 },
          { e: "📺", l: 140, t: 150, r: 8, d: 0.3 },
          { e: "🎮", l: 90, t: -20, r: -10, d: 0.9 },
        ].map((a, i) => (
          <div key={i} style={{
            position: 'absolute', left: '50%', top: 0, transform: `translateX(${a.l}px) translateY(${a.t}px) rotate(${a.r}deg)`,
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--cream-true)', boxShadow: '0 8px 20px rgba(80,40,20,0.15), 0 2px 6px rgba(80,40,20,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            animation: `float-card 3s ${a.d}s ease-in-out infinite`,
            ['--r']: `${a.r}deg`,
          }}>{a.e}</div>
        ))}
      </div>

      <div className="t-display-xl" style={{ color: 'var(--text-primary)', textWrap: 'balance', marginTop: 24, fontFamily: 'var(--font-display)', fontWeight: 400 }}>
        How much of your life is your phone <em style={{ color: 'var(--sunrise-700)', fontStyle: 'italic' }}>eating</em>?
      </div>
      <div className="t-body-md" style={{ color: 'var(--text-secondary)', marginTop: 16, maxWidth: 280, textWrap: 'balance' }}>
        Most of us don't know. Most of us would rather not. Let's find out anyway.
      </div>
      <div style={{ flex: 1 }}/>
      <Button kind="primary" fullWidth onClick={onNext} iconRight="arrowR">Find out about me</Button>
    </div>
  );
}

// ─── Tile-based quiz (used for Q1 + Q2) ───
function OnbTileQuiz({ q, prompt, sub, emoji, tiles, value, onSelect }) {
  return (
    <div style={{ flex: 1, padding: '16px 24px 24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg, #FFD66E, #EE7A48)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
          boxShadow: '0 8px 20px rgba(238,122,72,0.3)',
          animation: 'float-card 3s ease-in-out infinite',
        }}>{emoji}</div>
        <div>
          <div className="t-label-sm" style={{ color: 'var(--sunrise-700)' }}>Question {q} of 3</div>
          <div className="t-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</div>
        </div>
      </div>

      <div className="t-heading-lg" style={{ color: 'var(--text-primary)', textWrap: 'balance', fontFamily: 'var(--font-display)', fontWeight: 400, marginTop: 4 }}>
        {prompt}
      </div>

      <div style={{ flex: 1, marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, alignContent: 'start' }}>
        {tiles.map((t, i) => {
          const sel = value === t.v;
          return (
            <button key={t.v} onClick={() => onSelect(t.v)} style={{
              aspectRatio: '1.05', borderRadius: 22, padding: 14,
              background: t.bg,
              border: sel ? '3px solid var(--sunrise-700)' : '1px solid rgba(255,255,255,0.6)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: sel
                ? '0 12px 28px rgba(238,122,72,0.35), 0 1px 0 rgba(255,255,255,0.9) inset'
                : '0 6px 16px rgba(80,40,20,0.1), 0 1px 0 rgba(255,255,255,0.7) inset',
              transform: sel ? 'scale(0.97)' : 'scale(1)',
              transition: 'all 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              animation: `float-card ${3 + i * 0.25}s ${i * 0.15}s ease-in-out infinite`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 36, lineHeight: 1,
                color: '#2A1810', letterSpacing: '-0.02em',
              }} className="tnum">{t.big}</div>
              <div>
                <div className="t-body-sm" style={{ color: 'rgba(42,24,16,0.7)' }}>{t.l}</div>
                <div className="t-label-sm" style={{
                  color: '#7A2E0E', marginTop: 4, fontStyle: 'italic',
                  opacity: sel ? 1 : 0.7,
                }}>{t.reaction}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Wish cards (Q3) — visual scenario picker ───
function OnbWishCards({ value, onSelect }) {
  const wishes = [
    { v: "Read",     emoji: "📖", l: "Read",       sub: "more books"    , bg: "linear-gradient(135deg, #FFE8DC, #FCC9A8)" },
    { v: "Workout",  emoji: "🏃", l: "Workout",    sub: "build the body", bg: "linear-gradient(135deg, #FFD66E, #FFB088)" },
    { v: "Journal",  emoji: "✍️", l: "Journal",    sub: "write it down" , bg: "linear-gradient(135deg, #FFB088, #FF6B6B)" },
    { v: "Meditate", emoji: "🧘", l: "Meditate",   sub: "be still"       , bg: "linear-gradient(135deg, #B8A5E8, #7CC4E8)" },
    { v: "Walk",     emoji: "🌳", l: "Walk",       sub: "outside, alone" , bg: "linear-gradient(135deg, #6FD6A6, #7CC4E8)" },
    { v: "Other",    emoji: "✨", l: "Something",  sub: "of my own"      , bg: "linear-gradient(135deg, #FFFBF5, #FFD9B8)" },
  ];
  return (
    <div style={{ flex: 1, padding: '20px 24px 24px', display: 'flex', flexDirection: 'column' }}>
      <div className="t-label-sm" style={{ color: 'var(--sunrise-700)' }}>Question 3 of 3</div>
      <div className="t-heading-lg" style={{ color: 'var(--text-primary)', textWrap: 'balance', marginTop: 6, fontFamily: 'var(--font-display)', fontWeight: 400 }}>
        If you got back <em style={{ color: 'var(--sunrise-700)', fontStyle: 'italic' }}>30 minutes</em> every morning…
      </div>
      <div className="t-body-md" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>What would you actually do with it?</div>

      <div style={{ flex: 1, marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, alignContent: 'start' }}>
        {wishes.map((w, i) => {
          const sel = value === w.v;
          return (
            <button key={w.v} onClick={() => onSelect(w.v)} style={{
              aspectRatio: '1', borderRadius: 22, padding: 14,
              background: w.bg,
              border: sel ? '3px solid var(--sunrise-700)' : '1px solid rgba(255,255,255,0.6)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: sel
                ? '0 12px 28px rgba(238,122,72,0.35), 0 1px 0 rgba(255,255,255,0.9) inset'
                : '0 6px 16px rgba(80,40,20,0.1), 0 1px 0 rgba(255,255,255,0.7) inset',
              transform: sel ? 'scale(0.97)' : 'scale(1)',
              transition: 'all 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              animation: `float-card ${3 + i * 0.3}s ${i * 0.2}s ease-in-out infinite`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ fontSize: 36 }}>{w.emoji}</div>
              <div>
                <div className="t-heading-sm" style={{ color: '#2A1810', fontFamily: 'var(--font-display)', fontWeight: 500 }}>{w.l}</div>
                <div className="t-body-sm" style={{ color: 'rgba(42,24,16,0.7)' }}>{w.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Calc — animated count up + falling hours ───
function OnbCalc({ q1, q3, onNext }) {
  const [n, setN] = useState(0);
  const target = q1 === "150+" ? 1100 : q1 === "100–150" ? 870 : q1 === "50–100" ? 540 : 280;
  const days = Math.round(target / 24);

  useEffect(() => {
    let raf, start;
    const dur = 1800;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  // Falling hour pellets
  const pellets = Array.from({ length: 14 }, (_, i) => i);

  return (
    <div style={{ flex: 1, padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Falling hours */}
      {pellets.map((i) => (
        <div key={i} style={{
          position: 'absolute',
          top: -30,
          left: `${(i * 7 + 5) % 95}%`,
          fontSize: 14, color: 'rgba(238,122,72,0.5)',
          fontWeight: 600, fontFamily: 'var(--font-display)',
          animation: `fallHour ${4 + (i % 4)}s ${i * 0.3}s linear infinite`,
        }}>1h</div>
      ))}

      <div className="t-label-sm" style={{ color: 'var(--sunrise-700)', marginTop: 24 }}>your time, this year</div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{
          padding: '40px 24px 32px',
          borderRadius: 24,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3))',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 20px 50px rgba(80,40,20,0.12), 0 1px 0 rgba(255,255,255,0.9) inset',
        }}>
          <div className="tnum" style={{ color: 'var(--sunrise-700)', fontSize: 96, lineHeight: 1, fontWeight: 500, fontFamily: 'var(--font-display)', letterSpacing: '-0.04em',
            textShadow: '0 4px 30px rgba(238,122,72,0.3)' }}>{n}</div>
          <div className="t-heading-sm" style={{ color: 'var(--text-secondary)', marginTop: 8, fontWeight: 500 }}>hours per year</div>
          <div style={{
            display: 'inline-block', marginTop: 16, padding: '6px 14px',
            background: 'rgba(238,122,72,0.12)', borderRadius: 999,
            color: 'var(--sunrise-700)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
          }}>≈ {days} full days</div>
        </div>
        <div className="t-body-md" style={{ color: 'var(--text-primary)', marginTop: 24, maxWidth: 280, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 18, textWrap: 'balance' }}>
          {q3 ? `Imagine if you used those days to ${q3.toLowerCase()}.` : "Imagine what you could do with that."}
        </div>
      </div>

      <Button kind="primary" fullWidth onClick={onNext} iconRight="arrowR">Show me how to take it back</Button>
      <style>{`
        @keyframes fallHour {
          to { transform: translateY(120vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Why — handwritten intention ───
function OnbWhy({ why, setWhy, q3, onNext }) {
  const [chip, setChip] = useState(null);
  const chips = q3 ? [
    `${q3.toLowerCase()} more`,
    "stop doomscrolling",
    "be present in the morning",
  ] : ["read more", "stop doomscrolling", "be present"];

  const valid = (why || chip) && (why?.trim().length > 0 || chip);
  const display = why?.trim() || chip || "";

  return (
    <div style={{ flex: 1, padding: '20px 24px 24px', display: 'flex', flexDirection: 'column' }}>
      <div className="t-label-sm" style={{ color: 'var(--sunrise-700)' }}>Set your intention</div>
      <div className="t-heading-lg" style={{ color: 'var(--text-primary)', marginTop: 6, fontFamily: 'var(--font-display)', fontWeight: 400 }}>
        Why are you here?
      </div>
      <div className="t-body-md" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
        Your alarm will whisper this back on the hard mornings.
      </div>

      {/* Notebook card */}
      <div style={{
        marginTop: 24,
        padding: 24,
        borderRadius: 20,
        background: 'linear-gradient(180deg, #FFFBF5, #FFF3E5)',
        border: '1px solid rgba(245,217,192,0.8)',
        boxShadow: '0 10px 30px rgba(80,40,20,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Lined paper effect */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(180deg, transparent 0, transparent 31px, rgba(238,122,72,0.08) 31px, rgba(238,122,72,0.08) 32px)',
          pointerEvents: 'none',
        }}/>
        <div style={{ position: 'relative' }}>
          <div className="t-label-sm" style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>Tomorrow, I want to…</div>
          <textarea
            value={why || ""}
            onChange={(e) => { setWhy(e.target.value); setChip(null); }}
            placeholder={chip || "type something true…"}
            maxLength={60}
            rows={2}
            style={{
              width: '100%', background: 'transparent', border: 'none',
              fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, fontStyle: 'italic',
              color: 'var(--sunrise-700)', outline: 'none', resize: 'none',
              lineHeight: '32px', padding: 0,
            }}
          />
          <div style={{ position: 'absolute', right: 0, bottom: -18, fontSize: 11, color: 'var(--text-secondary)' }}>
            {(why || "").length}/60
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div className="t-label-sm" style={{ color: 'var(--text-secondary)', marginBottom: 10 }}>or pick one</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {chips.map((c) => (
            <button key={c} onClick={() => { setChip(c); setWhy(""); }} style={{
              padding: '8px 14px', borderRadius: 999,
              background: chip === c ? 'var(--sunrise-500)' : 'rgba(255,255,255,0.7)',
              color: chip === c ? '#FFFBF5' : 'var(--text-primary)',
              border: '1px solid', borderColor: chip === c ? 'var(--sunrise-500)' : 'rgba(245,217,192,0.8)',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: chip === c ? '0 4px 12px rgba(238,122,72,0.3)' : 'none',
              transition: 'all 180ms ease',
            }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <Button kind="primary" fullWidth disabled={!valid} onClick={() => { if (chip && !why?.trim()) setWhy(chip); onNext(); }} iconRight="arrowR">That's the one</Button>
    </div>
  );
}

// ─── Alarm setup — grand finale ───
function OnbAlarm({ time, setTime, mission, setMission, onDone }) {
  const [sheet, setSheet] = useState(false);
  const [missionPicked, setMissionPicked] = useState(false);
  return (
    <div style={{ flex: 1, padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div className="t-label-sm" style={{ color: 'var(--sunrise-700)' }}>Step 4 of 4</div>
      <div className="t-heading-lg" style={{ color: 'var(--text-primary)', marginTop: 6, fontFamily: 'var(--font-display)', fontWeight: 400 }}>
        When does <em style={{ color: 'var(--sunrise-700)', fontStyle: 'italic' }}>tomorrow</em> start?
      </div>
      <div className="t-body-md" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
        We wake you. You build the rest.
      </div>

      {/* Sun-arc time picker */}
      <div className="card-sunrise grain" style={{
        marginTop: 24, padding: '32px 16px 20px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', bottom: -90, left: '50%', transform: 'translateX(-50%)', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 60%)', pointerEvents: 'none' }}/>
        <div className="t-label-sm" style={{ color: '#7A2E0E', position: 'relative' }}>your alarm</div>
        <div style={{ marginTop: 12, position: 'relative' }}>
          <TimeWheel value={time} onChange={setTime}/>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div className="t-label-sm" style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>and your mission</div>
        <button onClick={() => setSheet(true)} className="card-premium" style={{
          width: '100%', padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: 'var(--text-primary)', fontSize: 16, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #FFD66E, #EE7A48)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFBF5' }}>
              <Icon name={mission === "Photo" ? "camera" : mission === "Math" ? "calc" : mission === "Shake" ? "shake" : "camera"} size={18}/>
            </span>
            <span style={{ fontWeight: 500 }}>{mission}</span>
          </span>
          <Icon name="chevDown" size={18} color="var(--text-secondary)"/>
        </button>
      </div>

      <div style={{ flex: 1 }}/>
      <Button kind="primary" fullWidth onClick={onDone} iconRight="arrowR">Begin shielded morning</Button>

      <MissionPickerSheet open={sheet} onClose={() => setSheet(false)} value={mission} onSelect={(v) => { setMission(v); setSheet(false); setMissionPicked(true); }}/>
    </div>
  );
}

// ─── Time wheel — touch/drag/scroll spinner with stepper buttons ───
function TimeWheel({ value, onChange }) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
  const mins  = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,...,55
  const minRounded = Math.round(value.m / 5) * 5 % 60;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center' }}>
      <Wheel
        values={hours}
        format={(n) => String(n).padStart(2, '0')}
        value={value.h}
        onChange={(h) => onChange({ ...value, h })}
        ariaLabel="hours"
      />
      <div className="tnum" style={{ color: '#2A1810', fontSize: 48, fontWeight: 400, fontFamily: 'var(--font-display)', lineHeight: 1, paddingBottom: 4 }}>:</div>
      <Wheel
        values={mins}
        format={(n) => String(n).padStart(2, '0')}
        value={minRounded}
        onChange={(m) => onChange({ ...value, m })}
        ariaLabel="minutes"
      />
      <AmPmToggle value={value.ampm} onChange={(ampm) => onChange({ ...value, ampm })}/>
    </div>
  );
}

function Wheel({ values, format, value, onChange, ariaLabel }) {
  const ROW = 44;
  const ROWS = 5; // visible rows (must be odd; center is selected)
  const HEIGHT = ROW * ROWS;
  const containerRef = useRef(null);
  const idx = Math.max(0, values.indexOf(value));
  const settling = useRef(null);
  const programmatic = useRef(false);

  // Sync scroll to selected value
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    programmatic.current = true;
    el.scrollTo({ top: idx * ROW, behavior: 'smooth' });
    const t = setTimeout(() => { programmatic.current = false; }, 350);
    return () => clearTimeout(t);
  }, [idx]);

  // Forward mouse-wheel to the page scroll instead of capturing it on the picker.
  // Touch/drag still works since overflow-y: scroll remains. Native listener with
  // passive: false is required because React's onWheel is passive (preventDefault no-ops).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheelNative = (e) => {
      e.preventDefault();
      const scene = el.closest('.scene-scroll');
      if (scene) scene.scrollBy({ top: e.deltaY, left: 0, behavior: 'auto' });
    };
    el.addEventListener('wheel', onWheelNative, { passive: false });
    return () => el.removeEventListener('wheel', onWheelNative);
  }, []);

  const onScroll = () => {
    if (programmatic.current) return;
    if (settling.current) clearTimeout(settling.current);
    settling.current = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      const newIdx = Math.round(el.scrollTop / ROW);
      const clamped = Math.max(0, Math.min(values.length - 1, newIdx));
      // snap
      programmatic.current = true;
      el.scrollTo({ top: clamped * ROW, behavior: 'smooth' });
      setTimeout(() => { programmatic.current = false; }, 220);
      if (values[clamped] !== value) onChange(values[clamped]);
    }, 110);
  };

  const step = (delta) => {
    const next = Math.max(0, Math.min(values.length - 1, idx + delta));
    onChange(values[next]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {/* Up button */}
      <button onClick={() => step(-1)} aria-label={`previous ${ariaLabel}`} style={stepBtn}>
        <Icon name="chevUp" size={16} color="#7A2E0E"/>
      </button>

      {/* Wheel */}
      <div style={{
        width: 80, height: HEIGHT, position: 'relative',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.35)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 0 0 1px rgba(122,46,14,0.08)',
        overflow: 'hidden',
      }}>
        {/* Selection bar */}
        <div style={{
          position: 'absolute', top: '50%', left: 4, right: 4,
          height: ROW, transform: 'translateY(-50%)', pointerEvents: 'none',
          background: 'linear-gradient(180deg, #FFFBF5, #FFE8DC)',
          borderRadius: 10, zIndex: 1,
          boxShadow: '0 4px 12px rgba(238,122,72,0.25), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}/>
        {/* Top + bottom fade */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: ROW, background: 'linear-gradient(180deg, rgba(255,221,184,0.95), transparent)', pointerEvents: 'none', zIndex: 3 }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: ROW, background: 'linear-gradient(0deg, rgba(255,221,184,0.95), transparent)', pointerEvents: 'none', zIndex: 3 }}/>

        {/* Scrollable list */}
        <div
          ref={containerRef}
          onScroll={onScroll}
          style={{
            position: 'relative', zIndex: 2,
            height: '100%', overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
            paddingTop: ROW * Math.floor(ROWS / 2),
            paddingBottom: ROW * Math.floor(ROWS / 2),
          }}
          className="hide-scrollbar"
        >
          {values.map((v, i) => {
            const dist = Math.abs(i - idx);
            const isCenter = i === idx;
            return (
              <button
                key={v}
                onClick={() => onChange(v)}
                style={{
                  scrollSnapAlign: 'center',
                  height: ROW, width: '100%', background: 'none', border: 'none',
                  fontFamily: 'var(--font-display)',
                  fontSize: isCenter ? 32 : 26,
                  fontWeight: isCenter ? 600 : 500,
                  color: isCenter ? '#2A1810' : '#7A2E0E',
                  opacity: isCenter ? 1 : Math.max(0.2, 0.7 - dist * 0.18),
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'font-size 160ms ease, opacity 160ms ease, color 160ms ease',
                  letterSpacing: '-0.02em',
                }}
                className="tnum"
              >{format ? format(v) : v}</button>
            );
          })}
        </div>
      </div>

      {/* Down button */}
      <button onClick={() => step(1)} aria-label={`next ${ariaLabel}`} style={stepBtn}>
        <Icon name="chevDown" size={16} color="#7A2E0E"/>
      </button>
    </div>
  );
}

const stepBtn = {
  width: 40, height: 26, borderRadius: 999,
  background: 'rgba(255,255,255,0.55)',
  border: '1px solid rgba(122,46,14,0.12)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', padding: 0,
  boxShadow: '0 2px 6px rgba(122,46,14,0.08)',
};

function AmPmToggle({ value, onChange }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 4,
      padding: 4, borderRadius: 14,
      background: 'rgba(255,255,255,0.35)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 0 0 1px rgba(122,46,14,0.08)',
    }}>
      {["AM", "PM"].map(v => {
        const sel = value === v;
        return (
          <button key={v} onClick={() => onChange(v)} style={{
            width: 52, padding: '12px 0', borderRadius: 10,
            background: sel ? 'linear-gradient(180deg, #FFFBF5, #FFE8DC)' : 'transparent',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: sel ? 600 : 500,
            fontSize: 18,
            color: sel ? '#2A1810' : 'rgba(122,46,14,0.55)',
            boxShadow: sel ? '0 4px 10px rgba(238,122,72,0.22), inset 0 1px 0 rgba(255,255,255,0.9)' : 'none',
            transition: 'all 160ms ease',
          }}>{v}</button>
        );
      })}
    </div>
  );
}

// ─── Mission picker sheet ───
function MissionPickerSheet({ open, onClose, value, onSelect, onPremiumTap }) {
  const FREE = [
    { id: "Photo",     icon: "camera", desc: "Take a photo of your bathroom sink" },
    { id: "Shake",     icon: "shake",  desc: "Shake your phone 30 times" },
    { id: "Math",      icon: "calc",   desc: "Solve 3 problems" },
    { id: "Sequence",  icon: "grid",   desc: "Tap colored buttons in order" },
    { id: "Step",      icon: "foot",   desc: "Take 30 steps to dismiss" },
    { id: "Voice",     icon: "mic",    desc: "Say 'Today I rise'" },
    { id: "QR",        icon: "qr",     desc: "Scan your kitchen QR" },
    { id: "Stretch",   icon: "leaf",   desc: "60-second guided stretch" },
    { id: "Breathwork",icon: "leaf",   desc: "4-7-8 breath cycle" },
    { id: "Journal",   icon: "pen",    desc: "Write 3 lines in Notes" },
  ];
  const PREMIUM = [
    { id: "Reading mission",     icon: "book",    desc: "Verified by Kindle" },
    { id: "Meditation mission",  icon: "headset", desc: "Headspace / Calm" },
    { id: "Gym check-in",        icon: "barbell", desc: "GPS-verified at your gym" },
  ];
  return (
    <Sheet open={open} onClose={onClose} title="Choose your mission" height="78%">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {FREE.map(m => (
          <button key={m.id} onClick={() => onSelect(m.id)} className={value === m.id ? "card-sunrise" : "card-premium"} style={{
            padding: 14,
            display: 'flex', alignItems: 'center', gap: 14,
            textAlign: 'left', cursor: 'pointer',
            color: value === m.id ? '#2A1810' : 'var(--text-primary)',
            fontFamily: 'inherit',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: value === m.id ? 'rgba(255,255,255,0.4)' : 'linear-gradient(135deg, #FFE5CE, #FFD9B8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: value === m.id ? '#7A2E0E' : 'var(--sunrise-700)', position: 'relative', zIndex: 1 }}>
              <Icon name={m.icon} size={22}/>
            </div>
            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              <div className="t-body-md" style={{ fontWeight: 600 }}>{m.id}</div>
              <div className="t-body-sm" style={{ color: value === m.id ? 'rgba(42,24,16,0.7)' : 'var(--text-secondary)' }}>{m.desc}</div>
            </div>
            {value === m.id && <Icon name="check" color="#7A2E0E"/>}
          </button>
        ))}
        {PREMIUM.map(m => (
          <button key={m.id} onClick={() => onPremiumTap?.(m.id)} className="card-premium" style={{
            padding: 14, opacity: 0.85,
            display: 'flex', alignItems: 'center', gap: 14,
            textAlign: 'left', cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'inherit',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #FFE5CE, #FFD9B8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <Icon name={m.icon} size={22}/>
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-body-md" style={{ fontWeight: 600 }}>{m.id}</div>
              <div className="t-body-sm" style={{ color: 'var(--text-secondary)' }}>{m.desc}</div>
            </div>
            <PremiumTag/>
          </button>
        ))}
      </div>
    </Sheet>
  );
}

Object.assign(window, { SplashScreen, Onboarding, MissionPickerSheet, TimeWheel });
