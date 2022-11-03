export interface TrackProps {
  checked: boolean;
  name: string;
  onChange: () => void;
}

export const Track = ({ checked, name, onChange }: TrackProps) => {
  return (
    <label className="p-2 font-bold border border-slate-400 rounded hover:bg-slate-400 peer-checked:bg-slate-400">
      <input
        type="checkbox"
        className="peer"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-sm ml-2">{name}</span>
    </label>
  );
};
