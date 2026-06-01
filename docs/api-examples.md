# Strapi v5 API Examples for Next.js 15

This document provides examples of how to consume the Strapi v5 GraphQL API from a Next.js 15 frontend.

## GraphQL Endpoint

The GraphQL endpoint is available at `/graphql`. For local development, this is `http://localhost:1337/graphql`.

## Example 1: Fetching the Global Settings

This query fetches the site name, social links, and the default SEO configuration.

```graphql
query GetGlobalSettings {
  globalSetting {
    data {
      attributes {
        siteName
        defaultSeo {
          metaTitle
          metaDescription
          shareImage {
            data {
              attributes {
                url
              }
            }
          }
        }
        socialLinks {
          label
          url
          variant
        }
      }
    }
  }
}
```

## Example 2: Fetching a Page by Slug with Dynamic Zones

This query fetches a page and dynamically populates the block components.

```graphql
query GetPageBySlug($slug: String!) {
  pages(filters: { slug: { eq: $slug } }) {
    data {
      attributes {
        title
        seo {
          metaTitle
          metaDescription
        }
        blocks {
          __typename
          ... on ComponentBlocksHero {
            title
            subtitle
            backgroundImage {
              data {
                attributes {
                  url
                }
              }
            }
            buttons {
              label
              url
              variant
            }
          }
          ... on ComponentBlocksTextBlock {
            content
          }
          ... on ComponentBlocksImageGallery {
            images {
              data {
                attributes {
                  url
                }
              }
            }
          }
          ... on ComponentBlocksFaq {
            question
            answer
          }
        }
      }
    }
  }
}
```

## Example 3: Fetching Recent Posts

```graphql
query GetRecentPosts {
  posts(sort: "publishedDate:desc", pagination: { limit: 3 }) {
    data {
      attributes {
        title
        slug
        publishedDate
        author {
          data {
            attributes {
              name
              photo {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Next.js Fetch Example

Using Next.js `fetch` with GraphQL:

```javascript
export async function fetchGraphQL(query, variables = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}` // If using tokens
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 60 } // Example ISR revalidation
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}
```
