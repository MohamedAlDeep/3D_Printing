"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Package, Clock, CheckCircle, Star, Printer, User, Settings } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { OrdersTable } from "@/components/orders-table"
import { ThemeToggle } from "@/components/theme-toggle"

export const dynamic = "force-dynamic"

const recentOrders = [
  { id: "1", name: "Phone Case", status: "printing", material: "PLA", color: "Black", date: "2024-01-15" },
  { id: "2", name: "Miniature Figure", status: "shipped", material: "Resin", color: "Gray", date: "2024-01-12" },
  { id: "3", name: "Bracket Mount", status: "completed", material: "ABS", color: "White", date: "2024-01-10" },
]

function DashboardContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Printer className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">PrintCraft</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/upload">
                <Upload className="h-4 w-4 mr-2" />
                New Print
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
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
              <p className="text-muted-foreground">Here's what's happening with your prints</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">24</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <p className="text-xs text-muted-foreground">Currently printing</p>
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">4.8</div>
                  <p className="text-xs text-muted-foreground">Based on 15 reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Orders</CardTitle>
                <CardDescription>Your latest 3D printing orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="text-muted-foreground">Loading orders...</div>}>
                  <OrdersTable orders={recentOrders} />
                </Suspense>
                <div className="mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/orders">View All Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button asChild className="h-auto p-4 flex-col space-y-2">
                    <Link href="/upload">
                      <Upload className="h-6 w-6" />
                      <span>Upload New Model</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto p-4 flex-col space-y-2 bg-transparent">
                    <Link href="/materials">
                      <Package className="h-6 w-6" />
                      <span>Browse Materials</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto p-4 flex-col space-y-2 bg-transparent">
                    <Link href="/contact">
                      <Settings className="h-6 w-6" />
                      <span>Contact Support</span>
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
