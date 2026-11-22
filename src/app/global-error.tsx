"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          background: "#F9F2FD",
          color: "#52144A",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <main>
          <h1 style={{ fontSize: "2rem", margin: "0 0 12px" }}>Something went wrong</h1>
          <p style={{ margin: "0 0 24px" }}>
            The site hit an unexpected error. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#15803D",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "999px",
              padding: "10px 24px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
