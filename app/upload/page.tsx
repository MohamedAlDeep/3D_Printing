import { DashboardNav } from "@/components/dashboard-nav"
import UploadForm from "@/components/UploadForm"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function Page(){
    const session = await getSession()
    if(!session){
        redirect('/login')
    }
    
    // Ensure user has a non-empty address before showing the form
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { address: true },
      })

      // If user record is missing or address is empty/whitespace, redirect to profile
      const address = user?.address?.trim()
      if (!address) {
        redirect('/profile')
      }
    } catch (e) {
      // If Prisma client is out of date (e.g., address not in generated client),
      // fail-safe: redirect to profile so user can complete their address.
      redirect('/profile')
    }
    
    return (
        <>
          <div className="container mx-auto px-4 py-8">
                    <div className="flex gap-8">
                      {/* Sidebar */}
                      <div className="w-64 flex-shrink-0">
                        <DashboardNav />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-center text-4xl font-bold mb-8">Complete Your 3D Print Order</h1>
                        <UploadForm/>
                      </div>
                      </div>
            </div>
        </>
    )
}