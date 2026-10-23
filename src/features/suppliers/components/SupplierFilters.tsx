import { useEffect, useState } from "react";

import type { SupplierQueryParams } from "../types/supplier.types";
import {  RotateCcw } from "lucide-react";

interface SupplierFiltersProps {
  filters: SupplierQueryParams;
  onChange: (filters: SupplierQueryParams) => void;
  onReset: () => void;
}

const fields = [
  { key: "supplierName", label: "Supplier Name" },
  { key: "contactName", label: "Contact Name" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "country", label: "Country" },
  { key: "phone", label: "Phone" },
  { key: "postalCode", label: "Postal Code" },
] as const;

type SearchField = (typeof fields)[number]["key"];

type LocalFilters = Omit<SupplierQueryParams, "page" | "limit">;

function SupplierFilters({ filters, onChange, onReset }: SupplierFiltersProps) {
  const [localFilters, setLocalFilters] = useState<LocalFilters>(() => {
    const { page, limit, ...searchFilters } = filters;
    return searchFilters;
  });

  // Sync local inputs when parent filters are reset or updated externally
  useEffect(() => {
    const { page, limit, ...searchFilters } = filters;
    setLocalFilters(searchFilters);
  }, [filters]);

  // Send search filters to parent only after 500ms of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedFilters: SupplierQueryParams = {
        ...localFilters,
        page: 1,
        limit: filters.limit ?? 10,
      };

      const currentSearchFilters = { ...filters };
      delete currentSearchFilters.page;
      delete currentSearchFilters.limit;

      const hasChanged = Object.keys({
        ...currentSearchFilters,
        ...localFilters,
      }).some((key) => {
        const typedKey = key as keyof LocalFilters;

        return (
          (currentSearchFilters as LocalFilters)[typedKey] !==
          localFilters[typedKey]
        );
      });

      if (hasChanged) {
        onChange(updatedFilters);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localFilters, filters, onChange]);

  const handleReset = () => {
    setLocalFilters({});
    onReset();
  };

  const handleInputChange = (key: SearchField, value: string) => {
    setLocalFilters((current) => ({
      ...current,
      [key]: value || undefined,
    }));
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-800">Filters</h2>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          <RotateCcw size={16} />
          Reset filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label
              htmlFor={`supplier-${key}`}
              className="mb-1.5 block text-sm font-medium text-slate-600"
            >
              {label}
            </label>

            <input
              id={`supplier-${key}`}
              type="text"
              value={localFilters[key] ?? ""}
              onChange={(event) => handleInputChange(key, event.target.value)}
              placeholder={`Search ${label.toLowerCase()}`}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SupplierFilters;
