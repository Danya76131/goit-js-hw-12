
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37268355-594f825c6dd88f3f995ae87db';

export async function getImagesByQuery(query = '', page = 1, perPage = 20) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}