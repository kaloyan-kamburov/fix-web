import * as React from "react";

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const handleToggle = () => setIsOpen((v) => !v);
  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setQuery("");
  };
  React.useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, []);
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query]);
  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-0.5 items-start self-stretch relative"
    >
      <div className="flex gap-2 items-center self-stretch">
        <label className="text-xs font-semibold text-zinc-900">{label}</label>
      </div>
      <div className="flex justify-between items-start self-stretch rounded-lg border border-solid bg-zinc-200 border-zinc-300">
        <div className="flex items-start p-2 flex-[1_0_0]">
          <input
            type="text"
            className="overflow-hidden text-sm leading-6 flex-[1_0_0] text-ellipsis text-zinc-900 bg-transparent border-none outline-none w-full"
            value={isOpen ? query : value}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onClick={() => setIsOpen(true)}
            placeholder={placeholder}
          />
        </div>
        <div className="flex gap-2 justify-center items-center w-10 bg-stone-50">
          <button
            type="button"
            onClick={handleToggle}
            className="flex gap-1 justify-center items-center p-2 rounded-sm cursor-pointer bg-zinc-200 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="dropdown-arrow"
              style={{
                width: "24px",
                height: "24px",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <path d="M7 9.5L12 14.5L17 9.5H7Z" fill="#1C1C1D" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && options.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-zinc-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {filtered.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full text-left px-3 py-2 text-sm text-zinc-900 first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { Select };
