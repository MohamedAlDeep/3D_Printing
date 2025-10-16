import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { email: session.user.email }, select: { type: true } })
  if (!me || me.type !== 'admin') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { q, status, createdFrom, createdTo, userEmail, orderId } = body || {}

  const where: any = { AND: [] as any[] }
  if (orderId && !isNaN(parseInt(orderId))) where.AND.push({ id: Number(orderId) })
  if (status) where.AND.push({ status })
  if (userEmail) where.AND.push({ user: { email: { contains: userEmail, mode: 'insensitive' } } })
  if (createdFrom || createdTo) {
    const createdAt: any = {}
    if (createdFrom) createdAt.gte = new Date(createdFrom)
    if (createdTo) { const dt = new Date(createdTo); dt.setHours(23,59,59,999); createdAt.lte = dt }
    where.AND.push({ createdAt })
  }
  if (q && typeof q === 'string' && q.trim()) {
    const s = q.trim()
    where.AND.push({
      OR: [
        { price: { contains: s, mode: 'insensitive' } },
        { print_time: { contains: s, mode: 'insensitive' } },
        { user: { email: { contains: s, mode: 'insensitive' } } },
      ]
    })
  }

  try {
    const orders = await prisma.orders.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: { id: true, status: true, price: true, print_time: true, createdAt: true, user: { select: { email: true } } },
    })
    return NextResponse.json({ success: true, orders })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Search failed' }, { status: 500 })
  }
}
