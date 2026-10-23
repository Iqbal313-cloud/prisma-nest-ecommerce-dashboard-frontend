import { useNavigate } from "react-router-dom";
import { useCreateCustomerMutation } from "@/api/customerApi";
import CustomerForm from "../components/CustomerForm";
import type { CreateCustomerPayload } from "../types/customer.types";

export default function CustomerCreatePage() {
  const navigate = useNavigate();
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  async function handleSubmit(values: CreateCustomerPayload) {
    const customer = await createCustomer(values).unwrap();
    navigate(`/customers/${customer.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="mb-3 text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to customers
        </button>

        <h1 className="text-2xl font-bold text-slate-900">Create Customer</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter the customer's information below.
        </p>
      </div>

      <CustomerForm
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        submitText="Create Customer"
      />
    </div>
  );
}
