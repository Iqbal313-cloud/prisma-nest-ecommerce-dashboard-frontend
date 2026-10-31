import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  useGetSupplierQuery,
  useUpdateSupplierMutation,
} from "@/api/supplierApi";

import SupplierForm from "../components/SupplierForm";
import type { CreateSupplierPayload } from "../types/supplier.types";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

function SupplierEditPage() {
  const { id } = useParams<{ id: string }>();
  const supplierId = Number(id);
  const validId = Number.isInteger(supplierId) && supplierId > 0;

  const navigate = useNavigate();

  const {
    data: supplier,
    isLoading,
    isError,
  } = useGetSupplierQuery(supplierId, {
    skip: !validId,
  });

  const [updateSupplier, { isLoading: isUpdating }] =
    useUpdateSupplierMutation();

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (payload: CreateSupplierPayload) => {
    setErrorMessage("");

    try {
      await updateSupplier({
        id: supplierId,
        data: payload,
      }).unwrap();

      navigate(`/suppliers/${supplierId}`);
    } catch (error) {
      console.error("Failed to update supplier:", error);
      setErrorMessage("Failed to update supplier. Please try again.");
    }
  };

  if (!validId) {
    return (
      <p role="alert" className="p-6 text-sm text-red-600">
        Invalid supplier ID.
      </p>
    );
  }

  if (isLoading) {
    return <Loading message="Loading Suppliers..." minHeight="min-h-[300px]" />;
  }

if (isError || !supplier) {
  return <ErrorMessage message="Failed to load supplier details." />;
}

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to={`/suppliers/${supplierId}`}
          className="text-sm text-slate-500 hover:text-orange-600"
        >
          ← Back to supplier details
        </Link>

        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Edit Supplier
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update {supplier.supplierName}'s information.
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
        initialData={supplier}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        submitLabel="Save Changes"
      />
    </div>
  );
}

export default SupplierEditPage;
