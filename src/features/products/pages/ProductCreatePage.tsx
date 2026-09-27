import { Link } from "react-router-dom";

import ProductForm from "../components/ProductForm";

function ProductCreatePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/products" className="transition hover:text-blue-600">
            Products
          </Link>

          <span>/</span>

          <span className="text-slate-700">Create</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Create Product</h1>

        <p className="mt-1 text-sm text-slate-500">
          Add a new product to your inventory.
        </p>
      </div>

      {/* Form */}
      <ProductForm mode="create" />
    </div>
  );
}

export default ProductCreatePage;
