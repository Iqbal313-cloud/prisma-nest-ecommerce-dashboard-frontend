import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../lib/api";
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
} from "../constants/pagination";

import type { PaginatedResponse } from "../types/common.types";
import type { Product } from "../features/products/types/product.types";

export const productApi = createApi({
  reducerPath: "productApi",

  baseQuery,

  tagTypes: ["Product"],

  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedResponse<Product>,
      {
        page?: number;
        limit?: number;
      }
    >({
      query: ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT }) => ({
        url: "products",
        params: {
          page,
          limit: Math.min(limit, MAX_LIMIT),
        },
      }),

      providesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
