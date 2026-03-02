"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useProductDetail } from "@/lib/shopify/useProductDetail";
import { ModalSkeleton } from "./loading-skeleton";

export type QuickViewState =
  | { status: "closed" }
  | { status: "open"; handle: string };

type CtaStatus = "idle" | "loading" | "success";

/** Modal overlay driven by {@link QuickViewState}. */
export const QuickViewModal = ({
  state,
  onClose,
}: {
  readonly state: QuickViewState;
  readonly onClose: () => void;
}) => {
  const handle = state.status === "open" ? state.handle : "";
  const { status, selectedOptions, setOption, resolvedVariant, isOptionValueAvailable, ...rest } =
    useProductDetail(handle);
  const product = "product" in rest ? rest.product : undefined;
  const fetchError = "error" in rest ? rest.error : undefined;

  const [ctaStatus, setCtaStatus] = useState<CtaStatus>("idle");

  // Reset ctaStatus during render when the product session changes.
  // Using "setState during render" avoids an extra post-commit render cycle.
  const ctaKey = `${state.status}-${handle}`;
  const [prevCtaKey, setPrevCtaKey] = useState(ctaKey);
  if (prevCtaKey !== ctaKey) {
    setPrevCtaKey(ctaKey);
    setCtaStatus("idle");
  }

  const ctaTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (state.status === "open") {
      previousFocusRef.current = document.activeElement;
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    } else {
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
      previousFocusRef.current = null;
    }
  }, [state.status]);

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

  // Cancel any in-flight timer when the product session changes.
  useEffect(() => {
    if (ctaTimerRef.current !== undefined) {
      clearTimeout(ctaTimerRef.current);
      ctaTimerRef.current = undefined;
    }
  }, [state.status, handle]);

  const handleAddToBag = (): void => {
    if (ctaTimerRef.current !== undefined) {
      clearTimeout(ctaTimerRef.current);
    }
    setCtaStatus("loading");
    ctaTimerRef.current = setTimeout(() => {
      setCtaStatus("success");
      ctaTimerRef.current = setTimeout(() => {
        setCtaStatus("idle");
      }, 1500);
    }, Math.random() * 400 + 800);
  };

  const formattedPrice = (() => {
    const money = resolvedVariant?.price ?? product?.priceRange.minVariantPrice;
    if (!money) return null;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: money.currencyCode,
    }).format(parseFloat(money.amount));
  })();

  const displayImage = resolvedVariant?.image ?? product?.featuredImage ?? null;
  const imageKey = displayImage?.url ?? "placeholder";

  const isCtaDisabled =
    ctaStatus !== "idle" ||
    resolvedVariant === undefined ||
    !resolvedVariant.availableForSale;

  const ctaLabel = (() => {
    if (resolvedVariant === undefined) return "Select options";
    if (!resolvedVariant.availableForSale) return "Out of Stock";
    return "Add to Bag";
  })();

  return (
    <AnimatePresence>
      {state.status === "open" && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div
              className="relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeButtonRef}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors text-lg leading-none"
                onClick={onClose}
                aria-label="Close quick view"
              >
                ×
              </button>

              {status === "loading" && <ModalSkeleton />}

              {status === "error" && (
                <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                  <p>Failed to load product: {fetchError?.message}</p>
                </div>
              )}

              {status === "success" && product !== undefined && (
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Left column: media */}
                  <div className="aspect-[3/4] md:aspect-auto md:h-full relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {displayImage ? (
                        <motion.div
                          key={imageKey}
                          className="absolute inset-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <Image
                            src={displayImage.url}
                            alt={displayImage.altText ?? product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="placeholder"
                          className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right column: content */}
                  <div className="p-6 md:p-8 flex flex-col gap-4 overflow-y-auto">
                    <div>
                      <h2 className="font-semibold text-lg leading-tight">
                        {product.title}
                      </h2>
                      {formattedPrice !== null && (
                        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                          {formattedPrice}
                        </p>
                      )}
                    </div>

                    {product.options.map((option) => (
                      <div key={option.name}>
                        <p className="text-sm font-medium mb-2">{option.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value) => {
                            const isSelected = selectedOptions[option.name] === value;
                            const isAvailable = isOptionValueAvailable(option.name, value);
                            return (
                              <button
                                key={value}
                                onClick={() => setOption(option.name, value)}
                                disabled={!isAvailable}
                                className={[
                                  "relative px-3 py-1.5 text-sm rounded-full border transition-colors",
                                  isSelected
                                    ? "border-neutral-900 dark:border-white"
                                    : isAvailable
                                      ? "border-neutral-300 dark:border-neutral-600 hover:border-neutral-900 dark:hover:border-white"
                                      : "opacity-40 cursor-not-allowed line-through border-neutral-300 dark:border-neutral-600",
                                ].join(" ")}
                              >
                                {isSelected && (
                                  <motion.span
                                    layoutId={`pill-bg-${option.name}`}
                                    className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
                                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                  />
                                )}
                                <span
                                  className={[
                                    "relative z-10",
                                    isSelected ? "text-white dark:text-neutral-900" : "",
                                  ].join(" ")}
                                >
                                  {value}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <motion.button
                      className="mt-auto w-full py-3 text-sm font-medium rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden"
                      onClick={handleAddToBag}
                      disabled={isCtaDisabled}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <AnimatePresence mode="wait">
                        {ctaStatus === "loading" && (
                          <motion.span
                            key="loading"
                            className="flex items-center justify-center"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                          >
                            <span className="w-4 h-4 border-2 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin" />
                          </motion.span>
                        )}
                        {ctaStatus === "success" && (
                          <motion.span
                            key="success"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                          >
                            ✓ Added
                          </motion.span>
                        )}
                        {ctaStatus === "idle" && (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                          >
                            {ctaLabel}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
