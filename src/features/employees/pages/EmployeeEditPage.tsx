import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} from "@/api/employeeApi";
import EmployeeForm from "../components/EmployeeForm";
import type { CreateEmployeePayload } from "../types/employee.types";
import ErrorMessage from "@/components/common/ErrorMessage";
import Loading from "@/components/common/Loading";

export default function EmployeeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const employeeId = Number(id);
  const validId = Number.isInteger(employeeId) && employeeId > 0;

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetEmployeeByIdQuery(employeeId, {
    skip: !validId,
  });

  const [updateEmployee, { isLoading: isUpdating, error: updateError }] =
    useUpdateEmployeeMutation();

  if (!validId) {
    return <p className="text-sm text-red-600">Invalid employee ID.</p>;
  }

  if (isLoading) {
    return <Loading message="Loading employee..." minHeight="min-h-[300px]" />;
  }

  if (isError || !response?.data) {
    return (
      <div className="space-y-3">
        <ErrorMessage message="Could not load this employee." />

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Retry
        </button>
      </div>
    );
  }

  const employee = response.data;

  async function handleSubmit(payload: CreateEmployeePayload) {
    try {
      await updateEmployee({
        id: employeeId,
        body: payload,
      }).unwrap();

      navigate(`/employees/${employeeId}`);
    } catch {
      // The error is shown below the form.
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <Link
          to={`/employees/${employeeId}`}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to employee
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Edit Employee #{employee.id}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update the employee information.
        </p>
      </div>

      {updateError && (
        <p role="alert" className="text-sm text-red-600">
          Could not update employee. Check the fields and try again.
        </p>
      )}

      <EmployeeForm
        initialData={employee}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        submitLabel="Save Changes"
      />
    </div>
  );
}
