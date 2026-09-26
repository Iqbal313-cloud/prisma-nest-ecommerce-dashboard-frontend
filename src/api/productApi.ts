import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../lib/api";

import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from "../constants/pagination";

import type { PaginatedResponse } from "../types/common.types";

import type {
  Product,
  ProductQueryParams,
} from "../features/products/types/product.types";

export const productApi = createApi({
  reducerPath: "productApi",

  baseQuery,

  tagTypes: ["Product"],

  endpoints: (builder) => ({
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
          ...(categoryId !== undefined && { categoryId }),
          ...(supplierId !== undefined && { supplierId }),
          ...(discontinued !== undefined && { discontinued }),
          ...(minPrice !== undefined && { minPrice }),
          ...(maxPrice !== undefined && { maxPrice }),
        },
      }),

      providesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
