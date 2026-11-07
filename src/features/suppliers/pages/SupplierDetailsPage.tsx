import { Link, useParams } from "react-router-dom";

import { useGetSupplierQuery } from "@/api/supplierApi";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

function SupplierDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const supplierId = Number(id);
  const validId = Number.isInteger(supplierId) && supplierId > 0;

  const {
    data: supplier,
    isLoading,
    isError,
  } = useGetSupplierQuery(supplierId, {
    skip: !validId,
  });

  if (!validId) {
    return (
      <p role="alert" className="p-6 text-sm text-red-600">
        Invalid supplier ID.
      </p>
    );
  }

  if (isLoading) {
    return <Loading message="Loading suppliers..." minHeight="min-h-[300px]" />;
  }

if (isError || !supplier) {
  return <ErrorMessage message="Failed to load supplier details." />;
}

  const details = [
    ["Supplier Name", supplier.supplierName],
    ["Contact Name", supplier.contactName],
    ["Phone", supplier.phone],
    ["Address", supplier.address],
    ["City", supplier.city],
    ["Postal Code", supplier.postalCode],
    ["Country", supplier.country],
    [
      "Products",
      String(supplier._count?.products ?? supplier.products?.length ?? 0),
    ],
    ["Created By", supplier.createdBy?.name],
    ["Updated By", supplier.updatedBy?.name],
    ["Created At", new Date(supplier.createdAt).toLocaleString()],
    ["Updated At", new Date(supplier.updatedAt).toLocaleString()],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            to="/suppliers"
            className="text-sm text-slate-500 hover:text-orange-600"
          >
            ← Back to suppliers
          </Link>

          <h1 className="mt-3 text-2xl font-semibold text-slate-900">
            Supplier Details
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Supplier ID: #{supplier.id}
          </p>
        </div>

        <Link
          to={`/suppliers/${supplier.id}/edit`}
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
        >
          Edit Supplier
        </Link>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-slate-900">
          Supplier Information
        </h2>

        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-slate-500">{label}</dt>
              <dd className="mt-1 break-words text-sm font-medium text-slate-800">
                {value || "-"}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Products from this supplier
        </h2>

        {supplier.products.length === 0 ? (
          <p className="text-sm text-slate-500">
            No products associated with this supplier.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {supplier.products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <span className="text-sm font-medium text-slate-800">
                  {product.productName}
                </span>
                <span className="text-xs text-slate-500">#{product.id}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default SupplierDetailsPage;
