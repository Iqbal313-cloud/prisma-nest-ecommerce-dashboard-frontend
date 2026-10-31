import { useState } from "react";
import { useGetTopSellingProductsQuery } from "@/api/analyticsApi";

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

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-BD");

export default function TopProductsTable() {
  const [limit, setLimit] = useState(5);

  const { data, isLoading, isError, refetch } = useGetTopSellingProductsQuery({
    limit,
  });

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Top Selling Products
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Products ranked by quantity sold.
          </p>
        </div>

        <select
          value={limit}
          onChange={(event) => setLimit(Number(event.target.value))}
          aria-label="Number of top-selling products"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        >
          <option value={5}>Top 5</option>
          <option value={10}>Top 10</option>
          <option value={20}>Top 20</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <Loading
          message="Loading top-selling products..."
          minHeight="min-h-[240px]"
        />
      ) : isError ? (
        /* Error State */
        <div className="space-y-3">
          <ErrorMessage message="Unable to load top-selling products." />

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Retry
          </button>
        </div>
      ) : !data?.products?.length ? (
        /* Empty State */
        <EmptyState
          title="No product sales data"
          description="No top-selling product information is available yet."
        />
      ) : (
        /* Table */
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wide text-slate-500">
                Product
              </TableHead>

              <TableHead className="text-right text-xs uppercase tracking-wide text-slate-500">
                Qty Sold
              </TableHead>

              <TableHead className="text-right text-xs uppercase tracking-wide text-slate-500">
                Orders
              </TableHead>

              <TableHead className="text-right text-xs uppercase tracking-wide text-slate-500">
                Revenue
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.products.map((product, index) => (
              <TableRow key={product.productId}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-xs font-semibold text-orange-700">
                      {index + 1}
                    </span>

                    <span className="font-medium text-slate-800">
                      {product.productName}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right tabular-nums">
                  {numberFormatter.format(product.totalQuantitySold)}
                </TableCell>

                <TableCell className="text-right tabular-nums">
                  {numberFormatter.format(product.orderCount)}
                </TableCell>

                <TableCell className="text-right font-semibold tabular-nums text-slate-900">
                  {currencyFormatter.format(product.totalRevenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
