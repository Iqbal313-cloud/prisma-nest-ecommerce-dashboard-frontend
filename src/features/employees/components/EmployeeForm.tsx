import { useEffect, useState } from "react";
import type { CreateEmployeePayload, Employee } from "../types/employee.types";

interface EmployeeFormProps {
  initialData?: Employee;
  onSubmit: (payload: CreateEmployeePayload) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

interface FormState {
  firstName: string;
  lastName: string;
  birthDate: string;
  photoPath: string;
  notes: string;
}

function toDateInput(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getFormState(employee?: Employee): FormState {
  return {
    firstName: employee?.firstName ?? "",
    lastName: employee?.lastName ?? "",
    birthDate: toDateInput(employee?.birthDate),
    photoPath: employee?.photoPath ?? "",
    notes: employee?.notes ?? "",
  };
}

export default function EmployeeForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel,
}: EmployeeFormProps) {
  const [form, setForm] = useState<FormState>(() => getFormState(initialData));

  useEffect(() => {
    setForm(getFormState(initialData));
  }, [initialData]);

  function updateField(key: keyof FormState, value: string) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSubmit({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      birthDate: form.birthDate,
      ...(form.photoPath.trim() ? { photoPath: form.photoPath.trim() } : {}),
      ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
    });
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            First name *
          </label>
          <input
            required
            maxLength={100}
            value={form.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            className={inputClass}
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Last name *
          </label>
          <input
            required
            maxLength={100}
            value={form.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            className={inputClass}
            placeholder="Enter last name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Birth date *
          </label>
          <input
            type="date"
            required
            value={form.birthDate}
            onChange={(e) => updateField("birthDate", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Photo path
          </label>
          <input
            type="text"
            value={form.photoPath}
            onChange={(e) => updateField("photoPath", e.target.value)}
            className={inputClass}
            placeholder="Photo URL or path"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Notes
          </label>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            className={inputClass}
            placeholder="Additional notes"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
