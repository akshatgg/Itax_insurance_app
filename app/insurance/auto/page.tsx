import Link from "next/link"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AutoInsurancePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-teal-600 text-white py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <Link href="/" className="inline-flex items-center text-teal-100 hover:text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Auto Insurance</h1>
              <p className="text-teal-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Comprehensive coverage for your vehicles with competitive rates and excellent service.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="lg" variant="secondary">
                  Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-teal-600"
                >
                  Contact an Agent
                </Button>
              </div>
            </div>
            <img
              src="/car-insurance-concept.png"
              alt="Auto Insurance"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>

      {/* Coverage Options */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Coverage Options</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the coverage that's right for you and your vehicle.
              </p>
            </div>
          </div>

          <Tabs defaultValue="basic" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="standard">Standard</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Coverage</CardTitle>
                  <CardDescription>Essential protection for your vehicle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Liability Coverage</h3>
                        <p className="text-sm text-gray-500">
                          Covers damages to others if you're at fault in an accident
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Property Damage</h3>
                        <p className="text-sm text-gray-500">Covers damage to other people's property</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Uninsured Motorist</h3>
                        <p className="text-sm text-gray-500">Protection if you're hit by an uninsured driver</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Basic Coverage</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="standard" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Coverage</CardTitle>
                  <CardDescription>Comprehensive protection for most drivers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">All Basic Coverage</h3>
                        <p className="text-sm text-gray-500">Includes all features of the Basic plan</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Collision Coverage</h3>
                        <p className="text-sm text-gray-500">Covers damage to your vehicle from an accident</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Comprehensive Coverage</h3>
                        <p className="text-sm text-gray-500">
                          Covers damage from theft, vandalism, and natural disasters
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Roadside Assistance</h3>
                        <p className="text-sm text-gray-500">24/7 help for breakdowns, flat tires, and more</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Standard Coverage</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="premium" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Premium Coverage</CardTitle>
                  <CardDescription>Maximum protection for complete peace of mind</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">All Standard Coverage</h3>
                        <p className="text-sm text-gray-500">Includes all features of the Standard plan</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Gap Insurance</h3>
                        <p className="text-sm text-gray-500">
                          Covers the difference between your car's value and what you owe
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">New Car Replacement</h3>
                        <p className="text-sm text-gray-500">
                          Replaces your new car if it's totaled within the first year
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Rental Car Coverage</h3>
                        <p className="text-sm text-gray-500">
                          Covers rental car costs while your car is being repaired
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Accident Forgiveness</h3>
                        <p className="text-sm text-gray-500">Your rates won't increase after your first accident</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Premium Coverage</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Quote Calculator */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get a Quote</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See how much you could save on your auto insurance.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-2xl mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Quote Calculator</CardTitle>
                <CardDescription>Fill out the form below to get an estimate</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="vehicle-year" className="text-sm font-medium">
                        Vehicle Year
                      </label>
                      <select id="vehicle-year" className="w-full p-2 border rounded-md">
                        <option value="">Select Year</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="vehicle-make" className="text-sm font-medium">
                        Vehicle Make
                      </label>
                      <select id="vehicle-make" className="w-full p-2 border rounded-md">
                        <option value="">Select Make</option>
                        <option value="toyota">Toyota</option>
                        <option value="honda">Honda</option>
                        <option value="ford">Ford</option>
                        <option value="chevrolet">Chevrolet</option>
                        <option value="bmw">BMW</option>
                        <option value="mercedes">Mercedes</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="vehicle-model" className="text-sm font-medium">
                        Vehicle Model
                      </label>
                      <select id="vehicle-model" className="w-full p-2 border rounded-md">
                        <option value="">Select Model</option>
                        <option value="camry">Camry</option>
                        <option value="corolla">Corolla</option>
                        <option value="rav4">RAV4</option>
                        <option value="civic">Civic</option>
                        <option value="accord">Accord</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="zip-code" className="text-sm font-medium">
                        Zip Code
                      </label>
                      <input
                        id="zip-code"
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter zip code"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="coverage-type" className="text-sm font-medium">
                      Coverage Type
                    </label>
                    <select id="coverage-type" className="w-full p-2 border rounded-md">
                      <option value="">Select Coverage</option>
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full">
                    Calculate Quote
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Our Customers Say</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Don't just take our word for it. Here's what our customers have to say about our auto insurance.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img src="/diverse-group.png" alt="Customer" className="rounded-full w-12 h-12 object-cover" />
                  <div>
                    <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                    <CardDescription>Customer since 2020</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  "I saved over $500 a year by switching to this insurance! The customer service is excellent and filing
                  a claim was incredibly easy."
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img src="/thoughtful-man.png" alt="Customer" className="rounded-full w-12 h-12 object-cover" />
                  <div>
                    <CardTitle className="text-lg">Michael Chen</CardTitle>
                    <CardDescription>Customer since 2022</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  "After my accident, my agent walked me through every step of the claims process. I was back on the
                  road in no time. Highly recommend!"
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img
                    src="/diverse-woman-portrait.png"
                    alt="Customer"
                    className="rounded-full w-12 h-12 object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">Jessica Martinez</CardTitle>
                    <CardDescription>Customer since 2019</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  "The roadside assistance has saved me multiple times. Worth every penny for the peace of mind alone.
                  Plus, their rates are competitive!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-teal-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Get Protected?</h2>
              <p className="max-w-[900px] text-teal-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of satisfied customers who trust us with their auto insurance needs.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" variant="secondary">
                Get a Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-teal-600"
              >
                Contact an Agent
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-900 text-gray-300">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h4 className="text-lg font-medium">Insurance</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/insurance/auto" className="hover:text-white">
                    Auto Insurance
                  </Link>
                </li>
                <li>
                  <Link href="/insurance/home" className="hover:text-white">
                    Home Insurance
                  </Link>
                </li>
                <li>
                  <Link href="/insurance/health" className="hover:text-white">
                    Health Insurance
                  </Link>
                </li>
                <li>
                  <Link href="/insurance/life" className="hover:text-white">
                    Life Insurance
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-medium">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-medium">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/resources/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/resources/guides" className="hover:text-white">
                    Insurance Guides
                  </Link>
                </li>
                <li>
                  <Link href="/resources/calculator" className="hover:text-white">
                    Coverage Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/resources/glossary" className="hover:text-white">
                    Insurance Glossary
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-medium">Contact</h4>
              <ul className="space-y-2">
                <li>1-800-INSURANCE</li>
                <li>support@insuranceapp.com</li>
                <li>123 Insurance St, New York, NY 10001</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 Insurance App. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
