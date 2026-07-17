const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || data.error || `API request failed (${response.status})`,
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export function createCheckoutSession(payload) {
  return apiFetch('/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getCheckoutSession(sessionId) {
  return apiFetch(`/checkout-session/${sessionId}`);
}

export function getApplication(applicationId) {
  return apiFetch(`/applications/${applicationId}`);
}

export function submitProfile(applicationId, profile) {
  return apiFetch(`/applications/${applicationId}/profile`, {
    method: 'POST',
    body: JSON.stringify(profile),
  });
}

export function publishDirectoristDraft(applicationId) {
  return apiFetch(`/applications/${applicationId}/publish-draft`, {
    method: 'POST',
  });
}

export function submitContact(payload) {
  return apiFetch('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
