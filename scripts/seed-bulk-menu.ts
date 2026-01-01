import { MongoClient } from 'mongodb';

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

async function seedBulkMenu() {
  const uri = process.env.DATABASE_URL;
  
  if (!uri) {
    console.error('DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('Hummusery_Data');
    const collection = db.collection('bulkMenuItems');

    // Clear existing bulk menu items
    await collection.deleteMany({});
    console.log('Cleared existing bulk menu items');

    // Insert sample items
    const result = await collection.insertMany(sampleBulkMenuItems);
    console.log(`Inserted ${result.insertedCount} bulk menu items`);

    console.log('\nSample bulk menu items added successfully!');
    console.log('You can now view them at: http://localhost:3000/party-orders');
  } catch (error) {
    console.error('Error seeding bulk menu:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

seedBulkMenu();
