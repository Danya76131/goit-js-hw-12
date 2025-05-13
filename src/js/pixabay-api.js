import axios from "axios";
const API_KEY = "37268355-594f825c6dd88f3f995ae87db";
const BASE_URL = 'https://pixabay.com/api/';
export async function getImagesByQuery(query, page = 1) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
    page,
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error('HTTP error');
  const data = await response.json();
  return data;
}