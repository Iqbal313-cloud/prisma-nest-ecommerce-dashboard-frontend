import { Link, useNavigate } from "react-router-dom";
import { useCreateEmployeeMutation } from "@/api/employeeApi";
import EmployeeForm from "../components/EmployeeForm";
import type { CreateEmployeePayload } from "../types/employee.types";

export default function EmployeeCreatePage() {
  const navigate = useNavigate();
  const [createEmployee, { isLoading, error }] = useCreateEmployeeMutation();

  async function handleSubmit(payload: CreateEmployeePayload) {
    try {
      const employee = await createEmployee(payload).unwrap();
      navigate(`/employees/${employee.id}`);
    } catch {
      // The error is shown below the form.
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <Link
          to="/employees"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to employees
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Create Employee
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a new employee to your organization.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          Could not create employee. Check the fields and try again.
        </p>
      )}

      <EmployeeForm
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        submitLabel="Create Employee"
      />
    </div>
  );
}
