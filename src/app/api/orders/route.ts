import { NextRequest, NextResponse } from "next/server";

// Mock data for demonstration - replace with actual database queries
const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD-001",
    items: [
      {
        id: "item-1",
        name: "Classic Hummus Bowl",
        description: "Creamy hummus with olive oil, paprika, and fresh herbs",
        isVeg: true,
        quantity: 2,
        price: 975
      },
      {
        id: "item-2",
        name: "Chicken Shawarma Wrap",
        description: "Grilled chicken with garlic sauce and vegetables",
        isVeg: false,
        quantity: 1,
        price: 1200
      }
    ],
    status: "pending" as const,
    customerName: "John Doe",
    customerEmail: "john@example.com",
    totalAmount: 3150,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    items: [
      {
        id: "item-3",
        name: "Falafel Platter",
        description: "Crispy falafel with tahini sauce and salad",
        isVeg: true,
        quantity: 1,
        price: 1125
      }
    ],
    status: "preparing" as const,
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    totalAmount: 1125,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    items: [
      {
        id: "item-4",
        name: "Lamb Kebab Plate",
        description: "Grilled lamb skewers with rice and grilled vegetables",
        isVeg: false,
        quantity: 1,
        price: 1725
      },
      {
        id: "item-5",
        name: "Baba Ganoush",
        description: "Smoky eggplant dip with pita bread",
        isVeg: true,
        quantity: 1,
        price: 675
      }
    ],
    status: "ready" as const,
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    totalAmount: 2400,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
  },
  {
    id: "4",
    orderNumber: "ORD-004",
    items: [
      {
        id: "item-6",
        name: "Vegetarian Mezze Platter",
        description: "Assorted dips, olives, and fresh vegetables",
        isVeg: true,
        quantity: 1,
        price: 1425
      }
    ],
    status: "completed" as const,
    customerName: "Sarah Wilson",
    customerEmail: "sarah@example.com",
    totalAmount: 1425,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would:
    // 1. Verify admin authentication
    // 2. Query the database for orders
    // 3. Apply any filters or pagination
    
    // For now, return mock data
    return NextResponse.json({
      success: true,
      orders: mockOrders
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real application, you would:
    // 1. Validate the order data
    // 2. Save to database
    // 3. Generate order number
    // 4. Send confirmation emails
    
    const newOrder = {
      id: Date.now().toString(),
      orderNumber: `ORD-${String(mockOrders.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString()
    };
    
    mockOrders.push(newOrder);
    
    return NextResponse.json({
      success: true,
      order: newOrder
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}