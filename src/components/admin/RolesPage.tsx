import { ShieldCheck, Check, X } from "lucide-react";
import { authClient } from "../../lib/auth-client";

const roles = ["admin", "manager", "sales"] as const;

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

export default function RolesPage() {
  const checkPermission = (
    role: (typeof roles)[number],
    resource: string,
    action: string,
  ) => {
    return authClient.admin.checkRolePermission({
      role,
      permissions: {
        [resource]: [action],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Role Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review roles and their assigned permissions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
                <h2 className="font-semibold capitalize text-slate-900">
                  {role}
                </h2>
                <p className="text-xs text-slate-500">Application role</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">Permission Matrix</h2>
          <p className="mt-1 text-sm text-slate-500">
            Permissions configured for each role.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Resource</th>
                <th className="px-5 py-3">Action</th>
                {roles.map((role) => (
                  <th key={role} className="px-5 py-3 text-center capitalize">
                    {role}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {resources.map((resource) =>
                resource.actions.map((action, index) => (
                  <tr key={`${resource.resource}-${action}`}>
                    {index === 0 && (
                      <td
                        rowSpan={resource.actions.length}
                        className="px-5 py-3 font-medium text-slate-900"
                      >
                        {resource.name}
                      </td>
                    )}

                    <td className="px-5 py-3 capitalize text-slate-600">
                      {action.replace("-", " ")}
                    </td>

                    {roles.map((role) => {
                      const allowed = checkPermission(
                        role,
                        resource.resource,
                        action,
                      );

                      return (
                        <td key={role} className="px-5 py-3 text-center">
                          {allowed ? (
                            <Check className="mx-auto h-4 w-4 text-green-600" />
                          ) : (
                            <X className="mx-auto h-4 w-4 text-slate-300" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
