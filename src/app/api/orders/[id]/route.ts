import { NextRequest, NextResponse } from "next/server";

// Mock data - in production, this would be stored in a database
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
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
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
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
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
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const order = mockOrders.find(o => o.id === orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const body = await request.json();
    
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }
    
    // Update the order
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      ...body
    };
    
    return NextResponse.json({
      success: true,
      order: mockOrders[orderIndex]
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }
    
    // Remove the order
    mockOrders.splice(orderIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete order" },
      { status: 500 }
    );
  }
}