import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { name, phone, gender, address } = body as Partial<{
      name: string;
      phone: string;
      gender: string;
      address: string;
    }>;

    // Build update data with only provided fields
    const data: Record<string, any> = {};
    if (typeof name === 'string') data.name = name.trim();
    if (typeof phone === 'string') data.phone = phone.trim();
    if (typeof gender === 'string') data.gender = gender.trim();
    if (typeof address === 'string') data.address = address.trim();

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        gender: true,
        address: true,
        createdAt: true,
        type: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
