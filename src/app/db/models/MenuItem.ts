import { ObjectId } from "mongodb";

export interface MenuItem {
  _id?: ObjectId;
  name: string;
  ingredients: string;
  isVeg: boolean;
  price: number;
  halfPlatePrice?: number | null;
  category?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMenuItemData {
  name: string;
  ingredients: string;
  isVeg: boolean;
  price: number;
  halfPlatePrice?: number | null;
  category?: string;
  isAvailable?: boolean;
}

export interface UpdateMenuItemData {
  name?: string;
  ingredients?: string;
  isVeg?: boolean;
  price?: number;
  halfPlatePrice?: number | null;
  category?: string;
  isAvailable?: boolean;
}

export interface MenuItemResponse {
  _id: string;
  name: string;
  ingredients: string;
  isVeg: boolean;
  price: number;
  halfPlatePrice?: number | null;
  category?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}