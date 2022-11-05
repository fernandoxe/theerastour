import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Track } from '../../interfaces/Spotify';
import { Item } from './Item';
import { getTotalDuration } from '../../services/tracks';
import cover from '../../icons/cover.jpg';

export interface SetlistProps {
  selectedTracks: Track[];
  disableDrag?: boolean;
  onReorder: (tracks: Track[]) => void;
}

export const Setlist = ({ selectedTracks, disableDrag, onReorder }: SetlistProps) => {
  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(MouseSensor),
  );

  const handleDragEnd = (event: any) => {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      const oldIndex = selectedTracks.findIndex((track => track.id === active.id));
      const newIndex = selectedTracks.findIndex((track => track.id === over.id));

      const newSelectedTracks = arrayMove(selectedTracks, oldIndex, newIndex);
      onReorder(newSelectedTracks);
    }
  }

  return (
    <>
      <div className="flex gap-4 mb-4 items-center">
        <div className="w-[120px]">
        <img src={cover} alt="The Eras Tour cover" />
        </div>
        <div className="flex flex-col text-white gap-4">
          <h3 className="font-bold text-2xl">The Eras Tour</h3>
          <div className="text-xs">
            {selectedTracks.length} song{selectedTracks.length === 1 ? '' : 's'}
          </div>
          <div className="text-xs">
            {getTotalDuration(selectedTracks)}
          </div>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={selectedTracks} strategy={verticalListSortingStrategy}>
          {selectedTracks.map((track, i) =>
            <Item key={track.id} track={track} position={i + 1} disableDrag={disableDrag} />
          )}
        </SortableContext>
      </DndContext>
      <div className="text-xs text-white italic">
        You can reorder the list before sharing
      </div>
    </>
  );
};
