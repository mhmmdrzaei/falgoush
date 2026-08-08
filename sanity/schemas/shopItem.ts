import { defineType, defineField } from 'sanity'

export const shopItem = defineType({
  name: 'shopItem',
  title: 'Shop Item',
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
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          { title: 'Digital', value: 'digital' },
          { title: 'Physical', value: 'physical' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'inventory',
      title: 'Inventory',
      type: 'number',
      description: 'Number of items in stock. Leave empty for unlimited.',
    }),
    defineField({
      name: 'shippingCost',
      title: 'Shipping Cost Per Item (USD)',
      type: 'number',
      description: 'Per-item shipping fee. Cumulates across cart quantity.',
      hidden: ({ document }) => document?.productType !== 'physical',
    }),
    defineField({
      name: 'digitalFile',
      title: 'Digital File',
      type: 'file',
      description: 'File sent to buyer after purchase.',
      hidden: ({ document }) => document?.productType !== 'digital',
    }),
    defineField({
      name: 'downloadCode',
      title: 'Download Code / Link',
      type: 'string',
      description: 'Alternative to a file — a code or external URL sent by email.',
      hidden: ({ document }) => document?.productType !== 'digital',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'images.0', price: 'price', type: 'productType' },
    prepare({ title, media, price, type }) {
      return {
        title,
        subtitle: `${type || '—'} · $${price ?? '?'}`,
        media,
      }
    },
  },
})
