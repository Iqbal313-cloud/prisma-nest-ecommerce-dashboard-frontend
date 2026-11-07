import { useState } from "react";
import { Link } from "react-router-dom";

import { useDeleteProductMutation } from "@/api/productApi";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import EmptyState from "@/components/common/EmptyState";
import type { Product } from "../types/product.types";

interface ProductTableProps {
  products: Product[];
}

function ProductTable({ products }: ProductTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) {
      return;
    }

    try {
      await deleteProduct(selectedProduct.id).unwrap();

      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleDeleteCancel = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
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
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Updated By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                {/* ID */}
                <TableCell>
                  <span className="font-medium text-slate-600">
                    #{product.id}
                  </span>
                </TableCell>

                {/* Product */}
                <TableCell>
                  <div className="min-w-[180px]">
                    <p className="font-medium text-slate-900">
                      {product.productName}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {product.slug}
                    </p>
                  </div>
                </TableCell>

                {/* SKU */}
                <TableCell>
                  <span className="font-mono text-xs text-slate-600">
                    {product.sku}
                  </span>
                </TableCell>

                {/* Category */}
                <TableCell>
                  {product.category ? (
                    <span className="text-sm text-slate-700">
                      {product.category.categoryName}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </TableCell>

                {/* Supplier */}
                <TableCell>
                  {product.supplier ? (
                    <span className="text-sm text-slate-700">
                      {product.supplier.supplierName}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </TableCell>

                {/* Price */}
                <TableCell>
                  <span className="font-medium text-slate-900">
                    ৳{Number(product.unitPrice).toLocaleString()}
                  </span>
                </TableCell>

                {/* Stock */}
                <TableCell>
                  <span
                    className={
                      product.unitsInStock === 0
                        ? "font-medium text-red-600"
                        : product.unitsInStock <= 10
                          ? "font-medium text-amber-600"
                          : "font-medium text-slate-700"
                    }
                  >
                    {product.unitsInStock}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  {product.discontinued ? (
                    <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                      Discontinued
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                      Active
                    </span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* View */}
                    <Link
                      to={`/products/${product.id}`}
                      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    >
                      View
                    </Link>

                    {/* Edit */}
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                    >
                      Edit
                    </Link>

                    {/* Delete */}
                    <button
                      type="button"
                      disabled={isDeleting}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => handleDeleteClick(product)}
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>

                <TableCell>{product.createdBy?.name ?? "Unknown"}</TableCell>

                <TableCell>{product.updatedBy?.name ?? "—"}</TableCell>

                <TableCell>
                  {product.createdAt
                    ? new Date(product.createdAt).toLocaleString("en-BD", {
                        timeZone: "Asia/Dhaka",
                      })
                    : "-"}
                </TableCell>

                <TableCell>
                  {product.updatedAt
                    ? new Date(product.updatedAt).toLocaleString("en-BD", {
                        timeZone: "Asia/Dhaka",
                      })
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete product?"
        description={
          selectedProduct
            ? `Are you sure you want to delete "${selectedProduct.productName}"? This action cannot be undone.`
            : "Are you sure you want to delete this product?"
        }
        confirmText="Delete Product"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}

export default ProductTable;
