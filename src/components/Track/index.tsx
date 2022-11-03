export interface TrackProps {
  checked: boolean;
  name: string;
  onChange: () => void;
}

export const Track = ({ checked, name, onChange }: TrackProps) => {
  return (
    <label>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className="px-4 py-2 text-sm peer-checked:bg-slate-400 border border-slate-400 rounded-lg">{name}</div>
    </label>
  );
};
