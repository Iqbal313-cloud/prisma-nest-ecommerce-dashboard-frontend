import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRightLeft,
  CheckCircle2,
  Clock3,
  Globe2,
  Laptop,
  LoaderCircle,
  LogOut,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";
import { authClient, useSession } from "../../lib/auth-client";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface UserSession {
  id: string;
  token: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  impersonatedBy?: string | null;
}

type SessionListResponse = UserSession[] | { sessions?: UserSession[] } | null;

export default function SessionsPage() {
  const { data: currentSession, isPending: sessionPending } = useSession();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isImpersonating = Boolean(currentSession?.session?.impersonatedBy);
  const currentUserId = currentSession?.user?.id;
  const selectedUser = users.find((user) => user.id === selectedUserId);
  const isManagingOwnSessions = selectedUserId === currentUserId;

  const activeSessions = useMemo(
    () =>
      sessions.filter(
        (session) => new Date(session.expiresAt).getTime() > Date.now(),
      ),
    [sessions],
  );

  const expiredSessions = sessions.length - activeSessions.length;

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown";
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const getDeviceName = (userAgent?: string | null) => {
    if (!userAgent) return "Unknown device";
    if (/iPhone|iPad|Android|Mobile/i.test(userAgent)) return "Mobile device";
    if (/Windows/i.test(userAgent)) return "Windows device";
    if (/Macintosh|Mac OS/i.test(userAgent)) return "Mac device";
    if (/Linux/i.test(userAgent)) return "Linux device";
    return "Desktop / browser";
  };

  const getBrowserName = (userAgent?: string | null) => {
    if (!userAgent) return "Browser information unavailable";
    if (/Edg\//i.test(userAgent)) return "Microsoft Edge";
    if (/OPR\//i.test(userAgent)) return "Opera";
    if (/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent))
      return "Google Chrome";
    if (/Firefox\//i.test(userAgent)) return "Mozilla Firefox";
    if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent))
      return "Safari";
    return "Browser";
  };

  // Load the user list available to the admin.
  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoadingUsers(true);
      setError("");

      try {
        const result = await authClient.admin.listUsers({
          query: {
            limit: 100,
            sortBy: "name",
            sortDirection: "asc",
          },
        });

        if (result.error) throw new Error(result.error.message);

        if (!cancelled) {
          const list = (result.data?.users ?? []) as AdminUser[];
          setUsers(list);
          setSelectedUserId((current) => {
            if (current && list.some((user) => user.id === current))
              return current;
            return list[0]?.id ?? "";
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load users.",
          );
        }
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    }

    void loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load sessions for the selected user.
  const fetchSessions = useCallback(async (userId: string) => {
    if (!userId) {
      setSessions([]);
      return;
    }

    setLoadingSessions(true);
    setError("");

    try {
      const result = await authClient.admin.listUserSessions({ userId });
      if (result.error) throw new Error(result.error.message);

      const response = result.data as SessionListResponse;
      const list = Array.isArray(response)
        ? response
        : (response?.sessions ?? []);
      setSessions(list);
    } catch (err) {
      setSessions([]);
      setError(err instanceof Error ? err.message : "Failed to load sessions.");
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    void fetchSessions(selectedUserId);
  }, [selectedUserId, fetchSessions]);

  const runSessionAction = async (
    action: () => Promise<{ error?: { message: string } | null }>,
    successMessage: string,
  ) => {
    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await action();
      if (result.error) throw new Error(result.error.message);

      setSuccess(successMessage);
      await fetchSessions(selectedUserId);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The action could not be completed.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeSession = async (session: UserSession) => {
    if (!session.token) {
      setError("This session does not contain a revocation token.");
      return;
    }

    const confirmed = window.confirm(
      "Revoke this session? The device using it will need to sign in again.",
    );
    if (!confirmed) return;

    await runSessionAction(
      () => authClient.admin.revokeUserSession({ sessionToken: session.token }),
      "Session revoked successfully.",
    );
  };

  const handleRevokeAllSessions = async () => {
    if (!selectedUserId || sessions.length === 0) return;

    if (isManagingOwnSessions) {
      setError(
        "For safety, this page will not revoke your own admin sessions. Use the account sign-out option instead.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Revoke all sessions for ${selectedUser?.name ?? "this user"}? All their signed-in devices will need to sign in again.`,
    );
    if (!confirmed) return;

    await runSessionAction(
      () => authClient.admin.revokeUserSessions({ userId: selectedUserId }),
      "All sessions for this user were revoked.",
    );
  };

  const handleImpersonate = async () => {
    if (!selectedUserId || !selectedUser) return;

    if (selectedUser.id === currentUserId) {
      setError("You cannot impersonate your own account.");
      return;
    }

    if (selectedUser.role === "admin") {
      setError("Impersonation of another admin is disabled in this interface.");
      return;
    }

    if (isImpersonating) {
      setError("Stop the current impersonation before starting another one.");
      return;
    }

    const confirmed = window.confirm(
      `Start an impersonation session as ${selectedUser.name}? Actions will be performed with that user's permissions.`,
    );
    if (!confirmed) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await authClient.admin.impersonateUser({
        userId: selectedUserId,
      });

      if (result.error) throw new Error(result.error.message);

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to impersonate user.",
      );
      setActionLoading(false);
    }
  };

  const handleStopImpersonating = async () => {
    const confirmed = window.confirm(
      "Stop impersonating and return to your admin account?",
    );
    if (!confirmed) return;

    setActionLoading(true);
    setError("");

    try {
      const result = await authClient.admin.stopImpersonating();
      if (result.error) throw new Error(result.error.message);
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to stop impersonating.",
      );
      setActionLoading(false);
    }
  };

  if (sessionPending) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        Checking your session...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700">
            <ShieldCheck className="h-4 w-4" />
            Administration
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Session Management
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Monitor user sign-ins, revoke sessions and manage support
            impersonation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void fetchSessions(selectedUserId)}
          disabled={!selectedUserId || loadingSessions || actionLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loadingSessions ? "animate-spin" : ""}`}
          />
          Refresh sessions
        </button>
      </header>

      {isImpersonating && (
        <section className="flex flex-col justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
          <div className="flex gap-3">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-amber-900">
                Impersonation is active
              </p>
              <p className="mt-0.5 text-sm text-amber-800">
                You are currently acting as another user. Stop impersonation to
                return to your admin account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void handleStopImpersonating()}
            disabled={actionLoading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:opacity-50"
          >
            {actionLoading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            Stop impersonating
          </button>
        </section>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto"
            aria-label="Dismiss error"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            className="ml-auto"
            aria-label="Dismiss success"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Choose a user</h2>
            <p className="text-xs text-slate-500">
              Select whose sessions you want to manage.
            </p>
          </div>
        </div>

        {loadingUsers ? (
          <div className="flex items-center gap-2 py-3 text-sm text-slate-500">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Loading users...
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-end">
            <div>
              <label
                htmlFor="session-user"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                User account
              </label>
              <select
                id="session-user"
                value={selectedUserId}
                onChange={(event) => {
                  setSelectedUserId(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {selectedUser ? (
              <div className="flex flex-col justify-between gap-3 rounded-lg bg-slate-50 p-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {selectedUser.name?.charAt(0)?.toUpperCase() || (
                      <UserRound className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {selectedUser.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {selectedUser.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium capitalize text-slate-600 ring-1 ring-slate-200">
                    {selectedUser.role ?? "user"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void handleImpersonate()}
                    disabled={
                      actionLoading ||
                      isImpersonating ||
                      selectedUser.role === "admin" ||
                      selectedUser.id === currentUserId
                    }
                    title={
                      selectedUser.id === currentUserId
                        ? "You cannot impersonate yourself"
                        : selectedUser.role === "admin"
                          ? "Admin impersonation is disabled"
                          : "Sign in as this user"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    Impersonate
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleRevokeAllSessions()}
                    disabled={
                      actionLoading ||
                      sessions.length === 0 ||
                      isManagingOwnSessions
                    }
                    title={
                      isManagingOwnSessions
                        ? "Bulk revocation of your own sessions is blocked"
                        : "Revoke every session for this user"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Revoke all
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Select an account to view its sessions.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total sessions</p>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {loadingSessions ? "—" : sessions.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Returned for selected user
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Not expired</p>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {loadingSessions ? "—" : activeSessions.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Based on session expiry time
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Expired</p>
            <Clock3 className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {loadingSessions ? "—" : expiredSessions}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Still returned by the API
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">User sessions</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Device, IP address, sign-in time and session expiry.
            </p>
          </div>
          {selectedUser && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <UserRound className="h-3.5 w-3.5" />
              {selectedUser.name}
            </span>
          )}
        </div>

        {loadingSessions ? (
          <div className="flex min-h-52 items-center justify-center gap-2 text-sm text-slate-500">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Loading sessions...
          </div>
        ) : !selectedUserId ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-700">
              No user selected
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Choose a user above to inspect their sessions.
            </p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldAlert className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-700">
              No sessions found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              This user has no sessions returned by the server.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sessions.map((session) => {
              const expired =
                new Date(session.expiresAt).getTime() <= Date.now();
              const deviceName = getDeviceName(session.userAgent);

              return (
                <article
                  key={session.id}
                  className="flex flex-col justify-between gap-4 p-5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      {/Mobile/i.test(deviceName) ? (
                        <Smartphone className="h-5 w-5" />
                      ) : (
                        <Laptop className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {deviceName}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${expired ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}
                        >
                          {expired ? "Expired" : "Not expired"}
                        </span>
                        {session.impersonatedBy && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                            Impersonated
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-500">
                        {getBrowserName(session.userAgent)}
                      </p>

                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Globe2 className="h-3.5 w-3.5" />
                          IP: {session.ipAddress || "Not available"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5" />
                          Created: {formatDate(session.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5" />
                          Expires: {formatDate(session.expiresAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleRevokeSession(session)}
                    disabled={actionLoading || !session.token || expired}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {actionLoading ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    Revoke session
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/70 p-4 text-xs leading-5 text-blue-800">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Session controls depend on the Better Auth admin plugin and backend
          permissions. Revoking a session signs that user out from the affected
          device. Impersonation should only be used for authorized support and
          troubleshooting.
        </p>
      </div>
    </div>
  );
}
