/**
 * Skeleton placeholder that mirrors the two-column {@link QuickViewModal} layout.
 */
export const ModalSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
      <div className="aspect-[3/4] md:aspect-auto md:h-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
      <div className="p-6 md:p-8 flex flex-col gap-4">
        <div className="h-6 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
        <div className="h-5 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
        <div className="flex flex-col gap-3">
          <div className="h-4 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
          <div className="flex gap-2">
            <div className="h-9 w-16 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-full" />
            <div className="h-9 w-16 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-full" />
            <div className="h-9 w-16 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <div className="h-4 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
          <div className="flex gap-2">
            <div className="h-9 w-20 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-full" />
            <div className="h-9 w-20 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-full" />
          </div>
        </div>
        <div className="mt-auto h-12 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      </div>
    </div>
  );
};

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
