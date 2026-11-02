import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import { getImage } from '../utils/getImage';
import Footer from "../components/layout/Footer";

function MyListPoster({ filmData, onRemove }) {
  return (
    <div
      style={{
        backgroundImage: `url(${getImage(filmData.posterImage) || getImage(filmData.cardImage)})`
      }}
      className="aspect-9/14 bg-center bg-cover rounded-md overflow-hidden relative group"
    >
      { filmData.badge === 'new-episode' &&
        <span className="py-1 px-2.5 bg-primary-300 rounded-full text-body-small-bold text-white absolute top-4 left-4">Episode Baru</span>
      }
      { filmData.badge === 'top-10' &&
        <span className="p-1 rounded-bl-sm rounded-tr-sm bg-error-pressed text-body-small-regular text-white text-center absolute right-0 top-0">
          Top<br />10
        </span>
      }

      <div
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,.2))"
        }}
        className="h-full flex items-end p-6 opacity-0 invisible transition-all ease-out duration-300 group-hover:opacity-100 group-hover:visible"
      >
        <div className="w-full flex justify-between items-center gap-3">
          <h4 className="text-body-medium-bold text-white">{filmData.title}</h4>
          <button
            onClick={() => onRemove(filmData.id)}
            className="cursor-pointer"
          >
            <i className="ri-star-fill text-xl text-yellow-500"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyList() {
  const [filmDatas, setFilmDatas] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = JSON.parse(localStorage.getItem('film-datas'));
        if (!ignore) setFilmDatas(data);
      } catch (err) {
        if (!ignore) console.log(err);
      }
    }

    load();

    return () => {
      ignore = true;
    }
  }, []);
  
  const myListFilmDatas = filmDatas.filter(data => data.myList);

  const removeFilmFromList = id => {
    setFilmDatas(prev => {
      const updatedDatas = prev.map(data =>
        data.id === id ? {...data, myList: false} : data
      );

      localStorage.setItem('film-datas', JSON.stringify(updatedDatas));

      return updatedDatas;
    });
  };

  return (
    <>
      <Navbar />

      <div className="p-20 max-sm:p-5 max-sm:pb-10">
        <h3 className="text-h3 max-sm:text-h5 text-white">Daftar Saya</h3>
        <div className="mt-[30px] max-sm:mt-4 grid grid-cols-6 max-sm:grid-cols-3 gap-x-4 gap-y-8 max-sm:gap-y-4">
          { myListFilmDatas.map(data => <MyListPoster
              key={data.id}
              filmData={data}
              onRemove={removeFilmFromList}
            />) }
        </div>
      </div>

      <Footer className="mt-0 max-sm:mt-0" />
    </>
  );
}