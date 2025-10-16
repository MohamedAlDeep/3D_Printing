import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all reservations from the database
    const reservations = await prisma.reservations.findMany({
      select: {
        date: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Extract just the dates and convert to ISO strings for JSON serialization
    const reservedDates = reservations.map(reservation => 
      reservation.date.toISOString()
    );

    return NextResponse.json({ 
      success: true, 
      reservedDates,
      count: reservedDates.length
    });

  } catch (error) {
    console.error('Error fetching reserved dates:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch reserved dates',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}