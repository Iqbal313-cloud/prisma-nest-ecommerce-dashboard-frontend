import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetCustomersQuery } from "@/api/customerApi";
import Pagination from "@/components/common/Pagination";
import CustomerFilters from "../components/CustomerFilters";
import CustomerTable from "../components/CustomerTable";
import type { CustomerFilters as CustomerFilterValues } from "../types/customer.types";

export default function CustomerListPage() {
  const [filters, setFilters] = useState<CustomerFilterValues>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetCustomersQuery({
      ...filters,
      page,
      limit,
    });

  const customers = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const lastPage = Math.max(data?.meta.lastPage ?? 1, 1);

  function handleLimitChange(newLimit: number) {
    setLimit(newLimit);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your customer records.
          </p>
        </div>

        <Link
          to="/customers/new"
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          + Add Customer
        </Link>
      </div>

      <CustomerFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({})}
      />

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">Failed to load customers.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      ) : isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading customers...
        </div>
      ) : (
        <>
          <CustomerTable customers={customers} />

          <Pagination
            page={page}
            lastPage={lastPage}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
            isFetching={isFetching}
          />
        </>
      )}
    </div>
  );
}
