export const AUTH_STORAGE_KEY = "notify-auth";

export function parseSession(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(payload), character => character.charCodeAt(0));
    const { name, exp } = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof name !== "string" || !Number.isFinite(exp) || exp * 1000 <= Date.now()) return null;
    return { name, token, expiresAt: exp * 1000 };
  } catch { return null; }
}

export function readSession() {
  try {
    const session = parseSession(localStorage.getItem(AUTH_STORAGE_KEY));
    if (!session) localStorage.removeItem(AUTH_STORAGE_KEY);
    return session;
  } catch { return null; }
}

export async function authenticate(mode, name, password, signal) {
  const base = import.meta.env.VITE_API2?.replace(/\/+$/, "");
  if (!base) throw new Error("Account access is not configured. Please try again later.");
  let response;
  try {
    response = await fetch(`${base}/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Couldn’t reach the server. Check your connection and try again.");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const fallback = response.status === 409 ? "That username is already taken." :
      [400, 401, 404].includes(response.status) ? "Check your username and password and try again." :
        "Account access is temporarily unavailable. Please try again.";
    throw new Error(data?.msg || fallback);
  }
  const session = parseSession(data?.token);
  if (!session) throw new Error("The server returned an invalid session. Please try again.");
  return session;
}
