import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'gallery',
    title: 'Gallery Image',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
        },
    },
})
