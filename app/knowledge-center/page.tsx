import Link from "next/link"
import { ArrowLeft, ArrowRight, FileText, HelpCircle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function KnowledgeCenterPage() {
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
            <Link href="/insurance/health" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Health
            </Link>
            <Link href="/knowledge-center" className="text-sm font-medium text-primary">
              Knowledge Center
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
              <h1 className="text-3xl font-bold tracking-tight mb-2">Insurance Knowledge Center</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Learn about insurance concepts, coverage options, and how to make the best decisions for your insurance
                needs.
              </p>
            </div>

            <div className="relative mb-8">
              <Input
                className="pl-10 h-12"
                placeholder="Search for insurance topics, terms, or questions..."
                type="search"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Button className="absolute right-1 top-1 h-10">Search</Button>
            </div>

            <Tabs defaultValue="guides" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="guides" className="data-[state=active]:bg-teal-50">
                  Guides
                </TabsTrigger>
                <TabsTrigger value="faq" className="data-[state=active]:bg-teal-50">
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="glossary" className="data-[state=active]:bg-teal-50">
                  Glossary
                </TabsTrigger>
                <TabsTrigger value="calculators" className="data-[state=active]:bg-teal-50">
                  Calculators
                </TabsTrigger>
              </TabsList>

              <TabsContent value="guides">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <GuideCard
                    title="Understanding Auto Insurance"
                    description="Learn about the different types of auto insurance coverage and how to choose the right policy for your needs."
                    image="/auto-insurance-guide.png"
                    category="Auto"
                    readTime="8 min read"
                    href="/knowledge-center/guides/understanding-auto-insurance"
                  />
                  <GuideCard
                    title="Home Insurance 101"
                    description="Everything you need to know about protecting your home with the right insurance coverage."
                    image="/home-insurance-guide.png"
                    category="Home"
                    readTime="10 min read"
                    href="/knowledge-center/guides/home-insurance-101"
                  />
                  <GuideCard
                    title="Life Insurance Explained"
                    description="A comprehensive guide to understanding life insurance options and choosing the right coverage."
                    image="/life-insurance-guide.png"
                    category="Life"
                    readTime="12 min read"
                    href="/knowledge-center/guides/life-insurance-explained"
                  />
                  <GuideCard
                    title="Health Insurance Options"
                    description="Navigate the complex world of health insurance with this straightforward guide."
                    image="/health-insurance-guide.png"
                    category="Health"
                    readTime="15 min read"
                    href="/knowledge-center/guides/health-insurance-options"
                  />
                  <GuideCard
                    title="Saving Money on Insurance"
                    description="Practical tips and strategies to lower your insurance premiums without sacrificing coverage."
                    image="/saving-money-guide.png"
                    category="General"
                    readTime="7 min read"
                    href="/knowledge-center/guides/saving-money-on-insurance"
                  />
                  <GuideCard
                    title="Filing an Insurance Claim"
                    description="Step-by-step instructions for filing an insurance claim and maximizing your settlement."
                    image="/filing-claim-guide.png"
                    category="General"
                    readTime="9 min read"
                    href="/knowledge-center/guides/filing-an-insurance-claim"
                  />
                </div>
                <div className="flex justify-center mt-8">
                  <Button variant="outline">View All Guides</Button>
                </div>
              </TabsContent>

              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find answers to common insurance questions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-2">Auto Insurance</h3>
                        <div className="space-y-3">
                          <FaqItem
                            question="What factors affect my auto insurance premium?"
                            answer="Several factors can affect your auto insurance premium, including your driving record, age, location, type of vehicle, credit score, coverage limits, deductible amount, and annual mileage. Insurance companies use these factors to assess risk and determine your premium."
                          />
                          <FaqItem
                            question="Is liability insurance enough for my car?"
                            answer="While liability insurance meets the minimum legal requirements in most states, it only covers damages to others and their property. It doesn't cover damage to your own vehicle. If you have a newer or valuable car, you may want to consider adding comprehensive and collision coverage for better protection."
                          />
                          <FaqItem
                            question="How can I lower my auto insurance rates?"
                            answer="You can lower your auto insurance rates by maintaining a good driving record, bundling policies, increasing your deductible, taking advantage of discounts (good student, safe driver, etc.), improving your credit score, and shopping around for quotes from different insurers."
                          />
                        </div>
                      </div>

                      <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-2">Home Insurance</h3>
                        <div className="space-y-3">
                          <FaqItem
                            question="Does home insurance cover natural disasters?"
                            answer="Standard home insurance typically covers some natural disasters like windstorms and hail, but often excludes floods and earthquakes. For these specific disasters, you'll need separate policies or endorsements. Always check your policy details to understand what's covered and what's not."
                          />
                          <FaqItem
                            question="How much home insurance coverage do I need?"
                            answer="You should have enough coverage to rebuild your home (dwelling coverage), replace your belongings (personal property coverage), cover living expenses if your home is uninhabitable (loss of use coverage), and protect your assets from liability claims. An insurance agent can help you determine the right coverage amounts."
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Life Insurance</h3>
                        <div className="space-y-3">
                          <FaqItem
                            question="What's the difference between term and whole life insurance?"
                            answer="Term life insurance provides coverage for a specific period (e.g., 10, 20, or 30 years) and pays a death benefit if you die during that term. Whole life insurance provides lifetime coverage and includes a cash value component that grows over time. Term is typically more affordable, while whole life offers additional investment features."
                          />
                          <FaqItem
                            question="How much life insurance do I need?"
                            answer="A common rule of thumb is to have coverage that's 10-15 times your annual income. However, your specific needs depend on factors like your debts, mortgage, future education expenses for children, and other financial obligations. Consider what your dependents would need if your income were no longer available."
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All FAQs
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="glossary">
                <Card>
                  <CardHeader>
                    <CardTitle>Insurance Glossary</CardTitle>
                    <CardDescription>Key insurance terms and definitions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end mb-4">
                      <div className="relative w-64">
                        <Input className="pl-10" placeholder="Search terms..." type="search" />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">A</h3>
                        <div className="space-y-3">
                          <div className="border-b pb-2">
                            <h4 className="font-medium">Actual Cash Value (ACV)</h4>
                            <p className="text-sm text-muted-foreground">
                              The value of property based on its current cost minus depreciation due to age, wear and
                              tear, or obsolescence.
                            </p>
                          </div>
                          <div className="border-b pb-2">
                            <h4 className="font-medium">Adjuster</h4>
                            <p className="text-sm text-muted-foreground">
                              A person who investigates and settles insurance claims on behalf of the insurance company.
                            </p>
                          </div>
                          <div className="border-b pb-2">
                            <h4 className="font-medium">Annuity</h4>
                            <p className="text-sm text-muted-foreground">
                              A financial product sold by insurance companies that provides a stream of payments to the
                              purchaser at specified intervals.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">D</h3>
                        <div className="space-y-3">
                          <div className="border-b pb-2">
                            <h4 className="font-medium">Deductible</h4>
                            <p className="text-sm text-muted-foreground">
                              The amount you pay out of pocket before your insurance coverage kicks in.
                            </p>
                          </div>
                          <div className="border-b pb-2">
                            <h4 className="font-medium">Declarations Page</h4>
                            <p className="text-sm text-muted-foreground">
                              The page in an insurance policy that shows the name and address of the insured, the policy
                              period, coverage limits, premiums, and other key information.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">P</h3>
                        <div className="space-y-3">
                          <div className="border-b pb-2">
                            <h4 className="font-medium">Premium</h4>
                            <p className="text-sm text-muted-foreground">
                              The amount paid to an insurance company for coverage under an insurance policy.
                            </p>
                          </div>
                          <div className="border-b pb-2">
                            <h4 className="font-medium">Policy</h4>
                            <p className="text-sm text-muted-foreground">
                              A written contract between an insured and an insurance company stating the obligations and
                              responsibilities of each party.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Full Glossary
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="calculators">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Coverage Calculator</CardTitle>
                      <CardDescription>Estimate how much insurance coverage you need</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center p-6">
                        <div className="text-center">
                          <FileText className="h-16 w-16 text-teal-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Coverage Calculator</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Answer a few questions to get a personalized recommendation for your insurance coverage
                            needs.
                          </p>
                          <Button>Start Calculator</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Premium Estimator</CardTitle>
                      <CardDescription>Get an estimate of your insurance premiums</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center p-6">
                        <div className="text-center">
                          <FileText className="h-16 w-16 text-teal-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Premium Estimator</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Calculate approximately how much you might pay for different types of insurance coverage.
                          </p>
                          <Button>Start Estimator</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Life Insurance Calculator</CardTitle>
                      <CardDescription>Determine your life insurance needs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center p-6">
                        <div className="text-center">
                          <FileText className="h-16 w-16 text-teal-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Life Insurance Calculator</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Calculate how much life insurance coverage you need to protect your loved ones.
                          </p>
                          <Button>Start Calculator</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Retirement Calculator</CardTitle>
                      <CardDescription>Plan for your financial future</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center p-6">
                        <div className="text-center">
                          <FileText className="h-16 w-16 text-teal-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Retirement Calculator</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Estimate how much you need to save for retirement and how insurance can help protect your
                            assets.
                          </p>
                          <Button>Start Calculator</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
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

function GuideCard({ title, description, image, category, readTime, href }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={image || "/placeholder.svg?height=200&width=400&query=insurance guide"}
          alt={title}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium px-2 py-1 bg-teal-100 text-teal-800 rounded-full">{category}</span>
          <span className="text-xs text-muted-foreground">{readTime}</span>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button variant="outline" className="w-full">
            Read Guide
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function FaqItem({ question, answer }) {
  return (
    <div className="space-y-1">
      <h4 className="font-medium flex items-center">
        <HelpCircle className="h-4 w-4 mr-2 text-teal-500" />
        {question}
      </h4>
      <p className="text-sm text-muted-foreground pl-6">{answer}</p>
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
