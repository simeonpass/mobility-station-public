export default function Loading() {
  return (
    <div className="container-site py-16" aria-hidden>
      <div className="h-8 w-48 animate-pulse rounded bg-soft" />
      <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-soft" />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-2xl bg-soft" />
        ))}
      </div>
    </div>
  );
}
