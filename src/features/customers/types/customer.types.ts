import type { PaginatedResponse } from "@/types/common.types";

// Customer filters
export interface CustomerFilters {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  orderStatus?: string;
  createdByName?: string;
  updatedByName?: string;
}

export interface CustomerAuditUser {
  name: string;
}

// Query parameters with pagination
export interface CustomerQueryParams extends CustomerFilters {
  page?: number;
  limit?: number;
}

// Product information inside an order detail
export interface CustomerOrderProduct {
  id: number;
  productName: string;
}

// Order detail
export interface CustomerOrderDetail {
  quantity: number;
  unitPrice: number | string;
  discount: number | string;
  product?: CustomerOrderProduct;
}

// Employee information
export interface CustomerOrderEmployee {
  id: number;
  firstName: string;
  lastName: string;
}

// Order information
export interface CustomerOrder {
  id: number;
  orderDate: string;
  orderStatus: string;
  orderDetails?: CustomerOrderDetail[];
  employee?: CustomerOrderEmployee | null;
}

// Customer entity
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
  updatedAt: string;

  createdBy?: CustomerAuditUser | null;
  updatedBy?: CustomerAuditUser | null;

  orders?: CustomerOrder[];
}

// Create customer payload
export interface CreateCustomerPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

// Update customer payload
export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

// Paginated customer response
export type CustomerResponse = PaginatedResponse<Customer>;

// Single customer response
export type SingleCustomerResponse = Customer;
