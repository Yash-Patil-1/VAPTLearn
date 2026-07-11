/**
 * ErrorMessage — styled API error state for when fetch requests fail.
 *
 * Props:
 *   message — custom error message (default: "Failed to load data")
 *   onRetry — callback for retry button (omit to hide retry)
 *   compact — smaller variant for inline use
 */
export default function ErrorMessage({ message, onRetry, compact = false }) {
  const text = message || 'Failed to load data. The server may be unavailable.';

  if (compact) {
    return (
      <div
        style={{
          padding: '1rem',
          border: '1px solid color-mix(in srgb, var(--color-critical) 20%, transparent)',
          backgroundColor: 'color-mix(in srgb, var(--color-critical) 4%, transparent)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <span style={{ color: 'var(--color-critical)', fontSize: '14px', flexShrink: 0 }}>!</span>
        <p style={{ color: 'var(--color-ash-steel)', fontSize: '0.8rem', fontFamily: '"JetBrains Mono", monospace', margin: 0, flex: 1 }}>
          {text}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '0.3rem 0.75rem',
              backgroundColor: 'transparent',
              border: '1px solid color-mix(in srgb, var(--color-venom-green) 30%, transparent)',
              color: 'var(--color-venom-green)',
              fontSize: '0.7rem',
              fontFamily: '"JetBrains Mono", monospace',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '2rem auto',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-forged-panel)',
          border: '1px solid color-mix(in srgb, var(--color-critical) 20%, transparent)',
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
          padding: '2rem',
        }}
      >
        <p
          style={{
            color: 'var(--color-ash-steel)',
            fontSize: '0.85rem',
            fontFamily: '"JetBrains Mono", monospace',
            lineHeight: 1.6,
            marginBottom: onRetry ? '1.5rem' : 0,
          }}
        >
          {text}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: 'var(--color-venom-green)',
              color: 'var(--color-carbon-black)',
              fontWeight: 700,
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer',
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
