import { Reorder, useDragControls } from 'framer-motion';
import { Track } from '../../../interfaces/Spotify';
import { ReactComponent as Logo } from '../../../icons/drag.svg';

export interface ItemProps {
  track: Track;
  position: number;
}

export const Item = ({ track, position }: ItemProps) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      key={track.id}
      value={track}
      dragListener={false}
      dragControls={dragControls}
    >
      <div className="flex px-4 py-2 text-sm border bg-white border-slate-400 rounded-lg mb-2 select-none">
        <div
          className="w-5 h-5 mr-2"
          onPointerDown={e => dragControls.start(e)}
        >
          <Logo />
        </div>
        <div className="flex gap-2">
          <div>
            {position}
          </div>
          <div>
            {track.name}
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};
