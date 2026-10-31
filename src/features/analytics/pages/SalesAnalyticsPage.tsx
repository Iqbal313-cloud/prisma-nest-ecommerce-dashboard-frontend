import { useState } from "react";
import {
  AlertCircle,
  RefreshCw,
  Wallet,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  useGetSalesSummaryQuery,
  useGetSalesComparisonQuery,
} from "@/api/analyticsApi";
import SalesTrendChart from "../components/SalesTrendChart";
import AnalyticsStatCard from "../components/AnalyticsStatCard";
import AnalyticsPageHeader from "./AnalyticsPageHeader";
import AnalyticsNavigation from "../components/AnalyticsNavigation";
import ErrorMessage from "@/components/common/ErrorMessage";
import Loading from "@/components/common/Loading";

const currency = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(value);

export default function SalesAnalyticsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const params = {
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  };

  const {
    data: summary,
    isLoading,
    isError,
    refetch,
  } = useGetSalesSummaryQuery(params);

  const { data: comparison } = useGetSalesComparisonQuery({ period });

  if (isLoading) {
    return (
      <Loading message="Loading sales analytics..." minHeight="min-h-[300px]" />
    );
  }

  if (isError || !summary) {
    return (
      <div className="space-y-3">
        <ErrorMessage message="Unable to load sales analytics." />

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

  const cards = [
    {
      title: "Total Revenue",
      value: currency(summary.totalRevenue),
      icon: Wallet,
      iconColor: "text-emerald-600",
    },
    {
      title: "Delivered Orders",
      value: summary.deliveredOrders.toLocaleString("en-BD"),
      icon: ShoppingCart,
      iconColor: "text-blue-600",
    },
    {
      title: "Average Order Value",
      value: currency(summary.averageOrderValue),
      icon: TrendingUp,
      iconColor: "text-violet-600",
    },
  ];

  return (
    <div className="space-y-6">
      <AnalyticsPageHeader
        title="Sales Analytics"
        description="Revenue and sales performance."
      />

      <div className="mt-5 border-t border-slate-100 pt-4">
        <AnalyticsNavigation onRefresh={refetch} />
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <label className="text-sm text-slate-600">
          From
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 block rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-600">
          To
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 block rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <button
          onClick={() => {
            setFrom("");
            setTo("");
          }}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
        >
          Clear dates
        </button>
      </div>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <AnalyticsStatCard key={card.title} {...card} />
        ))}
      </section>

      <SalesTrendChart />

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-900">Revenue Comparison</h2>
            <p className="mt-1 text-sm text-slate-500">
              Current period vs previous period
            </p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
          </select>
        </div>

        {comparison ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Current revenue</p>
              <p className="mt-1 text-xl font-bold">
                {currency(comparison.current.revenue)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Previous revenue</p>
              <p className="mt-1 text-xl font-bold">
                {currency(comparison.previous.revenue)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Revenue change</p>
              <p
                className={`mt-1 text-xl font-bold ${comparison.revenueChange >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {comparison.revenueChangePercent == null
                  ? "N/A"
                  : `${comparison.revenueChangePercent > 0 ? "+" : ""}${comparison.revenueChangePercent.toFixed(1)}%`}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-500">Loading comparison...</p>
        )}
      </section>
    </div>
  );
}
