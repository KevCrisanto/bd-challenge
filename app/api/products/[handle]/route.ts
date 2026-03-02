import { getProductByHandle } from '@/lib/shopify/graphql/query';
import { client } from '@/lib/shopify/serverClient';
import type { ShopifyProductDetail } from '@/lib/shopify/types';
import { NextResponse } from 'next/server';

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ handle: string }> },
): Promise<NextResponse> => {
  const { handle } = await params;

  const { data } = await client.request(getProductByHandle, {
    variables: { handle },
  });

  const raw = data?.productByHandle;

  if (!raw) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const product: ShopifyProductDetail = {
    id: raw.id,
    title: raw.title,
    handle: raw.handle,
    featuredImage: raw.featuredImage ?? null,
    priceRange: raw.priceRange,
    descriptionHtml: raw.descriptionHtml,
    images: raw.images.edges.map(
      ({ node }: { node: (typeof raw.images.edges)[number]['node'] }) => node,
    ),
    options: raw.options,
    variants: raw.variants.edges.map(
      ({ node }: { node: (typeof raw.variants.edges)[number]['node'] }) => ({
        id: node.id,
        availableForSale: node.availableForSale,
        selectedOptions: node.selectedOptions,
        price: node.price,
        image: node.image ?? null,
      }),
    ),
  };

  return NextResponse.json({ product });
};
