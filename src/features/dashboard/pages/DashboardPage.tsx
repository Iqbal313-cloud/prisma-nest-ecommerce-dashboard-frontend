import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { useSession } from "../../../lib/auth-client";
import type { UserRole } from "../../../config/navigation";
import { getDashboardItems } from "../../../utils/navigationPermissions";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  const userRole = session?.user?.role as UserRole | undefined;
  const dashboardItems = getDashboardItems(userRole);

  if (isPending) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back. Select a module to get started.
        </p>
      </div>

      {dashboardItems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-slate-100 p-3 text-slate-700">
                    <Icon className="h-6 w-6" />
                  </div>

                  <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-slate-900" />
                </div>

                <h2 className="mt-5 font-semibold text-slate-900">
                  {item.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Open {item.title.toLowerCase()}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-500">
            No modules are currently available for your account.
          </p>
        </div>
      )}
    </div>
  );
}
