import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,  
  dataset: process.env.REACT_APP_SANITY_DATASET,      
  apiVersion: process.env.REACT_APP_SANITY_API_VERSION || '2025-01-01', 
  useCdn: true,
})

const builder = imageUrlBuilder(sanityClient)

export const urlFor = (source) => {
  return builder.image(source)
}

// GROQ query for fetching blog posts
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
