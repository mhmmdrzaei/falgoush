import { defineType, defineField } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
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
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (r) => r.min(1900).max(2100),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'linkedShopItem',
      title: 'Linked Shop Item',
      type: 'reference',
      to: [{ type: 'shopItem' }],
      description: 'Link this project to a shop item. Shows a "See project in shop" button, and a "See project details" button on the shop item.',
    }),
  ],
  preview: {
    select: { title: 'title', year: 'year', media: 'images.0' },
    prepare({ title, year, media }) {
      return { title, subtitle: year ? String(year) : undefined, media }
    },
  },
})
