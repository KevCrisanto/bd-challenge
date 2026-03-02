"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { ShopifyProduct } from "@/lib/shopify/types";

export type QuickViewState =
  | { status: "closed" }
  | { status: "open"; product: ShopifyProduct };

/** Modal overlay driven by {@link QuickViewState}. */
export const QuickViewModal = ({
  state,
  onClose,
}: {
  readonly state: QuickViewState;
  readonly onClose: () => void;
}) => {
  useEffect(() => {
    if (state.status !== "open") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [state.status, onClose]);

  useEffect(() => {
    document.body.style.overflow = state.status === "open" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.status]);

  return (
    <AnimatePresence>
      {state.status === "open" && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div
              className="relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden max-w-md w-full shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors text-lg leading-none"
                onClick={onClose}
                aria-label="Close quick view"
              >
                ×
              </button>
              <div className="aspect-[3/4] relative">
                {state.product.featuredImage ? (
                  <Image
                    src={state.product.featuredImage.url}
                    alt={
                      state.product.featuredImage.altText ?? state.product.title
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, 448px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800" />
                )}
              </div>
              <div className="p-6">
                <h2 className="font-semibold text-lg leading-tight">
                  {state.product.title}
                </h2>
                <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency:
                      state.product.priceRange.minVariantPrice.currencyCode,
                  }).format(
                    parseFloat(
                      state.product.priceRange.minVariantPrice.amount
                    )
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
