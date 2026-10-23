import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from "@/api/categoryApi";

import CategoryForm from "../components/CategoryForm";
import type { CreateCategoryPayload } from "../types/category.types";

function CategoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const validId = Number.isInteger(categoryId) && categoryId > 0;

  const navigate = useNavigate();

  const {
    data: category,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useGetCategoryQuery(categoryId, { skip: !validId });

  const {
    data: categories = [],
    isLoading: isTreeLoading,
    isError: isTreeError,
  } = useGetCategoriesQuery();

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (payload: CreateCategoryPayload) => {
    setErrorMessage("");

    try {
      await updateCategory({
        id: categoryId,
        data: payload,
      }).unwrap();

      navigate(`/categories/${categoryId}`);
    } catch (error) {
      console.error("Failed to update category:", error);
      setErrorMessage(
        "Failed to update category. Check the name and selected parent.",
      );
    }
  };

  if (!validId) {
    return (
      <p role="alert" className="p-6 text-sm text-red-600">
        Invalid category ID.
      </p>
    );
  }

  if (isCategoryLoading || isTreeLoading) {
    return <p className="p-6 text-sm text-slate-500">Loading category...</p>;
  }

  if (isCategoryError || isTreeError || !category) {
    return (
      <p role="alert" className="p-6 text-sm text-red-600">
        Failed to load category or parent category options.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to={`/categories/${categoryId}`}
          className="text-sm text-slate-500 hover:text-orange-600"
        >
          ← Back to category
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Edit Category
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update "{category.categoryName}" and its parent.
        </p>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
          {errorMessage}
        </p>
      )}

      <CategoryForm
        categories={categories}
        initialData={category}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        submitLabel="Save Changes"
      />
    </div>
  );
}

export default CategoryEditPage;
