import type { LucideIcon } from "lucide-react";

interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  iconColor?: string;
}

export default function AnalyticsStatCard({
  title,
  value,
  icon: Icon,
  description,
  iconColor = "text-orange-600",
}: AnalyticsStatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-sm text-slate-500">{description}</p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 ${iconColor}`}
        >
          <Icon size={22} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
