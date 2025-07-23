import Link from "next/link"
import { CuboidIcon as Cube, Package, Settings, Star, User } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardNav } from "@/components/dashboard-nav"
import { OrdersTable } from "@/components/orders-table"

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <Cube className="h-6 w-6" />
            <span className="text-xl font-bold">PrintCube</span>
          </Link>
          <nav className="ml-auto flex items-center space-x-4">
            <Link href="/upload">
              <Button variant="ghost" size="sm">
                New Print
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5 mr-2" />
              Account
            </Button>
          </nav>
        </div>
      </div>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8">
          <div className="flex flex-col">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center gap-2">
                  <Link href="/upload">
                    <Button>New Print</Button>
                  </Link>
                </div>
              </div>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">1 printing, 1 pending</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 from last month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">4.8</div>
                        <p className="text-xs text-muted-foreground">Based on 10 reviews</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                      <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading orders…</div>}>
                          <OrdersTable limit={5} />
                        </Suspense>
                      </CardContent>
                      <CardFooter>
                        <Link href="/dashboard/orders">
                          <Button variant="outline">View All Orders</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                    <Card className="col-span-3">
                      <CardHeader>
                        <CardTitle>Upcoming Prints</CardTitle>
                        <CardDescription>Your scheduled prints for the next 7 days</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Package className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">Robot Arm Model</p>
                              <p className="text-sm text-muted-foreground">Tomorrow at 10:00 AM</p>
                            </div>
                            <div className="text-sm text-muted-foreground">PLA - White</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Package className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">Phone Stand</p>
                              <p className="text-sm text-muted-foreground">Jul 25 at 2:00 PM</p>
                            </div>
                            <div className="text-sm text-muted-foreground">ABS - Black</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href="/upload">
                          <Button variant="outline">Schedule New Print</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="orders" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Orders</CardTitle>
                      <CardDescription>View and manage all your print orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading orders…</div>}>
                        <OrdersTable />
                      </Suspense>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="feedback" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Feedback</CardTitle>
                      <CardDescription>Reviews you've left for your prints</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Robot Figurine</h3>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4" fill={star <= 5 ? "currentColor" : "none"} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            "The print quality was excellent! Very detailed and the colors were vibrant."
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">June 12, 2023</p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Custom Vase</h3>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4" fill={star <= 4 ? "currentColor" : "none"} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            "Good quality print, but took longer than expected to arrive."
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">May 28, 2023</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline">View All Feedback</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
