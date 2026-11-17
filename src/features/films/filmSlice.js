import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFilms, createFilm, updateFilm } from '../../services/api/filmApi';

const initialState = {
  filmDatas: [],
  loading: false,
  error: null,

  formOverlayActive: false,
  editFilmId: null,
};

export const fetchFilms = createAsyncThunk('films/fetchFilms', async () => {
  return await getFilms();
});

export const submitFilm = createAsyncThunk(
  'films/submitFilm',
  async ({ movie, isEdit, editId }) => {
    if (isEdit) {
      const updated = await updateFilm(editId, movie);
      return { isEdit, editId, film: updated };
    }
    const { id, ...payload } = movie;
    const created = await createFilm(payload);
    return { isEdit, film: created };
  }
);

export const removeFromContinueWatching = createAsyncThunk(
  'films/removeFromContinueWatching',
  async (id, { getState }) => {
    const film = getState().films.filmDatas.find(f => f.id === id);
    return await updateFilm(id, {
      tags: film.tags.filter(tag => tag !== 'continue-watching'),
    });
  },
  {
    condition: (id, { getState }) =>
      getState().films.filmDatas.some(f => f.id === id),
  }
);

export const addToList = createAsyncThunk('films/addToList', async id => {
  return await updateFilm(id, { inMyList: true });
});

export const removeFromList = createAsyncThunk(
  'films/removeFromList',
  async (id, { getState, rejectWithValue }) => {
    const previous = getState().films.filmDatas;
    try {
      await updateFilm(id, { inMyList: false });
      return id;
    } catch (err) {
      return rejectWithValue({ previous, message: err.message });
    }
  }
);


const replaceFilm = (state, updated) => {
  state.filmDatas = state.filmDatas.map(f => (f.id === updated.id ? updated : f));
};

const filmSlice = createSlice({
  name: 'films',
  initialState,
  reducers: {
    showEmptyForm(state) {
      state.editFilmId = null;
      state.formOverlayActive = true;
    },
    editFormOverlay(state, action) {
      state.editFilmId = action.payload;
      state.formOverlayActive = true;
    },
    closeForm(state) {
      state.formOverlayActive = false;
    },
  },
  extraReducers: builder => {
    builder
      // fetchFilms
      .addCase(fetchFilms.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilms.fulfilled, (state, action) => {
        state.filmDatas = action.payload;
        state.loading = false;
      })
      .addCase(fetchFilms.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // submitFilm
      .addCase(submitFilm.fulfilled, (state, action) => {
        const { isEdit, editId, film } = action.payload;
        if (isEdit) {
          state.filmDatas = state.filmDatas.map(f => (f.id === editId ? film : f));
        } else {
          state.filmDatas.push(film);
        }
      })
      .addCase(submitFilm.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // removeFromContinueWatching
      .addCase(removeFromContinueWatching.fulfilled, (state, action) => {
        replaceFilm(state, action.payload);
      })
      .addCase(removeFromContinueWatching.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // addToList
      .addCase(addToList.fulfilled, (state, action) => {
        replaceFilm(state, action.payload);
      })
      .addCase(addToList.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // removeFromList (optimistic)
      .addCase(removeFromList.pending, (state, action) => {
        const id = action.meta.arg;
        state.filmDatas = state.filmDatas.map(f =>
          f.id === id ? { ...f, inMyList: false } : f
        );
      })
      .addCase(removeFromList.rejected, (state, action) => {
        state.filmDatas = action.payload.previous;
        state.error = action.payload.message;
      });
  },
});

export const { showEmptyForm, editFormOverlay, closeForm } = filmSlice.actions;


export const selectFilmDatas = state => state.films.filmDatas;
export const selectFilmsLoading = state => state.films.loading;
export const selectFilmsError = state => state.films.error;
export const selectFormOverlayActive = state => state.films.formOverlayActive;
export const selectEditFilmId = state => state.films.editFilmId;

export default filmSlice.reducer;