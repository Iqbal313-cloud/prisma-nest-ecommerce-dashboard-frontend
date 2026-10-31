import { useGetTopCustomersQuery } from "@/api/analyticsApi";
import { Users } from "lucide-react";

import AnalyticsNavigation from "../components/AnalyticsNavigation";
import AnalyticsStatCard from "../components/AnalyticsStatCard";
import CategoryPerformanceChart from "../components/CategoryPerformanceChart";

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

export default function CustomerAnalyticsPage() {
  const { data, isLoading, isError, refetch } = useGetTopCustomersQuery({
    limit: 10,
  });

  if (isLoading) {
    return (
      <Loading
        message="Loading customer analytics..."
        minHeight="min-h-[300px]"
      />
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-3">
        <ErrorMessage message="Unable to load customer analytics." />

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

  const totalSpent = data.customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0,
  );

  const cards = [
    {
      title: "Customers Ranked",
      value: numberFormatter.format(data.customers.length),
      description: "Customers with delivered orders",
      icon: Users,
      iconColor: "text-blue-600",
    },
    {
      title: "Combined Spend",
      value: currency(totalSpent),
      description: "Total spend of the listed top customers",
      icon: Users,
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header & Navigation */}

      <AnalyticsPageHeader
        title="Customer Analytics"
        description="Top customers and category performance."
      />

      <div className="mt-5 border-t border-slate-100 pt-4">
        <AnalyticsNavigation onRefresh={refetch} />
      </div>

      {/* Customer Statistics */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {cards.map((card) => (
          <AnalyticsStatCard key={card.title} {...card} />
        ))}
      </section>

      {/* Top Customers Table */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Top Customers
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Customers ranked by their total spending.
          </p>
        </div>

        {data.customers.length === 0 ? (
          <EmptyState
            title="No customer data"
            description="Customer analytics will appear here when order data is available."
          />
        ) : (
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Customer</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Units Purchased</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.customers.map((customer) => (
                <TableRow key={customer.customerId}>
                  <TableCell className="font-medium text-slate-900">
                    {[customer.firstName, customer.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </TableCell>

                  <TableCell>
                    {numberFormatter.format(customer.totalOrders)}
                  </TableCell>

                  <TableCell>
                    {numberFormatter.format(customer.totalUnitsPurchased)}
                  </TableCell>

                  <TableCell className="font-medium text-slate-900">
                    {currency(customer.totalSpent)}
                  </TableCell>

                  <TableCell className="text-slate-500">
                    {customer.lastOrderDate
                      ? new Date(customer.lastOrderDate).toLocaleDateString(
                          "en-BD",
                        )
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      {/* Category Performance */}
      <CategoryPerformanceChart />
    </div>
  );
}
