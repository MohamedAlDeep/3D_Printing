
import LogoutButton from '@/components/Logout'
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { prisma } from "@/lib/prisma"
import { logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import ProfileForm from '@/components/profile-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, Calendar, User as UserIcon, MapPin, Shield, Hash } from 'lucide-react'

export default async function Page(){
    const session = await getSession()
    if(!session){
        redirect('/login')
    }


    let user: any = null
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          phone: true,
          type: true,
          gender: true,
          createdAt: true,
          address: true,
          name: true,
          email: true,
        },
      })
    } catch (e) {
      // Fallback for environments where Prisma Client hasn't been regenerated yet
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          phone: true,
          type: true,
          gender: true,
          createdAt: true,
          name: true,
          email: true,
        },
      })
    }
    const addressValue = (user as any)?.address as string | null | undefined
    const missingAddress = !addressValue || addressValue.trim() === ''
    const initials = (user?.name || session.user.email || '?')
      .split(' ')
      .map((part:any) => part[0])
      .join('')
      .slice(0, 2)
    return (
        <>
             <div className="container mx-auto px-4 py-8">
                    <div className="flex gap-8">
                      {/* Sidebar */}
                      <div className="w-64 flex-shrink-0">
                        <DashboardNav />
                      </div>
                      <div className='flex-1'>
                        <h1 className='text-3xl font-bold mb-6'>My Profile</h1>
                        {missingAddress && (
                          <Alert className="mb-6" variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Address required to place orders</AlertTitle>
                            <AlertDescription>
                              Please add your shipping address below. You will not be able to create a new order until your address is saved.
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Left column: profile summary + details */}
                          <div className="lg:col-span-2 space-y-8">
                            {/* Profile summary */}
                            <Card>
                              <CardHeader className="flex flex-row items-center gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src="/placeholder-user.jpg" alt={user?.name || session.user.email || 'User'} />
                                  <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <CardTitle className="text-2xl">{user?.name || '—'}</CardTitle>
                                  <CardDescription className="flex items-center gap-2 mt-1">
                                    <Mail className="h-4 w-4" /> {session.user.email}
                                  </CardDescription>
                                  <div className="mt-3">
                                    <Badge variant={user?.type === 'admin' ? 'default' : 'secondary'} className="uppercase">
                                      {user?.type}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="ml-auto">
                                  <a href="#edit-profile">
                                    <Button variant="outline" size="sm">Edit profile</Button>
                                  </a>
                                </div>
                              </CardHeader>
                            </Card>

                            {/* Account details */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Account details</CardTitle>
                                <CardDescription>Basic information about your account</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="grid sm:grid-cols-2 gap-6">
                                  <div className="flex items-start gap-3">
                                    <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                      <div className="text-sm text-muted-foreground">User ID</div>
                                      <div className="font-medium">{user?.id}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                      <div className="text-sm text-muted-foreground">Phone</div>
                                      <div className="font-medium">{user?.phone || '—'}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                      <div className="text-sm text-muted-foreground">Gender</div>
                                      <div className="font-medium">{user?.gender || '—'}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                      <div className="text-sm text-muted-foreground">Member since</div>
                                      <div className="font-medium">{user?.createdAt.toDateString()}</div>
                                    </div>
                                  </div>
                                  <div className="sm:col-span-2 flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                      <div className="text-sm text-muted-foreground">Address</div>
                                      <div className="font-medium">{addressValue || 'Not set'}</div>
                                      {missingAddress && (
                                        <div className="mt-2">
                                          <a href="#edit-profile">
                                            <Button size="sm" variant="secondary">Add address</Button>
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Right column: edit form */}
                          <div id="edit-profile" className="lg:col-span-1">
                            <Card>
                              <CardHeader>
                                <CardTitle>Edit profile</CardTitle>
                                <CardDescription>Update your personal information</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <ProfileForm initial={{
                                  name: user?.name ?? null,
                                  phone: user?.phone ?? null,
                                  gender: user?.gender ?? null,
                                  address: addressValue ?? null,
                                }} />
                                <div className="mt-6">
                                  <LogoutButton />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                         
                      </div>
            </div>
        </>
    )
}
