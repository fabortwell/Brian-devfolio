// schemas/project.js
import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      title: 'Title', 
      type: 'string' 
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 }
    }),
    defineField({ 
      name: 'summary', 
      title: 'Short Summary', 
      type: 'text' 
    }),
    defineField({ 
      name: 'mainImage', 
      title: 'Featured Image', 
      type: 'image', 
      options: { hotspot: true } 
    }),
    defineField({ 
      name: 'gallery', 
      title: 'Gallery', 
      type: 'array', 
      of: [{ type: 'image' }] 
    }),
    defineField({ 
      name: 'tech', 
      title: 'Tech / Tags', 
      type: 'array', 
      of: [{ type: 'string' }] 
    }),
    defineField({ 
      name: 'category', 
      title: 'Category', 
      type: 'string', 
      options: {
        list: [            
          { title: 'In Progress', value: 'In Progress' },
          { title: 'Web Development', value: 'Web Development' },
          { title: 'Mobile Development', value: 'Mobile Development' },
          { title: 'UI/UX', value: 'UI/UX' },
          { title: 'Other', value: 'Other' }
        ],
        layout: 'dropdown'
      }
    }),
    defineField({ 
      name: 'repoUrl', 
      title: 'Repository URL', 
      type: 'url' 
    }),
    defineField({ 
      name: 'liveUrl', 
      title: 'Live URL', 
      type: 'url' 
    }),
    defineField({ 
      name: 'publishedAt', 
      title: 'Published At', 
      type: 'datetime' 
    }),
    defineField({ 
      name: 'featured', 
      title: 'Featured', 
      type: 'boolean' 
    })
  ]
})
