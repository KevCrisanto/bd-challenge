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

export const getProductByHandle = `#graphql
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      descriptionHtml
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
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      options {
        name
        values
      }
      variants(first: 250) {
        edges {
          node {
            id
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
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
