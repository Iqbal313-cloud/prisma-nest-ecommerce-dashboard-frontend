import { RotateCcw } from "lucide-react";
import type { CustomerFilters as CustomerFilterValues } from "../types/customer.types";

interface CustomerFiltersProps {
  filters: CustomerFilterValues;
  onChange: (filters: CustomerFilterValues) => void;
  onReset: () => void;
}

export default function CustomerFilters({
  filters,
  onChange,
  onReset,
}: CustomerFiltersProps) {
  const updateFilter = (field: keyof CustomerFilterValues, value: string) => {
    onChange({ ...filters, [field]: value || undefined });
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          className={inputClass}
          placeholder="First name"
          value={filters.firstName ?? ""}
          onChange={(e) => updateFilter("firstName", e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Last name"
          value={filters.lastName ?? ""}
          onChange={(e) => updateFilter("lastName", e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Phone number"
          value={filters.phoneNumber ?? ""}
          onChange={(e) => updateFilter("phoneNumber", e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Address"
          value={filters.address ?? ""}
          onChange={(e) => updateFilter("address", e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Created By"
          value={filters.createdByName ?? ""}
          onChange={(e) => updateFilter("createdByName", e.target.value)}
        />

        <input
          className={inputClass}
          placeholder="Updated By"
          value={filters.updatedByName ?? ""}
          onChange={(e) => updateFilter("updatedByName", e.target.value)}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          <RotateCcw size={16} />
          Reset filters
        </button>
      </div>
    </div>
  );
}
