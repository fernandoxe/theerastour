import { Reorder } from 'framer-motion';
import { Track } from '../../interfaces/Spotify';
import { Button } from '../Button';
import { Item } from './Item';

export interface SetlistProps {
  selectedTracks: Track[];
  onReorder: (tracks: Track[]) => void;
  onCreatePlaylist: () => void;
}

export const Setlist = ({ selectedTracks, onReorder, onCreatePlaylist }: SetlistProps) => {
  

  return (
    <>
      <h3 className="font-bold text-base mb-4">The Eras Tour setlist</h3>
      <div className="flex flex-col">
        <Reorder.Group
          axis="y"
          values={selectedTracks}
          onReorder={onReorder}
        >
          {selectedTracks.map((track, i) =>
            <Item key={track.id} track={track} position={i + 1} />
          )}
        </Reorder.Group>
      </div>
      <div className="flex justify-center gap-4">
        <Button
          onClick={onCreatePlaylist}
        >
          Create playlist
        </Button>
      </div>
    </>
  );
};
