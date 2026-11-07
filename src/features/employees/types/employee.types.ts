import type { PaginatedResponse } from "@/types/common.types";

// Employee filters
export interface EmployeeFilters {
  id?: number;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  orderId?: number;
  orderDate?: string;
  orderStatus?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface EmployeeAuditUser {
  name: string;
}

// Query parameters with pagination
export interface EmployeeQueryParams extends EmployeeFilters {
  page?: number;
  limit?: number;
}

// Employee order
export interface EmployeeOrder {
  id: number;
  orderDate: string;
  orderStatus: string;
}

// Employee entity
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  photoPath: string | null;
  notes: string | null;
  orders?: EmployeeOrder[];
  createdAt: string;
  updatedAt: string;

  createdBy?: EmployeeAuditUser | null;
  updatedBy?: EmployeeAuditUser | null;
  _count?: {
    orders: number;
  };
}

// Create employee payload
export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  birthDate: string;
  photoPath?: string;
  notes?: string;
}

// Update employee payload
export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

// Paginated employees response
export type EmployeeResponse = PaginatedResponse<Employee>;

// Single employee response
export interface SingleEmployeeResponse {
  data: Employee;
}
