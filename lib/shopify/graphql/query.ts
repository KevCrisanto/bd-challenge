export const getShop = `#graphql
  query getShop {
    shop {
      name
      description
    }
  }
` as const;

export const getCollection = `#graphql
  query getCollection($handle: String!) {
    collectionByHandle(handle: $handle) {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            featuredImage {
              url
              altText
              width
              height
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
` as const;

export const getAllCollections = `#graphql
  query getAllCollections {
    collections(first: 50) {
      edges {
        node {
          title
          products(first: 50) {
            edges {
              node {
                id
                title
                handle
                featuredImage {
                  url
                  altText
                  width
                  height
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
` as const;
