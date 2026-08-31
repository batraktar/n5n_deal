"use client";

type DataErrorStateProps = Readonly<{
  reset: () => void;
}>;

export function DataErrorState({ reset }: DataErrorStateProps) {
  return (
    <main className="data-error container">
      <p className="eyebrow">Marketplace unavailable</p>
      <h1>We could not load opportunities right now.</h1>
      <p>Please check the database connection and try again.</p>
      <button onClick={reset} type="button">
        Try again
      </button>
    </main>
  );
}
