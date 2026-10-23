import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type { Supplier, CreateSupplierPayload } from "../types/supplier.types";

interface SupplierFormProps {
  initialData?: Supplier;
  onSubmit: (payload: CreateSupplierPayload) => void | Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

type FormState = {
  supplierName: string;
  contactName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
};

const emptyForm: FormState = {
  supplierName: "",
  contactName: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  phone: "",
};

function SupplierForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel,
}: SupplierFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!initialData) {
      setForm(emptyForm);
      return;
    }

    setForm({
      supplierName: initialData.supplierName ?? "",
      contactName: initialData.contactName ?? "",
      address: initialData.address ?? "",
      city: initialData.city ?? "",
      postalCode: initialData.postalCode ?? "",
      country: initialData.country ?? "",
      phone: initialData.phone ?? "",
    });
  }, [initialData]);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateSupplierPayload = {
      supplierName: form.supplierName.trim(),
      contactName: form.contactName.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim(),
      phone: form.phone.trim(),
    };

    await onSubmit(payload);
  };

  const inputFields: {
    key: keyof FormState;
    label: string;
    required?: boolean;
  }[] = [
    { key: "supplierName", label: "Supplier Name", required: true },
    { key: "contactName", label: "Contact Name" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "postalCode", label: "Postal Code" },
    { key: "country", label: "Country" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-slate-200 bg-white p-6"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {inputFields.map(({ key, label, required }) => (
          <div key={key}>
            <label
              htmlFor={`supplier-form-${key}`}
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            <input
              id={`supplier-form-${key}`}
              type="text"
              value={form[key]}
              required={required}
              onChange={(event) => updateField(key, event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => window.history.back()}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !form.supplierName.trim()}
          className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default SupplierForm;
