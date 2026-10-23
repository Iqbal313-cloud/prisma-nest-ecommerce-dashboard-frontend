import { useState } from "react";
import { Link } from "react-router-dom";

import { useGetSuppliersQuery } from "@/api/supplierApi";
import Pagination from "@/components/common/Pagination";
import useDebounce from "@/hooks/useDebounce";

import SupplierFilters from "../components/SupplierFilters";
import SupplierTable from "../components/SupplierTable";
import type { SupplierQueryParams } from "../types/supplier.types";

function SupplierListPage() {
  const [filters, setFilters] = useState<SupplierQueryParams>({
    page: 1,
    limit: 10,
  });

  // Debounce only the search filters, not pagination
  const { page = 1, limit = 10, ...searchFilters } = filters;

  const debouncedSearchFilters = useDebounce(searchFilters, 500);

  const queryParams: SupplierQueryParams = {
    ...debouncedSearchFilters,
    page,
    limit,
  };

  const { data, isLoading, isFetching, isError } =
    useGetSuppliersQuery(queryParams);

  const setPage = (newPage: number) => {
    setFilters((current) => ({
      ...current,
      page: newPage,
    }));
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters((current) => ({
      ...current,
      limit: newLimit,
      page: 1,
    }));
  };

  const handleFilterChange = (updatedFilters: SupplierQueryParams) => {
    setFilters((current) => ({
      ...current,
      ...updatedFilters,
      page: 1,
    }));
  };

  const handleFilterReset = () => {
    setFilters((current) => ({
      page: 1,
      limit: current.limit ?? 10,
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-slate-500">Loading suppliers...</div>
    );
  }

  if (isError || !data) {
    return (
      <div role="alert" className="p-6 text-sm text-red-600">
        Failed to load suppliers. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Suppliers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage suppliers and their products.
          </p>
        </div>

        <Link
          to="/suppliers/new"
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          Add Supplier
        </Link>
      </div>

      <SupplierFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isFetching && (
          <p className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500">
            Updating suppliers...
          </p>
        )}

        <SupplierTable suppliers={data.data} />

        <Pagination
          page={data.meta.page}
          lastPage={data.meta.lastPage}
          total={data.meta.total}
          limit={data.meta.limit}
          isFetching={isFetching}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
        />
      </div>
    </div>
  );
}

export default SupplierListPage;
