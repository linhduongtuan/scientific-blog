import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ 
        authenticated: false,
        message: "Not authenticated" 
      });
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        subscribed: user.subscribed
      }
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json({ 
      authenticated: false, 
      error: "Failed to check authentication status" 
    }, { status: 500 });
  }
}
