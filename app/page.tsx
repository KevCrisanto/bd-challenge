import { client } from "@/lib/shopify/serverClient";
import { getAllCollections } from "@/lib/shopify/graphql/query";
import { ProductGrid } from "./components/product-grid";
import type { ShopifyCollection, ShopifyProduct } from "@/lib/shopify/types";

export default async function Home() {
  "use cache";
  const resp = await client.request(getAllCollections);

  const collections: readonly ShopifyCollection[] =
    resp.data?.collections.edges.map((edge) => ({
      title: edge.node.title,
      products: edge.node.products.edges.map((productEdge): ShopifyProduct => {
        const img = productEdge.node.featuredImage;
        return {
          id: productEdge.node.id,
          title: productEdge.node.title,
          handle: productEdge.node.handle,
          priceRange: productEdge.node.priceRange,
          featuredImage: img
            ? {
                url: img.url,
                altText: img.altText ?? null,
                width: img.width ?? null,
                height: img.height ?? null,
              }
            : null,
        };
      }),
    })) ?? [];

  return (
    <div className="min-h-screen px-4 py-12 md:px-8 max-w-screen-xl mx-auto">
      <main>
        {collections.map((collection) => (
          <section key={collection.title} className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-8">
              {collection.title}
            </h2>
            <ProductGrid products={collection.products} />
          </section>
        ))}
      </main>
    </div>
  );
}
