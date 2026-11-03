
import { ShieldCheck, Check, X } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../common/Table";

const roles = [
  "superAdmin",
  "admin",
  "manager",
  "sales",
  "accountant",
  "inventoryManager",
  "viewer",
] as const;

const resources = [
  {
    name: "Products",
    resource: "product",
    actions: ["create", "read", "update", "delete"],
  },
  {
    name: "Categories",
    resource: "category",
    actions: ["create", "read", "update", "delete"],
  },
  {
    name: "Orders",
    resource: "order",
    actions: ["create", "read", "update", "delete"],
  },
  {
    name: "Customers",
    resource: "customer",
    actions: ["create", "read", "update", "delete"],
  },
  {
    name: "Employees",
    resource: "employee",
    actions: ["create", "read", "update", "delete"],
  },
  {
    name: "Suppliers",
    resource: "supplier",
    actions: ["create", "read", "update", "delete"],
  },
  {
    name: "Analytics",
    resource: "analytics",
    actions: ["read"],
  },
  {
    name: "Monitoring",
    resource: "monitoring",
    actions: ["read"],
  },
  {
    name: "User Management",
    resource: "user",
    actions: [
      "create",
      "list",
      "set-role",
      "ban",
      "impersonate",
      "delete",
      "set-password",
      "get",
      "update",
    ],
  },
  {
    name: "Session Management",
    resource: "session",
    actions: ["list", "revoke", "delete"],
  },
] as const;

type AppRole = (typeof roles)[number];

type Resource = (typeof resources)[number]["resource"];

type Action = (typeof resources)[number]["actions"][number];

export default function RolesPage() {
  const checkPermission = (
    role: AppRole,
    resource: Resource,
    action: Action,
  ): boolean => {
    return authClient.admin.checkRolePermission({
      role,
      permissions: {
        [resource]: [action],
      },
    });
  };

  const getRoleLabel = (role: AppRole) => {
    if (role === "superAdmin") return "Super Admin";
    if (role === "inventoryManager") return "Inventory Manager";

    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Role Management</h1>

        <p className="mt-1 text-sm text-slate-500">
          Review roles and their assigned permissions.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {roles.map((role) => (
          <div
            key={role}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2.5">
                <ShieldCheck className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  {getRoleLabel(role)}
                </h2>

                <p className="text-xs text-slate-500">Application role</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">Permission Matrix</h2>

          <p className="mt-1 text-sm text-slate-500">
            Permissions configured for each role.
          </p>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-slate-50">
              <TableHead>Resource</TableHead>
              <TableHead>Action</TableHead>

              {roles.map((role) => (
                <TableHead key={role} className="text-center">
                  {getRoleLabel(role)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-100">
            {resources.map((resource) =>
              resource.actions.map((action, index) => (
                <TableRow key={`${resource.resource}-${action}`}>
                  {index === 0 && (
                    <TableCell
                      rowSpan={resource.actions.length}
                      className="font-medium text-slate-900"
                    >
                      {resource.name}
                    </TableCell>
                  )}

                  <TableCell className="capitalize">
                    {action.replace("-", " ")}
                  </TableCell>

                  {roles.map((role) => {
                    const allowed = checkPermission(
                      role,
                      resource.resource,
                      action,
                    );

                    return (
                      <TableCell key={role} className="text-center">
                        {allowed ? (
                          <Check className="mx-auto h-4 w-4 text-green-600" />
                        ) : (
                          <X className="mx-auto h-4 w-4 text-slate-300" />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              )),
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
