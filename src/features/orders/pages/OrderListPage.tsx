import { useState } from "react";
import { Link } from "react-router-dom";

import Pagination from "@/components/common/Pagination";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

import OrderFilters from "../components/OrderFilters";
import OrderTable from "../components/OrderTable";

import type { OrderFilters as OrderFilterValues } from "../types/order.types";
import { useGetOrdersQuery } from "@/api/orderApi";

const DEFAULT_FILTERS: OrderFilterValues = {};

function OrderListPage() {
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filters being edited
  const [filters, setFilters] = useState<OrderFilterValues>(DEFAULT_FILTERS);

  // Filters applied to the API
  const [appliedFilters, setAppliedFilters] =
    useState<OrderFilterValues>(DEFAULT_FILTERS);

  // Fetch orders
  const { data, isLoading, isFetching, isError, refetch } = useGetOrdersQuery({
    page,
    limit,
    ...appliedFilters,
  });

  // Update filter values
  const handleFilterChange = <K extends keyof OrderFilterValues>(
    key: K,
    value: OrderFilterValues[K],
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  // Apply filters
  const handleSearch = () => {
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  // Clear filters
  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  // Change pagination limit
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Initial loading
  if (isLoading) {
    return <Loading message="Loading orders..." />;
  }

  // Error
  if (isError) {
    return (
      <div className="space-y-4">
        <ErrorMessage message="Failed to load orders. Please try again." />

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage customer orders, order items and order status.
          </p>
        </div>

        <Link
          to="/orders/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <span className="text-lg leading-none">+</span>
          Create Order
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <OrderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      </div>

      {/* Order table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isFetching && (
          <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500">
            Updating orders...
          </div>
        )}

        <OrderTable orders={data?.data ?? []} />

        {/* Pagination */}
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

export default OrderListPage;
