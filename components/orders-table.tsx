"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Eye, Download, MessageSquare, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface OrdersTableProps {
  status?: string
  limit?: number
  orders?: Array<{
    id: string
    name: string
    date: string
    status: string
    price: string
    material?: string
    color?: string
    progress?: number
  }>
}

export function OrdersTable({ status, limit, orders: propOrders }: OrdersTableProps) {
  const searchParams = useSearchParams()
  const statusParam = searchParams?.get("status")

  // Mock data - in a real app, you'd fetch this from an API
  const defaultOrders = [
    {
      id: "3901",
      name: "Robot Arm Model",
      date: "Jul 22, 2023",
      status: "printing",
      price: "$45.49",
      material: "PLA",
      color: "Black",
      estimatedCompletion: "2 hours",
    },
    {
      id: "3900",
      name: "Phone Stand",
      date: "Jul 20, 2023",
      status: "pending",
      price: "$18.99",
      material: "ABS",
      color: "White",
      estimatedCompletion: "Pending approval",
    },
    {
      id: "3899",
      name: "Custom Vase",
      date: "Jul 15, 2023",
      status: "shipped",
      price: "$32.50",
      material: "PETG",
      color: "Clear",
      trackingNumber: "1Z999AA1234567890",
    },
    {
      id: "3898",
      name: "Desk Organizer",
      date: "Jul 10, 2023",
      status: "completed",
      price: "$28.75",
      material: "PLA",
      color: "Blue",
      deliveredDate: "Jul 12, 2023",
    },
    {
      id: "3897",
      name: "Chess Set",
      date: "Jul 5, 2023",
      status: "completed",
      price: "$65.00",
      material: "ABS",
      color: "White",
      deliveredDate: "Jul 8, 2023",
    },
    {
      id: "3896",
      name: "Miniature House",
      date: "Jun 28, 2023",
      status: "completed",
      price: "$42.25",
      material: "PLA",
      color: "Gray",
      deliveredDate: "Jul 1, 2023",
    },
    {
      id: "3895",
      name: "Mechanical Keyboard Keycap",
      date: "Jun 22, 2023",
      status: "completed",
      price: "$15.99",
      material: "ABS",
      color: "Black",
      deliveredDate: "Jun 25, 2023",
    },
    {
      id: "3894",
      name: "Plant Pot",
      date: "Jun 18, 2023",
      status: "completed",
      price: "$22.50",
      material: "PETG",
      color: "Green",
      deliveredDate: "Jun 21, 2023",
    },
  ]

  const allOrders = propOrders || defaultOrders

  // Filter orders based on status if provided
  const filteredOrders =
    status || statusParam ? allOrders.filter((order) => order.status === (status || statusParam)) : allOrders

  // Limit the number of orders if limit is provided
  const displayedOrders = limit ? filteredOrders.slice(0, limit) : filteredOrders

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pending Review
          </Badge>
        )
      case "printing":
        return (
          <Badge variant="default" className="bg-blue-600">
            Printing
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="default" className="bg-green-600">
            Shipped
          </Badge>
        )
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusDescription = (order: any) => {
    switch (order.status) {
      case "pending":
        return "Awaiting approval"
      case "printing":
        return `Est. completion: ${order.estimatedCompletion || "Unknown"}`
      case "shipped":
        return `Tracking: ${order.trackingNumber || "N/A"}`
      case "completed":
        return `Delivered: ${order.deliveredDate || "N/A"}`
      default:
        return ""
    }
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Details</TableHead>
            <TableHead>Material</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedOrders.length > 0 ? (
            displayedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-foreground">{order.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Order #{order.id} • {order.date}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="text-foreground">{order.material}</div>
                    <div className="text-muted-foreground">{order.color}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {getStatusBadge(order.status)}
                    <div className="text-xs text-muted-foreground">{getStatusDescription(order)}</div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{order.price}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/order/${order.id}`}>
                      <Button variant="ghost" size="icon" title="View Details">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View order {order.id}</span>
                      </Button>
                    </Link>
                    {order.status === "completed" && (
                      <>
                        <Button variant="ghost" size="icon" title="Download Files">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download files for order {order.id}</span>
                        </Button>
                        <Button variant="ghost" size="icon" title="Leave Review">
                          <MessageSquare className="h-4 w-4" />
                          <span className="sr-only">Review order {order.id}</span>
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No orders found</p>
                  <p className="text-sm">Start by creating your first print request</p>
                  <Button variant="outline" className="mt-4 bg-transparent" asChild>
                    <Link href="/upload">Upload Model</Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
