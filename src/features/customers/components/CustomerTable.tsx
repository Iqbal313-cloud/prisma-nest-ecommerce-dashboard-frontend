import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteCustomerMutation } from "@/api/customerApi";
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
import type { Customer } from "../types/customer.types";

interface CustomerTableProps {
  customers: Customer[];
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
  });
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  async function handleDeleteConfirm() {
    if (!selectedCustomer) return;

    try {
      await deleteCustomer(selectedCustomer.id).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  }

  function handleDeleteCancel() {
    if (isDeleting) return;

    setIsDeleteDialogOpen(false);
    setSelectedCustomer(null);
  }

  if (customers.length === 0) {
    return (
      <EmptyState
        title="No customers found"
        description="Try changing your search or adjusting your filters."
      />
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <span className="font-medium text-slate-600">
                    #{customer.id}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="min-w-[160px] font-medium text-slate-900">
                    {customer.firstName} {customer.lastName}
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-slate-700">
                    {customer.phoneNumber}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="max-w-[220px] truncate text-sm text-slate-700">
                    {customer.address || "-"}
                  </div>
                </TableCell>

                <TableCell>
                  <span className="whitespace-nowrap text-sm text-slate-600">
                    {formatDate(customer.createdAt)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="whitespace-nowrap text-sm text-slate-600">
                    {formatDate(customer.updatedAt)}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      View
                    </Link>

                    <Link
                      to={`/customers/${customer.id}/edit`}
                      className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => {
                        setSelectedCustomer(customer);
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
        title="Delete customer?"
        description={
          selectedCustomer
            ? `Are you sure you want to delete "${selectedCustomer.firstName} ${selectedCustomer.lastName}"?`
            : "Are you sure you want to delete this customer?"
        }
        confirmText="Delete Customer"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}
