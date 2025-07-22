import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Clock, CuboidIcon as Cube, FileUp, Printer, Star, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Cube className="h-6 w-6" />
            <span className="text-xl font-bold">PrintCube</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Home
            </Link>
            <Link href="/upload" className="text-sm font-medium hover:underline underline-offset-4">
              Upload Model
            </Link>
            <Link href="/materials" className="text-sm font-medium hover:underline underline-offset-4">
              Materials
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Turn Your 3D Models Into Reality
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Upload your STL files, choose your materials, and we'll handle the rest. Professional 3D printing
                  service with fast delivery.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/upload">
                  <Button size="lg" className="gap-2">
                    Start Printing <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/materials">
                  <Button size="lg" variant="outline">
                    Explore Materials
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[600px]">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="3D Printer in action"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our streamlined process makes 3D printing accessible to everyone
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <FileUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">1. Upload Your Model</h3>
              <p className="text-muted-foreground">
                Upload your STL file and our system will analyze it for printability
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">2. Choose Time & Materials</h3>
              <p className="text-muted-foreground">
                Select from available printing slots and choose your preferred materials and colors
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">3. Receive Your Print</h3>
              <p className="text-muted-foreground">We'll print your model and ship it to your specified address</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose PrintCube</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Professional 3D printing service with features designed for your convenience
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="flex flex-col space-y-2">
              <Clock className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">Print Time Calculator</h3>
              <p className="text-muted-foreground">Get accurate estimates of printing time before you order</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Calendar className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">Availability Calendar</h3>
              <p className="text-muted-foreground">See available printing slots and schedule your prints</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Printer className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">Material Selection</h3>
              <p className="text-muted-foreground">Choose from PLA, ABS, PETG and more with various color options</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Star className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">Order Tracking</h3>
              <p className="text-muted-foreground">Track your order status from acceptance to delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Print Your Model?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get started today and bring your 3D designs to life
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/upload">
                <Button size="lg" className="gap-2">
                  Upload Your Model <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col gap-6 py-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center gap-2">
              <Cube className="h-6 w-6" />
              <span className="text-xl font-bold">PrintCube</span>
            </Link>
            <nav className="flex gap-4 md:gap-6 flex-wrap">
              <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
                Home
              </Link>
              <Link href="/upload" className="text-sm font-medium hover:underline underline-offset-4">
                Upload Model
              </Link>
              <Link href="/materials" className="text-sm font-medium hover:underline underline-offset-4">
                Materials
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
                Contact
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PrintCube. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
