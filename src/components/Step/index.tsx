import { Album } from '../../interfaces/Spotify';
import { clickTrack } from '../../services/gtm';
import { Track } from '../Track';

export interface StepProps {
  album: Album;
  checkedState: boolean[];
  onChange: (checkedState: boolean[]) => void;
}

export const Step = ({ album, checkedState, onChange }: StepProps) => {
  const handleChecked = (trackNumber: number) => {
    const newCheckedState = checkedState.map((item, i) => i === trackNumber ? !item : item);
    if(newCheckedState.filter(item => item).length > 3) return;
    onChange(newCheckedState);
    clickTrack(album.tracks[trackNumber].name);
  };

  return (
    <>
      <h3 className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8">
          <img
            src={album.image}
            alt={album.name}
          />
        </div>
        <div className="font-bold text-lg text-white">
          {album.name}
        </div>
      </h3>
      <div className="flex flex-col gap-2">
        {album.tracks.map((track, i) =>
          <Track
            key={track.id}
            checked={checkedState[i]}
            name={track.name}
            onChange={() => handleChecked(i)}
          />
        )}
      </div>
    </>
  )
};
