import { AlertCircle, RefreshCw } from "lucide-react";
import {
  useGetOrderAnalyticsQuery,
  useGetOrderTrendsQuery,
} from "@/api/analyticsApi";
import OrderStatusChart from "../components/OrderStatusChart";
import SalesTrendChart from "../components/SalesTrendChart";
import type { AnalyticsGroupBy } from "../types/analytics.types";
import { useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import AnalyticsPageHeader from "./AnalyticsPageHeader";
import AnalyticsNavigation from "../components/AnalyticsNavigation";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

const statuses = [
  { key: "pending", label: "Pending", color: "bg-amber-500" },
  { key: "processing", label: "Processing", color: "bg-blue-500" },
  { key: "shipped", label: "Shipped", color: "bg-violet-500" },
  { key: "delivered", label: "Delivered", color: "bg-emerald-500" },
  { key: "cancelled", label: "Cancelled", color: "bg-red-500" },
] as const;

export default function OrderAnalyticsPage() {
  const [groupBy, setGroupBy] = useState<AnalyticsGroupBy>("day");
  const { data, isLoading, isError, refetch } = useGetOrderAnalyticsQuery();
  const trends = useGetOrderTrendsQuery({ groupBy });

  if (isLoading) {
    return (
      <Loading message="Loading order analytics..." minHeight="min-h-[300px]" />
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-3">
        <ErrorMessage message="Unable to load order analytics." />

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalyticsPageHeader
        title="Order Analytics"
        description="Order status and order volume over time."
      />

      <div className="mt-5 border-t border-slate-100 pt-4">
        <AnalyticsNavigation onRefresh={refetch} />
      </div>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {statuses.map((status) => (
          <div
            key={status.key}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className={`h-2.5 w-2.5 rounded-full ${status.color}`} />
              {status.label}
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {data.summary[status.key].toLocaleString("en-BD")}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <OrderStatusChart />

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">Order Trends</h2>
              <p className="mt-1 text-sm text-slate-500">
                Orders grouped by time period.
              </p>
            </div>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as AnalyticsGroupBy)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>

          {trends.isLoading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Loading trends...
            </div>
          ) : trends.isError ? (
            <p className="py-16 text-center text-sm text-red-500">
              Unable to load order trends.
            </p>
          ) : !trends.data?.trends.length ? (
            <p className="py-16 text-center text-sm text-slate-500">
              No order trend data available.
            </p>
          ) : (
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends.data.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="orderCount"
                    name="Orders"
                    stroke="#ea580c"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
