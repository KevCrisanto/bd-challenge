"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { ProductCard } from "./product-card";
import type { QuickViewState } from "./quick-view-modal";
import { QuickViewModal } from "./quick-view-modal";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/**
 * Renders a responsive grid of {@link ProductCard} components.
 */
export const ProductGrid = ({
  products,
}: {
  readonly products: readonly ShopifyProduct[];
}) => {
  const [quickView, setQuickView] = useState<QuickViewState>({
    status: "closed",
  });

  if (products.length === 0) {
    return (
      <section>
        <p className="text-neutral-500 dark:text-neutral-400 text-center py-16">
          No products found in this collection.
        </p>
      </section>
    );
  }

  return (
    <section>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            transition={{ type: "tween", duration: 0.3 }}
            className="h-full"
          >
            <ProductCard
              product={product}
              onQuickView={() => setQuickView({ status: "open", product })}
            />
          </motion.div>
        ))}
      </motion.div>
      <QuickViewModal
        state={quickView}
        onClose={() => setQuickView({ status: "closed" })}
      />
    </section>
  );
};
