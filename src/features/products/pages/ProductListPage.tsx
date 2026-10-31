import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useExportProductsMutation,
  useGetProductsQuery,
} from "@/api/productApi";
import Pagination from "@/components/common/Pagination";

import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";

import type { ProductFilters as ProductFilterValues } from "../types/product.types";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

const DEFAULT_FILTERS: ProductFilterValues = {};

function ProductListPage() {
  // =========================
  // Pagination
  // =========================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // =========================
  // Temporary filters
  // =========================
  // User বর্তমানে filter form-এ যা পরিবর্তন করছে
  const [filters, setFilters] = useState<ProductFilterValues>(DEFAULT_FILTERS);

  // =========================
  // Applied filters
  // =========================
  // Search button চাপার পর যে filter actually API-তে যায়
  const [appliedFilters, setAppliedFilters] =
    useState<ProductFilterValues>(DEFAULT_FILTERS);

  // =========================
  // Get products
  // =========================
  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    page,
    limit,
    ...appliedFilters,
  });

  // =========================
  // Export products
  // =========================
  const [exportProducts, { isLoading: isExporting }] =
    useExportProductsMutation();

  // =========================
  // Check active filters
  // =========================
  /*
   * এখানে appliedFilters ব্যবহার করছি।
   *
   * তাই user শুধু form-এ কিছু লিখলেই CSV active হবে না।
   * Search চাপার পর filter apply হলে CSV active হবে।
   *
   * false-কে active filter হিসেবে রাখা হয়েছে,
   * কারণ discontinued=false নিজেও একটি valid filter।
   */
  const hasActiveFilters = Object.entries(appliedFilters).some(
    ([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return false;
      }

      // discontinued=false-ও valid filter
      if (key === "discontinued") {
        return typeof value === "boolean";
      }

      return true;
    },
  );

  // =========================
  // Filter change
  // =========================
  const handleFilterChange = <K extends keyof ProductFilterValues>(
    key: K,
    value: ProductFilterValues[K],
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  // =========================
  // Search
  // =========================
  const handleSearch = () => {
    setPage(1);
    setAppliedFilters(filters);
  };

  // =========================
  // Clear filters
  // =========================
  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  // =========================
  // Pagination limit change
  // =========================
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
  };

  // =========================
  // Export CSV
  // =========================
  const handleExport = async () => {
    if (!hasActiveFilters) {
      return;
    }

    try {
      /*
       * শুধুমাত্র appliedFilters পাঠানো হচ্ছে।
       *
       * page এবং limit এখানে পাঠানো হচ্ছে না।
       *
       * Backend matching সব data 1000 করে batch করে
       * একটি CSV stream করবে।
       */
      const blob = await exportProducts(appliedFilters).unwrap();

      // Create temporary object URL
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");

      link.href = url;
      link.download = "products.csv";

      // Trigger browser download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export products:", error);
    }
  };

  // =========================
  // Loading
  // =========================
  if (isLoading) {
    return <Loading message="Loading products..." />;
  }

  // =========================
  // Error
  // =========================
  if (isError) {
    return (
      <ErrorMessage message="Failed to load products. Please try again later." />
    );
  }

  return (
    <div className="space-y-6">
      {/* =========================
          Header
      ========================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your products, inventory and product information.
          </p>
        </div>

        {/* =========================
            Header Actions
        ========================= */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Download CSV */}
          <button
            type="button"
            onClick={handleExport}
            disabled={!hasActiveFilters || isExporting}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isExporting ? "Exporting..." : "Download CSV"}
          </button>

          {/* Create Product */}
          <Link
            to="/products/new"
            className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <span className="text-lg leading-none">+</span>
            Create Product
          </Link>
        </div>
      </div>

      {/* =========================
          Filters
      ========================= */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClear={handleClear}
        />
      </div>

      {/* =========================
          Table
      ========================= */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {data && <ProductTable products={data.data} />}

        {/* =========================
            Pagination
        ========================= */}
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
