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

export interface ShopifyProductOption {
  readonly name: string;
  readonly values: readonly string[];
}

export interface ShopifyProductVariant {
  readonly id: string;
  readonly availableForSale: boolean;
  readonly selectedOptions: readonly { readonly name: string; readonly value: string }[];
  readonly price: ShopifyMoney;
  readonly image: ShopifyImage | null;
}

export interface ShopifyProductDetail extends ShopifyProduct {
  readonly descriptionHtml: string;
  readonly images: readonly ShopifyImage[];
  readonly options: readonly ShopifyProductOption[];
  readonly variants: readonly ShopifyProductVariant[];
}
