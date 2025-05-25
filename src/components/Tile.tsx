import { ButtonHTMLAttributes } from 'react'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { id: string; char: string; ariaPressed: boolean }

export default function Tile({ id, char, className, ...rest }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    zIndex: isDragging ? 999 : undefined,
    touchAction: 'none', // Added to prevent native scrolling while dragging
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`tile-button ${className}`} // Removed .btn to prevent aggressive styles
      {...rest}
      onClick={rest.onClick}
    >
      {char}
    </button>
  );
}