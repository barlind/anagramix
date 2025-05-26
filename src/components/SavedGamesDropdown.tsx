export interface SavedSnapshot {
  id: number;
  initial: { id: number; char: string }[];
  lower: { id: number; char: string }[];
  removed: number[];
  locked: number[];
}

interface Props {
  saved: SavedSnapshot[];
  onSelect(id: number): void;
  className?: string;
}

export default function SavedGamesDropdown({ saved, onSelect, className }: Props) {
  if (!saved.length) return null;

  return (
    <select
      id="saved-select"
      className={`h-12 bg-gray-700 text-white rounded px-2 ${className ?? ''}`}
      defaultValue=""
      onChange={(e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) onSelect(val);
      }}
    >
      <option value="" disabled>
        Or load a previous game …
      </option>
      {saved.map((snap) => (
        <option key={snap.id} value={snap.id}>
          {snap.initial.map((t) => t.char).join('')}
        </option>
      ))}
    </select>
  );
}