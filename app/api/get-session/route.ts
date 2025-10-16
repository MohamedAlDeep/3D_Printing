import { NextResponse } from 'next/server';
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated' 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        email: session.user.email,
        name: session.user.name || null,
      }
    });

  } catch (error) {
    console.error('Error getting session:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to get session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}