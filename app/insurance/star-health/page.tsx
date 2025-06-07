import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Check, Shield, Heart, Clock, Leaf, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StarHealthInsurance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/compare" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Compare
          </Link>
          <Badge variant="outline" className="bg-white">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            4.5/5 Rating
          </Badge>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Image
                  src="/placeholder.svg?height=60&width=60&text=Star"
                  alt="Star Health Insurance"
                  width={60}
                  height={60}
                  className="rounded-lg mr-4"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Star Health Insurance</h1>
                  <p className="text-gray-600">India's First Standalone Health Insurer</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">₹12,500</div>
                  <div className="text-sm text-gray-600">Starting Premium</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">8,500+</div>
                  <div className="text-sm text-gray-600">Cashless Hospitals</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-gray-600">Claim Settlement</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-gray-600">Customer Support</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button size="lg" className="flex-1">
                  Get Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  Calculate Premium
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500&text=Star+Health+Family"
                alt="Star Health Family Coverage"
                width={500}
                height={400}
                className="rounded-xl shadow-lg"
              />
              <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Policy Plans */}
        <Tabs defaultValue="comprehensive" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl p-1">
            <TabsTrigger value="comprehensive" className="rounded-lg">
              Comprehensive
            </TabsTrigger>
            <TabsTrigger value="family-floater" className="rounded-lg">
              Family Floater
            </TabsTrigger>
            <TabsTrigger value="senior-citizen" className="rounded-lg">
              Senior Citizen
            </TabsTrigger>
            <TabsTrigger value="critical-illness" className="rounded-lg">
              Critical Illness
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comprehensive" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-blue-600" />
                    Basic Plan
                  </CardTitle>
                  <CardDescription>Essential health coverage for individuals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-4">₹8,500/year</div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Sum Insured: ₹3 Lakhs
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Cashless Hospitals: 5,000+
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Pre & Post Hospitalization
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Day Care Procedures
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Choose Plan</Button>
                </CardFooter>
              </Card>

              <Card className="border-2 border-green-200 bg-green-50 relative">
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-600">Most Popular</Badge>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Premium Plan
                  </CardTitle>
                  <CardDescription>Comprehensive coverage with additional benefits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-4">₹12,500/year</div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Sum Insured: ₹5 Lakhs
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Cashless Hospitals: 8,500+
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Maternity Coverage
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Ayurvedic Treatment
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      No Room Rent Limit
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Choose Plan</Button>
                </CardFooter>
              </Card>

              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-purple-600" />
                    Supreme Plan
                  </CardTitle>
                  <CardDescription>Maximum coverage with premium benefits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-4">₹18,500/year</div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Sum Insured: ₹10 Lakhs
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Cashless Hospitals: 10,000+
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      International Coverage
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Organ Transplant Cover
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Annual Health Check-up
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Choose Plan</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="family-floater" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Family Floater - 4 Members</CardTitle>
                  <CardDescription>Shared coverage for entire family</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-4">₹15,000/year</div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Sum Insured: ₹10 Lakhs (Shared)
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Covers 2 Adults + 2 Children
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Maternity & New Born Coverage
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Vaccination Coverage
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Choose Plan</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Family Floater - 6 Members</CardTitle>
                  <CardDescription>Extended family coverage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-4">₹22,000/year</div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Sum Insured: ₹15 Lakhs (Shared)
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Covers 2 Adults + 4 Children
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Includes Parents Coverage
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      Restoration Benefit
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Choose Plan</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="senior-citizen" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Senior Citizen Health Plan</CardTitle>
                <CardDescription>Specialized coverage for ages 60+</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-4">₹25,000/year</div>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Sum Insured: ₹5 Lakhs
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Pre-existing Diseases Covered
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Domiciliary Treatment
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Cataract Surgery Coverage
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Joint Replacement Surgery
                      </li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3">Special Benefits for Seniors</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• No medical check-up required up to age 65</li>
                      <li>• Reduced waiting period for pre-existing conditions</li>
                      <li>• Free annual health check-up</li>
                      <li>• 24/7 health helpline</li>
                      <li>• Home healthcare services</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Choose Plan</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="critical-illness" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Critical Illness Cover</CardTitle>
                <CardDescription>Protection against major illnesses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-red-600 mb-4">₹8,000/year</div>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Sum Insured: ₹10 Lakhs
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        37 Critical Illnesses Covered
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Lump Sum Payout
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        No Claim Deduction
                      </li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3">Covered Critical Illnesses</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• Heart Attack</div>
                      <div>• Stroke</div>
                      <div>• Cancer</div>
                      <div>• Kidney Failure</div>
                      <div>• Liver Disease</div>
                      <div>• Paralysis</div>
                      <div>• Blindness</div>
                      <div>• Major Burns</div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">+ 29 more conditions covered</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-red-600 hover:bg-red-700">Choose Plan</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Key Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Why Choose Star Health Insurance?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Comprehensive Coverage</h3>
              <p className="text-gray-600 text-sm">
                Wide range of health insurance products covering all your medical needs
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Quick Claim Settlement</h3>
              <p className="text-gray-600 text-sm">
                95% claim settlement ratio with fast and hassle-free claim process
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Ayurvedic Treatment</h3>
              <p className="text-gray-600 text-sm">
                Coverage for AYUSH treatments including Ayurveda, Yoga, and Homeopathy
              </p>
            </div>
          </div>
        </div>

        {/* Network Hospitals */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Network Hospitals</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">8,500+</div>
              <div className="text-sm text-gray-600">Cashless Hospitals</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">650+</div>
              <div className="text-sm text-gray-600">Cities Covered</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Claim Support</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">30 Min</div>
              <div className="text-sm text-gray-600">Cashless Approval</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Top Hospitals in Delhi</h4>
              <ul className="text-sm space-y-1">
                <li>• Apollo Hospital</li>
                <li>• Max Healthcare</li>
                <li>• Fortis Hospital</li>
                <li>• BLK Super Speciality</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Top Hospitals in Mumbai</h4>
              <ul className="text-sm space-y-1">
                <li>• Kokilaben Hospital</li>
                <li>• Lilavati Hospital</li>
                <li>• Hinduja Hospital</li>
                <li>• Breach Candy Hospital</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Top Hospitals in Bangalore</h4>
              <ul className="text-sm space-y-1">
                <li>• Manipal Hospital</li>
                <li>• Narayana Health</li>
                <li>• Apollo Hospital</li>
                <li>• Fortis Hospital</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Protected?</h2>
          <p className="text-xl mb-6 opacity-90">Join millions of satisfied customers with Star Health Insurance</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Free Quote
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Talk to Expert
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
