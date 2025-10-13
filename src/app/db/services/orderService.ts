import { connectToDatabase } from "../connection";
import { ObjectId, UpdateFilter } from "mongodb";

export interface OrderItem {
  id: string;
  name: string;
  description: string;
  isVeg: boolean;
  quantity: number;
  price: number;
}

export interface Order {
  _id?: ObjectId;
  orderNumber: string;
  items: OrderItem[];
  status: "pending" | "preparing" | "ready" | "completed";
  customerName: string;
  customerEmail: string;
  userId: string;
  totalAmount: number;
  paymentId?: string;
  razorpayOrderId?: string;
  paymentStatus?: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderHistory {
  _id?: ObjectId;
  userId: string;
  orderNumber: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    isVeg: boolean;
  }[];
  totalAmount: number;
  completedAt: Date;
  originalOrderId: ObjectId;
}

interface UserDocument {
  _id: ObjectId;
  email: string;
  name?: string;
  orderHistory?: OrderHistory[];
}

export class OrderService {
  private static async getActiveOrdersCollection() {
    const maxRetries = 2;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempting to connect to database (attempt ${attempt}/${maxRetries})`);
        const db = await connectToDatabase();
        return db.collection<Order>("activeOrders");
      } catch (error) {
        lastError = error;
        console.error(`Database connection attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          const waitTime = attempt * 2000; // 2s, 4s
          console.log(`Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    console.error("All database connection attempts failed:", lastError);
    throw new Error(`Database connection failed after ${maxRetries} attempts: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`);
  }

  private static async getUsersCollection() {
    const maxRetries = 2;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempting to connect to users collection (attempt ${attempt}/${maxRetries})`);
        const db = await connectToDatabase();
        return db.collection<UserDocument>("users");
      } catch (error) {
        lastError = error;
        console.error(`Users collection connection attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          const waitTime = attempt * 2000; // 2s, 4s
          console.log(`Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    console.error("All users collection connection attempts failed:", lastError);
    throw new Error(`Users collection connection failed after ${maxRetries} attempts: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`);
  }

  // Create a new order with retry mechanism
  static async createOrder(
    orderData: Omit<Order, "_id" | "createdAt" | "updatedAt">
  ): Promise<Order> {
    const maxRetries = 2;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const collection = await this.getActiveOrdersCollection();
        
        const order: Order = {
          ...orderData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await collection.insertOne(order);
        return { ...order, _id: result.insertedId };
      } catch (error) {
        lastError = error;
        console.error(`Order creation attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`Retrying order creation in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    throw lastError;
  }

  // Get all active orders (for admin)
  static async getActiveOrders(): Promise<Order[]> {
    const collection = await this.getActiveOrdersCollection();
    return await collection
      .find({ status: { $ne: "completed" } })
      .sort({ createdAt: -1 })
      .toArray();
  }

  // Update order status
  static async updateOrderStatus(
    orderId: string,
    status: Order["status"]
  ): Promise<boolean> {
    const collection = await this.getActiveOrdersCollection();

    // Validate ObjectId format
    if (!ObjectId.isValid(orderId)) {
      console.error("Invalid ObjectId format:", orderId);
      return false;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    // If order is completed, move to user's order history
    if (status === "completed" && result.modifiedCount > 0) {
      await this.moveToOrderHistory(orderId);
    }

    return result.modifiedCount > 0;
  }

  // Move completed order to user's order history
  private static async moveToOrderHistory(orderId: string): Promise<void> {
    const activeOrdersCollection = await this.getActiveOrdersCollection();
    const usersCollection = await this.getUsersCollection();

    // Get the completed order
    const order = await activeOrdersCollection.findOne({
      _id: new ObjectId(orderId),
    });
    if (!order) return;

    // Create order history entry
    const orderHistory: OrderHistory = {
      userId: order.userId,
      orderNumber: order.orderNumber,
      items: order.items.map((item: OrderItem) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        isVeg: item.isVeg,
      })),
      totalAmount: order.totalAmount,
      completedAt: new Date(),
      originalOrderId: order._id!,
    };

    // Add to user's order history
    const updateFilter: UpdateFilter<UserDocument> = {
      $push: {
        orderHistory: orderHistory,
      },
    };

    await usersCollection.updateOne(
      { _id: new ObjectId(order.userId) },
      updateFilter,
      { upsert: true }
    );

    // Remove from active orders
    await activeOrdersCollection.deleteOne({ _id: new ObjectId(orderId) });
  }

  // Get user's order history
  static async getUserOrderHistory(userId: string): Promise<OrderHistory[]> {
    const usersCollection = await this.getUsersCollection();

    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { orderHistory: 1 } }
    );

    return user?.orderHistory || [];
  }

  // Get order by ID
  static async getOrderById(orderId: string): Promise<Order | null> {
    const collection = await this.getActiveOrdersCollection();

    // Validate ObjectId format
    if (!ObjectId.isValid(orderId)) {
      console.error("Invalid ObjectId format:", orderId);
      return null;
    }

    return await collection.findOne({ _id: new ObjectId(orderId) });
  }

  // Get user's active orders (pending/preparing/ready)
  static async getUserActiveOrders(userId: string): Promise<Order[]> {
    const collection = await this.getActiveOrdersCollection();
    return await collection
      .find({
        userId,
        status: { $ne: "completed" },
      })
      .sort({ createdAt: -1 })
      .toArray();
  }
}
