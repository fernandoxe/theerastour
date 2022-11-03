import { Album } from '../../interfaces/Spotify';
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
  };

  return (
    <>
      <h3 className="font-bold text-base mb-4">{album.name}</h3>
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
