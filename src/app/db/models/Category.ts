import { ObjectId } from "mongodb";

export interface Category {
  _id?: ObjectId;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}