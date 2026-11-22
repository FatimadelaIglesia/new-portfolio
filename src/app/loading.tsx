export default function Loading() {
  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-6 py-20"
    >
      <div role="status" className="flex flex-col items-center gap-4">
        <span
          aria-hidden="true"
          className="size-10 animate-spin rounded-full border-4 border-primary/25 border-t-primary motion-reduce:animate-none"
        />
        <span className="text-sm text-text-muted">Loading...</span>
      </div>
    </main>
  );
}
