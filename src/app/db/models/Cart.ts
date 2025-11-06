import { ObjectId } from "mongodb";

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  plateSize: 'half' | 'full';
  quantity: number;
  isVeg: boolean;
  ingredients: string;
}

export interface Cart {
  _id?: ObjectId;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddToCartData {
  menuItemId: string;
  plateSize: 'half' | 'full';
  quantity: number;
}

export interface UpdateCartItemData {
  menuItemId: string;
  plateSize: 'half' | 'full';
  quantity: number;
}

export interface CartResponse {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}