// Store active connections
const connections = new Set<ReadableStreamDefaultController>();

interface OrderItem {
  id: string;
  name: string;
  description: string;
  isVeg: boolean;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  userId: string;
  createdAt: string;
}

// Broadcast function to send updates to all connected clients
export function broadcastOrderUpdate(data: {
  type: "order_created" | "order_updated" | "order_deleted";
  order?: Order;
  orderId?: string;
  status?: string;
}) {
  console.log(`Broadcasting ${data.type} to ${connections.size} connections`);
  const message = `data: ${JSON.stringify(data)}\n\n`;

  connections.forEach((controller) => {
    try {
      controller.enqueue(new TextEncoder().encode(message));
    } catch (error) {
      console.error("Failed to send message to connection:", error);
      // Remove dead connections
      connections.delete(controller);
    }
  });
}

// Function to add a connection to the active connections set
export function addConnection(controller: ReadableStreamDefaultController) {
  connections.add(controller);
  console.log(`SSE connection added. Total connections: ${connections.size}`);
}

// Function to remove a connection from the active connections set
export function removeConnection(controller: ReadableStreamDefaultController) {
  connections.delete(controller);
  console.log(`SSE connection removed. Total connections: ${connections.size}`);
}

// Get the number of active connections (for debugging)
export function getConnectionCount() {
  return connections.size;
}

// Utility function to ensure createdAt is always a string
export function ensureDateString(date: string | Date | undefined): string {
  if (!date) return new Date().toISOString();
  return date instanceof Date ? date.toISOString() : date;
}
