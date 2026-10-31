export default function Logo({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <rect x="3" y="4" width="5" height="16" rx="1.5" />
      <rect x="9.5" y="4" width="5" height="10" rx="1.5" opacity="0.7" />
      <rect x="16" y="4" width="5" height="13" rx="1.5" opacity="0.45" />
    </svg>
  );
}
