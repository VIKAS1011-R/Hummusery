import { connectToDatabase } from "../connection";
import { User, CreateUserData, UserResponse, OrderHistoryItem } from "../models/User";
import bcrypt from "bcryptjs";

const USERS_COLLECTION = "users";

export class UserService {
  static async createUser(userData: CreateUserData): Promise<UserResponse> {
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>(USERS_COLLECTION);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: userData.email,
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create user document
    const newUser: Omit<User, "_id"> = {
      name: userData.name,
      email: userData.email.toLowerCase(),
      phone: userData.phone,
      password: hashedPassword,
      role: userData.role || "user",
      orderHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert user
    const result = await usersCollection.insertOne(newUser);

    // Return user without password
    const createdUser = await usersCollection.findOne(
      { _id: result.insertedId },
      { projection: { password: 0 } }
    );

    if (!createdUser) {
      throw new Error("Failed to create user");
    }

    return {
      _id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      phone: createdUser.phone,
      role: createdUser.role,
      orderHistory: createdUser.orderHistory || [],
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>(USERS_COLLECTION);

    return await usersCollection.findOne({ email: email.toLowerCase() });
  }

  static async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async addOrderToHistory(
    userId: string,
    orderData: {
      orderId: string;
      orderNumber: string;
      items: {
        name: string;
        quantity: number;
        price: number;
        isVeg: boolean;
      }[];
      totalAmount: number;
      status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
    }
  ): Promise<void> {
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>(USERS_COLLECTION);

    const orderHistoryItem = {
      ...orderData,
      orderDate: new Date(),
    };

    await usersCollection.updateOne(
      { _id: userId },
      {
        $push: { orderHistory: orderHistoryItem },
        $set: { updatedAt: new Date() }
      }
    );
  }

  static async getUserOrderHistory(userId: string): Promise<OrderHistoryItem[]> {
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>(USERS_COLLECTION);

    const user = await usersCollection.findOne(
      { _id: userId },
      { projection: { orderHistory: 1 } }
    );

    return user?.orderHistory || [];
  }

  static async updateOrderStatusInHistory(
    userId: string,
    orderId: string,
    status: "pending" | "preparing" | "ready" | "completed" | "cancelled"
  ): Promise<void> {
    const db = await connectToDatabase();
    const usersCollection = db.collection<User>(USERS_COLLECTION);

    await usersCollection.updateOne(
      { 
        _id: userId,
        "orderHistory.orderId": orderId
      },
      {
        $set: { 
          "orderHistory.$.status": status,
          updatedAt: new Date()
        }
      }
    );
  }
}
