"use client"

import { useState } from "react"
import { Check, X, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Define policy types
type PolicyFeature = {
  name: string
  description: string
  star: boolean
  general: boolean
  national: boolean
  hdfc: boolean
}

type PolicyPlan = {
  id: string
  name: string
  company: string
  logo: string
  premium: number
  sumInsured: number
  cashless: number
  claimSettlement: number
  rating: number
  features: PolicyFeature[]
}

// Sample policy data
const healthPolicies: PolicyPlan[] = [
  {
    id: "star-health-comprehensive",
    name: "Comprehensive Health Insurance",
    company: "Star Health",
    logo: "/star-health-logo.png",
    premium: 12500,
    sumInsured: 500000,
    cashless: 8500,
    claimSettlement: 95,
    rating: 4.5,
    features: [
      {
        name: "Pre-existing diseases",
        description: "Covered after 3 years",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Day care procedures",
        description: "All covered",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      { name: "Room rent limit", description: "No capping", star: true, general: false, national: false, hdfc: true },
      {
        name: "Maternity cover",
        description: "After 3 years waiting period",
        star: true,
        general: false,
        national: false,
        hdfc: false,
      },
      {
        name: "Ayurvedic treatment",
        description: "Covered up to sum insured",
        star: true,
        general: false,
        national: true,
        hdfc: false,
      },
      {
        name: "No claim bonus",
        description: "10% increase per year",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      {
        name: "Restoration benefit",
        description: "100% restoration once per year",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Pre & post hospitalization",
        description: "60 days pre and 90 days post",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
    ],
  },
  {
    id: "general-insurance-family-floater",
    name: "Family Floater Health Plan",
    company: "General Insurance",
    logo: "/general-insurance-logo.png",
    premium: 15000,
    sumInsured: 1000000,
    cashless: 7800,
    claimSettlement: 92,
    rating: 4.2,
    features: [
      {
        name: "Pre-existing diseases",
        description: "Covered after 3 years",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Day care procedures",
        description: "All covered",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      { name: "Room rent limit", description: "No capping", star: true, general: false, national: false, hdfc: true },
      {
        name: "Maternity cover",
        description: "After 3 years waiting period",
        star: true,
        general: false,
        national: false,
        hdfc: false,
      },
      {
        name: "Ayurvedic treatment",
        description: "Covered up to sum insured",
        star: true,
        general: false,
        national: true,
        hdfc: false,
      },
      {
        name: "No claim bonus",
        description: "10% increase per year",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      {
        name: "Restoration benefit",
        description: "100% restoration once per year",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Pre & post hospitalization",
        description: "60 days pre and 90 days post",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
    ],
  },
  {
    id: "national-insurance-premium",
    name: "Premium Health Insurance",
    company: "National Insurance",
    logo: "/national-insurance-logo.png",
    premium: 18000,
    sumInsured: 1500000,
    cashless: 9200,
    claimSettlement: 97,
    rating: 4.7,
    features: [
      {
        name: "Pre-existing diseases",
        description: "Covered after 3 years",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Day care procedures",
        description: "All covered",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      { name: "Room rent limit", description: "No capping", star: true, general: false, national: false, hdfc: true },
      {
        name: "Maternity cover",
        description: "After 3 years waiting period",
        star: true,
        general: false,
        national: false,
        hdfc: false,
      },
      {
        name: "Ayurvedic treatment",
        description: "Covered up to sum insured",
        star: true,
        general: false,
        national: true,
        hdfc: false,
      },
      {
        name: "No claim bonus",
        description: "10% increase per year",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      {
        name: "Restoration benefit",
        description: "100% restoration once per year",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Pre & post hospitalization",
        description: "60 days pre and 90 days post",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
    ],
  },
  {
    id: "hdfc-ergo-optima",
    name: "Optima Secure",
    company: "HDFC ERGO",
    logo: "/hdfc-ergo-logo.png",
    premium: 14500,
    sumInsured: 1000000,
    cashless: 10000,
    claimSettlement: 98,
    rating: 4.8,
    features: [
      {
        name: "Pre-existing diseases",
        description: "Covered after 3 years",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Day care procedures",
        description: "All covered",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      { name: "Room rent limit", description: "No capping", star: true, general: false, national: false, hdfc: true },
      {
        name: "Maternity cover",
        description: "After 3 years waiting period",
        star: true,
        general: false,
        national: false,
        hdfc: false,
      },
      {
        name: "Ayurvedic treatment",
        description: "Covered up to sum insured",
        star: true,
        general: false,
        national: true,
        hdfc: false,
      },
      {
        name: "No claim bonus",
        description: "10% increase per year",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      {
        name: "Restoration benefit",
        description: "100% restoration once per year",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Pre & post hospitalization",
        description: "60 days pre and 90 days post",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
    ],
  },
]

const autoPolicies: PolicyPlan[] = [
  {
    id: "star-auto-comprehensive",
    name: "Comprehensive Auto Insurance",
    company: "Star Insurance",
    logo: "/star-health-logo.png",
    premium: 8500,
    sumInsured: 800000,
    cashless: 5000,
    claimSettlement: 94,
    rating: 4.4,
    features: [
      { name: "Own damage cover", description: "Covered", star: true, general: true, national: true, hdfc: true },
      {
        name: "Third party liability",
        description: "Unlimited for death",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      {
        name: "Zero depreciation",
        description: "Available as add-on",
        star: true,
        general: true,
        national: false,
        hdfc: true,
      },
      {
        name: "Roadside assistance",
        description: "24x7 assistance",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Engine protection",
        description: "Covered as add-on",
        star: true,
        general: false,
        national: false,
        hdfc: true,
      },
      { name: "NCB protection", description: "Available", star: true, general: false, national: true, hdfc: true },
      {
        name: "Return to invoice",
        description: "Available as add-on",
        star: true,
        general: false,
        national: false,
        hdfc: true,
      },
      {
        name: "Personal accident cover",
        description: "₹15 lakhs",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
    ],
  },
  {
    id: "general-auto-premium",
    name: "Premium Auto Insurance",
    company: "General Insurance",
    logo: "/general-insurance-logo.png",
    premium: 7800,
    sumInsured: 600000,
    cashless: 4500,
    claimSettlement: 91,
    rating: 4.1,
    features: [
      { name: "Own damage cover", description: "Covered", star: true, general: true, national: true, hdfc: true },
      {
        name: "Third party liability",
        description: "Unlimited for death",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      {
        name: "Zero depreciation",
        description: "Available as add-on",
        star: true,
        general: true,
        national: false,
        hdfc: true,
      },
      {
        name: "Roadside assistance",
        description: "24x7 assistance",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Engine protection",
        description: "Covered as add-on",
        star: true,
        general: false,
        national: false,
        hdfc: true,
      },
      { name: "NCB protection", description: "Available", star: true, general: false, national: true, hdfc: true },
      {
        name: "Return to invoice",
        description: "Available as add-on",
        star: true,
        general: false,
        national: false,
        hdfc: true,
      },
      {
        name: "Personal accident cover",
        description: "₹15 lakhs",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
    ],
  },
]

const lifePolicies: PolicyPlan[] = [
  {
    id: "star-life-term",
    name: "Term Life Insurance",
    company: "Star Life",
    logo: "/star-health-logo.png",
    premium: 15000,
    sumInsured: 10000000,
    cashless: 0,
    claimSettlement: 98,
    rating: 4.7,
    features: [
      { name: "Death benefit", description: "Sum assured paid", star: true, general: true, national: true, hdfc: true },
      {
        name: "Accidental death benefit",
        description: "Additional sum assured",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Critical illness cover",
        description: "Available as rider",
        star: true,
        general: true,
        national: false,
        hdfc: true,
      },
      {
        name: "Terminal illness benefit",
        description: "Advance payment",
        star: true,
        general: false,
        national: true,
        hdfc: false,
      },
      { name: "Premium waiver", description: "On disability", star: true, general: false, national: false, hdfc: true },
      {
        name: "Tax benefits",
        description: "Under Section 80C & 10(10D)",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      {
        name: "Loan facility",
        description: "Not available",
        star: false,
        general: false,
        national: false,
        hdfc: false,
      },
      {
        name: "Surrender value",
        description: "Not applicable",
        star: false,
        general: false,
        national: false,
        hdfc: false,
      },
    ],
  },
  {
    id: "general-life-endowment",
    name: "Endowment Plan",
    company: "General Life",
    logo: "/general-insurance-logo.png",
    premium: 45000,
    sumInsured: 5000000,
    cashless: 0,
    claimSettlement: 95,
    rating: 4.3,
    features: [
      { name: "Death benefit", description: "Sum assured paid", star: true, general: true, national: true, hdfc: true },
      {
        name: "Accidental death benefit",
        description: "Additional sum assured",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Critical illness cover",
        description: "Available as rider",
        star: true,
        general: true,
        national: false,
        hdfc: true,
      },
      {
        name: "Terminal illness benefit",
        description: "Advance payment",
        star: true,
        general: false,
        national: true,
        hdfc: false,
      },
      { name: "Premium waiver", description: "On disability", star: true, general: false, national: false, hdfc: true },
      {
        name: "Tax benefits",
        description: "Under Section 80C & 10(10D)",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      {
        name: "Loan facility",
        description: "Not available",
        star: false,
        general: false,
        national: false,
        hdfc: false,
      },
      {
        name: "Surrender value",
        description: "Not applicable",
        star: false,
        general: false,
        national: false,
        hdfc: false,
      },
    ],
  },
]

const homePolicies: PolicyPlan[] = [
  {
    id: "star-home-comprehensive",
    name: "Comprehensive Home Insurance",
    company: "Star Insurance",
    logo: "/star-health-logo.png",
    premium: 5500,
    sumInsured: 5000000,
    cashless: 0,
    claimSettlement: 92,
    rating: 4.4,
    features: [
      {
        name: "Structure coverage",
        description: "Full coverage",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      {
        name: "Contents coverage",
        description: "Up to sum insured",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      { name: "Burglary & theft", description: "Covered", star: true, general: true, national: false, hdfc: true },
      { name: "Natural disasters", description: "All covered", star: true, general: true, national: true, hdfc: true },
      { name: "Electrical damage", description: "Covered", star: true, general: false, national: false, hdfc: true },
      {
        name: "Temporary accommodation",
        description: "Covered up to 3 months",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Liability protection",
        description: "Up to ₹10 lakhs",
        star: true,
        general: false,
        national: false,
        hdfc: true,
      },
      {
        name: "Valuable items",
        description: "Covered with declaration",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
    ],
  },
  {
    id: "hdfc-home-shield",
    name: "Home Shield",
    company: "HDFC ERGO",
    logo: "/hdfc-ergo-logo.png",
    premium: 6200,
    sumInsured: 7500000,
    cashless: 0,
    claimSettlement: 96,
    rating: 4.6,
    features: [
      {
        name: "Structure coverage",
        description: "Full coverage",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      {
        name: "Contents coverage",
        description: "Up to sum insured",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
      { name: "Burglary & theft", description: "Covered", star: true, general: true, national: false, hdfc: true },
      { name: "Natural disasters", description: "All covered", star: true, general: true, national: true, hdfc: true },
      { name: "Electrical damage", description: "Covered", star: true, general: false, national: false, hdfc: true },
      {
        name: "Temporary accommodation",
        description: "Covered up to 3 months",
        star: true,
        general: false,
        national: true,
        hdfc: true,
      },
      {
        name: "Liability protection",
        description: "Up to ₹10 lakhs",
        star: true,
        general: false,
        national: false,
        hdfc: true,
      },
      {
        name: "Valuable items",
        description: "Covered with declaration",
        star: true,
        general: true,
        national: true,
        hdfc: true,
      },
    ],
  },
]

export function PolicyComparison() {
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([
    "star-health-comprehensive",
    "general-insurance-family-floater",
    "hdfc-ergo-optima",
  ])
  const [showAllFeatures, setShowAllFeatures] = useState(false)

  const togglePolicy = (policyId: string) => {
    if (selectedPolicies.includes(policyId)) {
      setSelectedPolicies(selectedPolicies.filter((id) => id !== policyId))
    } else {
      if (selectedPolicies.length < 4) {
        setSelectedPolicies([...selectedPolicies, policyId])
      }
    }
  }

  const isPolicySelected = (policyId: string) => {
    return selectedPolicies.includes(policyId)
  }

  const getSelectedPolicies = (policies: PolicyPlan[]) => {
    return policies.filter((policy) => selectedPolicies.includes(policy.id))
  }

  const renderFeatureValue = (value: boolean) => {
    return value ? (
      <div className="flex justify-center">
        <Check className="h-5 w-5 text-green-500" />
      </div>
    ) : (
      <div className="flex justify-center">
        <X className="h-5 w-5 text-red-500" />
      </div>
    )
  }

  const visibleFeatures = (features: PolicyFeature[]) => {
    return showAllFeatures ? features : features.slice(0, 5)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Compare Insurance Policies</h2>
        <p className="text-muted-foreground">
          Compare different insurance policies side by side to find the best coverage for your needs.
        </p>
      </div>

      <Tabs defaultValue="health" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="auto">Auto</TabsTrigger>
          <TabsTrigger value="life">Life</TabsTrigger>
          <TabsTrigger value="home">Home</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthPolicies.map((policy) => (
              <Card
                key={policy.id}
                className={cn(
                  "cursor-pointer transition-all",
                  isPolicySelected(policy.id) ? "border-2 border-primary shadow-md" : "opacity-70 hover:opacity-100",
                )}
                onClick={() => togglePolicy(policy.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{policy.name}</CardTitle>
                      <CardDescription>{policy.company}</CardDescription>
                    </div>
                    {isPolicySelected(policy.id) && <Badge className="bg-primary">Selected</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Premium:</span>
                      <span className="font-medium">₹{policy.premium.toLocaleString()}/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sum Insured:</span>
                      <span className="font-medium">₹{policy.sumInsured.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Claim Settlement:</span>
                      <span className="font-medium">{policy.claimSettlement}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={isPolicySelected(policy.id) ? "destructive" : "outline"}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePolicy(policy.id)
                    }}
                  >
                    {isPolicySelected(policy.id) ? "Remove" : "Compare"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {getSelectedPolicies(healthPolicies).length > 0 ? (
            <div className="mt-8 border rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-4 text-left font-medium">Features</th>
                    {getSelectedPolicies(healthPolicies).map((policy) => (
                      <th key={policy.id} className="p-4 text-center font-medium">
                        {policy.company}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border-t">Premium</td>
                    {getSelectedPolicies(healthPolicies).map((policy) => (
                      <td key={policy.id} className="p-4 border-t text-center">
                        ₹{policy.premium.toLocaleString()}/year
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 border-t">Sum Insured</td>
                    {getSelectedPolicies(healthPolicies).map((policy) => (
                      <td key={policy.id} className="p-4 border-t text-center">
                        ₹{policy.sumInsured.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 border-t">Cashless Hospitals</td>
                    {getSelectedPolicies(healthPolicies).map((policy) => (
                      <td key={policy.id} className="p-4 border-t text-center">
                        {policy.cashless.toLocaleString()}+
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 border-t">Claim Settlement Ratio</td>
                    {getSelectedPolicies(healthPolicies).map((policy) => (
                      <td key={policy.id} className="p-4 border-t text-center">
                        {policy.claimSettlement}%
                      </td>
                    ))}
                  </tr>

                  {healthPolicies[0].features &&
                    visibleFeatures(healthPolicies[0].features).map((feature, index) => (
                      <tr key={index}>
                        <td className="p-4 border-t flex items-center">
                          {feature.name}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground ml-2" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{feature.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        {getSelectedPolicies(healthPolicies).map((policy) => {
                          const policyFeature = policy.features.find((f) => f.name === feature.name)
                          const value = policyFeature
                            ? policy.company === "Star Health"
                              ? policyFeature.star
                              : policy.company === "General Insurance"
                                ? policyFeature.general
                                : policy.company === "National Insurance"
                                  ? policyFeature.national
                                  : policyFeature.hdfc
                            : false

                          return (
                            <td key={policy.id} className="p-4 border-t">
                              {renderFeatureValue(value)}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>

              {healthPolicies[0].features && healthPolicies[0].features.length > 5 && (
                <div className="p-4 text-center border-t">
                  <Button variant="ghost" onClick={() => setShowAllFeatures(!showAllFeatures)} className="text-primary">
                    {showAllFeatures ? (
                      <span className="flex items-center">
                        Show Less <ChevronUp className="ml-2 h-4 w-4" />
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Show All Features <ChevronDown className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-medium">No Policies Selected</h3>
              <p className="text-muted-foreground mt-2">Select at least one policy to compare</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="auto" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {autoPolicies.map((policy) => (
              <Card
                key={policy.id}
                className={cn(
                  "cursor-pointer transition-all",
                  isPolicySelected(policy.id) ? "border-2 border-primary shadow-md" : "opacity-70 hover:opacity-100",
                )}
                onClick={() => togglePolicy(policy.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{policy.name}</CardTitle>
                      <CardDescription>{policy.company}</CardDescription>
                    </div>
                    {isPolicySelected(policy.id) && <Badge className="bg-primary">Selected</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Premium:</span>
                      <span className="font-medium">₹{policy.premium.toLocaleString()}/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IDV:</span>
                      <span className="font-medium">₹{policy.sumInsured.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Claim Settlement:</span>
                      <span className="font-medium">{policy.claimSettlement}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={isPolicySelected(policy.id) ? "destructive" : "outline"}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePolicy(policy.id)
                    }}
                  >
                    {isPolicySelected(policy.id) ? "Remove" : "Compare"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Similar comparison table for auto insurance */}
        </TabsContent>

        <TabsContent value="life" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifePolicies.map((policy) => (
              <Card
                key={policy.id}
                className={cn(
                  "cursor-pointer transition-all",
                  isPolicySelected(policy.id) ? "border-2 border-primary shadow-md" : "opacity-70 hover:opacity-100",
                )}
                onClick={() => togglePolicy(policy.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{policy.name}</CardTitle>
                      <CardDescription>{policy.company}</CardDescription>
                    </div>
                    {isPolicySelected(policy.id) && <Badge className="bg-primary">Selected</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Premium:</span>
                      <span className="font-medium">₹{policy.premium.toLocaleString()}/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sum Assured:</span>
                      <span className="font-medium">₹{policy.sumInsured.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Claim Settlement:</span>
                      <span className="font-medium">{policy.claimSettlement}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={isPolicySelected(policy.id) ? "destructive" : "outline"}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePolicy(policy.id)
                    }}
                  >
                    {isPolicySelected(policy.id) ? "Remove" : "Compare"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Similar comparison table for life insurance */}
        </TabsContent>

        <TabsContent value="home" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {homePolicies.map((policy) => (
              <Card
                key={policy.id}
                className={cn(
                  "cursor-pointer transition-all",
                  isPolicySelected(policy.id) ? "border-2 border-primary shadow-md" : "opacity-70 hover:opacity-100",
                )}
                onClick={() => togglePolicy(policy.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{policy.name}</CardTitle>
                      <CardDescription>{policy.company}</CardDescription>
                    </div>
                    {isPolicySelected(policy.id) && <Badge className="bg-primary">Selected</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Premium:</span>
                      <span className="font-medium">₹{policy.premium.toLocaleString()}/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sum Insured:</span>
                      <span className="font-medium">₹{policy.sumInsured.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Claim Settlement:</span>
                      <span className="font-medium">{policy.claimSettlement}%</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={isPolicySelected(policy.id) ? "destructive" : "outline"}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePolicy(policy.id)
                    }}
                  >
                    {isPolicySelected(policy.id) ? "Remove" : "Compare"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Similar comparison table for home insurance */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
