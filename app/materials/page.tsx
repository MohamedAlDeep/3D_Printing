"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Printer, Thermometer, Zap, Shield, Palette } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const materials = [
  {
    id: "pla",
    name: "PLA (Polylactic Acid)",
    price: "$0.05/g",
    colors: ["White", "Black", "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Gray"],
    properties: {
      strength: "Medium",
      flexibility: "Low",
      temperature: "60°C",
      difficulty: "Beginner",
    },
    description: "Perfect for prototypes, decorative items, and beginners. Easy to print with minimal warping.",
    applications: ["Prototypes", "Decorative items", "Educational models", "Toys"],
    pros: ["Easy to print", "Biodegradable", "Low odor", "Good surface finish"],
    cons: ["Lower heat resistance", "Brittle when thin", "Not suitable for outdoor use"],
  },
  {
    id: "abs",
    name: "ABS (Acrylonitrile Butadiene Styrene)",
    price: "$0.07/g",
    colors: ["White", "Black", "Red", "Blue", "Green", "Yellow", "Gray"],
    properties: {
      strength: "High",
      flexibility: "Medium",
      temperature: "100°C",
      difficulty: "Intermediate",
    },
    description: "Durable and strong material ideal for functional parts and mechanical components.",
    applications: ["Functional parts", "Automotive components", "Electronic housings", "Tools"],
    pros: ["High strength", "Good chemical resistance", "Machinable", "Recyclable"],
    cons: ["Requires heated bed", "Strong odor", "Prone to warping", "ABS fumes"],
  },
  {
    id: "petg",
    name: "PETG (Polyethylene Terephthalate Glycol)",
    price: "$0.08/g",
    colors: ["Clear", "White", "Black", "Blue", "Red", "Green"],
    properties: {
      strength: "High",
      flexibility: "Medium",
      temperature: "80°C",
      difficulty: "Intermediate",
    },
    description: "Chemical resistant and crystal clear material, perfect for containers and mechanical parts.",
    applications: ["Food containers", "Medical devices", "Mechanical parts", "Transparent objects"],
    pros: ["Chemical resistant", "Crystal clear", "Strong and durable", "Easy to print"],
    cons: ["Can string", "Scratches easily", "Limited color options", "Higher cost"],
  },
  {
    id: "tpu",
    name: "TPU (Thermoplastic Polyurethane)",
    price: "$0.12/g",
    colors: ["Black", "White", "Red", "Blue", "Clear", "Yellow"],
    properties: {
      strength: "Medium",
      flexibility: "Very High",
      temperature: "50°C",
      difficulty: "Advanced",
    },
    description: "Flexible rubber-like material perfect for gaskets, phone cases, and wearables.",
    applications: ["Phone cases", "Gaskets", "Wearables", "Flexible hinges"],
    pros: ["Very flexible", "Tear resistant", "Chemical resistant", "Durable"],
    cons: ["Difficult to print", "Slow printing", "Requires direct drive", "Limited support"],
  },
]

export default function MaterialsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Printer className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">PrintCraft</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            Materials Guide
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">3D Printing Materials</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Choose from our selection of premium 3D printing materials, each optimized for different applications and
            requirements.
          </p>
        </div>

        <div className="grid gap-8">
          {materials.map((material) => (
            <Card key={material.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-foreground">{material.name}</CardTitle>
                    <CardDescription className="text-lg mt-2">{material.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {material.price}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Properties */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Material Properties</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Strength:</span>
                      <span className="text-sm font-medium text-foreground">{material.properties.strength}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Flexibility:</span>
                      <span className="text-sm font-medium text-foreground">{material.properties.flexibility}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Max Temp:</span>
                      <span className="text-sm font-medium text-foreground">{material.properties.temperature}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Printer className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Difficulty:</span>
                      <span className="text-sm font-medium text-foreground">{material.properties.difficulty}</span>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Available Colors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {material.colors.map((color) => (
                      <Badge key={color} variant="secondary">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Applications */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Common Applications</h3>
                  <div className="flex flex-wrap gap-2">
                    {material.applications.map((app) => (
                      <Badge key={app} variant="outline">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Advantages</h3>
                    <ul className="space-y-1">
                      {material.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">Considerations</h3>
                    <ul className="space-y-1">
                      {material.cons.map((con, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 flex-shrink-0"></span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="border-border bg-card">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Ready to Start Printing?</h2>
              <p className="text-muted-foreground mb-6">
                Upload your STL file and choose the perfect material for your project
              </p>
              <Button asChild size="lg">
                <Link href="/upload">Start Your Print</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
