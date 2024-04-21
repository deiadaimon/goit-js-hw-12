import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { createGalleryMarkup } from './js/render-functions';
import { fetchRequest } from './js/pixabay-api';

const form = document.querySelector('.form');
const input = document.querySelector('.input');
const loader = document.querySelector('.loader');
loader.style.display = 'none';
const gallery = document.querySelector('.gallery');
const loadButton = document.querySelector('.load-button');
loadButton.style.display = 'none';
const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});
const perPage = 15;
let currentPage = 1;

form.addEventListener('submit', handleSubmit);
loadButton.addEventListener('click', loadNextPage);

// function handleSubmit(event) {
//     event.preventDefault();
//     gallery.innerHTML = '';
//     loader.style.display = 'block';
//     const inputValue = event.currentTarget.elements.input.value.trim();

//     fetchRequest(inputValue)
//         .then(data => {
//             loader.style.display = 'none';

//             if (!data.hits.length) {
//                 iziToast.error({
//                     message:
//                         'Sorry, there are no images matching your search query. Please, try again!',
//                     messageColor: '#fafafb',
//                     messageSize: '16px',
//                     messageLineHeight: '1.5',
//                     backgroundColor: '#ef4040',
//                     position: 'topRight',
//                 });
//             }

//             return data;
//         })

//         .then(data => {
//             gallery.innerHTML = createGalleryMarkup(data.hits);
//             loadButton.style.display = 'block';
//             lightbox.refresh();
//             form.reset();
//         })

//         .catch(error => {
//             loader.style.display = 'none';
//             iziToast.error({
//                 message:
//                     'Sorry, there are no images matching your search query. Please, try again!',
//                 messageColor: '#fafafb',
//                 messageSize: '16px',
//                 messageLineHeight: '1.5',
//                 backgroundColor: '#ef4040',
//                 position: 'topRight',
//             });
//         });
// }

async function handleSubmit(event) {
    event.preventDefault();
    loader.style.display = 'block';
    gallery.innerHTML = '';
    const inputValue = input.value.trim();
    if (inputValue === '') {
        loader.style.display = 'none';
        loadButton.style.display = 'none';
        form.reset();
        lightbox.refresh();
        iziToast.info({
            message: 'Looks like you forgot to fill in the search query...',
            messageColor: '#fafafb',
            messageSize: '16px',
            messageLineHeight: '1.5',
            position: 'topRight',
        });
        return;
    }

    try {
        const data = await fetchRequest(inputValue, currentPage);
        const totalPages = Math.ceil(data.totalHits / perPage);
        loader.style.display = 'none';
        if (totalPages === 0) {
            loadButton.style.display = 'none';
            lightbox.refresh();
            form.reset();
            iziToast.error({
                message:
                    'Sorry, there are no images matching your search query. Please, try again!',
                messageColor: '#fafafb',
                messageSize: '16px',
                messageLineHeight: '1.5',
                backgroundColor: '#ef4040',
                position: 'topRight',
            });
        } else if (totalPages === 1) {
            loadButton.style.display = 'none';
            gallery.innerHTML = createGalleryMarkup(data.hits);
            lightbox.refresh();
            form.reset();
        } else if (totalPages > 1) {
            loadButton.style.display = 'block';
            gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(data.hits));
            form.reset();
        }

    } catch (error) {
        loader.style.display = 'none';
        loadButton.style.display = 'none';
        lightbox.refresh();
        form.reset();
        iziToast.error({
            message:
                'Oops! Something went wrong... Please, try again!',
            messageColor: '#fafafb',
            messageSize: '16px',
            messageLineHeight: '1.5',
            backgroundColor: '#ef4040',
            position: 'topRight',
        });
    }
}

async function loadNextPage(event) {
    event.preventDefault();
    // loader.style.display = 'block';
    const inputValue = input.value.trim();
    currentPage++;

    try {
        const data = await fetchRequest(inputValue, currentPage);
        const totalPages = Math.ceil(data.totalHits / perPage);
        gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(data.hits));
        console.log('all pages' + totalPages);
        console.log('this page' + currentPage);
        if (currentPage === totalPages) {
            loadButton.style.display = 'none';
            iziToast.info({
                message:
                    `We're sorry, but you've reached the end of search results.`,
                messageColor: '#fafafb',
                messageSize: '16px',
                messageLineHeight: '1.5',
                position: 'topRight',
            });
        }
    } catch (error) {
        loader.style.display = 'none';
        loadButton.style.display = 'none';
        lightbox.refresh();
        form.reset();
        iziToast.error({
            message:
                'Oops! Something went wrong... Please, try again!',
            messageColor: '#fafafb',
            messageSize: '16px',
            messageLineHeight: '1.5',
            backgroundColor: '#ef4040',
            position: 'topRight',
        });
    }
}