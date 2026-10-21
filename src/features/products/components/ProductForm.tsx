import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/api/productApi";
import { useGetCategoriesQuery } from "@/api/categoryApi";
import { useGetSuppliersQuery } from "@/api/supplierApi";

import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "../types/product.types";
import {
  AlertCircle,
  CircleCheck,
  CircleX,
  ListFilter,
  Package,
  Tag,
} from "lucide-react";

interface ProductFormProps {
  product?: Product;
  mode?: "create" | "edit";
}

interface FormState {
  productName: string;
  shortDescription: string;
  description: string;
  quantityPerUnit: string;
  unitPrice: string;
  unitsInStock: string;
  unitsOnOrder: string;
  discontinued: boolean;
  categoryId: string;
  supplierId: string;
}

const initialFormState: FormState = {
  productName: "",
  shortDescription: "",
  description: "",
  quantityPerUnit: "",
  unitPrice: "",
  unitsInStock: "",
  unitsOnOrder: "",
  discontinued: false,
  categoryId: "",
  supplierId: "",
};

const getInitialFormState = (product?: Product): FormState => {
  if (!product) {
    return initialFormState;
  }

  return {
    productName: product.productName ?? "",
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    quantityPerUnit: product.quantityPerUnit ?? "",
    unitPrice: product.unitPrice ?? "",
    unitsInStock:
      product.unitsInStock !== null && product.unitsInStock !== undefined
        ? String(product.unitsInStock)
        : "",
    unitsOnOrder:
      product.unitsOnOrder !== null && product.unitsOnOrder !== undefined
        ? String(product.unitsOnOrder)
        : "",
    discontinued: product.discontinued ?? false,
    categoryId: product.category?.id ? String(product.category.id) : "",
    supplierId: product.supplier?.id ? String(product.supplier.id) : "",
  };
};

function ProductForm({ product, mode = "create" }: ProductFormProps) {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(() =>
    getInitialFormState(product),
  );

  useEffect(() => {
    if (product) {
      setForm(getInitialFormState(product));
    }
  }, [product]);

  const [error, setError] = useState<string | null>(null);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  const { data: suppliersResponse, isLoading: isSuppliersLoading } =
    useGetSuppliersQuery({
      page: 1,
      limit: 100,
    });

  const suppliers = suppliersResponse?.data ?? [];

  const isEdit = mode === "edit";
  const isSubmitting = isCreating || isUpdating;

  // ==========================================
  // Input handler
  // ==========================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // Checkbox handler
  // ==========================================

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!form.productName.trim()) {
      setError("Product name is required.");
      return;
    }

    const payload: CreateProductPayload = {
      productName: form.productName.trim(),

      ...(form.shortDescription.trim() && {
        shortDescription: form.shortDescription.trim(),
      }),

      ...(form.description.trim() && {
        description: form.description.trim(),
      }),

      ...(form.quantityPerUnit.trim() && {
        quantityPerUnit: form.quantityPerUnit.trim(),
      }),

      ...(form.unitPrice !== "" && {
        unitPrice: Number(form.unitPrice),
      }),

      ...(form.unitsInStock !== "" && {
        unitsInStock: Number(form.unitsInStock),
      }),

      ...(form.unitsOnOrder !== "" && {
        unitsOnOrder: Number(form.unitsOnOrder),
      }),

      discontinued: form.discontinued,

      ...(form.categoryId && {
        categoryId: Number(form.categoryId),
      }),

      ...(form.supplierId && {
        supplierId: Number(form.supplierId),
      }),
    };

    try {
      if (isEdit && product) {
        const updatePayload: UpdateProductPayload = payload;

        await updateProduct({
          id: product.id,
          data: updatePayload,
        }).unwrap();

        navigate(`/products/${product.id}`);
      } else {
        const createdProduct = await createProduct(payload).unwrap();

        navigate(`/products/${createdProduct.id}`);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Failed to save product. Please check your information and try again.",
      );
    }
  };

  // ==========================================
  // Category options - recursively flatten tree
  // ==========================================

  const flattenCategories = (
    items: NonNullable<typeof categories>,
    level = 0,
  ): Array<{
    id: number;
    categoryName: string;
    level: number;
  }> => {
    return items.flatMap((category) => [
      {
        id: category.id,
        categoryName: category.categoryName ?? "Unnamed category",
        level,
      },
      ...flattenCategories(category.children ?? [], level + 1),
    ]);
  };

  const categoryOptions = categories ? flattenCategories(categories) : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ======================================
      Error
  ======================================= */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Unable to save product</p>
            <p className="mt-0.5 text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* ======================================
      Basic Information
  ======================================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package className="h-5 w-5" strokeWidth={1.8} />
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Add the core information that identifies this product.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Product Name */}

          <div className="md:col-span-2">
            <label
              htmlFor="productName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Product Name
              <span className="ml-1 text-red-500">*</span>
            </label>

            <input
              id="productName"
              name="productName"
              type="text"
              value={form.productName}
              onChange={handleChange}
              placeholder="e.g. Marble Keyboard"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Short Description */}

          <div className="md:col-span-2">
            <label
              htmlFor="shortDescription"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Short Description
            </label>

            <input
              id="shortDescription"
              name="shortDescription"
              type="text"
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="A brief description of the product"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Description */}

          <div className="md:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <span className="text-xs text-slate-400">Optional</span>
            </div>

            <textarea
              id="description"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              placeholder="Write a detailed description of the product..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Quantity Per Unit */}

          <div>
            <label
              htmlFor="quantityPerUnit"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Quantity Per Unit
            </label>

            <input
              id="quantityPerUnit"
              name="quantityPerUnit"
              type="text"
              value={form.quantityPerUnit}
              onChange={handleChange}
              placeholder="e.g. 1 piece"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>
      </section>

      {/* ======================================
      Pricing & Inventory
  ======================================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Tag className="h-5 w-5" strokeWidth={1.8} />
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900">
                Pricing & Inventory
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Manage pricing and current inventory levels.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-3">
          {/* Unit Price */}

          <div>
            <label
              htmlFor="unitPrice"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Unit Price
            </label>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center border-r border-slate-200 text-sm font-medium text-slate-500">
                ৳
              </div>

              <input
                id="unitPrice"
                name="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.unitPrice}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-14 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Units In Stock */}

          <div>
            <label
              htmlFor="unitsInStock"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Units In Stock
            </label>

            <input
              id="unitsInStock"
              name="unitsInStock"
              type="number"
              min="0"
              step="1"
              value={form.unitsInStock}
              onChange={handleChange}
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Units On Order */}

          <div>
            <label
              htmlFor="unitsOnOrder"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Units On Order
            </label>

            <input
              id="unitsOnOrder"
              name="unitsOnOrder"
              type="number"
              min="0"
              step="1"
              value={form.unitsOnOrder}
              onChange={handleChange}
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>
      </section>

      {/* ======================================
      Classification
  ======================================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <ListFilter className="h-5 w-5" strokeWidth={1.8} />
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900">
                Classification
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Organize the product by category and supplier.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Category */}

          <div>
            <label
              htmlFor="categoryId"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Category
            </label>

            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              disabled={isCategoriesLoading}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">
                {isCategoriesLoading
                  ? "Loading categories..."
                  : "Select category"}
              </option>

              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {"— ".repeat(category.level)}
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Supplier */}

          <div>
            <label
              htmlFor="supplierId"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Supplier
            </label>

            <select
              id="supplierId"
              name="supplierId"
              value={form.supplierId}
              onChange={handleChange}
              disabled={isSuppliersLoading}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            >
              {!isEdit && (
                <option value="">
                  {isSuppliersLoading
                    ? "Loading suppliers..."
                    : "Select supplier"}
                </option>
              )}

              {suppliers.map((supplier) => (
                <option key={supplier.id} value={String(supplier.id)}>
                  {supplier.supplierName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ======================================
      Status
  ======================================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Product Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Control whether this product is currently available.
          </p>
        </div>

        <div className="p-6">
          <label
            className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
              form.discontinued
                ? "border-amber-200 bg-amber-50/60"
                : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  form.discontinued
                    ? "bg-amber-100 text-amber-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {form.discontinued ? (
                  <CircleX className="h-5 w-5" strokeWidth={2} />
                ) : (
                  <CircleCheck className="h-5 w-5" strokeWidth={2} />
                )}
              </div>

              <div>
                <span className="block text-sm font-semibold text-slate-800">
                  {form.discontinued
                    ? "Product is discontinued"
                    : "Product is active"}
                </span>

                <span className="mt-0.5 block text-xs text-slate-500">
                  {form.discontinued
                    ? "This product will no longer be available for sale."
                    : "This product is currently available for sale."}
                </span>
              </div>
            </div>

            <div className="relative shrink-0">
              <input
                type="checkbox"
                name="discontinued"
                checked={form.discontinued}
                onChange={handleCheckboxChange}
                className="peer sr-only"
              />

              <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-amber-500 peer-focus:ring-4 peer-focus:ring-amber-500/20" />

              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        </div>
      </section>

      {/* ======================================
      Actions
  ======================================= */}

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-lg shadow-slate-900/5 backdrop-blur-md">
        <p className="hidden pl-2 text-xs text-slate-400 sm:block">
          Make sure all product information is correct before saving.
        </p>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/products")}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Update Product"
                : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ProductForm;
