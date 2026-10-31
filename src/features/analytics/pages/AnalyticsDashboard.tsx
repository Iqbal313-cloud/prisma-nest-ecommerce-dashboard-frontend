import {
  AlertCircle,
  Boxes,
  CheckCircle2,
  ClipboardList,
  FolderTree,
  Package,
  RefreshCw,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
  Warehouse,
  UserRound,
} from "lucide-react";

import { useGetAnalyticsOverviewQuery } from "@/api/analyticsApi";
import AnalyticsStatCard from "../components/AnalyticsStatCard";
import SalesTrendChart from "../components/SalesTrendChart";
import OrderStatusChart from "../components/OrderStatusChart";
import TopProductsTable from "../components/TopProductsTable";
import CategoryPerformanceChart from "../components/CategoryPerformanceChart";
import { Link } from "react-router-dom";
import AnalyticsNavigation from "../components/AnalyticsNavigation";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-BD");

export default function AnalyticsDashboard() {
  const { data, isLoading, isError, refetch } = useGetAnalyticsOverviewQuery();

  if (isLoading) {
    return <Loading message="Loading analytics..." minHeight="min-h-[300px]" />;
  }

  if (isError || !data) {
    return (
      <div className="space-y-3">
        <ErrorMessage message="Unable to load analytics. Something went wrong while fetching dashboard data." />
      </div>
    );
  }

  const { summary, orders, inventory, sales } = data;

  const orderStatuses = [
    {
      label: "Pending",
      count: orders.pending,
      color: "bg-amber-500",
    },
    {
      label: "Processing",
      count: orders.processing,
      color: "bg-blue-500",
    },
    {
      label: "Shipped",
      count: orders.shipped,
      color: "bg-violet-500",
    },
    {
      label: "Delivered",
      count: orders.delivered,
      color: "bg-emerald-500",
    },
    {
      label: "Cancelled",
      count: orders.cancelled,
      color: "bg-red-500",
    },
  ];

  const totalStatusOrders = orderStatuses.reduce(
    (total, status) => total + status.count,
    0,
  );

  const statCards = [
    {
      title: "Total Revenue",
      value: currencyFormatter.format(sales.totalRevenue),
      description: `${numberFormatter.format(sales.deliveredOrderCount)} delivered orders`,
      icon: Wallet,
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Orders",
      value: numberFormatter.format(summary.totalOrders),
      description: "All order statuses",
      icon: ShoppingCart,
      iconColor: "text-orange-600",
    },
    {
      title: "Total Products",
      value: numberFormatter.format(summary.totalProducts),
      description: "Products in the catalog",
      icon: Package,
      iconColor: "text-blue-600",
    },
    {
      title: "Total Categories",
      value: numberFormatter.format(summary.totalCategories),
      description: "Product categories",
      icon: FolderTree,
      iconColor: "text-violet-600",
    },
    {
      title: "Total Customers",
      value: numberFormatter.format(summary.totalCustomers),
      description: "Registered customers",
      icon: Users,
      iconColor: "text-cyan-600",
    },
    {
      title: "Total Employees",
      value: numberFormatter.format(summary.totalEmployees),
      description: "Employees in the system",
      icon: UserRound,
      iconColor: "text-indigo-600",
    },
    {
      title: "Total Suppliers",
      value: numberFormatter.format(summary.totalSuppliers),
      description: "Registered suppliers",
      icon: Truck,
      iconColor: "text-amber-600",
    },
    {
      title: "Delivered Orders",
      value: numberFormatter.format(orders.delivered),
      description: "Successfully delivered",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
    },
    {
      title: "Low Stock Products",
      value: numberFormatter.format(inventory.lowStock),
      description: "Products needing attention",
      icon: Warehouse,
      iconColor: "text-amber-600",
    },
    {
      title: "Out of Stock",
      value: numberFormatter.format(inventory.outOfStock),
      description: "Products with no stock",
      icon: Boxes,
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page heading */}

      <div className="mt-5 border-t border-slate-100 pt-4">
        <AnalyticsNavigation onRefresh={refetch} />
      </div>

      {/* Statistics */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList size={20} className="text-orange-600" />
          <h2 className="text-lg font-semibold text-slate-900">
            Business Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <AnalyticsStatCard
              key={card.title}
              title={card.title}
              value={card.value}
              description={card.description}
              icon={card.icon}
              iconColor={card.iconColor}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalesTrendChart />
        <OrderStatusChart />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TopProductsTable />
        <CategoryPerformanceChart />
      </section>

      {/* Order status */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Order Status Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Distribution of orders across their current statuses.
          </p>
        </div>

        <div className="space-y-5">
          {orderStatuses.map((status) => {
            const percentage =
              totalStatusOrders > 0
                ? (status.count / totalStatusOrders) * 100
                : 0;

            return (
              <div key={status.label}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-700">
                    {status.label}
                  </span>

                  <span className="text-sm font-semibold tabular-nums text-slate-900">
                    {numberFormatter.format(status.count)}
                    <span className="ml-2 font-normal text-slate-500">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </span>
                </div>

                <div
                  className="h-2.5 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-label={`${status.label} orders`}
                  aria-valuenow={Number(percentage.toFixed(1))}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${status.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm text-slate-500">Total status count</span>
          <span className="text-base font-bold text-slate-900">
            {numberFormatter.format(totalStatusOrders)}
          </span>
        </div>
      </section>
    </div>
  );
}
