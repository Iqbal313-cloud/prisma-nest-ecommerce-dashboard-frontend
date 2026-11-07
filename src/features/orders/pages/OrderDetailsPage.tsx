import { Link, useNavigate, useParams } from "react-router-dom";

import { useGetOrderByIdQuery } from "@/api/orderApi";

import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const orderId = Number(id);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetOrderByIdQuery(orderId, {
    skip: !id || !Number.isInteger(orderId) || orderId <= 0,
  });

  if (!id || !Number.isInteger(orderId) || orderId <= 0) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">Invalid Order ID</h2>

        <p className="mt-1 text-sm text-red-600">
          The order ID provided in the URL is not valid.
        </p>

        <Link
          to="/orders"
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Orders
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loading />
      </div>
    );
  }

  const order = response?.data ?? response;

  console.log("API orderDate:", order.orderDate);
  console.log("Parsed timestamp:", new Date(order.orderDate).toISOString());
  console.log("Browser local:", new Date(order.orderDate).toString());

  if (isError || !order) {
    console.error("Failed to load order:", error);

    return (
      <div className="space-y-4">
        <ErrorMessage />

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  const customerName = [order.customer?.firstName, order.customer?.lastName]
    .filter(Boolean)
    .join(" ");

  const employeeName = [order.employee?.firstName, order.employee?.lastName]
    .filter(Boolean)
    .join(" ");

  const totalAmount =
    order.totalAmount ??
    order.orderDetails?.reduce(
      (sum: number, item: OrderLineItem) =>
        sum +
        item.quantity * Number(item.unitPrice) * (1 - Number(item.discount)),
      0,
    ) ??
    0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/orders" className="transition hover:text-blue-600">
              Orders
            </Link>

            <span>/</span>

            <span className="text-slate-700">#{order.id}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              Order #{order.id}
            </h1>

            <OrderStatusBadge status={order.orderStatus} />
          </div>

          {/* <p className="mt-1 text-sm text-slate-500">
            Order date: {formatDate(order.orderDate)}
          </p> */}
          <p className="mt-1 text-sm text-slate-500">
            Created At: {formatDate(order.createdAt)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Updated At: {formatDate(order.updatedAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/orders"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back
          </Link>

          <Link
            to={`/orders/${order.id}/edit`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Edit Order
          </Link>
        </div>
      </div>

      {/* Customer & Employee */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Customer Information
            </h2>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <InfoItem label="Customer Name" value={customerName} />

            <InfoItem label="Phone" value={order.customer?.phoneNumber} />

            <div className="sm:col-span-2">
              <InfoItem label="Address" value={order.customer?.address} />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Employee Information
            </h2>
          </div>

          <div className="p-6">
            <InfoItem
              label="Employee Name"
              value={employeeName || "No employee assigned"}
            />
          </div>
        </section>
      </div>

      {/* Order Information */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Order Information
          </h2>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Order ID" value={`#${order.id}`} />

          <InfoItem label="Order Date" value={formatDate(order.orderDate)} />

          <InfoItem label="Order Status" value={order.orderStatus} />

          <InfoItem label="Created By" value={order.createdBy?.name ?? "N/A"} />

          <InfoItem label="Updated By" value={order.updatedBy?.name ?? "N/A"} />

          <InfoItem label="Created at" value={formatDate(order.createdAt)} />
          
          <InfoItem label="Updated at" value={formatDate(order.updatedAt)} />
        </div>
      </section>

      {/* Order Items */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Order Items
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Products included in this order.
          </p>
        </div>

        {!order.orderDetails?.length ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No order items found.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 text-right font-medium">Quantity</th>
                  <th className="px-6 py-4 text-right font-medium">
                    Unit Price
                  </th>
                  <th className="px-6 py-4 text-right font-medium">Discount</th>
                  <th className="px-6 py-4 text-right font-medium">Subtotal</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {order.orderDetails.map(
                  (item: OrderLineItem, index: number) => {
                    const discount = Number(item.discount) || 0;

                    const subtotal =
                      item.quantity *
                      Number(item.unitPrice) *
                      (1 - discount / 100);

                    return (
                      <tr key={`${item.productName}-${index}`}>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {item.productName || "-"}
                        </td>

                        <td className="px-6 py-4 text-right text-slate-600">
                          {item.quantity}
                        </td>

                        <td className="px-6 py-4 text-right text-slate-600">
                          {formatCurrency(item.unitPrice)}
                        </td>

                        <td className="px-6 py-4 text-right text-slate-600">
                          {discount.toFixed(2)}%
                        </td>

                        <td className="px-6 py-4 text-right font-medium text-slate-900">
                          {formatCurrency(subtotal)}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-5">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-500">Total Amount</span>

              <span className="text-xl font-bold text-slate-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface OrderLineItem {
  quantity: number;
  unitPrice: number | string;
  discount: number | string;
  productName: string;
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="break-words text-sm font-medium text-slate-900">
        {value === null || value === undefined || value === "" ? "-" : value}
      </p>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    PROCESSING: "bg-blue-50 text-blue-700",
    SHIPPED: "bg-violet-50 text-violet-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

function formatCurrency(value: number | string) {
  return `৳${Number(value ?? 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default OrderDetailsPage;
