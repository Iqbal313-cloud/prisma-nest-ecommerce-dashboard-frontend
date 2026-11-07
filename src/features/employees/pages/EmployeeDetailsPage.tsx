import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetEmployeeByIdQuery } from "@/api/employeeApi";
import ErrorMessage from "@/components/common/ErrorMessage";
import Loading from "@/components/common/Loading";

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
  });
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/\_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusStyles(status: string) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-violet-100 text-violet-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return styles[status] ?? "bg-slate-100 text-slate-700";
}

export default function EmployeeDetailsPage() {
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
  const orders = employee.orders ?? [];
  const orderCount = employee._count?.orders ?? orders.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/employees")}
          className="mb-3 text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to employees
        </button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {employee.firstName} {employee.lastName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Employee ID: #{employee.id}
            </p>
          </div>

          <Link
            to={`/employees/${employee.id}/edit`}
            className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Edit Employee
          </Link>
        </div>
      </div>

      {/* Employee Information */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Employee Information
        </h2>

        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-sm text-slate-500">Employee ID</dt>
            <dd className="mt-1 font-medium text-slate-900">#{employee.id}</dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">First name</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {employee.firstName}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Last name</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {employee.lastName}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Birth date</dt>
            <dd className="mt-1 text-sm text-slate-700">
              {employee.birthDate
                ? new Date(employee.birthDate).toLocaleDateString("en-BD", {
                    timeZone: "Asia/Dhaka",
                  })
                : "-"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Photo path</dt>
            <dd className="mt-1 break-words text-sm text-slate-700">
              {employee.photoPath || "-"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Total orders</dt>
            <dd className="mt-1 font-medium text-slate-900">{orderCount}</dd>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <dt className="text-sm text-slate-500">Notes</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
              {employee.notes || "-"}
            </dd>
          </div>

          {/* Audit Information */}
          <div>
            <dt className="text-sm text-slate-500">Created At</dt>
            <dd className="mt-1 text-sm text-slate-700">
              {formatDate(employee.createdAt)}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Updated At</dt>
            <dd className="mt-1 text-sm text-slate-700">
              {formatDate(employee.updatedAt)}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Created By</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {employee.createdBy?.name || "-"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Updated By</dt>
            <dd className="mt-1 font-medium text-slate-900">
              {employee.updatedBy?.name || "-"}
            </dd>
          </div>
        </dl>
      </section>

      {/* Assigned Orders */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Assigned Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {orders.length} order{orders.length === 1 ? "" : "s"} returned by
            the API.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="font-medium text-slate-700">No orders found</p>
            <p className="mt-1 text-sm text-slate-500">
              No orders are currently associated with this employee.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Order Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      #{order.id}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatDate(order.orderDate)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyles(order.orderStatus)}`}
                      >
                        {formatStatus(order.orderStatus)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
