import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../lib/api";

import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from "../constants/pagination";

import type { PaginatedResponse } from "../types/common.types";

import type {
  CreateSupplierPayload,
  Supplier,
  SupplierQueryParams,
  UpdateSupplierPayload,
} from "../features/suppliers/types/supplier.types";

export const supplierApi = createApi({
  reducerPath: "supplierApi",

  baseQuery,

  tagTypes: ["Supplier"],

  endpoints: (builder) => ({
    // =========================
    // GET /suppliers
    // =========================
    getSuppliers: builder.query<
      PaginatedResponse<Supplier>,
      SupplierQueryParams
    >({
      query: ({
        page = DEFAULT_PAGE,
        limit = DEFAULT_LIMIT,
        supplierName,
        contactName,
        address,
        city,
        country,
        phone,
        postalCode,
      }) => ({
        url: "suppliers",

        params: {
          page,
          limit: Math.min(limit, MAX_LIMIT),

          ...(supplierName && { supplierName }),
          ...(contactName && { contactName }),
          ...(address && { address }),
          ...(city && { city }),
          ...(country && { country }),
          ...(phone && { phone }),
          ...(postalCode && { postalCode }),
        },
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Supplier" as const,
                id,
              })),
              {
                type: "Supplier" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Supplier" as const,
                id: "LIST",
              },
            ],
    }),

    // =========================
    // GET /suppliers/:id
    // =========================
    getSupplier: builder.query<Supplier, number>({
      query: (id) => ({
        url: `suppliers/${id}`,
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "Supplier",
          id,
        },
      ],
    }),

    // =========================
    // POST /suppliers
    // =========================
    createSupplier: builder.mutation<Supplier, CreateSupplierPayload>({
      query: (body) => ({
        url: "suppliers",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        {
          type: "Supplier",
          id: "LIST",
        },
      ],
    }),

    // =========================
    // PATCH /suppliers/:id
    // =========================
    updateSupplier: builder.mutation<
      Supplier,
      {
        id: number;
        data: UpdateSupplierPayload;
      }
    >({
      query: ({ id, data }) => ({
        url: `suppliers/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "Supplier",
          id,
        },
        {
          type: "Supplier",
          id: "LIST",
        },
      ],
    }),

    // =========================
    // DELETE /suppliers/:id
    // =========================
    deleteSupplier: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `suppliers/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "Supplier",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;
