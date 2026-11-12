import { useEffect } from "react";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/layout/Hero";
import HeroSection from "../components/layout/HeroSection";
import Footer from "../components/layout/Footer";
import FormOverlay from "../components/ui/FormOverlay";
import { useFilmStore } from "../store/useFilmStore";

export default function HomePage() {
  const filmDatas = useFilmStore((s) => s.filmDatas);
  const loading = useFilmStore((s) => s.loading);
  const error = useFilmStore((s) => s.error);
  const formOverlayActive = useFilmStore((s) => s.formOverlayActive);
  const editFilmId = useFilmStore((s) => s.editFilmId);

  const fetchFilms = useFilmStore((s) => s.fetchFilms);
  const submitFilm = useFilmStore((s) => s.submitFilm);
  const removeFromContinueWatching = useFilmStore((s) => s.removeFromContinueWatching);
  const addToList = useFilmStore((s) => s.addToList);
  const showEmptyForm = useFilmStore((s) => s.showEmptyForm);
  const editFormOverlay = useFilmStore((s) => s.editFormOverlay);
  const closeForm = useFilmStore((s) => s.closeForm);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  // Data turunan tetap dihitung di komponen
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
        onAddFilmClick={showEmptyForm}
        onDelete={removeFromContinueWatching}
        onEdit={editFormOverlay}
        onAddToList={addToList}
      />
      <HeroSection title='Top Rating Film dan Series Hari ini' mode='poster' filmDatas={topRatingFilmDatas}
        onEdit={editFormOverlay}
        onAddToList={addToList}
      />
      <HeroSection title='Film Trending' mode='poster' filmDatas={filmTrendingFilmDatas}
        onEdit={editFormOverlay}
        onAddToList={addToList}
      />
      <HeroSection title='Rilis Baru' mode='poster' filmDatas={newReleaseFilmDatas}
        onEdit={editFormOverlay}
        onAddToList={addToList}
      />
      <Footer />
      <FormOverlay
        overlayActive={formOverlayActive}
        onClose={closeForm}
        onSubmit={submitFilm}
        initialData={formInitialData}
      />
    </>
  );
}