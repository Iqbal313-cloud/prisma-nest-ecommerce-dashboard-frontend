import { Link, useParams } from "react-router-dom";

import { useGetCategoriesQuery, useGetCategoryQuery } from "@/api/categoryApi";

import type { Category } from "../types/category.types";

function findCategoryPath(
  categories: Category[],
  targetId: number,
  path: Category[] = [],
): Category[] | null {
  for (const category of categories) {
    const currentPath = [...path, category];

    if (category.id === targetId) {
      return currentPath;
    }

    const found = findCategoryPath(
      category.children ?? [],
      targetId,
      currentPath,
    );

    if (found) return found;
  }

  return null;
}

function CategoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const validId = Number.isInteger(categoryId) && categoryId > 0;

  const {
    data: category,
    isLoading,
    isError,
  } = useGetCategoryQuery(categoryId, { skip: !validId });

  const { data: tree = [] } = useGetCategoriesQuery();

  if (!validId) {
    return (
      <p role="alert" className="p-6 text-sm text-red-600">
        Invalid category ID.
      </p>
    );
  }

  if (isLoading) {
    return <p className="p-6 text-sm text-slate-500">Loading category...</p>;
  }

  if (isError || !category) {
    return (
      <p role="alert" className="p-6 text-sm text-red-600">
        Failed to load category details.
      </p>
    );
  }

  const path = findCategoryPath(tree, categoryId) ?? [category];
  const children = category.children ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            to="/categories"
            className="text-sm text-slate-500 hover:text-orange-600"
          >
            ← Back to category tree
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            {path.map((item, index) => (
              <span key={item.id} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <Link
                  to={`/categories/${item.id}`}
                  className={
                    index === path.length - 1
                      ? "font-medium text-slate-900"
                      : "hover:text-orange-600"
                  }
                >
                  {item.categoryName}
                </Link>
              </span>
            ))}
          </div>

          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            {category.categoryName}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Category ID: #{category.id}
          </p>
        </div>

        <Link
          to={`/categories/${category.id}/edit`}
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Edit Category
        </Link>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-slate-900">
          Category information
        </h2>

        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Name</dt>
            <dd className="mt-1 font-medium text-slate-800">
              {category.categoryName}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Parent category</dt>
            <dd className="mt-1 font-medium text-slate-800">
              {category.parentId == null
                ? "Root category"
                : path.length > 1
                  ? path[path.length - 2].categoryName
                  : `Category #${category.parentId}`}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm text-slate-500">Description</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
              {category.description || "No description provided."}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Child categories
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {children.length} direct children
            </p>
          </div>

          <Link
            to={`/categories/new?parentId=${category.id}`}
            className="text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            + Add child
          </Link>
        </div>

        {children.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
            This category has no child categories yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {children.map((child) => (
              <Link
                key={child.id}
                to={`/categories/${child.id}`}
                className="flex items-center justify-between gap-4 py-3 hover:text-orange-600"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {child.categoryName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {child.description || "No description"}
                  </p>
                </div>

                <span className="text-sm text-slate-400">View →</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CategoryDetailsPage;
