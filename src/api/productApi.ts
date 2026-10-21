import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../lib/api";

import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from "../constants/pagination";

import type { PaginatedResponse } from "../types/common.types";

import type {
  CreateProductPayload,
  Product,
  ProductQueryParams,
  UpdateProductPayload,
} from "../features/products/types/product.types";

export const productApi = createApi({
  reducerPath: "productApi",

  baseQuery,

  tagTypes: ["Product"],

  endpoints: (builder) => ({
    // =========================
    // GET /products
    // =========================
    getProducts: builder.query<PaginatedResponse<Product>, ProductQueryParams>({
      query: ({
        page = DEFAULT_PAGE,
        limit = DEFAULT_LIMIT,
        productName,
        slug,
        sku,
        categoryId,
        supplierId,
        discontinued,
        minPrice,
        maxPrice,
      }) => ({
        url: "products",

        params: {
          page,
          limit: Math.min(limit, MAX_LIMIT),

          ...(productName && { productName }),
          ...(slug && { slug }),
          ...(sku && { sku }),

          ...(categoryId !== undefined && {
            categoryId,
          }),

          ...(supplierId !== undefined && {
            supplierId,
          }),

          ...(discontinued !== undefined && {
            discontinued,
          }),

          ...(minPrice !== undefined && {
            minPrice,
          }),

          ...(maxPrice !== undefined && {
            maxPrice,
          }),
        },
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Product" as const,
                id,
              })),
              {
                type: "Product" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Product" as const,
                id: "LIST",
              },
            ],
    }),
    // GET /products/export
    exportProducts: builder.mutation<
      Blob,
      Omit<ProductQueryParams, "page" | "limit">
    >({
      query: ({
        productName,
        slug,
        sku,
        categoryId,
        supplierId,
        discontinued,
        minPrice,
        maxPrice,
      }) => ({
        url: "products/export",

        params: {
          ...(productName && { productName }),
          ...(slug && { slug }),
          ...(sku && { sku }),

          ...(categoryId !== undefined && {
            categoryId,
          }),

          ...(supplierId !== undefined && {
            supplierId,
          }),

          ...(discontinued !== undefined && {
            discontinued,
          }),

          ...(minPrice !== undefined && {
            minPrice,
          }),

          ...(maxPrice !== undefined && {
            maxPrice,
          }),
        },

        responseHandler: async (response) => {
          return response.blob();
        },
      }),
    }),

    // =========================
    // GET /products/:id
    // =========================
    getProduct: builder.query<Product, number>({
      query: (id) => ({
        url: `products/${id}`,
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "Product",
          id,
        },
      ],
    }),

    // =========================
    // POST /products
    // =========================
    createProduct: builder.mutation<Product, CreateProductPayload>({
      query: (body) => ({
        url: "products",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        {
          type: "Product",
          id: "LIST",
        },
      ],
    }),

    // =========================
    // PATCH /products/:id
    // =========================
    updateProduct: builder.mutation<
      Product,
      {
        id: number;
        data: UpdateProductPayload;
      }
    >({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "Product",
          id,
        },
        {
          type: "Product",
          id: "LIST",
        },
      ],
    }),

    // =========================
    // DELETE /products/:id
    // =========================
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "Product",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useExportProductsMutation,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
