import { RotateCcw } from "lucide-react";
import type { EmployeeQueryParams } from "../types/employee.types";

interface EmployeeFiltersProps {
  filters: EmployeeQueryParams;
  onChange: (filters: EmployeeQueryParams) => void;
  onReset: () => void;
}

export default function EmployeeFilters({
  filters,
  onChange,
  onReset,
}: EmployeeFiltersProps) {
  function updateFilter(key: keyof EmployeeQueryParams, value: string) {
    onChange({
      ...filters,
      [key]: value === "" ? undefined : value,
      page: 1,
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="number"
          min="1"
          placeholder="Employee ID"
          value={filters.id ?? ""}
          onChange={(e) => updateFilter("id", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
        />

        <input
          type="text"
          placeholder="First name"
          value={filters.firstName ?? ""}
          onChange={(e) => updateFilter("firstName", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
        />

        <input
          type="text"
          placeholder="Last name"
          value={filters.lastName ?? ""}
          onChange={(e) => updateFilter("lastName", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
        />

        <input
          type="date"
          aria-label="Birth date"
          value={filters.birthDate ?? ""}
          onChange={(e) => updateFilter("birthDate", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
        />

        <input
          type="number"
          min="1"
          placeholder="Order ID"
          value={filters.orderId ?? ""}
          onChange={(e) => updateFilter("orderId", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
        />

        <input
          type="date"
          aria-label="Order date"
          value={filters.orderDate ?? ""}
          onChange={(e) => updateFilter("orderDate", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
        />

        <select
          aria-label="Order status"
          value={filters.orderStatus ?? ""}
          onChange={(e) => updateFilter("orderStatus", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
        >
          <option value="">All order statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          <RotateCcw size={15} />
          Reset filters
        </button>
      </div>
    </div>
  );
}
