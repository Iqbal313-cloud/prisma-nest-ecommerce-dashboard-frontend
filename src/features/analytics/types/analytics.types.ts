export interface AnalyticsSummary {
  totalProducts: number;
  totalCategories: number;
  totalCustomers: number;
  totalEmployees: number;
  totalSuppliers: number;
  totalOrders: number;
}

export interface AnalyticsOrders {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface AnalyticsInventory {
  lowStock: number;
  outOfStock: number;
}

export interface AnalyticsSales {
  deliveredOrderCount: number;
  totalRevenue: number;
}

export interface AnalyticsOverview {
  summary: AnalyticsSummary;
  orders: AnalyticsOrders;
  inventory: AnalyticsInventory;
  sales: AnalyticsSales;
}

export type AnalyticsGroupBy = "day" | "week" | "month";

export type SalesComparisonPeriod = "week" | "month" | "year";

export interface OrderTrend {
  date: string;
  orderCount: number;
}

export interface OrderTrendsResponse {
  groupBy: AnalyticsGroupBy;
  period: string;
  trends: OrderTrend[];
}

export interface SalesTrend {
  date: string;
  totalRevenue: number;
  orderCount: number;
}

export interface SalesTrendsResponse {
  groupBy: AnalyticsGroupBy;
  trends: SalesTrend[];
}

export interface SalesSummaryParams {
  from?: string;
  to?: string;
}

export interface SalesSummaryResponse {
  totalRevenue: number;
  deliveredOrders: number;
  averageOrderValue: number;
  period: {
    from: string | null;
    to: string | null;
  };
}

export interface TopSellingProduct {
  productId: string;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
  orderCount: number;
}

export interface TopSellingProductsResponse {
  limit: number;
  products: TopSellingProduct[];
}

export interface InventorySummaryResponse {
  totalProducts: number;
  totalStockQuantity: number;
  inStockProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  unknownStockProducts: number;
  totalStockValue: number;
  lowStockThreshold: number;
  lowStockItems: LowStockItem[];
}

export interface LowStockItem {
  productId: string;
  productName: string;
  unitsInStock: number;
  unitPrice: number;
}

export interface TopCustomer {
  customerId: string;
  firstName: string;
  lastName: string | null;
  totalOrders: number;
  totalSpent: number;
  totalUnitsPurchased: number;
  lastOrderDate: string | null;
}

export interface TopCustomersResponse {
  limit: number;
  customers: TopCustomer[];
}

export interface CategoryPerformance {
  categoryId: string;
  categoryName: string;
  totalQuantitySold: number;
  totalRevenue: number;
  orderCount: number;
  productsSold: number;
}

export interface CategoryPerformanceResponse {
  limit: number;
  categories: CategoryPerformance[];
}

export interface SalesComparisonPeriodData {
  revenue: number;
  deliveredOrders: number;
  averageOrderValue: number;
}

export interface SalesComparisonResponse {
  period: SalesComparisonPeriod;
  current: SalesComparisonPeriodData;
  previous: SalesComparisonPeriodData;
  revenueChange: number;
  revenueChangePercent: number | null;
}

export interface SlowMovingProduct {
  productId: string;
  productName: string;
  unitPrice: number;
  unitsInStock: number | null;
  lastSoldAt: string | null;
  daysSinceLastSale: number | null;
  quantitySoldInPeriod: number;
  revenueInPeriod: number;
}

export interface SlowMovingProductsResponse {
  filters: {
    days: number;
    limit: number;
  };
  count: number;
  products: SlowMovingProduct[];
}

export interface AnalyticsLimitParams {
  limit?: number;
}

export interface SalesTrendsParams {
  groupBy?: AnalyticsGroupBy;
}
export interface AnalyticsLimitParams {
  limit?: number;
}

export interface SlowMovingProductsParams {
  days?: number;
  limit?: number;
}

export interface SalesComparisonParams {
  period?: SalesComparisonPeriod;
}

export interface SlowMovingProductsParams {
  days?: number;
  limit?: number;
}

export interface SalesComparisonParams {
  period?: SalesComparisonPeriod;
}
