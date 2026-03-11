export default function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex flex-col rounded-xl border border-surface-600/20 bg-surface-900 p-6 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="h-11 w-11 shrink-0 rounded-lg bg-surface-800" />
        <div className="h-5 w-24 rounded-md bg-surface-800" />
      </div>
      
      <div className="mb-2 h-5 w-3/4 rounded bg-surface-800" />
      <div className="mb-6 h-4 w-full rounded bg-surface-800/60" />
      
      <div className="flex-1" />
      
      <div className="mt-auto flex items-center justify-between border-t border-surface-600/20 pt-4">
        <div className="h-3 w-20 rounded bg-surface-800" />
        <div className="h-7 w-16 rounded-lg bg-indigo/5" />
      </div>
    </div>
  );
}
