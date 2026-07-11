type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
};

export default function Input({
  value,
  onChange,
  placeholder,
  label,
}: InputProps) {
  return (
    <div className="space-y-2 text-left">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-2xl
          border-2
          border-sky-200
          bg-white
          px-4
          py-3
          text-slate-800
          placeholder:text-slate-400
          shadow-sm
          focus:border-sky-400
          focus:outline-none
          focus:ring-2
          focus:ring-sky-200
        "
      />
    </div>
  );
}