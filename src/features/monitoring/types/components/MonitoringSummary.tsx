import { Database, HardDrive, Activity, Zap } from "lucide-react";

import type { MonitoringSummary as MonitoringSummaryType } from "@/features/monitoring/types/monitoring.types";

interface MonitoringSummaryProps {
  data: MonitoringSummaryType;
}

export default function MonitoringSummary({ data }: MonitoringSummaryProps) {
  const summaryCards = [
    {
      title: "Database Size",
      value: data.database.size,
      description: data.database.name,
      icon: HardDrive,
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Connections",
      value: data.connections.total.toLocaleString(),
      description: `${data.connections.active} active · ${data.connections.idle} idle`,
      icon: Database,
      iconClass: "bg-violet-50 text-violet-600",
    },
    {
      title: "Total Query Calls",
      value: data.queries.totalCalls.toLocaleString(),
      description: "Total executed queries",
      icon: Activity,
      iconClass: "bg-orange-50 text-orange-600",
    },
    {
      title: "Average Execution Time",
      value: `${data.queries.averageExecutionTimeMs.toFixed(2)} ms`,
      description: `Total: ${data.queries.totalExecutionTimeMs.toFixed(2)} ms`,
      icon: Zap,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {summaryCards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{card.title}</p>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconClass}`}
              >
                <Icon size={20} />
              </div>
            </div>

            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              {card.value}
            </h3>

            <p className="mt-2 truncate text-xs text-slate-500">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
