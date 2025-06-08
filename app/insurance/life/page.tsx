import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordian"
import { Badge } from "@/components/ui/badge"
import { Heart, Leaf, Shield, ArrowRight, CheckCircle, Users, Clock, Coins } from "lucide-react"

export default function LifeInsurancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-teal-400 opacity-90"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between py-16 px-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Badge className="mb-4 bg-white text-teal-700">
              <Leaf className="h-3 w-3 mr-1" /> Eco-Friendly Policies
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Life Insurance That Protects Your Legacy</h1>
            <p className="text-white/90 text-lg mb-8 max-w-md">
              Secure your family's future with our comprehensive life insurance plans that offer financial protection
              and peace of mind.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-teal-700 hover:bg-teal-50">
                <Link href="/quote?type=life">Get a Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link href="/compare?category=life">Compare Plans</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/diverse-group.png"
              alt="Family protected by life insurance"
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
          <h2 className="text-3xl font-bold mb-4">Find the Right Coverage for You</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We offer a variety of life insurance plans to meet your specific needs and budget.
          </p>
        </div>

        <Tabs defaultValue="term" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="term">Term Life</TabsTrigger>
            <TabsTrigger value="whole">Whole Life</TabsTrigger>
            <TabsTrigger value="universal">Universal Life</TabsTrigger>
          </TabsList>
          <TabsContent value="term" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-teal-500" />
                    <CardTitle>Term Life Insurance</CardTitle>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    <Leaf className="h-3 w-3 mr-1" /> Eco-Friendly
                  </Badge>
                </div>
                <CardDescription>
                  Affordable protection for a specific period of time, ideal for young families and those with temporary
                  needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Coverage Periods
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">10, 15, 20, or 30 year terms available</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Premium Structure
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Fixed premiums that never increase during the term
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Conversion Option
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Convert to permanent coverage without a medical exam
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Leaf className="h-4 w-4 text-green-600 mr-2" /> Eco-Friendly Benefits
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    For every policy purchased, we plant 5 trees through our reforestation partners. All documentation
                    is 100% digital, saving paper and reducing carbon footprint.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-2xl font-bold text-teal-600">
                  From $15<span className="text-sm font-normal text-gray-500">/month</span>
                </div>
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/quote?type=term">
                    Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="whole" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-teal-500" />
                    <CardTitle>Whole Life Insurance</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Permanent coverage with a cash value component that builds over time, providing lifelong protection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Lifetime Coverage
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Protection that lasts your entire life</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Cash Value Growth
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Builds tax-deferred cash value over time</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Dividend Potential
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Eligible for dividend payments when declared
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-2xl font-bold text-teal-600">
                  From $45<span className="text-sm font-normal text-gray-500">/month</span>
                </div>
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/quote?type=whole">
                    Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="universal" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Coins className="h-6 w-6 text-teal-500" />
                    <CardTitle>Universal Life Insurance</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Flexible permanent coverage with adjustable premiums and death benefits to adapt to your changing
                  needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Flexible Premiums
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Adjust premium payments as your needs change
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Adjustable Benefits
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Increase or decrease coverage as needed</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-2" /> Cash Value Growth
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Potential for higher returns based on market performance
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-2xl font-bold text-teal-600">
                  From $50<span className="text-sm font-normal text-gray-500">/month</span>
                </div>
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/quote?type=universal">
                    Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Benefits Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Life Insurance</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We offer more than just financial protection. Our policies come with unique benefits and features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-full">
                <Heart className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Health & Wellness Program</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Access to exclusive health and wellness resources, including fitness programs, nutrition guidance, and
                  mental health support.
                </p>
                <ul className="space-y-2">
                  {["Annual health check-up discounts", "Mental wellness resources", "Fitness app subscriptions"].map(
                    (item, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-2" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-full">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Family Support Services</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Comprehensive support for your beneficiaries, including financial counseling and estate planning
                  assistance.
                </p>
                <ul className="space-y-2">
                  {["Grief counseling services", "Financial planning assistance", "Legal document preparation"].map(
                    (item, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-2" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-full">
                <Leaf className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Sustainable Investment Options</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your premiums can be invested in environmentally and socially responsible funds that align with your
                  values.
                </p>
                <ul className="space-y-2">
                  {["ESG investment portfolios", "Renewable energy projects", "Community development initiatives"].map(
                    (item, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-2" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-full">
                <Shield className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Enhanced Protection Riders</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Customize your policy with additional riders for comprehensive coverage tailored to your specific
                  needs.
                </p>
                <ul className="space-y-2">
                  {["Critical illness coverage", "Disability income protection", "Accelerated death benefit"].map(
                    (item, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-2" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about our life insurance policies.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {[
            {
              question: "How much life insurance coverage do I need?",
              answer:
                "The amount of coverage you need depends on several factors, including your income, debts, family size, and future financial goals. A common rule of thumb is to have coverage that's 10-15 times your annual income, but our advisors can help you determine the right amount for your specific situation.",
            },
            {
              question: "Can I change my coverage amount after purchasing a policy?",
              answer:
                "Yes, with universal life insurance, you can adjust your coverage amount as your needs change. Term life policies typically require a new application to increase coverage, but you may have options to convert to a permanent policy or add riders for additional protection.",
            },
            {
              question: "What happens if I miss a premium payment?",
              answer:
                "Most policies include a grace period (typically 30 days) during which you can make a payment without losing coverage. If you miss a payment beyond the grace period, permanent policies may use accumulated cash value to cover premiums, while term policies may lapse and require reinstatement.",
            },
            {
              question: "Are there any exclusions to life insurance coverage?",
              answer:
                "Common exclusions include death by suicide within the first two years of the policy (contestability period), death resulting from illegal activities, and misrepresentation on your application. Each policy has specific terms, which we'll clearly explain before you purchase.",
            },
            {
              question: "How do the eco-friendly aspects of your policies work?",
              answer:
                "Our eco-friendly policies are 100% digital, eliminating paper waste. We invest a portion of premiums in sustainable projects and plant trees for each new policy. Additionally, we offer discounts for customers who make environmentally responsible choices in their daily lives.",
            },
          ].map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-400 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Secure Your Family's Future?</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8">
          Get a personalized quote today and take the first step toward financial security and peace of mind.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-teal-700 hover:bg-teal-50">
            <Link href="/quote?type=life">Get a Quote</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
            <Link href="/find-agent">Speak to an Advisor</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
