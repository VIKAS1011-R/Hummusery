export interface OrderHistoryItem {
  orderId: string;
  orderNumber: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    isVeg: boolean;
  }[];
  totalAmount: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  orderDate: Date;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  theme?: "light" | "dark";
  orderHistory: OrderHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  theme?: "light" | "dark";
  orderHistory: OrderHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
}