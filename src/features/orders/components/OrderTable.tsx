// import { useState } from "react";
// import { Link } from "react-router-dom";

// import ConfirmDialog from "@/components/common/ConfirmDialog";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/common/Table";

// import EmptyState from "@/components/common/EmptyState";
// import type { Order } from "../types/order.types";
// import { useDeleteOrderMutation } from "@/api/orderApi";

// interface OrderTableProps {
//   orders: Order[];
// }

// const statusStyles: Record<string, string> = {
//   PENDING: "bg-amber-50 text-amber-700",
//   PROCESSING: "bg-blue-50 text-blue-700",
//   SHIPPED: "bg-violet-50 text-violet-700",
//   DELIVERED: "bg-green-50 text-green-700",
//   CANCELLED: "bg-red-50 text-red-700",
// };

// function formatStatus(status: string) {
//   return status
//     .toLowerCase()
//     .replace(/_/g, " ")
//     .replace(/\b\w/g, (character) => character.toUpperCase());
// }

// function getOrderTotal(order: Order) {
//   return order.orderDetails.reduce((total, item) => {
//     const quantity = Number(item.quantity) || 0;
//     const unitPrice = Number(item.unitPrice) || 0;
//     const discount = Number(item.discount) || 0;

//     // API discount is a percentage: 40 means 40%
//     return total + quantity * unitPrice * (1 - discount / 100);
//   }, 0);
// }

// function OrderTable({ orders }: OrderTableProps) {
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

//   const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

//   const handleDeleteClick = (order: Order) => {
//     setSelectedOrder(order);
//     setIsDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!selectedOrder) return;

//     try {
//       await deleteOrder(selectedOrder.id).unwrap();
//       setIsDeleteDialogOpen(false);
//       setSelectedOrder(null);
//     } catch (error) {
//       console.error("Failed to delete order:", error);
//     }
//   };

//   const handleDeleteCancel = () => {
//     if (isDeleting) return;

//     setIsDeleteDialogOpen(false);
//     setSelectedOrder(null);
//   };

//   if (orders.length === 0) {
//     return (
//       <EmptyState
//         title="No orders found"
//         description="Try changing your search or adjusting your filters."
//       />
//     );
//   }

//   return (
//     <>
//       <div className="w-full overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>Order Date</TableHead>
//               <TableHead>Customer</TableHead>
//               <TableHead>Phone Number</TableHead>
//               <TableHead>Created At</TableHead>
//               <TableHead>Updated At</TableHead>
//               <TableHead>Employee</TableHead>
//               <TableHead>Product</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead>Unit Price</TableHead>
//               <TableHead>Discount</TableHead>
//               <TableHead>Subtotal</TableHead>
//               <TableHead>Total</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {orders.map((order) => {
//               const customerName = order.customer
//                 ? `${order.customer.firstName} ${order.customer.lastName}`
//                 : "No customer";

//               const employeeName = order.employee
//                 ? `${order.employee.firstName} ${order.employee.lastName}`
//                 : "Unassigned";

//               const details = order.orderDetails ?? [];

//               // Empty orders still need one table row.
//               const rowCount = Math.max(details.length, 1);

//               const total = order.totalAmount ?? getOrderTotal(order);

//               return Array.from({ length: rowCount }, (_, index) => {
//                 const item = details[index];

//                 const quantity = Number(item?.quantity) || 0;
//                 const unitPrice = Number(item?.unitPrice) || 0;
//                 const discount = Number(item?.discount) || 0;

//                 const subtotal = quantity * unitPrice * (1 - discount / 100);

//                 const isFirstRow = index === 0;

//                 return (
//                   <TableRow
//                     key={`${order.id}-${index}`}
//                     className={
//                       index > 0 ? "border-t-0" : "border-t border-slate-200"
//                     }
//                   >
//                     {/* Order-level information: render once */}
//                     {isFirstRow && (
//                       <>
//                         <TableCell rowSpan={rowCount}>
//                           <span className="font-medium text-slate-600">
//                             #{order.id}
//                           </span>
//                         </TableCell>

//                         <TableCell rowSpan={rowCount}>
//                           <span className="whitespace-nowrap text-sm text-slate-700">
//                             {new Date(order.orderDate).toLocaleDateString()}
//                           </span>
//                         </TableCell>

//                         <TableCell rowSpan={rowCount}>
//                           <div className="min-w-[150px] font-medium text-slate-900">
//                             {customerName}
//                           </div>
//                         </TableCell>

//                         <TableCell rowSpan={rowCount}>
//                           <div className="min-w-[140px] text-sm text-slate-600">
//                             {order.customer?.phoneNumber || "N/A"}
//                           </div>
//                         </TableCell>
//                         <TableCell rowSpan={rowCount}>
//                           <span className="whitespace-nowrap text-sm text-slate-700">
//                             {order.createdAt
//                               ? new Date(order.createdAt).toLocaleString(
//                                   "en-BD",
//                                   {
//                                     timeZone: "Asia/Dhaka",
//                                   },
//                                 )
//                               : "-"}
//                           </span>
//                         </TableCell>

//                         <TableCell rowSpan={rowCount}>
//                           <span className="whitespace-nowrap text-sm text-slate-700">
//                             {order.updatedAt
//                               ? new Date(order.updatedAt).toLocaleString(
//                                   "en-BD",
//                                   {
//                                     timeZone: "Asia/Dhaka",
//                                   },
//                                 )
//                               : "-"}
//                           </span>
//                         </TableCell>

//                         <TableCell rowSpan={rowCount}>
//                           <span className="whitespace-nowrap text-sm text-slate-700">
//                             {employeeName}
//                           </span>
//                         </TableCell>
//                       </>
//                     )}

//                     {/* Product-level information: one row per item */}
//                     <TableCell>
//                       <div className="min-w-[160px] text-sm text-slate-700">
//                         {item?.productName ?? "No products"}
//                       </div>
//                     </TableCell>

//                     <TableCell>{item ? quantity : "-"}</TableCell>

//                     <TableCell>
//                       {item
//                         ? `৳${unitPrice.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}`
//                         : "-"}
//                     </TableCell>

//                     <TableCell>{item ? `${discount}%` : "-"}</TableCell>

//                     <TableCell>
//                       {item
//                         ? `৳${subtotal.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}`
//                         : "-"}
//                     </TableCell>

//                     {/* Order total and actions: render once */}
//                     {isFirstRow && (
//                       <>
//                         <TableCell rowSpan={rowCount}>
//                           <span className="whitespace-nowrap font-semibold text-slate-900">
//                             ৳
//                             {Number(total).toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             })}
//                           </span>
//                         </TableCell>

//                         <TableCell rowSpan={rowCount}>
//                           <span
//                             className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
//                               statusStyles[order.orderStatus] ??
//                               "bg-slate-100 text-slate-700"
//                             }`}
//                           >
//                             {formatStatus(order.orderStatus)}
//                           </span>
//                         </TableCell>

//                         <TableCell rowSpan={rowCount}>
//                           <div className="flex flex-col items-start gap-2">
//                             <Link
//                               to={`/orders/${order.id}`}
//                               className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
//                             >
//                               View
//                             </Link>

//                             <Link
//                               to={`/orders/${order.id}/edit`}
//                               className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
//                             >
//                               Edit
//                             </Link>

//                             <button
//                               type="button"
//                               disabled={isDeleting}
//                               onClick={() => handleDeleteClick(order)}
//                               className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </TableCell>
//                       </>
//                     )}
//                   </TableRow>
//                 );
//               });
//             })}
//           </TableBody>
//         </Table>
//       </div>

//       <ConfirmDialog
//         isOpen={isDeleteDialogOpen}
//         title="Delete order?"
//         description={
//           selectedOrder
//             ? `Are you sure you want to delete order #${selectedOrder.id}? This action cannot be undone.`
//             : "Are you sure you want to delete this order?"
//         }
//         confirmText="Delete Order"
//         cancelText="Cancel"
//         isLoading={isDeleting}
//         onConfirm={handleDeleteConfirm}
//         onCancel={handleDeleteCancel}
//       />
//     </>
//   );
// }

// export default OrderTable;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSession } from "@/lib/auth-client";
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
import type { Order } from "../types/order.types";
import { useDeleteOrderMutation } from "@/api/orderApi";

interface OrderTableProps {
  orders: Order[];
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PROCESSING: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-violet-50 text-violet-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getOrderTotal(order: Order) {
  return order.orderDetails.reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;

    // API discount is a percentage: 40 means 40%
    return total + quantity * unitPrice * (1 - discount / 100);
  }, 0);
}

function OrderTable({ orders }: OrderTableProps) {
  const navigate = useNavigate();
  const { data: session } = useSession();

  const userRole = session?.user?.role ?? "";

  const canEdit = ["superAdmin", "admin", "manager", "sales"].includes(
    userRole,
  );

  const canDelete = ["superAdmin", "admin"].includes(userRole);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  // Edit permission check
  const handleEditClick = (orderId: number) => {
    if (!canEdit) {
      navigate("/unauthorized");
      return;
    }

    navigate(`/orders/${orderId}/edit`);
  };

  // Delete permission check
  const handleDeleteClick = (order: Order) => {
    if (!canDelete) {
      navigate("/unauthorized");
      return;
    }

    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;

    try {
      await deleteOrder(selectedOrder.id).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const handleDeleteCancel = () => {
    if (isDeleting) return;

    setIsDeleteDialogOpen(false);
    setSelectedOrder(null);
  };

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders found"
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
              <TableHead>Order Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => {
              const customerName = order.customer
                ? `${order.customer.firstName} ${order.customer.lastName}`
                : "No customer";

              const employeeName = order.employee
                ? `${order.employee.firstName} ${order.employee.lastName}`
                : "Unassigned";

              const details = order.orderDetails ?? [];

              // Empty orders still need one table row.
              const rowCount = Math.max(details.length, 1);

              const total = order.totalAmount ?? getOrderTotal(order);

              return Array.from({ length: rowCount }, (_, index) => {
                const item = details[index];

                const quantity = Number(item?.quantity) || 0;
                const unitPrice = Number(item?.unitPrice) || 0;
                const discount = Number(item?.discount) || 0;

                const subtotal = quantity * unitPrice * (1 - discount / 100);

                const isFirstRow = index === 0;

                return (
                  <TableRow
                    key={`${order.id}-${index}`}
                    className={
                      index > 0 ? "border-t-0" : "border-t border-slate-200"
                    }
                  >
                    {/* Order-level information: render once */}
                    {isFirstRow && (
                      <>
                        <TableCell rowSpan={rowCount}>
                          <span className="font-medium text-slate-600">
                            #{order.id}
                          </span>
                        </TableCell>

                        <TableCell rowSpan={rowCount}>
                          <span className="whitespace-nowrap text-sm text-slate-700">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </span>
                        </TableCell>

                        <TableCell rowSpan={rowCount}>
                          <div className="min-w-[150px] font-medium text-slate-900">
                            {customerName}
                          </div>
                        </TableCell>

                        <TableCell rowSpan={rowCount}>
                          <div className="min-w-[140px] text-sm text-slate-600">
                            {order.customer?.phoneNumber || "N/A"}
                          </div>
                        </TableCell>

                        <TableCell rowSpan={rowCount}>
                          <span className="whitespace-nowrap text-sm text-slate-700">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleString(
                                  "en-BD",
                                  {
                                    timeZone: "Asia/Dhaka",
                                  },
                                )
                              : "-"}
                          </span>
                        </TableCell>

                        <TableCell rowSpan={rowCount}>
                          <span className="whitespace-nowrap text-sm text-slate-700">
                            {order.updatedAt
                              ? new Date(order.updatedAt).toLocaleString(
                                  "en-BD",
                                  {
                                    timeZone: "Asia/Dhaka",
                                  },
                                )
                              : "-"}
                          </span>
                        </TableCell>

                        <TableCell rowSpan={rowCount}>
                          <span className="whitespace-nowrap text-sm text-slate-700">
                            {employeeName}
                          </span>
                        </TableCell>
                      </>
                    )}

                    {/* Product-level information: one row per item */}
                    <TableCell>
                      <div className="min-w-[160px] text-sm text-slate-700">
                        {item?.productName ?? "No products"}
                      </div>
                    </TableCell>

                    <TableCell>{item ? quantity : "-"}</TableCell>

                    <TableCell>
                      {item
                        ? `৳${unitPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : "-"}
                    </TableCell>

                    <TableCell>{item ? `${discount}%` : "-"}</TableCell>

                    <TableCell>
                      {item
                        ? `৳${subtotal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : "-"}
                    </TableCell>

                    {/* Order total and actions: render once */}
                    {isFirstRow && (
                      <>
                        <TableCell rowSpan={rowCount}>
                          <span className="whitespace-nowrap font-semibold text-slate-900">
                            ৳
                            {Number(total).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </TableCell>

                        <TableCell rowSpan={rowCount}>
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                              statusStyles[order.orderStatus] ??
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {formatStatus(order.orderStatus)}
                          </span>
                        </TableCell>

                        <TableCell rowSpan={rowCount}>
                          <div className="flex flex-col items-start gap-2">
                            <Link
                              to={`/orders/${order.id}`}
                              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                            >
                              View
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleEditClick(order.id)}
                              className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => handleDeleteClick(order)}
                              className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              });
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete order?"
        description={
          selectedOrder
            ? `Are you sure you want to delete order #${selectedOrder.id}? This action cannot be undone.`
            : "Are you sure you want to delete this order?"
        }
        confirmText="Delete Order"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}

export default OrderTable;
