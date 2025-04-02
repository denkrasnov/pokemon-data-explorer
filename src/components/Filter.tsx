import { Column } from "@tanstack/react-table";
import { DebouncedInput } from "./DebouncedInput";
import { FC, useCallback } from "react";

interface FilterProps {
  column: Column<any, unknown>;
  options: string[];
}

export const Filter: FC<FilterProps> = ({ column, options }) => {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const handleSearchOnChange = useCallback(
    (value: string | number) => column.setFilterValue(value),
    [column]
  );

  if (filterVariant === "select") {
    return (
      <select
        className="border shadow rounded w-full max-w-36"
        onChange={(e) => column.setFilterValue(e.target.value)}
        value={columnFilterValue?.toString()}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={`${option}`}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (filterVariant === "search") {
    return (
      <DebouncedInput
        className="w-full max-w-36 border shadow rounded px-1"
        onChange={handleSearchOnChange}
        placeholder="Search..."
        type="text"
        value={(columnFilterValue ?? "") as string}
      />
    );
  }

  return null;
};
