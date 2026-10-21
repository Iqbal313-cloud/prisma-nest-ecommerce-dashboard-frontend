import { Link } from "react-router-dom";
import OrderForm from "../components/OrderForm";

function OrderCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/orders" className="transition hover:text-blue-600">
            Orders
          </Link>
          <span>/</span>
          <span className="text-slate-700">Create</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Create Order</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new order to your system.
        </p>
      </div>
      <OrderForm mode="create" />
    </div>
  );
}

export default OrderCreatePage;
