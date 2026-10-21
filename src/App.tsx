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
        </Routes>{" "}
      </Layout>{" "}
    </BrowserRouter>
  );
}
export default App;
