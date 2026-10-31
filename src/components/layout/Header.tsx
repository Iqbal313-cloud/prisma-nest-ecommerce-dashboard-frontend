import { useState } from "react";
import {
  LogOut,
  Package,
  ShieldCheck,
  Settings,
  ChevronDown,
  LockKeyhole,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signOut, useSession } from "../../lib/auth-client";

export default function Header() {
  const navigate = useNavigate();
  const { data: session } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userRole = session?.user?.role || "User";

  const handleLogout = async () => {
    try {
      const result = await signOut();

      if (result.error) {
        console.error("Logout failed:", result.error.message);
        return;
      }

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

        {/* User Profile Dropdown */}
        <div className="relative flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-slate-600" />

            <span className="text-sm font-medium capitalize text-slate-700">
              {userRole}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-label="Open profile menu"
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <span className="font-medium">My Account</span>

            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              <Link
                to="/settings/account"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <Settings className="h-4 w-4 text-slate-500" />
                Account Settings
              </Link>

              <Link
                to="/settings/password"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <LockKeyhole className="h-4 w-4 text-slate-500" />
                Change Password
              </Link>

              <div className="border-t border-slate-100" />

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  void handleLogout();
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
