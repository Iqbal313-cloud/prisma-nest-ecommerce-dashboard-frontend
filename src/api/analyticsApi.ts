import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/api";

import type {
  AnalyticsOverview,
  OrderTrendsResponse,
  SalesSummaryParams,
  SalesSummaryResponse,
  SalesTrendsParams,
  SalesTrendsResponse,
  TopSellingProductsResponse,
  InventorySummaryResponse,
  TopCustomersResponse,
  CategoryPerformanceResponse,
  SalesComparisonParams,
  SalesComparisonResponse,
  SlowMovingProductsParams,
  SlowMovingProductsResponse,
  AnalyticsLimitParams,
} from "@/features/analytics/types/analytics.types";

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery,
  tagTypes: ["Analytics"],

  endpoints: (builder) => ({
    // Dashboard overview
    getAnalyticsOverview: builder.query<AnalyticsOverview, void>({
      query: () => "analytics/overview",
      providesTags: ["Analytics"],
    }),

    // Order trends
    getOrderAnalytics: builder.query<
      {
        summary: {
          totalOrders: number;
          pending: number;
          processing: number;
          shipped: number;
          delivered: number;
          cancelled: number;
        };
        distribution: {
          pending: number;
          processing: number;
          shipped: number;
          delivered: number;
          cancelled: number;
        };
      },
      void
    >({
      query: () => "analytics/orders",
      providesTags: ["Analytics"],
    }),

    getOrderTrends: builder.query<
      OrderTrendsResponse,
      SalesTrendsParams | void
    >({
      query: (params) => ({
        url: "analytics/orders/trends",
        params: params ?? {},
      }),
      providesTags: ["Analytics"],
    }),

    // Sales
    getSalesSummary: builder.query<
      SalesSummaryResponse,
      SalesSummaryParams | void
    >({
      query: (params) => ({
        url: "analytics/sales/summary",
        params: params ?? {},
      }),
      providesTags: ["Analytics"],
    }),

    getSalesTrends: builder.query<
      SalesTrendsResponse,
      SalesTrendsParams | void
    >({
      query: (params) => ({
        url: "analytics/sales/trends",
        params: params ?? {},
      }),
      providesTags: ["Analytics"],
    }),

    getSalesComparison: builder.query<
      SalesComparisonResponse,
      SalesComparisonParams | void
    >({
      query: (params) => ({
        url: "analytics/sales/comparison",
        params: params ?? {},
      }),
      providesTags: ["Analytics"],
    }),

    // Products
    getTopSellingProducts: builder.query<
      TopSellingProductsResponse,
      AnalyticsLimitParams | void
    >({
      query: (params) => ({
        url: "analytics/products/top-selling",
        params: params ?? {},
      }),
      providesTags: ["Analytics"],
    }),

    getSlowMovingProducts: builder.query<
      SlowMovingProductsResponse,
      SlowMovingProductsParams | void
    >({
      query: (params) => ({
        url: "analytics/products/slow-moving",
        params: params ?? {},
      }),
      providesTags: ["Analytics"],
    }),

    // Inventory
    getInventorySummary: builder.query<InventorySummaryResponse, void>({
      query: () => "analytics/inventory/summary",
      providesTags: ["Analytics"],
    }),

    // Customers
    getTopCustomers: builder.query<
      TopCustomersResponse,
      AnalyticsLimitParams | void
    >({
      query: (params) => ({
        url: "analytics/customers/top",
        params: params ?? {},
      }),
      providesTags: ["Analytics"],
    }),

    // Categories
    getCategoryPerformance: builder.query<
      CategoryPerformanceResponse,
      AnalyticsLimitParams | void
    >({
      query: (params) => ({
        url: "analytics/categories/performance",
        params: params ?? {},
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetAnalyticsOverviewQuery,
  useGetOrderAnalyticsQuery,
  useGetOrderTrendsQuery,
  useGetSalesSummaryQuery,
  useGetSalesTrendsQuery,
  useGetSalesComparisonQuery,
  useGetTopSellingProductsQuery,
  useGetSlowMovingProductsQuery,
  useGetInventorySummaryQuery,
  useGetTopCustomersQuery,
  useGetCategoryPerformanceQuery,
} = analyticsApi;
