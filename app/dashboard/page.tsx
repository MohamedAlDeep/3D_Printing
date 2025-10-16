import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardNav } from '@/components/dashboard-nav'
import AdminDashboard from '@/components/admin-dashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session || !session.user?.email) {
    redirect('/login')
  }

  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, type: true }
  })
  if (!me || me.type !== 'admin') {
    redirect('/')
  }

  // Fetch users; include address if available (guard for older clients if necessary)
  let users: any[] = []
  try {
    users = await prisma.user.findMany({
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
  } catch {
    users = await prisma.user.findMany({
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
  }

  const orders = await prisma.orders.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      price: true,
      print_time: true,
      createdAt: true,
      user: { select: { email: true } },
    },
  })

  // Serialize dates for client component
  const usersSerialized = users.map(u => ({ ...u, createdAt: u.createdAt.toISOString(), address: u.address ?? null }))
  const ordersSerialized = orders.map(o => ({
    id: o.id,
    status: o.status,
    price: o.price,
    print_time: o.print_time,
    createdAt: o.createdAt.toISOString(),
    userEmail: o.user.email,
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="w-64 flex-shrink-0">
          <DashboardNav />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <AdminDashboard initialUsers={usersSerialized} initialOrders={ordersSerialized} />
        </div>
      </div>
    </div>
  )
}
