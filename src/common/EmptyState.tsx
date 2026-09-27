function EmptyState() {
  return (
    <div className="flex min-h-[250px] items-center justify-center">
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">No products found.</p>

        <p className="mt-1 text-sm text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    </div>
  );
}

export default EmptyState;
