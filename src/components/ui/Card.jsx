import  HoverOverlay  from '../ui/HoverOverlay';
import { getImage } from '../../utils/getImage';

export default function Card({ filmData, onDelete, onEdit, onAddToList }) {
  return (
    <div
      style={{ backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, .4), rgba(0, 0, 0, 0)), url("${getImage(filmData.cardImage)}")` }}
      className="w-full aspect-video p-4 flex items-end justify-between rounded-lg bg-center bg-cover relative group"
    >
      <h6 className="text-h6 max-sm:text-body-small-bold text-white">{filmData.title}</h6>
      <div className="flex items-center gap-1">
        <i className="ri-star-fill text-white text-base max-sm:text-xs"></i>
        <span className="text-body-small-regular max-sm:text-caption-1-regular text-white">{filmData.rating}/5</span>
      </div>

      <HoverOverlay filmData={filmData} mode="card" onDelete={onDelete} onEdit={onEdit} onAddToList={onAddToList} />
    </div>
  );
}