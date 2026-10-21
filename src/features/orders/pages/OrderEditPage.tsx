import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useGetOrderByIdQuery } from "@/api/orderApi";
import OrderForm from "../components/OrderForm";

function OrderEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = Number(id);

  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useGetOrderByIdQuery(orderId, {
    skip: !id || Number.isNaN(orderId),
  });

  if (!id || Number.isNaN(orderId) || orderId <= 0) {
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

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/orders" className="transition hover:text-blue-600">
            Orders
          </Link>
          <span>/</span>
          <Link
            to={`/orders/${order.id}`}
            className="transition hover:text-blue-600"
          >
            Order #{order.id}
          </Link>
          <span>/</span>
          <span className="text-slate-700">Edit</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Order</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update order #{order.id} information.
        </p>
      </div>
      <OrderForm order={order} mode="edit" />
    </div>
  );
}

export default OrderEditPage;
