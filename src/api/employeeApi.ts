import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/api";

import type {
  Employee,
  EmployeeQueryParams,
  EmployeeResponse,
  SingleEmployeeResponse,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "@/features/employees/types/employee.types";


export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery,
  tagTypes: ["Employee"],

  endpoints: (builder) => ({
    // Get all employees with filters and pagination
    getEmployees: builder.query<EmployeeResponse, EmployeeQueryParams>({
      query: (params) => ({
        url: "employees",
        method: "GET",
        params,
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((employee) => ({
                type: "Employee" as const,
                id: employee.id,
              })),
              { type: "Employee" as const, id: "LIST" },
            ]
          : [{ type: "Employee" as const, id: "LIST" }],
    }),

    // Get employee by ID
    getEmployeeById: builder.query<SingleEmployeeResponse, number>({
      query: (id) => ({
        url: `employees/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),

    // Create employee
    createEmployee: builder.mutation<Employee, CreateEmployeePayload>({
      query: (body) => ({
        url: "employees",
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    // Update employee
    updateEmployee: builder.mutation<
      Employee,
      { id: number; body: UpdateEmployeePayload }
    >({
      query: ({ id, body }) => ({
        url: `employees/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    // Delete employee
    deleteEmployee: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `employees/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
