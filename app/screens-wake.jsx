/* global React */
const { useState, useEffect, useRef } = React;

// ─── Wake Moment (HERO) ───
function WakeMoment({ alarm, intention, onStartMission, onSnooze }) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTime(t => t + 1), 50);
    return () => clearInterval(i);
  }, []);

  const dawnGradient = `radial-gradient(ellipse 130% 90% at 50% 110%, #FFD66E 0%, #FFB088 30%, #FFEFE0 70%), linear-gradient(180deg, #FFE5CE 0%, #FFEFE0 50%, #FFFBF5 100%)`;

  return (
    <div style={{
      flex: 1, background: dawnGradient,
      display: 'flex', flexDirection: 'column',
      padding: '20px 24px 32px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle dawn sun glow at horizon */}
      <div style={{
        position: 'absolute', bottom: '-25%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(248,147,102,0.25) 0%, transparent 60%)',
        animation: 'glowPulse 4s ease-in-out infinite',
        pointerEvents: 'none',
      }}/>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 24, position: 'relative', zIndex: 1, marginTop: 40 }}>
        {/* Time */}
        <div style={{ animation: 'fadeIn 800ms ease' }}>
          <div className="tnum" style={{ fontSize: 96, fontWeight: 200, letterSpacing: -3, color: 'var(--cream)', lineHeight: 1 }}>
            6:30
          </div>
          <div className="t-body-md" style={{ color: 'var(--text-on-dark-soft)', marginTop: 4 }}>Tuesday, April 21</div>
        </div>

        {/* Greeting */}
        <div style={{ animation: 'fadeIn 800ms 300ms ease both' }}>
          <div className="t-heading-lg" style={{ fontWeight: 400, color: 'var(--cream)', textWrap: 'balance', maxWidth: 280 }}>
            Good morning, Arjun.
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'slideUp 800ms 1100ms ease both' }}>
        <Button kind="primary" fullWidth icon="shield" onClick={onStartMission}>
          Begin {alarm.mission} mission
        </Button>
        <button onClick={onSnooze} style={{ background: 'none', border: 'none', color: 'var(--text-on-dark-soft)', fontSize: 14, padding: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
          Snooze 9 minutes (breaks shield)
        </button>
      </div>
    </div>
  );
}

// ─── Mission: Photo ───
function PhotoMission({ onComplete, onBack, target = "kitchen sink" }) {
  const [stage, setStage] = useState("camera"); // camera, captured, verifying, success
  const captureRef = useRef();

  const capture = () => {
    setStage("captured");
    setTimeout(() => setStage("verifying"), 600);
    setTimeout(() => setStage("success"), 2200);
    setTimeout(() => onComplete(), 3000);
  };

  return (
    <div style={{ flex: 1, background: '#1a1410', display: 'flex', flexDirection: 'column', position: 'relative', color: 'var(--cream-true)' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 5 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: 36, height: 36, borderRadius: '50%', color: 'var(--cream-true)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="x" size={20}/>
        </button>
        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: 999, color: 'var(--cream-true)', fontSize: 13, fontWeight: 500 }}>
          Photo · {target}
        </div>
        <div style={{ width: 36 }}/>
      </div>

      {/* Viewfinder simulation */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Faux kitchen scene */}
        <div style={{
          position: 'absolute', inset: 0,
          background: stage === "camera"
            ? 'linear-gradient(180deg, #2a2630 0%, #4a3838 50%, #6e5a52 100%)'
            : 'linear-gradient(180deg, #1a1620 0%, #2a2028 100%)',
          transition: 'all 600ms ease',
        }}>
          {/* Kitchen sketch (placeholder) */}
          {stage === "camera" && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
              <svg width="240" height="240" viewBox="0 0 200 200" fill="none" stroke="#FBF7F0" strokeWidth="1.5" strokeLinecap="round" opacity="0.4">
                <rect x="40" y="100" width="120" height="60" rx="4"/>
                <ellipse cx="100" cy="120" rx="30" ry="8"/>
                <path d="M85 105 L 85 80 Q 85 70 100 70 Q 115 70 115 80 L 115 105"/>
                <path d="M30 100 L 170 100"/>
                <path d="M55 160 L 55 175 M145 160 L 145 175"/>
              </svg>
            </div>
          )}
          {(stage === "captured" || stage === "verifying" || stage === "success") && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 280, height: 380, background: 'linear-gradient(180deg, #5a4838, #2a2028)', borderRadius: 8, position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <svg width="280" height="380" viewBox="0 0 200 280" fill="none" stroke="#FBF7F0" strokeWidth="1.5" opacity="0.7">
                  <rect x="30" y="140" width="140" height="80" rx="4"/>
                  <ellipse cx="100" cy="160" rx="40" ry="10"/>
                  <path d="M85 145 L 85 110 Q 85 100 100 100 Q 115 100 115 110 L 115 145"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Reticle */}
        {stage === "camera" && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '20%', left: '15%', right: '15%', bottom: '20%', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8 }}/>
            {[[0,0],[0,1],[1,0],[1,1]].map(([x, y], i) => (
              <div key={i} style={{
                position: 'absolute',
                top: y === 0 ? '20%' : 'auto', bottom: y === 1 ? '20%' : 'auto',
                left: x === 0 ? '15%' : 'auto', right: x === 1 ? '15%' : 'auto',
                width: 24, height: 24,
                borderTop: y === 0 ? '2px solid var(--sunrise-500)' : 'none',
                borderBottom: y === 1 ? '2px solid var(--sunrise-500)' : 'none',
                borderLeft: x === 0 ? '2px solid var(--sunrise-500)' : 'none',
                borderRight: x === 1 ? '2px solid var(--sunrise-500)' : 'none',
              }}/>
            ))}
          </div>
        )}

        {/* Hint banner */}
        {stage === "camera" && (
          <div style={{ position: 'absolute', top: 100, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <div className="t-body-md" style={{ background: 'rgba(0,0,0,0.55)', color: 'var(--cream-true)', padding: '10px 18px', borderRadius: 999, backdropFilter: 'blur(8px)' }}>
              Photograph your <b>{target}</b>
            </div>
          </div>
        )}

        {/* Verifying overlay */}
        {stage === "verifying" && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, animation: 'fadeIn 200ms ease' }}>
            <div style={{ width: 56, height: 56, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: 'var(--sunrise-500)', borderRadius: '50%', animation: 'spin 800ms linear infinite' }}/>
            <div className="t-body-md" style={{ color: 'var(--cream-true)' }}>Matching your photo…</div>
          </div>
        )}
        {stage === "success" && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(95,181,138,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, animation: 'fadeIn 200ms ease' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'slideUp 300ms var(--ease-overshoot)' }}>
              <Icon name="check" size={40} color="#fff" weight={3}/>
            </div>
            <div className="t-heading-sm" style={{ color: 'var(--cream-true)' }}>Match confirmed</div>
          </div>
        )}
      </div>

      {/* Capture button */}
      {stage === "camera" && (
        <div style={{ padding: '20px 0 32px', display: 'flex', justifyContent: 'center', background: '#1a1410' }}>
          <button onClick={capture} style={{
            width: 76, height: 76, borderRadius: '50%',
            background: 'var(--cream)', border: '4px solid #000',
            boxShadow: '0 0 0 3px var(--cream)', cursor: 'pointer',
          }}/>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Mission: Math ───
function MathMission({ onComplete, onBack }) {
  const [problem] = useState({ a: 14, b: 3, op: "×", answer: 42 });
  const [problems, setProblems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const list = [];
    for (let i = 0; i < 3; i++) {
      const a = 5 + Math.floor(Math.random() * 14);
      const b = 2 + Math.floor(Math.random() * 8);
      list.push({ a, b, op: "×", answer: a * b });
    }
    setProblems(list);
  }, []);

  const p = problems[current] || problem;
  const submit = (val) => {
    if (parseInt(val) === p.answer) {
      setFeedback("correct");
      setTimeout(() => {
        if (current + 1 >= problems.length) onComplete();
        else { setCurrent(c => c + 1); setInput(""); setFeedback(null); }
      }, 600);
    } else {
      setFeedback("wrong");
      setTimeout(() => { setInput(""); setFeedback(null); }, 600);
    }
  };

  return (
    <div style={{ flex: 1, background: 'var(--ink)', display: 'flex', flexDirection: 'column', padding: '12px 24px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={onBack} style={{ background: 'var(--ink-soft)', border: 'none', width: 36, height: 36, borderRadius: '50%', color: 'var(--text-on-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="x" size={18}/>
        </button>
        <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>Math · {current + 1} of {problems.length || 3}</div>
        <div style={{ width: 36 }}/>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {(problems.length ? problems : [1,2,3]).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i < current ? 'var(--success)' : i === current ? 'var(--sunrise-500)' : 'var(--ink-line)' }}/>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="t-label-md" style={{ color: 'var(--text-on-dark-soft)', marginBottom: 16 }}>Solve</div>
        <div className="tnum" style={{ fontSize: 80, fontWeight: 300, letterSpacing: -2, color: 'var(--cream)' }}>
          {p.a} {p.op} {p.b}
        </div>
        <div style={{
          marginTop: 32, width: 220, height: 80,
          background: feedback === "correct" ? 'rgba(95,181,138,0.15)' : feedback === "wrong" ? 'rgba(216,89,89,0.15)' : 'var(--ink-soft)',
          border: '2px solid', borderColor: feedback === "correct" ? 'var(--success)' : feedback === "wrong" ? 'var(--danger)' : 'var(--ink-line)',
          borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 200ms ease',
          animation: feedback === "wrong" ? 'shake 300ms' : 'none',
        }}>
          <span className="tnum" style={{ fontSize: 48, fontWeight: 500, color: 'var(--cream)' }}>{input || "?"}</span>
        </div>
      </div>

      {/* Numpad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
        {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => {
          if (k === "") return <div key={i}/>;
          return (
            <button key={i} onClick={() => {
              if (k === "⌫") setInput(s => s.slice(0, -1));
              else if (input.length < 4) {
                const next = input + k;
                setInput(next);
                if (next.length >= String(p.answer).length) submit(next);
              }
            }} style={{
              height: 60, background: 'var(--ink-soft)', border: '1px solid var(--ink-line)',
              borderRadius: 14, color: 'var(--cream)', fontSize: 24, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}>{k}</button>
          );
        })}
      </div>
      <style>{`@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }`}</style>
    </div>
  );
}

// ─── Mission: Shake ───
function ShakeMission({ onComplete, onBack, target = 30 }) {
  const [count, setCount] = useState(0);
  const [boom, setBoom] = useState(false);
  useEffect(() => { if (count >= target) setTimeout(() => onComplete(), 700); }, [count, target]);

  return (
    <div style={{ flex: 1, background: 'var(--ink)', display: 'flex', flexDirection: 'column', padding: '12px 24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={onBack} style={{ background: 'var(--ink-soft)', border: 'none', width: 36, height: 36, borderRadius: '50%', color: 'var(--text-on-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="x" size={18}/>
        </button>
        <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>Shake · physical motion</div>
        <div style={{ width: 36 }}/>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div className="t-body-md" style={{ color: 'var(--text-on-dark-soft)' }}>Shake your phone</div>
        <div style={{ position: 'relative' }}>
          <StreakRing value={count} max={target} size={220} stroke={10}/>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="tnum" style={{ fontSize: 80, fontWeight: 300, color: 'var(--cream)', lineHeight: 1, animation: boom ? 'pop 220ms' : 'none' }}>
              {count}
            </div>
            <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)', marginTop: 4 }}>of {target}</div>
          </div>
        </div>

        <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)', textAlign: 'center', maxWidth: 240, textWrap: 'balance' }}>
          Tap below to simulate a shake. Real device uses motion sensors.
        </div>
      </div>

      <button
        onPointerDown={() => { setCount(c => Math.min(c + 1, target)); setBoom(true); setTimeout(() => setBoom(false), 220); }}
        style={{
          height: 80, background: 'var(--sunrise-500)', color: 'var(--ink)', border: 'none',
          borderRadius: 20, fontSize: 18, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 8px 24px rgba(248,147,102,0.3)',
        }}>
        <Icon name="shake" size={22}/> Tap to shake
      </button>
      <style>{`@keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }`}</style>
    </div>
  );
}

// ─── Mission: Step (placeholder for Sequence/Step/Voice/QR variants) ───
function StepMission({ onComplete, onBack, target = 50 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setCount(c => {
      if (c >= target) { clearInterval(i); setTimeout(onComplete, 600); return c; }
      return c + 1;
    }), 80);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={{ flex: 1, background: 'var(--ink)', display: 'flex', flexDirection: 'column', padding: '12px 24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={onBack} style={{ background: 'var(--ink-soft)', border: 'none', width: 36, height: 36, borderRadius: '50%', color: 'var(--text-on-dark)', cursor: 'pointer' }}>
          <Icon name="x" size={18}/>
        </button>
        <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>Walk · {target} steps</div>
        <div style={{ width: 36 }}/>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <Icon name="foot" size={64} color="var(--sunrise-500)"/>
        <StreakRing value={count} max={target} size={220} stroke={10}/>
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="tnum" style={{ fontSize: 64, fontWeight: 300, color: 'var(--cream)', marginTop: -120 }}>{count}</div>
        </div>
        <div className="t-body-md" style={{ color: 'var(--text-on-dark-soft)' }}>Counting steps from your motion sensor…</div>
      </div>
    </div>
  );
}

// ─── Phone Shield engaged ───
function PhoneShield({ tweaks, onWindDown, onEmergency, onComplete }) {
  const [remaining, setRemaining] = useState(30 * 60); // seconds
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setRemaining(r => Math.max(r - 1, 0)), 1000);
    return () => clearInterval(i);
  }, []);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const pct = remaining / (30 * 60);

  return (
    <div style={{ flex: 1, background: 'var(--ink)', display: 'flex', flexDirection: 'column', padding: '20px 24px 32px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(248,147,102,0.18) 0%, transparent 60%)', animation: 'glowPulse 3s ease-in-out infinite' }}/>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, position: 'relative', zIndex: 2 }}>
        <div className="t-label-sm" style={{ color: 'var(--success)' }}>● SHIELD ACTIVE</div>
        <button onClick={onWindDown} style={{ background: 'var(--ink-soft)', border: '1px solid var(--ink-line)', color: 'var(--text-on-dark-soft)', padding: '6px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'inherit' }}>End early</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div style={{ position: 'relative' }}>
          <StreakRing value={pct * 100} max={100} size={260} stroke={6}/>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Icon name="shield" size={28} color="var(--sunrise-500)"/>
            <div className="tnum" style={{ fontSize: 56, fontWeight: 300, color: 'var(--cream)' }}>
              {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
            </div>
            <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>until shield ends</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>Blocked apps</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {["Instagram", "TikTok", "X", "YouTube"].map((n, i) => (
              <div key={n} style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', opacity: 0.5 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: ['#E4405F','#000','#fff','#FF0000'][i] }}>{n[0]}</span>
                <Icon name="lock" size={12} color="var(--text-on-dark-soft)" style={{ position: 'absolute', bottom: -2, right: -2, background: 'var(--ink)', borderRadius: '50%', padding: 2 }}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button kind="ghost" onClick={() => setShowEmergency(true)} fullWidth>
        Emergency unlock
      </Button>
      <button onClick={onComplete} style={{ background: 'none', border: 'none', color: 'var(--text-on-dark-soft)', fontSize: 12, padding: 8, cursor: 'pointer', fontFamily: 'inherit', opacity: 0.6 }}>
        (demo: skip to streak success →)
      </button>

      <Modal open={showEmergency} onClose={() => setShowEmergency(false)} title="Emergency unlock">
        <div className="t-body-md" style={{ color: 'var(--text-on-dark-soft)', marginBottom: 16 }}>
          You'll wait 60 seconds, then unlock. Your streak breaks.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button kind="danger" fullWidth onClick={() => { setShowEmergency(false); onEmergency?.(); }}>Yes, break my shield</Button>
          <Button kind="secondary" fullWidth onClick={() => setShowEmergency(false)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}

// ─── Streak Success ───
function StreakSuccess({ tweaks, onContinue, onShare, onSetIntention }) {
  const [stage, setStage] = useState(0);
  const [intention, setIntention] = useState("");
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1400);
    const t2 = setTimeout(() => setStage(2), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const newDays = tweaks.streakDays + 1;
  const tier = tierFor(newDays);

  return (
    <div style={{ flex: 1, background: 'linear-gradient(180deg, #FFE5CE 0%, #FFD9B8 50%, #FFB088 100%)', display: 'flex', flexDirection: 'column', padding: '20px 24px 24px', overflow: 'hidden', position: 'relative' }}>
      {/* Sunrise glow */}
      <div style={{ position: 'absolute', bottom: '-40%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,110,0.6) 0%, rgba(238,122,72,0.25) 35%, transparent 65%)', animation: 'glowPulse 4s ease-in-out infinite' }}/>

      {/* Confetti rays */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: 4, height: 60 + (i % 3) * 30,
          background: `linear-gradient(180deg, ${['#FFD66E','#EE7A48','#FF6B6B'][i%3]}, transparent)`,
          opacity: 0.45, borderRadius: 999,
          transformOrigin: '50% 0%',
          transform: `translate(-50%, 0) rotate(${i * 26}deg) translateY(80px)`,
          animation: `glowPulse ${2 + (i%4)*0.4}s ${i*0.1}s ease-in-out infinite`,
          pointerEvents: 'none',
        }}/>
      ))}

      <div className="t-label-sm" style={{ color: '#7A2E0E', textAlign: 'center', marginTop: 4, position: 'relative', zIndex: 2, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>
        ● shielded
      </div>

      {/* Big number with flame */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14, marginTop: 28, position: 'relative', zIndex: 2, animation: 'slideUp 700ms 100ms ease both' }}>
        <div className="tnum" style={{
          fontFamily: 'var(--font-display)', fontWeight: 500,
          fontSize: 110, lineHeight: 0.9, color: '#2A1810',
          letterSpacing: '-0.04em',
          textShadow: '0 4px 30px rgba(238,122,72,0.4)',
        }}>{newDays}</div>
        <Icon name="flame" size={42} color="#7A2E0E"/>
      </div>

      {/* DAY STREAK label */}
      <div className="t-label-sm" style={{
        color: '#7A2E0E', textAlign: 'center', marginTop: 8,
        letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700,
        position: 'relative', zIndex: 2,
        animation: 'fadeIn 800ms 350ms ease both',
      }}>day streak</div>

      {/* Tier pill */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14, position: 'relative', zIndex: 2, animation: 'slideUp 600ms 500ms ease both' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 18px',
          background: `linear-gradient(135deg, ${tier.color}, ${tier.color}d0)`,
          borderRadius: 999,
          boxShadow: `0 6px 18px ${tier.color}60, inset 0 1px 0 rgba(255,255,255,0.5)`,
          border: '1px solid rgba(255,255,255,0.35)',
        }}>
          <Icon name="diamond" size={14} color="#FFFBF5"/>
          <span className="t-label-md" style={{ color: '#FFFBF5', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{tier.name} tier</span>
        </div>
      </div>

      {/* Celebration message */}
      <div style={{
        marginTop: 18, textAlign: 'center', position: 'relative', zIndex: 2,
        fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic',
        color: '#2A1810', fontSize: 24, letterSpacing: '-0.01em',
        animation: 'fadeIn 800ms 700ms ease both',
      }}>
        Shield held.
      </div>

      {stage >= 1 && (
        <div style={{ marginTop: 18, position: 'relative', zIndex: 2, animation: 'slideUp 600ms ease' }}>
          <WeekStrip filled={Math.min(newDays, 7)} broken={false}/>
        </div>
      )}

      {stage >= 1 && (
        <div style={{
          marginTop: 14, padding: '14px 12px',
          borderRadius: 18,
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 8px 24px rgba(80,40,20,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          position: 'relative', zIndex: 2,
          animation: 'slideUp 600ms 100ms ease both',
        }}>
          <SuccessStat label="reclaimed" value="30" unit="min"/>
          <SuccessStat label="this week" value="5/5" divider/>
          <SuccessStat label="best ever" value={Math.max(newDays, 47)} unit="d" divider/>
        </div>
      )}

      <div style={{ flex: 1 }}/>

      {stage >= 2 && (
        <div style={{ position: 'relative', zIndex: 2, animation: 'slideUp 500ms ease' }}>
          <Button kind="primary" fullWidth iconRight="arrowR" onClick={onContinue}>
            Begin shielded morning
          </Button>
          <button onClick={onShare} style={{
            background: 'none', border: 'none', color: '#7A2E0E',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: 12, marginTop: 4, width: '100%',
            cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
          }}>
            <Icon name="share" size={16}/> Share streak
          </button>
        </div>
      )}
    </div>
  );
}

function SuccessStat({ label, value, unit, divider }) {
  return (
    <div style={{ textAlign: 'center', position: 'relative', padding: '4px 0' }}>
      {divider && <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'rgba(122,46,14,0.15)' }}/>}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
        <div className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, color: '#7A2E0E', lineHeight: 1 }}>{value}</div>
        {unit && <div className="t-body-sm" style={{ color: '#7A2E0E', fontWeight: 600 }}>{unit}</div>}
      </div>
      <div className="t-label-sm" style={{ color: 'rgba(122,46,14,0.6)', marginTop: 4, fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="tnum t-heading-md" style={{ color: 'var(--sunrise-500)', fontWeight: 600 }}>{value}</div>
      <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>{label}</div>
    </div>
  );
}

// ─── Share Card ───
function ShareCard({ tweaks, onClose }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 240, background: 'rgba(42,24,16,0.85)', display: 'flex', flexDirection: 'column', padding: '20px 24px 32px', animation: 'fadeIn 240ms ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="t-heading-sm" style={{ color: 'var(--cream-true)' }}>Share streak</div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', width: 36, height: 36, borderRadius: '50%', color: 'var(--cream-true)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="x" size={18}/>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 280, aspectRatio: '4 / 5',
          borderRadius: 28,
          background: 'linear-gradient(160deg, #FFFBF5 0%, #FFD66E 55%, #EE7A48 130%)',
          padding: 28,
          display: 'flex', flexDirection: 'column',
          color: 'var(--text-primary)',
          boxShadow: '0 30px 80px rgba(80,40,20,0.25)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', bottom: -120, right: -120, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(248,147,102,0.5), transparent 60%)' }}/>
          <div className="t-label-sm" style={{ color: 'var(--sunrise-500)', position: 'relative' }}>● SHIELDED</div>
          <div style={{ marginTop: 'auto', position: 'relative' }}>
            <div className="tnum" style={{ fontSize: 100, fontWeight: 200, lineHeight: 1, letterSpacing: -3 }}>{tweaks.streakDays + 1}</div>
            <div className="t-heading-sm" style={{ marginTop: 4, fontWeight: 500 }}>day streak</div>
            <div className="t-body-sm" style={{ marginTop: 16, opacity: 0.7 }}>"finish the deck"</div>
            <div className="t-body-sm" style={{ marginTop: 24, opacity: 0.5, fontWeight: 600, letterSpacing: 0.05 }}>alarm shield</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Button kind="secondary" fullWidth icon="whatsapp">WhatsApp</Button>
        <Button kind="secondary" fullWidth icon="share">More</Button>
      </div>
    </div>
  );
}

// ─── Mission Picker Sheet ───
function MissionPickerSheet({ open, onClose, value, onSelect, onPremiumTap }) {
  const items = [
    { id: "Photo", icon: "camera", desc: "Snap a target spot in your home" },
    { id: "Math",  icon: "calc",   desc: "Three quick problems" },
    { id: "Shake", icon: "shake",  desc: "Shake your phone vigorously" },
    { id: "Sequence", icon: "grid", desc: "Memory pattern" },
    { id: "Step", icon: "foot", desc: "Walk a few steps" },
    { id: "Voice", icon: "mic", desc: "Read 3 sentences aloud", premium: true },
    { id: "QR", icon: "qr", desc: "Scan a QR you placed elsewhere", premium: true },
    { id: "Reading", icon: "book", desc: "Read 3 pages — verified by Kindle", premium: true },
    { id: "Meditation", icon: "leaf", desc: "1 minute mindfulness", premium: true },
    { id: "Gym", icon: "barbell", desc: "GPS check-in at your gym", premium: true },
    { id: "Journal", icon: "pen", desc: "Write 3 sentences", premium: true },
    { id: "Duolingo", icon: "duo", desc: "5 min handoff", premium: true },
  ];
  return (
    <Sheet open={open} onClose={onClose} title="Choose mission" height="78%">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(it => (
          <button key={it.id} onClick={() => it.premium ? onPremiumTap?.(`${it.id} mission`) : onSelect(it.id)} style={{
            background: value === it.id ? 'var(--ink)' : 'transparent',
            border: '1px solid', borderColor: value === it.id ? 'var(--sunrise-500)' : 'transparent',
            borderRadius: 14, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            textAlign: 'left', color: 'var(--cream)', fontFamily: 'inherit',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sunrise-500)' }}>
              <Icon name={it.icon} size={18}/>
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-body-md" style={{ fontWeight: 500 }}>{it.id}</div>
              <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>{it.desc}</div>
            </div>
            {it.premium && <PremiumTag/>}
            {value === it.id && !it.premium && <Icon name="check" size={18} color="var(--sunrise-500)"/>}
          </button>
        ))}
      </div>
    </Sheet>
  );
}

Object.assign(window, {
  WakeMoment, PhotoMission, MathMission, ShakeMission, StepMission,
  PhoneShield, StreakSuccess, ShareCard, MissionPickerSheet,
  Stat,
});
