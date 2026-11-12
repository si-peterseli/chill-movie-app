import  HoverOverlay  from '../ui/HoverOverlay';
import { getImage } from '../../utils/getImage';

const BADGE_CONFIG = {
  'new-episode': {
    className:
      'absolute top-4 left-4 max-sm:top-[8px] max-sm:left-[8px] py-1 px-2.5 max-sm:py-[2px] max-sm:px-[5px] rounded-full bg-primary-300 text-body-small-bold max-sm:text-[6px] text-white',
    content: 'Episode Baru',
  },
  'top-10': {
    className:
      'absolute top-0 right-3 max-sm:right-1 p-1 max-sm:p-[2px] rounded-tr-sm rounded-bl-sm max-sm:rounded-tr-xs max-sm:rounded-bl-xs bg-error-pressed text-center text-body-small-regular max-sm:text-[7px] text-white',
    content: (
      <>
        Top<br />10
      </>
    ),
  },
};

function Badge({ type }) {
  const config = BADGE_CONFIG[type];
  if (!config) return null;

  return <span className={config.className}>{config.content}</span>;
}

export default function Poster({ filmData, onEdit, onAddToList }) {
  return (
    <div
      style={{ backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, .4), rgba(0, 0, 0, 0)), url("${getImage(filmData.posterImage)}")` }}
      className="w-full aspect-3/5 max-sm:aspect-9/16 rounded-md bg-center bg-cover relative group"
    >
      {filmData.badges?.map((type) => (
        <Badge key={type} type={type} />
      ))}
      <HoverOverlay filmData={filmData} mode="poster" onEdit={onEdit} onAddToList={onAddToList} />
    </div>
  );
}