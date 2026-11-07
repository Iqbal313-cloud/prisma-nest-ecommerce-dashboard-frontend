import { Link } from "react-router-dom";

import { useGetCategoriesQuery } from "@/api/categoryApi";
import CategoryTree from "../components/CategoryTree";
import type { Category } from "../types/category.types";
import ErrorMessage from "@/components/common/ErrorMessage";
import Loading from "@/components/common/Loading";

function countCategories(categories: Category[]): number {
  return categories.reduce(
    (total, category) => total + 1 + countCategories(category.children ?? []),
    0,
  );
}

function CategoryListPage() {
  const {
    data: categories,
    isLoading,
    isFetching,
    isError,
  } = useGetCategoriesQuery();

  if (isLoading) {
    return <Loading message="Loading category..." />;
  }

  if (isError || !categories) {
    return (
      <ErrorMessage message="Failed to load Categories. Please try again later." />
    );
  }

  const totalCategories = countCategories(categories);
  const nestedCategories = totalCategories - categories.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-orange-600">
            CATALOG MANAGEMENT
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Organize products using parent and child categories.
          </p>
        </div>

        <Link
          to="/categories/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <span aria-hidden="true">+</span>
          Create Category
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total categories</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalCategories}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Root categories</p>
          <p className="mt-2 text-3xl font-bold text-orange-600">
            {categories.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Nested categories</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {nestedCategories}
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">Category tree</h2>
            <p className="mt-1 text-xs text-slate-500">
              Expand or collapse a parent to browse its children.
            </p>
          </div>

          {isFetching && (
            <span className="text-xs text-slate-500">Refreshing...</span>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-medium text-slate-700">No categories found</p>
            <p className="mt-1 text-sm text-slate-500">
              Create your first category to get started.
            </p>
          </div>
        ) : (
          <CategoryTree categories={categories} />
        )}
      </section>
    </div>
  );
}

export default CategoryListPage;
