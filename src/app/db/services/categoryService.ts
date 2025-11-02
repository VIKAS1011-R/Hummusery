import { connectToDatabase } from "../connection";
import { Category, CreateCategoryData, UpdateCategoryData, CategoryResponse } from "../models/Category";
import { ObjectId } from "mongodb";

const CATEGORIES_COLLECTION = "categories";

export class CategoryService {
  static async createCategory(categoryData: CreateCategoryData): Promise<CategoryResponse> {
    const db = await connectToDatabase();
    const categoriesCollection = db.collection<Category>(CATEGORIES_COLLECTION);

    // Check if category with same name already exists
    const existingCategory = await categoriesCollection.findOne({
      name: { $regex: new RegExp(`^${categoryData.name}$`, 'i') }
    });
    
    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }

    // Get the next sort order
    const lastCategory = await categoriesCollection.findOne(
      {},
      { sort: { sortOrder: -1 } }
    );
    const nextSortOrder = lastCategory ? lastCategory.sortOrder + 1 : 1;

    // Create category document
    const newCategory: Omit<Category, "_id"> = {
      name: categoryData.name.trim(),
      description: categoryData.description?.trim() || "",
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      sortOrder: categoryData.sortOrder !== undefined ? categoryData.sortOrder : nextSortOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert category
    const result = await categoriesCollection.insertOne(newCategory);

    // Return created category
    const createdCategory = await categoriesCollection.findOne({ _id: result.insertedId });

    if (!createdCategory) {
      throw new Error("Failed to create category");
    }

    return {
      _id: createdCategory._id.toString(),
      name: createdCategory.name,
      description: createdCategory.description,
      isActive: createdCategory.isActive,
      sortOrder: createdCategory.sortOrder,
      createdAt: createdCategory.createdAt,
      updatedAt: createdCategory.updatedAt,
    };
  }

  static async getAllCategories(includeInactive: boolean = false): Promise<CategoryResponse[]> {
    const db = await connectToDatabase();
    const categoriesCollection = db.collection<Category>(CATEGORIES_COLLECTION);

    const filter = includeInactive ? {} : { isActive: true };
    const categories = await categoriesCollection.find(filter).sort({ sortOrder: 1, name: 1 }).toArray();

    return categories.map(category => ({
      _id: category._id!.toString(),
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  }

  static async getCategoryById(id: string): Promise<CategoryResponse | null> {
    const db = await connectToDatabase();
    const categoriesCollection = db.collection<Category>(CATEGORIES_COLLECTION);

    if (!ObjectId.isValid(id)) {
      return null;
    }

    const category = await categoriesCollection.findOne({ _id: new ObjectId(id) });

    if (!category) {
      return null;
    }

    return {
      _id: category._id!.toString(),
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  static async updateCategory(id: string, updateData: UpdateCategoryData): Promise<CategoryResponse | null> {
    const db = await connectToDatabase();
    const categoriesCollection = db.collection<Category>(CATEGORIES_COLLECTION);

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid category ID");
    }

    // Check if name is being updated and if it conflicts with existing categories
    if (updateData.name) {
      const existingCategory = await categoriesCollection.findOne({
        name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
        _id: { $ne: new ObjectId(id) }
      });
      
      if (existingCategory) {
        throw new Error("Category with this name already exists");
      }
    }

    const updateFields: Partial<Category> = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Clean up string fields
    if (updateFields.name) {
      updateFields.name = updateFields.name.trim();
    }
    if (updateFields.description) {
      updateFields.description = updateFields.description.trim();
    }

    const result = await categoriesCollection.findOneAndUpdate(
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
      description: result.description,
      isActive: result.isActive,
      sortOrder: result.sortOrder,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  static async deleteCategory(id: string): Promise<boolean> {
    const db = await connectToDatabase();
    const categoriesCollection = db.collection<Category>(CATEGORIES_COLLECTION);

    if (!ObjectId.isValid(id)) {
      return false;
    }

    // Check if category is being used by any menu items
    const menuItemsCollection = db.collection("menuItems");
    const menuItemsUsingCategory = await menuItemsCollection.countDocuments({ category: id });
    
    if (menuItemsUsingCategory > 0) {
      throw new Error("Cannot delete category that is being used by menu items");
    }

    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  static async initializeDefaultCategories(): Promise<void> {
    const db = await connectToDatabase();
    const categoriesCollection = db.collection<Category>(CATEGORIES_COLLECTION);

    // Check if categories already exist
    const existingCount = await categoriesCollection.countDocuments();
    if (existingCount > 0) {
      return; // Categories already initialized
    }

    const defaultCategories = [
      { name: "Grab-and-Go Treats", sortOrder: 1 },
      { name: "Shawarma Combos", sortOrder: 2 },
      { name: "Indian Combos", sortOrder: 3 },
      { name: "The Grand Feast", sortOrder: 4 },
      { name: "Rice And Noodles Bowls", sortOrder: 5 },
      { name: "Veg Rolls", sortOrder: 6 },
      { name: "Chicken Rolls", sortOrder: 7 },
      { name: "Chinese Veg Rolls", sortOrder: 8 },
      { name: "Chinese Chicken Rolls", sortOrder: 9 },
      { name: "Beverages", sortOrder: 10 },
      { name: "Desserts", sortOrder: 11 }
    ];

    const categoriesToInsert = defaultCategories.map(cat => ({
      name: cat.name,
      description: "",
      isActive: true,
      sortOrder: cat.sortOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await categoriesCollection.insertMany(categoriesToInsert);
  }
}