import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Shield, Leaf, ArrowRight, CheckCircle, Users, Heart, Building } from "lucide-react"

export default function HealthInsurancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-400 opacity-90"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between py-16 px-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Badge className="mb-4 bg-white text-teal-700">
              <Leaf className="h-3 w-3 mr-1" /> Sustainable Healthcare
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Health Insurance That Cares</h1>
            <p className="text-white/90 text-lg mb-8 max-w-md">
              Comprehensive health coverage that prioritizes your wellbeing and the planet's health.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-teal-700 hover:bg-teal-50">
                <Link href="/quote?type=health">Get a Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="/compare?category=health">Compare Plans</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/diverse-woman-portrait.png"
              alt="Healthy woman with health insurance"
              width={500}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Plan Types */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Health Plans for Every Need</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from a variety of health insurance plans designed to fit your lifestyle and budget.
          </p>
        </div>

        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>
          <TabsContent value="individual" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-teal-500" />
                    <CardTitle>Individual Health Plans</CardTitle>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    <Leaf className="h-3 w-3 mr-1" /> Eco-Friendly
                  </Badge>
                </div>
                <CardDescription>
                  Comprehensive health coverage tailored to your personal needs and health goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Essential Care
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Basic coverage with affordable premiums</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Standard Care
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Balanced coverage with moderate premiums</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Premium Care
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Comprehensive coverage with extensive benefits
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Leaf className="h-4 w-4 text-green-600 mr-2" /> Eco-Friendly Benefits
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Digital health records and telemedicine options reduce carbon footprint. We donate 1% of premiums to
                    healthcare sustainability initiatives.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-2xl font-bold text-teal-600">
                  From $199<span className="text-sm font-normal text-gray-500">/month</span>
                </div>
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/quote?type=health&plan=individual">
                    Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="family" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-teal-500" />
                    <CardTitle>Family Health Plans</CardTitle>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    <Leaf className="h-3 w-3 mr-1" /> Eco-Friendly
                  </Badge>
                </div>
                <CardDescription>
                  Comprehensive coverage for your entire family with special benefits for children and dependents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Family Essential
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Basic coverage for the whole family</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Family Plus
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Enhanced coverage with pediatric benefits
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Family Premium
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Comprehensive coverage with maternity benefits
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Leaf className="h-4 w-4 text-green-600 mr-2" /> Eco-Friendly Benefits
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Family wellness programs promote sustainable living. Digital health management reduces paper waste
                    and carbon emissions.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-2xl font-bold text-teal-600">
                  From $399<span className="text-sm font-normal text-gray-500">/month</span>
                </div>
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/quote?type=health&plan=family">
                    Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="business" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="h-6 w-6 text-teal-500" />
                    <CardTitle>Business Health Plans</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Group health insurance solutions for businesses of all sizes, with flexible options to meet your
                  team's needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Small Business
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">For businesses with 2-50 employees</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Mid-Size Business
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">For businesses with 51-100 employees</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Enterprise
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Custom solutions for 100+ employees</p>
                  </div>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Leaf className="h-4 w-4 text-green-600 mr-2" /> Corporate Wellness Program
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Comprehensive wellness initiatives that promote employee health and sustainable workplace practices,
                    reducing healthcare costs and environmental impact.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-2xl font-bold text-teal-600">
                  Custom<span className="text-sm font-normal text-gray-500"> pricing</span>
                </div>
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/quote?type=health&plan=business">
                    Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Coverage Details */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What's Covered</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our health insurance plans provide comprehensive coverage for a wide range of healthcare services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Preventive Care",
              icon: <Shield className="h-6 w-6 text-teal-500" />,
              items: ["Annual check-ups", "Immunizations", "Screenings", "Wellness visits"],
            },
            {
              title: "Medical Services",
              icon: <Heart className="h-6 w-6 text-teal-500" />,
              items: ["Doctor visits", "Specialist consultations", "Diagnostic tests", "Emergency care"],
            },
            {
              title: "Hospital Care",
              icon: <Building className="h-6 w-6 text-teal-500" />,
              items: ["Inpatient services", "Surgeries", "Hospital stays", "Intensive care"],
            },
            {
              title: "Prescription Drugs",
              icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
              items: ["Generic medications", "Brand-name drugs", "Specialty medications", "Mail-order pharmacy"],
            },
            {
              title: "Mental Health",
              icon: <Users className="h-6 w-6 text-teal-500" />,
              items: ["Therapy sessions", "Psychiatric services", "Substance abuse treatment", "Counseling"],
            },
            {
              title: "Alternative Therapies",
              icon: <Leaf className="h-6 w-6 text-teal-500" />,
              items: ["Acupuncture", "Chiropractic care", "Massage therapy", "Naturopathic medicine"],
            },
          ].map((category, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {category.icon}
                  <CardTitle>{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about our health insurance plans.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {[
            {
              question: "What is the difference between copays and deductibles?",
              answer:
                "A copay is a fixed amount you pay for a covered service (like $25 for a doctor visit). A deductible is the amount you pay for covered services before your insurance begins to pay. For example, with a $1,000 deductible, you pay the first $1,000 of covered services yourself before insurance kicks in.",
            },
            {
              question: "Are pre-existing conditions covered?",
              answer:
                "Yes, under current regulations, all our health insurance plans cover pre-existing conditions. You cannot be denied coverage or charged more based on your health history or pre-existing conditions.",
            },
            {
              question: "How do I find out if my doctor is in-network?",
              answer:
                "You can check if your doctor is in-network by using our provider search tool on our website or mobile app. You can search by doctor name, specialty, or location to find in-network providers near you. You can also call the customer service number on your insurance card for assistance.",
            },
            {
              question: "What preventive services are covered at 100%?",
              answer:
                "Many preventive services are covered at 100% with no cost-sharing (no copay or deductible). These include annual check-ups, many immunizations, cancer screenings, and other preventive services recommended by the U.S. Preventive Services Task Force",
            },
          ].map((faq, index) => (
            <AccordionItem key={index} value={`question-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}
