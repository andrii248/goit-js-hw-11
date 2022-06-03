import './css/styles.css';
import RequestPictures from './js/request-to-pixabay-api';
import LoadMoreImgsBtn from './js/loadMoreImgs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const userRequest = new RequestPictures();
const loadMoreBtn = new LoadMoreImgsBtn({
  selector: '[data-acton="load"]',
  hidden: true,
});
let lightbox = new SimpleLightbox('.gallery a', {
  captionData: 'alt',
  captionDelay: 500,
});

const refs = {
  form: document.querySelector('#search-form'),
  searchBtn: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSearchSubmit);
loadMoreBtn.refs.loadBtn.addEventListener('click', onLoadBtnClick);
refs.gallery.addEventListener('click', onImgClick);

function onSearchSubmit(evt) {
  evt.preventDefault();

  const searchData = evt.target.elements.searchQuery.value.trim();
  userRequest.query = searchData;

  if (searchData === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  clearGalleryContainer();
  userRequest.resetPage();
  fetchAndRenderImgs().then(data => {
    const totalImgsFound = Number(data.totalHits);
    Notify.success(`Hooray! We found ${totalImgsFound} images.`);
  });
  evt.target.reset();
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}

async function fetchAndRenderImgs() {
  try {
    loadMoreBtn.show();
    loadMoreBtn.disable();
    const fetchData = await userRequest.fetchPictures();
    const images = fetchData.hits;
    const totalImgsFound = fetchData.totalHits;

    if (totalImgsFound === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.hide();
      return;
    }
    if (totalImgsFound < 40) {
      loadMoreBtn.hide();
    }

    renderImages(images);
    userRequest.incrementPage();
    lightbox.refresh();
    loadMoreBtn.enable();

    return fetchData;
  } catch (error) {
    Notify.failure(`${error.message}`);
  }
}

function onLoadBtnClick() {
  fetchAndRenderImgs().then(data => {
    const currentPage = userRequest.page;
    const totalPages = Math.ceil(Number(data.totalHits) / 40);
    if (currentPage > totalPages) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.hide();
    }
  });
}

function renderImages(images) {
  const markup = images
    .map(image => {
      return `<a href="${image.largeImageURL}" class="photo-card">
  <img  class="gallery__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <span class="photo_span">${image.likes} </span>
    </p>
    <p class="info-item">
      <b>Views</b> <span class="photo_span">${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b> <span class="photo_span">${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b> <span class="photo_span">${image.downloads}</span>
    </p>
  </div>
</a>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function onImgClick(evt) {
  if (evt.target.nodeName !== 'IMG') return;
}
