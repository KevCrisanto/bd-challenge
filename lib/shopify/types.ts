export interface ShopifyImage {
  readonly url: string;
  readonly altText: string | null;
  readonly width: number | null;
  readonly height: number | null;
}

export interface ShopifyMoney {
  readonly amount: string;
  readonly currencyCode: string;
}

export interface ShopifyPriceRange {
  readonly minVariantPrice: ShopifyMoney;
}

export interface ShopifyProduct {
  readonly id: string;
  readonly title: string;
  readonly handle: string;
  readonly featuredImage: ShopifyImage | null;
  readonly priceRange: ShopifyPriceRange;
}

export interface ShopifyCollection {
  readonly title: string;
  readonly products: readonly ShopifyProduct[];
}
