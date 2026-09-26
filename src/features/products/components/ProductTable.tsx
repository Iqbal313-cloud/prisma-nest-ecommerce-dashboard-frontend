import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

import type { Product } from "../types/product.types";

interface ProductTableProps {
  products: Product[];
}

function ProductTable({ products }: ProductTableProps) {
  return (
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
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.id}</TableCell>

            <TableCell>
              <div>
                <p className="font-medium text-slate-900">
                  {product.productName}
                </p>

                <p className="text-xs text-slate-500">{product.slug}</p>
              </div>
            </TableCell>

            <TableCell>{product.sku}</TableCell>

            <TableCell>{product.category?.categoryName ?? "-"}</TableCell>

            <TableCell>{product.supplier?.supplierName ?? "-"}</TableCell>

            <TableCell>৳{product.unitPrice}</TableCell>

            <TableCell>{product.unitsInStock}</TableCell>

            <TableCell>
              {product.discontinued ? (
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                  Discontinued
                </span>
              ) : (
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                  Active
                </span>
              )}
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-2">
                {/* View / Edit / Delete */}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ProductTable;
