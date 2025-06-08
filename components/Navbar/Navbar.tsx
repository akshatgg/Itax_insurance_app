"use client"

import React from "react"
import Link from "next/link"
// import { useAuth } from "@/context/AuthContext"; // Use your actual auth context
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LifeBuoy, UserCircle, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react"

// Mock hook for demonstration purposes in v0.
// Replace this with your actual useAuth hook.
const useAuth = () => {
  const [token, setToken] = React.useState<string | null>("mock-token") // Set to null to see logged-out state
  const handleLogout = () => {
    setToken(null)
    console.log("User logged out")
    // window.location.href = "/auth/login"; // In a real app
  }
  return { token, handleLogout }
}

const Navbar: React.FC = () => {
  const { token, handleLogout } = useAuth()

  const navLinks = [
    { href: "/quote", label: "Get Quote" },
    { href: "/claims", label: "Claims" },
    { href: "/calculator", label: "Calculator" },
    // Dashboard is in user dropdown when logged in
    { href: "/chat-support", label: "Support", loggedInOnly: false }, // Example: Support link visible to all
    { href: "/suggestions", label: "Suggestions" },
  ]

  const commonLinkClasses = "text-gray-600 hover:text-teal-600 transition-colors"
  const signUpButtonClasses = "bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-teal-600">
              <ShieldCheck className="h-7 w-7" />
              <span>SecureLife</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => {
              if (link.loggedInOnly && !token) return null
              return (
                <Link key={link.href} href={link.href} className={commonLinkClasses}>
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop Auth Area and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {token ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="relative h-9 w-9 rounded-full hover:bg-gray-100">
                      <Avatar className="h-9 w-9 border-2 border-gray-200">
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="User Avatar" />
                        <AvatarFallback className="bg-teal-500 text-white">SL</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-white shadow-lg rounded-md border-gray-200"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal px-3 py-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-gray-800">SecureLife User</p>
                        <p className="text-xs leading-none text-gray-500">user@example.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem asChild className="hover:bg-gray-100 cursor-pointer">
                      <Link href="/dashboard" className={`flex items-center w-full px-3 py-2 ${commonLinkClasses}`}>
                        <LayoutDashboard className="mr-2 h-4 w-4 text-teal-600" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-100 cursor-pointer">
                      <Link href="/profile" className={`flex items-center w-full px-3 py-2 ${commonLinkClasses}`}>
                        <UserCircle className="mr-2 h-4 w-4 text-teal-600" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-gray-100 cursor-pointer">
                      <Link href="/chat-support" className={`flex items-center w-full px-3 py-2 ${commonLinkClasses}`}>
                        <LifeBuoy className="mr-2 h-4 w-4 text-teal-600" />
                        <span>Support</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className={`hover:bg-gray-100 cursor-pointer flex items-center w-full px-3 py-2 ${commonLinkClasses}`}
                    >
                      <LogOut className="mr-2 h-4 w-4 text-teal-600" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/auth/login" className={commonLinkClasses}>
                    Login
                  </Link>
                  <Link href="/auth/register" className={signUpButtonClasses}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Trigger - Now on the right */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-gray-300 text-gray-600 hover:bg-gray-100">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white p-0">
                  <div className="p-6">
                    <Link href="/" className="flex items-center space-x-2 mb-6 text-xl font-bold text-teal-600">
                      <ShieldCheck className="h-7 w-7" />
                      <span>SecureLife</span>
                    </Link>
                    <div className="flex flex-col space-y-2">
                      {navLinks.map((link) => {
                        if (link.loggedInOnly && !token) return null
                        return (
                          <Link key={link.href} href={link.href} className={`${commonLinkClasses} py-2 text-base`}>
                            {link.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                  {/* Auth links in Sheet */}
                  <div className="mt-auto border-t border-gray-200 p-6 space-y-3">
                    {token ? (
                      <>
                        <Link href="/profile" className={`flex items-center space-x-2 ${commonLinkClasses}`}>
                          <UserCircle className="h-5 w-5" />
                          <span>Profile</span>
                        </Link>
                        <Link href="/dashboard" className={`flex items-center space-x-2 ${commonLinkClasses}`}>
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left flex items-center space-x-2 ${commonLinkClasses}`}
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className={`block w-full text-center px-4 py-2 rounded-md border border-gray-300 hover:border-teal-500 ${commonLinkClasses}`}
                        >
                          Login
                        </Link>
                        <Link href="/auth/register" className={`block w-full text-center ${signUpButtonClasses}`}>
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar