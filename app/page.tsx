import { client } from "@/lib/shopify/serverClient";
import { getAllCollections } from "@/lib/shopify/graphql/query";
import type { ShopifyCollection, ShopifyProduct } from "@/lib/shopify/types";
import { CollectionView } from "./components/collection-view";

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

  return <CollectionView collections={collections} />;
}
