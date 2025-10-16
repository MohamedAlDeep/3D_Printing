import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardNav } from '@/components/dashboard-nav'
import ReviewForm from '@/components/review-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ReviewsPage() {
	const session = await getSession()
	if (!session || !session.user?.email) {
		redirect('/login')
	}

	// Load the current user
	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
		select: { id: true, name: true }
	})
	if (!user) redirect('/login')

	// Fetch only this user's delivered orders
	const orders = await prisma.orders.findMany({
		where: { userId: user.id, status: 'delivered' },
		orderBy: { createdAt: 'desc' },
		select: { id: true, createdAt: true, review: true, stars: true, price: true, print_time: true, size: true }
	})

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex gap-8">
				<div className="w-64 flex-shrink-0">
					<DashboardNav />
				</div>
				<div className="flex-1">
					<h1 className="text-3xl font-bold mb-6">My Reviews</h1>
					{orders.length === 0 ? (
						<p className="text-muted-foreground">You have no delivered orders to review yet.</p>
					) : (
						<div className="grid gap-6">
							{orders.map((o) => (
								<Card key={o.id}>
									<CardHeader>
										<CardTitle className="flex justify-between items-center">
											<span>Order #{o.id}</span>
											<span className="text-sm text-muted-foreground">{o.createdAt.toDateString()}</span>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="text-sm text-muted-foreground">
											<div>Price: {o.price}</div>
											<div>Print time: {o.print_time}</div>
										</div>
										<ReviewForm orderId={o.id} initialReview={o.review} initialStars={o.stars} />
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

