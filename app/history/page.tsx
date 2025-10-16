
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
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
     const orders = userWithOrders?.orders?.filter(order => order.status !== 'pending')
    
    return (
        <>
          <div className="container mx-auto px-4 py-8">
                            <div className="flex gap-8">
                              {/* Sidebar */}
                              <div className="w-64 flex-shrink-0">
                                <DashboardNav />
                              </div>
                              <div>
                                <h1 className='font-bold text-4xl'>My History</h1>                      
                                {orders?.map( (order) => {
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
                                    <div key={order.id} className="border rounded-lg p-4 mb-4 bg-card">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="font-semibold">Order ID:</p>
                                          <p className="text-muted-foreground">#{order.id}</p>
                                        </div>
                                        <div>
                                          <p className="font-semibold">Price:</p>
                                          <p className="text-muted-foreground">${order.price}</p>
                                        </div>
                                        <div>
                                          <p className="font-semibold">Print Time:</p>
                                          <p className="text-muted-foreground">{order.print_time}</p>
                                        </div>
                                        <div>
                                          <p className="font-semibold">Dimensions (X × Y × Z):</p>
                                          <p className="text-muted-foreground">{sizeDisplay}</p>
                                        </div>
                                        <div>
                                          <p className="font-semibold">Status:</p>
                                          <p className="text-muted-foreground">{order.status}</p>
                                        </div>
                                        <div>
                                          <p className="font-semibold">Created:</p>
                                          <p className="text-muted-foreground">{order.createdAt.toDateString()}</p>
                                        </div>
                                        {order.review && (
                                          <div className="col-span-2">
                                            <p className="font-semibold">Review:</p>
                                            <p className="text-muted-foreground">{order.review}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}           
                              </div>
                              </div>
                    </div>
        </>
    )
}