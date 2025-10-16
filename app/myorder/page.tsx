
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { DownloadButton } from "@/components/DownloadButton"
import { prisma } from "@/lib/prisma"


export default async function Page(){
    const session = await getSession()
    if(!session){
        redirect('/login')
    }
     const userWithOrders = await prisma.user.findUnique({
          where: { email: session?.user.email }, // or use email
            include: {
            orders: true, // this will fetch all related orders
            },
        });
    const orders = userWithOrders?.orders?.filter(order => order.status === 'pending')
    
    return (
        <>
        <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
                {/* Sidebar */}
                <div className="w-64 flex-shrink-0">
                    <DashboardNav />
                </div>
                
                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-8">
                        <h1 className='text-4xl font-bold mb-2'>Current Orders</h1>
                        <p className="text-muted-foreground">Manage your pending 3D print orders</p>
                    </div>
                    
                    {/* Orders Grid */}
                    <div className="space-y-6">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => {
                                // Parse the size JSON string to get X, Y, Z coordinates
                                let sizeDisplay = 'N/A';
                                try {
                                    const sizeObj = JSON.parse(order.size);
                                    sizeDisplay = `${sizeObj.x} × ${sizeObj.y} × ${sizeObj.z} mm`;
                                } catch (error) {
                                    // If parsing fails, show the raw size string
                                    sizeDisplay = order.size;
                                }

                                return (
                                    <div key={order.id} className="border rounded-xl p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                                                <p className="text-muted-foreground">Created on {order.createdAt.toDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-primary">{order.price} EGP</p>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Print Time</p>
                                                <p className="text-lg">{order.print_time}</p>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Dimensions</p>
                                                <p className="text-lg">{sizeDisplay}</p>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">STL File</p>
                                                <DownloadButton orderId={order.id} />
                                            </div>
                                        </div>
                                        
                                        {order.review && (
                                            <div className="mt-6 pt-4 border-t">
                                                <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Special Instructions</p>
                                                <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">{order.review}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-4h-2M6 9h2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No pending orders</h3>
                                <p className="text-muted-foreground mb-4">You don't have any pending orders at the moment.</p>
                                <a href="/upload" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                    Create New Order
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}