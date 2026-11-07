import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: "https://prisma-nest-ecommerce-api.onrender.com/api/v1/",
  credentials: "include",
});
