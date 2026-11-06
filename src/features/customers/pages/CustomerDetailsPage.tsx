import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetCustomerByIdQuery } from "@/api/customerApi";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/common/Table";

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
  });
}

function formatCurrency(value: number | string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "-";

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusStyles(status: string) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-violet-100 text-violet-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return styles[status] ?? "bg-slate-100 text-slate-700";
}

export default function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const customerId = Number(id);
  const validId = Number.isInteger(customerId) && customerId > 0;

  const {
    data: customer,
    isLoading,
    isError,
    refetch,
  } = useGetCustomerByIdQuery(customerId, {
    skip: !validId,
  });

  if (!validId) {
    return <p className="text-sm text-red-600">Invalid customer ID.</p>;
  }

  if (isLoading) {
    return <p className="p-6 text-sm text-slate-500">Loading customer...</p>;
  }

  if (isError || !customer) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">Could not load this customer.</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Try again
        </button>
      </div>
    );
  }

  const orders = customer.orders ?? [];

  // Total = sum of all product unit prices in the order.
  const getOrderTotal = (order: (typeof orders)[number]) =>
    (order.orderDetails ?? []).reduce((sum, detail) => {
      const unitPrice = Number(detail.unitPrice);

      return sum + (Number.isFinite(unitPrice) ? unitPrice : 0);
    }, 0);

  // Create one row per product.
  // Order-level cells span all product rows belonging to that order.
  const rows = orders.flatMap((order) => {
    const details = order.orderDetails ?? [];
    const rowCount = Math.max(details.length, 1);

    return Array.from({ length: rowCount }, (_, index) => ({
      order,
      detail: details[index],
      index,
      rowCount,
    }));
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="mb-3 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          ← Back to customers
        </button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {customer.firstName} {customer.lastName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Customer ID: #{customer.id}
            </p>
          </div>

          <Link
            to={`/customers/${customer.id}/edit`}
            className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Edit Customer
          </Link>
        </div>
      </div>

      {/* Customer Information */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Customer Information
        </h2>

        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-sm text-slate-500">Customer ID</dt>
            <dd className="mt-1 font-medium text-slate-900">#{customer.id}</dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">First name</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {customer.firstName || "-"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Last name</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {customer.lastName || "-"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Phone number</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {customer.phoneNumber || "-"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Address</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {customer.address || "-"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Created At</dt>
            <dd className="mt-1 text-sm text-slate-700">
              {formatDate(customer.createdAt)}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Created By</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {customer.createdBy?.name ?? "-"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Updated At</dt>
            <dd className="mt-1 text-sm text-slate-700">
              {formatDate(customer.updatedAt)}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Updated By</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {customer.updatedBy?.name ?? "-"}
            </dd>
          </div>
        </dl>
      </section>

      {/* Customer Orders */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Customer Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {orders.length} order{orders.length === 1 ? "" : "s"}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="font-medium text-slate-700">No orders found</p>

            <p className="mt-1 text-sm text-slate-500">
              This customer has no orders in the current response.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Table className="min-w-[1200px]">
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-slate-50">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead>Employee</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map(({ order, detail, index, rowCount }) => (
                  <TableRow key={`${order.id}-${index}`}>
                    {/* Order-level cells */}
                    {index === 0 && (
                      <>
                        <TableCell
                          rowSpan={rowCount}
                          className="border-r border-slate-100 font-semibold text-slate-900"
                        >
                          #{order.id}
                        </TableCell>

                        <TableCell
                          rowSpan={rowCount}
                          className="border-r border-slate-100"
                        >
                          {formatDate(order.orderDate)}
                        </TableCell>

                        <TableCell
                          rowSpan={rowCount}
                          className="border-r border-slate-100"
                        >
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyles(order.orderStatus)}`}
                          >
                            {formatStatus(order.orderStatus)}
                          </span>
                        </TableCell>
                      </>
                    )}

                    {/* Product-level cells */}
                    <TableCell>{detail?.product?.id ?? "-"}</TableCell>

                    <TableCell className="min-w-[180px] font-medium text-slate-800">
                      {detail?.product?.productName ?? "-"}
                    </TableCell>

                    <TableCell className="text-right tabular-nums">
                      {detail?.quantity ?? "-"}
                    </TableCell>

                    <TableCell className="text-right tabular-nums">
                      {detail ? formatCurrency(detail.unitPrice) : "-"}
                    </TableCell>

                    {/* Sum of unit prices, shown once per order */}
                    {index === 0 && (
                      <TableCell
                        rowSpan={rowCount}
                        className="border-r border-slate-100 text-right align-middle font-semibold tabular-nums text-slate-900"
                      >
                        {formatCurrency(getOrderTotal(order))}
                      </TableCell>
                    )}

                    <TableCell className="text-right tabular-nums">
                      {detail
                        ? `${Number.isFinite(Number(detail.discount)) ? Number(detail.discount).toLocaleString("en-BD") : "0"}%`
                        : "-"}
                    </TableCell>

                    {/* Employee belongs to the order */}
                    {index === 0 && (
                      <TableCell
                        rowSpan={rowCount}
                        className="border-l border-slate-100"
                      >
                        {order.employee
                          ? `${order.employee.firstName} ${order.employee.lastName}`.trim()
                          : "-"}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}
