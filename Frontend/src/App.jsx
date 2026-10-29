import { useEffect, useMemo, useState } from "react";
import { Check } from "../ApiCall/fetch";
import "./App.css";
import { Monthmenu } from "../ApiCall/MenuFetch";
import { customPalette } from "./palette";
import { getMealSchedule } from "../../shared/menuTime.mjs";
const calendarDate = (iso) => { const [year, month, day] = iso.split("-").map(Number); return new Date(year, month - 1, day); };

const MEALS = [
  { key: "breakfast", label: "Breakfast", icon: "sun", note: "A good start to the day", time: "Morning" },
  { key: "lunch", label: "Lunch", icon: "bowl", note: "Your midday recharge", time: "Afternoon" },
  { key: "snacks", label: "Snacks", icon: "cup", note: "A little afternoon pick-me-up", time: "Evening" },
  { key: "dinner", label: "Dinner", icon: "moon", note: "End the day on a good note", time: "Night" },
];
const dateKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const fullDate = (date) => date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

function Icon({ name, size = 22 }) {
  const paths = {
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    bowl: <><path d="M3 11h18a9 9 0 0 1-18 0ZM8 21h8M8 3v4m4-5v5m4-4v4" /></>,
    cup: <><path d="M4 8h13v7a6 6 0 0 1-12 0V8m12 1h2a3 3 0 0 1 0 6h-2M3 22h17M8 2v3m5-3v3" /></>,
    moon: <path d="M20 14A8.5 8.5 0 0 1 10 4a8.5 8.5 0 1 0 10 10Z" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2m-8 3h2" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    left: <path d="m14 6-6 6 6 6" />,
    right: <path d="m10 6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.bowl}</svg>;
}

export default function App() {
  const [palette, setPalette] = useState(() => {
    try {
      const saved = localStorage.getItem("notify-palette");
      return saved === "custom" ? "custom" : "graphite";
    } catch { return "graphite"; }
  });
  const [customColor, setCustomColor] = useState(() => {
    try { const saved = localStorage.getItem("notify-custom-color"); return /^#[0-9a-f]{6}$/i.test(saved) ? saved : "#3164bd"; }
    catch { return "#3164bd"; }
  });
  function updateCustomColor(value) {
    setCustomColor(value);
    choosePalette("custom");
    try { localStorage.setItem("notify-custom-color", value); } catch { /* Optional storage. */ }
  }
  function choosePalette(value) {
    setPalette(value);
    try { localStorage.setItem("notify-palette", value); } catch { /* Selection works without storage. */ }
  }
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem("notify-theme") === "dark"; }
    catch { return false; }
  });
  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.style.colorScheme = theme;
    document.documentElement.style.backgroundColor = darkMode ? "#131313" : "#ffffff";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", darkMode ? "#131313" : "#ffffff");
    try { localStorage.setItem("notify-theme", theme); } catch { /* Works without storage. */ }
  }, [darkMode]);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer;
    function tick() {
      const current = new Date();
      setNow(current);
      clearTimeout(timer);
      timer = setTimeout(tick, 60000 - (current.getTime() % 60000) + 50);
    }
    function resume() { if (!document.hidden) tick(); }
    tick();
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", resume);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", resume);
    };
  }, []);
  const schedule = getMealSchedule(now);
  const today = calendarDate(schedule.today);
  return (
    <div className={`design-page design-minimal palette-${palette}${darkMode ? " theme-dark" : ""}`} style={palette === "custom" ? customPalette(customColor, darkMode) : undefined}>
      <div className="site-shell">
        <header className="site-header">
          <a className="brand" href="#" aria-label="Notify 2.0 home"><span className="brand-icon"><Icon name="bowl" size={24} /></span>notify<span className="brand-version">2.0</span></a>
          <nav aria-label="Main navigation"><a href="#daily-menu">Daily menu</a><a href="#calendar">Meal calendar</a></nav>
          <div className="header-controls">
            <button className="theme-toggle" type="button" aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} title={darkMode ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setDarkMode(previous => !previous)}>
              <Icon name={darkMode ? "moon" : "sun"} size={18} />
            </button>
            <a className="header-action" href="#notifications" aria-label="Get notified"><Icon name="bell" size={17} /><span>Get notified</span><Icon name="arrow" size={17} /></a>
          </div>
        </header>
        <main>
          <DailyMenu key={schedule.date + schedule.upcoming} schedule={schedule} />
          <div className="quick-links"><a href="#calendar"><Icon name="calendar" size={18} />Browse calendar<Icon name="arrow" size={16} /></a><a href="#notifications"><Icon name="bell" size={18} />Meal reminders<Icon name="arrow" size={16} /></a></div>
          <details className="appearance-panel">
            <summary><span><Icon name="sun" size={18} />Appearance</span><span className="appearance-current">{palette === "custom" ? "Custom color" : "Graphite"}<span aria-hidden="true"> +</span></span></summary>
            <div className="palette-picker" role="group" aria-label="Color palette">
              <div><p className="palette-label">CHOOSE YOUR COLORS</p><p className="palette-help">Graphite by default. Choose your own accent color below.</p></div>
              <label className="custom-color-control"><span>Choose a custom color</span><input type="color" aria-label="Custom accent color" value={customColor} onInput={event => updateCustomColor(event.target.value)} onChange={event => updateCustomColor(event.target.value)} /><span className="color-code">{customColor.toUpperCase()}</span></label>
              {palette === "custom" && <button type="button" className="reset-palette" onClick={() => choosePalette("graphite")}>Reset to default</button>}
            </div>
          </details>
          <MealCalendar key={schedule.today.slice(0, 7)} today={today} />
          <Notifications />
        </main>
        <footer><a className="brand" href="#">notify<span className="brand-version">2.0</span></a><p>Less guessing. More enjoying.</p><span>Made for your everyday.</span></footer>
      </div>
    </div>
  );
}

function DailyMenu({ schedule }) {
  const menuDate = calendarDate(schedule.date);
  const [reload, setReload] = useState(0);
  const [chosenMeal, setChosenMeal] = useState(null);
  const activeMeal = chosenMeal ?? schedule.activeMeal;
  const [state, setState] = useState({ loading: true, menu: null, error: "" });
  useEffect(() => {
    const controller = new AbortController();
    async function loadMenu() {
      try {
        if (!import.meta.env.VITE_API1) throw new Error("The daily menu isn’t available yet. Check back soon.");
        const response = await fetch(import.meta.env.VITE_API1, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("We couldn’t load the menu. Please try again later.");
        const data = await response.json();
        setState({ loading: false, menu: data.menu, error: "" });
      } catch (error) {
        if (error.name !== "AbortError") setState({ loading: false, menu: null, error: error instanceof TypeError ? "We couldn’t reach the menu service. Please try again." : error.message });
      }
    }
    loadMenu();
    return () => {
      controller.abort();
    };
  }, [reload]);
  const meal = MEALS[activeMeal];
  return <section className="daily-section" id="daily-menu" aria-labelledby="daily-title"><div className="daily-intro"><div className="eyebrow">ON THE MENU</div><h1 id="daily-title">{schedule.upcoming ? "Tomorrow’s menu" : "Today’s menu"}</h1><p>{menuDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p></div><div className="daily-content"><div className="meal-tabs" aria-label="Choose a meal">{MEALS.map((item, index) => <button key={item.key} aria-pressed={index === activeMeal} onClick={() => setChosenMeal(index)} className={index === activeMeal ? "active" : ""}><Icon name={item.icon} size={17} />{item.label}</button>)}</div><div className="daily-description" aria-live="polite" aria-busy={state.loading}><span className="daily-meal-icon"><Icon name={meal.icon} size={27} /></span><div><h3>{meal.label}{schedule.upcoming ? " · Tomorrow" : ""}</h3>{state.loading ? <MenuLoader /> : <p>{state.error || state.menu?.[meal.key] || "This meal’s menu hasn’t been added yet."}</p>}{state.error && <button className="retry-menu" onClick={() => { setState({ loading: true, menu: null, error: "" }); setReload(value => value + 1); }}>Try again</button>}</div></div></div></section>;
}

function MenuLoader() {
  return (
    <div className="menu-loader" role="status" aria-label="Loading menu">
      <div className="menu-skeleton" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <span className="menu-loading-caption">Fetching your menu…</span>
    </div>
  );
}

function MealCalendar({ today }) {
  // The backend keeps one month of menu; MenuFetch caches it in localStorage as "Monthmenu".
  const [monthMenu, setMonthMenu] = useState(null);
  const [menuStatus, setMenuStatus] = useState("loading"); // "loading" | "ready" | "error"
  async function loadMonthMenu() {
    setMenuStatus("loading");
    try {
      let stored = null;
      try { stored = localStorage.getItem("Monthmenu"); } catch { /* Storage is optional. */ }
      if (!stored) {
        const result = await Monthmenu(); // fetches and saves the menu back to localStorage
        if (result === "sucess" || result === "success") {
          try { stored = localStorage.getItem("Monthmenu"); } catch { /* Storage is optional. */ }
        }
      }
      const rows = JSON.parse(stored ?? "null")?.menu;
      const hasRows = Array.isArray(rows) && rows.length > 0;
      setMonthMenu(hasRows ? rows : null);
      setMenuStatus(hasRows ? "ready" : "error");
    } catch {
      setMonthMenu(null);
      setMenuStatus("error");
    }
  }
  useEffect(() => { loadMonthMenu(); }, []);
  const month = new Date(today.getFullYear(), today.getMonth(), 1);
  const [selectedDate, setSelectedDate] = useState(today);
  const firstWeekday = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const goToToday = () => setSelectedDate(today);
  const dayMenu = monthMenu ? monthMenu.find(row => Number(row?.date) === selectedDate.getDate()) ?? null : null;
  const [search, setSearch] = useState("");
  const searchMatches = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!monthMenu || query.length < 2) return [];
    return monthMenu.reduce((matches, row) => {
      const matchedMeals = MEALS.filter(meal => (row?.[meal.key] || "").toLowerCase().includes(query));
      if (matchedMeals.length) matches.push({ row, meals: matchedMeals.map(meal => meal.label) });
      return matches;
    }, []);
  }, [monthMenu, search]);
  const searchActive = menuStatus === "ready" && search.trim().length > 1;
  return (
    <section className="calendar-section" id="calendar" aria-labelledby="calendar-title">
      <div className="section-heading">
        <div>
          <div className="eyebrow">A LITTLE PLANNING GOES A LONG WAY</div>
          <h2 id="calendar-title">Your month, on a plate.</h2>
          <p>Pick a day. See what’s on the menu.</p>
        </div>
        <span className="outline-badge"><Icon name="calendar" size={15} /> Meal planner</span>
      </div>
      <div className="planner-layout">
        <div className="calendar-card">
          <div className="calendar-toolbar">
            <h3 aria-live="polite">{month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</h3>
            <div className="calendar-controls"><button className="today-button" onClick={goToToday}>Today</button></div>
          </div>
          <div className="calendar-search">
            <input type="search" placeholder="Find a dish — try “paneer”" aria-label="Search this month’s menu by dish name" value={search} disabled={menuStatus !== "ready"} onChange={event => setSearch(event.target.value)} />
          </div>
          <div className="calendar-grid">
            <div className="weekday-row">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => <span key={day}>{day}</span>)}</div>
            <div className="date-grid">{Array.from({ length: cells }, (_, index) => {
              const date = new Date(month.getFullYear(), month.getMonth(), index - firstWeekday + 1);
              if (date.getMonth() !== month.getMonth()) return <span key={dateKey(date)} className="date-cell calendar-spacer" aria-hidden="true" />;
              const selected = dateKey(date) === dateKey(selectedDate);
              const isToday = dateKey(date) === dateKey(today);
              return <button key={dateKey(date)} className={`date-cell ${selected ? "selected" : ""} ${isToday ? "is-today" : ""}`} aria-label={fullDate(date)} aria-pressed={selected} aria-current={isToday ? "date" : undefined} onClick={() => setSelectedDate(date)}><span>{date.getDate()}</span>{isToday && <small>Today</small>}</button>;
            })}</div>
          </div>
          {searchActive && (
            <div className="search-results" aria-live="polite">
              {searchMatches.length === 0
                ? <p className="search-empty">No dish named “{search.trim()}” is on this month’s menu.</p>
                : searchMatches.map(match => {
                  const matchDate = new Date(month.getFullYear(), month.getMonth(), Number(match.row.date));
                  const active = dateKey(matchDate) === dateKey(selectedDate);
                  return (
                    <button key={Number(match.row.date)} className={active ? "active" : ""} onClick={() => setSelectedDate(matchDate)}>
                      <span className="search-day">{matchDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                      <span className="search-meals">{match.meals.join(" · ")}</span>
                      <Icon name="arrow" size={14} />
                    </button>
                  );
                })}
            </div>
          )}
          <div className="calendar-legend">
            <span><i className="legend-selected" />Selected day</span>
            <span><i className="legend-today" />Today</span>
            <span className="calendar-hint">A fresh day. Four good meals.</span>
          </div>
        </div>
        <aside className="selected-menu" aria-live="polite" aria-busy={menuStatus === "loading"}>
          <div className="selected-heading">
            <span className="eyebrow">THE DAY’S LINEUP</span>
            <span className="preview-badge">{menuStatus === "loading" ? "Updating" : menuStatus === "error" ? "Unavailable" : "Saved on this device"}</span>
          </div>
          <h3>{selectedDate.toLocaleDateString("en-IN", { weekday: "long" })}<span>{selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></h3>
          <div className="day-meals">
            {menuStatus === "loading"
              ? <MenuLoader />
              : menuStatus === "error"
                ? <div className="calendar-menu-note"><p>The month menu isn’t available right now.<br />Please try again.</p><button className="retry-menu" onClick={loadMonthMenu}>Try again</button></div>
                : !dayMenu
                  ? <div className="calendar-menu-note"><p>No menu was uploaded for this day.<br />Pick another date or check back after the next menu update.</p></div>
                  : MEALS.map(meal => (
                    <div className={`day-meal ${meal.key}`} key={meal.key}>
                      <span className="meal-icon"><Icon name={meal.icon} /></span>
                      <div>
                        <h4>{meal.label}<span>{meal.time}</span></h4>
                        <p>{dayMenu[meal.key] || "Not on the menu yet."}</p>
                      </div>
                    </div>
                  ))}
          </div>
          {menuStatus === "ready" && <p className="preview-note">Pick any day to see its full day’s meals.</p>}
        </aside>
      </div>
    </section>
  );
}

function Notifications() {
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState("");
  const [subscribed, setSubscribed] = useState(() => Boolean(localStorage.getItem("token")));
  const [busy, setBusy] = useState(false);
  async function subscribe() {
    if (!selected.length) { setStatus("Pick at least one meal to get started."); return; }
    setBusy(true); setStatus("");
    try {
      const result = await Check(selected);
      if (result === "200") { setSubscribed(true); setStatus(""); }
      else { localStorage.removeItem("token"); setStatus(result === "403" ? "Notifications are blocked. Allow them in your browser settings to continue." : "We couldn’t activate notifications. Please try again."); }
    } catch { localStorage.removeItem("token"); setStatus("Something went wrong. Check your connection and try again."); }
    finally { setBusy(false); }
  }
  return <section className="notification-section" id="notifications" aria-labelledby="notification-title"><div className="notification-copy"><div className="eyebrow">A FRIENDLY LITTLE REMINDER</div><h2 id="notification-title">Never miss a good meal.</h2><p>Your menu, delivered right to your browser.<br />Pick the meals you’d like to hear about.</p></div><div className="notification-form">{subscribed ? <div className="subscription-success"><span><Icon name="check" size={28} /></span><h3>You’re on the list.</h3><p>Look out for notifications for your chosen meals.<br />We’ll let you know what’s cooking.</p></div> : <><span className="form-label">MAKE IT YOURS</span><div className="preference-grid">{MEALS.map(meal => <button key={meal.key} disabled={busy} aria-pressed={selected.includes(meal.key)} className={`preference ${selected.includes(meal.key) ? "chosen" : ""}`} onClick={() => setSelected(previous => previous.includes(meal.key) ? previous.filter(key => key !== meal.key) : [...previous, meal.key])}><Icon name={meal.icon} size={19} />{meal.label}<span className="meal-checkmark" aria-hidden="true">{selected.includes(meal.key) && <Icon name="check" size={12} />}</span></button>)}</div><button className="primary-button subscribe-button" disabled={busy} onClick={subscribe}>{busy ? "Activating…" : "Keep me in the loop"}<Icon name="arrow" size={18} /></button><p className="form-status" role="status">{status || "Just meal updates. No noise, we promise."}</p></>}</div></section>;
}
