import type { PaginatedResponse } from "@/types/common.types";

export interface SupplierProduct {
  id: number;
  productName: string;
}

export interface Supplier {
  id: number;
  supplierName: string;
  contactName: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  phone: string | null;

  products: SupplierProduct[];

  _count: {
    products: number;
  };

  createdAt: string;
  updatedAt: string;
  createdBy: SupplierAuditUser | null;
  updatedBy: SupplierAuditUser | null;
}

export interface SupplierAuditUser {
  name: string;
}

export interface SupplierFilters {
  supplierName?: string;
  contactName?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  postalCode?: string;
  createdByName?: string;
  updatedByName?: string;
}

export interface SupplierQueryParams extends SupplierFilters {
  page?: number;
  limit?: number;
}

export interface CreateSupplierPayload {
  supplierName: string;
  contactName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

export type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

export type SupplierResponse = PaginatedResponse<Supplier>;
