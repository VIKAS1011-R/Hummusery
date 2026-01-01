import { ObjectId } from 'mongodb';

export interface BulkMenuItem {
  _id?: ObjectId;
  name: string;
  description: string;
  category: string;
  isVeg: boolean;
  servesPerUnit: number; // Number of people served per unit
  pricePerUnit: number; // Price per unit (e.g., per tray, per platter)
  unitType: 'tray' | 'platter' | 'box' | 'container'; // Type of serving unit
  minimumOrder: number; // Minimum number of units that can be ordered
  imageUrl?: string;
  isAvailable: boolean;
  preparationTime: number; // Time in hours needed for preparation
  advanceNoticeRequired: number; // Hours of advance notice required
  ingredients?: string[];
  allergens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBulkMenuItemData {
  name: string;
  description: string;
  category: string;
  isVeg: boolean;
  servesPerUnit: number;
  pricePerUnit: number;
  unitType: 'tray' | 'platter' | 'box' | 'container';
  minimumOrder: number;
  imageUrl?: string;
  isAvailable?: boolean;
  preparationTime: number;
  advanceNoticeRequired: number;
  ingredients?: string[];
  allergens?: string[];
}

export interface UpdateBulkMenuItemData {
  name?: string;
  description?: string;
  category?: string;
  isVeg?: boolean;
  servesPerUnit?: number;
  pricePerUnit?: number;
  unitType?: 'tray' | 'platter' | 'box' | 'container';
  minimumOrder?: number;
  imageUrl?: string;
  isAvailable?: boolean;
  preparationTime?: number;
  advanceNoticeRequired?: number;
  ingredients?: string[];
  allergens?: string[];
}
