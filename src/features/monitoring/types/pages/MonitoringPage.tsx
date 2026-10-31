import { RefreshCw, DatabaseCheck } from "lucide-react";

import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useGetMonitoringSummaryQuery } from "@/api/monitoringApi";

import MonitoringSummary from "../components/MonitoringSummary";
import MonitoringNavigation from "../components/MonitoringNavigation";

export default function MonitoringPage() {
  const {
    data: summary,
    isLoading,
    isError,
    refetch,
  } = useGetMonitoringSummaryQuery();

  if (isLoading) {
    return (
      <Loading
        message="Loading database metrics..."
        minHeight="min-h-[300px]"
      />
    );
  }

  if (isError || !summary) {
    return (
      <ErrorMessage message="Unable to load database monitoring metrics." />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <DatabaseCheck className="h-6 w-6 text-orange-600" />

            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Database Overview
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Monitor database size, connections and query statistics.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Monitoring Navigation */}
      <MonitoringNavigation />

      {/* Database Summary */}
      <MonitoringSummary data={summary} />

      {/* Last Updated */}
      <div className="text-right text-xs text-slate-400">
        Last updated: {new Date(summary.generatedAt).toLocaleString()}
      </div>
    </div>
  );
}
