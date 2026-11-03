// import { useEffect, useRef, useState } from "react";
// import {
//   LogOut,
//   Package,
//   ShieldCheck,
//   Settings,
//   ChevronDown,
//   LockKeyhole,
//   UserRound,
//   Mail,
//   Hash,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { signOut, useSession } from "../../lib/auth-client";

// export default function Header() {
//   const navigate = useNavigate();
//   const { data: session } = useSession();

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const user = session?.user;
//   const userRole = user?.role || "User";

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsMenuOpen(false);
//       }
//     }

//     function handleEscape(event: KeyboardEvent) {
//       if (event.key === "Escape") {
//         setIsMenuOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEscape);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const result = await signOut();

//       if (result.error) {
//         console.error("Logout failed:", result.error.message);
//         return;
//       }

//       navigate("/login", { replace: true });
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <header className="sticky top-0 z-50 h-16 bg-white">
//       <div className="flex h-full items-center justify-between px-4 sm:px-6">
//         {/* Brand */}
//         <Link to="/" className="flex items-center gap-2">
//           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
//             <Package className="h-5 w-5" />
//           </div>

//           <div>
//             <div className="font-bold leading-tight">Product Admin</div>
//             <div className="text-xs text-slate-500">Management System</div>
//           </div>
//         </Link>

//         {/* User Profile Dropdown */}
//         <div ref={menuRef} className="relative flex items-center gap-3">
//           <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
//             <ShieldCheck className="h-4 w-4 text-slate-600" />

//             <span className="text-sm font-medium capitalize text-slate-700">
//               {userRole}
//             </span>
//           </div>

//           <button
//             type="button"
//             onClick={() => setIsMenuOpen((prev) => !prev)}
//             aria-expanded={isMenuOpen}
//             aria-haspopup="true"
//             aria-label="Open profile menu"
//             className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 transition hover:bg-slate-50"
//           >
//             <span className="font-medium">My Account</span>

//             <ChevronDown
//               className={`h-4 w-4 transition-transform ${
//                 isMenuOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {isMenuOpen && (
//             <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
//               {/* User Information */}
//               <div className="border-b border-slate-100 px-4 py-4">
//                 <div className="mb-3 flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
//                     <UserRound className="h-5 w-5 text-slate-600" />
//                   </div>

//                   <div className="min-w-0">
//                     <p className="truncate text-sm font-semibold text-slate-900">
//                       {user?.name || "User"}
//                     </p>
//                     <p className="truncate text-xs text-slate-500">
//                       {user?.email}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="space-y-2 text-xs text-slate-500">
//                   <div className="flex items-center gap-2">
//                     <Hash className="h-3.5 w-3.5" />
//                     <span className="truncate">ID: {user?.id}</span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <ShieldCheck className="h-3.5 w-3.5" />
//                     <span className="capitalize">Role: {userRole}</span>
//                   </div>
//                 </div>
//               </div>

//               <Link
//                 to="/settings/account"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
//               >
//                 <Settings className="h-4 w-4 text-slate-500" />
//                 Account Settings
//               </Link>

//               <Link
//                 to="/settings/password"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
//               >
//                 <LockKeyhole className="h-4 w-4 text-slate-500" />
//                 Change Password
//               </Link>

//               <div className="border-t border-slate-100" />

//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsMenuOpen(false);
//                   void handleLogout();
//                 }}
//                 className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
//               >
//                 <LogOut className="h-4 w-4" />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

import { useEffect, useRef, useState } from "react";

import {
  LogOut,
  Package,
  ShieldCheck,
  Settings,
  ChevronDown,
  LockKeyhole,
  UserRound,
  Hash,
  ShieldAlert,
  Loader2,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { authClient, signOut, useSession } from "../../lib/auth-client";

export default function Header() {
  const navigate = useNavigate();
  const { data: session } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sessionActionLoading, setSessionActionLoading] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const userRole = user?.role || "User";

  const isImpersonating = Boolean(
    (session?.session as { impersonatedBy?: string | null } | undefined)
      ?.impersonatedBy,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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

  const handleStopImpersonating = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to stop impersonating?",
    );

    if (!confirmed) return;

    setSessionActionLoading(true);

    try {
      const result = await authClient.admin.stopImpersonating();

      if (result.error) {
        throw result.error;
      }

      window.location.replace("/admin/sessions");
    } catch (error) {
      console.error("Failed to stop impersonating:", error);
      setSessionActionLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Global Impersonation Warning */}
      {isImpersonating && (
        <div className="border-b border-amber-300 bg-amber-50">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <ShieldAlert className="h-5 w-5 text-amber-700" />
              </div>

              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Impersonation is active
                </p>

                <p className="text-xs text-amber-700">
                  You are currently using another user's account.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStopImpersonating}
              disabled={sessionActionLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sessionActionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}

              {sessionActionLoading ? "Stopping..." : "Stop impersonating"}
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="h-16 bg-white">
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
          <div ref={menuRef} className="relative flex items-center gap-3">
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
              aria-haspopup="true"
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
              <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {/* User Information */}
                <div className="border-b border-slate-100 px-4 py-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                      <UserRound className="h-5 w-5 text-slate-600" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user?.name || "User"}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5" />

                      <span className="truncate">ID: {user?.id}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5" />

                      <span className="capitalize">Role: {userRole}</span>
                    </div>
                  </div>
                </div>

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
      </div>
    </header>
  );
}
