import { CircleUserRound, Package } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Package className="h-5 w-5" />
          </div>

          <div>
            <div className="font-bold leading-tight">Product Admin</div>

            <div className="text-xs text-slate-500">Management System</div>
          </div>
        </Link>

        {/* Profile */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          title="Profile"
        >
          <CircleUserRound className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
