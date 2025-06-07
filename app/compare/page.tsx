import Link from "next/link"
import { ArrowLeft, Check, HelpCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-teal-500" />
            <span>EcoSure</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Home
            </Link>
            <Link href="/insurance/life" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Life
            </Link>
            <Link href="/insurance/health" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Health
            </Link>
            <Link href="/insurance/auto" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Auto
            </Link>
            <Link href="/compare" className="text-sm font-medium text-primary">
              Compare
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

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Compare Insurance Plans</h1>
              <p className="text-muted-foreground">
                Compare different insurance plans side by side to find the best coverage for your needs.
              </p>
            </div>

            <Tabs defaultValue="term" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="term" className="data-[state=active]:bg-teal-50">
                  Term Life
                </TabsTrigger>
                <TabsTrigger value="health" className="data-[state=active]:bg-teal-50">
                  Health
                </TabsTrigger>
                <TabsTrigger value="auto" className="data-[state=active]:bg-teal-50">
                  Auto
                </TabsTrigger>
                <TabsTrigger value="home" className="data-[state=active]:bg-teal-50">
                  Home
                </TabsTrigger>
              </TabsList>

              <TabsContent value="term">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Term Life Insurance Comparison</CardTitle>
                    <CardDescription>
                      Compare term life insurance plans from top insurers to find the right coverage for your family.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end mb-4 space-x-4">
                      <Select defaultValue="3">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Plans to compare" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">Compare 2 Plans</SelectItem>
                          <SelectItem value="3">Compare 3 Plans</SelectItem>
                          <SelectItem value="4">Compare 4 Plans</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">Customize Comparison</Button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="text-left p-3 bg-gray-50 border-b w-1/4"></th>
                            <th className="p-3 border-b bg-teal-50 text-center">
                              <div className="font-bold text-lg">HDFC Life Click 2 Protect</div>
                              <div className="text-sm text-muted-foreground">HDFC Life</div>
                              <div className="text-xl font-bold mt-2">₹750/month</div>
                            </th>
                            <th className="p-3 border-b bg-teal-100 text-center">
                              <div className="font-bold text-lg">ICICI Pru iProtect Smart</div>
                              <div className="text-sm text-muted-foreground">ICICI Prudential</div>
                              <div className="text-xl font-bold mt-2">₹800/month</div>
                              <div className="text-xs inline-block bg-teal-600 text-white px-2 py-1 rounded-full mt-1">
                                Most Popular
                              </div>
                            </th>
                            <th className="p-3 border-b bg-teal-50 text-center">
                              <div className="font-bold text-lg">Max Life Smart Secure Plus</div>
                              <div className="text-sm text-muted-foreground">Max Life</div>
                              <div className="text-xl font-bold mt-2">₹825/month</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-3 border-b font-medium flex items-center">
                              Coverage Amount
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-[200px] text-sm">
                                      The total amount your beneficiaries will receive if you pass away during the term.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                            <td className="p-3 border-b text-center">₹1 Crore</td>
                            <td className="p-3 border-b text-center">₹1 Crore</td>
                            <td className="p-3 border-b text-center">₹1 Crore</td>
                          </tr>
                          <tr>
                            <td className="p-3 border-b font-medium flex items-center">
                              Policy Term
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-[200px] text-sm">
                                      The number of years the policy will remain in effect.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                            <td className="p-3 border-b text-center">30 Years</td>
                            <td className="p-3 border-b text-center">30 Years</td>
                            <td className="p-3 border-b text-center">30 Years</td>
                          </tr>
                          <tr>
                            <td className="p-3 border-b font-medium flex items-center">
                              Accidental Death Benefit
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-[200px] text-sm">
                                      Additional payout if death occurs due to an accident.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                            <td className="p-3 border-b text-center">
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="p-3 border-b text-center">
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="p-3 border-b text-center">
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 border-b font-medium flex items-center">
                              Critical Illness Benefit
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-[200px] text-sm">
                                      Lump sum payout upon diagnosis of a covered critical illness.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                            <td className="p-3 border-b text-center">
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="p-3 border-b text-center">
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="p-3 border-b text-center">
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 border-b font-medium flex items-center">
                              Waiver of Premium
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-[200px] text-sm">
                                      Future premiums are waived if you become disabled.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                            <td className="p-3 border-b text-center">
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="p-3 border-b text-center">
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            </td>
                            <td className="p-3 border-b text-center">
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 border-b font-medium flex items-center">
                              Terminal Illness Benefit
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-[200px] text-sm">
                                      Early payout if diagnosed with a terminal illness.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                            <td className="p-3 border-b text-center">
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="p-3 border-b text-center">
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="p-3 border-b text-center">
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 border-b font-medium flex items-center">
                              Tax Benefits
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-[200px] text-sm">
                                      Premiums paid are eligible for tax deductions under Section 80C.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                            <td className="p-3 border-b text-center">
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="p-3 border-b text-center">
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="p-3 border-b text-center">
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 border-b font-medium flex items-center">Claim Settlement Ratio</td>
                            <td className="p-3 border-b text-center">99.07%</td>
                            <td className="p-3 border-b text-center">98.02%</td>
                            <td className="p-3 border-b text-center">99.35%</td>
                          </tr>
                          <tr>
                            <td className="p-3"></td>
                            <td className="p-3 text-center">
                              <Button variant="outline" className="w-full">
                                Select HDFC Life
                              </Button>
                            </td>
                            <td className="p-3 text-center">
                              <Button className="w-full">Select ICICI Pru</Button>
                            </td>
                            <td className="p-3 text-center">
                              <Button variant="outline" className="w-full">
                                Select Max Life
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-muted-foreground">
                      * Premiums may vary based on age, health conditions, and policy term.
                    </p>
                    <Button variant="link">Print Comparison</Button>
                  </CardFooter>
                </Card>

                <div className="bg-teal-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Need help choosing?</h3>
                  <p className="mb-4">
                    Our insurance experts can help you find the perfect coverage for your needs and budget.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button>Speak with an Agent</Button>
                    <Button variant="outline">Get a Custom Quote</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="health">
                <Card>
                  <CardHeader>
                    <CardTitle>Health Insurance Comparison</CardTitle>
                    <CardDescription>
                      Compare health insurance plans from top insurers to find the right coverage for your family.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8">
                      <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground mb-4">
                        We're working on adding health insurance comparison. Please check back soon.
                      </p>
                      <Button>Contact Support</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Auto Insurance Comparison</CardTitle>
                    <CardDescription>
                      Compare auto insurance plans from top insurers to find the right coverage for your vehicle.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8">
                      <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground mb-4">
                        We're working on adding auto insurance comparison. Please check back soon.
                      </p>
                      <Button>Contact Support</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="home">
                <Card>
                  <CardHeader>
                    <CardTitle>Home Insurance Comparison</CardTitle>
                    <CardDescription>
                      Compare home insurance plans from top insurers to find the right coverage for your property.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8">
                      <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground mb-4">
                        We're working on adding home insurance comparison. Please check back soon.
                      </p>
                      <Button>Contact Support</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 md:h-24">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-5 w-5 text-teal-500" />
            <span className="font-semibold">EcoSure</span>
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

function Shield({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  )
}
