
import { createClient } from 'https://esm.sh/@sanity/client'
import { toHTML } from 'https://esm.sh/@portabletext/to-html'
import imageUrlBuilder from 'https://esm.sh/@sanity/image-url'

// Configuration
const config = {
    projectId: 'hauqaalv',
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
}

const client = createClient(config)
const builder = imageUrlBuilder(client)

function urlFor(source) {
    return builder.image(source)
}

function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function fetchAndRenderBlog() {
    const logosContainer = document.getElementById('logos-list')
    const kairosContainer = document.getElementById('kairos-list')
    const lettersContainer = document.getElementById('letters-list')

    // Only proceed if at least one container exists
    if (!logosContainer && !kairosContainer && !lettersContainer) return

    const query = `*[_type == "post"] | order(publishedAt desc)`

    try {
        const posts = await client.fetch(query)

        // Clear containers just in case (though they should be empty)
        if (logosContainer) logosContainer.innerHTML = ''
        if (kairosContainer) kairosContainer.innerHTML = ''
        if (lettersContainer) lettersContainer.innerHTML = ''

        posts.forEach(post => {
            const category = post.category || 'Logos' // Default to Logos
            const container = document.getElementById(`${category.toLowerCase()}-list`)

            if (container) {
                const postHtml = createPostCard(post)
                container.insertAdjacentHTML('beforeend', postHtml)
            }
        })

    } catch (error) {
        console.error('Error fetching blog posts:', error)
    }
}

function createPostCard(post) {
    const date = formatDate(post.publishedAt)
    const category = post.category || 'Logos'
    const title = post.title || 'Untitled'
    // Limit excerpt to length if needed, but schema has text field
    const excerpt = post.excerpt || ''
    const bodyHtml = post.body ? toHTML(post.body) : ''
    const collapseId = `collapse-${post._id}`

    // Image for Kairos/Logos if available
    let imageHtml = ''
    if (post.mainImage) {
        // If you want to show images in cards, add here. 
        // Based on original design, Logos didn't show images in the card list, but Kairos might.
        // For now, adhering to the structure viewed in blog.html which didn't strictly show images for text cards.
        // But if Kairos is "Reflections on timely intervention", maybe it has images? 
        // The previous Kairos placeholder was just text. 
        // I will currently not add mainImage to the card unless requested or seen in design.
    }

    return `
    <div class="col-md-6 col-lg-4" data-aos="fade-up">
        <div class="card shadow-sm rounded-4 h-100">
            <div class="card-body">
                <p class="blog-card-meta mb-1">${date} • ${category}</p>
                <h5 class="fw-bold mb-3">${title}</h5>
                <p class="card-text small text-muted">${excerpt}</p>
                <div class="collapse" id="${collapseId}">
                    <div class="mt-3">
                        ${bodyHtml}
                    </div>
                </div>
                <a class="blog-card-read-more mt-auto pt-2" data-bs-toggle="collapse"
                    href="#${collapseId}" role="button" aria-expanded="false"
                    aria-controls="${collapseId}">
                    Read More <i class="bi bi-arrow-right-circle-fill ms-1"></i>
                </a>
            </div>
        </div>
    </div>
    `
}


async function fetchAndRenderGallery() {
    const galleryContainer = document.getElementById('gallery-container')
    if (!galleryContainer) return

    const query = `*[_type == "gallery"] | order(_createdAt desc)`

    try {
        const images = await client.fetch(query)
        galleryContainer.innerHTML = ''

        images.forEach(item => {
            const html = createGalleryItem(item)
            galleryContainer.insertAdjacentHTML('beforeend', html)
        })

    } catch (error) {
        console.error('Error fetching gallery:', error)
    }
}

function createGalleryItem(item) {
    if (!item.image) return ''

    // Generate image URL with a reasonable width for performance
    const imageUrl = urlFor(item.image).width(800).url()
    const title = item.title || ''

    return `
    <div class="col-md-4 mb-4" data-aos="fade-up">
        <div class="gallery-item rounded-4 shadow-sm overflow-hidden position-relative">
            <img src="${imageUrl}" alt="${title}"
                class="img-fluid w-100 h-100 object-fit-cover">
            <div class="gallery-overlay d-flex align-items-center justify-content-center">
                <p class="text-white fw-bold mb-0">${title}</p>
            </div>
        </div>
    </div>
    `
}

// Initialize
fetchAndRenderBlog()
fetchAndRenderGallery()
