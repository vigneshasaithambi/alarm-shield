/* global React */
// Alarm Shield — shared data + helpers

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "isPremium": false,
  "streakDays": 47,
  "streakState": "active",
  "nextAlarmMinutes": 432
}/*EDITMODE-END*/;

// Streak ladder
const TIERS = [
  { name: "Bronze", min: 7,   color: "#D26536" },
  { name: "Silver", min: 30,  color: "#A8A3BD" },
  { name: "Gold",   min: 90,  color: "#F89366" },
  { name: "Platinum", min: 365, color: "#7A95E0" },
];
function tierFor(days) {
  let t = { name: "Pre-Bronze", min: 0, color: "#5A5570" };
  for (const x of TIERS) if (days >= x.min) t = x;
  return t;
}

// Friends (per PRD §14.4)
const FRIENDS = [
  { id: "f1", name: "Rahul", streak: 89, tier: "Gold",   online: true,  atRisk: false },
  { id: "f2", name: "Priya", streak: 23, tier: "Bronze", online: true,  atRisk: false },
  { id: "f3", name: "Maya",  streak: 12, tier: "Bronze", online: false, atRisk: true  },
];

// Alarms (per PRD §14.2)
const DEFAULT_ALARMS = [
  { id: "a1", time: "06:30", ampm: "AM", days: ["M","T","W","T","F"], mission: "Photo", missionIcon: "camera", enabled: true,  shield: 30 },
  { id: "a2", time: "09:00", ampm: "AM", days: ["S","S"],             mission: "Math",  missionIcon: "calc",   enabled: false, shield: 30 },
];

// Calendar status for current month (mocked - 30 days, Apr 2026)
function buildCalendar(streakDays, state) {
  // Build a 30-day grid; Today = day matching streakDays (or 25 if active)
  const days = [];
  const today = 25;
  for (let d = 1; d <= 30; d++) {
    if (d > today) { days.push({ d, status: "future" }); continue; }
    if (state === "broken" && d === today - 1) { days.push({ d, status: "broken" }); continue; }
    if (state === "broken" && d === today) { days.push({ d, status: "today" }); continue; }
    if (state === "recovery" && d === today) { days.push({ d, status: "today" }); continue; }
    if (d === today) { days.push({ d, status: "today" }); continue; }
    // simulate one broken day mid-month for active state with high streak
    if (state === "active" && streakDays < 47 && d === 14) { days.push({ d, status: "broken" }); continue; }
    days.push({ d, status: "shielded" });
  }
  return days;
}

function fmtCountdown(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `in ${m}m`;
  return `in ${h}h ${m}m`;
}

Object.assign(window, { TWEAK_DEFAULTS, TIERS, tierFor, FRIENDS, DEFAULT_ALARMS, buildCalendar, fmtCountdown });
