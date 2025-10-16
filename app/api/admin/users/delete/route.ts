import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { email: session.user.email }, select: { type: true } })
  if (!me || me.type !== 'admin') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 })

  try {
    await prisma.user.delete({ where: { id: Number(userId) } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Delete failed' }, { status: 500 })
  }
}
