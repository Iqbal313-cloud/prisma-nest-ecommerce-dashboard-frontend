import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../lib/api";

import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../features/categories/types/category.types";

export const categoryApi = createApi({
  reducerPath: "categoryApi",

  baseQuery,

  tagTypes: ["Category"],

  endpoints: (builder) => ({
    // =========================
    // GET /categories
    // =========================
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: "categories",
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Category" as const,
                id,
              })),
              {
                type: "Category" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Category" as const,
                id: "LIST",
              },
            ],
    }),

    // =========================
    // GET /categories/:id
    // =========================
    getCategory: builder.query<Category, number>({
      query: (id) => ({
        url: `categories/${id}`,
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "Category",
          id,
        },
      ],
    }),

    // =========================
    // POST /categories
    // =========================
    createCategory: builder.mutation<Category, CreateCategoryPayload>({
      query: (body) => ({
        url: "categories",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        {
          type: "Category",
          id: "LIST",
        },
      ],
    }),

    // =========================
    // PATCH /categories/:id
    // =========================
    updateCategory: builder.mutation<
      Category,
      {
        id: number;
        data: UpdateCategoryPayload;
      }
    >({
      query: ({ id, data }) => ({
        url: `categories/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "Category",
          id,
        },
        {
          type: "Category",
          id: "LIST",
        },
      ],
    }),

    // =========================
    // DELETE /categories/:id
    // =========================
    deleteCategory: builder.mutation<
      { message: string; category: Category },
      number
    >({
      query: (id) => ({
        url: `categories/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "Category",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
