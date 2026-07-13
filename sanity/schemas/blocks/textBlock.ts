import { defineType, defineField } from 'sanity'

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'align',
      title: 'Alignment',
      type: 'string',
      options: { list: ['left', 'center', 'right'], layout: 'radio' },
      initialValue: 'left',
    }),
  ],
  preview: { prepare: () => ({ title: 'Text Block' }) },
})
