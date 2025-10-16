
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Printer, Mail, Lock, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"



import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const [gender, setGender] = useState("")
  const [phone, setPhone] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <ThemeToggle />
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Printer className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">PrintCraft</span>
            </div>
            <CardTitle className="text-2xl text-foreground">Create Account</CardTitle>
            <CardDescription>Sign up to start your 3D printing journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="John"
                    className="pl-10"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Last Name</label>
                <Input
                  placeholder="Doe"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>


            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Gender</label>
                <select
                  className="w-full border rounded px-3 py-2 bg-background text-foreground"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>


            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Create a password"
                  className="pl-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>


            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                // @ts-ignore
                onCheckedChange={setAgreedToTerms}
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
              />
              <label htmlFor="terms" className="text-sm text-foreground cursor-pointer select-none">
                I agree to the{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>            <Button
              className="w-full mt-4"
              disabled={loading}
              onClick={async (e) => {
                e.preventDefault()
                setError("")
                if (!firstName || !lastName || !email || !password || !confirmPassword || !gender || !phone) {
                  setError("Please fill in all fields.")
                  return
                }
                if (password !== confirmPassword) {
                  setError("Passwords do not match.")
                  return
                }
                if (!agreedToTerms) {
                  setError("You must agree to the terms.")
                  return
                }
                setLoading(true)
                try {
                  const res = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ firstName, lastName, email, password, gender, phone })
                  })
                  const data = await res.json()
                  if (data.success) {
                    router.push("/dashboard")
                  } else {
                    setError(data.error || "Registration failed.")
                  }
                } catch (err) {
                  setError("Registration failed.")
                } finally {
                  setLoading(false)
                }
              }}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>

            {error && (
              <div className="text-red-500 text-sm text-center mt-2">{error}</div>
            )}

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
