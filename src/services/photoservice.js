import axios from 'axios';

const API_URL = 'http://jsonplaceholder.typicode.com';

export const getPhotos = (page = 1, limit = 24) => {
  return axios.get(`${API_URL}/photos`, {
    params: {
      _page: page,
      _limit: limit,
    }
  });
};

export const getPhotoById = (id) => {
  return axios.get(`${API_URL}/photos/${id}`);
};
