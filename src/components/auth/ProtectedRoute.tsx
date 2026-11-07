import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../../lib/auth-client";

export default function ProtectedRoute() {
  const { data: session, isPending } = useSession();
  const location = useLocation();

  // Session loading
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  // User is not authenticated
  if (!session?.user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Authenticated user
  return <Outlet />;
}
