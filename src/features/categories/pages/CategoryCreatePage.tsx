import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
} from "@/api/categoryApi";

import CategoryForm from "../components/CategoryForm";
import type { CreateCategoryPayload } from "../types/category.types";

function CategoryCreatePage() {
  const navigate = useNavigate();

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (payload: CreateCategoryPayload) => {
    setErrorMessage("");

    try {
      const category = await createCategory(payload).unwrap();
      navigate(`/categories/${category.id}`);
    } catch (error) {
      console.error("Failed to create category:", error);
      setErrorMessage(
        "Failed to create category. Check the name and parent category.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/categories"
          className="text-sm text-slate-500 hover:text-orange-600"
        >
          ← Back to categories
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Create Category className=""
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a root category or add a child to an existing category.
        </p>
      </div>

      {isCategoriesLoading && (
        <p className="text-sm text-slate-500">Loading parent categories...</p>
      )}

      {isCategoriesError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
          Unable to load parent categories. Please retry before creating a
          category.
        </p>
      )}

      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
          {errorMessage}
        </p>
      )}

      {!isCategoriesLoading && !isCategoriesError && (
        <CategoryForm
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={isCreating}
          submitLabel="Create Category"
        />
      )}
    </div>
  );
}

export default CategoryCreatePage;
