"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { ShopifyProduct } from "@/lib/shopify/types";

/**
 * Displays a single product with its image, title, and price.
 */
export const ProductCard = ({
  product,
  onQuickView,
}: {
  readonly product: ShopifyProduct;
  readonly onQuickView: () => void;
}) => {
  const formattedPrice = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: product.priceRange.minVariantPrice.currencyCode,
  }).format(parseFloat(product.priceRange.minVariantPrice.amount));

  return (
    <motion.article
      className="relative group overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-900 cursor-pointer h-full flex flex-col"
      initial="rest"
      animate="rest"
      whileHover="hovered"
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        {product.featuredImage ? (
          <>
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800" />
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-1">
        <h2 className="font-semibold text-sm leading-tight line-clamp-2">
          {product.title}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {formattedPrice}
        </p>
        <button
            className="mt-auto w-full py-1.5 text-sm font-medium rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
          >
            Quick View
          </button>
      </div>
    </motion.article>
  );
};
