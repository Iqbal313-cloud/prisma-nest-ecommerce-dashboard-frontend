import { useEffect, useState } from "react";
import type { SupplierQueryParams } from "../types/supplier.types";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

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
  { key: "createdByName", label: "Created By" },
  { key: "updatedByName", label: "Updated By" },
] as const;

type SearchField = (typeof fields)[number]["key"];

type LocalFilters = Omit<SupplierQueryParams, "page" | "limit">;

function SupplierFilters({ filters, onChange, onReset }: SupplierFiltersProps) {
  const [localFilters, setLocalFilters] = useState<LocalFilters>(() => {
    const { page, limit, ...searchFilters } = filters;
    return searchFilters;
  });

  useEffect(() => {
    const { page, limit, ...searchFilters } = filters;
    setLocalFilters(searchFilters);
  }, [filters]);

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

  const handleSearch = () => {
    onChange({
      ...localFilters,
      page: 1,
      limit: filters.limit ?? 10,
    });
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700">
          <SlidersHorizontal size={18} className="text-slate-500" />
          Filters
        </h2>

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

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSearch}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <Search size={16} />
          Search
        </button>
      </div>
    </div>
  );
}

export default SupplierFilters;
