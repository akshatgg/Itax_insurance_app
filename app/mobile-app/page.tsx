import Link from "next/link"
import { ArrowLeft, ArrowRight, Bell, Car, FileText, Home, MessageSquare, Phone, Shield, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MobileAppPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-teal-500" />
            <span>Insurance App</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Home
            </Link>
            <Link href="/insurance/auto" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Auto
            </Link>
            <Link href="/insurance/home" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Home
            </Link>
            <Link href="/mobile-app" className="text-sm font-medium text-primary">
              Mobile App
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-10">
          <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-800 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Insurance on the Go</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Manage your insurance policies, file claims, and get support anytime, anywhere with our mobile app.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Instant Access to Your Policies</h3>
                    <p className="text-muted-foreground">
                      View your policy details, coverage limits, and ID cards with just a few taps.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Easy Claims Filing</h3>
                    <p className="text-muted-foreground">
                      Submit claims in minutes with our streamlined process. Take photos and upload them directly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Important Notifications</h3>
                    <p className="text-muted-foreground">
                      Get alerts for policy renewals, payment due dates, and claim status updates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">24/7 Support</h3>
                    <p className="text-muted-foreground">
                      Chat with our virtual assistant or connect with a live agent whenever you need help.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button className="h-14 px-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2 h-5 w-5"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.68 1.32-1.53 2.64-2.53 4.08z"></path>
                    <path d="M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.26 2.01-1.16 4.07-3.74 4.25z"></path>
                  </svg>
                  Download on App Store
                </Button>
                <Button className="h-14 px-6" variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2 h-5 w-5"
                  >
                    <path d="M17.9 5c.1.1.2.3.3.5v13.1c-.1.2-.2.3-.3.5l-7.6-7.1 7.6-7z"></path>
                    <path d="M3 4.3C3.2 4.1 3.4 4 3.7 4l12.1 6.9-3.8 3.5L3 4.3z"></path>
                    <path d="M3 19.7c-.2-.2-.3-.4-.3-.7v-14l9.1 10.1-3.8 3.5L3 19.7z"></path>
                    <path d="M15.8 20.6c-.3 0-.5-.1-.8-.2l-3.8-2.2-4.5 4.1c.3.2.5.3.8.3h8.5c.3 0 .5-.1.8-.3l-.9-.8-.1-.9z"></path>
                  </svg>
                  Get it on Google Play
                </Button>
              </div>
            </div>
            <div className="relative mx-auto">
              <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                  <Tabs defaultValue="home">
                    <div className="overflow-y-auto h-[520px]">
                      <TabsContent value="home" className="m-0">
                        <MobileAppHome />
                      </TabsContent>
                      <TabsContent value="policies" className="m-0">
                        <MobileAppPolicies />
                      </TabsContent>
                      <TabsContent value="claims" className="m-0">
                        <MobileAppClaims />
                      </TabsContent>
                      <TabsContent value="id-cards" className="m-0">
                        <MobileAppIDCards />
                      </TabsContent>
                      <TabsContent value="account" className="m-0">
                        <MobileAppAccount />
                      </TabsContent>
                    </div>
                    <TabsList className="grid h-[52px] grid-cols-5 bg-gray-100">
                      <TabsTrigger value="home" className="data-[state=active]:bg-transparent">
                        <div className="flex flex-col items-center text-xs">
                          <Home className="h-5 w-5" />
                          <span>Home</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="policies" className="data-[state=active]:bg-transparent">
                        <div className="flex flex-col items-center text-xs">
                          <FileText className="h-5 w-5" />
                          <span>Policies</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="claims" className="data-[state=active]:bg-transparent">
                        <div className="flex flex-col items-center text-xs">
                          <Shield className="h-5 w-5" />
                          <span>Claims</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="id-cards" className="data-[state=active]:bg-transparent">
                        <div className="flex flex-col items-center text-xs">
                          <Car className="h-5 w-5" />
                          <span>ID Cards</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="account" className="data-[state=active]:bg-transparent">
                        <div className="flex flex-col items-center text-xs">
                          <User className="h-5 w-5" />
                          <span>Account</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="bg-teal-100 p-3 rounded-full w-12 h-12 flex items-center justify-center text-teal-600 mb-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <CardTitle>Digital ID Cards</CardTitle>
                  <CardDescription>
                    Access your insurance ID cards anytime, even without internet connection.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Available offline
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Easy to share
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Always up-to-date
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="bg-teal-100 p-3 rounded-full w-12 h-12 flex items-center justify-center text-teal-600 mb-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <CardTitle>Mobile Claims</CardTitle>
                  <CardDescription>File and track claims directly from your smartphone.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Take photos at the scene
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Real-time claim status
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Direct communication with adjusters
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="bg-teal-100 p-3 rounded-full w-12 h-12 flex items-center justify-center text-teal-600 mb-4">
                    <Bell className="h-6 w-6" />
                  </div>
                  <CardTitle>Smart Notifications</CardTitle>
                  <CardDescription>Stay informed with timely alerts and reminders.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Payment reminders
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Policy renewal alerts
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-2 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Claim status updates
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-20 bg-teal-50 rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Download our mobile app today and experience the convenience of managing your insurance on the go.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="h-14 px-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-2 h-5 w-5"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.68 1.32-1.53 2.64-2.53 4.08z"></path>
                      <path d="M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.26 2.01-1.16 4.07-3.74 4.25z"></path>
                    </svg>
                    Download on App Store
                  </Button>
                  <Button className="h-14 px-6" variant="outline">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-2 h-5 w-5"
                    >
                      <path d="M17.9 5c.1.1.2.3.3.5v13.1c-.1.2-.2.3-.3.5l-7.6-7.1 7.6-7z"></path>
                      <path d="M3 4.3C3.2 4.1 3.4 4 3.7 4l12.1 6.9-3.8 3.5L3 4.3z"></path>
                      <path d="M3 19.7c-.2-.2-.3-.4-.3-.7v-14l9.1 10.1-3.8 3.5L3 19.7z"></path>
                      <path d="M15.8 20.6c-.3 0-.5-.1-.8-.2l-3.8-2.2-4.5 4.1c.3.2.5.3.8.3h8.5c.3 0 .5-.1.8-.3l-.9-.8-.1-.9z"></path>
                    </svg>
                    Get it on Google Play
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src="/mobile-app-qr.png"
                    alt="QR Code to download app"
                    className="w-48 h-48 border-8 border-white rounded-xl shadow-lg"
                  />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium">
                    Scan to download
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 md:h-24">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-5 w-5 text-teal-500" />
            <span className="font-semibold">Insurance App</span>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function MobileAppHome() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Hello, John</h2>
          <p className="text-xs text-muted-foreground">Welcome back</p>
        </div>
        <div className="relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </div>
      </div>

      <Card className="bg-teal-600 text-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Next Payment</h3>
            <span className="text-xs bg-teal-500 px-2 py-1 rounded-full">Due in 14 days</span>
          </div>
          <div className="text-2xl font-bold mb-1">$248.75</div>
          <div className="text-xs text-teal-100">Auto & Home Bundle</div>
          <Button size="sm" variant="secondary" className="mt-4 w-full">
            Make Payment
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3 flex flex-col items-center text-center">
            <div className="bg-teal-100 p-2 rounded-full text-teal-600 mb-2">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-medium">My Policies</h3>
            <p className="text-xs text-muted-foreground">View all policies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex flex-col items-center text-center">
            <div className="bg-teal-100 p-2 rounded-full text-teal-600 mb-2">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-medium">File a Claim</h3>
            <p className="text-xs text-muted-foreground">Report an incident</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex flex-col items-center text-center">
            <div className="bg-teal-100 p-2 rounded-full text-teal-600 mb-2">
              <Car className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-medium">ID Cards</h3>
            <p className="text-xs text-muted-foreground">Access your cards</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex flex-col items-center text-center">
            <div className="bg-teal-100 p-2 rounded-full text-teal-600 mb-2">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-medium">Support</h3>
            <p className="text-xs text-muted-foreground">Get help</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="font-medium mb-2">Active Claims</h3>
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-sm">Auto Accident Claim</h4>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">In Progress</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Claim #CL-123456 • Filed on Apr 12, 2025</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>75% Complete</span>
              <span>Updated 2 days ago</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Quick Actions</h3>
        </div>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Phone className="h-4 w-4 mr-2" />
            Contact Roadside Assistance
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat with an Agent
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Request Policy Documents
          </Button>
        </div>
      </div>
    </div>
  )
}

function MobileAppPolicies() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">My Policies</h2>
        <Button variant="ghost" size="sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </Button>
      </div>

      <div className="space-y-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                <Car className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Auto Insurance</h3>
                <p className="text-xs text-muted-foreground">Policy #AUTO-12345678</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Vehicle:</span>
                <p className="font-medium">2022 Toyota Camry</p>
              </div>
              <div>
                <span className="text-muted-foreground">Premium:</span>
                <p className="font-medium">$125.00/month</p>
              </div>
              <div>
                <span className="text-muted-foreground">Coverage:</span>
                <p className="font-medium">Premium</p>
              </div>
              <div>
                <span className="text-muted-foreground">Renewal:</span>
                <p className="font-medium">Jan 15, 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                <Home className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Home Insurance</h3>
                <p className="text-xs text-muted-foreground">Policy #HOME-87654321</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Property:</span>
                <p className="font-medium">123 Main St</p>
              </div>
              <div>
                <span className="text-muted-foreground">Premium:</span>
                <p className="font-medium">$98.75/month</p>
              </div>
              <div>
                <span className="text-muted-foreground">Coverage:</span>
                <p className="font-medium">Standard</p>
              </div>
              <div>
                <span className="text-muted-foreground">Renewal:</span>
                <p className="font-medium">Mar 22, 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Life Insurance</h3>
                <p className="text-xs text-muted-foreground">Policy #LIFE-98765432</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <p className="font-medium">Term Life</p>
              </div>
              <div>
                <span className="text-muted-foreground">Premium:</span>
                <p className="font-medium">$25.00/month</p>
              </div>
              <div>
                <span className="text-muted-foreground">Coverage:</span>
                <p className="font-medium">$500,000</p>
              </div>
              <div>
                <span className="text-muted-foreground">Term End:</span>
                <p className="font-medium">Jun 10, 2045</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4">
        <Button className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 mr-2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Policy
        </Button>
      </div>
    </div>
  )
}

function MobileAppClaims() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Claims</h2>
        <Button variant="ghost" size="sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </Button>
      </div>

      <div className="flex overflow-x-auto space-x-2 py-2">
        <Button size="sm" className="rounded-full">
          All Claims
        </Button>
        <Button size="sm" variant="outline" className="rounded-full whitespace-nowrap">
          In Progress
        </Button>
        <Button size="sm" variant="outline" className="rounded-full whitespace-nowrap">
          Completed
        </Button>
        <Button size="sm" variant="outline" className="rounded-full whitespace-nowrap">
          Denied
        </Button>
      </div>

      <div className="space-y-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">Auto Accident Claim</h3>
                <p className="text-xs text-muted-foreground">Claim #CL-123456</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">In Progress</span>
            </div>
            <div className="text-xs text-muted-foreground mb-3">Filed on Apr 12, 2025</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
              <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <div className="flex justify-between text-xs mb-3">
              <span>75% Complete</span>
              <span>Updated 2 days ago</span>
            </div>
            <div className="text-xs">
              <span className="font-medium">Next step:</span> Inspection scheduled for May 18, 2025
            </div>
            <Button size="sm" variant="outline" className="w-full mt-3">
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">Home Water Damage</h3>
                <p className="text-xs text-muted-foreground">Claim #CL-789012</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
            </div>
            <div className="text-xs text-muted-foreground mb-3">Filed on Feb 3, 2025</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
              <div className="bg-green-600 h-1.5 rounded-full" style={{ width: "100%" }}></div>
            </div>
            <div className="flex justify-between text-xs mb-3">
              <span>100% Complete</span>
              <span>Updated Mar 15, 2025</span>
            </div>
            <div className="text-xs">
              <span className="font-medium">Resolution:</span> Payment of $3,450 issued on Mar 15, 2025
            </div>
            <Button size="sm" variant="outline" className="w-full mt-3">
              View Details
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4">
        <Button className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 mr-2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          File a New Claim
        </Button>
      </div>
    </div>
  )
}

function MobileAppIDCards() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">ID Cards</h2>
        <Button variant="ghost" size="sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-xl p-4 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-sm">Auto Insurance</h3>
              <p className="text-xs text-teal-100">Policy #AUTO-12345678</p>
            </div>
            <Shield className="h-6 w-6" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="text-xs text-teal-200">Insured</p>
                <p className="font-medium">John Doe</p>
              </div>
              <div>
                <p className="text-xs text-teal-200">Vehicle</p>
                <p className="font-medium">2022 Toyota Camry</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="text-xs text-teal-200">Effective</p>
                <p className="font-medium">Jan 15, 2025</p>
              </div>
              <div>
                <p className="text-xs text-teal-200">Expires</p>
                <p className="font-medium">Jan 15, 2026</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-teal-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-teal-200">Insurance Company</p>
                <p className="font-medium">Insurance App Inc.</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-teal-200">Customer Service</p>
                <p className="font-medium">1-800-INSURANCE</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl p-4 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-sm">Home Insurance</h3>
              <p className="text-xs text-emerald-100">Policy #HOME-87654321</p>
            </div>
            <Home className="h-6 w-6" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="text-xs text-emerald-200">Insured</p>
                <p className="font-medium">John Doe</p>
              </div>
              <div>
                <p className="text-xs text-emerald-200">Property</p>
                <p className="font-medium">123 Main St</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="text-xs text-emerald-200">Effective</p>
                <p className="font-medium">Mar 22, 2025</p>
              </div>
              <div>
                <p className="text-xs text-emerald-200">Expires</p>
                <p className="font-medium">Mar 22, 2026</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-emerald-200">Insurance Company</p>
                <p className="font-medium">Insurance App Inc.</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-200">Customer Service</p>
                <p className="font-medium">1-800-INSURANCE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Available Offline</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-green-500"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <p className="text-xs text-muted-foreground">
          Your ID cards are available offline. You can access them even without an internet connection.
        </p>
      </div>
    </div>
  )
}

function MobileAppAccount() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-lg font-bold">John Doe</h2>
          <p className="text-xs text-muted-foreground">john.doe@example.com</p>
          <p className="text-xs text-muted-foreground">(555) 123-4567</p>
        </div>
      </div>

      <div className="space-y-3">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Personal Information
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Security & Login
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <path d="M17 6.1H3a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9.1a3 3 0 0 0-3-3Z"></path>
                  <path d="M10 15a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                  <path d="M22 6.1V6a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3v.1"></path>
                </svg>
                Payment Methods
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                  <span className="text-sm">Dark Mode</span>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                  <span className="absolute h-4 w-4 rounded-full bg-white translate-x-1"></span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600">
                  <span className="absolute h-4 w-4 rounded-full bg-white translate-x-6"></span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M22 10V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4"></path>
                    <path d="M2 10v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8"></path>
                    <path d="M2 10h20"></path>
                  </svg>
                  <span className="text-sm">Email Notifications</span>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600">
                  <span className="absolute h-4 w-4 rounded-full bg-white translate-x-6"></span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  </svg>
                  <span className="text-sm">Face/Touch ID Login</span>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600">
                  <span className="absolute h-4 w-4 rounded-full bg-white translate-x-6"></span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Support</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Help Center
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
                </svg>
                Feedback
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="pt-4">
          <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign Out
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>App Version 2.5.1</p>
          <p className="mt-1">© 2025 Insurance App. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
