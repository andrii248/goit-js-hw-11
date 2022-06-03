const axios = require('axios');

export default class RequestPictures {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPictures() {
    const API_KEY = '27780590-cb00184c5ea8bffa5b08715df';
    const BASE_URL = 'https://pixabay.com/api/';

    const parameters = new URLSearchParams({
      key: API_KEY,
      q: `${this.searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: `${this.page}`,
    });

    const response = await axios.get(`${BASE_URL}?${parameters}`);
    const img = await response.data;

    return img;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
