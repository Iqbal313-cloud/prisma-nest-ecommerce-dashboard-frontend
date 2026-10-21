import { SearchX } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

function EmptyState({
  title = "No results found",
  description = "Try changing your search or adjusting your filters.",
  icon: Icon = SearchX,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[300px] items-center justify-center px-4 ${className}`}
    >
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <Icon className="h-6 w-6 text-slate-500" />
        </div>

        <h3 className="text-base font-semibold text-slate-800">{title}</h3>

        <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default EmptyState;
