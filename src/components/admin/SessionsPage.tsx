import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Ban,
  CheckCircle2,
  Clock,
  Laptop,
  Loader2,
  LogOut,
  Monitor,
  RefreshCw,
  Search,
  Shield,
  Smartphone,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

import { authClient, useSession } from "../../lib/auth-client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../common/Table";

import Pagination from "../common/Pagination";
import useDebounce from "@/hooks/useDebounce";

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string | null;
  emailVerified?: boolean;
  banned?: boolean;
  createdAt?: string;
}

interface UserSession {
  id: string;
  token?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  impersonatedBy?: string | null;
}

interface UserListResponse {
  users: AdminUser[];
  total: number;
}

type SessionListResponse =
  | UserSession[]
  | {
      sessions?: UserSession[];
    }
  | null;

type Message = {
  type: "success" | "error";
  text: string;
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const formatDate = (date?: string) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString();
};

const getDeviceName = (userAgent?: string | null) => {
  if (!userAgent) return "Unknown device";

  if (/iPhone/i.test(userAgent)) return "iPhone";
  if (/iPad/i.test(userAgent)) return "iPad";
  if (/Android/i.test(userAgent)) return "Android device";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Macintosh|Mac OS/i.test(userAgent)) return "Mac";
  if (/Linux/i.test(userAgent)) return "Linux";

  return "Unknown device";
};

const getBrowserName = (userAgent?: string | null) => {
  if (!userAgent) return "Unknown browser";

  if (/Edg/i.test(userAgent)) return "Microsoft Edge";
  if (/OPR|Opera/i.test(userAgent)) return "Opera";
  if (/Chrome/i.test(userAgent)) return "Google Chrome";
  if (/Firefox/i.test(userAgent)) return "Mozilla Firefox";
  if (/Safari/i.test(userAgent)) return "Safari";

  return "Unknown browser";
};

const getDeviceIcon = (userAgent?: string | null) => {
  if (!userAgent) return Monitor;

  if (/Mobile|Android|iPhone/i.test(userAgent)) {
    return Smartphone;
  }

  return Laptop;
};

const getRoleStyle = (role?: string) => {
  const styles: Record<string, string> = {
    superAdmin: "bg-violet-100 text-violet-800 ring-violet-300",
    admin: "bg-rose-100 text-rose-800 ring-rose-300",
    manager: "bg-sky-100 text-sky-800 ring-sky-300",
    inventoryManager: "bg-indigo-100 text-indigo-800 ring-indigo-300",
    accountant: "bg-emerald-100 text-emerald-800 ring-emerald-300",
    sales: "bg-amber-100 text-amber-800 ring-amber-300",
    viewer: "bg-slate-100 text-slate-700 ring-slate-300",
  };

  return styles[role || ""] || "bg-gray-100 text-gray-700 ring-gray-300";
};

const getErrorMessage = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function SessionsPage() {
  const { data: currentSession, isPending: isSessionPending } = useSession();

  const currentUserId = currentSession?.user?.id;
  const currentUserRole = currentSession?.user?.role;

  // ---------------------------------------------------------------------------
  // Users state
  // ---------------------------------------------------------------------------

  const [users, setUsers] = useState<AdminUser[]>([]);

  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400).trim();

  const [totalUsers, setTotalUsers] = useState(0);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Prevent older requests from overwriting newer results.
  const usersRequestId = useRef(0);
  const sessionsRequestId = useRef(0);

  // ---------------------------------------------------------------------------
  // Selected user / sessions state
  // ---------------------------------------------------------------------------

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);

  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionActionLoading, setSessionActionLoading] = useState(false);

  const [message, setMessage] = useState<Message | null>(null);

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

  const lastPage = Math.max(1, Math.ceil(totalUsers / limit));

  // ---------------------------------------------------------------------------
  // Selected user derived values
  // ---------------------------------------------------------------------------

  const selectedUserId = selectedUser?.id;

  const isManagingOwnSessions =
    Boolean(selectedUserId) && selectedUserId === currentUserId;

  const canImpersonateSelectedUser = useMemo(() => {
    if (!selectedUser || !currentUserRole) return false;

    if (selectedUser.id === currentUserId || selectedUser.banned) {
      return false;
    }

    if (currentUserRole === "superAdmin") {
      return selectedUser.role !== "superAdmin";
    }

    if (currentUserRole === "admin") {
      return (
        selectedUser.role !== "admin" && selectedUser.role !== "superAdmin"
      );
    }

    return false;
  }, [selectedUser, currentUserRole, currentUserId]);

  const activeSessions = useMemo(() => {
    const now = Date.now();

    return sessions.filter(
      (session) => new Date(session.expiresAt).getTime() > now,
    );
  }, [sessions]);

  const expiredSessions = useMemo(() => {
    const now = Date.now();

    return sessions.filter(
      (session) => new Date(session.expiresAt).getTime() <= now,
    );
  }, [sessions]);

  // ---------------------------------------------------------------------------
  // Fetch users - Server-side pagination and search
  // ---------------------------------------------------------------------------

  const fetchUsers = useCallback(async () => {
    const requestId = ++usersRequestId.current;

    setLoadingUsers(true);

    try {
      const offset = (page - 1) * limit;

      const result = await authClient.admin.listUsers({
        query: {
          limit,
          offset,
          sortBy: "name",
          sortDirection: "asc",
          ...(debouncedSearch
            ? {
                searchValue: debouncedSearch,
                searchField: "name",
                searchOperator: "contains",
              }
            : {}),
        },
      });

      if (result.error) {
        throw result.error;
      }

      const response = result.data as unknown as UserListResponse;

      // Ignore stale responses.
      if (requestId !== usersRequestId.current) return;

      setUsers(response?.users ?? []);
      setTotalUsers(response?.total ?? 0);
    } catch (error) {
      if (requestId !== usersRequestId.current) return;

      setUsers([]);
      setTotalUsers(0);

      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      if (requestId === usersRequestId.current) {
        setLoadingUsers(false);
      }
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    void fetchUsers();

    return () => {
      usersRequestId.current++;
    };
  }, [fetchUsers]);

  // ---------------------------------------------------------------------------
  // Search / pagination handlers
  // ---------------------------------------------------------------------------

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(DEFAULT_PAGE);
    setSelectedUser(null);
    setSessions([]);
    setMessage(null);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    setSelectedUser(null);
    setSessions([]);
  };

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(DEFAULT_PAGE);
    setSelectedUser(null);
    setSessions([]);
  };

  // ---------------------------------------------------------------------------
  // Fetch selected user's sessions
  // ---------------------------------------------------------------------------

  const fetchSessions = useCallback(async (userId: string) => {
    const requestId = ++sessionsRequestId.current;

    setLoadingSessions(true);
    setSessions([]);

    try {
      const result = await authClient.admin.listUserSessions({
        userId,
      });

      if (result.error) {
        throw result.error;
      }

      const response = result.data as unknown as SessionListResponse;

      const sessionList = Array.isArray(response)
        ? response
        : (response?.sessions ?? []);

      if (requestId !== sessionsRequestId.current) return;

      setSessions(sessionList);
    } catch (error) {
      if (requestId !== sessionsRequestId.current) return;

      setSessions([]);

      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      if (requestId === sessionsRequestId.current) {
        setLoadingSessions(false);
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Select user
  // ---------------------------------------------------------------------------

  const handleViewSessions = async (user: AdminUser) => {
    setMessage(null);
    setSelectedUser(user);

    await fetchSessions(user.id);
  };

  const handleBackToUsers = () => {
    sessionsRequestId.current++;

    setSelectedUser(null);
    setSessions([]);
    setLoadingSessions(false);
    setMessage(null);
  };

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------

  const handleRefresh = async () => {
    setRefreshing(true);
    setMessage(null);

    try {
      await fetchUsers();

      if (selectedUserId) {
        await fetchSessions(selectedUserId);
      }
    } finally {
      setRefreshing(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Revoke single session
  // ---------------------------------------------------------------------------

  const handleRevokeSession = async (session: UserSession) => {
    if (!selectedUserId || !session.token || isManagingOwnSessions) return;

    const confirmed = window.confirm(
      "Are you sure you want to revoke this session?",
    );

    if (!confirmed) return;

    setSessionActionLoading(true);
    setMessage(null);

    try {
      const result = await authClient.admin.revokeUserSession({
        sessionToken: session.token,
      });

      if (result.error) throw result.error;

      setMessage({
        type: "success",
        text: "Session revoked successfully.",
      });

      await fetchSessions(selectedUserId);
    } catch (error) {
      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setSessionActionLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Revoke all sessions
  // ---------------------------------------------------------------------------

  const handleRevokeAllSessions = async () => {
    if (!selectedUserId) return;

    if (isManagingOwnSessions) {
      setMessage({
        type: "error",
        text: "You cannot revoke all sessions of your own account from here.",
      });
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to revoke all sessions for ${selectedUser?.name}?`,
    );

    if (!confirmed) return;

    setSessionActionLoading(true);
    setMessage(null);

    try {
      const result = await authClient.admin.revokeUserSessions({
        userId: selectedUserId,
      });

      if (result.error) throw result.error;

      setMessage({
        type: "success",
        text: "All user sessions revoked successfully.",
      });

      await fetchSessions(selectedUserId);
    } catch (error) {
      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setSessionActionLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Impersonation
  // ---------------------------------------------------------------------------

  const handleImpersonate = async () => {
    if (!selectedUserId || !selectedUser) return;

    if (!canImpersonateSelectedUser) {
      setMessage({
        type: "error",
        text: "You are not allowed to impersonate this user.",
      });
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to impersonate ${selectedUser.name}?`,
    );

    if (!confirmed) return;

    setSessionActionLoading(true);
    setMessage(null);

    try {
      const result = await authClient.admin.impersonateUser({
        userId: selectedUserId,
      });

      if (result.error) throw result.error;

      window.location.href = "/";
    } catch (error) {
      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });

      setSessionActionLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (isSessionPending) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Session Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage user sessions and impersonation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing || loadingUsers}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Feedback */}

      {message && (
        <div
          className={`flex items-start gap-3 rounded-lg border p-4 ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}

          <p className="text-sm">{message.text}</p>

          <button
            type="button"
            onClick={() => setMessage(null)}
            className="ml-auto"
            aria-label="Dismiss message"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <Users className="h-5 w-5 text-blue-500" />
          </div>

          <p className="mt-3 text-2xl font-semibold text-gray-900">
            {totalUsers}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {debouncedSearch ? "Matching Users" : "All Registered Users"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Active Sessions</p>
            <Activity className="h-5 w-5 text-green-500" />
          </div>

          <p className="mt-3 text-2xl font-semibold text-gray-900">
            {selectedUser ? activeSessions.length : "—"}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {selectedUser
              ? `For ${selectedUser.name}`
              : "Select a user to view sessions"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Expired Sessions
            </p>
            <Clock className="h-5 w-5 text-orange-500" />
          </div>

          <p className="mt-3 text-2xl font-semibold text-gray-900">
            {selectedUser ? expiredSessions.length : "—"}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {selectedUser
              ? `For ${selectedUser.name}`
              : "Select a user to view sessions"}
          </p>
        </div>
      </div>

      {/* Users */}

      {!selectedUser && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Users</h2>

              <p className="mt-1 text-sm text-gray-500">
                Select a user to manage their sessions.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search by name..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loadingUsers ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                            <UserRound className="h-4 w-4" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900">
                            {user.name}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ${getRoleStyle(user.role)}`}
                      >
                        {user.role || "user"}
                      </span>
                    </TableCell>

                    <TableCell>
                      {user.emailVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <XCircle className="h-4 w-4" />
                          Not verified
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {user.banned ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                          <Ban className="h-3 w-3" />
                          Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => handleViewSessions(user)}
                        className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-100"
                      >
                        <Monitor className="h-3.5 w-3.5" />
                        View Sessions
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}

          <div className="border-t border-gray-200 p-4">
            <Pagination
              page={page}
              lastPage={lastPage}
              total={totalUsers}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              isFetching={loadingUsers}
            />
          </div>
        </div>
      )}

      {/* Selected user sessions */}

      {selectedUser && (
        <div className="space-y-5">
          {/* Selected user header */}

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={handleBackToUsers}
                  className="mt-1 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Back to users"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                {selectedUser.image ? (
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <UserRound className="h-6 w-6" />
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedUser.name}
                  </h2>

                  <p className="text-sm text-gray-500">{selectedUser.email}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-medium capitalize ring-1 ${getRoleStyle(selectedUser.role)}`}
                    >
                      {selectedUser.role || "user"}
                    </span>

                    {isManagingOwnSessions && (
                      <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        Your account
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {!isManagingOwnSessions && (
                  <>
                    <button
                      type="button"
                      onClick={handleImpersonate}
                      disabled={
                        sessionActionLoading || !canImpersonateSelectedUser
                      }
                      title={
                        !canImpersonateSelectedUser
                          ? "You are not allowed to impersonate this user"
                          : "Impersonate user"
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Shield className="h-4 w-4" />
                      Impersonate
                    </button>

                    <button
                      type="button"
                      onClick={handleRevokeAllSessions}
                      disabled={
                        sessionActionLoading ||
                        loadingSessions ||
                        sessions.length === 0
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <LogOut className="h-4 w-4" />
                      Revoke All
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sessions table */}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex flex-col gap-2 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  User Sessions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Sessions associated with this account.
                </p>
              </div>

              <span className="text-sm text-gray-500">
                {sessions.length} session
                {sessions.length !== 1 ? "s" : ""}
              </span>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device / Browser</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loadingSessions ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading sessions...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sessions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-sm text-gray-500"
                    >
                      No sessions found for this user.
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => {
                    const DeviceIcon = getDeviceIcon(session.userAgent);

                    const isExpired =
                      new Date(session.expiresAt).getTime() <= Date.now();

                    return (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                              <DeviceIcon className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <p className="font-medium text-gray-900">
                                {getDeviceName(session.userAgent)}
                              </p>

                              <p className="text-xs text-gray-500">
                                {getBrowserName(session.userAgent)}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-sm text-gray-600">
                          {session.ipAddress || "Unknown"}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-sm text-gray-500">
                          {formatDate(session.createdAt)}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-sm text-gray-500">
                          {formatDate(session.expiresAt)}
                        </TableCell>

                        <TableCell>
                          {isExpired ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                              <Clock className="h-3 w-3" />
                              Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                              <CheckCircle2 className="h-3 w-3" />
                              Not expired
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <button
                            type="button"
                            onClick={() => handleRevokeSession(session)}
                            disabled={
                              sessionActionLoading ||
                              !session.token ||
                              isManagingOwnSessions
                            }
                            title={
                              !session.token
                                ? "Session token is unavailable"
                                : isManagingOwnSessions
                                  ? "You cannot revoke your own session here"
                                  : "Revoke session"
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            Revoke
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Session information */}

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>
                <p className="text-sm font-medium text-blue-900">
                  Session security
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  Revoking a session signs out the associated session. Session
                  management and impersonation must also be protected by
                  server-side Better Auth permissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
