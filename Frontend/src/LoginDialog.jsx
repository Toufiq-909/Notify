import { useEffect, useRef, useState } from "react";
import { authenticate, AUTH_STORAGE_KEY, readSession } from "../ApiCall/auth";
import "./LoginDialog.css";

export default function LoginDialog() {
  const dialogRef = useRef(null);
  const [mode, setMode] = useState("login");
  const isSignup = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [session, setSession] = useState(readSession);
  const [busy, setBusy] = useState(false);
  const requestRef = useRef(null);

  function logout() {
    try { localStorage.removeItem(AUTH_STORAGE_KEY); } catch { /* Storage may be unavailable. */ }
    setSession(null);
  }

  useEffect(() => {
    if (!session) return;
    const expire = () => { if (Date.now() >= session.expiresAt) logout(); };
    const timer = setTimeout(expire, Math.max(0, session.expiresAt - Date.now()));
    window.addEventListener("focus", expire);
    return () => { clearTimeout(timer); window.removeEventListener("focus", expire); };
  }, [session]);

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    const syncSession = event => {
      if (event.storageArea === localStorage && (event.key === AUTH_STORAGE_KEY || event.key === null)) {
        setSession(readSession());
      }
    };
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (requestRef.current) return;
    const form = event.currentTarget;
    const name = form.elements.username.value.trim();
    const password = form.elements.password.value;
    if (name.length < 4 || password.length < 4) {
      setNotice("Username and password must each contain at least 4 characters.");
      return;
    }
    if (isSignup && form.elements.password.value !== form.elements.confirmPassword.value) {
      setNotice("Passwords don’t match. Please try again.");
      form.elements.confirmPassword.focus();
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setBusy(true);
    setNotice("");
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const nextSession = await authenticate(mode, name, password, controller.signal);
      if (controller.signal.aborted) return;
      try { localStorage.setItem(AUTH_STORAGE_KEY, nextSession.token); } catch { /* Session still works in memory. */ }
      setSession(nextSession);
      dialogRef.current.close();
    } catch (error) {
      if (requestRef.current === controller) setNotice(error.name === "AbortError" ? "The request timed out. Please try again." : error.message);
    } finally {
      clearTimeout(timeout);
      if (requestRef.current === controller) { requestRef.current = null; setBusy(false); }
    }
  }

  function resetForm() {
    requestRef.current?.abort();
    requestRef.current = null;
    setBusy(false);
    dialogRef.current.querySelector("form").reset();
    setShowPassword(false);
    setNotice("");
  }

  function changeMode(nextMode) {
    resetForm();
    setMode(nextMode);
  }

  return (
    <>
      {session ? <div className="login-account">
        <span className="login-account-name" role="status" title={session.name}>Hi, {session.name}</span>
        <button className="login-trigger" type="button" onClick={logout}>Log out</button>
      </div> : <button className="login-trigger" type="button" aria-haspopup="dialog" onClick={() => dialogRef.current.showModal()}>
        Log in
      </button>}
      <dialog ref={dialogRef} className="login-dialog" aria-labelledby="login-title" aria-describedby="login-description" onClose={() => changeMode("login")}>
        <div className="login-topline">
          <span className="eyebrow">YOUR NOTIFY ACCOUNT</span>
          <button className="login-close" type="button" aria-label="Close account dialog" onClick={() => dialogRef.current.close()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="login-modes" role="group" aria-label="Account access">
          <button type="button" disabled={busy} aria-pressed={!isSignup} onClick={() => changeMode("login")}>Log in</button>
          <button type="button" disabled={busy} aria-pressed={isSignup} onClick={() => changeMode("signup")}>Sign up</button>
        </div>
        <h2 id="login-title">{isSignup ? "Create your account." : "Welcome back."}</h2>
        <p id="login-description">{isSignup ? "Choose a username and password to get started." : "Log in to your Notify account."}</p>
        <form key={mode} className="login-form" aria-busy={busy} onSubmit={handleSubmit} onInput={() => setNotice("")}>
          <fieldset className="login-fields" disabled={busy}>
          <div className="login-field">
            <label htmlFor="login-username">Username</label>
            <input id="login-username" name="username" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder={isSignup ? "Choose a username" : "Enter your username"} required />
          </div>
          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <div className="login-password-wrap">
              <input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete={isSignup ? "new-password" : "current-password"} placeholder={isSignup ? "Create a password" : "Enter your password"} required />
              <button className="login-password-toggle" type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-controls="login-password" onClick={() => setShowPassword(value => !value)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {isSignup && <div className="login-field">
            <label htmlFor="login-confirm-password">Confirm password</label>
            <input id="login-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Re-enter your password" required />
          </div>}
          <button className="login-submit" type="submit" disabled={busy}>{busy ? (isSignup ? "Creating account…" : "Logging in…") : (isSignup ? "Create account" : "Log in")} <span aria-hidden="true">→</span></button>
          </fieldset>
          <p className="login-status" role="status">{notice}</p>
        </form>
        <button className="login-back" type="button" onClick={() => dialogRef.current.close()}>Back to the menu</button>
      </dialog>
    </>
  );
}
