import { useState } from "react";
import { RefreshCw, TrendingUp } from "lucide-react";

import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import Pagination from "@/components/common/Pagination";
import { useGetTopQueriesQuery } from "@/api/monitoringApi";

import TopQueriesTable from "../components/TopQueriesTable";
import MonitoringNavigation from "../components/MonitoringNavigation";

export default function TopQueriesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: topQueries,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetTopQueriesQuery({ page, limit });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  if (isLoading) {
    return (
      <Loading message="Loading top queries..." minHeight="min-h-[300px]" />
    );
  }

  if (isError || !topQueries) {
    return <ErrorMessage message="Unable to load top queries." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-orange-600" />

          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Top Queries
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Analyze the most frequently executed database queries.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Monitoring Navigation */}
      <MonitoringNavigation />

      {/* Table + Pagination */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <TopQueriesTable data={topQueries} />

        <Pagination
          page={topQueries.meta.page}
          lastPage={topQueries.meta.lastPage}
          total={topQueries.meta.total}
          limit={topQueries.meta.limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}
