"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface OrdersTableProps {
  status?: string
  limit?: number
}

export function OrdersTable({ status, limit }: OrdersTableProps) {
  const searchParams = useSearchParams()
  const statusParam = searchParams?.get("status")

  // Mock data - in a real app, you'd fetch this from an API
  const allOrders = [
    {
      id: "3901",
      name: "Robot Arm Model",
      date: "Jul 22, 2023",
      status: "printing",
      price: "$45.49",
    },
    {
      id: "3900",
      name: "Phone Stand",
      date: "Jul 20, 2023",
      status: "pending",
      price: "$18.99",
    },
    {
      id: "3899",
      name: "Custom Vase",
      date: "Jul 15, 2023",
      status: "shipped",
      price: "$32.50",
    },
    {
      id: "3898",
      name: "Desk Organizer",
      date: "Jul 10, 2023",
      status: "completed",
      price: "$28.75",
    },
    {
      id: "3897",
      name: "Chess Set",
      date: "Jul 5, 2023",
      status: "completed",
      price: "$65.00",
    },
    {
      id: "3896",
      name: "Miniature House",
      date: "Jun 28, 2023",
      status: "completed",
      price: "$42.25",
    },
    {
      id: "3895",
      name: "Mechanical Keyboard Keycap",
      date: "Jun 22, 2023",
      status: "completed",
      price: "$15.99",
    },
    {
      id: "3894",
      name: "Plant Pot",
      date: "Jun 18, 2023",
      status: "completed",
      price: "$22.50",
    },
  ]

  // Filter orders based on status if provided
  const filteredOrders =
    status || statusParam ? allOrders.filter((order) => order.status === (status || statusParam)) : allOrders

  // Limit the number of orders if limit is provided
  const displayedOrders = limit ? filteredOrders.slice(0, limit) : filteredOrders

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "printing":
        return <Badge variant="secondary">Printing</Badge>
      case "shipped":
        return <Badge>Shipped</Badge>
      case "completed":
        return <Badge variant="default">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedOrders.length > 0 ? (
            displayedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/order/${order.id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View order {order.id}</span>
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
