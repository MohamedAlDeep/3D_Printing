"use client"
import LogoutButton from "./Logout"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, CreditCard, Home, Package, Settings, User, Upload, FileText, Star, HelpCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
  
    {
      title: "My Orders",
      href: "/myorder",
      icon: Package,
      description: "Track your prints",
      badge: "",
    },
    {
      title: "New Print",
      href: "/upload",
      icon: Upload,
      description: "Upload & request",
      highlight: true,
    },
    {
      title: "Print History",
      href: "/history",
      icon: FileText,
      description: "Past orders",
    },
    {
      title: "Reviews",
      href: "/reviews",
      icon: Star,
      description: "Rate your prints",
    },
    {
      title: "Support",
      href: "/contact",
      icon: HelpCircle,
      description: "Get help",
    },
    
    {
      title: "Profile",
      href: "/profile",
      icon: User,
      description: "Personal info",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">My Account</h2>
        <p className="text-sm text-muted-foreground">Manage your printing requests</p>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 text-sm font-medium gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 font-normal h-auto py-3 px-3",
                  pathname === item.href && "bg-muted font-medium text-foreground",
                  item.highlight && "border border-primary/20 bg-primary/5 hover:bg-primary/10",
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
        
          <div className="flex justify-between text-sm">
            <LogoutButton />
          </div>
         
        </div>
      </div>
    </div>
  )
}
