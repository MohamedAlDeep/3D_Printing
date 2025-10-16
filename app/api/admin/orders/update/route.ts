import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { email: session.user.email }, select: { type: true } })
  if (!me || me.type !== 'admin') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

  const { orderId, patch } = await req.json()
  if (!orderId) return NextResponse.json({ success: false, error: 'orderId required' }, { status: 400 })

  const data: any = {}
  if (typeof patch?.status === 'string') data.status = patch.status.trim()
  if (typeof patch?.price === 'string') data.price = patch.price.trim()
  if (typeof patch?.print_time === 'string') data.print_time = patch.print_time.trim()

  try {
    await prisma.orders.update({ where: { id: Number(orderId) }, data })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Update failed' }, { status: 500 })
  }
}
