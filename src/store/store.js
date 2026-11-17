import { configureStore } from '@reduxjs/toolkit';
import filmReducer from '../features/films/filmSlice.js';

export const store = configureStore({
  reducer: {
    films: filmReducer,
  },
});