import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { email: session.user.email }, select: { type: true } })
  if (!me || me.type !== 'admin') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { q, type, gender, hasAddress, createdFrom, createdTo, userId } = body || {}

  const commonWhere: any = {
    AND: [] as any[],
  }

  if (userId && !isNaN(parseInt(userId))) {
    commonWhere.AND.push({ id: Number(userId) })
  }
  if (type) commonWhere.AND.push({ type })
  if (gender) commonWhere.AND.push({ gender })
  if (createdFrom || createdTo) {
    const createdAt: any = {}
    if (createdFrom) createdAt.gte = new Date(createdFrom)
    if (createdTo) {
      const dt = new Date(createdTo)
      // Include the whole day
      dt.setHours(23, 59, 59, 999)
      createdAt.lte = dt
    }
    commonWhere.AND.push({ createdAt })
  }
  if (typeof hasAddress === 'boolean') {
    if (hasAddress) {
      commonWhere.AND.push({ address: { not: null } })
      commonWhere.AND.push({ address: { not: '' } })
    } else {
      commonWhere.AND.push({ OR: [{ address: null }, { address: '' }] })
    }
  }

  function makeOrWithAddress(search: string) {
    return {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ],
    }
  }
  function makeOrWithoutAddress(search: string) {
    return {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ],
    }
  }

  try {
    const where = { ...commonWhere }
    if (q && typeof q === 'string' && q.trim()) {
      where.AND.push(makeOrWithAddress(q.trim()))
    }
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        gender: true,
        type: true,
        address: true,
        createdAt: true,
      },
    })
    return NextResponse.json({ success: true, users })
  } catch (e) {
    // Retry without address in OR/select and without hasAddress filter for older clients
    try {
  const fallbackWhere: any = { AND: [] as any[] }
  if (userId && !isNaN(parseInt(userId))) fallbackWhere.AND.push({ id: Number(userId) })
      if (type) fallbackWhere.AND.push({ type })
      if (gender) fallbackWhere.AND.push({ gender })
      if (createdFrom || createdTo) {
        const createdAt: any = {}
        if (createdFrom) createdAt.gte = new Date(createdFrom)
        if (createdTo) { const dt = new Date(createdTo); dt.setHours(23,59,59,999); createdAt.lte = dt }
        fallbackWhere.AND.push({ createdAt })
      }
      if (q && typeof q === 'string' && q.trim()) {
        fallbackWhere.AND.push(makeOrWithoutAddress(q.trim()))
      }
      const users = await prisma.user.findMany({
        where: fallbackWhere,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          gender: true,
          type: true,
          createdAt: true,
        },
      })
      return NextResponse.json({ success: true, users })
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message || 'Search failed' }, { status: 500 })
    }
  }
}
