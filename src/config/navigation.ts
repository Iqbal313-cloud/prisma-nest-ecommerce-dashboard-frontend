import {
  DatabaseCheck,
  FolderTree,
  Home,
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

export type UserRole =
  | "superAdmin"
  | "admin"
  | "manager"
  | "sales"
  | "accountant"
  | "inventoryManager"
  | "viewer";

type NavigationIcon = ComponentType<{ className?: string }>;

export type NavigationChild = {
  title: string;
  href: string;
  icon: NavigationIcon;
};

export type NavigationItem = {
  title: string;
  icon: NavigationIcon;
  allowedRoles: UserRole[];
} & (
  | {
      href: string;
      children?: never;
    }
  | {
      href?: never;
      children: NavigationChild[];
    }
);

export const navigation: NavigationItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    allowedRoles: [
      "superAdmin",
      "admin",
      "manager",
      "sales",
      "accountant",
      "inventoryManager",
      "viewer",
    ],
  },
  {
    title: "Administration",
    icon: ShieldCheck,
    allowedRoles: ["superAdmin", "admin"],
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
    href: "/analytics",
    icon: LayoutDashboard,
    allowedRoles: ["superAdmin", "admin", "manager", "accountant", "viewer"],
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
    allowedRoles: [
      "superAdmin",
      "admin",
      "manager",
      "sales",
      "inventoryManager",
      "viewer",
    ],
  },
  {
    title: "Categories",
    href: "/categories",
    icon: FolderTree,
    allowedRoles: [
      "superAdmin",
      "admin",
      "manager",
      "inventoryManager",
      "viewer",
    ],
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    allowedRoles: [
      "superAdmin",
      "admin",
      "manager",
      "sales",
      "accountant",
      "viewer",
    ],
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
    allowedRoles: [
      "superAdmin",
      "admin",
      "manager",
      "sales",
      "accountant",
      "viewer",
    ],
  },
  {
    title: "Employees",
    href: "/employees",
    icon: UserRoundCog,
    allowedRoles: ["superAdmin", "admin", "manager", "viewer"],
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Truck,
    allowedRoles: [
      "superAdmin",
      "admin",
      "manager",
      "inventoryManager",
      "viewer",
    ],
  },
  {
    title: "Database Metrics",
    href: "/monitoring",
    icon: DatabaseCheck,
    allowedRoles: ["superAdmin", "admin", "manager", "viewer"],
  },
];
