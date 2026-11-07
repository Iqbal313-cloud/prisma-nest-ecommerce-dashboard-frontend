import { Search, X } from "lucide-react";

import type { OrderFilters as OrderFilterValues } from "../types/order.types";

interface OrderFiltersProps {
  filters: OrderFilterValues;
  onFilterChange: <K extends keyof OrderFilterValues>(
    key: K,
    value: OrderFilterValues[K],
  ) => void;
  onSearch: () => void;
  onClear: () => void;
}

function OrderFilters({
  filters,
  onFilterChange,
  onSearch,
  onClear,
}: OrderFiltersProps) {
  const hasFilter = Object.values(filters).some(
    (value) => value !== undefined && value !== null && value !== "",
  );

  const inputClass =
    "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500";

  return (
    <div className="space-y-4">
      {/* Main search */}
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={filters.search ?? ""}
            placeholder="Search customers, employees, products..."
            onChange={(event) =>
              onFilterChange("search", event.target.value || undefined)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") onSearch();
            }}
            className={`${inputClass} pl-9`}
          />
        </div>

        <select
          value={filters.orderStatus ?? ""}
          onChange={(event) =>
            onFilterChange("orderStatus", event.target.value || undefined)
          }
          className={`${inputClass} lg:w-[180px]`}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <button
          type="button"
          onClick={onSearch}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Search className="h-4 w-4" />
          Search
        </button>

        {hasFilter && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Advanced filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Order ID */}
        <input
          type="number"
          min="1"
          step="1"
          value={filters.orderId ?? ""}
          placeholder="Order ID"
          onChange={(event) => {
            const value = event.target.value;

            onFilterChange(
              "orderId",
              value && Number(value) > 0 ? Number(value) : undefined,
            );
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSearch();
          }}
          className={inputClass}
        />

        {/* Customer ID */}
        <input
          type="number"
          min="1"
          value={filters.customerId ?? ""}
          placeholder="Customer ID"
          onChange={(event) =>
            onFilterChange(
              "customerId",
              event.target.value ? Number(event.target.value) : undefined,
            )
          }
          className={inputClass}
        />

        {/* Customer name */}
        <input
          type="text"
          value={filters.customerName ?? ""}
          placeholder="Customer name"
          onChange={(event) =>
            onFilterChange("customerName", event.target.value || undefined)
          }
          className={inputClass}
        />

        {/* Customer phone */}
        <input
          type="text"
          value={filters.customerPhone ?? ""}
          placeholder="Customer phone"
          onChange={(event) =>
            onFilterChange("customerPhone", event.target.value || undefined)
          }
          className={inputClass}
        />

        {/* Employee ID */}
        <input
          type="number"
          min="1"
          value={filters.employeeId ?? ""}
          placeholder="Employee ID"
          onChange={(event) =>
            onFilterChange(
              "employeeId",
              event.target.value ? Number(event.target.value) : undefined,
            )
          }
          className={inputClass}
        />

        {/* Employee name */}
        <input
          type="text"
          value={filters.employeeName ?? ""}
          placeholder="Employee name"
          onChange={(event) =>
            onFilterChange("employeeName", event.target.value || undefined)
          }
          className={inputClass}
        />

        {/* Created By */}
        <input
          type="text"
          value={filters.createdByName ?? ""}
          placeholder="Created By"
          onChange={(event) =>
            onFilterChange("createdByName", event.target.value || undefined)
          }
          className={inputClass}
        />

        {/* Updated By */}
        <input
          type="text"
          value={filters.updatedByName ?? ""}
          placeholder="Updated By"
          onChange={(event) =>
            onFilterChange("updatedByName", event.target.value || undefined)
          }
          className={inputClass}
        />

        {/* Product name */}
        <input
          type="text"
          value={filters.productName ?? ""}
          placeholder="Product name"
          onChange={(event) =>
            onFilterChange("productName", event.target.value || undefined)
          }
          className={inputClass}
        />

        {/* From date */}
        <div>
          <label
            htmlFor="order-from-date"
            className="mb-1 block text-xs font-medium text-slate-500"
          >
            From date
          </label>
          <input
            id="order-from-date"
            type="date"
            value={filters.fromDate ?? ""}
            onChange={(event) =>
              onFilterChange("fromDate", event.target.value || undefined)
            }
            className={inputClass}
          />
        </div>

        {/* To date */}
        <div>
          <label
            htmlFor="order-to-date"
            className="mb-1 block text-xs font-medium text-slate-500"
          >
            To date
          </label>
          <input
            id="order-to-date"
            type="date"
            value={filters.toDate ?? ""}
            min={filters.fromDate}
            onChange={(event) =>
              onFilterChange("toDate", event.target.value || undefined)
            }
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderFilters;
