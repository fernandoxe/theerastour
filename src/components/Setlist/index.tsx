import { cover } from '../../icons/cover';
import { Track } from '../../interfaces/Spotify';
import { Track as TrackComponent } from '../Track';

export interface SetlistProps {
  selectedTracks: Track[];
  totalDuration: string;
}

export const Setlist = ({ selectedTracks, totalDuration }: SetlistProps) => {
  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        <div className="w-[120px] shrink-0">
        <img src={cover} alt="The Eras Tour cover" />
        </div>
        <div className="flex flex-col text-white gap-2">
          <h3 className="font-bold text-2xl">The Eras Tour setlist</h3>
          <div className="text-xs">
            {selectedTracks.length} song{selectedTracks.length === 1 ? '' : 's'}
          </div>
          <div className="text-xs">
            {totalDuration}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        {selectedTracks.map((track, i) =>
          <TrackComponent
            key={track.id}
            name={track.name}
            position={i + 1}
            checked
            disabled />
        )}
      </div>
    </div>
  );
};
