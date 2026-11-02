import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

import Card from "../ui/Card";
import Poster from "../ui/Poster";
import Button from "../ui/Button";

const BREAKPOINTS = {
  card: {
    0: { slidesPerView: 1.15, spaceBetween: 16 },
    640: { slidesPerView: 2, spaceBetween: 24 },
    1024: { slidesPerView: 4, spaceBetween: 24 },
  },
  poster: {
    0: { slidesPerView: 3.6, spaceBetween: 16 },
    640: { slidesPerView: 4, spaceBetween: 28 },
    1024: { slidesPerView: 5, spaceBetween: 28 },
  },
};

const navButtonClass =
  "absolute top-1/2 -translate-y-1/2 bg-body-background border border-outline-border w-[44px] aspect-square rounded-full grid place-items-center cursor-pointer z-99 text-2xl text-white max-sm:hidden transition-opacity [&.swiper-button-disabled]:opacity-30 [&.swiper-button-disabled]:cursor-default [&.swiper-button-lock]:hidden";

export default function HeroSection({
  title,
  mode,
  filmDatas,
  onAddFilmClick,
  onDelete,
  onEdit,
  onAddToList,
}) {
  // Callback refs stored in state so each HeroSection has its own
  // navigation buttons (safe when several sliders are on one page).
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  return (
    <div className="py-10 px-20 max-sm:p-5 max-sm:pr-0 flex flex-col gap-8 bg-page-header-background sm:overflow-x-clip">
      <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-1">
        <h3 className="text-h3 max-sm:text-h5 text-white">{title}</h3>
        {mode === "card" && (
          <Button
            variant="outlined"
            color="secondary"
            hoverVariant="contained"
            hoverColor="primary"
            leftIcon={<i className="ri-add-line" />}
            className="text-lg text-white gap-2 border-white"
            onClick={onAddFilmClick}
          >
            Tambahkan Film
          </Button>
        )}
      </div>

      <div className="relative">
        {/* Prev Button */}
        <button
          ref={setPrevEl}
          type="button"
          aria-label="Sebelumnya"
          className={`${navButtonClass} left-0 -translate-x-1/2`}
        >
          <i className="ri-arrow-left-line"></i>
        </button>
        {/* Next Button */}
        <button
          ref={setNextEl}
          type="button"
          aria-label="Selanjutnya"
          className={`${navButtonClass} right-0 translate-x-1/2`}
        >
          <i className="ri-arrow-right-line"></i>
        </button>

        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl, nextEl }}
          breakpoints={BREAKPOINTS[mode === "card" ? "card" : "poster"]}
          watchOverflow
          watchSlidesProgress
          className="w-full sm:overflow-visible! sm:hover:z-50"
        >
          {filmDatas.map((data) => (
            <SwiperSlide
              key={data.id}
              className="hover:z-10 transition-opacity duration-300 sm:[&:not(.swiper-slide-visible)]:opacity-0 sm:[&:not(.swiper-slide-visible)]:pointer-events-none"
            >
              {mode === "card" ? (
                <Card filmData={data} onDelete={onDelete} onEdit={onEdit} onAddToList={onAddToList} />
              ) : (
                <Poster filmData={data} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}