const AUTH_KEY = "smart-parking:admin-session";

export function isLoggedIn(): boolean {
  return typeof window !== "undefined" && window.localStorage.getItem(AUTH_KEY) === "true";
}

export function login(email: string, password: string): boolean {
  if (email.trim().toLowerCase() !== "admin@parking.com" || password !== "admin123") return false;
  window.localStorage.setItem(AUTH_KEY, "true");
  return true;
}

export function logout(): void {
  window.localStorage.removeItem(AUTH_KEY);
}
