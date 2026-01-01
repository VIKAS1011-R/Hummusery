import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../connection';
import { BulkMenuItem, CreateBulkMenuItemData, UpdateBulkMenuItemData } from '../models/BulkMenuItem';

export class BulkMenuService {
  private static collectionName = 'bulkMenuItems';

  static async getAllItems(includeUnavailable = false): Promise<BulkMenuItem[]> {
    const db = await connectToDatabase();
    const collection = db.collection<BulkMenuItem>(this.collectionName);
    
    const filter = includeUnavailable ? {} : { isAvailable: true };
    const items = await collection.find(filter).sort({ category: 1, name: 1 }).toArray();
    
    return items;
  }

  static async getItemById(id: string): Promise<BulkMenuItem | null> {
    const db = await connectToDatabase();
    const collection = db.collection<BulkMenuItem>(this.collectionName);
    
    const item = await collection.findOne({ _id: new ObjectId(id) });
    return item;
  }

  static async getItemsByCategory(category: string): Promise<BulkMenuItem[]> {
    const db = await connectToDatabase();
    const collection = db.collection<BulkMenuItem>(this.collectionName);
    
    const items = await collection
      .find({ category, isAvailable: true })
      .sort({ name: 1 })
      .toArray();
    
    return items;
  }

  static async createItem(data: CreateBulkMenuItemData): Promise<BulkMenuItem> {
    const db = await connectToDatabase();
    const collection = db.collection<BulkMenuItem>(this.collectionName);
    
    const newItem: Omit<BulkMenuItem, '_id'> = {
      ...data,
      isAvailable: data.isAvailable ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await collection.insertOne(newItem as BulkMenuItem);
    
    return {
      ...newItem,
      _id: result.insertedId,
    } as BulkMenuItem;
  }

  static async updateItem(id: string, data: UpdateBulkMenuItemData): Promise<BulkMenuItem | null> {
    const db = await connectToDatabase();
    const collection = db.collection<BulkMenuItem>(this.collectionName);
    
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    return result || null;
  }

  static async deleteItem(id: string): Promise<boolean> {
    const db = await connectToDatabase();
    const collection = db.collection<BulkMenuItem>(this.collectionName);
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async getCategories(): Promise<string[]> {
    const db = await connectToDatabase();
    const collection = db.collection<BulkMenuItem>(this.collectionName);
    
    const categories = await collection.distinct('category');
    return categories.sort();
  }
}
