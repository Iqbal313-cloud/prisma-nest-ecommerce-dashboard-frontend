import type { PaginatedResponse } from "@/types/common.types";

export interface ProductFilters {
  productName?: string;
  slug?: string;
  sku?: string;
  categoryId?: number;
  supplierId?: number;
  discontinued?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

// Query parameters sent to the API
// Includes product filters and pagination options
export interface ProductQueryParams extends ProductFilters {
  page?: number;
  limit?: number;
}

export interface ProductCategory {
  id: number;
  categoryName: string;
}

export interface ProductSupplier {
  id: number;
  supplierName: string;
}

export interface Product {
  id: number;
  productName: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  quantityPerUnit: string;
  unitPrice: string;
  unitsInStock: number;
  unitsOnOrder: number;
  discontinued: boolean;
  category: ProductCategory;
  supplier: ProductSupplier;
  createdAt: string;
  updatedAt: string;
}

export type ProductResponse = PaginatedResponse<Product>;
