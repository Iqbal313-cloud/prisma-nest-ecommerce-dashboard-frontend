import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import type { Category, CreateCategoryPayload } from "../types/category.types";

interface CategoryFormProps {
  categories: Category[];
  initialData?: Category;
  onSubmit: (payload: CreateCategoryPayload) => void | Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

interface FormState {
  categoryName: string;
  description: string;
  parentId: string;
}

interface FlatCategory {
  id: number;
  categoryName: string;
  depth: number;
}

const flattenCategories = (
  categories: Category[],
  depth = 0,
  result: FlatCategory[] = [],
): FlatCategory[] => {
  for (const category of categories) {
    result.push({
      id: category.id,
      categoryName: category.categoryName,
      depth,
    });

    flattenCategories(category.children ?? [], depth + 1, result);
  }

  return result;
};

function getDescendantIds(category?: Category): Set<number> {
  const ids = new Set<number>();

  const visit = (node?: Category) => {
    if (!node) return;

    for (const child of node.children ?? []) {
      ids.add(child.id);
      visit(child);
    }
  };

  visit(category);
  return ids;
}

function CategoryForm({
  categories,
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel,
}: CategoryFormProps) {
  const [form, setForm] = useState<FormState>({
    categoryName: "",
    description: "",
    parentId: "",
  });

  useEffect(() => {
    setForm({
      categoryName: initialData?.categoryName ?? "",
      description: initialData?.description ?? "",
      parentId:
        initialData?.parentId != null ? String(initialData.parentId) : "",
    });
  }, [initialData]);

  const flatCategories = useMemo(
    () => flattenCategories(categories),
    [categories],
  );

  const excludedIds = useMemo(
    () =>
      getDescendantIds(
        categories
          .flatMap((category) => {
            const visit = (node: Category): Category[] => [
              node,
              ...(node.children ?? []).flatMap(visit),
            ];

            return visit(category);
          })
          .find((category) => category.id === initialData?.id),
      ),
    [categories, initialData?.id],
  );

  const updateField = (key: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateCategoryPayload = {
      categoryName: form.categoryName.trim(),
      description: form.description.trim(),
      parentId: form.parentId ? Number(form.parentId) : null,
    };

    await onSubmit(payload);
  };

  const availableParents = flatCategories.filter(
    (category) =>
      category.id !== initialData?.id && !excludedIds.has(category.id),
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label
          htmlFor="categoryName"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Category name <span className="text-red-500">*</span>
        </label>

        <input
          id="categoryName"
          value={form.categoryName}
          onChange={(event) => updateField("categoryName", event.target.value)}
          required
          maxLength={100}
          placeholder="e.g. Electronics"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <div>
        <label
          htmlFor="categoryDescription"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="categoryDescription"
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows={4}
          placeholder="Describe this category..."
          className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <div>
        <label
          htmlFor="parentCategory"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Parent category
        </label>

        <select
          id="parentCategory"
          value={form.parentId}
          onChange={(event) => updateField("parentId", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        >
          <option value="">None — Root category</option>

          {availableParents.map((category) => (
            <option key={category.id} value={category.id}>
              {"— ".repeat(category.depth)}
              {category.categoryName}
            </option>
          ))}
        </select>

        <p className="mt-1.5 text-xs text-slate-500">
          Choose a parent to create a nested category. Leave empty for a root
          category.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => window.history.back()}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !form.categoryName.trim()}
          className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default CategoryForm;
