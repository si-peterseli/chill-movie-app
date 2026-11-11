import { useLayoutEffect, useState } from "react";

import Button from "./Button";
import { getImage } from "../../utils/getImage";

const EMPTY_FORM = {
  title: "",
  rating: "",
  cardImage: "",
  posterImage: "",
  hours: "",
  minutes: "",
  seconds: "",
  genres: "",
  ageRating: "",
  episode: "",
  progressHours: "",
  progressMinutes: "",
  progressSeconds: "",
};

const AGE_RATINGS = ["SU", "13+", "17+", "21+"];

const toSeconds = (h, m, s) =>
  Number(h || 0) * 3600 + Number(m || 0) * 60 + Number(s || 0);

const splitSeconds = (total = 0) => ({
  h: Math.floor(total / 3600) || "",
  m: Math.floor((total % 3600) / 60) || "",
  s: total % 60 || "",
});

// "Episode 3" -> 3
const parseEpisode = (episode) => {
  const match = String(episode ?? "").match(/\d+/);
  return match ? Number(match[0]) : "";
};

function toFormValues(movie) {
  if (!movie) return EMPTY_FORM;
  const duration = splitSeconds(movie.durationSeconds);
  const progress = splitSeconds(movie.progress?.progressSeconds);
  return {
    title: movie.title ?? "",
    rating: movie.rating ?? "",
    cardImage: movie.cardImage ?? "",
    posterImage: movie.posterImage ?? "",
    hours: duration.h,
    minutes: duration.m,
    seconds: duration.s,
    genres: (movie.genres ?? []).join(", "),
    ageRating: movie.ageRating ?? "",
    episode: parseEpisode(movie.progress?.episode),
    progressHours: progress.h,
    progressMinutes: progress.m,
    progressSeconds: progress.s,
  };
}


const inputClass =
  "w-full rounded bg-black/30 px-2 py-1.5 text-sm text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-white/60";
const labelClass = "mb-1 block text-xs text-white/70";
const errorClass = "mt-1 text-xs text-red-400";

export default function FormOverlay({
  overlayActive,
  onClose,
  onSubmit,
  initialData = null, // kosong = mode tambah, berisi = mode edit
}) {
  const [values, setValues] = useState(() => toFormValues(initialData));
  const [errors, setErrors] = useState({});
  const [cardFailed, setCardFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  useLayoutEffect(() => {
    if (!overlayActive) return;
    setValues(toFormValues(initialData));
    setErrors({});
    setCardFailed(false);
    setPosterFailed(false);
  }, [overlayActive, initialData?.id]);

  const isEdit = Boolean(initialData);
  const editId = initialData?.id;

  // Pratinjau: utamakan cardImage, fallback ke posterImage
  const rawCard = values.cardImage.trim();
  const rawPoster = values.posterImage.trim();
  const cardSrc = getImage(rawCard); // undefined jika path lokal tidak ditemukan
  const posterSrc = getImage(rawPoster);
  const previewSrc =
    cardSrc && !cardFailed ? cardSrc : posterSrc && !posterFailed ? posterSrc : "";
  const previewIsFallback =
    previewSrc !== "" && previewSrc === posterSrc && previewSrc !== cardSrc;
  const hasImageError =
    (rawCard && (!cardSrc || cardFailed)) ||
    (rawPoster && (!posterSrc || posterFailed));

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (name === "cardImage") setCardFailed(false);
    if (name === "posterImage") setPosterFailed(false);
  }

  function validate() {
    const next = {};
    const rating = Number(values.rating);
    const total = toSeconds(values.hours, values.minutes, values.seconds);
    const watched = toSeconds(
      values.progressHours,
      values.progressMinutes,
      values.progressSeconds
    );

    if (!values.title.trim()) next.title = "Judul wajib diisi.";

    if (values.rating === "" || Number.isNaN(rating) || rating < 0 || rating > 10)
      next.rating = "Rating harus 0 - 10.";

    if (!values.cardImage.trim()) next.cardImage = "Card image wajib diisi.";

    if (!values.posterImage.trim()) next.posterImage = "Poster image wajib diisi.";

    const durationInvalid = [values.hours, values.minutes, values.seconds].some(
      (v) => Number(v || 0) < 0
    );
    if (
      durationInvalid ||
      Number(values.minutes || 0) > 59 ||
      Number(values.seconds || 0) > 59 ||
      total <= 0
    )
      next.duration = "Durasi tidak valid (menit & detik 0 - 59).";

    if (!values.genres.trim()) next.genres = "Isi minimal satu genre.";

    if (!values.ageRating) next.ageRating = "Pilih batas usia.";

    if (values.episode !== "" && Number(values.episode) < 1)
      next.episode = "Episode minimal 1.";

    const progressInvalid = [
      values.progressHours,
      values.progressMinutes,
      values.progressSeconds,
    ].some((v) => Number(v || 0) < 0);
    if (
      progressInvalid ||
      Number(values.progressMinutes || 0) > 59 ||
      Number(values.progressSeconds || 0) > 59
    )
      next.progress = "Progres tidak valid (menit & detik 0 - 59).";
    else if (total > 0 && watched > total)
      next.progress = "Progres tidak boleh melebihi durasi.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const movie = {
      id: isEdit ? editId : crypto.randomUUID(),
      title: values.title.trim(),
      rating: Number(values.rating),
      cardImage: values.cardImage.trim(),
      posterImage: values.posterImage.trim(),
      durationSeconds: toSeconds(values.hours, values.minutes, values.seconds),
      genres: values.genres
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      ageRating: values.ageRating,
      tags: initialData?.tags ?? ["continue-watching"],
      badges: initialData?.badges ?? [],
      progress: {
        episode: `Episode ${values.episode === "" ? 1 : Number(values.episode)}`,
        progressSeconds: toSeconds(
          values.progressHours,
          values.progressMinutes,
          values.progressSeconds
        ),
      },
      inMyList: false
    };

    setValues(EMPTY_FORM);
    onSubmit?.({movie, isEdit, editId});
    onClose?.();
  }

  return (
    <div
      className={`z-100 fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center transition-all ease-out duration-300 ${overlayActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        noValidate
        className="w-[420px] max-sm:w-[85vw] max-h-[90vh] overflow-y-auto bg-page-header-background rounded-md overflow-x-hidden"
      >
        {/* Image Preview */}
        <div className="relative aspect-video w-full bg-black/40 grid place-items-center">
          {previewSrc ? (
            <img
              key={previewSrc}
              src={previewSrc}
              alt={values.title ? `Gambar ${values.title}` : "Pratinjau gambar"}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={() =>
                previewSrc === cardSrc ? setCardFailed(true) : setPosterFailed(true)
              }
            />
          ) : (
            <p className="px-4 text-center text-xs text-white/50">
              {hasImageError
                ? "Gambar tidak bisa dimuat. Periksa path atau URL-nya."
                : "Pratinjau gambar akan muncul di sini."}
            </p>
          )}
          {previewSrc && previewIsFallback && (
            <p className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white/80">
              Menampilkan poster
            </p>
          )}
        </div>

        <div className="p-4 space-y-3 text-white">
          <h2 className="text-base font-semibold">
            {isEdit ? "Edit film" : "Tambah film"}
          </h2>

          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Judul
            </label>
            <input
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Contoh: Don't Look Up"
              className={inputClass}
            />
            {errors.title && <p className={errorClass}>{errors.title}</p>}
          </div>

          {/* Card image */}
          <div>
            <label htmlFor="cardImage" className={labelClass}>
              Card image (path atau URL)
            </label>
            <input
              id="cardImage"
              name="cardImage"
              value={values.cardImage}
              onChange={handleChange}
              placeholder="card/dont-look-up.webp | https://cdn.pixabay.com/photo/"
              className={inputClass}
            />
            {errors.cardImage && <p className={errorClass}>{errors.cardImage}</p>}
          </div>

          {/* Poster image */}
          <div>
            <label htmlFor="posterImage" className={labelClass}>
              Poster image (path atau URL)
            </label>
            <input
              id="posterImage"
              name="posterImage"
              value={values.posterImage}
              onChange={handleChange}
              placeholder="poster/dont-look-up.webp | https://cdn.pixabay.com/photo/"
              className={inputClass}
            />
            {errors.posterImage && (
              <p className={errorClass}>{errors.posterImage}</p>
            )}
          </div>

          {/* Rating + Age rating */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="rating" className={labelClass}>
                Rating (0 - 5)
              </label>
              <input
                id="rating"
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={values.rating}
                onChange={handleChange}
                placeholder="4.5"
                className={inputClass}
              />
              {errors.rating && <p className={errorClass}>{errors.rating}</p>}
            </div>
            <div>
              <label htmlFor="ageRating" className={labelClass}>
                Batas usia
              </label>
              <select
                id="ageRating"
                name="ageRating"
                value={values.ageRating}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Pilih</option>
                {AGE_RATINGS.map((age) => (
                  <option key={age} value={age} className="text-black">
                    {age}
                  </option>
                ))}
              </select>
              {errors.ageRating && (
                <p className={errorClass}>{errors.ageRating}</p>
              )}
            </div>
          </div>

          {/* Duration */}
          <fieldset>
            <legend className={labelClass}>Durasi</legend>
            <div className="grid grid-cols-3 gap-2">
              <input
                name="hours"
                type="number"
                min="0"
                value={values.hours}
                onChange={handleChange}
                placeholder="Jam"
                aria-label="Durasi jam"
                className={inputClass}
              />
              <input
                name="minutes"
                type="number"
                min="0"
                max="59"
                value={values.minutes}
                onChange={handleChange}
                placeholder="Menit"
                aria-label="Durasi menit"
                className={inputClass}
              />
              <input
                name="seconds"
                type="number"
                min="0"
                max="59"
                value={values.seconds}
                onChange={handleChange}
                placeholder="Detik"
                aria-label="Durasi detik"
                className={inputClass}
              />
            </div>
            {errors.duration && <p className={errorClass}>{errors.duration}</p>}
          </fieldset>

          {/* Genres */}
          <div>
            <label htmlFor="genres" className={labelClass}>
              Genre (pisahkan dengan koma)
            </label>
            <input
              id="genres"
              name="genres"
              value={values.genres}
              onChange={handleChange}
              placeholder="Misteri, Kriminal, Fantasi"
              className={inputClass}
            />
            {errors.genres && <p className={errorClass}>{errors.genres}</p>}
          </div>

          {/* Episode */}
          <div>
            <label htmlFor="episode" className={labelClass}>
              Episode
            </label>
            <input
              id="episode"
              name="episode"
              type="number"
              min="1"
              value={values.episode}
              onChange={handleChange}
              placeholder="1"
              className={inputClass}
            />
            {errors.episode && <p className={errorClass}>{errors.episode}</p>}
          </div>

          {/* Progress (watched time) */}
          <fieldset>
            <legend className={labelClass}>Sudah ditonton</legend>
            <div className="grid grid-cols-3 gap-2">
              <input
                name="progressHours"
                type="number"
                min="0"
                value={values.progressHours}
                onChange={handleChange}
                placeholder="Jam"
                aria-label="Ditonton jam"
                className={inputClass}
              />
              <input
                name="progressMinutes"
                type="number"
                min="0"
                max="59"
                value={values.progressMinutes}
                onChange={handleChange}
                placeholder="Menit"
                aria-label="Ditonton menit"
                className={inputClass}
              />
              <input
                name="progressSeconds"
                type="number"
                min="0"
                max="59"
                value={values.progressSeconds}
                onChange={handleChange}
                placeholder="Detik"
                aria-label="Ditonton detik"
                className={inputClass}
              />
            </div>
            {errors.progress && <p className={errorClass}>{errors.progress}</p>}
          </fieldset>

          {/* Actions */}
          <div className="flex justify-end gap-6 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="shadow"
              color="secondary"
              className="text-white text-base p-0"
            >Batal</Button>
            <Button
              variant="outlined"
              color="secondary"
              type="submit"
              className="border-white text-white"
            >
              {isEdit ? "Simpan perubahan" : "Tambah film"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}