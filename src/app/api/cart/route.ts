import { NextRequest, NextResponse } from "next/server";
import { CartService } from "@/app/db/services/cartService";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function getUserFromToken(request: NextRequest): string | null {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;

    const decoded = verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const cart = await CartService.getOrCreateCart(userId);

    return NextResponse.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch cart" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { menuItemId, quantity } = body;

    if (!menuItemId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid menu item ID or quantity" },
        { status: 400 }
      );
    }

    const cart = await CartService.addToCart(userId, { menuItemId, quantity });

    return NextResponse.json({
      success: true,
      cart,
      message: "Item added to cart successfully"
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message.includes("not available")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to add item to cart" 
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { menuItemId, quantity } = body;

    if (!menuItemId || quantity < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid menu item ID or quantity" },
        { status: 400 }
      );
    }

    const cart = await CartService.updateCartItem(userId, { menuItemId, quantity });

    return NextResponse.json({
      success: true,
      cart,
      message: "Cart updated successfully"
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update cart" 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    await CartService.clearCart(userId);

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to clear cart" 
      },
      { status: 500 }
    );
  }
}