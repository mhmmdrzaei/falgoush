import { defineType, defineField } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Full-page background image with dark overlay',
    }),
    defineField({
      name: 'blocks',
      title: 'Content Blocks',
      type: 'array',
      of: [
        { type: 'textBlock' },
        { type: 'imageBlock' },
        { type: 'textImageBlock' },
        {
          type: 'object',
          name: 'contactFormBlock',
          title: 'Contact Form',
          fields: [
            {
              name: 'introText',
              title: 'Intro Text',
              type: 'text',
              rows: 3,
            },
          ],
          preview: { prepare: () => ({ title: 'Contact Form' }) },
        },
      ],
    }),
  ],
})
