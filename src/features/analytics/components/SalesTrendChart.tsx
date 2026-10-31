import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetSalesTrendsQuery } from "@/api/analyticsApi";
import type { AnalyticsGroupBy } from "../types/analytics.types";

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-BD");

function formatDate(value: string, groupBy: AnalyticsGroupBy) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  if (groupBy === "month") {
    return date.toLocaleDateString("en-BD", {
      month: "short",
      year: "2-digit",
    });
  }

  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
  });
}

export default function SalesTrendChart() {
  const [groupBy, setGroupBy] = useState<AnalyticsGroupBy>("day");

  const { data, isLoading, isError, refetch } = useGetSalesTrendsQuery({
    groupBy,
  });

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Sales Trends</h2>
          <p className="mt-1 text-sm text-slate-500">
            Revenue generated from delivered orders.
          </p>
        </div>

        <select
          value={groupBy}
          onChange={(event) =>
            setGroupBy(event.target.value as AnalyticsGroupBy)
          }
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          aria-label="Sales trend grouping"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      {isLoading ? (
        <div className="h-80 animate-pulse rounded-lg bg-slate-100" />
      ) : isError ? (
        <div className="flex h-80 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-red-600">Unable to load sales trends.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Retry
          </button>
        </div>
      ) : !data?.trends.length ? (
        <div className="flex h-80 items-center justify-center text-sm text-slate-500">
          No sales trend data available.
        </div>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.trends}
              margin={{ top: 10, right: 12, left: 8, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="date"
                tickFormatter={(value: string) => formatDate(value, groupBy)}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                minTickGap={24}
              />

              <YAxis
                yAxisId="revenue"
                tickFormatter={(value: number) => numberFormatter.format(value)}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={65}
              />

              <YAxis yAxisId="orders" orientation="right" hide />

              <Tooltip
                labelFormatter={(value) => formatDate(String(value), groupBy)}
                formatter={(value, name) => {
                  if (name === "Revenue") {
                    return [currencyFormatter.format(Number(value)), name];
                  }

                  return [numberFormatter.format(Number(value)), name];
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />

              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="totalRevenue"
                name="Revenue"
                stroke="#ea580c"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="orderCount"
                name="Orders"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
