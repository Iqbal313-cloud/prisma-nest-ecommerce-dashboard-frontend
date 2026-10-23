import ConfirmDialog from "@/components/common/ConfirmDialog";

interface CategoryDeleteDialogProps {
  isOpen: boolean;
  categoryName: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  errorMessage?: string;
}

function CategoryDeleteDialog({
  isOpen,
  categoryName,
  isLoading,
  onConfirm,
  onCancel,
  errorMessage,
}: CategoryDeleteDialogProps) {
  return (
    <div>
      <ConfirmDialog
        isOpen={isOpen}
        title="Delete category?"
        description={`Are you sure you want to delete "${categoryName}"? This action may fail if the category has child categories or related products.`}
        confirmText="Delete Category"
        cancelText="Cancel"
        isLoading={isLoading}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      {isOpen && errorMessage && (
        <p
          role="alert"
          className="mt-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default CategoryDeleteDialog;
