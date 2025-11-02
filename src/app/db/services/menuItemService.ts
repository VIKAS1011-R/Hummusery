import { connectToDatabase } from "../connection";
import { MenuItem, CreateMenuItemData, UpdateMenuItemData, MenuItemResponse } from "../models/MenuItem";
import { ObjectId } from "mongodb";

const MENU_ITEMS_COLLECTION = "menuItems";

export class MenuItemService {
  static async createMenuItem(itemData: CreateMenuItemData): Promise<MenuItemResponse> {
    const db = await connectToDatabase();
    const menuItemsCollection = db.collection<MenuItem>(MENU_ITEMS_COLLECTION);

    // Check if menu item with same name already exists
    const existingItem = await menuItemsCollection.findOne({
      name: { $regex: new RegExp(`^${itemData.name}$`, 'i') }
    });
    
    if (existingItem) {
      throw new Error("Menu item with this name already exists");
    }

    // Create menu item document
    const newMenuItem: Omit<MenuItem, "_id"> = {
      name: itemData.name.trim(),
      ingredients: itemData.ingredients.trim(),
      isVeg: itemData.isVeg,
      price: itemData.price,
      halfPlatePrice: itemData.halfPlatePrice || null,
      category: itemData.category?.trim() || "Shawarma Combos",
      isAvailable: itemData.isAvailable !== undefined ? itemData.isAvailable : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert menu item
    const result = await menuItemsCollection.insertOne(newMenuItem);

    // Return created menu item
    const createdItem = await menuItemsCollection.findOne({ _id: result.insertedId });

    if (!createdItem) {
      throw new Error("Failed to create menu item");
    }

    return {
      _id: createdItem._id.toString(),
      name: createdItem.name,
      ingredients: createdItem.ingredients,
      isVeg: createdItem.isVeg,
      price: createdItem.price,
      halfPlatePrice: createdItem.halfPlatePrice,
      category: createdItem.category,
      isAvailable: createdItem.isAvailable,
      createdAt: createdItem.createdAt,
      updatedAt: createdItem.updatedAt,
    };
  }

  static async getAllMenuItems(includeUnavailable: boolean = false): Promise<MenuItemResponse[]> {
    const db = await connectToDatabase();
    const menuItemsCollection = db.collection<MenuItem>(MENU_ITEMS_COLLECTION);

    const filter = includeUnavailable ? {} : { isAvailable: true };
    const items = await menuItemsCollection.find(filter).sort({ category: 1, name: 1 }).toArray();

    return items.map(item => ({
      _id: item._id!.toString(),
      name: item.name,
      ingredients: item.ingredients,
      isVeg: item.isVeg,
      price: item.price,
      halfPlatePrice: item.halfPlatePrice,
      category: item.category,
      isAvailable: item.isAvailable,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }

  static async getMenuItemById(id: string): Promise<MenuItemResponse | null> {
    const db = await connectToDatabase();
    const menuItemsCollection = db.collection<MenuItem>(MENU_ITEMS_COLLECTION);

    if (!ObjectId.isValid(id)) {
      return null;
    }

    const item = await menuItemsCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return null;
    }

    return {
      _id: item._id!.toString(),
      name: item.name,
      ingredients: item.ingredients,
      isVeg: item.isVeg,
      price: item.price,
      halfPlatePrice: item.halfPlatePrice,
      category: item.category,
      isAvailable: item.isAvailable,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  static async updateMenuItem(id: string, updateData: UpdateMenuItemData): Promise<MenuItemResponse | null> {
    const db = await connectToDatabase();
    const menuItemsCollection = db.collection<MenuItem>(MENU_ITEMS_COLLECTION);

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid menu item ID");
    }

    // Check if name is being updated and if it conflicts with existing items
    if (updateData.name) {
      const existingItem = await menuItemsCollection.findOne({
        name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
        _id: { $ne: new ObjectId(id) }
      });
      
      if (existingItem) {
        throw new Error("Menu item with this name already exists");
      }
    }

    const updateFields: Partial<MenuItem> = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Clean up string fields
    if (updateFields.name) {
      updateFields.name = updateFields.name.trim();
    }
    if (updateFields.ingredients) {
      updateFields.ingredients = updateFields.ingredients.trim();
    }
    if (updateFields.category) {
      updateFields.category = updateFields.category.trim();
    }

    const result = await menuItemsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) {
      return null;
    }

    return {
      _id: result._id!.toString(),
      name: result.name,
      ingredients: result.ingredients,
      isVeg: result.isVeg,
      price: result.price,
      halfPlatePrice: result.halfPlatePrice,
      category: result.category,
      isAvailable: result.isAvailable,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  static async deleteMenuItem(id: string): Promise<boolean> {
    const db = await connectToDatabase();
    const menuItemsCollection = db.collection<MenuItem>(MENU_ITEMS_COLLECTION);

    if (!ObjectId.isValid(id)) {
      return false;
    }

    const result = await menuItemsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  static async getMenuItemsByCategory(category: string): Promise<MenuItemResponse[]> {
    const db = await connectToDatabase();
    const menuItemsCollection = db.collection<MenuItem>(MENU_ITEMS_COLLECTION);

    const items = await menuItemsCollection
      .find({ 
        category: { $regex: new RegExp(`^${category}$`, 'i') },
        isAvailable: true 
      })
      .sort({ name: 1 })
      .toArray();

    return items.map(item => ({
      _id: item._id!.toString(),
      name: item.name,
      ingredients: item.ingredients,
      isVeg: item.isVeg,
      price: item.price,
      halfPlatePrice: item.halfPlatePrice,
      category: item.category,
      isAvailable: item.isAvailable,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }

  static async getVegMenuItems(): Promise<MenuItemResponse[]> {
    const db = await connectToDatabase();
    const menuItemsCollection = db.collection<MenuItem>(MENU_ITEMS_COLLECTION);

    const items = await menuItemsCollection
      .find({ isVeg: true, isAvailable: true })
      .sort({ category: 1, name: 1 })
      .toArray();

    return items.map(item => ({
      _id: item._id!.toString(),
      name: item.name,
      ingredients: item.ingredients,
      isVeg: item.isVeg,
      price: item.price,
      halfPlatePrice: item.halfPlatePrice,
      category: item.category,
      isAvailable: item.isAvailable,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }
}