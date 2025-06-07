"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Calculator, Info } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  insuranceType: z.enum(["health", "auto", "life", "home"]),
  age: z.number().min(18).max(99),
  gender: z.enum(["male", "female", "other"]),
  smoker: z.boolean().default(false),
  sumInsured: z.number().min(100000),
  coverageTerm: z.number().min(1),
  dateOfBirth: z.date(),
  pincode: z.string().length(6, { message: "Pincode must be 6 digits" }),
  // Auto insurance specific
  vehicleType: z.enum(["car", "bike", "commercial"]).optional(),
  vehicleAge: z.number().min(0).max(25).optional(),
  vehicleValue: z.number().min(10000).optional(),
  // Home insurance specific
  propertyType: z.enum(["apartment", "independent", "villa"]).optional(),
  propertyAge: z.number().min(0).max(100).optional(),
  propertyValue: z.number().min(100000).optional(),
  // Life insurance specific
  occupation: z.enum(["salaried", "self-employed", "business", "student", "other"]).optional(),
  annualIncome: z.number().min(0).optional(),
})

export function PremiumCalculator() {
  const [premium, setPremium] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [breakdown, setBreakdown] = useState<{
    basePremium: number
    tax: number
    discounts: number
    addOns: number
    total: number
  } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insuranceType: "health",
      age: 30,
      gender: "male",
      smoker: false,
      sumInsured: 500000,
      coverageTerm: 1,
      dateOfBirth: new Date(1990, 0, 1),
      pincode: "110001",
    },
  })

  const insuranceType = form.watch("insuranceType")

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Calculate premium based on form values
      let basePremium = 0
      let tax = 0
      let discounts = 0
      let addOns = 0

      switch (values.insuranceType) {
        case "health":
          basePremium = values.sumInsured * 0.02 * (values.age / 30)
          if (values.smoker) basePremium *= 1.5
          break
        case "auto":
          if (values.vehicleType === "car") {
            basePremium = (values.vehicleValue || 500000) * 0.03 * (1 + (values.vehicleAge || 0) / 10)
          } else if (values.vehicleType === "bike") {
            basePremium = (values.vehicleValue || 100000) * 0.04 * (1 + (values.vehicleAge || 0) / 10)
          } else {
            basePremium = (values.vehicleValue || 1000000) * 0.05 * (1 + (values.vehicleAge || 0) / 10)
          }
          break
        case "life":
          basePremium = values.sumInsured * 0.01 * (values.age / 25) * (values.smoker ? 1.5 : 1)
          break
        case "home":
          basePremium = (values.propertyValue || 2000000) * 0.005 * (1 + (values.propertyAge || 0) / 20)
          break
      }

      // Apply discounts
      if (values.gender === "female") discounts += basePremium * 0.1
      if (!values.smoker) discounts += basePremium * 0.15

      // Calculate tax (18% GST)
      tax = (basePremium - discounts) * 0.18

      // Add-ons (assumed 5% of base premium)
      addOns = basePremium * 0.05

      // Total premium
      const totalPremium = basePremium + tax + addOns - discounts

      setPremium(Math.round(totalPremium))
      setBreakdown({
        basePremium: Math.round(basePremium),
        tax: Math.round(tax),
        discounts: Math.round(discounts),
        addOns: Math.round(addOns),
        total: Math.round(totalPremium),
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Insurance Premium Calculator</h2>
        <p className="text-muted-foreground">
          Calculate your estimated premium based on your details and coverage needs.
        </p>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-4 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="insuranceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select insurance type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="health">Health Insurance</SelectItem>
                          <SelectItem value="auto">Auto Insurance</SelectItem>
                          <SelectItem value="life">Life Insurance</SelectItem>
                          <SelectItem value="home">Home Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pincode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={18}
                        max={99}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smoker"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Smoker</FormLabel>
                      <FormDescription>Do you smoke or use tobacco products?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sumInsured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sum Insured: ₹{field.value.toLocaleString()}</FormLabel>
                    <FormControl>
                      <Slider
                        min={100000}
                        max={10000000}
                        step={100000}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormDescription>Select your desired coverage amount</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {insuranceType === "auto" && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="bike">Bike</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicleAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Age: {field.value} years</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={25}
                            step={1}
                            defaultValue={[field.value || 0]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicleValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Value: ₹{(field.value || 0).toLocaleString()}</FormLabel>
                        <FormControl>
                          <Slider
                            min={10000}
                            max={5000000}
                            step={10000}
                            defaultValue={[field.value || 500000]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {insuranceType === "home" && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="independent">Independent House</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propertyAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Age: {field.value} years</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            defaultValue={[field.value || 0]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propertyValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Value: ₹{(field.value || 0).toLocaleString()}</FormLabel>
                        <FormControl>
                          <Slider
                            min={100000}
                            max={50000000}
                            step={100000}
                            defaultValue={[field.value || 2000000]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {insuranceType === "life" && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select occupation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="salaried">Salaried</SelectItem>
                            <SelectItem value="self-employed">Self-employed</SelectItem>
                            <SelectItem value="business">Business Owner</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="annualIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Income: ₹{(field.value || 0).toLocaleString()}</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={10000000}
                            step={100000}
                            defaultValue={[field.value || 500000]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Calculating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate Premium
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="results" className="pt-4">
          {premium ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Premium Estimate</span>
                    <Badge variant="outline" className="text-lg font-bold">
                      ₹{premium.toLocaleString()}/year
                    </Badge>
                  </CardTitle>
                  <CardDescription>Estimated premium based on the information provided</CardDescription>
                </CardHeader>
                <CardContent>
                  {breakdown && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Base Premium</span>
                        <span>₹{breakdown.basePremium.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Add-ons</span>
                        <span>₹{breakdown.addOns.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Discounts</span>
                        <span className="text-green-600">-₹{breakdown.discounts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">GST (18%)</span>
                        <span>₹{breakdown.tax.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between items-center font-bold">
                        <span>Total Premium</span>
                        <span>₹{breakdown.total.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p className="flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      This is an estimate. Final premium may vary based on additional factors.
                    </p>
                  </div>
                  <div className="flex space-x-4 w-full">
                    <Button className="flex-1">Buy Now</Button>
                    <Button variant="outline" className="flex-1">
                      Save Quote
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Add-ons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insuranceType === "health" && (
                      <>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Switch id="critical-illness" />
                            <label htmlFor="critical-illness" className="ml-2">
                              Critical Illness Cover
                            </label>
                          </div>
                          <Badge variant="outline">+₹2,500</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Switch id="maternity" />
                            <label htmlFor="maternity" className="ml-2">
                              Maternity Cover
                            </label>
                          </div>
                          <Badge variant="outline">+₹3,200</Badge>
                        </div>
                      </>
                    )}

                    {insuranceType === "auto" && (
                      <>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Switch id="zero-dep" />
                            <label htmlFor="zero-dep" className="ml-2">
                              Zero Depreciation
                            </label>
                          </div>
                          <Badge variant="outline">+₹1,800</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Switch id="roadside" />
                            <label htmlFor="roadside" className="ml-2">
                              Roadside Assistance
                            </label>
                          </div>
                          <Badge variant="outline">+₹800</Badge>
                        </div>
                      </>
                    )}

                    {insuranceType === "life" && (
                      <>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Switch id="accidental-death" />
                            <label htmlFor="accidental-death" className="ml-2">
                              Accidental Death Benefit
                            </label>
                          </div>
                          <Badge variant="outline">+₹1,200</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Switch id="critical-illness-life" />
                            <label htmlFor="critical-illness-life" className="ml-2">
                              Critical Illness Rider
                            </label>
                          </div>
                          <Badge variant="outline">+₹2,800</Badge>
                        </div>
                      </>
                    )}

                    {insuranceType === "home" && (
                      <>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Switch id="burglary" />
                            <label htmlFor="burglary" className="ml-2">
                              Burglary Cover
                            </label>
                          </div>
                          <Badge variant="outline">+₹1,500</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Switch id="electrical-damage" />
                            <label htmlFor="electrical-damage" className="ml-2">
                              Electrical Equipment Damage
                            </label>
                          </div>
                          <Badge variant="outline">+₹900</Badge>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Results Yet</h3>
              <p className="text-muted-foreground mt-2">Fill out the calculator form to see your premium estimate</p>
              <Button variant="outline" className="mt-4" onClick={() => form.handleSubmit(onSubmit)()}>
                Calculate Now
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
