import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { date, userId } = await req.json();

    // Validation
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json({ error: 'Valid user ID is required' }, { status: 400 });
    }

    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the date is in the future
    if (reservationDate < today) {
      return NextResponse.json({ error: 'Cannot reserve dates in the past' }, { status: 400 });
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the date is already reserved
    const existingReservation = await prisma.reservations.findFirst({
      where: {
        date: reservationDate,
      },
    });

    if (existingReservation) {
      return NextResponse.json({ error: 'This date is already reserved' }, { status: 400 });
    }

    // Create the reservation with user ID
    const reservation = await prisma.reservations.create({
      data: {
        userId: parseInt(userId),
        date: reservationDate,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Date reserved successfully',
      reservation: {
        id: reservation.id,
        date: reservation.date,
        user: reservation.user,
      }
    });

  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json({ 
      error: 'Failed to reserve date',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}