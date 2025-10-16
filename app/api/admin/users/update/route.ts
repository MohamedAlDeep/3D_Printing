import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { email: session.user.email }, select: { type: true } })
  if (!me || me.type !== 'admin') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

  const { userId, patch } = await req.json()
  if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 })

  const data: any = {}
  if (typeof patch?.name === 'string') data.name = patch.name.trim()
  if (typeof patch?.phone === 'string') data.phone = patch.phone.trim()
  if (typeof patch?.gender === 'string') data.gender = patch.gender.trim()
  if (typeof patch?.type === 'string') data.type = patch.type.trim()
  if (typeof patch?.address === 'string') data.address = patch.address.trim()

  try {
    await prisma.user.update({ where: { id: Number(userId) }, data })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Update failed' }, { status: 500 })
  }
}
