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
      <div className="px-4 py-2 text-white text-sm font-semibold shadow-sm shadow-[rgba(34,41,69,0.6)] peer-checked:bg-[#525b84] peer-checked:shadow-none border border-[#525b84] rounded-lg select-none">
        {name}
      </div>
    </label>
  );
};
