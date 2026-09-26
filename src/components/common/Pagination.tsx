interface PaginationProps {
  page: number;
  lastPage: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

const LIMIT_OPTIONS = [10, 20, 50, 100];

function Pagination({
  page,
  lastPage,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const canGoPrevious = page > 1;
  const canGoNext = page < lastPage;

  return (
    <div className="flex flex-col gap-4 border-t bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Total */}
      <div className="text-sm text-slate-500">
        Total: <span className="font-medium text-slate-700">{total}</span>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Limit */}
        {onLimitChange && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Per page</span>

            <select
              value={limit}
              onChange={(event) => onLimitChange(Number(event.target.value))}
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-slate-500"
            >
              {LIMIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Page info */}
        <div className="text-sm text-slate-500">
          Page <span className="font-medium text-slate-700">{page}</span> of{" "}
          <span className="font-medium text-slate-700">{lastPage}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!canGoPrevious}
            onClick={() => onPageChange(page - 1)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => onPageChange(page + 1)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
