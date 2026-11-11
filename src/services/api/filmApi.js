import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const getFilms = async () => {
  const { data } = await api.get('/films');
  return data;
};

export const getFilmById = async (id) => {
  const { data } = await api.get(`/films/${id}`);
  return data;
};

export const createFilm = async (film) => {
  const { data } = await api.post(`/films`, film);
  return data;
};

export const updateFilm = async (id, changes) => {
  const { data } = await api.put(`/films/${id}`, changes);
  return data;
};

export const deleteFilm = async (id) => {
  const { data } = await api.delete(`/films/${id}`);
  return data;
};