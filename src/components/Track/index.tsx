export interface TrackProps {
  checked: boolean;
  name: string;
  position?: number;
  disabled?: boolean;
  onChange?: () => void;
}

export const Track = ({ checked, name, position, disabled, onChange }: TrackProps) => {
  return (
    <label>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <div className="flex items-center gap-2 px-4 py-2 text-white text-sm shadow-sm shadow-[rgba(0,0,0,0.5)] peer-checked:bg-[#525b84] peer-checked:shadow-none border border-[#525b84] rounded-lg select-none">
        {position &&
          <div className="text-xs">
            {position}
          </div>
        }
        <div className="font-semibold">
          {name}
        </div>
      </div>
    </label>
  );
};
