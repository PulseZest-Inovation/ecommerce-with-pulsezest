import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragIndicator } from '@mui/icons-material';

interface SortableItemProps {
  id: string;
  name: string;
}

export default function SortableItem({ id, name }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 border w-full rounded flex items-center justify-between bg-gray-100 cursor-grab  min-w-0"
    >
      <span className="truncate">{name}</span>
      <DragIndicator className="text-gray-500" />
    </div>
  );
}
