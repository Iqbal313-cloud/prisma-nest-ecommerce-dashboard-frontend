import { NavLink, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  Gauge,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

const navigationItems = [
  {
    label: "Overview",
    path: "/monitoring",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Recent Queries",
    path: "/monitoring/recent-queries",
    icon: History,
  },
  {
    label: "Slow Queries",
    path: "/monitoring/slow-queries",
    icon: Gauge,
  },
  {
    label: "Top Queries",
    path: "/monitoring/top-queries",
    icon: TrendingUp,
  },
];

export default function MonitoringNavigation() {
  const location = useLocation();

  const isOverview = location.pathname === "/monitoring";

  return (
    <div className="space-y-4">
      {!isOverview && (
        <Link
          to="/monitoring"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-orange-600"
        >
          <ArrowLeft size={17} />
          Back to Overview
        </Link>
      )}

      <nav className="flex gap-2 overflow-x-auto border-b border-slate-200">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "border-orange-600 text-orange-600"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                }`
              }
            >
              <Icon size={17} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
