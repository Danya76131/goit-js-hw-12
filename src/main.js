
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');
const loadMoreLoader = document.querySelector('.load-more-loader');

loadMoreBtn.classList.add('is-hidden');
loadMoreLoader.classList.add('is-hidden');

let currentPage = 1;
let currentQuery = '';
const perPage = 20;

form.addEventListener('submit', async event => {
  event.preventDefault();

  const query = event.target.elements['search-text'].value.trim();

  loadMoreBtn.classList.add('is-hidden');

  if (!query) {
    iziToast.error({
      title: 'Warning',
      message: 'Please enter a search term!',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;

  showLoader();
  clearGallery();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage, perPage);

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message: 'No images found for your query.',
        position: 'topRight',
      });
      loadMoreBtn.classList.add('is-hidden');
      return;
    }

    createGallery(data.hits);

    if (data.totalHits > currentPage * perPage) {
      loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();
  loadMoreLoader.classList.remove('is-hidden');

  try {
    const data = await getImagesByQuery(currentQuery, currentPage, perPage);

    createGallery(data.hits);

    const firstCard = document.querySelector('.gallery-item');
    if (firstCard) {
      const cardHeight = firstCard.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    if (data.totalHits <= currentPage * perPage) {
      loadMoreBtn.classList.add('is-hidden');
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    hideLoader();
    loadMoreLoader.classList.add('is-hidden');
  }
});