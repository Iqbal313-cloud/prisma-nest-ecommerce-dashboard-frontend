import { useState, type FormEvent } from "react";
import type { CreateCustomerPayload, Customer } from "../types/customer.types";

interface CustomerFormProps {
  initialValues?: Partial<CreateCustomerPayload>;
  customer?: Customer;
  onSubmit: (values: CreateCustomerPayload) => Promise<void>;
  isSubmitting: boolean;
  submitText: string;
}

export default function CustomerForm({
  initialValues,
  customer,
  onSubmit,
  isSubmitting,
  submitText,
}: CustomerFormProps) {
  const [firstName, setFirstName] = useState(
    initialValues?.firstName ?? customer?.firstName ?? "",
  );
  const [lastName, setLastName] = useState(
    initialValues?.lastName ?? customer?.lastName ?? "",
  );
  const [phoneNumber, setPhoneNumber] = useState(
    initialValues?.phoneNumber ?? customer?.phoneNumber ?? "",
  );
  const [address, setAddress] = useState(
    initialValues?.address ?? customer?.address ?? "",
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const payload: CreateCustomerPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
    };

    if (!payload.firstName || !payload.lastName || !payload.phoneNumber) {
      setError("First name, last name and phone number are required.");
      return;
    }

    try {
      await onSubmit(payload);
    } catch {
      setError("Could not save customer. Please try again.");
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-5"
    >
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          First name *
          <input
            className={inputClass}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            maxLength={100}
            autoComplete="given-name"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Last name *
          <input
            className={inputClass}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            maxLength={100}
            autoComplete="family-name"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Phone number *
          <input
            className={inputClass}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            maxLength={30}
            autoComplete="tel"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
          Address
          <textarea
            className={inputClass}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            maxLength={500}
            autoComplete="street-address"
          />
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}
