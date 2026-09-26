import {
  Boxes,
  FolderTree,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  UserRoundCog,
  Users,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: FolderTree,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Employees",
    href: "/employees",
    icon: UserRoundCog,
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Truck,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 bg-white lg:block">
      <div className="flex h-full flex-col p-4">
        {/* Navigation */}
        <nav className="space-y-1">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Management
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />

                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="mt-auto pt-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-slate-600" />

              <span className="text-sm font-medium text-slate-700">
                Inventory System
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Manage your business efficiently.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
