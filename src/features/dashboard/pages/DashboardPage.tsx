import {
  Package,
  Tags,
  Users,
  UserRound,
  Truck,
  ShoppingCart,
  Clock,
  Cog,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAnalyticsOverviewQuery } from "../../../api/analyticsApi";
import Loading from "../../../components/common/Loading";
import ErrorMessage from "../../../components/common/ErrorMessage";
import EmptyState from "../../../components/common/EmptyState";

function DashboardPage() {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetAnalyticsOverviewQuery();
  if (isLoading) {
    return <Loading message="Loading dashboard analytics..." />;
  }
  if (isError) {
    return (
      <ErrorMessage message="Failed to load analytics. Please try again later." />
    );
  }
  if (!data) {
    return (
      <EmptyState
        title="No analytics available"
        description="Dashboard analytics are not available right now. Please try again later."
        icon={Boxes}
      />
    );
  }
  
  const { summary, orders, inventory, sales } = data;
  const formatNumber = (value: number) => value.toLocaleString();
  const formatCurrency = (value: number) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const summaryCards = [
    {
      title: "Total Products",
      value: summary.totalProducts,
      icon: Package,
      color: "blue",
      description: "Products in catalog",
    },
    {
      title: "Total Categories",
      value: summary.totalCategories,
      icon: Tags,
      color: "violet",
      description: "Product categories",
    },
    {
      title: "Total Customers",
      value: summary.totalCustomers,
      icon: Users,
      color: "emerald",
      description: "Registered customers",
    },
    {
      title: "Total Employees",
      value: summary.totalEmployees,
      icon: UserRound,
      color: "amber",
      description: "Employees in system",
    },
    {
      title: "Total Suppliers",
      value: summary.totalSuppliers,
      icon: Truck,
      color: "cyan",
      description: "Registered suppliers",
    },
    {
      title: "Total Orders",
      value: summary.totalOrders,
      icon: ShoppingCart,
      color: "rose",
      description: "All recorded orders",
    },
  ];
  const orderStatuses = [
    {
      label: "Pending",
      value: orders.pending,
      icon: Clock,
      color: "text-amber-700",
      bg: "bg-amber-50",
      bar: "bg-amber-500",
    },
    {
      label: "Processing",
      value: orders.processing,
      icon: Cog,
      color: "text-blue-700",
      bg: "bg-blue-50",
      bar: "bg-blue-500",
    },
    {
      label: "Shipped",
      value: orders.shipped,
      icon: Truck,
      color: "text-violet-700",
      bg: "bg-violet-50",
      bar: "bg-violet-500",
    },
    {
      label: "Delivered",
      value: orders.delivered,
      icon: CheckCircle2,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      bar: "bg-emerald-500",
    },
    {
      label: "Cancelled",
      value: orders.cancelled,
      icon: XCircle,
      color: "text-red-700",
      bg: "bg-red-50",
      bar: "bg-red-500",
    },
  ];
  const totalStatusOrders = orderStatuses.reduce(
    (total, status) => total + status.value,
    0,
  );
  const inventoryCards = [
    {
      title: "Low Stock",
      value: inventory.lowStock,
      description: "Products with 1–10 units remaining",
      icon: AlertTriangle,
      color: "amber",
    },
    {
      title: "Out of Stock",
      value: inventory.outOfStock,
      description: "Products currently unavailable",
      icon: Package,
      color: "red",
    },
  ];
  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">OVERVIEW</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor your business, orders, inventory and sales.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
        {isFetching && (
          <p className="text-xs font-medium text-slate-500">
            Updating dashboard data...
          </p>
        )}
        {/* Analytics quick links */}
        <section aria-label="Analytics navigation">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Analytics</h2>
            <p className="mt-1 text-sm text-slate-500">
              Open a detailed view of your business performance.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Sales Analytics",
                description: "Revenue and sales trends",
                to: "/analytics/sales",
                icon: CircleDollarSign,
              },
              {
                title: "Order Analytics",
                description: "Order volume and status",
                to: "/analytics/orders",
                icon: ShoppingCart,
              },
              {
                title: "Inventory Analytics",
                description: "Stock levels and alerts",
                to: "/analytics/inventory",
                icon: Boxes,
              },
              {
                title: "Customer Analytics",
                description: "Customer activity and growth",
                to: "/analytics/customers",
                icon: Users,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-orange-600" />
                </Link>
              );
            })}
          </div>
        </section>
        {/* Summary cards */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Business Summary
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              const colorStyles: Record<string, string> = {
                blue: "bg-blue-50 text-blue-600",
                violet: "bg-violet-50 text-violet-600",
                emerald: "bg-emerald-50 text-emerald-600",
                amber: "bg-amber-50 text-amber-600",
                cyan: "bg-cyan-50 text-cyan-600",
                rose: "bg-rose-50 text-rose-600",
              };
              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {card.title}
                      </p>
                      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {formatNumber(card.value)}
                      </p>
                    </div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorStyles[card.color]}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
        {/* Orders and sales */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Order Status</h2>
              <p className="mt-1 text-sm text-slate-500">
                Current distribution of orders by status.
              </p>
            </div>
            <div className="space-y-5">
              {orderStatuses.map((status) => {
                const Icon = status.icon;
                const percentage =
                  totalStatusOrders > 0
                    ? (status.value / totalStatusOrders) * 100
                    : 0;
                return (
                  <div key={status.label}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${status.bg} ${status.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {status.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900">
                          {formatNumber(status.value)}
                        </span>
                        <span className="ml-2 text-xs text-slate-400">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${status.bar}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Total orders by status
                </span>
                <span className="text-base font-bold text-slate-900">
                  {formatNumber(totalStatusOrders)}
                </span>
              </div>
            </div>
          </div>
          {/* Revenue card */}
          <div className="flex flex-col rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">
                  Total Revenue
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  From delivered orders
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <CircleDollarSign className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <div className="mt-8">
              <p className="break-words text-3xl font-bold tracking-tight sm:text-4xl">
                {formatCurrency(sales.totalRevenue)}
              </p>
              <p className="mt-3 text-sm text-slate-400">
                Revenue across completed deliveries.
              </p>
            </div>
            <div className="mt-auto pt-8">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-medium text-slate-400">
                  Delivered Orders
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {formatNumber(sales.deliveredOrderCount)}
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Inventory alerts */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Inventory Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Products that may require your attention.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {inventoryCards.map((card) => {
              const Icon = card.icon;
              const isLowStock = card.color === "amber";
              return (
                <div
                  key={card.title}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      isLowStock
                        ? "bg-amber-50 text-amber-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {formatNumber(card.value)}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {card.description}
                    </p>
                  </div>
                  {card.value > 0 && (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isLowStock
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      Attention
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
        {/* Empty state for zero orders */}
        {summary.totalOrders === 0 && (
          <EmptyState
            title="No orders yet"
            description="Once orders are created, their status and sales information will appear here."
            icon={ShoppingCart}
            className="min-h-[220px] rounded-2xl border border-slate-200 bg-white"
          />
        )}
        <footer className="border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
          Dashboard analytics · Data provided by your inventory system
        </footer>
      </div>
    </div>
  );
}
export default DashboardPage;
