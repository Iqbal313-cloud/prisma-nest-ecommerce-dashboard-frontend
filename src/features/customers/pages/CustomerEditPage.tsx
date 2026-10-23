import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from "@/api/customerApi";
import CustomerForm from "../components/CustomerForm";
import type { CreateCustomerPayload } from "../types/customer.types";

export default function CustomerEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = Number(id);
  const validId = Number.isInteger(customerId) && customerId > 0;

  const {
    data: customer,
    isLoading,
    isError,
    refetch,
  } = useGetCustomerByIdQuery(customerId, { skip: !validId });

  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  async function handleSubmit(values: CreateCustomerPayload) {
    if (!validId) return;

    await updateCustomer({
      id: customerId,
      body: values,
    }).unwrap();

    navigate(`/customers/${customerId}`);
  }

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
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate(`/customers/${customerId}`)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
           Back to customer
        </button>

        <h1 className="text-2xl font-bold text-slate-900">Edit Customer</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update {customer.firstName} {customer.lastName}'s information.
        </p>
      </div>

      <CustomerForm
        key={customer.id}
        customer={customer}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        submitText="Save Changes"
      />
    </div>
  );
}
