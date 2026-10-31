import {
  useGetInventorySummaryQuery,
  useGetSlowMovingProductsQuery,
} from "@/api/analyticsApi";

import { AlertCircle, Boxes, Package, Warehouse } from "lucide-react";

import AnalyticsStatCard from "../components/AnalyticsStatCard";

import AnalyticsNavigation from "../components/AnalyticsNavigation";

import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/common/Table";
import AnalyticsPageHeader from "./AnalyticsPageHeader";

const currency = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(value);

const numberFormatter = new Intl.NumberFormat("en-BD");

export default function InventoryAnalyticsPage() {
  const { data, isLoading, isError, refetch } = useGetInventorySummaryQuery();

  const slowMoving = useGetSlowMovingProductsQuery({
    days: 30,
    limit: 10,
  });

  if (isLoading) {
    return (
      <Loading
        message="Loading inventory analytics..."
        minHeight="min-h-[300px]"
      />
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-3">
        <ErrorMessage message="Unable to load inventory analytics." />

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
      title: "Total Products",
      value: data.totalProducts,
      icon: Package,
      iconColor: "text-blue-600",
    },
    {
      title: "Total Stock Units",
      value: data.totalStockQuantity,
      icon: Boxes,
      iconColor: "text-violet-600",
    },
    {
      title: "Low Stock",
      value: data.lowStockProducts,
      icon: Warehouse,
      iconColor: "text-amber-600",
    },
    {
      title: "Out of Stock",
      value: data.outOfStockProducts,
      icon: AlertCircle,
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header & Navigation */}

      <AnalyticsPageHeader
        title="Inventory Analytics"
        description="Stock levels, stock value, and slow-moving products."
      />

      <div className="mt-5 border-t border-slate-100 pt-4">
        <AnalyticsNavigation onRefresh={refetch} />
      </div>

      {/* Inventory Statistics */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <AnalyticsStatCard
            key={card.title}
            title={card.title}
            value={numberFormatter.format(card.value)}
            icon={card.icon}
            iconColor={card.iconColor}
          />
        ))}
      </section>

      {/* Additional Inventory Information */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Stock Value</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {currency(data.totalStockValue)}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Low-stock threshold: {data.lowStockThreshold}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Products with unknown stock</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {numberFormatter.format(data.unknownStockProducts)}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Products whose stock quantity is not set.
          </p>
        </div>
      </section>

      {/* Low Stock Products */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Low Stock Products
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Products that have reached the low-stock threshold.
          </p>
        </div>

        {data.lowStockItems.length === 0 ? (
          <EmptyState
            title="No low-stock products"
            description="All products are currently above the low-stock threshold."
          />
        ) : (
          <Table className="min-w-[520px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Product</TableHead>
                <TableHead>Units in Stock</TableHead>
                <TableHead>Unit Price</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.lowStockItems.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium text-slate-900">
                    {item.productName}
                  </TableCell>

                  <TableCell className="text-amber-700">
                    {numberFormatter.format(item.unitsInStock)}
                  </TableCell>

                  <TableCell>{currency(item.unitPrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      {/* Slow-moving Products */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Slow-moving Products
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Products with little or no sales in the last 30 days.
          </p>
        </div>

        {slowMoving.isLoading ? (
          <Loading
            message="Loading slow-moving products..."
            minHeight="min-h-[180px]"
          />
        ) : slowMoving.isError ? (
          <div className="space-y-3">
            <ErrorMessage message="Unable to load slow-moving products." />

            <button
              type="button"
              onClick={() => slowMoving.refetch()}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Retry
            </button>
          </div>
        ) : !slowMoving.data?.products.length ? (
          <EmptyState
            title="No slow-moving products"
            description="There are no slow-moving products to display for the selected period."
          />
        ) : (
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Product</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Last Sold</TableHead>
                <TableHead>Units Sold (30d)</TableHead>
                <TableHead>Revenue (30d)</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {slowMoving.data.products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell className="font-medium text-slate-900">
                    {product.productName}
                  </TableCell>

                  <TableCell>{product.unitsInStock ?? "Unknown"}</TableCell>

                  <TableCell className="text-slate-500">
                    {product.lastSoldAt
                      ? new Date(product.lastSoldAt).toLocaleDateString("en-BD")
                      : "Never"}
                  </TableCell>

                  <TableCell>
                    {numberFormatter.format(product.quantitySoldInPeriod)}
                  </TableCell>

                  <TableCell>{currency(product.revenueInPeriod)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
