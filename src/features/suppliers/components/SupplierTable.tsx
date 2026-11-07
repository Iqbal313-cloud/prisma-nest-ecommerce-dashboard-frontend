import { useState } from "react";
import { Link } from "react-router-dom";

import { useDeleteSupplierMutation } from "@/api/supplierApi";
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

import type { Supplier } from "../types/supplier.types";

interface SupplierTableProps {
  suppliers: Supplier[];
}

function SupplierTable({ suppliers }: SupplierTableProps) {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [deleteSupplier, { isLoading: isDeleting }] =
    useDeleteSupplierMutation();

  const [deleteError, setDeleteError] = useState("");

  // Open delete confirmation dialog
  const handleDeleteClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDeleteError("");
    setIsDeleteDialogOpen(true);
  };

  // Confirm supplier deletion
  const handleDeleteConfirm = async () => {
    if (!selectedSupplier) return;

    try {
      await deleteSupplier(selectedSupplier.id).unwrap();

      setIsDeleteDialogOpen(false);
      setSelectedSupplier(null);
      setDeleteError("");
    } catch (error) {
      console.error("Failed to delete supplier:", error);

      setDeleteError("Failed to delete supplier. Please try again.");
    }
  };

  // Cancel supplier deletion
  const handleDeleteCancel = () => {
    if (isDeleting) return;

    setIsDeleteDialogOpen(false);
    setSelectedSupplier(null);
    setDeleteError("");
  };

  // Empty state
  if (suppliers.length === 0) {
    return (
      <EmptyState
        title="No suppliers found"
        description="Try changing your search or adjusting your filters."
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
              <TableHead>Supplier</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Updated By</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                {/* ID */}
                <TableCell>
                  <span className="font-medium text-slate-600">
                    #{supplier.id}
                  </span>
                </TableCell>

                {/* Supplier */}
                <TableCell>
                  <div className="min-w-[180px]">
                    <p className="font-medium text-slate-900">
                      {supplier.supplierName}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {supplier.contactName || "No contact person"}
                    </p>
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <span className="text-sm text-slate-700">
                    {supplier.contactName || "-"}
                  </span>
                </TableCell>

                {/* Location */}
                <TableCell>
                  <div className="min-w-[160px] text-sm text-slate-700">
                    {supplier.address || "-"}
                  </div>
                </TableCell>

                {/* City */}
                <TableCell>
                  <span className="text-sm text-slate-700">
                    {supplier.city || "-"}
                  </span>
                </TableCell>

                {/* Country */}
                <TableCell>
                  <span className="text-sm text-slate-700">
                    {supplier.country || "-"}
                  </span>
                </TableCell>

                {/* Phone */}
                <TableCell>
                  <span className="whitespace-nowrap text-sm text-slate-700">
                    {supplier.phone || "-"}
                  </span>
                </TableCell>

                {/* Products count */}
                <TableCell>
                  <span className="font-medium text-slate-700">
                    {supplier._count?.products ??
                      supplier.products?.length ??
                      0}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* View */}
                    <Link
                      to={`/suppliers/${supplier.id}`}
                      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    >
                      View
                    </Link>

                    {/* Edit */}
                    <Link
                      to={`/suppliers/${supplier.id}/edit`}
                      className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                    >
                      Edit
                    </Link>

                    {/* Delete */}
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDeleteClick(supplier)}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="min-w-[120px] text-sm text-slate-700">
                    {supplier.createdBy?.name || "-"}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="min-w-[120px] text-sm text-slate-700">
                    {supplier.updatedBy?.name || "-"}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete supplier?"
        description={
          selectedSupplier
            ? `Are you sure you want to delete "${selectedSupplier.supplierName}"? This action cannot be undone.`
            : "Are you sure you want to delete this supplier?"
        }
        confirmText="Delete Supplier"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Delete error */}
      {deleteError && (
        <p role="alert" className="px-4 py-3 text-sm text-red-600">
          {deleteError}
        </p>
      )}
    </>
  );
}

export default SupplierTable;
