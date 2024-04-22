import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { createGalleryMarkup } from './js/render-functions';
import { fetchRequest } from './js/pixabay-api';

const form = document.querySelector('.form');
const input = document.querySelector('.input');
let inputValue;
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
let currentPage = 1;
const itemsPerPage = 15;

form.addEventListener('submit', handleSubmit);
loadButton.addEventListener('click', loadNextPage);

async function handleSubmit(event) {
    event.preventDefault();
    inputValue = input.value.trim();
    loader.style.display = 'block';
    loadButton.style.display = 'none';
    gallery.innerHTML = '';
    if (inputValue === '') {
        loader.style.display = 'none';
        loadButton.style.display = 'none';
        form.reset();
        iziToast.info({
            message: 'Looks like you forgot to fill in the search query...',
            position: 'topRight',
        });
        return;
    }
    try {
        const data = await fetchRequest(inputValue, currentPage);
        loader.style.display = 'none';
        if (data.totalHits === 0) {
            form.reset();
            iziToast.error({
                message:
                    'Sorry, there are no images matching your search query. Please, try again!',
                position: 'topRight',
            });
        } else if (data.totalHits <= itemsPerPage) {
            gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(data.hits));
            loadButton.style.display = 'none';
            lightbox.refresh();
            form.reset();
        } else {
            gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(data.hits));
            loadButton.style.display = 'block';
            lightbox.refresh();
            form.reset();
        }
    } catch (error) {
        loader.style.display = 'none';
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
    currentPage++;
    loader.style.display = 'block';
    try {
        const data = await fetchRequest(inputValue, currentPage);
        const totalPages = Math.ceil(data.totalHits / itemsPerPage);
        gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(data.hits));
        lightbox.refresh();
        loader.style.display = 'none';
        if (currentPage === totalPages) {
            loadButton.style.display = 'none';
            iziToast.info({
                message:
                    `We're sorry, but you've reached the end of search results.`,
                position: 'topRight',
            });
        }
    } catch (error) {
        loader.style.display = 'none';
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