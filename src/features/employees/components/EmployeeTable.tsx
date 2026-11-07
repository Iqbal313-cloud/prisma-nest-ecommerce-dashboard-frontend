import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteEmployeeMutation } from "@/api/employeeApi";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

import type { Employee } from "../types/employee.types";

interface EmployeeTableProps {
  employees: Employee[];
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
  });
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [deleteEmployee, { isLoading: isDeleting }] =
    useDeleteEmployeeMutation();

  async function handleDeleteConfirm() {
    if (!selectedEmployee) return;

    try {
      await deleteEmployee(selectedEmployee.id).unwrap();

      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  }

  function handleDeleteCancel() {
    if (isDeleting) return;

    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  }

  if (employees.length === 0) {
    return (
      <EmptyState
        title="No employees found"
        description="Try changing your filters or create a new employee."
      />
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Birth date</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Photo path</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Updated By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <span className="font-medium text-slate-600">
                    #{employee.id}
                  </span>
                </TableCell>

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

                <TableCell>
                  <span className="whitespace-nowrap text-sm text-slate-700">
                    {formatDate(employee.birthDate)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="font-medium text-slate-700">
                    {employee._count?.orders ?? employee.orders?.length ?? 0}
                  </span>
                </TableCell>

                <TableCell>
                  <div
                    className="max-w-[180px] truncate text-sm text-slate-600"
                    title={employee.photoPath || ""}
                  >
                    {employee.photoPath || "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="whitespace-nowrap text-sm text-slate-700">
                    {formatDate(employee.createdAt)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="whitespace-nowrap text-sm text-slate-700">
                    {formatDate(employee.updatedAt)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="whitespace-nowrap text-sm text-slate-700">
                    {employee.createdBy?.name || "-"}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="whitespace-nowrap text-sm text-slate-700">
                    {employee.updatedBy?.name || "-"}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Link
                      to={`/employees/${employee.id}`}
                      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      View
                    </Link>

                    <Link
                      to={`/employees/${employee.id}/edit`}
                      className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
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

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete employee?"
        description={
          selectedEmployee
            ? `Are you sure you want to delete "${selectedEmployee.firstName} ${selectedEmployee.lastName}"?`
            : "Are you sure you want to delete this employee?"
        }
        confirmText="Delete Employee"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}
