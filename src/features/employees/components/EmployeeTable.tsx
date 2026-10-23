// import { Link } from "react-router-dom";
// import type { Employee } from "../types/employee.types";

// interface EmployeeTableProps {
//   employees: Employee[];
//   onDelete: (employee: Employee) => void;
//   isDeleting: boolean;
// }

// function formatDate(value?: string | null) {
//   if (!value) return "-";

//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "-";

//   return date.toLocaleDateString("en-BD", {
//     timeZone: "Asia/Dhaka",
//   });
// }

// export default function EmployeeTable({
//   employees,
//   onDelete,
//   isDeleting,
// }: EmployeeTableProps) {
//   if (employees.length === 0) {
//     return (
//       <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
//         <p className="font-medium text-slate-700">No employees found</p>
//         <p className="mt-1 text-sm text-slate-500">
//           Try changing your filters or create a new employee.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
//       <table className="w-full min-w-[850px] text-left text-sm">
//         <thead className="bg-slate-50 text-slate-600">
//           <tr>
//             <th className="px-4 py-3 font-medium">ID</th>
//             <th className="px-4 py-3 font-medium">Employee</th>
//             <th className="px-4 py-3 font-medium">Birth date</th>
//             <th className="px-4 py-3 font-medium">Orders</th>
//             <th className="px-4 py-3 font-medium">Photo path</th>
//             <th className="px-4 py-3 text-right font-medium">Actions</th>
//           </tr>
//         </thead>

//         <tbody className="divide-y divide-slate-100">
//           {employees.map((employee) => (
//             <tr key={employee.id} className="hover:bg-slate-50/70">
//               <td className="px-4 py-3 font-medium text-slate-900">
//                 #{employee.id}
//               </td>

//               <td className="px-4 py-3">
//                 <p className="font-medium text-slate-900">
//                   {employee.firstName} {employee.lastName}
//                 </p>
//                 {employee.notes && (
//                   <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
//                     {employee.notes}
//                   </p>
//                 )}
//               </td>

//               <td className="whitespace-nowrap px-4 py-3 text-slate-600">
//                 {formatDate(employee.birthDate)}
//               </td>

//               <td className="px-4 py-3 text-slate-600">
//                 {employee._count?.orders ?? employee.orders?.length ?? 0}
//               </td>

//               <td className="max-w-[180px] truncate px-4 py-3 text-slate-600">
//                 {employee.photoPath || "-"}
//               </td>

//               <td className="px-4 py-3">
//                 <div className="flex justify-end gap-3 whitespace-nowrap">
//                   <Link
//                     to={`/employees/${employee.id}`}
//                     className="font-medium text-slate-700 hover:text-orange-600"
//                   >
//                     Details
//                   </Link>

//                   <Link
//                     to={`/employees/${employee.id}/edit`}
//                     className="font-medium text-orange-600 hover:text-orange-700"
//                   >
//                     Edit
//                   </Link>

//                   <button
//                     type="button"
//                     disabled={isDeleting}
//                     onClick={() => onDelete(employee)}
//                     className="font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

import EmptyState from "@/components/common/EmptyState";

import type { Employee } from "../types/employee.types";

// Keep your existing EmployeeTableProps and formatDate imports
// if they are already defined in your project.

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (employee: Employee) => void;
  isDeleting: boolean;
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-BD", {
    timeZone: "Asia/Dhaka",
  });
}

export default function EmployeeTable({
  employees,
  onDelete,
  isDeleting,
}: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <EmptyState
        title="No employees found"
        description="Try changing your filters or create a new employee."
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Birth date</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Photo path</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              {/* ID */}
              <TableCell>
                <span className="font-medium text-slate-600">
                  #{employee.id}
                </span>
              </TableCell>

              {/* Employee */}
              <TableCell>
                <div className="min-w-[180px]">
                  <p className="font-medium text-slate-900">
                    {employee.firstName} {employee.lastName}
                  </p>

                  {employee.notes && (
                    <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500">
                      {employee.notes}
                    </p>
                  )}
                </div>
              </TableCell>

              {/* Birth date */}
              <TableCell>
                <span className="whitespace-nowrap text-sm text-slate-700">
                  {formatDate(employee.birthDate)}
                </span>
              </TableCell>

              {/* Orders */}
              <TableCell>
                <span className="font-medium text-slate-700">
                  {employee._count?.orders ?? employee.orders?.length ?? 0}
                </span>
              </TableCell>

              {/* Photo path */}
              <TableCell>
                <div
                  className="max-w-[180px] truncate text-sm text-slate-600"
                  title={employee.photoPath || ""}
                >
                  {employee.photoPath || "-"}
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  {/* View */}
                  <Link
                    to={`/employees/${employee.id}`}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  >
                    View
                  </Link>

                  {/* Edit */}
                  <Link
                    to={`/employees/${employee.id}/edit`}
                    className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                  >
                    Edit
                  </Link>

                  {/* Delete */}
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => onDelete(employee)}
                    className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
