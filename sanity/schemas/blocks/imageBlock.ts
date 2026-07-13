import { defineType, defineField } from 'sanity'

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
    defineField({
      name: 'fullWidth',
      title: 'Full Width',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'caption', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Image Block', media }
    },
  },
})
