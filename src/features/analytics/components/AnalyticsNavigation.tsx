import { ShoppingCart, Wallet, Package, Users, RefreshCw } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AnalyticsNavigationProps {
  onRefresh: () => void;
}

const navigationItems = [
  {
    label: "Order Analytics",
    path: "/analytics/orders",
    icon: ShoppingCart,
  },
  {
    label: "Sales Analytics",
    path: "/analytics/sales",
    icon: Wallet,
  },
  {
    label: "Inventory Analytics",
    path: "/analytics/inventory",
    icon: Package,
  },
  {
    label: "Customers Analytics",
    path: "/analytics/customers",
    icon: Users,
  },
];

export default function AnalyticsNavigation({
  onRefresh,
}: AnalyticsNavigationProps) {
  const location = useLocation();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {navigationItems.map(({ label, path, icon: Icon }) => {
        const isActive = location.pathname === path;

        return (
          <Link
            key={path}
            to={path}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-orange-600 text-white hover:bg-orange-700"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}

      <button
        type="button"
        onClick={onRefresh}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <RefreshCw size={16} />
        Refresh
      </button>
    </div>
  );
}
