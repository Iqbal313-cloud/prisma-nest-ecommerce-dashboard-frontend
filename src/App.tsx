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
function App() {
  return (
    <BrowserRouter>
      {" "}
      <Layout>
        {" "}
        <Routes>
          {" "}
          {/* Dashboard */} <Route path="/" element={<DashboardPage />} />{" "}
          {/* Products */}{" "}
          <Route path="/products" element={<ProductListPage />} />{" "}
          <Route path="/products/new" element={<ProductCreatePage />} />{" "}
          <Route path="/products/:id" element={<ProductDetailsPage />} />{" "}
          <Route path="/products/:id/edit" element={<ProductEditPage />} />{" "}
          <Route path="/orders" element={<OrderListPage />} />
          <Route path="/orders/new" element={<OrderCreatePage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/orders/:id/edit" element={<OrderEditPage />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route path="/customers/new" element={<CustomerCreatePage />} />
          <Route path="/customers/:id" element={<CustomerDetailsPage />} />
          <Route path="/customers/:id/edit" element={<CustomerEditPage />} />
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/new" element={<EmployeeCreatePage />} />
          <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
          <Route path="/employees/:id/edit" element={<EmployeeEditPage />} />
          <Route path="/suppliers" element={<SupplierListPage />} />
          <Route path="/suppliers/new" element={<SupplierCreatePage />} />
          <Route path="/suppliers/:id" element={<SupplierDetailsPage />} />
          <Route path="/suppliers/:id/edit" element={<SupplierEditPage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/categories/new" element={<CategoryCreatePage />} />
          <Route path="/categories/:id" element={<CategoryDetailsPage />} />
          <Route path="/categories/:id/edit" element={<CategoryEditPage />} />
        </Routes>{" "}
      </Layout>{" "}
    </BrowserRouter>
  );
}
export default App;
