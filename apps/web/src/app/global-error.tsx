'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '1rem',
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Critical Error</h1>
          <p style={{ color: '#71717a', marginBottom: '2rem', textAlign: 'center' }}>
            A critical error has occurred. Please refresh the page.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Refresh Page
          </button>
        </div>
      </body>
    </html>
  );
}
