"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrdersTable } from "@/components/orders-table"
import { DashboardNav } from "@/components/dashboard-nav"

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8 flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Your Orders</h1>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="printing">Printing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>View all your print orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdersTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Orders</CardTitle>
                  <CardDescription>Orders waiting to be processed</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdersTable status="pending" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="printing">
              <Card>
                <CardHeader>
                  <CardTitle>Currently Printing</CardTitle>
                  <CardDescription>Orders that are currently being printed</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdersTable status="printing" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipped">
              <Card>
                <CardHeader>
                  <CardTitle>Shipped Orders</CardTitle>
                  <CardDescription>Orders that have been shipped</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdersTable status="shipped" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Orders</CardTitle>
                  <CardDescription>Orders that have been delivered</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdersTable status="completed" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
