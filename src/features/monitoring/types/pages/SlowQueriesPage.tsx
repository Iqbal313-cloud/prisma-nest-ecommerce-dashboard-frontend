// import { RefreshCw, Gauge } from "lucide-react";

// import Loading from "@/components/common/Loading";
// import ErrorMessage from "@/components/common/ErrorMessage";
// import { useGetSlowQueriesQuery } from "@/api/monitoringApi";

// import SlowQueriesTable from "../components/SlowQueriesTable";
// import MonitoringNavigation from "../components/MonitoringNavigation";

// export default function SlowQueriesPage() {
//   const {
//     data: slowQueries,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetSlowQueriesQuery({ limit: 100 });

//   if (isLoading) {
//     return (
//       <Loading message="Loading slow queries..." minHeight="min-h-[300px]" />
//     );
//   }

//   if (isError || !slowQueries) {
//     return <ErrorMessage message="Unable to load slow queries." />;
//   }

// return (
//   <div className="space-y-6">
//     {/* Page Header */}
//     <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//       <div className="flex items-center gap-2">
//         <Gauge className="h-6 w-6 text-orange-600" />

//         <div>
//           <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
//             Slow Queries
//           </h1>

//           <p className="mt-1 text-sm text-slate-500">
//             Identify queries with the highest execution times.
//           </p>
//         </div>
//       </div>

//       <button
//         type="button"
//         onClick={refetch}
//         className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
//       >
//         <RefreshCw size={16} />
//         Refresh
//       </button>
//     </div>

//     {/* Monitoring Navigation */}
//     <MonitoringNavigation />

//     {/* Page Content */}
//     <SlowQueriesTable data={slowQueries} />
//   </div>
// );

// }

import { useState } from "react";
import { RefreshCw, Gauge } from "lucide-react";

import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import Pagination from "@/components/common/Pagination";
import { useGetSlowQueriesQuery } from "@/api/monitoringApi";

import SlowQueriesTable from "../components/SlowQueriesTable";
import MonitoringNavigation from "../components/MonitoringNavigation";

export default function SlowQueriesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: slowQueries,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetSlowQueriesQuery({ page, limit });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  if (isLoading) {
    return (
      <Loading message="Loading slow queries..." minHeight="min-h-[300px]" />
    );
  }

  if (isError || !slowQueries) {
    return <ErrorMessage message="Unable to load slow queries." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Gauge className="h-6 w-6 text-orange-600" />

          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Slow Queries
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Identify queries with the highest execution times.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Monitoring Navigation */}
      <MonitoringNavigation />

      {/* Table + Pagination */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <SlowQueriesTable data={slowQueries} />

        <Pagination
          page={slowQueries.meta.page}
          lastPage={slowQueries.meta.lastPage}
          total={slowQueries.meta.total}
          limit={slowQueries.meta.limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}
