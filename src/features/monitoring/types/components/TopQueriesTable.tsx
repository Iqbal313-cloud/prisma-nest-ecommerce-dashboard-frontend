import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/common/Table";

import type { TopQueriesResponse } from "@/features/monitoring/types/monitoring.types";

interface TopQueriesTableProps {
  data: TopQueriesResponse;
}

export default function TopQueriesTable({ data }: TopQueriesTableProps) {
  const formatTime = (value: number) => `${Number(value ?? 0).toFixed(2)} ms`;

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Top Queries
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Most frequently executed database queries
          </p>
        </div>

        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
          {data.meta.total} queries
        </span>
      </div>

      {data.data.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">
          No query activity found.
        </div>
      ) : (
        <Table className="min-w-[900px]">
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Query</TableHead>
              <TableHead className="text-right">Calls</TableHead>
              <TableHead className="text-right">Avg. Time</TableHead>
              <TableHead className="text-right">Max Time</TableHead>
              <TableHead className="text-right">Total Time</TableHead>
              <TableHead className="text-right">Rows</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.data.map((item) => (
              <TableRow key={item.queryid}>
                <TableCell className="max-w-sm">
                  <p
                    className="truncate font-mono text-xs text-slate-700"
                    title={item.query ?? ""}
                  >
                    {item.query ?? "—"}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    ID: {item.queryid}
                  </p>
                </TableCell>

                <TableCell className="text-right font-semibold tabular-nums text-slate-900">
                  {Number(item.calls ?? 0).toLocaleString()}
                </TableCell>

                <TableCell className="text-right tabular-nums">
                  {formatTime(item.avg_time_ms)}
                </TableCell>

                <TableCell className="text-right tabular-nums">
                  {formatTime(item.max_time_ms)}
                </TableCell>

                <TableCell className="text-right tabular-nums">
                  {formatTime(item.total_time_ms)}
                </TableCell>

                <TableCell className="text-right tabular-nums">
                  {Number(item.rows ?? 0).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
