"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Download, Package, Star, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { DashboardNav } from "@/components/dashboard-nav"
import { ModelViewer } from "@/components/model-viewer"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Mock order data - in a real app, you'd fetch this from an API
  const order = {
    id: params.id,
    name: "Robot Arm Model",
    date: "July 22, 2023",
    status: "printing",
    material: "PLA",
    color: "White",
    quality: "Standard (0.2mm)",
    printTime: "4 hours 30 minutes",
    price: "$45.49",
    shipping: {
      address: "123 Main St, Anytown, CA 12345",
      method: "Standard Shipping",
      tracking: "TRK123456789",
      estimatedDelivery: "July 25, 2023",
    },
    progress: 65,
  }

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

  const handleSubmitFeedback = () => {
    setSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      alert("Thank you for your feedback!")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Order #{params.id}</h1>
              <p className="text-muted-foreground">Placed on {order.date}</p>
            </div>
            <div className="ml-auto">{getStatusBadge(order.status)}</div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Details about your 3D print order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-[300px] w-full border rounded-lg overflow-hidden">
                    <ModelViewer url="/assets/3d/duck.glb" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-lg">{order.name}</h3>
                      <p className="text-muted-foreground">Order #{order.id}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Material:</div>
                      <div>
                        {order.material} - {order.color}
                      </div>

                      <div className="text-muted-foreground">Quality:</div>
                      <div>{order.quality}</div>

                      <div className="text-muted-foreground">Print Time:</div>
                      <div>{order.printTime}</div>

                      <div className="text-muted-foreground">Total Price:</div>
                      <div className="font-medium">{order.price}</div>
                    </div>

                    <div className="pt-2">
                      <Button variant="outline" className="w-full gap-2 bg-transparent">
                        <Download className="h-4 w-4" /> Download STL File
                      </Button>
                    </div>
                  </div>
                </div>

                {order.status === "printing" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Print Progress</span>
                      <span>{order.progress}%</span>
                    </div>
                    <Progress value={order.progress} />
                    <p className="text-sm text-muted-foreground">
                      Your model is currently being printed. Estimated completion in 1 hour 35 minutes.
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Order Timeline</h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="bg-primary/10 p-1.5 rounded-full h-fit">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Order Placed</p>
                          <p className="text-xs text-muted-foreground">July 22, 2023 at 10:30 AM</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="bg-primary/10 p-1.5 rounded-full h-fit">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Printing Started</p>
                          <p className="text-xs text-muted-foreground">July 22, 2023 at 2:00 PM</p>
                        </div>
                      </div>
                      <div className="flex gap-3 opacity-50">
                        <div className="bg-muted p-1.5 rounded-full h-fit">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Print Completed</p>
                          <p className="text-xs text-muted-foreground">Estimated: July 22, 2023</p>
                        </div>
                      </div>
                      <div className="flex gap-3 opacity-50">
                        <div className="bg-muted p-1.5 rounded-full h-fit">
                          <Truck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Shipped</p>
                          <p className="text-xs text-muted-foreground">Estimated: July 23, 2023</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Shipping Information</h3>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">John Doe</p>
                      <p>{order.shipping.address}</p>
                      <p className="text-muted-foreground">{order.shipping.method}</p>

                      {order.status === "shipped" && (
                        <div className="pt-2">
                          <p className="font-medium">Tracking Number</p>
                          <p>{order.shipping.tracking}</p>
                          <p className="text-xs text-muted-foreground">
                            Estimated delivery: {order.shipping.estimatedDelivery}
                          </p>
                          <Button variant="link" className="p-0 h-auto text-primary">
                            Track Package
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Feedback</CardTitle>
                <CardDescription>Share your experience with this print</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 text-sm font-medium">Rating</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Star className="h-6 w-6" fill={star <= rating ? "currentColor" : "none"} />
                        <span className="sr-only">Rate {star} stars</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="feedback" className="mb-2 text-sm font-medium block">
                    Your Feedback
                  </label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your thoughts about the print quality, service, etc."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={rating === 0 || !feedback || submitting}
                  className="w-full"
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
