import { useState } from "react";
import {
  Boxes,
  ChevronDown,
  DatabaseCheck,
  FolderTree,
  LayoutDashboard,
  Monitor,
  Package,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UserRoundCog,
  Users,
} from "lucide-react";

import type { ComponentType } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSession } from "../../lib/auth-client";

type UserRole = "admin" | "manager" | "sales";

type NavigationItem = {
  title: string;
  icon: ComponentType<{ className?: string }>;
  allowedRoles: UserRole[];
} & (
  | {
      href: string;
      children?: never;
    }
  | {
      href?: never;
      children: {
        title: string;
        href: string;
        icon: ComponentType<{ className?: string }>;
      }[];
    }
);

const navigation: NavigationItem[] = [
  {
    title: "Administration",
    icon: ShieldCheck,
    allowedRoles: ["admin"],
    children: [
      {
        title: "User Management",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Role Management",
        href: "/admin/roles",
        icon: Shield,
      },
      {
        title: "Session Management",
        href: "/admin/sessions",
        icon: Monitor,
      },
    ],
  },
  {
    title: "Analytics Dashboard",
    href: "/",
    icon: LayoutDashboard,
    allowedRoles: ["admin", "manager", "sales"],
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
    allowedRoles: ["admin", "manager", "sales"],
  },
  {
    title: "Categories",
    href: "/categories",
    icon: FolderTree,
    allowedRoles: ["admin"],
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    allowedRoles: ["admin", "manager", "sales"],
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
    allowedRoles: ["admin", "manager", "sales"],
  },
  {
    title: "Employees",
    href: "/employees",
    icon: UserRoundCog,
    allowedRoles: ["admin", "manager"],
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Truck,
    allowedRoles: ["admin", "manager"],
  },
  {
    title: "Database Metrics",
    href: "/monitoring",
    icon: DatabaseCheck,
    allowedRoles: ["admin", "manager"],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { data: session, isPending } = useSession();

  // Administration is collapsed by default
  const [isAdministrationOpen, setIsAdministrationOpen] = useState(false);

  const userRole = session?.user?.role as UserRole | undefined;

  const filteredNavigation = navigation.filter((item) =>
    userRole ? item.allowedRoles.includes(userRole) : false,
  );

  const isLinkActive = (href: string) => {
    return href === "/"
      ? location.pathname === "/"
      : location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 bg-white lg:block">
      <div className="flex h-full flex-col p-4">
        <nav className="space-y-1">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Management
          </p>

          {!isPending &&
            filteredNavigation.map((item) => {
              const Icon = item.icon;

              // Administration parent with collapsible nested links
              if (item.children) {
                const isActive = item.children.some((child) =>
                  isLinkActive(child.href),
                );

                return (
                  <div key={item.title} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setIsAdministrationOpen((prev) => !prev)}
                      aria-expanded={isAdministrationOpen}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                        isActive
                          ? "text-slate-900"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{item.title}</span>
                      </span>

                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          isAdministrationOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isAdministrationOpen && (
                      <div className="ml-5 space-y-1 border-l border-slate-200 pl-3">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = isLinkActive(child.href);

                          return (
                            <Link
                              key={child.href}
                              to={child.href}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                childActive
                                  ? "bg-slate-900 text-white"
                                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                              }`}
                            >
                              <ChildIcon className="h-4 w-4 shrink-0" />
                              <span>{child.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Normal navigation links
              const isActive = isLinkActive(item.href);

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
