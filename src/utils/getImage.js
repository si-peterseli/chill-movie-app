const images = import.meta.glob('/src/assets/images/**/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

// URL dari internet (http/https), data URL, atau blob URL
const isExternal = (path) => /^(https?:)?\/\//i.test(path) || /^(data|blob):/i.test(path);

export const getImage = (path) => {
  if (!path) return undefined;
  if (isExternal(path)) return path; // gambar dari internet dipakai apa adanya
  return images[`/src/assets/images/${path}`]; // gambar lokal dari folder assets
};