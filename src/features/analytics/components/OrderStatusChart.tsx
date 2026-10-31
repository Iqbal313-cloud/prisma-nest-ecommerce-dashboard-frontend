import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useGetOrderAnalyticsQuery } from "@/api/analyticsApi";

const COLORS: Record<string, string> = {
  Pending: "#f59e0b",
  Processing: "#3b82f6",
  Shipped: "#8b5cf6",
  Delivered: "#10b981",
  Cancelled: "#ef4444",
};

const numberFormatter = new Intl.NumberFormat("en-BD");

export default function OrderStatusChart() {
  const { data, isLoading, isError, refetch } = useGetOrderAnalyticsQuery();

  const distribution = data?.distribution;

  const chartData = distribution
    ? [
        { name: "Pending", value: distribution.pending },
        { name: "Processing", value: distribution.processing },
        { name: "Shipped", value: distribution.shipped },
        { name: "Delivered", value: distribution.delivered },
        { name: "Cancelled", value: distribution.cancelled },
      ]
    : [];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Order Status</h2>
        <p className="mt-1 text-sm text-slate-500">
          Breakdown of orders by status.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-red-600">Unable to load order status.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Retry
          </button>
        </div>
      ) : total === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">
          No order data available.
        </div>
      ) : (
        <>
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    numberFormatter.format(Number(value)),
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">
                {numberFormatter.format(total)}
              </span>
              <span className="text-xs text-slate-500">Total orders</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {chartData.map((item) => {
              const percentage = (item.value / total) * 100;

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: COLORS[item.name] }}
                    />
                    <span className="truncate text-sm text-slate-600">
                      {item.name}
                    </span>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      {numberFormatter.format(item.value)}
                    </span>
                    <span className="ml-2 text-xs text-slate-500">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
