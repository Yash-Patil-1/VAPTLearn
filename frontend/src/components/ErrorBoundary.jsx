import { Component } from 'react';

/**
 * ErrorBoundary — catches unhandled React render errors and displays
 * a styled fallback UI instead of a white screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <YourComponent />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || 'An unexpected error occurred';

      // Allow custom fallback via props
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            maxWidth: '520px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-forged-panel)',
              border: '1px solid color-mix(in srgb, var(--color-critical) 30%, transparent)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
              padding: '2rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 1rem',
                backgroundColor: 'color-mix(in srgb, var(--color-critical) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-critical) 30%, transparent)',
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: 'var(--color-critical)',
              }}
            >
              !
            </div>
            <h2
              style={{
                color: 'var(--color-ice-white)',
                fontSize: '1.1rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                color: 'var(--color-ash-steel)',
                fontSize: '0.8rem',
                fontFamily: '"JetBrains Mono", monospace',
                marginBottom: '1.5rem',
                lineHeight: 1.5,
              }}
            >
              {errorMsg}
            </p>
            <button
              onClick={this.handleRetry}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
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
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
