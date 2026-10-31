import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../lib/api";

import type {
  MonitoringSummary,
  RecentQueriesResponse,
  SlowQueriesResponse,
  TopQueriesResponse,
  MonitoringPaginationParams,
} from "@/features/monitoring/types/monitoring.types";

export const monitoringApi = createApi({
  reducerPath: "monitoringApi",
  baseQuery,
  tagTypes: ["Monitoring"],

  endpoints: (builder) => ({
    // Database summary
    getMonitoringSummary: builder.query<MonitoringSummary, void>({
      query: () => "monitoring/summary",
      providesTags: ["Monitoring"],
    }),

    // Recent queries
    getRecentQueries: builder.query<
      RecentQueriesResponse,
      MonitoringPaginationParams
    >({
      query: (params) => ({
        url: "monitoring/recent-queries",
        params,
      }),
      providesTags: ["Monitoring"],
    }),

    // Slow queries
    getSlowQueries: builder.query<
      SlowQueriesResponse,
      MonitoringPaginationParams
    >({
      query: (params) => ({
        url: "monitoring/slow-queries",
        params,
      }),
      providesTags: ["Monitoring"],
    }),

    // Top queries
    getTopQueries: builder.query<
      TopQueriesResponse,
      MonitoringPaginationParams
    >({
      query: (params) => ({
        url: "monitoring/top-queries",
        params,
      }),
      providesTags: ["Monitoring"],
    }),
  }),
});

export const {
  useGetMonitoringSummaryQuery,
  useGetRecentQueriesQuery,
  useGetSlowQueriesQuery,
  useGetTopQueriesQuery,
} = monitoringApi;
