import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground mt-2">
            Have questions about our 3D printing service? Get in touch with us.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>Phone</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>+1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground mt-1">Monday - Friday, 9am - 5pm</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>Email</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>support@printcube.com</p>
              <p className="text-sm text-muted-foreground mt-1">We'll respond within 24 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>123 Print Street</p>
              <p>San Francisco, CA 94107</p>
              <p className="text-sm text-muted-foreground mt-1">Visit our printing facility</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us about your inquiry or question..." rows={5} />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </CardFooter>
          </Card>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common questions about our service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">What file formats do you accept?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We accept STL files for 3D printing. Make sure your model is watertight and properly scaled.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">How long does printing take?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Print time depends on the size and complexity of your model. Our system will calculate an estimated
                    print time when you upload your file.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">What materials do you offer?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We offer PLA, ABS, PETG, TPU, and more. Each material comes in various colors and has different
                    properties.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">How much does shipping cost?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Shipping costs depend on the size and weight of your print, as well as your location. You'll see the
                    exact cost during checkout.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Can I cancel my order?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You can cancel your order before it enters the printing phase. Once printing has started,
                    cancellations are not possible.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/faq">
                  <Button variant="outline">View All FAQs</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Location</CardTitle>
              <CardDescription>Visit our printing facility or send your prints to this address</CardDescription>
            </CardHeader>
            <CardContent className="p-0 aspect-[2/1] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.50764017948551!3d37.75781499229416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1656268224354!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PrintCube Location"
              ></iframe>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
