import { type ChatSession } from "@/components/chat/types";

export const CHAT_SESSIONS_KEY = "agriverse.chat.sessions.v1";
export const ACTIVE_CHAT_KEY = "agriverse.chat.active.v1";
export const DEMO_PASSWORD_KEY = "agriverse.demo.password.v1";
export const DEMO_UNLOCKED_KEY = "agriverse.demo.unlocked.v1";

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredPassword(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(DEMO_PASSWORD_KEY) ?? "";
}

export function setStoredPassword(value: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEMO_PASSWORD_KEY, value);
}

export function getUnlockedState(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(DEMO_UNLOCKED_KEY) === "true";
}

export function setUnlockedState(value: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEMO_UNLOCKED_KEY, String(value));
}

export function readStoredSessions(): ChatSession[] {
  return readJson<ChatSession[]>(CHAT_SESSIONS_KEY, []);
}

export function writeStoredSessions(sessions: ChatSession[]) {
  writeJson(CHAT_SESSIONS_KEY, sessions);
}

export function readActiveSessionId(): string {
  return readJson<string>(ACTIVE_CHAT_KEY, "");
}

export function writeActiveSessionId(id: string) {
  writeJson(ACTIVE_CHAT_KEY, id);
}
