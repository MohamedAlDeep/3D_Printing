import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Extract form fields
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const reservationId = formData.get('reservationId') as string;
    const reservationDate = formData.get('reservationDate') as string;
    const review = formData.get('review') as string;
    const stars = formData.get('stars') as string;
    const sizeX = formData.get('sizeX') as string;
    const sizeY = formData.get('sizeY') as string;
    const sizeZ = formData.get('sizeZ') as string;
    const printTime = formData.get('printTime') as string;
    const price = formData.get('price') as string;

    // Debug logging
    console.log('Received reservationId:', reservationId);
    console.log('Received reservationDate:', reservationDate);
    console.log('Received userId:', userId);

    // Validation
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.stl')) {
      return NextResponse.json({ error: 'Only .stl files are allowed' }, { status: 400 });
    }

    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json({ error: 'Valid user ID is required' }, { status: 400 });
    }

    if (!sizeX || !sizeY || !sizeZ || isNaN(parseFloat(sizeX)) || isNaN(parseFloat(sizeY)) || isNaN(parseFloat(sizeZ))) {
      return NextResponse.json({ error: 'Valid dimensions (X, Y, Z) are required' }, { status: 400 });
    }

    if (!printTime || !price || isNaN(parseFloat(price))) {
      return NextResponse.json({ error: 'Print time and valid price are required' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Create size object
    const sizeObject = {
      x: parseFloat(sizeX),
      y: parseFloat(sizeY),
      z: parseFloat(sizeZ)
    };

    // Create order in database
    const order = await prisma.orders.create({
      data: {
        userId: parseInt(userId),
        reservationId: reservationId ? parseInt(reservationId) : null,
        review: review || null,
        stars: stars || null,
        size: JSON.stringify(sizeObject),
        print_time: printTime,
        status: 'pending',
        price: price,
        file: fileBuffer,
      },
    });

    // If we have reservation data, log it for confirmation
    let responseMessage = 'Order created successfully';
    if (reservationId && reservationDate) {
      responseMessage += ` with reservation for ${new Date(reservationDate).toLocaleDateString()}`;
    }

    return NextResponse.json({ 
      success: true, 
      message: responseMessage,
      orderId: order.id,
      reservationId: reservationId ? parseInt(reservationId) : null,
      reservationDate: reservationDate || null
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to create order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
