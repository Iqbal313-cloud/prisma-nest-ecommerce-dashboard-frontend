import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/api";

import type {
  Order,
  OrderQueryParams,
  OrderResponse,
  SingleOrderResponse,
  CreateOrderPayload,
  UpdateOrderPayload,
} from "@/features/orders/types/order.types";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery,
  tagTypes: ["Order"],

  endpoints: (builder) => ({
    // Get all orders with filters and pagination
    getOrders: builder.query<OrderResponse, OrderQueryParams>({
      query: (params) => ({
        url: "orders",
        method: "GET",
        params,
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((order) => ({
                type: "Order" as const,
                id: order.id,
              })),
              { type: "Order" as const, id: "LIST" },
            ]
          : [{ type: "Order" as const, id: "LIST" }],
    }),

    // Get order by ID
    getOrderById: builder.query<SingleOrderResponse, number>({
      query: (id) => ({
        url: `orders/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),

    // Create order
    createOrder: builder.mutation<Order, CreateOrderPayload>({
      query: (body) => ({
        url: "orders",
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    // Update order
    updateOrder: builder.mutation<
      Order,
      { id: number; body: UpdateOrderPayload }
    >({
      query: ({ id, body }) => ({
        url: `orders/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),

    // Delete order
    deleteOrder: builder.mutation<{ message: string; data: Order }, number>({
      query: (id) => ({
        url: `orders/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
