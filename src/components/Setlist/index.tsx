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
      <h3 className="font-bold text-lg text-center mb-4">The Eras Tour setlist</h3>
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
    </>
  );
};
