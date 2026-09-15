import { memo, type ChangeEvent } from "react";

export type SortOrder = "none" | "az" | "za";

interface SortControlProps {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

function SortControlImpl({ value, onChange }: SortControlProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) =>
    onChange(event.target.value as SortOrder);

  return (
    <select className="sort-control" value={value} onChange={handleChange} aria-label="Sort insights">
      <option value="none">Default order</option>
      <option value="az">Title A-Z</option>
      <option value="za">Title Z-A</option>
    </select>
  );
}

export const SortControl = memo(SortControlImpl);
