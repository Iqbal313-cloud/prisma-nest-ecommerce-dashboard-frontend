// import { RefreshCw, History } from "lucide-react";

// import Loading from "@/components/common/Loading";
// import ErrorMessage from "@/components/common/ErrorMessage";
// import { useGetRecentQueriesQuery } from "@/api/monitoringApi";

// import RecentQueriesTable from "../components/RecentQueriesTable";
// import MonitoringNavigation from "../components/MonitoringNavigation";

// export default function RecentQueriesPage() {
//   const {
//     data: recentQueries,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetRecentQueriesQuery({ limit: 100 });

//   if (isLoading) {
//     return (
//       <Loading message="Loading recent queries..." minHeight="min-h-[300px]" />
//     );
//   }

//   if (isError || !recentQueries) {
//     return <ErrorMessage message="Unable to load recent queries." />;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div className="flex items-center gap-2">
//           <History className="h-6 w-6 text-orange-600" />

//           <div>
//             <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
//               Recent Queries
//             </h1>

//             <p className="mt-1 text-sm text-slate-500">
//               View the latest database queries and their execution statistics.
//             </p>
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={refetch}
//           className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
//         >
//           <RefreshCw size={16} />
//           Refresh
//         </button>
//       </div>

//       {/* Monitoring Navigation */}
//       <MonitoringNavigation />

//       {/* Page Content */}
//       <RecentQueriesTable data={recentQueries} />
//     </div>
//   );
// }

import { useState } from "react";
import { RefreshCw, History } from "lucide-react";

import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import Pagination from "@/components/common/Pagination";
import { useGetRecentQueriesQuery } from "@/api/monitoringApi";

import RecentQueriesTable from "../components/RecentQueriesTable";
import MonitoringNavigation from "../components/MonitoringNavigation";

export default function RecentQueriesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: recentQueries,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetRecentQueriesQuery({ page, limit });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  if (isLoading) {
    return (
      <Loading message="Loading recent queries..." minHeight="min-h-[300px]" />
    );
  }

  if (isError || !recentQueries) {
    return <ErrorMessage message="Unable to load recent queries." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-orange-600" />

          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Recent Queries
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View the latest database queries and their execution statistics.
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
        <RecentQueriesTable data={recentQueries} />

        <Pagination
          page={recentQueries.meta.page}
          lastPage={recentQueries.meta.lastPage}
          total={recentQueries.meta.total}
          limit={recentQueries.meta.limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}
