import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/app/db/connection';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;



    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verify(token, JWT_SECRET) as { 
      userId: string; 
      email: string; 
      name: string; 
      phone: string;
      role: string;
      isEmailVerified?: boolean;
    };
    


    // Fetch latest user data from database to ensure we have current verification status
    try {
      const db = await connectToDatabase();
      const usersCollection = db.collection("users");
      const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
      
      if (user) {
        return NextResponse.json({
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            phone: user.phone || "",
            role: user.role || "customer",
            isEmailVerified: user.isEmailVerified || false
          }
        });
      }
    } catch (dbError) {
      console.error("Database error in auth check, falling back to token data:", dbError);
    }
    
    // Fallback to token data if database query fails
    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        phone: decoded.phone,
        role: decoded.role,
        isEmailVerified: decoded.isEmailVerified || false
      }
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null });
  }
}