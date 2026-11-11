import { create } from "zustand";
import { getFilms, createFilm, updateFilm } from '../services/api/filmApi';

export const useFilmStore = create((set, get) => ({
  filmDatas: [],
  loading: false,
  error: null,

  formOverlayActive: false,
  editFilmId: null,

  showEmptyForm: () => set({ editFilmId: null, formOverlayActive: true }),
  editFormOverlay: id => set({ editFilmId: id, formOverlayActive: true }),
  closeForm: () => set({ formOverlayActive: false }),

  fetchFilms: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getFilms();
      set({ filmDatas: data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  submitFilm: async ({ movie, isEdit, editId }) => {
    try {
      if (isEdit) {
        const updated = await updateFilm(editId, movie);
        set(state => ({
          filmDatas: state.filmDatas.map(f => f.id === editId ? updated : f)
        }));
      } else {
        const { id, ...payload } = movie;
        const created = await createFilm(payload);
        set(state => ({ filmDatas: [ ...state.filmDatas, created ] }));
      }
    } catch (err) {
      set({ error: err.message });
    }
  },

  removeFromContinueWatching: async id => {
    const film = get().filmDatas.find(f => f.id === id);
    if (!film) return;

    try {
      const updated = await updateFilm(id, {
        tags: film.tags.filter(tag => tag !== 'continue-watching')
      });

      set(state => ({
        filmDatas: state.filmDatas.map(f => f.id === id ? updated : f)
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  addToList: async (id) => {
    try {
      const updated = await updateFilm(id, { inMyList: true });
      set(state => ({
        filmDatas: state.filmDatas.map(f => f.id === id ? updated : f)
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  removeFromList: async (id) => {
    const previous = get().filmData;

    set(state => ({
      filmDatas: state.filmDatas.map(data =>
        data.id === id ? { ...data, inMyList: false } : data
      )
    }));

    try {
      await updateFilm(id, { inMyList: false });
    } catch (err) {
      set({ filmDatas: previous, error: err.message });
    }
  }
}));