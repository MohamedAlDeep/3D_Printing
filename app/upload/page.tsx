"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CalendarIcon, FileUp, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ModelViewer } from "@/components/model-viewer"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [printTime, setPrintTime] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const materials = [
    { id: "pla", name: "PLA", colors: ["White", "Black", "Red", "Blue", "Green", "Yellow"] },
    { id: "abs", name: "ABS", colors: ["White", "Black", "Red", "Blue"] },
    { id: "petg", name: "PETG", colors: ["Clear", "Black", "White"] },
    { id: "tpu", name: "TPU Flexible", colors: ["White", "Black"] },
  ]

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (selectedFile.name.toLowerCase().endsWith(".stl")) {
        setFile(selectedFile)
        // Create a URL for the file to preview it
        const url = URL.createObjectURL(selectedFile)
        setFileUrl(url)

        // Simulate print time calculation based on file size
        const fileSizeInMB = selectedFile.size / (1024 * 1024)
        const estimatedPrintTime = Math.round(fileSizeInMB * 10) // 10 minutes per MB as an example
        setPrintTime(estimatedPrintTime)
      } else {
        alert("Please upload an STL file")
      }
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]

      if (droppedFile.name.toLowerCase().endsWith(".stl")) {
        setFile(droppedFile)
        const url = URL.createObjectURL(droppedFile)
        setFileUrl(url)

        const fileSizeInMB = droppedFile.size / (1024 * 1024)
        const estimatedPrintTime = Math.round(fileSizeInMB * 10)
        setPrintTime(estimatedPrintTime)
      } else {
        alert("Please upload an STL file")
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      router.push("/dashboard/orders?status=new")
    }, 2000)
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${mins > 0 ? `${mins} min${mins > 1 ? "s" : ""}` : ""}`
    }

    return `${mins} minute${mins > 1 ? "s" : ""}`
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Your 3D Model</h1>
          <p className="text-muted-foreground mt-2">Upload your STL file, select materials, and schedule your print</p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Model</TabsTrigger>
            <TabsTrigger value="materials" disabled={!file}>
              Materials & Time
            </TabsTrigger>
            <TabsTrigger value="checkout" disabled={!file || !date}>
              Checkout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your STL File</CardTitle>
                <CardDescription>We accept STL files up to 100MB in size</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors",
                    fileUrl ? "border-primary" : "border-muted-foreground/25",
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".stl" className="hidden" />

                  {fileUrl ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-[300px] w-full">
                        <ModelViewer url={fileUrl} fileName={file?.name} />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{file?.name}</p>
                        <p className="text-muted-foreground">
                          {(file?.size && (file.size / (1024 * 1024)).toFixed(2)) || 0} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFile(null)
                          setFileUrl(null)
                          setPrintTime(null)
                        }}
                      >
                        Change File
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-primary/10 p-4 rounded-full">
                        <FileUp className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Drag and drop your STL file here</p>
                        <p className="text-muted-foreground text-sm mt-1">Or click to browse files</p>
                      </div>
                    </div>
                  )}
                </div>

                {printTime && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Estimated Print Time</h3>
                    </div>
                    <p className="mt-2">
                      Based on your model, the estimated print time is <strong>{formatTime(printTime)}</strong>
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
                <Button
                  onClick={() =>
                    document.querySelector('[data-value="materials"]')?.dispatchEvent(new MouseEvent("click"))
                  }
                  disabled={!file}
                >
                  Continue to Materials
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Materials & Schedule</CardTitle>
                <CardDescription>Choose your preferred material, color, and printing time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Select>
                        <SelectTrigger id="material">
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materials.map((material) => (
                            <SelectItem key={material.id} value={material.id}>
                              {material.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        Different materials have different properties and use cases
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Select>
                        <SelectTrigger id="color">
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {materials[0].colors.map((color) => (
                            <SelectItem key={color} value={color.toLowerCase()}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quality">Print Quality</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="quality">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft (0.3mm layer height)</SelectItem>
                          <SelectItem value="standard">Standard (0.2mm layer height)</SelectItem>
                          <SelectItem value="high">High (0.1mm layer height)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        Higher quality means finer details but longer print times
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Print Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) =>
                              date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 1))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="time">Time Slot</Label>
                      <Select>
                        <SelectTrigger id="time">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        Available time slots based on your selected date
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() =>
                    document.querySelector('[data-value="upload"]')?.dispatchEvent(new MouseEvent("click"))
                  }
                >
                  Back
                </Button>
                <Button
                  onClick={() =>
                    document.querySelector('[data-value="checkout"]')?.dispatchEvent(new MouseEvent("click"))
                  }
                  disabled={!date}
                >
                  Continue to Checkout
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="checkout" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Order</CardTitle>
                <CardDescription>Review your order details and provide shipping information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Shipping Information</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" required />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" required />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required />
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" required />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input id="city" required />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input id="postalCode" required />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select defaultValue="us">
                          <SelectTrigger id="country">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="notes">Special Instructions (Optional)</Label>
                        <Textarea id="notes" placeholder="Any special requirements for your print" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Order Summary</h3>
                      <div className="bg-muted rounded-lg p-4 space-y-4">
                        <div className="flex justify-between">
                          <span>File:</span>
                          <span className="font-medium">{file?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Material:</span>
                          <span className="font-medium">PLA - White</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Print Quality:</span>
                          <span className="font-medium">Standard (0.2mm)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Print Date:</span>
                          <span className="font-medium">{date ? format(date, "PPP") : "Not selected"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time Slot:</span>
                          <span className="font-medium">9:00 AM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Print Time:</span>
                          <span className="font-medium">{printTime ? formatTime(printTime) : "Unknown"}</span>
                        </div>

                        <Separator />

                        <div className="flex justify-between">
                          <span>Printing Cost:</span>
                          <span className="font-medium">$25.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Material Cost:</span>
                          <span className="font-medium">$12.50</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span className="font-medium">$7.99</span>
                        </div>

                        <Separator />

                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span>$45.49</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.querySelector('[data-value="materials"]')?.dispatchEvent(new MouseEvent("click"))
                      }
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block"
    >
      {children}
    </label>
  )
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
