import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  Search,
  Users,
  ShieldCheck,
  Mail,
  LoaderCircle,
  Plus,
  Pencil,
  Trash2,
  Copy,
  X,
  Ban,
  UserCheck,
  AlertTriangle,
  CalendarDays,
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

import ConfirmDialog from "../common/ConfirmDialog";
import ErrorMessage from "../common/ErrorMessage";
import Loading from "../common/Loading";
import Pagination from "../common/Pagination";
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from "../../constants/pagination";

// --------------------------------------------------
// Types
// --------------------------------------------------

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

type UserRole =
  | "superAdmin"
  | "admin"
  | "manager"
  | "sales"
  | "accountant"
  | "inventoryManager"
  | "viewer";

interface UserFormState {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

type ConfirmAction = "delete" | "unban" | null;

// --------------------------------------------------
// Constants
// --------------------------------------------------

const ROLE_OPTIONS: {
  value: UserRole;
  label: string;
}[] = [
  { value: "superAdmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "sales", label: "Sales" },
  { value: "accountant", label: "Accountant" },
  { value: "inventoryManager", label: "Inventory Manager" },
  { value: "viewer", label: "Viewer" },
];

const ROLE_STYLES: Record<string, string> = {
  superAdmin: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  manager: "bg-indigo-100 text-indigo-700",
  sales: "bg-emerald-100 text-emerald-700",
  accountant: "bg-amber-100 text-amber-700",
  inventoryManager: "bg-orange-100 text-orange-700",
  viewer: "bg-slate-100 text-slate-700",
};

const INITIAL_FORM: UserFormState = {
  name: "",
  email: "",
  password: "",
  role: "sales",
};

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function UsersPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const currentUserId = session?.user?.id ?? "";
  const currentUserRole = (session?.user?.role ?? "") as string;

  const isSuperAdmin = currentUserRole === "superAdmin";
  const isAdmin = currentUserRole === "admin";

  const canAccessPage = isSuperAdmin || isAdmin;

  // --------------------------------------------------
  // States
  // --------------------------------------------------

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState<"name" | "email">("name");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Create / Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserFormState>(INITIAL_FORM);

  // Ban
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState("");

  // Confirmation
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalUsers / limit));

  // --------------------------------------------------
  // Role permissions
  // --------------------------------------------------

  const canManageUser = useCallback(
    (user: AdminUser) => {
      if (user.id === currentUserId) return false;

      if (isSuperAdmin) return true;

      if (isAdmin && user.role !== "superAdmin") return true;

      return false;
    },
    [currentUserId, isAdmin, isSuperAdmin],
  );

  const availableRoles = ROLE_OPTIONS.filter((role) => {
    if (isAdmin && role.value === "superAdmin") return false;
    return true;
  });

  // --------------------------------------------------
  // Fetch Users
  // --------------------------------------------------

  const fetchUsers = useCallback(async () => {
    if (!canAccessPage) return;

    setLoading(true);
    setError("");

    try {
      const result = await authClient.admin.listUsers({
        query: {
          limit,
          offset: (currentPage - 1) * limit,
          searchValue: search.trim() || undefined,
          searchField,
          searchOperator: "contains",
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to load users.");
      }

      setUsers((result.data?.users ?? []) as AdminUser[]);
      setTotalUsers(result.data?.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, [canAccessPage, currentPage, limit, search, searchField]);

  useEffect(() => {
    if (!sessionLoading && canAccessPage) {
      fetchUsers();
    }
  }, [sessionLoading, canAccessPage, fetchUsers]);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const getRoleLabel = (role: string) => {
    return ROLE_OPTIONS.find((item) => item.value === role)?.label || role;
  };

  const copyUserId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setNotice("User ID copied to clipboard.");
      setError("");
    } catch {
      setError("Unable to copy user ID.");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(DEFAULT_PAGE);
  };

  const handleSearchFieldChange = (value: "name" | "email") => {
    setSearchField(value);
    setCurrentPage(DEFAULT_PAGE);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(Math.min(newLimit, MAX_LIMIT));
    setCurrentPage(DEFAULT_PAGE);
  };

  // --------------------------------------------------
  // Create / Edit User
  // --------------------------------------------------

  const openCreateDialog = () => {
    setEditingUser(null);
    setForm(INITIAL_FORM);
    setError("");
    setIsFormOpen(true);
  };

  const openEditDialog = (user: AdminUser) => {
    setEditingUser(user);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role as UserRole,
    });

    setError("");
    setIsFormOpen(true);
  };

  const closeFormDialog = () => {
    if (submitting) return;

    setIsFormOpen(false);
    setEditingUser(null);
    setForm(INITIAL_FORM);
    setError("");
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setNotice("");

    try {
      if (editingUser) {
        const updateResult = await authClient.admin.updateUser({
          userId: editingUser.id,
          data: {
            name: form.name.trim(),
            email: form.email.trim(),
          },
        });

        if (updateResult.error) {
          throw new Error(
            updateResult.error.message || "Unable to update user.",
          );
        }

        if (editingUser.role !== form.role) {
          const roleResult = await authClient.admin.setRole({
            userId: editingUser.id,
            role: form.role,
          });

          if (roleResult.error) {
            throw new Error(
              roleResult.error.message ||
                "User information updated, but role update failed.",
            );
          }
        }

        setNotice("User updated successfully.");
      } else {
        const createResult = await authClient.admin.createUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        });

        if (createResult.error) {
          throw new Error(
            createResult.error.message || "Unable to create user.",
          );
        }

        setNotice("User created successfully.");
      }

      setIsFormOpen(false);
      setEditingUser(null);
      setForm(INITIAL_FORM);

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Ban User
  // --------------------------------------------------

  const openBanDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setBanReason("");
    setError("");
    setIsBanDialogOpen(true);
  };

  const closeBanDialog = () => {
    if (submitting) return;

    setIsBanDialogOpen(false);
    setSelectedUser(null);
    setBanReason("");
    setError("");
  };

  const handleBan = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    setError("");

    try {
      const result = await authClient.admin.banUser({
        userId: selectedUser.id,
        banReason: banReason.trim() || undefined,
      });

      if (result.error) {
        throw new Error(result.error.message || "Unable to ban user.");
      }

      setNotice(`${selectedUser.name} has been banned.`);

      setIsBanDialogOpen(false);
      setSelectedUser(null);
      setBanReason("");

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to ban user.");
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Unban User
  // --------------------------------------------------

  const handleUnban = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    setError("");

    try {
      const result = await authClient.admin.unbanUser({
        userId: selectedUser.id,
      });

      if (result.error) {
        throw new Error(result.error.message || "Unable to unban user.");
      }

      setNotice(`${selectedUser.name} has been unbanned.`);

      setConfirmAction(null);
      setSelectedUser(null);

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to unban user.");
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Delete User
  // --------------------------------------------------

  const handleDelete = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    setError("");

    try {
      const result = await authClient.admin.removeUser({
        userId: selectedUser.id,
      });

      if (result.error) {
        throw new Error(result.error.message || "Unable to delete user.");
      }

      setNotice(`${selectedUser.name} has been deleted.`);

      setConfirmAction(null);
      setSelectedUser(null);

      // If the last user on the current page is deleted,
      // move back one page when necessary.
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        await fetchUsers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (confirmAction === "delete") {
      await handleDelete();
    }

    if (confirmAction === "unban") {
      await handleUnban();
    }
  };

  // --------------------------------------------------
  // Session / Permission Loading
  // --------------------------------------------------

  if (sessionLoading) {
    return <Loading message="Checking permissions..." />;
  }

  if (!canAccessPage) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <ShieldCheck className="mx-auto mb-3 h-12 w-12 text-slate-300" />

          <h2 className="text-lg font-semibold text-slate-800">
            Access Denied
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            You do not have permission to manage users.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-orange-100 p-2.5">
            <Users className="h-6 w-6 text-orange-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users</h1>
            <p className="text-sm text-slate-500">
              Manage users, roles and account access.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateDialog}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Notice */}

      {notice && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <span>{notice}</span>

          <button
            type="button"
            onClick={() => setNotice("")}
            className="rounded p-1 hover:bg-emerald-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Global Error */}

      {error && !isFormOpen && !isBanDialogOpen && (
        <div className="space-y-2">
          <ErrorMessage message={error} />

          <button
            type="button"
            onClick={() => setError("")}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Cards */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {totalUsers}
              </h3>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
               Email Verified (This Page)
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {users.filter((user) => user.emailVerified).length}
              </h3>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Banned (This Page)
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {users.filter((user) => user.banned).length}
              </h3>
            </div>

            <div className="rounded-lg bg-red-50 p-3">
              <Ban className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Search Header */}

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">All Users</h2>
            <p className="text-xs text-slate-500">
              Browse and manage registered users.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={searchField}
              onChange={(event) =>
                handleSearchFieldChange(event.target.value as "name" | "email")
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder={`Search by ${searchField}...`}
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}

        {loading ? (
          <Loading message="Loading users..." minHeight="300px" />
        ) : users.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-4 text-center">
            <div className="mb-3 rounded-full bg-slate-100 p-4">
              <Users className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="font-semibold text-slate-800">No users found</h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or add a new user.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => {
                const manageable = canManageUser(user);

                return (
                  <TableRow key={user.id}>
                    {/* User */}

                    <TableCell>
                      <div className="flex min-w-[180px] items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-100 font-semibold text-orange-700">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {user.name}
                          </p>

                          <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                            <Mail className="h-3 w-3 shrink-0" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* User ID */}

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="max-w-[110px] truncate font-mono text-xs text-slate-500">
                          {user.id}
                        </span>

                        <button
                          type="button"
                          onClick={() => copyUserId(user.id)}
                          title="Copy user ID"
                          className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>

                    {/* Role */}

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          ROLE_STYLES[user.role] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </TableCell>

                    {/* Verification */}

                    <TableCell>
                      {user.emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <ShieldCheck className="h-4 w-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-amber-600">
                          Unverified
                        </span>
                      )}
                    </TableCell>

                    {/* Status */}

                    <TableCell>
                      {user.banned ? (
                        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                          Banned
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          Active
                        </span>
                      )}
                    </TableCell>

                    {/* Created At */}

                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(user.createdAt)}
                      </span>
                    </TableCell>

                    {/* Actions */}

                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {manageable ? (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditDialog(user)}
                              title="Edit user"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            {user.banned ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setConfirmAction("unban");
                                }}
                                title="Unban user"
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openBanDialog(user)}
                                title="Ban user"
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                              >
                                <Ban className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(user);
                                setConfirmAction("delete");
                              }}
                              title="Delete user"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No actions
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Reusable Pagination */}

        {!loading && (
          <Pagination
            page={currentPage}
            lastPage={totalPages}
            total={totalUsers}
            limit={limit}
            onPageChange={setCurrentPage}
            onLimitChange={handleLimitChange}
            isFetching={loading}
          />
        )}
      </div>

      {/* -------------------------------------------- */}
      {/* Create / Edit Modal */}
      {/* -------------------------------------------- */}

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeFormDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-form-title"
            className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
          >
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2
                  id="user-form-title"
                  className="text-base font-semibold text-slate-900"
                >
                  {editingUser ? "Edit User" : "Create User"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingUser
                    ? "Update user details and role."
                    : "Create a new account for your application."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeFormDialog}
                disabled={submitting}
                className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}

            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4 px-5 py-5">
                {/* Name */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    required
                    minLength={2}
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    placeholder="Enter full name"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    placeholder="example@email.com"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {/* Password */}

                {!editingUser && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Password
                    </label>

                    <input
                      type="password"
                      required
                      minLength={8}
                      value={form.password}
                      onChange={(event) =>
                        setForm({ ...form, password: event.target.value })
                      }
                      placeholder="Enter password"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />

                    <p className="mt-1 text-xs text-slate-400">
                      Minimum 8 characters.
                    </p>
                  </div>
                )}

                {/* Role */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    User Role
                  </label>

                  <select
                    value={form.role}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        role: event.target.value as UserRole,
                      })
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    {availableRoles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                {error && <ErrorMessage message={error} />}
              </div>

              {/* Modal Footer */}

              <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
                <button
                  type="button"
                  onClick={closeFormDialog}
                  disabled={submitting}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  )}

                  {editingUser ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------- */}
      {/* Ban User Modal */}
      {/* -------------------------------------------- */}

      {isBanDialogOpen && selectedUser && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeBanDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ban-dialog-title"
            className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
          >
            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                  <Ban className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                  <h2
                    id="ban-dialog-title"
                    className="text-base font-semibold text-slate-900"
                  >
                    Ban User
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Restrict this user's account access.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeBanDialog}
                disabled={submitting}
                className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}

            <div className="space-y-4 px-5 py-5">
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5">
                <p className="text-xs text-slate-500">Selected user</p>
                <p className="mt-0.5 text-sm font-medium text-slate-800">
                  {selectedUser.name}
                </p>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Reason for ban{" "}
                  <span className="font-normal text-slate-400">(Optional)</span>
                </label>

                <textarea
                  rows={3}
                  maxLength={500}
                  value={banReason}
                  onChange={(event) => setBanReason(event.target.value)}
                  placeholder="Enter a reason..."
                  className="w-full resize-none rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <div className="mt-1 flex justify-between text-xs text-slate-400">
                  <span>Visible to administrators.</span>
                  <span>{banReason.length}/500</span>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                <p className="text-xs leading-5 text-amber-800">
                  This user will lose access to the application. You can restore
                  access later by unbanning the user.
                </p>
              </div>

              {error && <ErrorMessage message={error} />}
            </div>

            {/* Footer */}

            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
              <button
                type="button"
                onClick={closeBanDialog}
                disabled={submitting}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleBan}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Ban className="h-4 w-4" />
                )}
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------- */}
      {/* Delete / Unban Confirmation */}
      {/* -------------------------------------------- */}

      <ConfirmDialog
        isOpen={confirmAction === "delete" || confirmAction === "unban"}
        title={confirmAction === "delete" ? "Delete User" : "Unban User"}
        description={
          confirmAction === "delete"
            ? `Are you sure you want to permanently delete ${selectedUser?.name}? This action cannot be undone.`
            : `Are you sure you want to restore access for ${selectedUser?.name}?`
        }
        confirmText={confirmAction === "delete" ? "Delete User" : "Unban User"}
        cancelText="Cancel"
        isLoading={submitting}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (submitting) return;

          setConfirmAction(null);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}

// import { useCallback, useEffect, useState, type FormEvent } from "react";

// import {
//   Search,
//   Users,
//   ShieldCheck,
//   Mail,
//   ChevronLeft,
//   ChevronRight,
//   LoaderCircle,
//   Plus,
//   Pencil,
//   Trash2,
//   Copy,
//   X,
//   Ban,
//   UserCheck,
//   AlertTriangle,
//   CalendarDays,
// } from "lucide-react";

// import { authClient } from "../../lib/auth-client";

// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "../common/Table";

// import ConfirmDialog from "../common/ConfirmDialog";
// import ErrorMessage from "../common/ErrorMessage";
// import Loading from "../common/Loading";

// // --------------------------------------------------
// // Types
// // --------------------------------------------------

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

// type UserRole =
//   | "superAdmin"
//   | "admin"
//   | "manager"
//   | "sales"
//   | "accountant"
//   | "inventoryManager"
//   | "viewer";

// interface UserFormState {
//   name: string;
//   email: string;
//   password: string;
//   role: UserRole;
// }

// type ConfirmAction = "delete" | "unban" | null;

// // --------------------------------------------------
// // Constants
// // --------------------------------------------------

// const PAGE_SIZE = 10;

// const ROLE_OPTIONS: {
//   value: UserRole;
//   label: string;
// }[] = [
//   { value: "superAdmin", label: "Super Admin" },
//   { value: "admin", label: "Admin" },
//   { value: "manager", label: "Manager" },
//   { value: "sales", label: "Sales" },
//   { value: "accountant", label: "Accountant" },
//   { value: "inventoryManager", label: "Inventory Manager" },
//   { value: "viewer", label: "Viewer" },
// ];

// const ROLE_STYLES: Record<string, string> = {
//   superAdmin: "bg-purple-100 text-purple-700",
//   admin: "bg-blue-100 text-blue-700",
//   manager: "bg-indigo-100 text-indigo-700",
//   sales: "bg-emerald-100 text-emerald-700",
//   accountant: "bg-amber-100 text-amber-700",
//   inventoryManager: "bg-orange-100 text-orange-700",
//   viewer: "bg-slate-100 text-slate-700",
// };

// const INITIAL_FORM: UserFormState = {
//   name: "",
//   email: "",
//   password: "",
//   role: "sales",
// };

// // --------------------------------------------------
// // Component
// // --------------------------------------------------

// export default function UsersPage() {
//   // Better Auth session hook MUST be called at the top level.
//   const { data: session, isPending: sessionLoading } = authClient.useSession();

//   // Current logged-in user
//   const currentUserId = session?.user?.id ?? "";
//   const currentUserRole = (session?.user?.role ?? "") as string;

//   const isSuperAdmin = currentUserRole === "superAdmin";
//   const isAdmin = currentUserRole === "admin";

//   const canAccessPage = isSuperAdmin || isAdmin;

//   // --------------------------------------------------
//   // States
//   // --------------------------------------------------

//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [totalUsers, setTotalUsers] = useState(0);

//   const [currentPage, setCurrentPage] = useState(1);

//   const [search, setSearch] = useState("");
//   const [searchField, setSearchField] = useState<"name" | "email">("name");

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState("");

//   // Create / Edit dialog
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

//   const [form, setForm] = useState<UserFormState>(INITIAL_FORM);

//   // Ban reason dialog
//   const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
//   const [banReason, setBanReason] = useState("");

//   // Confirmation dialog
//   const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

//   const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

//   const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));

//   // --------------------------------------------------
//   // Role permissions (Frontend visibility only)
//   // --------------------------------------------------

//   const canManageUser = useCallback(
//     (user: AdminUser) => {
//       // Cannot manage own account
//       if (user.id === currentUserId) {
//         return false;
//       }

//       // Super Admin can manage everyone
//       if (isSuperAdmin) {
//         return true;
//       }

//       // Admin cannot manage Super Admin
//       if (isAdmin && user.role !== "superAdmin") {
//         return true;
//       }

//       return false;
//     },
//     [currentUserId, isAdmin, isSuperAdmin],
//   );

//   const availableRoles = ROLE_OPTIONS.filter((role) => {
//     // Admin cannot assign Super Admin role
//     if (isAdmin && role.value === "superAdmin") {
//       return false;
//     }

//     return true;
//   });

//   // --------------------------------------------------
//   // Fetch Users
//   // --------------------------------------------------

//   const fetchUsers = useCallback(async () => {
//     if (!canAccessPage) return;

//     setLoading(true);
//     setError("");

//     try {
//       const result = await authClient.admin.listUsers({
//         query: {
//           limit: PAGE_SIZE,
//           offset: (currentPage - 1) * PAGE_SIZE,
//           searchValue: search.trim() || undefined,
//           searchField,
//           searchOperator: "contains",
//           sortBy: "createdAt",
//           sortDirection: "desc",
//         },
//       });

//       if (result.error) {
//         throw new Error(result.error.message || "Failed to load users.");
//       }

//       setUsers((result.data?.users ?? []) as AdminUser[]);
//       setTotalUsers(result.data?.total ?? 0);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Unable to load users.");
//     } finally {
//       setLoading(false);
//     }
//   }, [canAccessPage, currentPage, search, searchField]);

//   useEffect(() => {
//     if (!sessionLoading && canAccessPage) {
//       fetchUsers();
//     }
//   }, [sessionLoading, canAccessPage, fetchUsers]);

//   // Reset pagination when search changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, searchField]);

//   // --------------------------------------------------
//   // Helpers
//   // --------------------------------------------------

//   const formatDate = (date: string) => {
//     return new Intl.DateTimeFormat("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     }).format(new Date(date));
//   };

//   const copyUserId = async (id: string) => {
//     try {
//       await navigator.clipboard.writeText(id);
//       setNotice("User ID copied to clipboard.");
//       setError("");
//     } catch {
//       setError("Unable to copy user ID.");
//     }
//   };

//   const getRoleLabel = (role: string) => {
//     return ROLE_OPTIONS.find((item) => item.value === role)?.label || role;
//   };

//   // --------------------------------------------------
//   // Create / Edit User
//   // --------------------------------------------------

//   const openCreateDialog = () => {
//     setEditingUser(null);
//     setForm(INITIAL_FORM);
//     setError("");
//     setIsFormOpen(true);
//   };

//   const openEditDialog = (user: AdminUser) => {
//     setEditingUser(user);

//     setForm({
//       name: user.name,
//       email: user.email,
//       password: "",
//       role: user.role as UserRole,
//     });

//     setError("");
//     setIsFormOpen(true);
//   };

//   const closeFormDialog = () => {
//     if (submitting) return;

//     setIsFormOpen(false);
//     setEditingUser(null);
//     setForm(INITIAL_FORM);
//   };

//   const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     setSubmitting(true);
//     setError("");
//     setNotice("");

//     try {
//       if (editingUser) {
//         // Update basic information
//         const updateResult = await authClient.admin.updateUser({
//           userId: editingUser.id,
//           data: {
//             name: form.name.trim(),
//             email: form.email.trim(),
//           },
//         });

//         if (updateResult.error) {
//           throw new Error(
//             updateResult.error.message || "Unable to update user.",
//           );
//         }

//         // Update role only when changed
//         if (editingUser.role !== form.role) {
//           const roleResult = await authClient.admin.setRole({
//             userId: editingUser.id,
//             role: form.role,
//           });

//           if (roleResult.error) {
//             throw new Error(
//               roleResult.error.message ||
//                 "User information updated, but role update failed.",
//             );
//           }
//         }

//         setNotice("User updated successfully.");
//       } else {
//         // Create user
//         const createResult = await authClient.admin.createUser({
//           name: form.name.trim(),
//           email: form.email.trim(),
//           password: form.password,
//           role: form.role,
//         });

//         if (createResult.error) {
//           throw new Error(
//             createResult.error.message || "Unable to create user.",
//           );
//         }

//         setNotice("User created successfully.");
//       }

//       setIsFormOpen(false);
//       setEditingUser(null);
//       setForm(INITIAL_FORM);

//       await fetchUsers();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // --------------------------------------------------
//   // Ban User
//   // --------------------------------------------------

//   const openBanDialog = (user: AdminUser) => {
//     setSelectedUser(user);
//     setBanReason("");
//     setError("");
//     setIsBanDialogOpen(true);
//   };

//   const closeBanDialog = () => {
//     if (submitting) return;

//     setIsBanDialogOpen(false);
//     setSelectedUser(null);
//     setBanReason("");
//   };

//   const handleBan = async () => {
//     if (!selectedUser) return;

//     setSubmitting(true);
//     setError("");

//     try {
//       const result = await authClient.admin.banUser({
//         userId: selectedUser.id,
//         banReason: banReason.trim() || undefined,
//       });

//       if (result.error) {
//         throw new Error(result.error.message || "Unable to ban user.");
//       }

//       setNotice(`${selectedUser.name} has been banned.`);

//       setIsBanDialogOpen(false);
//       setSelectedUser(null);
//       setBanReason("");

//       await fetchUsers();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Unable to ban user.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // --------------------------------------------------
//   // Unban User
//   // --------------------------------------------------

//   const handleUnban = async () => {
//     if (!selectedUser) return;

//     setSubmitting(true);
//     setError("");

//     try {
//       const result = await authClient.admin.unbanUser({
//         userId: selectedUser.id,
//       });

//       if (result.error) {
//         throw new Error(result.error.message || "Unable to unban user.");
//       }

//       setNotice(`${selectedUser.name} has been unbanned.`);

//       setConfirmAction(null);
//       setSelectedUser(null);

//       await fetchUsers();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Unable to unban user.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // --------------------------------------------------
//   // Delete User
//   // --------------------------------------------------

//   const handleDelete = async () => {
//     if (!selectedUser) return;

//     setSubmitting(true);
//     setError("");

//     try {
//       const result = await authClient.admin.removeUser({
//         userId: selectedUser.id,
//       });

//       if (result.error) {
//         throw new Error(result.error.message || "Unable to delete user.");
//       }

//       setNotice(`${selectedUser.name} has been deleted.`);

//       setConfirmAction(null);
//       setSelectedUser(null);

//       await fetchUsers();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Unable to delete user.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleConfirm = async () => {
//     if (confirmAction === "delete") {
//       await handleDelete();
//     }

//     if (confirmAction === "unban") {
//       await handleUnban();
//     }
//   };

//   // --------------------------------------------------
//   // Session / Permission Loading
//   // --------------------------------------------------

//   if (sessionLoading) {
//     return <Loading message="Checking permissions..." />;
//   }

//   if (!canAccessPage) {
//     return (
//       <div className="flex min-h-[400px] items-center justify-center">
//         <div className="text-center">
//           <ShieldCheck className="mx-auto mb-3 h-12 w-12 text-slate-300" />

//           <h2 className="text-lg font-semibold text-slate-800">
//             Access Denied
//           </h2>

//           <p className="mt-1 text-sm text-slate-500">
//             You do not have permission to manage users.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // UI
//   // --------------------------------------------------

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}

//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div className="flex items-center gap-3">
//           <div className="rounded-xl bg-orange-100 p-2.5">
//             <Users className="h-6 w-6 text-orange-600" />
//           </div>

//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">Users</h1>

//             <p className="text-sm text-slate-500">
//               Manage users, roles and account access.
//             </p>
//           </div>
//         </div>

//         <button
//           onClick={openCreateDialog}
//           className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
//         >
//           <Plus className="h-4 w-4" />
//           Add User
//         </button>
//       </div>

//       {/* Notice */}

//       {notice && (
//         <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
//           <span>{notice}</span>

//           <button
//             onClick={() => setNotice("")}
//             className="rounded p-1 hover:bg-emerald-100"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       {/* Error */}

//       {error && (
//         <div className="space-y-2">
//           <ErrorMessage message={error} />

//           <button
//             onClick={() => setError("")}
//             className="text-xs font-medium text-slate-500 hover:text-slate-700"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {/* Summary Cards */}

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-500">Total Users</p>

//               <h3 className="mt-2 text-2xl font-bold text-slate-900">
//                 {totalUsers}
//               </h3>
//             </div>

//             <div className="rounded-lg bg-blue-50 p-3">
//               <Users className="h-6 w-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-500">
//                 Verified Users
//               </p>

//               <h3 className="mt-2 text-2xl font-bold text-slate-900">
//                 {users.filter((user) => user.emailVerified).length}
//               </h3>
//             </div>

//             <div className="rounded-lg bg-emerald-50 p-3">
//               <ShieldCheck className="h-6 w-6 text-emerald-600" />
//             </div>
//           </div>
//         </div>

//         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-500">Banned Users</p>

//               <h3 className="mt-2 text-2xl font-bold text-slate-900">
//                 {users.filter((user) => user.banned).length}
//               </h3>
//             </div>

//             <div className="rounded-lg bg-red-50 p-3">
//               <Ban className="h-6 w-6 text-red-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Users Table Container */}

//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         {/* Search */}

//         <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h2 className="font-semibold text-slate-900">All Users</h2>

//             <p className="text-xs text-slate-500">
//               Browse and manage registered users.
//             </p>
//           </div>

//           <div className="flex flex-col gap-2 sm:flex-row">
//             <select
//               value={searchField}
//               onChange={(event) =>
//                 setSearchField(event.target.value as "name" | "email")
//               }
//               className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//             >
//               <option value="name">Name</option>
//               <option value="email">Email</option>
//             </select>

//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//               <input
//                 type="text"
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 placeholder={`Search by ${searchField}...`}
//                 className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 sm:w-64"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Table Content */}

//         {loading ? (
//           <Loading message="Loading users..." minHeight="300px" />
//         ) : users.length === 0 ? (
//           <div className="flex min-h-[250px] flex-col items-center justify-center px-4 text-center">
//             <div className="mb-3 rounded-full bg-slate-100 p-4">
//               <Users className="h-7 w-7 text-slate-400" />
//             </div>

//             <h3 className="font-semibold text-slate-800">No users found</h3>

//             <p className="mt-1 text-sm text-slate-500">
//               Try changing your search or add a new user.
//             </p>
//           </div>
//         ) : (
//           <>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>User</TableHead>
//                   <TableHead>User ID</TableHead>
//                   <TableHead>Role</TableHead>
//                   <TableHead>Verification</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Created At</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {users.map((user) => {
//                   const manageable = canManageUser(user);

//                   return (
//                     <TableRow key={user.id}>
//                       {/* User */}

//                       <TableCell>
//                         <div className="flex min-w-[180px] items-center gap-3">
//                           <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-100 font-semibold text-orange-700">
//                             {user.image ? (
//                               <img
//                                 src={user.image}
//                                 alt={user.name}
//                                 className="h-full w-full object-cover"
//                               />
//                             ) : (
//                               user.name.charAt(0).toUpperCase()
//                             )}
//                           </div>

//                           <div className="min-w-0">
//                             <p className="truncate font-medium text-slate-900">
//                               {user.name}
//                             </p>

//                             <p className="flex items-center gap-1 truncate text-xs text-slate-500">
//                               <Mail className="h-3 w-3 shrink-0" />
//                               {user.email}
//                             </p>
//                           </div>
//                         </div>
//                       </TableCell>

//                       {/* User ID */}

//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <span className="max-w-[110px] truncate font-mono text-xs text-slate-500">
//                             {user.id}
//                           </span>

//                           <button
//                             onClick={() => copyUserId(user.id)}
//                             title="Copy user ID"
//                             className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//                           >
//                             <Copy className="h-3.5 w-3.5" />
//                           </button>
//                         </div>
//                       </TableCell>

//                       {/* Role */}

//                       <TableCell>
//                         <span
//                           className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
//                             ROLE_STYLES[user.role] ||
//                             "bg-slate-100 text-slate-700"
//                           }`}
//                         >
//                           {getRoleLabel(user.role)}
//                         </span>
//                       </TableCell>

//                       {/* Verification */}

//                       <TableCell>
//                         {user.emailVerified ? (
//                           <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
//                             <ShieldCheck className="h-4 w-4" />
//                             Verified
//                           </span>
//                         ) : (
//                           <span className="text-xs font-medium text-amber-600">
//                             Unverified
//                           </span>
//                         )}
//                       </TableCell>

//                       {/* Status */}

//                       <TableCell>
//                         {user.banned ? (
//                           <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
//                             Banned
//                           </span>
//                         ) : (
//                           <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
//                             Active
//                           </span>
//                         )}
//                       </TableCell>

//                       {/* Created At */}

//                       <TableCell>
//                         <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
//                           <CalendarDays className="h-3.5 w-3.5" />
//                           {formatDate(user.createdAt)}
//                         </span>
//                       </TableCell>

//                       {/* Actions */}

//                       <TableCell>
//                         <div className="flex items-center justify-end gap-1">
//                           {manageable ? (
//                             <>
//                               <button
//                                 onClick={() => openEditDialog(user)}
//                                 title="Edit user"
//                                 className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
//                               >
//                                 <Pencil className="h-4 w-4" />
//                               </button>

//                               {user.banned ? (
//                                 <button
//                                   onClick={() => {
//                                     setSelectedUser(user);
//                                     setConfirmAction("unban");
//                                   }}
//                                   title="Unban user"
//                                   className="rounded-lg p-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
//                                 >
//                                   <UserCheck className="h-4 w-4" />
//                                 </button>
//                               ) : (
//                                 <button
//                                   onClick={() => openBanDialog(user)}
//                                   title="Ban user"
//                                   className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
//                                 >
//                                   <Ban className="h-4 w-4" />
//                                 </button>
//                               )}

//                               <button
//                                 onClick={() => {
//                                   setSelectedUser(user);
//                                   setConfirmAction("delete");
//                                 }}
//                                 title="Delete user"
//                                 className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </button>
//                             </>
//                           ) : (
//                             <span className="text-xs text-slate-400">
//                               No actions
//                             </span>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>

//             {/* Pagination */}

//             <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
//               <p className="text-xs text-slate-500">
//                 Showing{" "}
//                 <span className="font-semibold text-slate-700">
//                   {totalUsers === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
//                 </span>
//                 {" - "}
//                 <span className="font-semibold text-slate-700">
//                   {Math.min(currentPage * PAGE_SIZE, totalUsers)}
//                 </span>
//                 {" of "}
//                 <span className="font-semibold text-slate-700">
//                   {totalUsers}
//                 </span>{" "}
//                 users
//               </p>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() =>
//                     setCurrentPage((page) => Math.max(1, page - 1))
//                   }
//                   disabled={currentPage === 1}
//                   className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                   Previous
//                 </button>

//                 <span className="px-2 text-xs font-medium text-slate-600">
//                   Page {currentPage} of {totalPages}
//                 </span>

//                 <button
//                   onClick={() =>
//                     setCurrentPage((page) => Math.min(totalPages, page + 1))
//                   }
//                   disabled={currentPage >= totalPages}
//                   className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   Next
//                   <ChevronRight className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* -------------------------------------------- */}
//       {/* Create / Edit User Dialog */}
//       {/* -------------------------------------------- */}

//       {isFormOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
//               <div>
//                 <h2 className="text-lg font-bold text-slate-900">
//                   {editingUser ? "Edit User" : "Create New User"}
//                 </h2>

//                 <p className="mt-0.5 text-xs text-slate-500">
//                   {editingUser
//                     ? "Update user information and permissions."
//                     : "Add a new user to your application."}
//                 </p>
//               </div>

//               <button
//                 onClick={closeFormDialog}
//                 disabled={submitting}
//                 className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <form onSubmit={handleFormSubmit} className="space-y-4 p-6">
//               {/* Name */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Full Name
//                 </label>

//                 <input
//                   type="text"
//                   required
//                   minLength={2}
//                   value={form.name}
//                   onChange={(event) =>
//                     setForm({
//                       ...form,
//                       name: event.target.value,
//                     })
//                   }
//                   placeholder="Enter full name"
//                   className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 />
//               </div>

//               {/* Email */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Email Address
//                 </label>

//                 <input
//                   type="email"
//                   required
//                   value={form.email}
//                   onChange={(event) =>
//                     setForm({
//                       ...form,
//                       email: event.target.value,
//                     })
//                   }
//                   placeholder="example@email.com"
//                   className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 />
//               </div>

//               {/* Password - Create only */}

//               {!editingUser && (
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Password
//                   </label>

//                   <input
//                     type="password"
//                     required
//                     minLength={8}
//                     value={form.password}
//                     onChange={(event) =>
//                       setForm({
//                         ...form,
//                         password: event.target.value,
//                       })
//                     }
//                     placeholder="Enter password"
//                     className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                   />

//                   <p className="mt-1 text-xs text-slate-400">
//                     Password must be at least 8 characters.
//                   </p>
//                 </div>
//               )}

//               {/* Role */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   User Role
//                 </label>

//                 <select
//                   value={form.role}
//                   onChange={(event) =>
//                     setForm({
//                       ...form,
//                       role: event.target.value as UserRole,
//                     })
//                   }
//                   className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 >
//                   {availableRoles.map((role) => (
//                     <option key={role.value} value={role.value}>
//                       {role.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {error && <ErrorMessage message={error} />}

//               {/* Footer */}

//               <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
//                 <button
//                   type="button"
//                   onClick={closeFormDialog}
//                   disabled={submitting}
//                   className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {submitting && (
//                     <LoaderCircle className="h-4 w-4 animate-spin" />
//                   )}

//                   {editingUser ? "Save Changes" : "Create User"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* -------------------------------------------- */}
//       {/* Ban Reason Dialog */}
//       {/* -------------------------------------------- */}

//       {isBanDialogOpen && selectedUser && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]">
//           <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
//             {/* Header */}

//             <div className="border-b border-slate-100 px-6 py-5">
//               <div className="flex items-start gap-3">
//                 <div className="rounded-xl bg-amber-100 p-3">
//                   <Ban className="h-5 w-5 text-amber-600" />
//                 </div>

//                 <div className="flex-1">
//                   <h2 className="text-lg font-bold text-slate-900">Ban User</h2>

//                   <p className="mt-1 text-sm text-slate-500">
//                     You are about to restrict access for{" "}
//                     <span className="font-semibold text-slate-700">
//                       {selectedUser.name}
//                     </span>
//                     .
//                   </p>
//                 </div>

//                 <button
//                   onClick={closeBanDialog}
//                   disabled={submitting}
//                   className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Body */}

//             <div className="space-y-4 px-6 py-5">
//               <div>
//                 <label className="mb-2 block text-sm font-semibold text-slate-700">
//                   Reason for ban{" "}
//                   <span className="font-normal text-slate-400">(Optional)</span>
//                 </label>

//                 <textarea
//                   rows={4}
//                   maxLength={500}
//                   value={banReason}
//                   onChange={(event) => setBanReason(event.target.value)}
//                   placeholder="Explain why this user is being banned..."
//                   className="w-full resize-none rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 />

//                 <div className="mt-1 flex justify-between text-xs text-slate-400">
//                   <span>This reason may be visible to administrators.</span>

//                   <span>{banReason.length}/500</span>
//                 </div>
//               </div>

//               <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
//                 <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

//                 <p className="text-xs leading-5 text-amber-800">
//                   This action will restrict the user's access to the
//                   application. You can unban the user later.
//                 </p>
//               </div>

//               {error && <ErrorMessage message={error} />}
//             </div>

//             {/* Footer */}

//             <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
//               <button
//                 type="button"
//                 onClick={closeBanDialog}
//                 disabled={submitting}
//                 className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={handleBan}
//                 disabled={submitting}
//                 className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {submitting ? (
//                   <LoaderCircle className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Ban className="h-4 w-4" />
//                 )}
//                 Ban User
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* -------------------------------------------- */}
//       {/* Delete / Unban Confirmation */}
//       {/* -------------------------------------------- */}

//       <ConfirmDialog
//         isOpen={confirmAction === "delete" || confirmAction === "unban"}
//         title={confirmAction === "delete" ? "Delete User" : "Unban User"}
//         description={
//           confirmAction === "delete"
//             ? `Are you sure you want to permanently delete ${selectedUser?.name}? This action cannot be undone.`
//             : `Are you sure you want to restore access for ${selectedUser?.name}?`
//         }
//         confirmText={confirmAction === "delete" ? "Delete User" : "Unban User"}
//         cancelText="Cancel"
//         isLoading={submitting}
//         onConfirm={handleConfirm}
//         onCancel={() => {
//           if (submitting) return;

//           setConfirmAction(null);
//           setSelectedUser(null);
//         }}
//       />
//     </div>
//   );
// }

// import { useCallback, useEffect, useState, type FormEvent } from "react";
// import {
//   Search,
//   Users,
//   ShieldCheck,
//   Mail,
//   ChevronLeft,
//   ChevronRight,
//   LoaderCircle,
//   Plus,
//   Pencil,
//   Trash2,
//   Copy,
//   X,
//   Ban,
// } from "lucide-react";

// import { authClient } from "../../lib/auth-client";

// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "../common/Table";

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

// type UserFormMode = "create" | "edit";

// type UserRole =
//   | "superAdmin"
//   | "admin"
//   | "manager"
//   | "sales"
//   | "accountant"
//   | "inventoryManager"
//   | "viewer";

// interface UserFormState {
//   name: string;
//   email: string;
//   password: string;
//   role: UserRole;
// }

// const PAGE_SIZE = 10;

// const roleOptions: { value: UserRole; label: string }[] = [
//   { value: "superAdmin", label: "Super Admin" },
//   { value: "admin", label: "Admin" },
//   { value: "manager", label: "Manager" },
//   { value: "sales", label: "Sales" },
//   { value: "accountant", label: "Accountant" },
//   { value: "inventoryManager", label: "Inventory Manager" },
//   { value: "viewer", label: "Viewer" },
// ];

// const roleStyles: Record<string, string> = {
//   superAdmin: "bg-red-50 text-red-700",
//   admin: "bg-purple-50 text-purple-700",
//   manager: "bg-blue-50 text-blue-700",
//   sales: "bg-slate-100 text-slate-700",
//   accountant: "bg-green-50 text-green-700",
//   inventoryManager: "bg-orange-50 text-orange-700",
//   viewer: "bg-gray-100 text-gray-700",
// };

// const emptyForm: UserFormState = {
//   name: "",
//   email: "",
//   password: "",
//   role: "sales",
// };

// export default function UsersPage() {
//   const { data: session, isPending } = authClient.useSession();

//   const currentUserId = session?.user?.id;
//   const currentRole = session?.user?.role as UserRole | undefined;

//   // Only Super Admin and Admin can access User Management
//   const canManageUsers =
//     currentRole === "superAdmin" || currentRole === "admin";

//   // Super Admin → সব role দেখতে ও assign করতে পারবে
//   // Admin → Super Admin role দেখতে বা assign করতে পারবে না
//   const availableRoles =
//     currentRole === "superAdmin"
//       ? roleOptions
//       : currentRole === "admin"
//         ? roleOptions.filter((role) => role.value !== "superAdmin")
//         : [];

//   // Super Admin → সবাইকে manage করতে পারবে
//   // Admin → Super Admin ছাড়া সবাইকে manage করতে পারবে
//   const canManageUser = (user: AdminUser) => {
//     if (currentRole === "superAdmin") return true;
//     if (currentRole === "admin") return user.role !== "superAdmin";
//     return false;
//   };

//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [total, setTotal] = useState(0);
//   const [search, setSearch] = useState("");
//   const [searchField, setSearchField] = useState<"name" | "email">("name");
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [modalMode, setModalMode] = useState<UserFormMode | null>(null);
//   const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
//   const [form, setForm] = useState<UserFormState>(emptyForm);
//   const [isSaving, setIsSaving] = useState(false);

//   const [actionError, setActionError] = useState<string | null>(null);
//   const [notice, setNotice] = useState<string | null>(null);

//   // Ban/Unban action loading state
//   const [processingUserId, setProcessingUserId] = useState<string | null>(null);

//   // Fetch users
//   const fetchUsers = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const result = await authClient.admin.listUsers({
//         query: {
//           limit: PAGE_SIZE,
//           offset: (page - 1) * PAGE_SIZE,
//           ...(search.trim()
//             ? {
//                 searchValue: search.trim(),
//                 searchField,
//                 searchOperator: "contains" as const,
//               }
//             : {}),
//           sortBy: "createdAt",
//           sortDirection: "desc",
//         },
//       });

//       if (result.error) {
//         setError(result.error.message);
//         setUsers([]);
//         setTotal(0);
//         return;
//       }

//       setUsers((result.data?.users ?? []) as AdminUser[]);
//       setTotal(result.data?.total ?? 0);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load users.");
//       setUsers([]);
//       setTotal(0);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [page, search, searchField]);

//   useEffect(() => {
//     if (!isPending && canManageUsers) {
//       void fetchUsers();
//     } else if (!isPending) {
//       setIsLoading(false);
//     }
//   }, [fetchUsers, isPending, canManageUsers]);

//   const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

//   const formatDate = (value: string) =>
//     new Intl.DateTimeFormat("en-BD", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     }).format(new Date(value));

//   const handleSearchChange = (value: string) => {
//     setSearch(value);
//     setPage(1);
//   };

//   // Open create modal
//   const openCreateModal = () => {
//     if (!canManageUsers || availableRoles.length === 0) return;

//     setSelectedUser(null);

//     setForm({
//       ...emptyForm,
//       role: availableRoles[0]?.value ?? "sales",
//     });

//     setActionError(null);
//     setModalMode("create");
//   };

//   // Open edit modal
//   const openEditModal = (user: AdminUser) => {
//     if (!canManageUser(user)) {
//       setError("You do not have permission to manage this user.");
//       return;
//     }

//     const safeRole = availableRoles.some((r) => r.value === user.role)
//       ? (user.role as UserRole)
//       : (availableRoles[0]?.value ?? "sales");

//     setSelectedUser(user);

//     setForm({
//       name: user.name,
//       email: user.email,
//       password: "",
//       role: safeRole,
//     });

//     setActionError(null);
//     setModalMode("edit");
//   };

//   // Close modal
//   const closeModal = () => {
//     if (isSaving) return;

//     setModalMode(null);
//     setSelectedUser(null);
//     setForm(emptyForm);
//     setActionError(null);
//   };

//   // Create / Update user
//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setActionError(null);

//     if (!canManageUsers) {
//       setActionError("You do not have permission to manage users.");
//       return;
//     }

//     if (currentRole === "admin" && form.role === "superAdmin") {
//       setActionError("You cannot assign the Super Admin role.");
//       return;
//     }

//     if (!availableRoles.some((role) => role.value === form.role)) {
//       setActionError("You cannot assign this role.");
//       return;
//     }

//     if (
//       modalMode === "edit" &&
//       (!selectedUser || !canManageUser(selectedUser))
//     ) {
//       setActionError("You do not have permission to edit this user.");
//       return;
//     }

//     const name = form.name.trim();
//     const email = form.email.trim().toLowerCase();

//     if (!name || !email) {
//       setActionError("Name and email are required.");
//       return;
//     }

//     if (modalMode === "create" && form.password.length < 8) {
//       setActionError("Password must be at least 8 characters.");
//       return;
//     }

//     try {
//       setIsSaving(true);

//       if (modalMode === "create") {
//         const result = await authClient.admin.createUser({
//           name,
//           email,
//           password: form.password,
//           role: form.role,
//         });

//         if (result.error) {
//           setActionError(result.error.message);
//           return;
//         }

//         setNotice("User created successfully.");
//       } else if (modalMode === "edit" && selectedUser) {
//         const result = await authClient.admin.updateUser({
//           userId: selectedUser.id,
//           data: {
//             name,
//             email,
//           },
//         });

//         if (result.error) {
//           setActionError(result.error.message);
//           return;
//         }

//         const roleResult = await authClient.admin.setRole({
//           userId: selectedUser.id,
//           role: form.role,
//         });

//         if (roleResult.error) {
//           setActionError(
//             `Name/email were updated, but role update failed: ${roleResult.error.message}`,
//           );
//           await fetchUsers();
//           return;
//         }

//         setNotice("User updated successfully.");
//       }

//       setModalMode(null);
//       setSelectedUser(null);
//       setForm(emptyForm);

//       await fetchUsers();
//     } catch (err) {
//       setActionError(
//         err instanceof Error ? err.message : "Something went wrong.",
//       );
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Ban user
//   const handleBan = async (user: AdminUser) => {
//     if (!canManageUser(user)) {
//       setError("You do not have permission to ban this user.");
//       return;
//     }

//     if (user.id === currentUserId) {
//       setError("You cannot ban your own account.");
//       return;
//     }

//     if (user.banned || processingUserId) return;

//     const banReason = window.prompt(`Why do you want to ban ${user.name}?`);

//     if (banReason === null) return;

//     const confirmed = window.confirm(
//       `Permanently ban ${user.name} (${user.email})?\n\nThis action will revoke all existing sessions.`,
//     );

//     if (!confirmed) return;

//     setNotice(null);
//     setError(null);
//     setProcessingUserId(user.id);

//     try {
//       const result = await authClient.admin.banUser({
//         userId: user.id,
//         banReason: banReason.trim() || undefined,
//       });

//       if (result.error) {
//         setError(result.error.message);
//         return;
//       }

//       setNotice(`${user.name} has been banned successfully.`);

//       await fetchUsers();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to ban user.");
//     } finally {
//       setProcessingUserId(null);
//     }
//   };

//   // Unban user
//   const handleUnban = async (user: AdminUser) => {
//     if (!canManageUser(user)) {
//       setError("You do not have permission to unban this user.");
//       return;
//     }

//     if (!user.banned || processingUserId) return;

//     const confirmed = window.confirm(
//       `Unban ${user.name} (${user.email})?\n\nThis user will be able to sign in again.`,
//     );

//     if (!confirmed) return;

//     setNotice(null);
//     setError(null);
//     setProcessingUserId(user.id);

//     try {
//       const result = await authClient.admin.unbanUser({
//         userId: user.id,
//       });

//       if (result.error) {
//         setError(result.error.message);
//         return;
//       }

//       setNotice(`${user.name} has been unbanned successfully.`);

//       await fetchUsers();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to unban user.");
//     } finally {
//       setProcessingUserId(null);
//     }
//   };

//   // Delete user
//   const handleDelete = async (user: AdminUser) => {
//     if (!canManageUser(user)) {
//       setError("You do not have permission to delete this user.");
//       return;
//     }

//     if (user.id === currentUserId) {
//       setError("You cannot delete your own account from User Management.");
//       return;
//     }

//     const confirmed = window.confirm(
//       `Permanently delete ${user.name} (${user.email})?\n\nThis action cannot be undone.`,
//     );

//     if (!confirmed) return;

//     setNotice(null);
//     setError(null);

//     try {
//       const result = await authClient.admin.removeUser({
//         userId: user.id,
//       });

//       if (result.error) {
//         setError(result.error.message);
//         return;
//       }

//       setNotice("User deleted successfully.");

//       if (users.length === 1 && page > 1) {
//         setPage((current) => current - 1);
//       } else {
//         await fetchUsers();
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to delete user.");
//     }
//   };

//   // Copy user ID
//   const handleCopyId = async (id: string) => {
//     try {
//       await navigator.clipboard.writeText(id);
//       setNotice("User ID copied.");
//     } catch {
//       setNotice("Could not copy the user ID. Please copy it manually.");
//     }
//   };

//   if (isPending) {
//     return (
//       <div className="flex min-h-64 items-center justify-center">
//         <LoaderCircle className="h-6 w-6 animate-spin text-slate-500" />
//       </div>
//     );
//   }

//   if (!canManageUsers) {
//     return (
//       <div className="rounded-xl border border-red-200 bg-red-50 p-6">
//         <h1 className="text-lg font-semibold text-red-700">Access Denied</h1>
//         <p className="mt-2 text-sm text-red-600">
//           You do not have permission to access User Management.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-wrap items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
//           <p className="mt-1 text-sm text-slate-500">
//             Manage users, roles and account access.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={openCreateModal}
//           className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
//         >
//           <Plus className="h-4 w-4" />
//           Add User
//         </button>
//       </div>

//       {/* Notice */}
//       {notice && (
//         <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//           <span>{notice}</span>
//           <button
//             type="button"
//             onClick={() => setNotice(null)}
//             aria-label="Dismiss notification"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       {/* Error */}
//       {error && (
//         <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           <span>{error}</span>
//           <button
//             type="button"
//             onClick={() => setError(null)}
//             aria-label="Dismiss error"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       {/* Total users */}
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

//       {/* Users table */}
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
//         {/* Search header */}
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
//               onChange={(event) => {
//                 setSearchField(event.target.value as "name" | "email");
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
//                 onChange={(event) => handleSearchChange(event.target.value)}
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

//         {/* Table error */}
//         {!isLoading && error && (
//           <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
//             <p className="font-medium text-red-600">User operation failed</p>
//             <p className="mt-2 text-sm text-slate-500">{error}</p>
//             <button
//               type="button"
//               onClick={() => void fetchUsers()}
//               className="mt-4 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
//             >
//               Try again
//             </button>
//           </div>
//         )}

//         {/* Table content */}
//         {!isLoading && !error && (
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>User ID</TableHead>
//                   <TableHead>User</TableHead>
//                   <TableHead>Role</TableHead>
//                   <TableHead>Verification</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Created At</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {users.map((user) => {
//                   const isProcessing = processingUserId === user.id;

//                   return (
//                     <TableRow key={user.id}>
//                       {/* User ID */}
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <span
//                             className="max-w-36 truncate font-mono text-xs text-slate-500"
//                             title={user.id}
//                           >
//                             {user.id}
//                           </span>
//                           <button
//                             type="button"
//                             onClick={() => void handleCopyId(user.id)}
//                             title="Copy user ID"
//                             aria-label={`Copy ID for ${user.name}`}
//                             className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
//                           >
//                             <Copy className="h-3.5 w-3.5" />
//                           </button>
//                         </div>
//                       </TableCell>

//                       {/* User information */}
//                       <TableCell>
//                         <div className="flex items-center gap-3">
//                           {user.image ? (
//                             <img
//                               src={user.image}
//                               alt=""
//                               className="h-10 w-10 rounded-full object-cover"
//                             />
//                           ) : (
//                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
//                               {user.name.charAt(0).toUpperCase()}
//                             </div>
//                           )}

//                           <div>
//                             <p className="font-medium text-slate-900">
//                               {user.name}
//                             </p>
//                             <p className="text-xs text-slate-500">
//                               {user.email}
//                             </p>
//                           </div>
//                         </div>
//                       </TableCell>

//                       {/* Role */}
//                       <TableCell>
//                         <span
//                           className={`rounded-full px-2.5 py-1 text-xs font-medium ${
//                             roleStyles[user.role] ??
//                             "bg-slate-100 text-slate-700"
//                           }`}
//                         >
//                           {roleOptions.find((role) => role.value === user.role)
//                             ?.label ?? user.role}
//                         </span>
//                       </TableCell>

//                       {/* Verification */}
//                       <TableCell>
//                         <span className="flex items-center gap-1.5 text-xs">
//                           {user.emailVerified ? (
//                             <>
//                               <ShieldCheck className="h-4 w-4 text-green-600" />
//                               <span className="text-green-700">Verified</span>
//                             </>
//                           ) : (
//                             <>
//                               <Mail className="h-4 w-4 text-amber-600" />
//                               <span className="text-amber-700">Unverified</span>
//                             </>
//                           )}
//                         </span>
//                       </TableCell>

//                       {/* Status */}
//                       <TableCell>
//                         <div className="space-y-1">
//                           <span
//                             className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                               user.banned
//                                 ? "bg-red-50 text-red-700"
//                                 : "bg-green-50 text-green-700"
//                             }`}
//                           >
//                             {user.banned ? "Banned" : "Active"}
//                           </span>

//                           {user.banned && user.banReason && (
//                             <p
//                               className="max-w-40 truncate text-xs text-slate-500"
//                               title={user.banReason}
//                             >
//                               {user.banReason}
//                             </p>
//                           )}

//                           {user.banned && user.banExpires && (
//                             <p className="text-xs text-slate-500">
//                               Expires: {formatDate(user.banExpires)}
//                             </p>
//                           )}
//                         </div>
//                       </TableCell>

//                       {/* Created At */}
//                       <TableCell className="whitespace-nowrap text-slate-600">
//                         {formatDate(user.createdAt)}
//                       </TableCell>

//                       {/* Actions */}
//                       <TableCell>
//                         <div className="flex justify-end gap-1">
//                           {canManageUser(user) && (
//                             <>
//                               {/* Edit */}
//                               <button
//                                 type="button"
//                                 onClick={() => openEditModal(user)}
//                                 title="Edit user"
//                                 aria-label={`Edit ${user.name}`}
//                                 className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
//                               >
//                                 <Pencil className="h-4 w-4" />
//                               </button>

//                               {/* Ban / Unban */}
//                               {user.banned ? (
//                                 <button
//                                   type="button"
//                                   onClick={() => void handleUnban(user)}
//                                   disabled={!!processingUserId}
//                                   title="Unban user"
//                                   aria-label={`Unban ${user.name}`}
//                                   className="rounded-lg p-2 text-green-600 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-40"
//                                 >
//                                   {isProcessing ? (
//                                     <LoaderCircle className="h-4 w-4 animate-spin" />
//                                   ) : (
//                                     <ShieldCheck className="h-4 w-4" />
//                                   )}
//                                 </button>
//                               ) : (
//                                 <button
//                                   type="button"
//                                   onClick={() => void handleBan(user)}
//                                   disabled={
//                                     user.id === currentUserId ||
//                                     !!processingUserId
//                                   }
//                                   title={
//                                     user.id === currentUserId
//                                       ? "You cannot ban your own account"
//                                       : "Ban user"
//                                   }
//                                   aria-label={`Ban ${user.name}`}
//                                   className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-30"
//                                 >
//                                   {isProcessing ? (
//                                     <LoaderCircle className="h-4 w-4 animate-spin" />
//                                   ) : (
//                                     <Ban className="h-4 w-4" />
//                                   )}
//                                 </button>
//                               )}

//                               {/* Delete */}
//                               <button
//                                 type="button"
//                                 onClick={() => void handleDelete(user)}
//                                 disabled={
//                                   user.id === currentUserId ||
//                                   !!processingUserId
//                                 }
//                                 title={
//                                   user.id === currentUserId
//                                     ? "You cannot delete your own account"
//                                     : "Delete user"
//                                 }
//                                 aria-label={`Delete ${user.name}`}
//                                 className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}

//                 {users.length === 0 && (
//                   <TableRow>
//                     <TableCell
//                       colSpan={7}
//                       className="py-12 text-center text-slate-500"
//                     >
//                       No users found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
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
//                 onClick={() => setPage((current) => current - 1)}
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
//                 onClick={() => setPage((current) => current + 1)}
//                 className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Create / Edit Modal */}
//       {modalMode && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
//           <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
//               <div>
//                 <h2 className="font-semibold text-slate-900">
//                   {modalMode === "create" ? "Create User" : "Update User"}
//                 </h2>
//                 <p className="mt-1 text-xs text-slate-500">
//                   {modalMode === "create"
//                     ? "Add a new account to your application."
//                     : "Update the user's name, email and role."}
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={closeModal}
//                 disabled={isSaving}
//                 aria-label="Close modal"
//                 className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4 p-5">
//               {/* Name */}
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Full Name
//                 </label>
//                 <input
//                   required
//                   value={form.name}
//                   onChange={(event) =>
//                     setForm((current) => ({
//                       ...current,
//                       name: event.target.value,
//                     }))
//                   }
//                   className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
//                   placeholder="Enter full name"
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Email Address
//                 </label>
//                 <input
//                   required
//                   type="email"
//                   value={form.email}
//                   onChange={(event) =>
//                     setForm((current) => ({
//                       ...current,
//                       email: event.target.value,
//                     }))
//                   }
//                   className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
//                   placeholder="name@example.com"
//                 />
//               </div>

//               {/* Password */}
//               {modalMode === "create" && (
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Temporary Password
//                   </label>
//                   <input
//                     required
//                     type="password"
//                     minLength={8}
//                     autoComplete="new-password"
//                     value={form.password}
//                     onChange={(event) =>
//                       setForm((current) => ({
//                         ...current,
//                         password: event.target.value,
//                       }))
//                     }
//                     className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
//                     placeholder="At least 8 characters"
//                   />
//                 </div>
//               )}

//               {/* Role */}
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                   Role
//                 </label>
//                 <select
//                   value={form.role}
//                   onChange={(event) => {
//                     const selected = event.target.value as UserRole;

//                     if (currentRole === "admin" && selected === "superAdmin") {
//                       return;
//                     }

//                     setForm((current) => ({
//                       ...current,
//                       role: selected,
//                     }));
//                   }}
//                   disabled={isSaving}
//                   className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
//                 >
//                   {availableRoles.map((role) => (
//                     <option key={role.value} value={role.value}>
//                       {role.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Action error */}
//               {actionError && (
//                 <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
//                   {actionError}
//                 </p>
//               )}

//               {/* Footer */}
//               <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   disabled={isSaving}
//                   className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={isSaving}
//                   className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {isSaving && (
//                     <LoaderCircle className="h-4 w-4 animate-spin" />
//                   )}
//                   {modalMode === "create" ? "Create User" : "Save Changes"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
