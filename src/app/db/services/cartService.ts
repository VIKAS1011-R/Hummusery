import { connectToDatabase } from "../connection";
import { Cart, CartItem, AddToCartData, UpdateCartItemData, CartResponse } from "../models/Cart";
import { MenuItemService } from "./menuItemService";
import { ObjectId } from "mongodb";

const CARTS_COLLECTION = "carts";

export class CartService {
  static async getOrCreateCart(userId: string): Promise<CartResponse> {
    const db = await connectToDatabase();
    const cartsCollection = db.collection<Cart>(CARTS_COLLECTION);

    let cart = await cartsCollection.findOne({ userId });

    if (!cart) {
      // Create new cart
      const newCart: Omit<Cart, "_id"> = {
        userId,
        items: [],
        totalAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await cartsCollection.insertOne(newCart);
      cart = await cartsCollection.findOne({ _id: result.insertedId });
    }

    if (!cart) {
      throw new Error("Failed to create or retrieve cart");
    }

    return this.formatCartResponse(cart);
  }

  static async addToCart(userId: string, addData: AddToCartData): Promise<CartResponse> {
    const db = await connectToDatabase();
    const cartsCollection = db.collection<Cart>(CARTS_COLLECTION);

    // Get menu item details
    const menuItem = await MenuItemService.getMenuItemById(addData.menuItemId);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    if (!menuItem.isAvailable) {
      throw new Error("Menu item is not available");
    }

    // Get or create cart
    let cart = await cartsCollection.findOne({ userId });

    if (!cart) {
      const newCart: Omit<Cart, "_id"> = {
        userId,
        items: [],
        totalAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const result = await cartsCollection.insertOne(newCart);
      cart = await cartsCollection.findOne({ _id: result.insertedId });
      
      if (!cart) {
        throw new Error("Failed to create cart");
      }
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItemId === addData.menuItemId
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += addData.quantity;
    } else {
      // Add new item to cart
      const cartItem: CartItem = {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: addData.quantity,
        isVeg: menuItem.isVeg,
        ingredients: menuItem.ingredients,
      };
      cart.items.push(cartItem);
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
    cart.updatedAt = new Date();

    // Update cart
    const updateData: Partial<Cart> = {
      items: cart.items,
      totalAmount: cart.totalAmount,
      updatedAt: cart.updatedAt,
    };

    await cartsCollection.updateOne(
      { userId },
      { $set: updateData }
    );

    const updatedCart = await cartsCollection.findOne({ userId });
    if (!updatedCart) {
      throw new Error("Failed to update cart");
    }

    return this.formatCartResponse(updatedCart);
  }

  static async updateCartItem(userId: string, updateData: UpdateCartItemData): Promise<CartResponse> {
    const db = await connectToDatabase();
    const cartsCollection = db.collection<Cart>(CARTS_COLLECTION);

    const cart = await cartsCollection.findOne({ userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    if (updateData.quantity <= 0) {
      // Remove item from cart
      cart.items = cart.items.filter(item => item.menuItemId !== updateData.menuItemId);
    } else {
      // Update item quantity
      const itemIndex = cart.items.findIndex(item => item.menuItemId === updateData.menuItemId);
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity = updateData.quantity;
      } else {
        throw new Error("Item not found in cart");
      }
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
    cart.updatedAt = new Date();

    await cartsCollection.replaceOne({ userId }, cart);

    const updatedCart = await cartsCollection.findOne({ userId });
    if (!updatedCart) {
      throw new Error("Failed to update cart");
    }

    return this.formatCartResponse(updatedCart);
  }

  static async removeFromCart(userId: string, menuItemId: string): Promise<CartResponse> {
    const db = await connectToDatabase();
    const cartsCollection = db.collection<Cart>(CARTS_COLLECTION);

    const cart = await cartsCollection.findOne({ userId });
    if (!cart) {
      throw new Error("Cart not found");
    }

    // Remove item from cart
    cart.items = cart.items.filter(item => item.menuItemId !== menuItemId);

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
    cart.updatedAt = new Date();

    await cartsCollection.replaceOne({ userId }, cart);

    const updatedCart = await cartsCollection.findOne({ userId });
    if (!updatedCart) {
      throw new Error("Failed to update cart");
    }

    return this.formatCartResponse(updatedCart);
  }

  static async clearCart(userId: string): Promise<void> {
    const db = await connectToDatabase();
    const cartsCollection = db.collection<Cart>(CARTS_COLLECTION);

    await cartsCollection.updateOne(
      { userId },
      {
        $set: {
          items: [],
          totalAmount: 0,
          updatedAt: new Date(),
        }
      }
    );
  }

  static async getCart(userId: string): Promise<CartResponse | null> {
    const db = await connectToDatabase();
    const cartsCollection = db.collection<Cart>(CARTS_COLLECTION);

    const cart = await cartsCollection.findOne({ userId });
    if (!cart) {
      return null;
    }

    return this.formatCartResponse(cart);
  }

  private static formatCartResponse(cart: Cart): CartResponse {
    return {
      _id: cart._id!.toString(),
      userId: cart.userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      itemCount: cart.items.reduce((count, item) => count + item.quantity, 0),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
}