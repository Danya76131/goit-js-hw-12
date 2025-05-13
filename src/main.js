import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('form');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
let totalImages = 0;

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = e.target.search.value.trim();

  if (!query) {
    iziToast.warning({ message: 'Enter a search term!' });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalImages = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({ message: 'No images found. Try another query.' });
      return;
    }

    createGallery(data.hits);
    if (totalImages > currentPage * 15) {
      showLoadMoreButton();
    }
  } catch (err) {
    iziToast.error({ message: 'Something went wrong!' });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);

    smoothScroll();

    if (currentPage * 15 >= totalImages) {
      iziToast.info({ message: "We're sorry, but you've reached the end of search results." });
    } else {
      showLoadMoreButton();
    }
  } catch (err) {
    iziToast.error({ message: 'Failed to load more images.' });
  } finally {
    hideLoader();
  }
});

function smoothScroll() {
  const { height: cardHeight } = document.querySelector('.gallery a').getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}