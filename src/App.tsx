import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./features/dashboard/pages/DashboardPage";
import ProductListPage from "./features/products/pages/ProductListPage";
import CategoryListPage from "./features/categories/pages/CategoryListPage";
import OrderListPage from "./features/orders/pages/OrderListPage";
import CustomerListPage from "./features/customers/pages/CustomerListPage";
import EmployeeListPage from "./features/employees/pages/EmployeeListPage";
import SupplierListPage from "./features/suppliers/pages/SupplierListPage";


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/orders" element={<OrderListPage />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/suppliers" element={<SupplierListPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
