import type { PaginatedResponse } from "../../../types/common.types";

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
