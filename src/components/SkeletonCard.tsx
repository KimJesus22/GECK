export default function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex flex-col border border-phosphor/10 bg-terminal-900 p-6 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="h-12 w-12 shrink-0 border border-phosphor/10 bg-terminal-800" />
        <div className="h-5 w-24 border border-phosphor/10 bg-terminal-800" />
      </div>
      
      <div className="mb-2 h-5 w-3/4 bg-terminal-800" />
      <div className="mb-6 h-4 w-full bg-terminal-800/60" />
      
      <div className="flex-1" />
      
      <div className="mt-auto flex items-center justify-between border-t border-phosphor/10 pt-4">
        <div className="h-3 w-20 bg-terminal-800" />
        <div className="h-7 w-16 border border-purple-accent/10 bg-purple-accent/5" />
      </div>
    </div>
  );
}
