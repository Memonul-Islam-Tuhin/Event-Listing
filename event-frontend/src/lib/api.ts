import { EventItem, NewEvent } from "@/types/event";
import { AuthResponse } from "@/types/auth";

const API = process.env.NEXT_PUBLIC_API_URL;

function url(path: string) {
  if (!API) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is missing. Add it to .env.local and restart npm run dev.",
    );
  }
  return `${API}${path}`;
}

async function request(path: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url(path), {
      cache: "no-store",
      ...init,
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = Array.isArray(data.message) ? data.message[0] : data.message;
      throw new Error(msg || `Request failed (${res.status})`);
    }
    return data;
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error(
        "The server took too long to respond. Is the backend running?",
      );
    }
    if (e instanceof TypeError) {
      throw new Error(
        "Cannot reach the server. Check that the backend is running and NEXT_PUBLIC_API_URL is correct.",
      );
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

const json = { "Content-Type": "application/json" };

export function getEvents(category?: string): Promise<EventItem[]> {
  return request(category ? `/events?category=${category}` : "/events");
}

export function getEvent(id: string): Promise<EventItem> {
  return request(`/events/${id}`);
}

export function createEvent(data: NewEvent, token: string): Promise<EventItem> {
  return request("/events", {
    method: "POST",
    headers: { ...json, Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function registerUser(body: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request("/auth/register", {
    method: "POST",
    headers: json,
    body: JSON.stringify(body),
  });
}

export function loginUser(body: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request("/auth/login", {
    method: "POST",
    headers: json,
    body: JSON.stringify(body),
  });
}
