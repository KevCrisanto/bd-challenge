import { ProductGridSkeleton } from "./components/loading-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen px-4 py-12 md:px-8 max-w-screen-xl mx-auto">
      {[0, 1].map((i) => (
        <div key={i} className="mb-16">
          <div className="h-10 w-32 mb-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded" />
          <ProductGridSkeleton />
        </div>
      ))}
    </div>
  );
}
