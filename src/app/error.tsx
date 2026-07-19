'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="boot-error">
      <h1>Something went wrong</h1>
      <p>{error.message || 'An unexpected error occurred while rendering this view.'}</p>
      {error.digest && <p className="mono muted-txt">ref: {error.digest}</p>}
      <button className="btn primary" onClick={() => reset()}>
        Retry
      </button>
    </div>
  );
}
