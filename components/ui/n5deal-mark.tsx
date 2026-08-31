type N5DealMarkProps = Readonly<{
  compact?: boolean;
}>;

export function N5DealMark({ compact = false }: N5DealMarkProps) {
  return (
    <span aria-label="N5Deal" className="brand-mark">
      <svg aria-hidden="true" className="brand-symbol" viewBox="0 0 32 32">
        <path d="M6 24V8l10 11V8l10 16" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
      {!compact ? <span>N5Deal</span> : null}
    </span>
  );
}
