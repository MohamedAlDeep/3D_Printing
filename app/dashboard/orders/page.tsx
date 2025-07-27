"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Printer, User } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { OrdersTable } from "@/components/orders-table"
import { ThemeToggle } from "@/components/theme-toggle"

export const dynamic = "force-dynamic"

const allOrders = [
  { id: "1", name: "Phone Case", status: "printing", material: "PLA", color: "Black", date: "2024-01-15" },
  { id: "2", name: "Miniature Figure", status: "shipped", material: "Resin", color: "Gray", date: "2024-01-12" },
  { id: "3", name: "Bracket Mount", status: "completed", material: "ABS", color: "White", date: "2024-01-10" },
  { id: "4", name: "Custom Widget", status: "pending", material: "PETG", color: "Clear", date: "2024-01-08" },
  { id: "5", name: "Prototype Part", status: "printing", material: "TPU", color: "Red", date: "2024-01-05" },
]

const pendingOrders = allOrders.filter((order) => order.status === "pending")
const printingOrders = allOrders.filter((order) => order.status === "printing")
const shippedOrders = allOrders.filter((order) => order.status === "shipped")
const completedOrders = allOrders.filter((order) => order.status === "completed")

function OrdersContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Printer className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">PrintCraft</span>
            </div>
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
            <div>
              <h1 className="text-3xl font-bold text-foreground">All Orders</h1>
              <p className="text-muted-foreground">Manage and track all your 3D printing orders</p>
            </div>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Order History</CardTitle>
                <CardDescription>View orders by status</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All ({allOrders.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
                    <TabsTrigger value="printing">Printing ({printingOrders.length})</TabsTrigger>
                    <TabsTrigger value="shipped">Shipped ({shippedOrders.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-6">
                    <Suspense fallback={<div className="text-muted-foreground">Loading all orders...</div>}>
                      <OrdersTable orders={allOrders} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="pending" className="mt-6">
                    <Suspense fallback={<div className="text-muted-foreground">Loading pending orders...</div>}>
                      <OrdersTable orders={pendingOrders} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="printing" className="mt-6">
                    <Suspense fallback={<div className="text-muted-foreground">Loading printing orders...</div>}>
                      <OrdersTable orders={printingOrders} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="shipped" className="mt-6">
                    <Suspense fallback={<div className="text-muted-foreground">Loading shipped orders...</div>}>
                      <OrdersTable orders={shippedOrders} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="completed" className="mt-6">
                    <Suspense fallback={<div className="text-muted-foreground">Loading completed orders...</div>}>
                      <OrdersTable orders={completedOrders} />
                    </Suspense>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
          Loading orders...
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  )
}
