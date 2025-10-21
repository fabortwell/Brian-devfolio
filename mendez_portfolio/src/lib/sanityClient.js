import { createClient } from '@sanity/client'
export const sanityClient = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,  
  dataset: process.env.REACT_APP_SANITY_DATASET,      
  apiVersion: process.env.REACT_APP_SANITY_API_VERSION || '2025-01-01', 
  useCdn: true,
})

// Define GROQ query for blog posts
export const blogQuery = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  body,
  category,
  mainImage {
    asset->{
      url,
      metadata {
        dimensions
      }
    }
  },
  author->{
    name
  }
}`

export const fetchBlogPosts = async () => {
  try {
    const posts = await sanityClient.fetch(blogQuery)
    return posts
  } catch (err) {
    console.error("Error fetching from Sanity:", err)
    throw err
  }
}
