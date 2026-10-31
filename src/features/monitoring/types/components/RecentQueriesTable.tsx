// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableHead,
//   TableRow,
//   TableCell,
// } from "@/components/common/Table";
// import type { RecentQueriesResponse } from "@/features/monitoring/types/monitoring.types";

// interface RecentQueriesTableProps {
//   data: RecentQueriesResponse;
// }

// export default function RecentQueriesTable({ data }: RecentQueriesTableProps) {
//   const formatTime = (value: number) => `${Number(value ?? 0).toFixed(2)} ms`;

//   const formatDate = (value: string | null) => {
//     if (!value) return "—";

//     return new Date(value).toLocaleString();
//   };

//   return (
//     <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//       <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//         <div>
//           <h2 className="text-base font-semibold text-slate-900">
//             Recent Queries
//           </h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Recent database query activity
//           </p>
//         </div>

//         <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
//           {data.meta.total} queries
//         </span>
//       </div>

//       {data.data.length === 0 ? (
//         <div className="p-8 text-center text-sm text-slate-500">
//           No recent query activity found.
//         </div>
//       ) : (
//         <Table className="min-w-[1100px]">
//           <TableHeader className="bg-slate-50">
//             <TableRow>
//               <TableHead>Time</TableHead>
//               <TableHead>User</TableHead>
//               <TableHead>Client IP</TableHead>
//               <TableHead>Query</TableHead>
//               <TableHead className="text-right">Calls</TableHead>
//               <TableHead className="text-right">Avg. Time</TableHead>
//               <TableHead className="text-right">Max Time</TableHead>
//               <TableHead className="text-right">Total Time</TableHead>
//               <TableHead className="text-right">Rows</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {data.data.map((item, index) => (
//               <TableRow key={`${item.time}-${index}`}>
//                 <TableCell className="whitespace-nowrap text-xs">
//                   {formatDate(item.time)}
//                 </TableCell>

//                 <TableCell>{item.username ?? "—"}</TableCell>

//                 <TableCell>{item.client_ip ?? "—"}</TableCell>

//                 <TableCell className="max-w-sm">
//                   <p
//                     className="truncate font-mono text-xs text-slate-700"
//                     title={item.query ?? ""}
//                   >
//                     {item.query ?? "—"}
//                   </p>
//                 </TableCell>

//                 <TableCell className="text-right tabular-nums">
//                   {Number(item.calls ?? 0).toLocaleString()}
//                 </TableCell>

//                 <TableCell className="text-right tabular-nums">
//                   {formatTime(item.avg_time_ms)}
//                 </TableCell>

//                 <TableCell className="text-right tabular-nums">
//                   {formatTime(item.max_time_ms)}
//                 </TableCell>

//                 <TableCell className="text-right tabular-nums">
//                   {formatTime(item.total_time_ms)}
//                 </TableCell>

//                 <TableCell className="text-right tabular-nums">
//                   {Number(item.rows ?? 0).toLocaleString()}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </section>
//   );
// }

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/common/Table";

import type { RecentQueriesResponse } from "@/features/monitoring/types/monitoring.types";

interface RecentQueriesTableProps {
  data: RecentQueriesResponse;
}

export default function RecentQueriesTable({ data }: RecentQueriesTableProps) {
  const formatTime = (value: number) => `${Number(value ?? 0).toFixed(2)} ms`;

  const formatDate = (value: string | null) => {
    if (!value) return "—";

    return new Date(value).toLocaleString();
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Recent Queries
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Recent database query activity
          </p>
        </div>

        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
          {data.meta.total} queries
        </span>
      </div>

      {data.data.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">
          No recent query activity found.
        </div>
      ) : (
        <Table className="min-w-[1100px]">
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Client IP</TableHead>
              <TableHead>Query</TableHead>
              <TableHead className="text-right">Calls</TableHead>
              <TableHead className="text-right">Avg. Time</TableHead>
              <TableHead className="text-right">Max Time</TableHead>
              <TableHead className="text-right">Total Time</TableHead>
              <TableHead className="text-right">Rows</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.data.map((item, index) => (
              <TableRow key={`${item.time}-${index}`}>
                <TableCell className="whitespace-nowrap text-xs">
                  {formatDate(item.time)}
                </TableCell>

                <TableCell>{item.username ?? "—"}</TableCell>

                <TableCell>{item.client_ip ?? "—"}</TableCell>

                <TableCell className="max-w-sm">
                  <p
                    className="truncate font-mono text-xs text-slate-700"
                    title={item.query ?? ""}
                  >
                    {item.query ?? "—"}
                  </p>
                </TableCell>

                <TableCell className="text-right tabular-nums">
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
