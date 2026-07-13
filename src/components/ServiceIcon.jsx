const icons = {
  certification: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M8 14l-2 7 6-3 6 3-2-7" strokeLinejoin="round" />
    </svg>
  ),
  connection: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="7" r="3" />
      <path d="M4 20c0-2.8 2.2-5 5-5s5 2.2 5 5M14 20c0-2.2 1.8-4 4-4" strokeLinecap="round" />
    </svg>
  ),
  legal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M12 3v18M7 8h10M8 21h8" strokeLinecap="round" />
      <path d="M5 8l7-5 7 5" strokeLinejoin="round" />
    </svg>
  ),
  training: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M3 9l9-5 9 5-9 5-9-5z" strokeLinejoin="round" />
      <path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" strokeLinecap="round" />
      <path d="M21 10v5" strokeLinecap="round" />
    </svg>
  ),
};

export default function ServiceIcon({ name }) {
  return icons[name] ?? null;
}
