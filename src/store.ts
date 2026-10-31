import { configureStore } from "@reduxjs/toolkit";

import { categoryApi } from "./api/categoryApi";
import { productApi } from "./api/productApi";
import { supplierApi } from "./api/supplierApi";
import { employeeApi } from "./api/employeeApi";
import { orderApi } from "./api/orderApi";
import { customerApi } from "./api/customerApi";
import { analyticsApi } from "./api/analyticsApi";
import { monitoringApi } from "./api/monitoringApi";

export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [supplierApi.reducerPath]: supplierApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [monitoringApi.reducerPath]: monitoringApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(categoryApi.middleware)
      .concat(productApi.middleware)
      .concat(supplierApi.middleware)
      .concat(employeeApi.middleware)
      .concat(orderApi.middleware)
      .concat(customerApi.middleware)
      .concat(analyticsApi.middleware)
      .concat(monitoringApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
