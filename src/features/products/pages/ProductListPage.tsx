// import { useState } from "react";

// import { useGetProductsQuery } from "@/api/productApi";
// import Pagination from "@/components/common/Pagination";

// import ProductTable from "../components/ProductTable";

// function ProductListPage() {
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);

//   const { data, isLoading, isFetching, isError } = useGetProductsQuery({
//     page,
//     limit,
//   });

//   const handleLimitChange = (newLimit: number) => {
//     setLimit(newLimit);
//   };

//   if (isError) {
//     return (
//       <div className="rounded-xl border border-red-200 bg-red-50 p-6">
//         <h2 className="font-semibold text-red-700">Failed to load products</h2>

//         <p className="mt-1 text-sm text-red-600">
//           Something went wrong while loading the products.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-slate-900">
//           Products
//         </h1>

//         <p className="mt-1 text-sm text-slate-500">
//           Manage your products and inventory.
//         </p>
//       </div>

//       {/* Product Table */}
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="relative">
//           {isFetching && !isLoading && (
//             <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-slate-100">
//               <div className="h-full w-1/3 animate-pulse bg-slate-900" />
//             </div>
//           )}

//           <ProductTable products={data?.data ?? []} isLoading={isLoading} />
//         </div>

//         {/* Pagination */}
//         {data && (
//           <Pagination
//             page={data.meta.page}
//             lastPage={data.meta.lastPage}
//             total={data.meta.total}
//             limit={data.meta.limit}
//             onPageChange={setPage}
//             onLimitChange={handleLimitChange}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductListPage;

import { useState } from "react";

import { useGetProductsQuery } from "@/api/productApi";

import Pagination from "@/components/common/Pagination";

import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";

import type { ProductFilters as ProductFilterValues } from "../types/product.types";

const DEFAULT_FILTERS: ProductFilterValues = {};

function ProductListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Form-এর temporary filter
  const [filters, setFilters] = useState<ProductFilterValues>(DEFAULT_FILTERS);

  // API-তে যেই filter পাঠানো হচ্ছে
  const [appliedFilters, setAppliedFilters] =
    useState<ProductFilterValues>(DEFAULT_FILTERS);

  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    page,
    limit,
    ...appliedFilters,
  });

  const handleFilterChange = <K extends keyof ProductFilterValues>(
    key: K,
    value: ProductFilterValues[K],
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    setPage(1);
    setAppliedFilters(filters);
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-500">Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-600">
          Failed to load products.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Products
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your products, inventory and product information.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {data && <ProductTable products={data.data} />}

        {data && (
          <Pagination
            page={data.meta.page}
            lastPage={data.meta.lastPage}
            total={data.meta.total}
            limit={data.meta.limit}
            isFetching={isFetching}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
