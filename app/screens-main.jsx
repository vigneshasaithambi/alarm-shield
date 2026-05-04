/* global React */
const { useState, useEffect, useRef } = React;

// ─── Week strip — last 7 days as filled/empty pills ───
function WeekStrip({ filled = 5, broken = false, dense = false }) {
  const labels = ["M","T","W","T","F","S","S"];
  const cellHeight = dense ? 32 : 40;
  return (
    <div style={{ display: 'flex', gap: 6, width: '100%', position: 'relative', zIndex: 1 }}>
      {labels.map((lbl, i) => {
        const isFilled = i < filled;
        const isBrokenSlot = broken && i === filled;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: '100%', height: cellHeight, borderRadius: 10,
              background: isFilled
                ? 'linear-gradient(160deg, #FFD66E 0%, #FFB088 50%, #EE7A48 100%)'
                : isBrokenSlot
                  ? 'rgba(216,89,89,0.18)'
                  : 'rgba(122,46,14,0.06)',
              border: isBrokenSlot
                ? '1px solid rgba(216,89,89,0.4)'
                : isFilled
                  ? '1px solid rgba(255,255,255,0.4)'
                  : '1px solid rgba(122,46,14,0.08)',
              boxShadow: isFilled
                ? '0 4px 10px rgba(238,122,72,0.28), inset 0 1px 0 rgba(255,255,255,0.45)'
                : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isFilled ? '#FFFBF5' : isBrokenSlot ? '#7A2E0E' : 'rgba(122,46,14,0.4)',
              transition: 'all 280ms ease',
            }}>
              {isFilled && <Icon name="check" size={14} weight={2.6}/>}
              {isBrokenSlot && <Icon name="x" size={12} weight={2.5}/>}
            </div>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: 0.5,
              color: isFilled ? '#7A2E0E' : 'rgba(122,46,14,0.5)',
            }}>{lbl}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tier ladder — 4 milestones along a gradient progress bar ───
function TierLadder({ days }) {
  const tiers = [
    { name: "Bronze",   min: 7,   color: "#D26536" },
    { name: "Silver",   min: 30,  color: "#A8A3BD" },
    { name: "Gold",     min: 90,  color: "#F89366" },
    { name: "Platinum", min: 365, color: "#7A95E0" },
  ];
  const segCount = tiers.length - 1;
  const segWidth = 100 / segCount;
  let pct = 0;
  let nextTier = null;
  let daysToNext = null;

  if (days < tiers[0].min) {
    pct = 0;
    nextTier = tiers[0];
    daysToNext = tiers[0].min - days;
  } else if (days >= tiers[tiers.length - 1].min) {
    pct = 100;
  } else {
    for (let i = 0; i < tiers.length - 1; i++) {
      if (days >= tiers[i].min && days < tiers[i + 1].min) {
        const segProg = (days - tiers[i].min) / (tiers[i + 1].min - tiers[i].min);
        pct = i * segWidth + segProg * segWidth;
        nextTier = tiers[i + 1];
        daysToNext = tiers[i + 1].min - days;
        break;
      }
    }
  }

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Tier labels above bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, padding: '0 2px' }}>
        {tiers.map((t) => {
          const reached = days >= t.min;
          return (
            <div key={t.name} style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
              color: reached ? t.color : 'rgba(122,46,14,0.4)',
            }}>{t.name}</div>
          );
        })}
      </div>
      {/* Bar with milestone dots */}
      <div style={{ position: 'relative', height: 14 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(122,46,14,0.1)', borderRadius: 999 }}/>
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #D26536 0%, #A8A3BD 33%, #F89366 66%, #7A95E0 100%)',
          backgroundSize: `${100 / Math.max(pct, 1) * 100}% 100%`,
          borderRadius: 999,
          boxShadow: '0 2px 8px rgba(238,122,72,0.4), inset 0 1px 0 rgba(255,255,255,0.5)',
          transition: 'width 1400ms cubic-bezier(0.4,0,0.2,1)',
        }}/>
        {tiers.map((t, i) => {
          const reached = days >= t.min;
          const left = i * segWidth;
          return (
            <div key={t.name} style={{
              position: 'absolute', left: `${left}%`, top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 20, height: 20, borderRadius: '50%',
              background: reached ? t.color : '#FFFBF5',
              border: `2px solid ${reached ? '#FFFBF5' : 'rgba(122,46,14,0.2)'}`,
              boxShadow: reached
                ? `0 3px 8px ${t.color}80, inset 0 1px 0 rgba(255,255,255,0.4)`
                : '0 1px 3px rgba(80,40,20,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 400ms ease',
              zIndex: 2,
            }}>
              {reached && <Icon name="check" size={10} color="#FFFBF5" weight={3}/>}
            </div>
          );
        })}
      </div>
      {/* Caption */}
      {daysToNext != null && nextTier && (
        <div className="t-body-sm" style={{ color: '#7A2E0E', fontWeight: 600, textAlign: 'center', marginTop: 14 }}>
          {daysToNext} {daysToNext === 1 ? 'day' : 'days'} until <span style={{ color: nextTier.color, fontWeight: 700 }}>{nextTier.name}</span>
        </div>
      )}
      {!nextTier && (
        <div className="t-body-sm" style={{ color: '#7A2E0E', fontWeight: 700, textAlign: 'center', marginTop: 14 }}>
          You've reached the top.
        </div>
      )}
    </div>
  );
}

// ─── Streak stat tile — one cell of the "This month" grid ───
function StreakStatTile({ icon, value, label, divider }) {
  return (
    <div style={{ position: 'relative', textAlign: 'center', padding: '4px 8px' }}>
      {divider && (
        <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'rgba(122,46,14,0.12)' }}/>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 10,
          background: 'linear-gradient(135deg, #FFD66E, #EE7A48)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FFFBF5',
          boxShadow: '0 4px 10px rgba(238,122,72,0.28), inset 0 1px 0 rgba(255,255,255,0.4)',
        }}>
          <Icon name={icon} size={14} weight={2}/>
        </div>
      </div>
      <div className="tnum" style={{
        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28,
        color: '#7A2E0E', lineHeight: 1, letterSpacing: '-0.02em',
      }}>{value}</div>
      <div className="t-label-sm" style={{
        color: 'rgba(122,46,14,0.6)', marginTop: 4, fontSize: 10,
        fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
      }}>{label}</div>
    </div>
  );
}

// ─── Home (Alarms tab) ───
function HomeScreen({ tweaks, alarms, onAddAlarm, onEditAlarm, onTriggerWake, onOpenSettings, intention }) {
  const days = tweaks.streakDays;
  const state = tweaks.streakState;
  const showRecovery = state === "recovery";
  const broken = state === "broken";
  const homeTier = tierFor(broken ? 0 : days);

  return (
    <div className="scene-scroll" style={{ flex: 1, padding: '12px 20px 20px' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0 16px' }}>
        <div className="t-heading-md" style={{ color: 'var(--text-on-dark)' }}>Hi, Arjun</div>
        <button onClick={onOpenSettings} style={{ background: 'var(--ink-soft)', border: 'none', width: 36, height: 36, borderRadius: '50%', color: 'var(--text-on-dark-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="settings" size={18}/>
        </button>
      </div>

      {showRecovery && (
        <div style={{ background: 'linear-gradient(135deg, var(--ink-soft), rgba(95,181,138,0.15))', border: '1px solid rgba(95,181,138,0.3)', borderRadius: 12, padding: '12px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="refresh" size={18} color="var(--success)"/>
          <div className="t-body-sm" style={{ color: 'var(--text-on-dark)' }}><b>3-day recovery streak</b> — Day 1 of 3</div>
        </div>
      )}

      {/* Streak card — week strip + tier pill */}
      <div className="card-sunrise grain" style={{ padding: 22, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative glows */}
        <div style={{ position: 'absolute', top: -60, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.55), transparent 65%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: -50, left: -50, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,107,0.18), transparent 65%)', pointerEvents: 'none' }}/>

        {/* Top row: number + tier pill */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div className="tnum" style={{ color: '#2A1810', fontWeight: 500, fontSize: 56, lineHeight: 0.95, fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>{broken ? 0 : days}</div>
              <Icon name="flame" size={24} color="#7A2E0E"/>
            </div>
            <div className="t-label-sm" style={{ color: 'rgba(42,24,16,0.7)', marginTop: 4, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>{broken ? "start again" : "day streak"}</div>
          </div>
          {!broken && days >= 7 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              background: `linear-gradient(135deg, ${homeTier.color}, ${homeTier.color}cc)`,
              borderRadius: 999,
              boxShadow: `0 3px 10px ${homeTier.color}55, inset 0 1px 0 rgba(255,255,255,0.4)`,
              border: '1px solid rgba(255,255,255,0.3)',
            }}>
              <Icon name="diamond" size={12} color="#FFFBF5"/>
              <span className="t-label-sm" style={{ color: '#FFFBF5', fontWeight: 700, letterSpacing: 0.6 }}>{homeTier.name}</span>
            </div>
          )}
        </div>

        {/* Week strip */}
        <WeekStrip filled={broken ? 6 : Math.min(days, 7)} broken={broken} dense/>

        {/* Best chip */}
        <div className="t-body-sm" style={{ color: '#7A2E0E', marginTop: 14, fontWeight: 600, opacity: 0.85, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="sparkle" size={12}/>
          Personal best · 47 days
        </div>
      </div>

      <div className="t-label-sm" style={{ color: 'var(--text-on-dark-soft)', marginBottom: 10 }}>Alarms</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {alarms.map(a => <AlarmCard key={a.id} alarm={a} onClick={() => onEditAlarm(a)}/>)}
      </div>
      <button onClick={onAddAlarm} style={{
        width: '100%', padding: '14px', background: 'var(--ink-soft)',
        border: '1px dashed var(--ink-line)', borderRadius: 16,
        color: 'var(--sunrise-500)', fontSize: 15, fontWeight: 500, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit',
        marginBottom: 24,
      }}>
        <Icon name="plus" size={18}/> Add alarm
      </button>

      <div className="card-premium" style={{
        width: '100%', padding: '16px 18px',
        textAlign: 'left', color: 'var(--text-primary)',
        border: '1px solid rgba(245,217,192,0.8)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, rgba(255,214,110,0.35), rgba(238,122,72,0.25))',
          border: '1px solid rgba(238,122,72,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--sunrise-700)', flexShrink: 0,
        }}>
          <Icon name="bell" size={18}/>
        </div>
        <div style={{ flex: 1 }}>
          <div className="t-label-sm" style={{ color: 'var(--text-secondary)' }}>Next morning shielded</div>
          <div style={{ marginTop: 4 }}>
            <span className="tnum" style={{ color: 'var(--sunrise-700)', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>{fmtCountdown(tweaks.nextAlarmMinutes)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlarmCard({ alarm, onClick }) {
  const [enabled, setEnabled] = useState(alarm.enabled);
  return (
    <div onClick={onClick} className="card-premium" style={{
      padding: 16, cursor: 'pointer',
      opacity: enabled ? 1 : 0.55,
      display: 'flex', alignItems: 'center', gap: 12,
      transition: 'opacity 200ms ease, transform 200ms ease',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span className="tnum" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>{alarm.time}</span>
          <span className="t-body-sm" style={{ color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: 0.5 }}>{alarm.ampm}</span>
          <span className="t-body-sm" style={{ color: 'var(--text-secondary)', marginLeft: 8, whiteSpace: 'nowrap' }}>{alarm.days.length === 5 ? "Mon–Fri" : alarm.days.length === 2 ? "Sat–Sun" : alarm.days.join("·")}</span>
        </div>
        <div className="t-body-sm" style={{ color: 'var(--text-secondary)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name={alarm.missionIcon === "calc" ? "calc" : "camera"} size={14}/> {alarm.mission} mission
        </div>
      </div>
      <div onClick={e => { e.stopPropagation(); setEnabled(!enabled); }}>
        <Toggle on={enabled} onChange={setEnabled}/>
      </div>
    </div>
  );
}

// ─── Alarm setup ───
function AlarmSetup({ alarm, onBack, onSave, onTriggerPaywall }) {
  const [time, setTime] = useState({ h: parseInt(alarm?.time?.split(":")[0] || "6"), m: parseInt(alarm?.time?.split(":")[1] || "30"), ampm: alarm?.ampm || "AM" });
  const [days, setDays] = useState(alarm?.days || ["M","T","W","T","F"]);
  const [mission, setMission] = useState(alarm?.mission || "Photo");
  const [shield, setShield] = useState(alarm?.shield || 30);
  const [sound, setSound] = useState("Sunrise");
  const [sheet, setSheet] = useState(false);
  const [aiBrief, setAiBrief] = useState(false);
  const [silenceNotif, setSilenceNotif] = useState(true);
  const [chainMissions, setChainMissions] = useState(false);
  const [autoCal, setAutoCal] = useState(false);
  const [weather, setWeather] = useState(false);
  const [bedtime, setBedtime] = useState(false);
  const [missionDay, setMissionDay] = useState(false);

  const dayLabels = ["M","T","W","T","F","S","S"];
  const toggleDay = (i) => {
    const lbl = dayLabels[i];
    if (days.includes(lbl)) setDays(days.filter(d => d !== lbl));
    else setDays([...days, lbl]);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--ink)', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-on-dark)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Icon name="chevL" size={20}/> Back
        </button>
        <div className="t-heading-sm">{alarm ? "Edit alarm" : "New alarm"}</div>
        <button onClick={() => onSave({ ...(alarm || {}), id: alarm?.id || `a${Date.now()}`, time: `${String(time.h).padStart(2,'0')}:${String(time.m).padStart(2,'0')}`, ampm: time.ampm, days, mission, missionIcon: mission === "Math" ? "calc" : "camera", shield, enabled: true })} style={{ background: 'none', border: 'none', color: 'var(--sunrise-500)', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Save
        </button>
      </div>

      <div className="scene-scroll" style={{ flex: 1, padding: '8px 20px 24px' }}>
        <div style={{ background: 'var(--ink-soft)', borderRadius: 16, padding: 20, marginBottom: 16, textAlign: 'center', border: '1px solid var(--ink-line)' }}>
          <TimeWheel value={time} onChange={setTime}/>
        </div>

        <div className="t-label-md" style={{ color: 'var(--text-on-dark-soft)', marginBottom: 8 }}>Repeats</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'space-between' }}>
          {dayLabels.map((d, i) => {
            const active = days.includes(d);
            return (
              <button key={i} onClick={() => toggleDay(i)} style={{
                width: 36, height: 36, borderRadius: '50%',
                background: active ? 'var(--sunrise-500)' : 'var(--ink-soft)',
                color: active ? 'var(--ink)' : 'var(--text-on-dark-soft)',
                border: active ? 'none' : '1px solid var(--ink-line)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
              }}>{d}</button>
            );
          })}
        </div>

        <SettingsGroup header="Mission">
          <SettingsRow label={mission} sublabel="Tap to change" icon={mission === "Math" ? "calc" : "camera"} iconColor="var(--ink-elevated)" trailing={<Icon name="chevDown" size={16} color="var(--text-on-dark-soft)"/>} onClick={() => setSheet(true)}/>
          <SettingsRow label="Mission of the day" sublabel="Surprise me with a different mission each day" trailing={<Toggle on={missionDay} onChange={setMissionDay}/>}/>
          <SettingsRow label="Chain multiple missions" sublabel="Add a 2nd, 3rd mission" trailing={<Toggle on={chainMissions} onChange={setChainMissions}/>}/>
        </SettingsGroup>

        <SettingsGroup header="Phone shield">
          <SettingsRow label="Lock duration" value={`${shield} min`} trailing={<Icon name="chevDown" size={16} color="var(--text-on-dark-soft)"/>}
            onClick={() => { const nxt = { 30: 45, 45: 60, 60: 90, 90: 120, 120: 30 }[shield] || 30; setShield(nxt); }}/>
          <SettingsRow label="Apps to block" value="IG, TikTok, X +1" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
          <SettingsRow label="Bedtime shield" sublabel="Activate at 10:30 PM" trailing={<Toggle on={bedtime} onChange={setBedtime}/>}/>
          <SettingsRow label="Silence notifications" sublabel="During the wake window" trailing={<Toggle on={silenceNotif} onChange={setSilenceNotif}/>}/>
        </SettingsGroup>

        <SettingsGroup header="Sound">
          <SettingsRow label={sound} sublabel="Default — soft chimes building over 8s" trailing={<Icon name="chevDown" size={16} color="var(--text-on-dark-soft)"/>}/>
          <SettingsRow label="Spotify wake" sublabel="Wake to a track from your library" premium onClick={() => onTriggerPaywall?.("Spotify wake")}/>
          <SettingsRow label="Custom alarm sound packs" sublabel="Forest, Cafe, Boutique, Generative" premium onClick={() => onTriggerPaywall?.("Custom alarm sound packs")}/>
        </SettingsGroup>

        <SettingsGroup header="Smart">
          <SettingsRow label="Auto-set from calendar" sublabel="Adjust to your first meeting" trailing={<Toggle on={autoCal} onChange={setAutoCal}/>}/>
          <SettingsRow label="Earlier on rainy days" sublabel="+15 min when commute is wet" trailing={<Toggle on={weather} onChange={setWeather}/>}/>
          <SettingsRow label="AI Morning Brief" sublabel="Replaces your social feed" premium onClick={() => onTriggerPaywall?.("AI Morning Brief")}/>
          <SettingsRow label="Daily mantra" sublabel="A line you'll see every morning" trailing={<Icon name="edit" size={14} color="var(--text-on-dark-soft)"/>}/>
        </SettingsGroup>

        <button style={{ background: 'none', border: 'none', color: 'var(--sunrise-500)', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Advanced ›</button>
      </div>

      <MissionPickerSheet open={sheet} onClose={() => setSheet(false)} value={mission} onSelect={(v) => { setMission(v); setSheet(false); }} onPremiumTap={(name) => { setSheet(false); onTriggerPaywall?.(name); }}/>
    </div>
  );
}

// ─── Streak tab ───
function StreakTab({ tweaks, onTriggerPaywall }) {
  const days = tweaks.streakState === "broken" ? 0 : tweaks.streakDays;
  const tier = tierFor(days);
  const broken = tweaks.streakState === "broken";
  const calendar = buildCalendar(days, tweaks.streakState);
  const minutesSaved = days * 30;
  const hoursSaved = Math.round(minutesSaved / 60);

  return (
    <div className="scene-scroll" style={{ flex: 1, padding: '12px 20px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0 16px' }}>
        <div className="t-heading-md">Streak</div>
        <button style={{ background: 'var(--ink-soft)', border: 'none', width: 36, height: 36, borderRadius: '50%', color: 'var(--text-on-dark-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="settings" size={18}/>
        </button>
      </div>

      {/* Hero */}
      <div className="grain" style={{
        position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse 110% 70% at 50% 0%, rgba(255,255,255,0.7) 0%, transparent 65%), linear-gradient(160deg, #FFE5CE 0%, #FFD9B8 50%, #FFC299 100%)',
        border: '1px solid rgba(255,255,255,0.7)',
        borderRadius: 24, padding: '28px 22px 24px',
        marginBottom: 20,
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(245,217,192,0.6) inset, 0 14px 36px rgba(238,122,72,0.18), 0 4px 12px rgba(80,40,20,0.08)',
      }}>
        {/* Halo glow behind number */}
        <div style={{
          position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
          width: 320, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,214,110,0.55) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
          animation: 'glowPulse 4s ease-in-out infinite',
        }}/>

        {/* Big number with flame */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 12, position: 'relative', zIndex: 1 }}>
          <div className="tnum" style={{
            fontFamily: 'var(--font-display)', fontWeight: 500,
            fontSize: 96, lineHeight: 0.9, color: '#2A1810',
            letterSpacing: '-0.04em',
            textShadow: '0 4px 30px rgba(238,122,72,0.4)',
          }}>{days}</div>
          <Icon name="flame" size={36} color="#7A2E0E"/>
        </div>

        {/* Label */}
        <div className="t-label-sm" style={{
          color: '#7A2E0E', textAlign: 'center', marginTop: 8,
          letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700,
          position: 'relative', zIndex: 1,
        }}>{broken ? "tomorrow is the first one" : "day streak"}</div>

        {/* Tier pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14, position: 'relative', zIndex: 1 }}>
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

        {/* Week strip */}
        <div style={{ marginTop: 26, position: 'relative', zIndex: 1 }}>
          <div className="t-label-sm" style={{ color: 'rgba(122,46,14,0.6)', marginBottom: 10, letterSpacing: 1, fontWeight: 700, textTransform: 'uppercase' }}>This week</div>
          <WeekStrip filled={broken ? 6 : Math.min(days, 7)} broken={broken}/>
        </div>

        {/* Tier ladder */}
        <div style={{ marginTop: 26, position: 'relative', zIndex: 1 }}>
          <div className="t-label-sm" style={{ color: 'rgba(122,46,14,0.6)', marginBottom: 10, letterSpacing: 1, fontWeight: 700, textTransform: 'uppercase' }}>Tier journey</div>
          <TierLadder days={days}/>
        </div>
      </div>

      {/* This month */}
      <div className="t-label-sm" style={{ color: 'var(--text-on-dark-soft)', marginBottom: 12 }}>This month</div>
      <div style={{
        background: 'linear-gradient(160deg, #FFFBF5 0%, #FFEFE0 100%)',
        border: '1px solid rgba(255,255,255,0.8)',
        borderRadius: 18, padding: '20px 8px', marginBottom: 20,
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(245,217,192,0.5) inset, 0 6px 20px rgba(80,40,20,0.06)',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      }}>
        <StreakStatTile icon="sun"     value={days}                          label="mornings"/>
        <StreakStatTile icon="moon"    value={hoursSaved}                    label="hours"     divider/>
        <StreakStatTile icon="sparkle" value={minutesSaved.toLocaleString()} label="minutes"   divider/>
      </div>

      {/* Calendar */}
      <div className="t-label-sm" style={{ color: 'var(--text-on-dark-soft)', marginBottom: 12 }}>Calendar</div>
      <div style={{
        background: 'linear-gradient(160deg, #FFFBF5 0%, #FFEFE0 100%)',
        border: '1px solid rgba(255,255,255,0.8)',
        borderRadius: 18, padding: 18, marginBottom: 20,
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(245,217,192,0.5) inset, 0 6px 20px rgba(80,40,20,0.06)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 22,
          color: '#2A1810', marginBottom: 14, letterSpacing: '-0.01em',
        }}>April 2026</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, marginBottom: 8 }}>
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'rgba(122,46,14,0.5)', letterSpacing: 1, textTransform: 'uppercase' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
          {calendar.map((c, i) => {
            const isShielded = c.status === "shielded";
            const isBroken = c.status === "broken";
            const isToday = c.status === "today";
            const isFuture = c.status === "future";
            return (
              <div key={i} className="tnum" style={{
                aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: isToday ? 700 : 600,
                color: isShielded ? '#FFFBF5' : isBroken ? '#7A2E0E' : isToday ? '#7A2E0E' : 'rgba(122,46,14,0.45)',
                background: isShielded
                  ? 'linear-gradient(160deg, #FFD66E 0%, #FFB088 50%, #EE7A48 100%)'
                  : isBroken
                    ? 'rgba(216,89,89,0.18)'
                    : isToday
                      ? 'rgba(255,255,255,0.6)'
                      : 'transparent',
                border: isToday
                  ? '2px solid #EE7A48'
                  : isBroken
                    ? '1px solid rgba(216,89,89,0.4)'
                    : isFuture
                      ? '1px dashed rgba(122,46,14,0.18)'
                      : '1px solid transparent',
                borderRadius: 9,
                boxShadow: isShielded
                  ? '0 2px 6px rgba(238,122,72,0.28), inset 0 1px 0 rgba(255,255,255,0.45)'
                  : isToday
                    ? '0 0 16px rgba(238,122,72,0.45), inset 0 1px 0 rgba(255,255,255,0.6)'
                    : 'none',
                animation: isToday ? 'glowPulse 3s ease-in-out infinite' : 'none',
              }}>{c.d}</div>
            );
          })}
        </div>
      </div>

      {/* Friends */}
      <div className="t-label-sm" style={{ color: 'var(--text-on-dark-soft)', marginBottom: 12 }}>Friends streaking today</div>
      <div style={{
        background: 'linear-gradient(160deg, #FFFBF5 0%, #FFEFE0 100%)',
        border: '1px solid rgba(255,255,255,0.8)',
        borderRadius: 18, marginBottom: 12, overflow: 'hidden',
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(245,217,192,0.5) inset, 0 6px 20px rgba(80,40,20,0.06)',
      }}>
        {FRIENDS.map((f, i) => {
          const friendTier = tierFor(f.streak);
          return (
            <React.Fragment key={f.id}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Tier-ring avatar */}
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  padding: 2,
                  background: `linear-gradient(135deg, ${friendTier.color}, ${friendTier.color}99)`,
                  boxShadow: `0 3px 10px ${friendTier.color}55`,
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFD66E, #EE7A48)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FFFBF5', fontWeight: 700, fontSize: 15,
                    border: '2px solid #FFFBF5',
                  }}>{f.name[0]}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t-body-md" style={{ color: '#2A1810', fontWeight: 600 }}>{f.name}</div>
                  {f.atRisk && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      marginTop: 2, padding: '2px 8px',
                      background: 'rgba(229,154,42,0.18)', border: '1px solid rgba(229,154,42,0.4)',
                      borderRadius: 999,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--warning)' }}/>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#8A5A1A', letterSpacing: 0.5, textTransform: 'uppercase' }}>at risk</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#7A2E0E' }}>
                  <Icon name="flame" size={14} color="#7A2E0E"/>
                  <span className="tnum t-body-md" style={{ fontWeight: 700 }}>{f.streak}</span>
                </div>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: f.online ? 'var(--success)' : 'rgba(122,46,14,0.25)',
                  boxShadow: f.online ? '0 0 8px rgba(47,174,110,0.6)' : 'none',
                  flexShrink: 0,
                }}/>
              </div>
              {i < FRIENDS.length - 1 && <div style={{ height: 1, background: 'rgba(245,217,192,0.7)', marginLeft: 70 }}/>}
            </React.Fragment>
          );
        })}
      </div>
      <button style={{
        background: 'linear-gradient(135deg, rgba(255,214,110,0.25), rgba(238,122,72,0.18))',
        border: '1px solid rgba(238,122,72,0.3)',
        color: '#7A2E0E', cursor: 'pointer',
        padding: '12px 16px', marginBottom: 16,
        fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        width: '100%', borderRadius: 14,
        boxShadow: '0 2px 8px rgba(238,122,72,0.15), inset 0 1px 0 rgba(255,255,255,0.4)',
      }}>
        <Icon name="plus" size={16}/> Invite a friend
      </button>

      {/* Group challenges */}
      <div style={{
        background: 'linear-gradient(160deg, #FFFBF5 0%, #FFEFE0 100%)',
        border: '1px solid rgba(255,255,255,0.8)',
        borderRadius: 18, padding: 18, marginBottom: 20,
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(245,217,192,0.5) inset, 0 8px 24px rgba(80,40,20,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #FFD66E, #EE7A48)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFBF5',
            boxShadow: '0 6px 16px rgba(238,122,72,0.32), inset 0 1px 0 rgba(255,255,255,0.4)',
            flexShrink: 0,
          }}>
            <Icon name="users" size={22}/>
          </div>
          <div style={{ flex: 1 }}>
            <div className="t-body-md" style={{ fontWeight: 700, color: '#2A1810' }}>Group challenges</div>
            <div className="t-body-sm" style={{ color: 'rgba(122,46,14,0.65)', marginTop: 2 }}>Join 5 friends in a 12-week shielded morning challenge</div>
          </div>
          <Icon name="chevR" size={16} color="rgba(122,46,14,0.5)"/>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(160deg, #FFFBF5 0%, #FFEFE0 100%)',
        border: '1px solid rgba(255,255,255,0.8)',
        borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(245,217,192,0.5) inset, 0 6px 20px rgba(80,40,20,0.06)',
      }}>
        <LinkRow label="View weekly recap"            icon="info"    last={false}/>
        <LinkRow label="Compare best vs worst mornings" icon="refresh" last={false}/>
        <LinkRow label="Productivity correlation"     icon="sparkle" last/>
      </div>
    </div>
  );
}

function LinkRow({ label, icon, last }) {
  return (
    <button style={{
      background: 'none',
      border: 'none',
      borderBottom: last ? 'none' : '1px solid rgba(245,217,192,0.7)',
      color: '#7A2E0E',
      cursor: 'pointer',
      padding: '14px 16px',
      fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', gap: 12,
      width: '100%', textAlign: 'left',
    }}>
      {icon && (
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'rgba(238,122,72,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--sunrise-500)',
          flexShrink: 0,
        }}>
          <Icon name={icon} size={14}/>
        </div>
      )}
      <span style={{ flex: 1 }}>{label}</span>
      <Icon name="chevR" size={14} color="rgba(122,46,14,0.5)"/>
    </button>
  );
}

// ─── You tab ───
function YouTab({ tweaks, onTriggerPaywall, onOpenUpi, onUpgrade }) {
  const isPremium = tweaks.isPremium;
  return (
    <div className="scene-scroll" style={{ flex: 1, padding: '12px 20px 20px' }}>
      <div className="t-heading-md" style={{ padding: '4px 0 16px' }}>You</div>

      {/* Profile */}
      <div style={{ background: 'var(--ink-soft)', border: '1px solid var(--ink-line)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: isPremium ? 0 : 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--sunrise-500), var(--sunrise-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', fontWeight: 700, fontSize: 22 }}>A</div>
          <div style={{ flex: 1 }}>
            <div className="t-heading-sm">Arjun</div>
            <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>arjun@example.in</div>
            <div className="t-body-sm" style={{ color: isPremium ? 'var(--sunrise-500)' : 'var(--text-on-dark-soft)', marginTop: 2, fontWeight: isPremium ? 600 : 400 }}>{isPremium ? "Premium — Lifetime" : "Free plan"}</div>
          </div>
        </div>
        {!isPremium && (
          <Button kind="primary" fullWidth icon="sparkle" onClick={onUpgrade} size="md">Upgrade to Premium</Button>
        )}
      </div>

      <SettingsGroup header="Commitment">
        <SettingsRow label="UPI commitment" sublabel="Not active" icon="upi" iconColor="var(--ink-elevated)" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>} onClick={onOpenUpi}/>
      </SettingsGroup>

      <SettingsGroup header="Morning essentials">
        <SettingsRow label="Modes" sublabel="Work / Sleep / Family / Gym / Travel" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Multiple profiles" sublabel="Weekday / Weekend" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Calendar integration" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Weather-aware wake" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
      </SettingsGroup>

      <SettingsGroup header="Integrations">
        <SettingsRow label="Apple Health" icon="health" iconColor="rgba(216,89,89,0.15)" premium={!isPremium} onClick={() => !isPremium && onTriggerPaywall?.("Apple Health sync")}/>
        <SettingsRow label="Spotify" icon="spotify" iconColor="rgba(95,181,138,0.15)" premium={!isPremium} onClick={() => !isPremium && onTriggerPaywall?.("Spotify wake")}/>
        <SettingsRow label="Duolingo" icon="duo" iconColor="rgba(95,181,138,0.15)" premium={!isPremium} onClick={() => !isPremium && onTriggerPaywall?.("Duolingo handoff")}/>
        <SettingsRow label="Headspace" icon="headset" iconColor="rgba(122,149,224,0.15)" premium={!isPremium} onClick={() => !isPremium && onTriggerPaywall?.("Meditation mission")}/>
      </SettingsGroup>

      <SettingsGroup header="Analytics">
        <SettingsRow label="Weekly recap" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Best vs worst mornings" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Productivity correlation" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Export my data" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
      </SettingsGroup>

      <SettingsGroup header="Device">
        <SettingsRow label="Home-screen widget" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Lock-screen widget" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Apple Watch" icon="apple" premium={!isPremium} onClick={() => !isPremium && onTriggerPaywall?.("Apple Watch")}/>
        <SettingsRow label="Multi-device sync" premium={!isPremium} onClick={() => !isPremium && onTriggerPaywall?.("Multi-device sync")}/>
        <SettingsRow label="Cloud backup" premium={!isPremium} onClick={() => !isPremium && onTriggerPaywall?.("Cloud backup")}/>
      </SettingsGroup>

      <SettingsGroup header="Streak">
        <SettingsRow label="Streak insurance" sublabel="1 skip available" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Gift a streak month" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Pair with a friend" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
      </SettingsGroup>

      <SettingsGroup header="Wedge enforcement">
        <SettingsRow label="Strict mode" sublabel="Prevent uninstall during shield" trailing={<Toggle on={false} onChange={() => {}}/>}/>
        <SettingsRow label="Re-trigger if asleep" sublabel="Within 5 min after wake" trailing={<Toggle on={true} onChange={() => {}}/>}/>
      </SettingsGroup>

      <SettingsGroup header="Preferences">
        <SettingsRow label="Language" value="English" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Indian holidays" sublabel="Auto-skip on Diwali, Holi, Eid" trailing={<Toggle on={true} onChange={() => {}}/>}/>
        <SettingsRow label="Accessibility" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
      </SettingsGroup>

      <SettingsGroup header="Referrals">
        <SettingsRow label="Gift premium to a friend" sublabel="14 days free for them" icon="gift" iconColor="rgba(248,147,102,0.15)" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
      </SettingsGroup>

      <SettingsGroup header="About">
        <SettingsRow label="Help" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Privacy policy" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
        <SettingsRow label="Terms" trailing={<Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>}/>
      </SettingsGroup>

      <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)', textAlign: 'center', opacity: 0.5, padding: '8px 0' }}>v1.0 · alarm shield</div>
    </div>
  );
}

// ─── UPI commitment ───
function UpiSetup({ onBack, onActivate, onTriggerPaywall }) {
  const [amount, setAmount] = useState(50);
  const [cause, setCause] = useState(null);
  const [linked, setLinked] = useState(null);
  const [showUpi, setShowUpi] = useState(false);
  const ready = amount && cause && linked;
  const toast = useToast();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--ink)', minHeight: 0 }}>
      <TopBar title="Commitment" onBack={onBack}/>
      <div className="scene-scroll" style={{ flex: 1, padding: '8px 20px 24px' }}>
        <div className="t-heading-lg" style={{ color: 'var(--text-on-dark)', marginBottom: 12, textWrap: 'balance' }}>
          Put your money where your morning is
        </div>
        <div className="t-body-md" style={{ color: 'var(--text-on-dark-soft)', marginBottom: 24, textWrap: 'pretty' }}>
          If you break your shield, we send ₹{amount} to a cause you choose. Your money. Your morning. Your terms.
        </div>

        <div style={{ height: 1, background: 'var(--ink-line)', margin: '0 0 20px' }}/>

        <div className="t-label-md" style={{ marginBottom: 8, color: 'var(--text-on-dark-soft)' }}>Amount per break</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[50, 100, 200, 500].map(a => (
            <button key={a} onClick={() => setAmount(a)} style={{
              flex: 1, padding: '14px 0', borderRadius: 'var(--radius-md)',
              background: amount === a ? 'var(--sunrise-500)' : 'var(--ink-soft)',
              color: amount === a ? 'var(--ink)' : 'var(--text-on-dark)',
              border: '1px solid', borderColor: amount === a ? 'var(--sunrise-500)' : 'var(--ink-line)',
              fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>₹{a}</button>
          ))}
        </div>

        <div className="t-label-md" style={{ marginBottom: 8, color: 'var(--text-on-dark-soft)' }}>Cause</div>
        <div style={{ background: 'var(--ink-soft)', border: '1px solid var(--ink-line)', borderRadius: 16, marginBottom: 20, overflow: 'hidden' }}>
          {[
            { id: "Goonj", desc: "Clothes for displaced communities" },
            { id: "Akshaya Patra", desc: "Mid-day meals for school kids" },
            { id: "Smile Foundation", desc: "Education for underprivileged children" },
          ].map((c, i, arr) => (
            <button key={c.id} onClick={() => setCause(c.id)} style={{
              width: '100%', padding: '14px 16px', background: 'none', border: 'none',
              borderBottom: i < arr.length - 1 ? '1px solid var(--ink-line)' : 'none',
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
              color: 'var(--text-on-dark)', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid', borderColor: cause === c.id ? 'var(--sunrise-500)' : 'var(--ink-line)', background: cause === c.id ? 'var(--sunrise-500)' : 'transparent', flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <div className="t-body-md" style={{ fontWeight: 500 }}>{c.id}</div>
                <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)' }}>{c.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button onClick={() => onTriggerPaywall?.("Friend-paid commitment")} style={{ flex: 1, padding: '12px', background: 'var(--ink-soft)', border: '1px solid var(--ink-line)', borderRadius: 'var(--radius-md)', color: 'var(--text-on-dark)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            Send to friend <PremiumTag/>
          </button>
          <button onClick={() => onTriggerPaywall?.("Public commitment")} style={{ flex: 1, padding: '12px', background: 'var(--ink-soft)', border: '1px solid var(--ink-line)', borderRadius: 'var(--radius-md)', color: 'var(--text-on-dark)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            Make public <PremiumTag/>
          </button>
        </div>

        <div className="t-label-md" style={{ marginBottom: 8, color: 'var(--text-on-dark-soft)' }}>Link UPI</div>
        <button onClick={() => setShowUpi(true)} style={{ width: '100%', padding: '14px 16px', background: 'var(--ink-soft)', border: '1px solid var(--ink-line)', borderRadius: 'var(--radius-md)', color: linked ? 'var(--success)' : 'var(--text-on-dark)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="upi" size={18}/> {linked ? `Linked: ${linked}` : "Link UPI account"}
          </span>
          {!linked && <Icon name="chevR" size={14}/>}
          {linked && <Icon name="check" size={18}/>}
        </button>

        <Button kind="primary" fullWidth disabled={!ready} icon="check" onClick={() => { onActivate?.(); toast?.("Commitment activated", "success"); }}>
          Activate commitment
        </Button>

        <div className="t-body-sm" style={{ color: 'var(--text-on-dark-soft)', marginTop: 16 }}>
          ₹0.50 covers UPI fees. ₹{amount - 0.5} goes to your cause. We never take your commitment money.
        </div>
      </div>

      <Sheet open={showUpi} onClose={() => setShowUpi(false)} title="Link UPI" height="48%">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { id: "GPay",     color: "#4285F4" },
            { id: "PhonePe",  color: "#5F259F" },
            { id: "Paytm",    color: "#00BAF2" },
            { id: "BHIM",     color: "#F89366" },
          ].map(p => (
            <button key={p.id} onClick={() => { setLinked(`${p.id} · arjun@${p.id.toLowerCase()}`); setShowUpi(false); toast?.(`${p.id} linked`, "success"); }} style={{
              padding: 16, background: 'var(--ink-soft)', border: '1px solid var(--ink-line)',
              borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 14,
              color: 'var(--text-on-dark)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: p.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{p.id[0]}</div>
              <div style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{p.id}</div>
              <Icon name="chevR" size={14} color="var(--text-on-dark-soft)"/>
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

Object.assign(window, { HomeScreen, AlarmSetup, StreakTab, YouTab, UpiSetup, WeekStrip, TierLadder, StreakStatTile });
