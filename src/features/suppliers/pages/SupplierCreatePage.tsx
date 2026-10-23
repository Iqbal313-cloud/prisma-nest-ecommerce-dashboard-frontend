import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCreateSupplierMutation } from "@/api/supplierApi";
import SupplierForm from "../components/SupplierForm";
import type { CreateSupplierPayload } from "../types/supplier.types";

function SupplierCreatePage() {
  const navigate = useNavigate();
  const [createSupplier, { isLoading }] = useCreateSupplierMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (payload: CreateSupplierPayload) => {
    setErrorMessage("");

    try {
      const supplier = await createSupplier(payload).unwrap();
      navigate(`/suppliers/${supplier.id}`);
    } catch (error) {
      console.error("Failed to create supplier:", error);
      setErrorMessage(
        "Failed to create supplier. Please check your input and try again.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/suppliers"
          className="text-sm text-slate-500 hover:text-orange-600"
        >
          ← Back to suppliers
        </Link>

        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Create Supplier
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new supplier to your system.
        </p>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
          {errorMessage}
        </p>
      )}

      <SupplierForm
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        submitLabel="Create Supplier"
      />
    </div>
  );
}

export default SupplierCreatePage;
