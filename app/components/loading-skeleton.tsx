/**
 * Skeleton placeholder that mirrors the {@link ProductGrid} layout.
 */
export const ProductGridSkeleton = () => {
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden">
            <div className="aspect-[3/4] animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            <div className="p-4 flex flex-col gap-2">
              <div className="h-4 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
              <div className="h-3 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
