// import { useEffect, useState } from "react";
// import {
//   Search,
//   Users,
//   ShieldCheck,
//   Mail,
//   ChevronLeft,
//   ChevronRight,
//   LoaderCircle,
// } from "lucide-react";

// import { authClient } from "../../lib/auth-client";

// interface AdminUser {
//   id: string;
//   name: string;
//   email: string;
//   emailVerified: boolean;
//   image: string | null;
//   createdAt: string;
//   updatedAt: string;
//   role: string;
//   banned: boolean;
//   banReason: string | null;
//   banExpires: string | null;
// }

// const PAGE_SIZE = 10;

// const roleStyles: Record<string, string> = {
//   admin: "bg-purple-50 text-purple-700",
//   manager: "bg-blue-50 text-blue-700",
//   sales: "bg-slate-100 text-slate-700",
// };

// export default function UsersPage() {
//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [total, setTotal] = useState(0);

//   const [search, setSearch] = useState("");
//   const [searchField, setSearchField] = useState<"name" | "email">("name");

//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let isActive = true;

//     const fetchUsers = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         const result = await authClient.admin.listUsers({
//           query: {
//             limit: PAGE_SIZE,
//             offset: (page - 1) * PAGE_SIZE,
//             ...(search.trim()
//               ? {
//                   searchValue: search.trim(),
//                   searchField,
//                   searchOperator: "contains" as const,
//                 }
//               : {}),
//             sortBy: "createdAt",
//             sortDirection: "desc",
//           },
//         });

//         if (!isActive) return;

//         if (result.error) {
//           setError(result.error.message);
//           setUsers([]);
//           setTotal(0);
//           return;
//         }

//         setUsers((result.data?.users ?? []) as AdminUser[]);
//         setTotal(result.data?.total ?? 0);
//       } catch (err) {
//         if (!isActive) return;

//         setError(err instanceof Error ? err.message : "Failed to load users.");

//         setUsers([]);
//         setTotal(0);
//       } finally {
//         if (isActive) {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchUsers();

//     return () => {
//       isActive = false;
//     };
//   }, [page, search, searchField]);

//   const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

//   const formatDate = (value: string) => {
//     return new Intl.DateTimeFormat("en-BD", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     }).format(new Date(value));
//   };

//   const handleSearchChange = (value: string) => {
//     setSearch(value);
//     setPage(1);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
//         <p className="mt-1 text-sm text-slate-500">
//           Manage users, roles and account access.
//         </p>
//       </div>

//       {/* Summary */}
//       <div className="rounded-xl border border-slate-200 bg-white p-5">
//         <div className="flex items-center gap-4">
//           <div className="rounded-lg bg-slate-100 p-3">
//             <Users className="h-6 w-6 text-slate-700" />
//           </div>

//           <div>
//             <p className="text-sm text-slate-500">Total Users</p>
//             <h2 className="text-2xl font-bold text-slate-900">
//               {isLoading ? "..." : total}
//             </h2>
//           </div>
//         </div>
//       </div>

//       {/* User Table */}
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
//         {/* Toolbar */}
//         <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
//           <div>
//             <h2 className="font-semibold text-slate-900">All Users</h2>
//             <p className="mt-1 text-sm text-slate-500">
//               View and manage registered users.
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <select
//               value={searchField}
//               onChange={(e) => {
//                 setSearchField(e.target.value as "name" | "email");
//                 setPage(1);
//               }}
//               className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
//             >
//               <option value="name">Name</option>
//               <option value="email">Email</option>
//             </select>

//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//               <input
//                 value={search}
//                 onChange={(e) => handleSearchChange(e.target.value)}
//                 placeholder={`Search by ${searchField}...`}
//                 className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400 sm:w-64"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Loading */}
//         {isLoading && (
//           <div className="flex min-h-64 items-center justify-center">
//             <div className="flex items-center gap-2 text-sm text-slate-500">
//               <LoaderCircle className="h-5 w-5 animate-spin" />
//               Loading users...
//             </div>
//           </div>
//         )}

//         {/* Error */}
//         {!isLoading && error && (
//           <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
//             <p className="font-medium text-red-600">Failed to load users</p>
//             <p className="mt-2 text-sm text-slate-500">{error}</p>
//           </div>
//         )}

//         {/* Table */}
//         {!isLoading && !error && (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
//                 <tr>
//                   <th className="px-5 py-3">User</th>
//                   <th className="px-5 py-3">Role</th>
//                   <th className="px-5 py-3">Verification</th>
//                   <th className="px-5 py-3">Status</th>
//                   <th className="px-5 py-3">Created At</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100">
//                 {users.map((user) => (
//                   <tr key={user.id} className="hover:bg-slate-50">
//                     <td className="whitespace-nowrap px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         {user.image ? (
//                           <img
//                             src={user.image}
//                             alt=""
//                             className="h-10 w-10 rounded-full object-cover"
//                           />
//                         ) : (
//                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
//                             {user.name.charAt(0).toUpperCase()}
//                           </div>
//                         )}

//                         <div>
//                           <p className="font-medium text-slate-900">
//                             {user.name}
//                           </p>
//                           <p className="text-xs text-slate-500">{user.email}</p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-5 py-4">
//                       <span
//                         className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
//                           roleStyles[user.role] ?? "bg-slate-100 text-slate-700"
//                         }`}
//                       >
//                         {user.role}
//                       </span>
//                     </td>

//                     <td className="px-5 py-4">
//                       <span className="flex items-center gap-1.5 text-xs">
//                         {user.emailVerified ? (
//                           <>
//                             <ShieldCheck className="h-4 w-4 text-green-600" />
//                             <span className="text-green-700">Verified</span>
//                           </>
//                         ) : (
//                           <>
//                             <Mail className="h-4 w-4 text-amber-600" />
//                             <span className="text-amber-700">Unverified</span>
//                           </>
//                         )}
//                       </span>
//                     </td>

//                     <td className="px-5 py-4">
//                       <span
//                         className={`rounded-full px-2.5 py-1 text-xs font-medium ${
//                           user.banned
//                             ? "bg-red-50 text-red-700"
//                             : "bg-green-50 text-green-700"
//                         }`}
//                       >
//                         {user.banned ? "Banned" : "Active"}
//                       </span>
//                     </td>

//                     <td className="whitespace-nowrap px-5 py-4 text-slate-600">
//                       {formatDate(user.createdAt)}
//                     </td>
//                   </tr>
//                 ))}

//                 {users.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="px-5 py-12 text-center text-slate-500"
//                     >
//                       No users found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {!isLoading && !error && (
//           <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
//             <p className="text-sm text-slate-500">
//               Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
//               {" - "}
//               {Math.min(page * PAGE_SIZE, total)}
//               {" of "}
//               {total} users
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 disabled={page <= 1}
//                 onClick={() => setPage((prev) => prev - 1)}
//                 className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </button>

//               <span className="text-sm text-slate-600">
//                 Page {page} of {totalPages}
//               </span>

//               <button
//                 type="button"
//                 disabled={page >= totalPages}
//                 onClick={() => setPage((prev) => prev + 1)}
//                 className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Search,
  Users,
  ShieldCheck,
  Mail,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Plus,
  Pencil,
  Trash2,
  Copy,
  X,
} from "lucide-react";

import { authClient } from "../../lib/auth-client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../common/Table";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: string;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
}

type UserFormMode = "create" | "edit";

interface UserFormState {
  name: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "sales";
}

const PAGE_SIZE = 10;

const roleStyles: Record<string, string> = {
  admin: "bg-purple-50 text-purple-700",
  manager: "bg-blue-50 text-blue-700",
  sales: "bg-slate-100 text-slate-700",
};

const emptyForm: UserFormState = {
  name: "",
  email: "",
  password: "",
  role: "sales",
};

export default function UsersPage() {
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState<"name" | "email">("name");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<UserFormMode | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await authClient.admin.listUsers({
        query: {
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
          ...(search.trim()
            ? {
                searchValue: search.trim(),
                searchField,
                searchOperator: "contains" as const,
              }
            : {}),
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });

      if (result.error) {
        setError(result.error.message);
        setUsers([]);
        setTotal(0);
        return;
      }

      setUsers((result.data?.users ?? []) as AdminUser[]);
      setTotal(result.data?.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
      setUsers([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, searchField]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setForm(emptyForm);
    setActionError(null);
    setModalMode("create");
  };

  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: (["admin", "manager", "sales"].includes(user.role)
        ? user.role
        : "sales") as UserFormState["role"],
    });
    setActionError(null);
    setModalMode("edit");
  };

  const closeModal = () => {
    if (isSaving) return;
    setModalMode(null);
    setSelectedUser(null);
    setForm(emptyForm);
    setActionError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name || !email) {
      setActionError("Name and email are required.");
      return;
    }

    if (modalMode === "create" && form.password.length < 8) {
      setActionError("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsSaving(true);

      if (modalMode === "create") {
        const result = await authClient.admin.createUser({
          name,
          email,
          password: form.password,
          role: form.role,
        });

        if (result.error) {
          setActionError(result.error.message);
          return;
        }

        setNotice("User created successfully.");
      } else if (modalMode === "edit" && selectedUser) {
        const result = await authClient.admin.updateUser({
          userId: selectedUser.id,
          data: {
            name,
            email,
          },
        });

        if (result.error) {
          setActionError(result.error.message);
          return;
        }

        // Role is updated through Better Auth's dedicated setRole action.
        const roleResult = await authClient.admin.setRole({
          userId: selectedUser.id,
          role: form.role,
        });

        if (roleResult.error) {
          setActionError(
            `Name/email were updated, but role update failed: ${roleResult.error.message}`,
          );
          await fetchUsers();
          return;
        }

        setNotice("User updated successfully.");
      }

      setModalMode(null);
      setSelectedUser(null);
      setForm(emptyForm);
      await fetchUsers();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (user.id === currentUserId) {
      setError("You cannot delete your own account from User Management.");
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete ${user.name} (${user.email})?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setNotice(null);
    setError(null);

    try {
      const result = await authClient.admin.removeUser({
        userId: user.id,
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setNotice("User deleted successfully.");

      // If the last row on this page was deleted, move back one page.
      if (users.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchUsers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user.");
    }
  };

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setNotice("User ID copied.");
    } catch {
      setNotice("Could not copy the user ID. Please copy it manually.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage users, roles and account access.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-slate-100 p-3">
            <Users className="h-6 w-6 text-slate-700" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Users</p>
            <h2 className="text-2xl font-bold text-slate-900">
              {isLoading ? "..." : total}
            </h2>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h2 className="font-semibold text-slate-900">All Users</h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage registered users.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={searchField}
              onChange={(event) => {
                setSearchField(event.target.value as "name" | "email");
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder={`Search by ${searchField}...`}
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400 sm:w-64"
              />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              Loading users...
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <p className="font-medium text-red-600">User operation failed</p>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={() => void fetchUsers()}
              className="mt-4 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className="max-w-36 truncate font-mono text-xs text-slate-500"
                          title={user.id}
                        >
                          {user.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => void handleCopyId(user.id)}
                          title="Copy user ID"
                          aria-label={`Copy ID for ${user.name}`}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          roleStyles[user.role] ?? "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="flex items-center gap-1.5 text-xs">
                        {user.emailVerified ? (
                          <>
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                            <span className="text-green-700">Verified</span>
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 text-amber-600" />
                            <span className="text-amber-700">Unverified</span>
                          </>
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.banned
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {user.banned ? "Banned" : "Active"}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-slate-600">
                      {formatDate(user.createdAt)}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          title="Edit user"
                          aria-label={`Edit ${user.name}`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(user)}
                          disabled={user.id === currentUserId}
                          title={
                            user.id === currentUserId
                              ? "You cannot delete your own account"
                              : "Delete user"
                          }
                          aria-label={`Delete ${user.name}`}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-12 text-center text-slate-500"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
            <p className="text-sm text-slate-500">
              Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
              {" - "}
              {Math.min(page * PAGE_SIZE, total)}
              {" of "}
              {total} users
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-slate-600">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  {modalMode === "create" ? "Create User" : "Update User"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {modalMode === "create"
                    ? "Add a new account to your application."
                    : "Update the user's name, email and role."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  placeholder="name@example.com"
                />
              </div>

              {modalMode === "create" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Temporary Password
                  </label>
                  <input
                    required
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    placeholder="At least 8 characters"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      role: event.target.value as UserFormState["role"],
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                >
                  <option value="sales">Sales</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {actionError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {actionError}
                </p>
              )}

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving && (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  )}
                  {modalMode === "create" ? "Create User" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
