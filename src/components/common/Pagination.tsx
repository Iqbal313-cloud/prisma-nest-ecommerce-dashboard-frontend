interface PaginationProps {
  page: number;
  lastPage: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isFetching?: boolean;
}

const LIMIT_OPTIONS = [10, 20, 50, 100];

function Pagination({
  page,
  lastPage,
  total,
  limit,
  onPageChange,
  onLimitChange,
  isFetching = false,
}: PaginationProps) {
  const canGoPrevious = page > 1;
  const canGoNext = page < lastPage;

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Total */}
      <div className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-900">
          {total.toLocaleString()}
        </span>{" "}
        results
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Limit */}
        {onLimitChange && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Rows per page</span>

            <select
              value={limit}
              disabled={isFetching}
              onChange={(event) => onLimitChange(Number(event.target.value))}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-xs transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="text-sm font-medium text-slate-700">
          Page <span className="text-slate-900">{page}</span> of{" "}
          <span className="text-slate-900">{lastPage}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Previous */}
          <button
            type="button"
            disabled={!canGoPrevious || isFetching}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900 disabled:pointer-events-none disabled:opacity-50"
          >
            Previous
          </button>

          {/* Next */}
          <button
            type="button"
            disabled={!canGoNext || isFetching}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900 disabled:pointer-events-none disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
