import { useState } from "react";
import { Link } from "react-router-dom";

import { useDeleteCategoryMutation } from "@/api/categoryApi";
import EmptyState from "@/components/common/EmptyState";
import CategoryDeleteDialog from "./CategoryDeleteDialog";

import type { Category } from "../types/category.types";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CategoryTreeProps {
  categories: Category[];
}

interface CategoryNodeProps {
  category: Category;
  depth: number;
  onDelete: (category: Category) => void;
}

function CategoryNode({ category, depth, onDelete }: CategoryNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const children = category.children ?? [];
  const hasChildren = children.length > 0;

  return (
    <div>
      <div
        className="group flex items-center gap-3 border-b border-slate-100 px-4 py-3 transition hover:bg-orange-50/40 sm:px-5"
        style={{ paddingLeft: `${16 + depth * 24}px` }}
      >
  

        <button
          type="button"
          disabled={!hasChildren}
          onClick={() => setIsExpanded((current) => !current)}
          aria-label={isExpanded ? "Collapse category" : "Expand category"}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 ${
            hasChildren ? "" : "invisible"
          }`}
        >
          {isExpanded ? (
            <ChevronDown size={16} strokeWidth={2} />
          ) : (
            <ChevronRight size={16} strokeWidth={2} />
          )}
        </button>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            depth === 0
              ? "bg-orange-100 text-orange-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
            aria-hidden="true"
          >
            {hasChildren && isExpanded ? (
              <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H10l2 2h7.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
            ) : (
              <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H10l2 2h7.5A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
            )}
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold text-slate-800">
              {category.categoryName}
            </span>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                depth === 0
                  ? "bg-orange-100 text-orange-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {depth === 0 ? "ROOT" : `LEVEL ${depth + 1}`}
            </span>
          </div>

          <p className="mt-0.5 truncate text-xs text-slate-500">
            {category.description || "No description"}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-1 sm:flex">
          <Link
            to={`/categories/${category.id}`}
            className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-white"
          >
            View
          </Link>

          <Link
            to={`/categories/${category.id}/edit`}
            className="rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete(category)}
            className="rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
          >
            Delete
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:hidden">
          <Link
            to={`/categories/${category.id}/edit`}
            aria-label={`Edit ${category.categoryName}`}
            className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
          >
            Edit
          </Link>

          <button
            type="button"
            aria-label={`Delete ${category.categoryName}`}
            onClick={() => onDelete(category)}
            className="rounded-md p-2 text-red-600 hover:bg-red-50"
          >
            ×
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="relative">
          <div
            className="absolute bottom-0 top-0 w-px bg-slate-200"
            style={{ left: `${27 + depth * 24}px` }}
          />

          {children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              depth={depth + 1}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryTree({ categories }: CategoryTreeProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setDeleteError("");
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory.id).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      setDeleteError("");
    } catch (error) {
      console.error("Failed to delete category:", error);
      setDeleteError(
        "Unable to delete this category. Check whether it has child categories or related products.",
      );
    }
  };

  const handleDeleteCancel = () => {
    if (isDeleting) return;

    setIsDeleteDialogOpen(false);
    setSelectedCategory(null);
    setDeleteError("");
  };

  if (categories.length === 0) {
    return (
      <EmptyState
        title="No categories yet"
        description="Create a root category to start building your category tree."
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[620px]">
          <div className="flex items-center justify-between bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>Category hierarchy</span>
            <span>{categories.length} root categories</span>
          </div>

          {categories.map((category) => (
            <CategoryNode
              key={category.id}
              category={category}
              depth={0}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      </div>

      <CategoryDeleteDialog
        isOpen={isDeleteDialogOpen}
        categoryName={selectedCategory?.categoryName ?? ""}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        errorMessage={deleteError}
      />
    </>
  );
}

export default CategoryTree;
