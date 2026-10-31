import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import ProductListPage from "./features/products/pages/ProductListPage";
import ProductCreatePage from "./features/products/pages/ProductCreatePage";
import ProductDetailsPage from "./features/products/pages/ProductDetailsPage";
import ProductEditPage from "./features/products/pages/ProductEditPage";
import OrderListPage from "./features/orders/pages/OrderListPage";
import OrderCreatePage from "./features/orders/pages/OrderCreatePage";
import OrderEditPage from "./features/orders/pages/OrderEditPage";
import OrderDetailsPage from "./features/orders/pages/OrderDetailsPage";
import CustomerListPage from "./features/customers/pages/CustomerListPage";
import CustomerCreatePage from "./features/customers/pages/CustomerCreatePage";
import CustomerDetailsPage from "./features/customers/pages/CustomerDetailsPage";
import CustomerEditPage from "./features/customers/pages/CustomerEditPage";
import EmployeeListPage from "./features/employees/pages/EmployeeListPage";
import EmployeeCreatePage from "./features/employees/pages/EmployeeCreatePage";
import EmployeeDetailsPage from "./features/employees/pages/EmployeeDetailsPage";
import EmployeeEditPage from "./features/employees/pages/EmployeeEditPage";
import SupplierListPage from "./features/suppliers/pages/SupplierListPage";
import SupplierCreatePage from "./features/suppliers/pages/SupplierCreatePage";
import SupplierDetailsPage from "./features/suppliers/pages/SupplierDetailsPage";
import SupplierEditPage from "./features/suppliers/pages/SupplierEditPage";
import CategoryListPage from "./features/categories/pages/CategoryListPage";
import CategoryCreatePage from "./features/categories/pages/CategoryCreatePage";
import CategoryDetailsPage from "./features/categories/pages/CategoryDetailsPage";
import CategoryEditPage from "./features/categories/pages/CategoryEditPage";
import SalesAnalyticsPage from "./features/analytics/pages/SalesAnalyticsPage";
import OrderAnalyticsPage from "./features/analytics/pages/OrderAnalyticsPage";
import InventoryAnalyticsPage from "./features/analytics/pages/InventoryAnalyticsPage";
import CustomerAnalyticsPage from "./features/analytics/pages/CustomerAnalyticsPage";
import AnalyticsDashboard from "./features/analytics/pages/AnalyticsDashboard";
import MonitoringPage from "./features/monitoring/types/pages/MonitoringPage";
import RecentQueriesPage from "./features/monitoring/types/pages/RecentQueriesPage";
import SlowQueriesPage from "./features/monitoring/types/pages/SlowQueriesPage";
import TopQueriesPage from "./features/monitoring/types/pages/TopQueriesPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import RoleRoute from "./components/auth/RoleRoute";
import UnauthorizedPage from "./components/auth/UnauthorizedPage";
import UsersPage from "./components/admin/UsersPage";
import RolesPage from "./components/admin/RolesPage";
import SessionsPage from "./components/admin/SessionsPage";
import AccountSettingsPage from "./components/settings/AccountSettingsPage";
import ChangePasswordPage from "./components/settings/ChangePasswordPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Authentication Required */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/settings/account" element={<AccountSettingsPage />} />
            <Route path="/settings/password" element={<ChangePasswordPage />} />
            {/* ================================= */}
            {/* Analytics - All Authenticated Users */}
            {/* ================================= */}

            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/roles" element={<RolesPage />} />
              <Route path="/admin/sessions" element={<SessionsPage />} />
            </Route>
            <Route
              element={
                <RoleRoute allowedRoles={["admin", "manager", "sales"]} />
              }
            >
              <Route path="/" element={<AnalyticsDashboard />} />
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

            {/* ================================= */}
            {/* Products */}
            {/* Admin: Full Access */}
            {/* Manager/Sales: Read Only */}
            {/* ================================= */}
            <Route
              element={
                <RoleRoute allowedRoles={["admin", "manager", "sales"]} />
              }
            >
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/products/new" element={<ProductCreatePage />} />
              <Route path="/products/:id/edit" element={<ProductEditPage />} />
            </Route>

            {/* ================================= */}
            {/* Orders */}
            {/* All Roles: Create, Read, Update */}
            {/* ================================= */}
            <Route
              element={
                <RoleRoute allowedRoles={["admin", "manager", "sales"]} />
              }
            >
              <Route path="/orders" element={<OrderListPage />} />
              <Route path="/orders/new" element={<OrderCreatePage />} />
              <Route path="/orders/:id" element={<OrderDetailsPage />} />
              <Route path="/orders/:id/edit" element={<OrderEditPage />} />
            </Route>

            {/* ================================= */}
            {/* Customers */}
            {/* All Roles: Create, Read, Update */}
            {/* ================================= */}
            <Route
              element={
                <RoleRoute allowedRoles={["admin", "manager", "sales"]} />
              }
            >
              <Route path="/customers" element={<CustomerListPage />} />
              <Route path="/customers/new" element={<CustomerCreatePage />} />
              <Route path="/customers/:id" element={<CustomerDetailsPage />} />
              <Route
                path="/customers/:id/edit"
                element={<CustomerEditPage />}
              />
            </Route>

            {/* ================================= */}
            {/* Employees */}
            {/* Admin: Full Access */}
            {/* Manager: Read Only */}
            {/* ================================= */}
            <Route element={<RoleRoute allowedRoles={["admin", "manager"]} />}>
              <Route path="/employees" element={<EmployeeListPage />} />
              <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/employees/new" element={<EmployeeCreatePage />} />
              <Route
                path="/employees/:id/edit"
                element={<EmployeeEditPage />}
              />
            </Route>

            {/* ================================= */}
            {/* Suppliers */}
            {/* Admin: Full Access */}
            {/* Manager: Read Only */}
            {/* ================================= */}
            <Route element={<RoleRoute allowedRoles={["admin", "manager"]} />}>
              <Route path="/suppliers" element={<SupplierListPage />} />
              <Route path="/suppliers/:id" element={<SupplierDetailsPage />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/suppliers/new" element={<SupplierCreatePage />} />
              <Route
                path="/suppliers/:id/edit"
                element={<SupplierEditPage />}
              />
            </Route>

            {/* ================================= */}
            {/* Categories */}
            {/* Admin Only */}
            {/* ================================= */}
            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/categories" element={<CategoryListPage />} />
              <Route path="/categories/new" element={<CategoryCreatePage />} />
              <Route path="/categories/:id" element={<CategoryDetailsPage />} />
              <Route
                path="/categories/:id/edit"
                element={<CategoryEditPage />}
              />
            </Route>

            {/* ================================= */}
            {/* Database Monitoring */}
            {/* Admin / Manager: Read Only */}
            {/* ================================= */}
            <Route element={<RoleRoute allowedRoles={["admin", "manager"]} />}>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
