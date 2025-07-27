"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  Package,
  Clock,
  CheckCircle,
  Printer,
  User,
  Settings,
  CreditCard,
  FileText,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { OrdersTable } from "@/components/orders-table"
import { ThemeToggle } from "@/components/theme-toggle"

export const dynamic = "force-dynamic"

const recentOrders = [
  {
    id: "3901",
    name: "Robot Arm Model",
    status: "printing",
    material: "PLA",
    color: "Black",
    date: "2024-01-15",
    price: "$45.49",
    progress: 65,
  },
  {
    id: "3900",
    name: "Phone Stand",
    status: "pending",
    material: "ABS",
    color: "White",
    date: "2024-01-12",
    price: "$18.99",
    progress: 0,
  },
  {
    id: "3899",
    name: "Custom Vase",
    status: "shipped",
    material: "PETG",
    color: "Clear",
    date: "2024-01-10",
    price: "$32.50",
    progress: 100,
  },
]

const upcomingPrints = [
  {
    id: "4001",
    name: "Desk Organizer",
    scheduledDate: "Tomorrow",
    scheduledTime: "10:00 AM",
    material: "PLA",
    color: "Blue",
    estimatedTime: "4 hours",
  },
  {
    id: "4002",
    name: "Phone Case",
    scheduledDate: "Jan 25",
    scheduledTime: "2:00 PM",
    material: "TPU",
    color: "Black",
    estimatedTime: "2 hours",
  },
]

function DashboardContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Printer className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">PrintCraft</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="default" size="sm" asChild>
              <Link href="/upload">
                <Upload className="h-4 w-4 mr-2" />
                New Print Request
              </Link>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <DashboardNav />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Print Dashboard</h1>
                <p className="text-muted-foreground">Manage your 3D printing requests and track orders</p>
              </div>
              <Button asChild size="lg">
                <Link href="/upload">
                  <Upload className="h-5 w-5 mr-2" />
                  Start New Print
                </Link>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">24</div>
                  <p className="text-xs text-muted-foreground">+3 this month</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <p className="text-xs text-muted-foreground">1 printing, 2 pending</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">18</div>
                  <p className="text-xs text-muted-foreground">Successfully delivered</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">$486</div>
                  <p className="text-xs text-muted-foreground">Average $27 per print</p>
                </CardContent>
              </Card>
            </div>

            {/* Current Orders Status */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Active Orders
                  </CardTitle>
                  <CardDescription>Track your current printing requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentOrders
                    .filter((order) => order.status !== "completed" && order.status !== "shipped")
                    .map((order) => (
                      <div key={order.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">{order.name}</h3>
                            <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                          </div>
                          <Badge variant={order.status === "printing" ? "default" : "secondary"}>
                            {order.status === "printing" ? "Printing" : "Pending"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Material:</span>
                            <span className="ml-2 text-foreground">
                              {order.material} - {order.color}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <span className="ml-2 text-foreground font-medium">{order.price}</span>
                          </div>
                        </div>
                        {order.status === "printing" && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="text-foreground">{order.progress}%</span>
                            </div>
                            <Progress value={order.progress} className="h-2" />
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Started: {order.date}</span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/order/${order.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  {recentOrders.filter((order) => order.status !== "completed" && order.status !== "shipped").length ===
                    0 && (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No active orders</p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent" asChild>
                        <Link href="/upload">Create Your First Print</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Prints
                  </CardTitle>
                  <CardDescription>Your scheduled printing sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingPrints.map((print) => (
                    <div key={print.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-foreground">{print.name}</h3>
                        <Badge variant="outline">{print.scheduledDate}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <span className="ml-2 text-foreground">{print.scheduledTime}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-2 text-foreground">{print.estimatedTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {print.material} - {print.color}
                        </span>
                        <Button variant="ghost" size="sm">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/upload">Schedule New Print</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders Table */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Order History</CardTitle>
                <CardDescription>Your recent printing requests and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="text-muted-foreground">Loading orders...</div>}>
                  <OrdersTable limit={5} />
                </Suspense>
                <div className="mt-4 flex justify-between items-center">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/orders">View All Orders</Link>
                  </Button>
                  <div className="text-sm text-muted-foreground">Showing 5 of 24 orders</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
                <CardDescription>Common tasks and helpful resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Button asChild className="h-auto p-6 flex-col space-y-3">
                    <Link href="/upload">
                      <Upload className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-medium">Upload Model</div>
                        <div className="text-xs opacity-90">Start new print request</div>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto p-6 flex-col space-y-3 bg-transparent">
                    <Link href="/materials">
                      <Package className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-medium">Materials Guide</div>
                        <div className="text-xs opacity-70">Learn about options</div>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto p-6 flex-col space-y-3 bg-transparent">
                    <Link href="/dashboard/orders">
                      <TrendingUp className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-medium">Order Analytics</div>
                        <div className="text-xs opacity-70">View your stats</div>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto p-6 flex-col space-y-3 bg-transparent">
                    <Link href="/contact">
                      <Settings className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-medium">Get Support</div>
                        <div className="text-xs opacity-70">Contact our team</div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
          Loading dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
