"use client";

const criticalCss = `
  html { color-scheme: dark; }
  body {
    margin: 0;
    background: #070b14;
    color: #e8ecf4;
    font-family: system-ui, sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  main { max-width: 28rem; text-align: center; }
  h2 { margin: 0 0 0.75rem; font-size: 1.25rem; }
  p { margin: 0 0 1.5rem; color: #94a3b8; font-size: 0.875rem; line-height: 1.5; }
  button, a {
    display: inline-block;
    margin: 0.25rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    text-decoration: none;
  }
  button {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border: none;
  }
  button:last-of-type {
    background: transparent;
    color: #a5b4fc;
    border: 1px solid rgba(148,163,184,0.3);
  }
`;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isStaleChunk =
    error.message?.includes("Cannot find module") ||
    error.message?.includes("Loading chunk");

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      </head>
      <body>
        <main>
          <h2>Something went wrong</h2>
          <p>
            {isStaleChunk
              ? "Dev cache is stale. Stop the server, run npm run dev:fresh, then reload."
              : "Please try again or return to the dashboard."}
          </p>
          <button type="button" onClick={() => reset()}>
            Try again
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Dashboard
          </button>
        </main>
      </body>
    </html>
  );
}
