import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/db/connection";

const sampleBulkMenuItems = [
  {
    name: "Hummus Party Platter",
    description: "Large platter of our signature hummus served with fresh pita bread, olive oil drizzle, and garnishes",
    category: "Appetizers",
    isVeg: true,
    servesPerUnit: 15,
    pricePerUnit: 1200,
    unitType: "platter",
    minimumOrder: 1,
    isAvailable: true,
    preparationTime: 2,
    advanceNoticeRequired: 24,
    ingredients: ["Chickpeas", "Tahini", "Lemon", "Garlic", "Olive Oil", "Pita Bread"],
    allergens: ["Sesame", "Gluten"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Mixed Grill Platter",
    description: "Assorted grilled meats including chicken kebabs, lamb kofta, and beef shawarma with sides",
    category: "Main Course",
    isVeg: false,
    servesPerUnit: 20,
    pricePerUnit: 3500,
    unitType: "platter",
    minimumOrder: 1,
    isAvailable: true,
    preparationTime: 3,
    advanceNoticeRequired: 48,
    ingredients: ["Chicken", "Lamb", "Beef", "Spices", "Rice", "Salad"],
    allergens: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Falafel Party Box",
    description: "Crispy falafel balls with tahini sauce, pickles, and fresh vegetables",
    category: "Appetizers",
    isVeg: true,
    servesPerUnit: 25,
    pricePerUnit: 1500,
    unitType: "box",
    minimumOrder: 2,
    isAvailable: true,
    preparationTime: 2,
    advanceNoticeRequired: 24,
    ingredients: ["Chickpeas", "Herbs", "Spices", "Tahini", "Vegetables"],
    allergens: ["Sesame"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Vegetarian Mezze Tray",
    description: "Assorted vegetarian mezze including baba ganoush, tabbouleh, stuffed grape leaves, and more",
    category: "Appetizers",
    isVeg: true,
    servesPerUnit: 18,
    pricePerUnit: 1800,
    unitType: "tray",
    minimumOrder: 1,
    isAvailable: true,
    preparationTime: 3,
    advanceNoticeRequired: 24,
    ingredients: ["Eggplant", "Bulgur", "Grape Leaves", "Vegetables", "Olive Oil"],
    allergens: ["Gluten"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Biryani Party Container",
    description: "Aromatic basmati rice with your choice of chicken or vegetable, served with raita and salad",
    category: "Main Course",
    isVeg: false,
    servesPerUnit: 30,
    pricePerUnit: 2800,
    unitType: "container",
    minimumOrder: 1,
    isAvailable: true,
    preparationTime: 4,
    advanceNoticeRequired: 48,
    ingredients: ["Basmati Rice", "Chicken/Vegetables", "Spices", "Yogurt", "Herbs"],
    allergens: ["Dairy"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Baklava Dessert Platter",
    description: "Assorted Middle Eastern sweets including baklava, kunafa, and date cookies",
    category: "Desserts",
    isVeg: true,
    servesPerUnit: 20,
    pricePerUnit: 1400,
    unitType: "platter",
    minimumOrder: 1,
    isAvailable: true,
    preparationTime: 2,
    advanceNoticeRequired: 24,
    ingredients: ["Phyllo Dough", "Nuts", "Honey", "Butter", "Dates"],
    allergens: ["Nuts", "Gluten", "Dairy"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function POST() {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('bulkMenuItems');

    // Clear existing bulk menu items
    await collection.deleteMany({});

    // Insert sample items
    const result = await collection.insertMany(sampleBulkMenuItems);

    return NextResponse.json({
      success: true,
      message: `Seeded ${result.insertedCount} bulk menu items successfully`,
      count: result.insertedCount,
    });
  } catch (error) {
    console.error("Error seeding bulk menu:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed bulk menu items" },
      { status: 500 }
    );
  }
}
