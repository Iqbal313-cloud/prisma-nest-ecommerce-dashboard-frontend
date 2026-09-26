import { useState } from "react";
import { useGetProductsQuery } from "../../../api/productApi";
import Pagination from "../../../components/common/Pagination";


function ProductListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isError } = useGetProductsQuery({
    page,
    limit,
  });

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>Failed to load products.</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Products</h1>

      <div className="overflow-hidden rounded-lg bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
              </tr>
            </thead>

            <tbody>
              {data?.data.map((product) => (
                <tr key={product.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3">{product.id}</td>

                  <td className="px-4 py-3 font-medium">
                    {product.productName}
                  </td>

                  <td className="px-4 py-3">{product.sku}</td>

                  <td className="px-4 py-3">{product.category.categoryName}</td>

                  <td className="px-4 py-3">৳{product.unitPrice}</td>

                  <td className="px-4 py-3">{product.unitsInStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && (
          <Pagination
            page={data.meta.page}
            lastPage={data.meta.lastPage}
            total={data.meta.total}
            limit={data.meta.limit}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
