import { ShieldX } from "lucide-react";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <ShieldX className="h-16 w-16 text-red-500" />

      <h1 className="mt-5 text-2xl font-bold text-slate-900">Access Denied</h1>

      <p className="mt-2 text-sm text-slate-500">
        You don't have permission to access this page.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
