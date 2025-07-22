import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MaterialsPage() {
  const materials = [
    {
      id: "pla",
      name: "PLA",
      description:
        "Polylactic Acid (PLA) is a biodegradable thermoplastic derived from renewable resources like corn starch or sugar cane.",
      properties: [
        "Biodegradable and environmentally friendly",
        "Easy to print with - low warping and no heated bed required",
        "Rigid but somewhat brittle",
        "Lower temperature resistance (softens around 60°C)",
        "Great for decorative items, prototypes, and low-stress applications",
      ],
      colors: ["White", "Black", "Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Natural"],
      price: "$25/kg",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "abs",
      name: "ABS",
      description:
        "Acrylonitrile Butadiene Styrene (ABS) is a common thermoplastic known for its strength and durability.",
      properties: [
        "Strong, durable, and impact-resistant",
        "Good temperature resistance (up to 100°C)",
        "Can be post-processed with acetone for smooth finish",
        "Requires higher print temperatures and heated bed",
        "Some warping during printing",
        "Ideal for functional parts and mechanical components",
      ],
      colors: ["White", "Black", "Red", "Blue", "Gray"],
      price: "$28/kg",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "petg",
      name: "PETG",
      description:
        "Polyethylene Terephthalate Glycol (PETG) combines the ease of printing of PLA with the strength and durability of ABS.",
      properties: [
        "Strong, flexible, and impact-resistant",
        "Good temperature resistance (up to 80°C)",
        "Chemical resistant",
        "Low shrinkage and minimal warping",
        "Food safe (but not FDA approved without post-processing)",
        "Great for functional parts, mechanical components, and water-tight applications",
      ],
      colors: ["Clear", "White", "Black", "Blue"],
      price: "$30/kg",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "tpu",
      name: "TPU Flexible",
      description: "Thermoplastic Polyurethane (TPU) is a flexible filament that produces rubber-like parts.",
      properties: [
        "Highly flexible and elastic",
        "Excellent abrasion resistance",
        "Good chemical resistance",
        "Harder to print - requires slower speeds",
        "Perfect for flexible parts, phone cases, grips, and protective covers",
      ],
      colors: ["White", "Black"],
      price: "$45/kg",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Materials</h1>
          <p className="text-muted-foreground mt-2">Explore our range of high-quality 3D printing materials</p>
        </div>

        <Tabs defaultValue="pla" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {materials.map((material) => (
              <TabsTrigger key={material.id} value={material.id}>
                {material.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {materials.map((material) => (
            <TabsContent key={material.id} value={material.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{material.name}</CardTitle>
                  <CardDescription>{material.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Image
                        src={material.image || "/placeholder.svg"}
                        alt={`${material.name} filament`}
                        width={300}
                        height={300}
                        className="rounded-lg object-cover w-full"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-lg">Properties</h3>
                        <ul className="mt-2 space-y-1">
                          {material.properties.map((property, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{property}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-medium text-lg">Available Colors</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {material.colors.map((color) => (
                            <span key={color} className="px-3 py-1 bg-muted rounded-full text-sm">
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-lg">Price</h3>
                        <p className="mt-1">{material.price}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/upload">
                    <Button className="gap-2">
                      Print with {material.name} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Material Comparison</h2>
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-3 text-left font-medium">Property</th>
                    {materials.map((material) => (
                      <th key={material.id} className="px-4 py-3 text-left font-medium">
                        {material.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-t px-4 py-3 font-medium">Strength</td>
                    <td className="border-t px-4 py-3">Medium</td>
                    <td className="border-t px-4 py-3">High</td>
                    <td className="border-t px-4 py-3">High</td>
                    <td className="border-t px-4 py-3">Low</td>
                  </tr>
                  <tr>
                    <td className="border-t px-4 py-3 font-medium">Flexibility</td>
                    <td className="border-t px-4 py-3">Low</td>
                    <td className="border-t px-4 py-3">Low</td>
                    <td className="border-t px-4 py-3">Medium</td>
                    <td className="border-t px-4 py-3">Very High</td>
                  </tr>
                  <tr>
                    <td className="border-t px-4 py-3 font-medium">Print Difficulty</td>
                    <td className="border-t px-4 py-3">Easy</td>
                    <td className="border-t px-4 py-3">Medium</td>
                    <td className="border-t px-4 py-3">Easy</td>
                    <td className="border-t px-4 py-3">Hard</td>
                  </tr>
                  <tr>
                    <td className="border-t px-4 py-3 font-medium">Heat Resistance</td>
                    <td className="border-t px-4 py-3">Low (60°C)</td>
                    <td className="border-t px-4 py-3">High (100°C)</td>
                    <td className="border-t px-4 py-3">Medium (80°C)</td>
                    <td className="border-t px-4 py-3">Medium (80°C)</td>
                  </tr>
                  <tr>
                    <td className="border-t px-4 py-3 font-medium">Best Uses</td>
                    <td className="border-t px-4 py-3">Decorative items, prototypes</td>
                    <td className="border-t px-4 py-3">Functional parts, mechanical components</td>
                    <td className="border-t px-4 py-3">Water-tight applications, durable parts</td>
                    <td className="border-t px-4 py-3">Flexible parts, protective covers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
