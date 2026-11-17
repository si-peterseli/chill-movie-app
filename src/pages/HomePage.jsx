import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/layout/Hero";
import HeroSection from "../components/layout/HeroSection";
import Footer from "../components/layout/Footer";
import FormOverlay from "../components/ui/FormOverlay";
import {
  fetchFilms,
  submitFilm,
  removeFromContinueWatching,
  addToList,
  showEmptyForm,
  editFormOverlay,
  closeForm,
  selectFilmDatas,
  selectFormOverlayActive,
  selectEditFilmId,
} from "../features/films/filmSlice";

export default function HomePage() {
  const dispatch = useDispatch();

  const filmDatas = useSelector(selectFilmDatas);
  const formOverlayActive = useSelector(selectFormOverlayActive);
  const editFilmId = useSelector(selectEditFilmId);

  useEffect(() => {
    dispatch(fetchFilms());
  }, [dispatch]);

  const handleAddFilmClick = () => dispatch(showEmptyForm());
  const handleEdit = (id) => dispatch(editFormOverlay(id));
  const handleDelete = (id) => dispatch(removeFromContinueWatching(id));
  const handleAddToList = (id) => dispatch(addToList(id));
  const handleCloseForm = () => dispatch(closeForm());
  const handleSubmit = (payload) => dispatch(submitFilm(payload));

  const formInitialData = filmDatas.find((d) => d.id === editFilmId) ?? null;

  const continueWatchingFilmDatas = filmDatas.filter((d) => d.tags.includes('continue-watching'));
  const topRatingFilmDatas = filmDatas.filter((d) => d.tags.includes('top-rating'));
  const filmTrendingFilmDatas = filmDatas.filter((d) => d.tags.includes('film-trending'));
  const newReleaseFilmDatas = filmDatas.filter((d) => d.tags.includes('new-release'));

  return (
    <>
      <Navbar />
      <Hero />
      <HeroSection title='Melanjutkan Tonton Film' mode='card' filmDatas={continueWatchingFilmDatas}
        onAddFilmClick={handleAddFilmClick}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onAddToList={handleAddToList}
      />
      <HeroSection title='Top Rating Film dan Series Hari ini' mode='poster' filmDatas={topRatingFilmDatas}
        onEdit={handleEdit}
        onAddToList={handleAddToList}
      />
      <HeroSection title='Film Trending' mode='poster' filmDatas={filmTrendingFilmDatas}
        onEdit={handleEdit}
        onAddToList={handleAddToList}
      />
      <HeroSection title='Rilis Baru' mode='poster' filmDatas={newReleaseFilmDatas}
        onEdit={handleEdit}
        onAddToList={handleAddToList}
      />
      <Footer />
      <FormOverlay
        overlayActive={formOverlayActive}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={formInitialData}
      />
    </>
  );
}