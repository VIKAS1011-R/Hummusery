import { MenuItemService } from "../services/menuItemService";
import { CreateMenuItemData } from "../models/MenuItem";

const sampleMenuItems: CreateMenuItemData[] = [
  {
    name: "Classic Hummus Bowl",
    ingredients: "Creamy chickpea hummus topped with olive oil, paprika, and fresh herbs.\nServed with warm pita bread and fresh vegetables.",
    isVeg: true,
    price: 975,
    category: "Appetizers",
    isAvailable: true
  },
  {
    name: "Chicken Shawarma Wrap",
    ingredients: "Marinated grilled chicken with garlic sauce, pickles, and fresh vegetables.\nWrapped in soft lavash bread with tahini sauce.",
    isVeg: false,
    price: 1200,
    category: "Main Course",
    isAvailable: true
  },
  {
    name: "Falafel Platter",
    ingredients: "Crispy deep-fried chickpea balls with tahini sauce and fresh salad.\nServed with hummus, pickles, and warm pita bread.",
    isVeg: true,
    price: 1125,
    category: "Main Course",
    isAvailable: true
  },
  {
    name: "Lamb Kebab Plate",
    ingredients: "Grilled lamb skewers marinated in Middle Eastern spices.\nServed with basmati rice, grilled vegetables, and mint yogurt sauce.",
    isVeg: false,
    price: 1725,
    category: "Main Course",
    isAvailable: true
  },
  {
    name: "Baba Ganoush",
    ingredients: "Smoky roasted eggplant dip blended with tahini and garlic.\nGarnished with pomegranate seeds and served with pita bread.",
    isVeg: true,
    price: 675,
    category: "Appetizers",
    isAvailable: true
  },
  {
    name: "Vegetarian Mezze Platter",
    ingredients: "Assorted Middle Eastern dips including hummus, baba ganoush, and muhammara.\nServed with olives, fresh vegetables, and warm pita bread.",
    isVeg: true,
    price: 1425,
    category: "Main Course",
    isAvailable: true
  },
  {
    name: "Beef Kofta",
    ingredients: "Spiced ground beef skewers grilled to perfection with onions and herbs.\nServed with rice pilaf, grilled tomatoes, and yogurt sauce.",
    isVeg: false,
    price: 1550,
    category: "Main Course",
    isAvailable: true
  },
  {
    name: "Tabbouleh Salad",
    ingredients: "Fresh parsley salad with tomatoes, onions, and bulgur wheat.\nDressed with lemon juice, olive oil, and Mediterranean herbs.",
    isVeg: true,
    price: 825,
    category: "Salads",
    isAvailable: true
  },
  {
    name: "Grilled Halloumi",
    ingredients: "Pan-grilled Cypriot cheese with honey drizzle and za'atar seasoning.\nServed with fresh mint leaves and warm pita triangles.",
    isVeg: true,
    price: 950,
    category: "Appetizers",
    isAvailable: true
  },
  {
    name: "Fish Tagine",
    ingredients: "Fresh fish cooked in aromatic Moroccan spices with preserved lemons.\nSlow-cooked with olives, tomatoes, and served with couscous.",
    isVeg: false,
    price: 1875,
    category: "Main Course",
    isAvailable: true
  },
  {
    name: "Stuffed Grape Leaves",
    ingredients: "Tender grape leaves stuffed with rice, pine nuts, and fresh herbs.\nCooked in lemon broth and served with yogurt dipping sauce.",
    isVeg: true,
    price: 775,
    category: "Appetizers",
    isAvailable: true
  },
  {
    name: "Baklava",
    ingredients: "Layers of crispy phyllo pastry filled with chopped nuts and honey syrup.\nTraditionally made with pistachios and finished with rose water.",
    isVeg: true,
    price: 450,
    category: "Desserts",
    isAvailable: true
  }
];

export async function seedMenuItems() {
  console.log("🌱 Starting to seed menu items...");
  
  try {
    let createdCount = 0;
    let skippedCount = 0;

    for (const itemData of sampleMenuItems) {
      try {
        await MenuItemService.createMenuItem(itemData);
        createdCount++;
        console.log(`✅ Created: ${itemData.name}`);
      } catch (error) {
        if (error instanceof Error && error.message.includes("already exists")) {
          skippedCount++;
          console.log(`⏭️  Skipped (already exists): ${itemData.name}`);
        } else {
          console.error(`❌ Failed to create ${itemData.name}:`, error);
        }
      }
    }

    console.log(`\n🎉 Menu items seeding completed!`);
    console.log(`📊 Created: ${createdCount} items`);
    console.log(`⏭️  Skipped: ${skippedCount} items`);
    
    return { created: createdCount, skipped: skippedCount };
  } catch (error) {
    console.error("❌ Error seeding menu items:", error);
    throw error;
  }
}

// Run this script directly if called
if (require.main === module) {
  seedMenuItems()
    .then(() => {
      console.log("✅ Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}