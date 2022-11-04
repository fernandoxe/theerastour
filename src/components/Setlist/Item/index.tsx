import { Track } from '../../../interfaces/Spotify';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactComponent as Drag } from '../../../icons/drag.svg';

export interface ItemProps {
  track: Track;
  position: number;
  disableDrag?: boolean;
}

export const Item = ({ track, position, disableDrag }: ItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center p-2 text-sm border bg-white border-slate-400 rounded-lg mb-2 select-none gap-2">
        {!disableDrag &&
          <div
            className="w-5 h-5 shrink-0"
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
          >
            <Drag />
          </div>
        }
        {/* <div className="flex items-center gap-2"> */}
          <div className="text-xs">
            {position}
          </div>
          <div className="font-semibold">
            {track.name}
          </div>
        {/* </div> */}
      </div>
    </div>
  );
};
