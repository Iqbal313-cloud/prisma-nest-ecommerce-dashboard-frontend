// import { Navigate, Outlet } from "react-router-dom";
// import { useSession } from "../../lib/auth-client";

// interface RoleRouteProps {
//   allowedRoles: string[];
// }

// export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
//   const { data: session, isPending } = useSession();

//   if (isPending) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <p className="text-sm text-slate-500">Checking permissions...</p>
//       </div>
//     );
//   }

//   if (!session?.user) {
//     return <Navigate to="/login" replace />;
//   }

//   const userRole = session.user.role;

//   if (!userRole || !allowedRoles.includes(userRole)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <Outlet />;
// }

import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../../lib/auth-client";

export type UserRole =
  | "superAdmin"
  | "admin"
  | "manager"
  | "sales"
  | "accountant"
  | "inventoryManager"
  | "viewer";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Checking permissions...</p>
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = session.user.role;

  console.log("RoleRoute Debug:", {
    user: session.user,
    userRole,
    allowedRoles,
    isPending,
  });

  if (!userRole || !allowedRoles.includes(userRole as UserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
