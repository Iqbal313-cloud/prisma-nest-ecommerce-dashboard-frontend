import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Authentication
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";
import UnauthorizedPage from "./components/auth/UnauthorizedPage";

// Layout
import Layout from "./components/layout/Layout";

// Dashboard
import DashboardHomePage from "./features/dashboard/pages/DashboardPage";

// Admin
import UsersPage from "./components/admin/UsersPage";
import RolesPage from "./components/admin/RolesPage";
import SessionsPage from "./components/admin/SessionsPage";

// Settings
import AccountSettingsPage from "./components/settings/AccountSettingsPage";
import ChangePasswordPage from "./components/settings/ChangePasswordPage";

// Analytics
import AnalyticsDashboard from "./features/analytics/pages/AnalyticsDashboard";
import SalesAnalyticsPage from "./features/analytics/pages/SalesAnalyticsPage";
import OrderAnalyticsPage from "./features/analytics/pages/OrderAnalyticsPage";
import InventoryAnalyticsPage from "./features/analytics/pages/InventoryAnalyticsPage";
import CustomerAnalyticsPage from "./features/analytics/pages/CustomerAnalyticsPage";

// Products
import ProductListPage from "./features/products/pages/ProductListPage";
import ProductCreatePage from "./features/products/pages/ProductCreatePage";
import ProductDetailsPage from "./features/products/pages/ProductDetailsPage";
import ProductEditPage from "./features/products/pages/ProductEditPage";

// Categories
import CategoryListPage from "./features/categories/pages/CategoryListPage";
import CategoryCreatePage from "./features/categories/pages/CategoryCreatePage";
import CategoryDetailsPage from "./features/categories/pages/CategoryDetailsPage";
import CategoryEditPage from "./features/categories/pages/CategoryEditPage";

// Orders
import OrderListPage from "./features/orders/pages/OrderListPage";
import OrderCreatePage from "./features/orders/pages/OrderCreatePage";
import OrderDetailsPage from "./features/orders/pages/OrderDetailsPage";
import OrderEditPage from "./features/orders/pages/OrderEditPage";

// Customers
import CustomerListPage from "./features/customers/pages/CustomerListPage";
import CustomerCreatePage from "./features/customers/pages/CustomerCreatePage";
import CustomerDetailsPage from "./features/customers/pages/CustomerDetailsPage";
import CustomerEditPage from "./features/customers/pages/CustomerEditPage";

// Employees
import EmployeeListPage from "./features/employees/pages/EmployeeListPage";
import EmployeeCreatePage from "./features/employees/pages/EmployeeCreatePage";
import EmployeeDetailsPage from "./features/employees/pages/EmployeeDetailsPage";
import EmployeeEditPage from "./features/employees/pages/EmployeeEditPage";

// Suppliers
import SupplierListPage from "./features/suppliers/pages/SupplierListPage";
import SupplierCreatePage from "./features/suppliers/pages/SupplierCreatePage";
import SupplierDetailsPage from "./features/suppliers/pages/SupplierDetailsPage";
import SupplierEditPage from "./features/suppliers/pages/SupplierEditPage";

// Monitoring
import MonitoringPage from "./features/monitoring/types/pages/MonitoringPage";
import RecentQueriesPage from "./features/monitoring/types/pages/RecentQueriesPage";
import SlowQueriesPage from "./features/monitoring/types/pages/SlowQueriesPage";
import TopQueriesPage from "./features/monitoring/types/pages/TopQueriesPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";

// User Roles
type UserRole =
  | "superAdmin"
  | "admin"
  | "manager"
  | "sales"
  | "accountant"
  | "inventoryManager"
  | "viewer";

// Role Groups
const ALL_ROLES: UserRole[] = [
  "superAdmin",
  "admin",
  "manager",
  "sales",
  "accountant",
  "inventoryManager",
  "viewer",
];

const ADMIN_ROLES: UserRole[] = ["superAdmin", "admin"];

const ANALYTICS_ROLES: UserRole[] = [
  "superAdmin",
  "admin",
  "manager",
  "accountant",
  "viewer",
];

const PRODUCT_READ_ROLES: UserRole[] = [
  "superAdmin",
  "admin",
  "manager",
  "sales",
  "inventoryManager",
  "viewer",
];

const PRODUCT_WRITE_ROLES: UserRole[] = [
  "superAdmin",
  "admin",
  "inventoryManager",
];

const ORDER_WRITE_ROLES: UserRole[] = [
  "superAdmin",
  "admin",
  "manager",
  "sales",
];

const ORDER_READ_ROLES: UserRole[] = [
  ...ORDER_WRITE_ROLES,
  "accountant",
  "viewer",
];

const CUSTOMER_WRITE_ROLES: UserRole[] = [
  "superAdmin",
  "admin",
  "manager",
  "sales",
];

const CUSTOMER_READ_ROLES: UserRole[] = [
  ...CUSTOMER_WRITE_ROLES,
  "accountant",
  "viewer",
];

const EMPLOYEE_READ_ROLES: UserRole[] = [
  "superAdmin",
  "admin",
  "manager",
  "viewer",
];

const SUPPLIER_READ_ROLES: UserRole[] = [
  "superAdmin",
  "admin",
  "manager",
  "inventoryManager",
  "viewer",
];

const SUPPLIER_WRITE_ROLES: UserRole[] = [
  "superAdmin",
  "admin",
  "inventoryManager",
];

const CATEGORY_READ_ROLES: UserRole[] = [
  "superAdmin",
  "admin",
  "manager",
  "inventoryManager",
  "viewer",
];

const CATEGORY_WRITE_ROLES: UserRole[] = [
  "superAdmin",
  "admin",
  "inventoryManager",
];

const MONITORING_READ_ROLES: UserRole[] = [
  "superAdmin",
  "admin",
  "manager",
  "viewer",
];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Authentication Required */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Default Home - All Authenticated Users */}
            <Route path="/" element={<DashboardHomePage />} />

            {/* Account Settings - All Authenticated Users */}
            <Route element={<RoleRoute allowedRoles={ALL_ROLES} />}>
              <Route
                path="/settings/account"
                element={<AccountSettingsPage />}
              />
              <Route
                path="/settings/password"
                element={<ChangePasswordPage />}
              />
            </Route>

            {/* Admin Management */}
            <Route element={<RoleRoute allowedRoles={ADMIN_ROLES} />}>
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/roles" element={<RolesPage />} />
              <Route path="/admin/sessions" element={<SessionsPage />} />
            </Route>

            {/* Analytics - Read Permission */}
            <Route element={<RoleRoute allowedRoles={ANALYTICS_ROLES} />}>
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/analytics/sales" element={<SalesAnalyticsPage />} />
              <Route
                path="/analytics/orders"
                element={<OrderAnalyticsPage />}
              />
              <Route
                path="/analytics/inventory"
                element={<InventoryAnalyticsPage />}
              />
              <Route
                path="/analytics/customers"
                element={<CustomerAnalyticsPage />}
              />
            </Route>

            {/* Products - Read */}
            <Route element={<RoleRoute allowedRoles={PRODUCT_READ_ROLES} />}>
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
            </Route>

            {/* Products - Create / Update */}
            <Route element={<RoleRoute allowedRoles={PRODUCT_WRITE_ROLES} />}>
              <Route path="/products/new" element={<ProductCreatePage />} />
              <Route path="/products/:id/edit" element={<ProductEditPage />} />
            </Route>

            {/* Orders - Read */}
            <Route element={<RoleRoute allowedRoles={ORDER_READ_ROLES} />}>
              <Route path="/orders" element={<OrderListPage />} />
              <Route path="/orders/:id" element={<OrderDetailsPage />} />
            </Route>

            {/* Orders - Create / Update */}
            <Route element={<RoleRoute allowedRoles={ORDER_WRITE_ROLES} />}>
              <Route path="/orders/new" element={<OrderCreatePage />} />
              <Route path="/orders/:id/edit" element={<OrderEditPage />} />
            </Route>

            {/* Customers - Read */}
            <Route element={<RoleRoute allowedRoles={CUSTOMER_READ_ROLES} />}>
              <Route path="/customers" element={<CustomerListPage />} />
              <Route path="/customers/:id" element={<CustomerDetailsPage />} />
            </Route>

            {/* Customers - Create / Update */}
            <Route element={<RoleRoute allowedRoles={CUSTOMER_WRITE_ROLES} />}>
              <Route path="/customers/new" element={<CustomerCreatePage />} />
              <Route
                path="/customers/:id/edit"
                element={<CustomerEditPage />}
              />
            </Route>

            {/* Employees - Read */}
            <Route element={<RoleRoute allowedRoles={EMPLOYEE_READ_ROLES} />}>
              <Route path="/employees" element={<EmployeeListPage />} />
              <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
            </Route>

            {/* Employees - Create / Update */}
            <Route element={<RoleRoute allowedRoles={ADMIN_ROLES} />}>
              <Route path="/employees/new" element={<EmployeeCreatePage />} />
              <Route
                path="/employees/:id/edit"
                element={<EmployeeEditPage />}
              />
            </Route>

            {/* Suppliers - Read */}
            <Route element={<RoleRoute allowedRoles={SUPPLIER_READ_ROLES} />}>
              <Route path="/suppliers" element={<SupplierListPage />} />
              <Route path="/suppliers/:id" element={<SupplierDetailsPage />} />
            </Route>

            {/* Suppliers - Create / Update */}
            <Route element={<RoleRoute allowedRoles={SUPPLIER_WRITE_ROLES} />}>
              <Route path="/suppliers/new" element={<SupplierCreatePage />} />
              <Route
                path="/suppliers/:id/edit"
                element={<SupplierEditPage />}
              />
            </Route>

            {/* Categories - Read */}
            <Route element={<RoleRoute allowedRoles={CATEGORY_READ_ROLES} />}>
              <Route path="/categories" element={<CategoryListPage />} />
              <Route path="/categories/:id" element={<CategoryDetailsPage />} />
            </Route>

            {/* Categories - Create / Update */}
            <Route element={<RoleRoute allowedRoles={CATEGORY_WRITE_ROLES} />}>
              <Route path="/categories/new" element={<CategoryCreatePage />} />
              <Route
                path="/categories/:id/edit"
                element={<CategoryEditPage />}
              />
            </Route>

            {/* Database Monitoring - Read */}
            <Route element={<RoleRoute allowedRoles={MONITORING_READ_ROLES} />}>
              <Route path="/monitoring" element={<MonitoringPage />} />
              <Route
                path="/monitoring/recent-queries"
                element={<RecentQueriesPage />}
              />
              <Route
                path="/monitoring/slow-queries"
                element={<SlowQueriesPage />}
              />
              <Route
                path="/monitoring/top-queries"
                element={<TopQueriesPage />}
              />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
