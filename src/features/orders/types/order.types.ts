export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderCustomer {
  id: number;
  firstName: string;
  lastName: string | null;
  phoneNumber: string;
  address: string | null;
}

export interface OrderEmployee {
  id: number;
  firstName?: string;
  lastName?: string;
}

export interface CreateOrderDetailPayload {
  productId: number;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface UpdateOrderDetailPayload {
  productId: number;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface OrderDetail {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number | string;
  discount: number | string;
  productName?: string;
  product?: {
    id?: number;
    productName?: string;
  };
}

export interface Order {
  id: number;
  customerId?: number | null;
  employeeId?: number | null;
  customer?: OrderCustomer | null;
  employee?: OrderEmployee | null;
  orderDate: string;
  orderStatus: OrderStatus;
  orderDetails: OrderDetail[];
  totalAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  customerFirstName: string;
  customerLastName?: string;
  customerPhone: string;
  customerAddress?: string;
  orderDate?: string;
  orderStatus?: OrderStatus | string;
  employeeId?: number;
  orderDetails: CreateOrderDetailPayload[];
}

export interface UpdateOrderPayload {
  customerFirstName?: string;
  customerLastName?: string;
  customerPhone?: string;
  customerAddress?: string;
  orderDate?: string;
  orderStatus?: OrderStatus | string;
  employeeId?: number;
  orderDetails?: UpdateOrderDetailPayload[];
}
