export function RecipeCardSkeleton() {
  return (
    <div className="w-full bg-white/5 rounded-2xl overflow-hidden border border-white/8 animate-pulse">
      {/* Thumbnail */}
      <div className="aspect-[10/9] bg-white/8" />

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-white/8 rounded-full" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/8 rounded-full" />
          <div className="h-3 w-3/4 bg-white/8 rounded-full" />
        </div>
        <div className="flex justify-between items-center pt-1">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-white/8 rounded-full" />
            ))}
          </div>
          <div className="h-3 w-12 bg-white/8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
