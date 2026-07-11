/**
 * SkeletonLoader — pulse-animated loading placeholders matching the Lamborghini identity.
 *
 * Usage:
 *   <SkeletonLoader variant="card" count={4} />
 *   <SkeletonLoader variant="stat" count={4} />
 *   <SkeletonLoader variant="list" count={8} />
 *   <SkeletonLoader variant="text" lines={4} />
 *   <SkeletonLoader variant="lesson" count={7} />
 */
const baseStyle = {
  backgroundColor: 'color-mix(in srgb, var(--color-ash-steel) 8%, transparent)',
  animation: 'skeleton-pulse 1.8s ease-in-out infinite',
};

// ===== CARD SKELETON =====
function SkeletonCard() {
  return (
    <div
      style={{
        ...baseStyle,
        height: '80px',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
      }}
    />
  );
}

// ===== STAT CARD SKELETON =====
function SkeletonStat() {
  return (
    <div
      style={{
        ...baseStyle,
        height: '100px',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      <div style={{ ...baseStyle, width: '24px', height: '20px', borderRadius: '0' }} />
      <div style={{ ...baseStyle, width: '40px', height: '18px' }} />
      <div style={{ ...baseStyle, width: '64px', height: '10px' }} />
    </div>
  );
}

// ===== LIST ITEM SKELETON =====
function SkeletonListItem() {
  return (
    <div
      style={{
        ...baseStyle,
        height: '64px',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '12px',
      }}
    >
      <div style={{ ...baseStyle, width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ ...baseStyle, width: '55%', height: '12px' }} />
        <div style={{ ...baseStyle, width: '35%', height: '10px' }} />
      </div>
      <div style={{ ...baseStyle, width: '60px', height: '18px', flexShrink: 0 }} />
    </div>
  );
}

// ===== LESSON CARD SKELETON (larger, with left number badge) =====
function SkeletonLessonCard() {
  return (
    <div
      style={{
        ...baseStyle,
        height: '84px',
        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '16px',
      }}
    >
      <div
        style={{
          ...baseStyle,
          width: '40px',
          height: '40px',
          flexShrink: 0,
          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)',
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ ...baseStyle, width: '60%', height: '14px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ ...baseStyle, width: '80px', height: '18px' }} />
          <div style={{ ...baseStyle, width: '100px', height: '18px' }} />
        </div>
      </div>
    </div>
  );
}

// ===== TEXT LINES SKELETON =====
function SkeletonText({ lines = 3 }) {
  const widths = ['100%', '85%', '70%', '90%', '60%', '75%', '95%', '50%'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ ...baseStyle, width: widths[i % widths.length], height: '12px' }} />
      ))}
    </div>
  );
}

// ===== STREAK CARD SKELETON =====
function SkeletonStreak() {
  return (
    <div
      style={{
        ...baseStyle,
        width: '140px',
        height: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      <div style={{ ...baseStyle, width: '24px', height: '20px' }} />
      <div style={{ ...baseStyle, width: '60px', height: '16px' }} />
      <div style={{ ...baseStyle, width: '80px', height: '8px' }} />
    </div>
  );
}

// ===== MAIN EXPORT =====
export default function SkeletonLoader({ variant = 'card', count = 1, lines = 3, className = '' }) {
  const items = Array.from({ length: count });

  const renderItem = () => {
    switch (variant) {
      case 'stat':
        return <SkeletonStat />;
      case 'list':
        return <SkeletonListItem />;
      case 'lesson':
        return <SkeletonLessonCard />;
      case 'text':
        return <SkeletonText lines={lines} />;
      case 'streak':
        return <SkeletonStreak />;
      case 'card':
      default:
        return <SkeletonCard />;
    }
  };

  return (
    <>
      <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {variant === 'text' && count > 1
          ? Array.from({ length: count }).map((_, i) => <SkeletonText key={i} lines={lines} />)
          : items.map((_, i) => <div key={i}>{renderItem()}</div>)
        }
      </div>
    </>
  );
}
