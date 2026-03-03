"use client";

import { motion } from "motion/react";
import type { ShopifyCollection } from "@/lib/shopify/types";

type CollectionFilterProps = {
  collections: readonly ShopifyCollection[];
  activeFilter: string;
  onFilterChange: (title: string) => void;
};

export function CollectionFilter({
  collections,
  activeFilter,
  onFilterChange,
}: CollectionFilterProps) {
  const labels = [
    "All",
    ...[...collections]
      .filter((c) => c.title !== "All")
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((c) => c.title),
  ];

  return (
    <nav aria-label="Filter by collection">
      <div className="flex gap-2 overflow-x-auto scroll-smooth pb-2 px-1 [&::-webkit-scrollbar]:hidden">
        {labels.map((label) => {
          const isActive = label === activeFilter;
          return (
            <button
              key={label}
              onClick={() => onFilterChange(label)}
              aria-pressed={isActive}
              className={[
                "relative flex-shrink-0 px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer outline-none",
                "border border-neutral-200 dark:border-neutral-700",
                "focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white",
              ].join(" ")}
            >
              {isActive && (
                <motion.span
                  layoutId="collection-filter-active-pill"
                  className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span
                className={[
                  "relative z-10",
                  isActive
                    ? "text-white dark:text-neutral-900"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors",
                ].join(" ")}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
