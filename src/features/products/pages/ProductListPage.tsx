import { useState } from "react";
import { Link } from "react-router-dom";

import { useGetProductsQuery } from "@/api/productApi";
import Pagination from "@/components/common/Pagination";

import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";

import type { ProductFilters as ProductFilterValues } from "../types/product.types";
import Loading from "@/common/Loading";

const DEFAULT_FILTERS: ProductFilterValues = {};

function ProductListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Form-এর temporary filter
  const [filters, setFilters] = useState<ProductFilterValues>(DEFAULT_FILTERS);

  // API-তে যেই filter পাঠানো হচ্ছে
  const [appliedFilters, setAppliedFilters] =
    useState<ProductFilterValues>(DEFAULT_FILTERS);

  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    page,
    limit,
    ...appliedFilters,
  });

  const handleFilterChange = <K extends keyof ProductFilterValues>(
    key: K,
    value: ProductFilterValues[K],
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    setPage(1);
    setAppliedFilters(filters);
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
  };

  if (isLoading) {
    return <Loading message="Loading products..." />;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-600">
          Failed to load products.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your products, inventory and product information.
          </p>
        </div>

        {/* Create Product Button */}
        <Link
          to="/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span className="text-lg leading-none">+</span>
          Create Product
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {data && <ProductTable products={data.data} />}

        {data && (
          <Pagination
            page={data.meta.page}
            lastPage={data.meta.lastPage}
            total={data.meta.total}
            limit={data.meta.limit}
            isFetching={isFetching}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
