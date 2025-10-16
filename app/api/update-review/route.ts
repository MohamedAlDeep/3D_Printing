import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../lib/generated/prisma';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { orderId, review, stars } = await req.json();

    // Validation
    if (!orderId || isNaN(parseInt(orderId))) {
      return NextResponse.json({ error: 'Valid order ID is required' }, { status: 400 });
    }

    if (!review || review.trim().length === 0) {
      return NextResponse.json({ error: 'Review text is required' }, { status: 400 });
    }

    if (stars !== null && (isNaN(parseInt(stars)) || parseInt(stars) < 1 || parseInt(stars) > 5)) {
      return NextResponse.json({ error: 'Stars must be between 1 and 5' }, { status: 400 });
    }

    // Check if order exists and belongs to the logged-in user, and is delivered
    const existingOrder = await prisma.orders.findFirst({
      where: {
        id: parseInt(orderId),
        status: 'delivered',
        user: { email: session.user.email },
      },
      select: { id: true }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update the order with review and stars
    const updatedOrder = await prisma.orders.update({
      where: { id: parseInt(orderId) },
      data: {
        review: review.trim(),
        stars: stars ? stars.toString() : null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Review updated successfully',
      order: {
        id: updatedOrder.id,
        review: updatedOrder.review,
        stars: updatedOrder.stars,
      }
    });

  } catch (error) {
    console.error('Review update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update review',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}