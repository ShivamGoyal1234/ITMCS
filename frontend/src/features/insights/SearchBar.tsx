import { memo, type ChangeEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBarImpl({ value, onChange }: SearchBarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <input
      type="search"
      className="search-bar"
      placeholder="Search insights by text or category..."
      value={value}
      onChange={handleChange}
      aria-label="Search insights"
    />
  );
}

export const SearchBar = memo(SearchBarImpl);
