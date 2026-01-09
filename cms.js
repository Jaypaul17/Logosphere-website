
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

// Make functions globally available
window.allPosts = [];
window.currentPostIndex = 0;

async function fetchAndRenderBlog() {
    const logosContainer = document.getElementById('logos-list')
    const kairosContainer = document.getElementById('kairos-list')
    const lettersContainer = document.getElementById('letters-list')

    // Only proceed if at least one container exists
    if (!logosContainer && !kairosContainer && !lettersContainer) return

    const query = `*[_type == "post"] | order(publishedAt desc)`

    try {
        const posts = await client.fetch(query)
        window.allPosts = posts // Store globally

        // Clear containers just in case (though they should be empty)
        if (logosContainer) logosContainer.innerHTML = ''
        if (kairosContainer) kairosContainer.innerHTML = ''
        if (lettersContainer) lettersContainer.innerHTML = ''

        posts.forEach((post, index) => {
            const category = post.category || 'Logos' // Default to Logos
            const container = document.getElementById(`${category.toLowerCase()}-list`)

            if (container) {
                const postHtml = createPostCard(post, index)
                container.insertAdjacentHTML('beforeend', postHtml)
            }
        })

        // Add event listener for closing modal on backdrop click
        const modalBackdrop = document.getElementById('blog-modal');
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', (e) => {
                if (e.target === modalBackdrop) {
                    closeModal();
                }
            });
        }

    } catch (error) {
        console.error('Error fetching blog posts:', error)
        // Helpful error for the user
        if (error.message.includes('CorsOrigin')) {
            console.error('CORS Error detected. Please add this origin to your Sanity Studio CORS settings.');
            alert('CORS Error: This domain is not allowed to fetch data from Sanity. Check the console for more details.');
        }
    }
}

function createPostCard(post, index) {
    const date = formatDate(post.publishedAt)
    const category = post.category || 'Logos'
    const title = post.title || 'Untitled'
    // Limit excerpt to length if needed, but schema has text field
    const excerpt = post.excerpt || ''

    // Image for Kairos/Logos if available
    let imageHtml = ''
    if (post.mainImage) {
        const imageUrl = urlFor(post.mainImage).width(600).height(350).url()
        imageHtml = `<img src="${imageUrl}" class="card-img-top object-fit-cover" alt="${title}" style="height: 250px;">`
    }

    // UPDATED: Button calls openBlogModal instead of collapse
    return `
    <div class="col-md-6 col-lg-4" data-aos="fade-up">
        <div class="card shadow-sm rounded-4 h-100 border-0 overflow-hidden">
            ${imageHtml}
            <div class="card-body d-flex flex-column">
                <p class="blog-card-meta mb-1">${date} • ${category}</p>
                <h5 class="fw-bold mb-3">${title}</h5>
                <p class="card-text small text-muted">${excerpt}</p>
                
                <button class="blog-card-read-more mt-auto pt-2 bg-transparent border-0 text-start ps-0" 
                    onclick="openBlogModal(${index})">
                    Read More <i class="bi bi-arrow-right-circle-fill ms-1"></i>
                </button>
            </div>
        </div>
    </div>
    `
}

// === BLOG MODAL LOGIC ===
// === BLOG MODAL LOGIC ===
window.openBlogModal = function (index) {
    if (index < 0 || index >= window.allPosts.length) return;
    window.currentPostIndex = index;
    renderModalContent();

    const modal = document.getElementById('blog-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Disable scroll
}

window.closeModal = function () {
    const modal = document.getElementById('blog-modal');
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Enable scroll
}

window.navigatePost = function (direction) {
    const newIndex = window.currentPostIndex + direction;
    if (newIndex >= 0 && newIndex < window.allPosts.length) {
        window.currentPostIndex = newIndex;
        renderModalContent();
    }
}

function renderModalContent() {
    const post = window.allPosts[window.currentPostIndex];
    if (!post) return;

    const date = formatDate(post.publishedAt);
    const category = post.category || 'Logos';
    const title = post.title || 'Untitled';
    const bodyHtml = post.body ? toHTML(post.body) : '<p>No content available.</p>';

    let imageHtml = '';
    if (post.mainImage) {
        const imageUrl = urlFor(post.mainImage).width(1000).url();
        imageHtml = `<img src="${imageUrl}" class="modal-article-img" alt="${title}">`;
    }

    const contentHtml = `
        ${imageHtml}
        <div class="modal-article-body">
             <div class="d-flex align-items-center gap-2 mb-3">
                <span class="badge bg-primary rounded-pill">${category}</span>
                <span class="text-muted small">• ${date}</span>
             </div>
             <h2 class="fw-bold mb-4">${title}</h2>
             <div class="article-content text-dark lh-lg">
                ${bodyHtml}
             </div>
        </div>
    `;

    document.getElementById('modal-body-content').innerHTML = contentHtml;

    // Update Nav Buttons State
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (window.currentPostIndex === 0) prevBtn.classList.add('disabled');
    else prevBtn.classList.remove('disabled');

    if (window.currentPostIndex === window.allPosts.length - 1) nextBtn.classList.add('disabled');
    else nextBtn.classList.remove('disabled');
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
