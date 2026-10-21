import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/api";

import type {
  Customer,
  CustomerQueryParams,
  CustomerResponse,
  SingleCustomerResponse,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/features/customers/types/customer.types";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery,
  tagTypes: ["Customer"],

  endpoints: (builder) => ({
    // Get all customers with filters and pagination
    getCustomers: builder.query<CustomerResponse, CustomerQueryParams>({
      query: (params) => ({
        url: "customers",
        method: "GET",
        params,
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((customer) => ({
                type: "Customer" as const,
                id: customer.id,
              })),
              { type: "Customer" as const, id: "LIST" },
            ]
          : [{ type: "Customer" as const, id: "LIST" }],
    }),

    // Get customer by ID
    getCustomerById: builder.query<SingleCustomerResponse, number>({
      query: (id) => ({
        url: `customers/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [{ type: "Customer", id }],
    }),

    // Create customer
    createCustomer: builder.mutation<Customer, CreateCustomerPayload>({
      query: (body) => ({
        url: "customers",
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),

    // Update customer
    updateCustomer: builder.mutation<
      Customer,
      { id: number; body: UpdateCustomerPayload }
    >({
      query: ({ id, body }) => ({
        url: `customers/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),

    // Delete customer
    deleteCustomer: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `customers/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
