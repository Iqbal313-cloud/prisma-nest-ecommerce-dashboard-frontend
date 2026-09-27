import { Link, useNavigate, useParams } from "react-router-dom";

import { useGetProductQuery } from "@/api/productApi";

import Loading from "@/common/Loading";
import ErrorMessage from "@/common/ErrorMessage";

import ProductForm from "../components/ProductForm";

function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const productId = Number(id);

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductQuery(productId, {
    skip: !id || Number.isNaN(productId),
  });

  if (!id || Number.isNaN(productId)) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800">
          Invalid Product ID
        </h2>

        <p className="mt-1 text-sm text-red-600">
          The product ID provided in the URL is not valid.
        </p>

        <Link
          to="/products"
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Products
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

  if (isError || !product) {
    console.error("Failed to load product:", error);

    return (
      <div className="space-y-4">
        <ErrorMessage />

        <button
          type="button"
          onClick={() => navigate("/products")}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/products" className="transition hover:text-blue-600">
            Products
          </Link>

          <span>/</span>

          <Link
            to={`/products/${product.id}`}
            className="max-w-[220px] truncate transition hover:text-blue-600"
          >
            {product.productName}
          </Link>

          <span>/</span>

          <span className="text-slate-700">Edit</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>

        <p className="mt-1 text-sm text-slate-500">
          Update the information for{" "}
          <span className="font-medium text-slate-700">
            {product.productName}
          </span>
          .
        </p>
      </div>

      {/* Form */}
      <ProductForm product={product} mode="edit" />
    </div>
  );
}

export default ProductEditPage;
