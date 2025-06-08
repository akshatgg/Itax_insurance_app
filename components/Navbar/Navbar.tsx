"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LifeBuoy, UserCircle, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";

const Navbar: React.FC = () => {
  const { token, setToken, isInitialized } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/auth/login"; // redirect to login
  };

  const navLinks = [
    { href: "/quote", label: "Get Quote" },
    { href: "/claims", label: "Claims" },
    { href: "/calculator", label: "Calculator" },
    { href: "/chat-support", label: "Support" },
    { href: "/suggestions", label: "Suggestions" },
  ];

  const commonLinkClasses = "text-gray-600 hover:text-teal-600 transition-colors";
  const signUpButtonClasses = "bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors";

  if (!isInitialized) return null; // Don't render navbar until token check is done

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-teal-600">
            <ShieldCheck className="h-7 w-7" />
            <span>SecureLife</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={commonLinkClasses}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {token ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 w-9 rounded-full p-0">
                      <Avatar className="h-9 w-9 border-2 border-gray-200">
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                        <AvatarFallback>SL</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="text-sm font-medium">SecureLife User</div>
                      <div className="text-xs text-gray-500">user@example.com</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/chat-support" className="flex items-center">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        Support
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
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

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] p-6">
                  <Link href="/" className="flex items-center space-x-2 mb-6 text-xl font-bold text-teal-600">
                    <ShieldCheck className="h-7 w-7" />
                    <span>SecureLife</span>
                  </Link>
                  <div className="flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className={commonLinkClasses}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 border-t pt-4">
                    {token ? (
                      <>
                        <Link href="/profile" className={commonLinkClasses}>
                          <UserCircle className="inline-block mr-2" />
                          Profile
                        </Link>
                        <Link href="/dashboard" className={commonLinkClasses}>
                          <LayoutDashboard className="inline-block mr-2" />
                          Dashboard
                        </Link>
                        <button onClick={handleLogout} className={commonLinkClasses}>
                          <LogOut className="inline-block mr-2" />
                          Logout
                        </button>
                      </>
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
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
