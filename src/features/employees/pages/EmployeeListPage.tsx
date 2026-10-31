import { useState } from "react";
import { Link } from "react-router-dom";

import { useGetEmployeesQuery } from "@/api/employeeApi";
import Pagination from "@/components/common/Pagination";

import EmployeeFilters from "../components/EmployeeFilters";
import EmployeeTable from "../components/EmployeeTable";
import type { EmployeeQueryParams } from "../types/employee.types";
import ErrorMessage from "@/components/common/ErrorMessage";
import Loading from "@/components/common/Loading";

function EmployeeListPage() {
  const [filters, setFilters] = useState<EmployeeQueryParams>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isFetching, isError } =
    useGetEmployeesQuery(filters);

  const setPage = (page: number) => {
    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters((current) => ({
      ...current,
      limit: newLimit,
      page: 1,
    }));
  };

  const handleFilterChange = (updatedFilters: EmployeeQueryParams) => {
    setFilters((current) => ({
      ...current,
      ...updatedFilters,
      page: 1,
    }));
  };

  const handleFilterReset = () => {
    setFilters({
      page: 1,
      limit: filters.limit ?? 10,
    });
  };

  if (isLoading) {
    return <Loading message="Loading employees..." minHeight="min-h-[300px]" />;
  }

  if (isError) {
    return <ErrorMessage message="Failed to load employees." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Employees</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage employees and view their orders.
          </p>
        </div>

        <Link
          to="/employees/new"
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          Add Employee
        </Link>
      </div>

      {/* Filters */}
      <EmployeeFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      {/* Employee Table + Pagination */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isFetching && data && (
          <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500">
            Updating employees...
          </div>
        )}
        {data && <EmployeeTable employees={data.data} />}

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

export default EmployeeListPage;
