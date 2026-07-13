import { APPLICATION_STATUS, EMPTY_APPLICATION } from '../utils/applicationFields';

const STORAGE_KEY = 'blue-passport-applications';
const CHECKOUT_KEY = 'blue-passport-checkout-app';
const NOTIFIED_KEY = 'blue-passport-notified';

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(applications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

export function createApplicationId() {
  return crypto.randomUUID();
}

export function createApplication(formData) {
  const id = createApplicationId();
  const now = new Date().toISOString();
  const application = {
    id,
    ...EMPTY_APPLICATION,
    ...formData,
    status: APPLICATION_STATUS.DRAFT,
    createdAt: now,
    updatedAt: now,
  };

  const all = readAll();
  all[id] = application;
  writeAll(all);
  return application;
}

export function getApplication(id) {
  if (!id) return null;
  return readAll()[id] ?? null;
}

export function updateApplication(id, updates) {
  const all = readAll();
  const current = all[id];
  if (!current) return null;

  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  all[id] = updated;
  writeAll(all);
  return updated;
}

export function setCheckoutApplicationId(id) {
  sessionStorage.setItem(CHECKOUT_KEY, id);
}

export function getCheckoutApplicationId() {
  return sessionStorage.getItem(CHECKOUT_KEY);
}

export function clearCheckoutApplicationId() {
  sessionStorage.removeItem(CHECKOUT_KEY);
}

export function wasAdminNotified(id) {
  return sessionStorage.getItem(`${NOTIFIED_KEY}:${id}`) === '1';
}

export function markAdminNotified(id) {
  sessionStorage.setItem(`${NOTIFIED_KEY}:${id}`, '1');
}
