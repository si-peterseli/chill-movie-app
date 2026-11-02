import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/layout/Hero";
import HeroSection from "../components/layout/HeroSection";
import Footer from "../components/layout/Footer";
import FormOverlay from "../components/ui/FormOverlay";

import { getInitialFilmDatas } from "../data/initialDatas";

export default function App() {
  const [filmDatas, setFilmDatas] = useState([]);
  const [formOverlayActive, setFormOverlayActive] = useState(false);
  const [editFilmId, setEditFilmId] = useState(null);

  useEffect(() => {
  let ignore = false;

  async function load() {
    try {
      let data;
      const stored = localStorage.getItem('film-datas');

      if (stored) {
        data = JSON.parse(stored);
      } else {
        data = await getInitialFilmDatas();
        localStorage.setItem('film-datas', JSON.stringify(data));
      }

      if (!ignore) setFilmDatas(data);
    } catch (err) {
      if (!ignore) console.log(err);
    }
  }

  load();

  return () => {
    ignore = true;
  };
}, []);

  const formSubmit = ({ movie, isEdit, editId }) => {
    let updatedData;
    if (isEdit) {
      setFilmDatas(prev => {
        updatedData =  prev.map(data =>
          data.id === editId ? { ...movie } : data
        );

        return updatedData;
      });
    } else {
      setFilmDatas(prev => {
        updatedData =  [...prev, movie];

        return updatedData;
      });
    }

    localStorage.setItem('film-datas', JSON.stringify(updatedData));
  }

  const removeFilmFromContinueWatching = id => {
    setFilmDatas(prev =>
      prev.map(data => 
        data.id === id
          ? { ...data, fyp: data.fyp.filter(tag => tag !== 'continue-watching') }
          : data
      )
    )
  };

  const editFormOverlay = id => {
    setEditFilmId(id);
    setFormOverlayActive(true);
  };

  const showEmptyForm = () => {
    setEditFilmId(null);
    setFormOverlayActive(true);
  };

  const addToList = id => {
    setFilmDatas(prev => {
      const updatedData = prev.map(data =>
        data.id === id ? {...data, myList: true} : data
      );

      localStorage.setItem('film-datas', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const formInitialData = filmDatas.find(data => data.id === editFilmId) ?? null;

  const continueWatchingFilmDatas = filmDatas.filter(data => data.fyp.includes('continue-watching'));
  const topRatingFilmDatas = filmDatas.filter(data => data.fyp.includes('top-rating'));
  const filmTrendingFilmDatas = filmDatas.filter(data => data.fyp.includes('film-trending'));
  const newReleaseFilmDatas = filmDatas.filter(data => data.fyp.includes('new-release'));

  return (
    <>
      <Navbar />
      <Hero />
      <HeroSection title='Melanjutkan Tonton Film' mode='card' filmDatas={continueWatchingFilmDatas}
        onAddFilmClick={showEmptyForm}
        onDelete={removeFilmFromContinueWatching}
        onEdit={editFormOverlay}
        onAddToList={addToList}
      />
      <HeroSection title='Top Rating Film dan Series Hari ini' mode='poster' filmDatas={topRatingFilmDatas} />
      <HeroSection title='Film Trending' mode='poster' filmDatas={filmTrendingFilmDatas} />
      <HeroSection title='Rilis Baru' mode='poster' filmDatas={newReleaseFilmDatas} />
      <Footer />
      <FormOverlay
        overlayActive={formOverlayActive}
        onClose={() => setFormOverlayActive(false)}
        onSubmit={formSubmit}
        initialData={formInitialData}
      />
    </>
  );
}
