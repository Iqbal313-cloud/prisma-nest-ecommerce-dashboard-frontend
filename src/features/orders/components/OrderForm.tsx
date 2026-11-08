import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "@/api/productApi";
import {
  AlertCircle,
  ClipboardList,
  Package,
  Trash2,
  Plus,
  Search,
  ChevronDown,
  X,
} from "lucide-react";

import { useCreateOrderMutation, useUpdateOrderMutation } from "@/api/orderApi";
import useDebounce from "@/hooks/useDebounce";

import type {
  Order,
  CreateOrderPayload,
  UpdateOrderPayload,
  CreateOrderDetailPayload,
} from "../types/order.types";

import type { Product } from "../../products/types/product.types";

interface OrderFormProps {
  order?: Order;
  mode?: "create" | "edit";
}

interface FormDetail {
  productId: string;
  productName?: string;
  quantity: string;
  unitPrice: string;
  discount: string;
}

interface FormState {
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerAddress: string;
  employeeId: string;
  orderDate: string;
  orderStatus: string;
  orderDetails: FormDetail[];
}

const createEmptyDetail = (): FormDetail => ({
  productId: "",
  productName: "",
  quantity: "1",
  unitPrice: "0",
  discount: "0",
});

const initialFormState: FormState = {
  customerFirstName: "",
  customerLastName: "",
  customerPhone: "",
  customerAddress: "",
  employeeId: "",
  orderDate: (() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  })(),
  orderStatus: "PENDING",
  orderDetails: [createEmptyDetail()],
};

function toDateInput(value?: string | Date | null): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function getInitialFormState(order?: Order): FormState {
  if (!order) {
    return {
      ...initialFormState,
      orderDetails: [createEmptyDetail()],
    };
  }

  const orderData = order as Order & {
    customerId?: number | string | null;
    employeeId?: number | string | null;
    customer?: {
      id?: number | string;
      firstName?: string | null;
      lastName?: string | null;
      phoneNumber?: string | null;
      address?: string | null;
    } | null;
    employee?: { id?: number | string } | null;
    orderDetails?: Array<{
      productId?: number | string | null;
      productName?: string | null;
      product?: {
        id?: number | string;
        productName?: string | null;
        name?: string | null;
      } | null;
      quantity?: number;
      unitPrice?: number | string;
      discount?: number | string;
    }>;
  };

  return {
    customerFirstName: orderData.customer?.firstName ?? "",
    customerLastName: orderData.customer?.lastName ?? "",
    customerPhone: orderData.customer?.phoneNumber ?? "",
    customerAddress: orderData.customer?.address ?? "",
    employeeId: String(orderData.employeeId ?? orderData.employee?.id ?? ""),
    orderDate: toDateInput(orderData.orderDate),
    orderStatus: orderData.orderStatus ?? "PENDING",

    orderDetails: orderData.orderDetails?.length
      ? orderData.orderDetails.map((detail) => ({
          productId: String(detail.productId ?? detail.product?.id ?? ""),
          productName: detail.productName ?? detail.product?.productName ?? "",
          quantity: String(detail.quantity ?? 1),
          unitPrice: String(detail.unitPrice ?? 0),
          discount: String(detail.discount ?? 0),
        }))
      : [createEmptyDetail()],
  };
}

/* ------------------------------------------------------------------ */
/* Searchable Product Select                                          */
/* ------------------------------------------------------------------ */

interface ProductSelectProps {
  value: string;
  selectedName?: string;
  onChange: (productId: string, unitPrice: string, productName: string) => void;
  inputClass: string;
}

function ProductSelect({
  value,
  selectedName = "",
  onChange,
  inputClass,
}: ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(selectedName);

  const debouncedSearch = useDebounce(search, 350);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: productsResponse,
    isLoading,
    isError,
    isFetching,
  } = useGetProductsQuery(
    {
      page: 1,
      limit: 30,
      productName: debouncedSearch.trim() || undefined,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const products: Product[] = productsResponse?.data ?? [];

  const selectedProduct = products.find(
    (product) => String(product.id) === value,
  );

  // Keep input text in sync with parent
  useEffect(() => {
    setSearch(selectedName || "");
  }, [selectedName, value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch(selectedName || "");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedName]);

  const handleSelect = (product: Product) => {
    const name = product.productName || `Product #${product.id}`;

    onChange(
      String(product.id),
      product.unitPrice != null ? String(product.unitPrice) : "0",
      name,
    );

    setSearch(name);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();

    onChange("", "0", "");
    setSearch("");
    setOpen(true);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          value={search}
          placeholder={
            isLoading || isFetching
              ? "Searching..."
              : isError
                ? "Failed to load"
                : "Search by product name..."
          }
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);

            if (value) {
              onChange("", "0", "");
            }
          }}
          onFocus={() => setOpen(true)}
          className={`${inputClass} pl-10 pr-10`}
        />

        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            title="Clear"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
      </div>

      {/* Selected Product Stock Status */}
      {value && selectedProduct && (
        <div className="mt-1.5">
          {selectedProduct.unitsInStock === 0 ? (
            <p className="flex items-center gap-1 text-xs font-medium text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              Out of Stock
            </p>
          ) : (
            <p className="text-xs font-medium text-emerald-600">
              Available Stock: {selectedProduct.unitsInStock}
            </p>
          )}
        </div>
      )}

      {/* Product Dropdown */}
      {open && (
        <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {isLoading || isFetching ? (
            <li className="px-4 py-3 text-sm text-slate-500">Loading...</li>
          ) : isError ? (
            <li className="px-4 py-3 text-sm text-red-500">
              Failed to load products
            </li>
          ) : products.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">
              No products found
            </li>
          ) : (
            products.map((product) => {
              const name = product.productName || `Product #${product.id}`;

              const isSelected = String(product.id) === value;

              return (
                <li key={product.id}>
                  <button
                    type="button"
                    disabled={product.unitsInStock <= 0 && !isSelected}
                    onClick={() => handleSelect(product)}
                    className={`flex w-full flex-col items-start px-4 py-2.5 text-left text-sm transition ${
                      product.unitsInStock <= 0 && !isSelected
                        ? "cursor-not-allowed bg-slate-50 opacity-60"
                        : isSelected
                          ? "bg-blue-50 font-medium text-blue-700"
                          : "text-slate-700 hover:bg-blue-50"
                    }`}
                  >
                    <span>{name}</span>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {product.sku && (
                        <span className="text-xs text-slate-400">
                          SKU: {product.sku}
                        </span>
                      )}

                      {product.unitsInStock === 0 ? (
                        <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Stock: {product.unitsInStock}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Order Form                                                    */
/* ------------------------------------------------------------------ */

function OrderForm({ order, mode = "create" }: OrderFormProps) {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(() => getInitialFormState(order));
  const [error, setError] = useState<string | null>(null);

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const isEdit = mode === "edit";
  const isSubmitting = isCreating || isUpdating;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleDetailChange = (
    index: number,
    field: keyof FormDetail,
    value: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      orderDetails: previous.orderDetails.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail,
      ),
    }));
  };

  const handleProductChange = (
    index: number,
    productId: string,
    unitPrice: string,
    productName: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      orderDetails: previous.orderDetails.map((item, i) =>
        i === index
          ? {
              ...item,
              productId,
              unitPrice,
              productName,
            }
          : item,
      ),
    }));
  };

  const addDetail = () => {
    setForm((previous) => ({
      ...previous,
      orderDetails: [...previous.orderDetails, createEmptyDetail()],
    }));
  };

  const removeDetail = (index: number) => {
    setForm((previous) => ({
      ...previous,
      orderDetails: previous.orderDetails.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.customerFirstName.trim()) {
      setError("Customer first name is required.");
      return;
    }

    if (!form.customerPhone.trim()) {
      setError("Customer phone number is required.");
      return;
    }

    if (!form.orderDate) {
      setError("Order date is required.");
      return;
    }

    if (form.orderDetails.length === 0) {
      setError("At least one order item is required.");
      return;
    }

    const details: CreateOrderDetailPayload[] = [];

    for (const detail of form.orderDetails) {
      const productId = Number(detail.productId);
      const quantity = Number(detail.quantity);
      const unitPrice = Number(detail.unitPrice);
      const discount = Number(detail.discount);

      if (!Number.isInteger(productId) || productId <= 0) {
        setError("Every order item needs a valid Product.");
        return;
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        setError("Quantity must be a positive whole number.");
        return;
      }

      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        setError("Unit price must be a valid non-negative number.");
        return;
      }

      if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
        setError("Discount must be between 0 and 100.");
        return;
      }

      details.push({
        productId,
        quantity,
        unitPrice,
        ...(discount > 0 ? { discount } : {}),
      });
    }

    const payload: CreateOrderPayload = {
      customerFirstName: form.customerFirstName.trim(),
      customerLastName: form.customerLastName.trim() || undefined,
      customerPhone: form.customerPhone.trim(),
      customerAddress: form.customerAddress.trim() || undefined,
      orderDate: form.orderDate,
      orderStatus: form.orderStatus,
      ...(form.employeeId.trim() && {
        employeeId: Number(form.employeeId),
      }),
      orderDetails: details,
    };

    try {
      if (isEdit && order) {
        const originalPhone = order.customer?.phoneNumber?.trim() ?? "";

        const updatePayload: UpdateOrderPayload = {
          customerFirstName: payload.customerFirstName,
          customerLastName: payload.customerLastName,
          customerAddress: payload.customerAddress,

          ...(form.customerPhone.trim() !== originalPhone
            ? { customerPhone: payload.customerPhone }
            : {}),

          orderDate: payload.orderDate,
          orderStatus: payload.orderStatus,

          ...(payload.employeeId !== undefined
            ? { employeeId: payload.employeeId }
            : {}),

          orderDetails: payload.orderDetails,
        };

        await updateOrder({
          id: order.id,
          body: updatePayload,
        }).unwrap();

        navigate(`/orders/${order.id}`);
      } else {
        const createdOrder = await createOrder(payload).unwrap();
        navigate(`/orders/${createdOrder.id}`);
      }
    } catch (err: any) {
      console.error("Failed to save order:", err);

      const message =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        "Failed to save order. Please try again.";

      setError(Array.isArray(message) ? message.join(", ") : message);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const renderInput = (
    name: "employeeId" | "orderDate",
    label: string,
    type: string,
    required = false,
  ) => (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        required={required}
        min={type === "number" ? 1 : undefined}
        className={inputClass}
      />
    </div>
  );

  const totalAmount = form.orderDetails.reduce((total, detail) => {
    const quantity = Number(detail.quantity) || 0;
    const price = Number(detail.unitPrice) || 0;
    const discount = Number(detail.discount) || 0;

    return total + quantity * price * (1 - discount / 100);
  }, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-medium">Unable to save order</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Order Information */}
      <section className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ClipboardList className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Order Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter customer and order details.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="customerFirstName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              First Name <span className="text-red-500">*</span>
            </label>

            <input
              id="customerFirstName"
              name="customerFirstName"
              type="text"
              value={form.customerFirstName}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="customerLastName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Last Name
            </label>

            <input
              id="customerLastName"
              name="customerLastName"
              type="text"
              value={form.customerLastName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="customerPhone"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>

            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              value={form.customerPhone}
              onChange={handleChange}
              required
              autoComplete="tel"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="customerAddress"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Address
            </label>

            <input
              id="customerAddress"
              name="customerAddress"
              type="text"
              value={form.customerAddress}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {renderInput("employeeId", "Employee ID", "number")}
          {renderInput("orderDate", "Order Date", "datetime-local", true)}

          <div>
            <label
              htmlFor="orderStatus"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Order Status
            </label>

            <select
              id="orderStatus"
              name="orderStatus"
              value={form.orderStatus}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      {/* Order Items */}
      <section className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">Order Items</h2>

              <p className="mt-1 text-sm text-slate-500">
                Add products and their quantities.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={addDetail}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        <div className="space-y-4 p-6">
          {form.orderDetails.map((detail, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-2 lg:grid-cols-5"
            >
              {/* Searchable Product */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product *
                </label>

                <ProductSelect
                  value={detail.productId}
                  selectedName={detail.productName}
                  onChange={(productId, unitPrice, productName) =>
                    handleProductChange(
                      index,
                      productId,
                      unitPrice,
                      productName,
                    )
                  }
                  inputClass={inputClass}
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Quantity *
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={detail.quantity}
                  onChange={(e) =>
                    handleDetailChange(index, "quantity", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* Unit Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Unit Price *
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={detail.unitPrice}
                  onChange={(e) =>
                    handleDetailChange(index, "unitPrice", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* Discount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Discount (%)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={detail.discount}
                  onChange={(e) =>
                    handleDetailChange(index, "discount", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* Remove */}
              <div className="flex items-start pt-7">
                <button
                  type="button"
                  onClick={() => removeDetail(index)}
                  disabled={form.orderDetails.length === 1}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Estimated Total */}
          <div className="flex justify-end border-t border-slate-100 pt-4">
            <div className="text-right">
              <p className="text-sm text-slate-500">Estimated Total</p>

              <p className="text-xl font-bold text-slate-900">
                {totalAmount.toLocaleString("en-BD", {
                  style: "currency",
                  currency: "BDT",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Footer */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur-md">
        <p className="hidden pl-2 text-xs text-slate-400 sm:block">
          Check the order information before saving.
        </p>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Update Order"
                : "Create Order"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default OrderForm;
