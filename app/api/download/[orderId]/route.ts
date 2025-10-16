import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../lib/generated/prisma';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const orderId = parseInt(params.orderId);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Fetch the order with the file and user for authorization
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        file: true,
        createdAt: true,
        user: { select: { email: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.file) {
      return NextResponse.json({ error: 'No file associated with this order' }, { status: 404 });
    }

    // Authorization: allow admins or the owner of the order
    const me = await prisma.user.findUnique({ where: { email: session.user.email }, select: { type: true } });
    const isAdmin = me?.type === 'admin';
    const isOwner = order.user?.email === session.user.email;
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create a filename based on order ID and date
    const date = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `order-${order.id}-${date}.stl`;

    // Return the file as a download
    return new NextResponse(Buffer.from(order.file), {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': order.file.length.toString(),
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      error: 'Failed to download file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}