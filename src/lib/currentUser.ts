export type PublicUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  google_email?: string;
  isAdmin: boolean;
};

let cached: Promise<PublicUser | null> | null = null;

// One request per page load, shared by every part of the header that needs it.
export function loadCurrentUser(): Promise<PublicUser | null> {
  if (!cached) {
    cached = fetch("/api/me")
      .then((response) => response.json())
      .then((json) => (json.user as PublicUser | null) ?? null)
      .catch(() => null);
  }
  return cached;
}

export function resetCurrentUser() {
  cached = null;
}
