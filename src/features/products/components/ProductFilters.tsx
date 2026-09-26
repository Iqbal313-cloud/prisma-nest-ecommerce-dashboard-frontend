import { Search, X } from "lucide-react";

import type { ProductFilters as ProductFilterValues } from "../types/product.types";

interface ProductFiltersProps {
  filters: ProductFilterValues;
  onFilterChange: <K extends keyof ProductFilterValues>(
    key: K,
    value: ProductFilterValues[K],
  ) => void;
  onSearch: () => void;
  onClear: () => void;
}

function ProductFilters({
  filters,
  onFilterChange,
  onSearch,
  onClear,
}: ProductFiltersProps) {
  const hasFilter =
    !!filters.productName?.trim() ||
    !!filters.slug?.trim() ||
    !!filters.sku?.trim() ||
    filters.categoryId !== undefined ||
    filters.supplierId !== undefined ||
    filters.discontinued !== undefined ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  return (
    <div className="space-y-4">
      {/* Main Search */}
      <div className="flex flex-col gap-3 lg:flex-row">
        {/* Product Name */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={filters.productName ?? ""}
            placeholder="Search product..."
            onChange={(event) =>
              onFilterChange("productName", event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSearch();
              }
            }}
            className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
          />
        </div>

        {/* SKU */}
        <input
          type="text"
          value={filters.sku ?? ""}
          placeholder="SKU"
          onChange={(event) => onFilterChange("sku", event.target.value)}
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 lg:w-[180px]"
        />

        {/* Category */}
        <select
          value={filters.categoryId ?? ""}
          onChange={(event) =>
            onFilterChange(
              "categoryId",
              event.target.value ? Number(event.target.value) : undefined,
            )
          }
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 lg:w-[190px]"
        >
          <option value="">All Categories</option>
          {/* Categories API থেকে আসবে */}
        </select>

        {/* Status */}
        <select
          value={
            filters.discontinued === undefined
              ? ""
              : filters.discontinued
                ? "true"
                : "false"
          }
          onChange={(event) => {
            const value = event.target.value;

            onFilterChange(
              "discontinued",
              value === "" ? undefined : value === "true",
            );
          }}
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 lg:w-[160px]"
        >
          <option value="">All Status</option>
          <option value="false">Active</option>
          <option value="true">Discontinued</option>
        </select>

        {/* Search */}
        <button
          type="button"
          onClick={onSearch}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Search className="h-4 w-4" />
          Search
        </button>

        {/* Clear */}
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

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Slug */}
        <input
          type="text"
          value={filters.slug ?? ""}
          placeholder="Slug"
          onChange={(event) => onFilterChange("slug", event.target.value)}
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />

        {/* Supplier */}
        <select
          value={filters.supplierId ?? ""}
          onChange={(event) =>
            onFilterChange(
              "supplierId",
              event.target.value ? Number(event.target.value) : undefined,
            )
          }
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        >
          <option value="">All Suppliers</option>
          {/* Suppliers API থেকে আসবে */}
        </select>

        {/* Min Price */}
        <input
          type="number"
          min="0"
          value={filters.minPrice ?? ""}
          placeholder="Min price"
          onChange={(event) =>
            onFilterChange(
              "minPrice",
              event.target.value ? Number(event.target.value) : undefined,
            )
          }
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />

        {/* Max Price */}
        <input
          type="number"
          min="0"
          value={filters.maxPrice ?? ""}
          placeholder="Max price"
          onChange={(event) =>
            onFilterChange(
              "maxPrice",
              event.target.value ? Number(event.target.value) : undefined,
            )
          }
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
      </div>
    </div>
  );
}

export default ProductFilters;
