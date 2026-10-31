import { useState } from "react";
import { Search, X } from "lucide-react";

import { useGetCategoriesQuery } from "@/api/categoryApi";
import { useGetSuppliersQuery } from "@/api/supplierApi";
import SearchableSelect, {
  type SelectOption,
} from "@/components/common/SearchableSelect";
import useDebounce from "@/hooks/useDebounce";

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
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  const [supplierSearch, setSupplierSearch] = useState("");

  // Keep the selected supplier separately from the current search results.
  const [selectedSupplier, setSelectedSupplier] =
    useState<SelectOption<string> | null>(null);

  const debouncedSupplierSearch = useDebounce(supplierSearch, 500);

  const { data: suppliersData, isFetching: isSuppliersLoading } =
    useGetSuppliersQuery({
      page: 1,
      limit: 20,
      supplierName: debouncedSupplierSearch.trim() || undefined,
    });

  const suppliers = suppliersData?.data ?? [];

  const supplierOptions: SelectOption<string>[] = suppliers.map((supplier) => ({
    value: String(supplier.id),
    label: supplier.supplierName,
  }));

  const currentSupplierId =
    filters.supplierId == null ? undefined : String(filters.supplierId);

  const matchedSupplier = supplierOptions.find(
    (option) => option.value === currentSupplierId,
  );

  const effectiveSelectedSupplier =
    matchedSupplier ??
    (selectedSupplier?.value === currentSupplierId ? selectedSupplier : null);

  // Always include the selected supplier, even when it is absent
  // from the latest server-side search results.
  const optionsWithSelectedSupplier =
    effectiveSelectedSupplier &&
    !supplierOptions.some(
      (option) => option.value === effectiveSelectedSupplier.value,
    )
      ? [effectiveSelectedSupplier, ...supplierOptions]
      : supplierOptions;

  const hasFilter =
    !!filters.productName?.trim() ||
    !!filters.slug?.trim() ||
    !!filters.sku?.trim() ||
    filters.categoryId != null ||
    filters.supplierId != null ||
    filters.discontinued !== undefined ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    !!supplierSearch.trim();

  const inputClassName =
    "h-10 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500";

  const labelClassName = "mb-1.5 block text-sm font-medium text-slate-700";

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  const handleSupplierChange = (value: string | undefined) => {
    if (value === undefined) {
      setSelectedSupplier(null);
      onFilterChange("supplierId", undefined);
      setSupplierSearch("");
      return;
    }

    const option = optionsWithSelectedSupplier.find(
      (supplier) => supplier.value === value,
    );

    if (option) {
      setSelectedSupplier(option);
    }

    onFilterChange("supplierId", value);
    setSupplierSearch("");
  };

  const handleClear = () => {
    setSupplierSearch("");
    setSelectedSupplier(null);
    onClear();
  };

  return (
    <div className="space-y-5">
      {/* Main Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Product Name */}
        <div className="min-w-0">
          <label htmlFor="product-name" className={labelClassName}>
            Product Name
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="product-name"
              type="text"
              value={filters.productName ?? ""}
              placeholder="Search product..."
              onChange={(event) =>
                onFilterChange("productName", event.target.value)
              }
              onKeyDown={handleEnterKey}
              className={`${inputClassName} pl-9`}
            />
          </div>
        </div>

        {/* SKU */}
        <div className="min-w-0">
          <label htmlFor="product-sku" className={labelClassName}>
            SKU
          </label>

          <input
            id="product-sku"
            type="text"
            value={filters.sku ?? ""}
            placeholder="Enter SKU"
            onChange={(event) => onFilterChange("sku", event.target.value)}
            onKeyDown={handleEnterKey}
            className={inputClassName}
          />
        </div>

        {/* Category */}
        <div className="min-w-0">
          <label htmlFor="product-category" className={labelClassName}>
            Category
          </label>

          <SearchableSelect
            inputId="product-category"
            options={categories.map((category) => ({
              value: category.id,
              label: category.categoryName,
            }))}
            value={filters.categoryId}
            onChange={(value) => onFilterChange("categoryId", value)}
            placeholder="All Categories"
            isLoading={isCategoriesLoading}
            noOptionsMessage="No categories found"
          />
        </div>

        {/* Status */}
        <div className="min-w-0">
          <label htmlFor="product-status" className={labelClassName}>
            Status
          </label>

          <select
            id="product-status"
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
            className={`${inputClassName} cursor-pointer text-slate-700`}
          >
            <option value="">All Status</option>
            <option value="false">Active</option>
            <option value="true">Discontinued</option>
          </select>
        </div>
      </div>

      <div className="border-t border-slate-200" />

      {/* Advanced Filters */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-800">
          Advanced Filters
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Slug */}
          <div className="min-w-0">
            <label htmlFor="product-slug" className={labelClassName}>
              Slug
            </label>

            <input
              id="product-slug"
              type="text"
              value={filters.slug ?? ""}
              placeholder="Enter slug"
              onChange={(event) => onFilterChange("slug", event.target.value)}
              onKeyDown={handleEnterKey}
              className={inputClassName}
            />
          </div>

          {/* Supplier */}
          <div className="min-w-0">
            <label htmlFor="product-supplier" className={labelClassName}>
              Supplier
            </label>

            <SearchableSelect
              inputId="product-supplier"
              options={optionsWithSelectedSupplier}
              value={currentSupplierId}
              onChange={handleSupplierChange}
              inputValue={supplierSearch}
              onInputChange={setSupplierSearch}
              placeholder="Search suppliers..."
              isLoading={isSuppliersLoading}
              noOptionsMessage={
                debouncedSupplierSearch.trim()
                  ? "No matching suppliers found"
                  : "No suppliers found"
              }
            />
          </div>

          {/* Min Price */}
          <div className="min-w-0">
            <label htmlFor="product-min-price" className={labelClassName}>
              Min Price
            </label>

            <input
              id="product-min-price"
              type="number"
              min="0"
              value={filters.minPrice ?? ""}
              placeholder="Minimum price"
              onChange={(event) =>
                onFilterChange(
                  "minPrice",
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
              onKeyDown={handleEnterKey}
              className={inputClassName}
            />
          </div>

          {/* Max Price */}
          <div className="min-w-0">
            <label htmlFor="product-max-price" className={labelClassName}>
              Max Price
            </label>

            <input
              id="product-max-price"
              type="number"
              min="0"
              value={filters.maxPrice ?? ""}
              placeholder="Maximum price"
              onChange={(event) =>
                onFilterChange(
                  "maxPrice",
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
              onKeyDown={handleEnterKey}
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-end">
        {hasFilter && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        )}

        <button
          type="button"
          onClick={onSearch}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </div>
  );
}

export default ProductFilters;
