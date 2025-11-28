import React, { FC, useState, useRef } from "react";
import { BsSearch } from "react-icons/bs";

interface Props {
  onChange: (name: string) => void;
}

const Search: FC<Props> = ({ onChange }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onChange(value);
  };

  const handleClear = () => {
    setQuery("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm border border-slate-200 min-w-[9rem]">
      <BsSearch className="text-slate-400 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar…"
        className="bg-transparent outline-none text-sm placeholder:text-slate-400 flex-1"
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="text-slate-400 text-xs px-1 hover:text-slate-600"
          aria-label="Limpiar búsqueda"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Search;
