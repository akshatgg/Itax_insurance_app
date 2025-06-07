import Link from "next/link"
import { ArrowLeft, MapPin, Phone, Search, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FindAgentPage() {
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
            <Link href="/find-agent" className="text-sm font-medium text-primary">
              Find an Agent
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
              <h1 className="text-3xl font-bold tracking-tight mb-2">Find an Insurance Agent Near You</h1>
              <p className="text-muted-foreground">
                Connect with a local agent who can help you find the right insurance coverage for your needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Search Filters</CardTitle>
                    <CardDescription>Refine your search to find the perfect agent</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="flex space-x-2">
                        <Input id="location" placeholder="Enter ZIP code or city" />
                        <Button size="icon" variant="ghost">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Insurance Type</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="auto" className="rounded border-gray-300" defaultChecked />
                          <Label htmlFor="auto">Auto Insurance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="home" className="rounded border-gray-300" defaultChecked />
                          <Label htmlFor="home">Home Insurance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="life" className="rounded border-gray-300" />
                          <Label htmlFor="life">Life Insurance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="health" className="rounded border-gray-300" />
                          <Label htmlFor="health">Health Insurance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="business" className="rounded border-gray-300" />
                          <Label htmlFor="business">Business Insurance</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Distance</Label>
                      <RadioGroup defaultValue="10">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5" id="r1" />
                          <Label htmlFor="r1">Within 5 miles</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="10" id="r2" />
                          <Label htmlFor="r2">Within 10 miles</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="25" id="r3" />
                          <Label htmlFor="r3">Within 25 miles</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="50" id="r4" />
                          <Label htmlFor="r4">Within 50 miles</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Any Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Language</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="mandarin">Mandarin</SelectItem>
                          <SelectItem value="vietnamese">Vietnamese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <RadioGroup defaultValue="any">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="any" id="rating1" />
                          <Label htmlFor="rating1">Any Rating</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="4+" id="rating2" />
                          <Label htmlFor="rating2" className="flex items-center">
                            4+ <Star className="h-3 w-3 fill-current text-yellow-400 ml-1" />
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="4.5+" id="rating3" />
                          <Label htmlFor="rating3" className="flex items-center">
                            4.5+ <Star className="h-3 w-3 fill-current text-yellow-400 ml-1" />
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button className="w-full">Apply Filters</Button>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">12 Agents Found</h2>
                  <Select defaultValue="recommended">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="experience">Most Experienced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <AgentCard
                    name="Sarah Johnson"
                    title="Senior Insurance Agent"
                    rating={4.9}
                    reviews={127}
                    distance="1.2 miles"
                    address="123 Main St, Suite 101, New York, NY 10001"
                    phone="(212) 555-1234"
                    specialties={["Auto", "Home", "Life"]}
                    languages={["English", "Spanish"]}
                    image="/agent-sarah.png"
                  />

                  <AgentCard
                    name="Michael Chen"
                    title="Insurance Specialist"
                    rating={4.7}
                    reviews={98}
                    distance="2.5 miles"
                    address="456 Park Ave, New York, NY 10022"
                    phone="(212) 555-5678"
                    specialties={["Auto", "Home", "Business"]}
                    languages={["English", "Mandarin"]}
                    image="/agent-michael.png"
                  />

                  <AgentCard
                    name="Jessica Martinez"
                    title="Insurance Advisor"
                    rating={4.8}
                    reviews={112}
                    distance="3.1 miles"
                    address="789 Broadway, New York, NY 10003"
                    phone="(212) 555-9012"
                    specialties={["Auto", "Home", "Health"]}
                    languages={["English", "Spanish"]}
                    image="/agent-jessica.png"
                  />

                  <AgentCard
                    name="David Wilson"
                    title="Senior Insurance Consultant"
                    rating={4.6}
                    reviews={87}
                    distance="4.3 miles"
                    address="321 Lexington Ave, New York, NY 10016"
                    phone="(212) 555-3456"
                    specialties={["Auto", "Home", "Life", "Business"]}
                    languages={["English"]}
                    image="/agent-david.png"
                  />

                  <div className="flex justify-center mt-6">
                    <Button variant="outline">Load More Agents</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-teal-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Can't find the right agent?</h3>
              <p className="mb-4">
                Let us match you with an agent who specializes in your specific insurance needs. Fill out a quick form
                and we'll connect you with the perfect agent.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button>Match Me with an Agent</Button>
                <Button variant="outline">Call Our Helpline</Button>
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

function AgentCard({ name, title, rating, reviews, distance, address, phone, specialties, languages, image }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0">
            <img
              src={image || "/placeholder.svg?height=100&width=100&query=person"}
              alt={name}
              className="rounded-full w-24 h-24 object-cover"
            />
          </div>
          <div className="flex-grow space-y-3">
            <div>
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-muted-foreground">{title}</p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium">{rating}</span>
                <span className="ml-1 text-sm text-muted-foreground">({reviews} reviews)</span>
              </div>
              <div className="ml-4 flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {distance}
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="inline-flex items-center rounded-full bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700"
                >
                  {specialty}
                </span>
              ))}
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{address}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{phone}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Languages: </span>
              {languages.join(", ")}
            </div>
          </div>
          <div className="flex flex-col gap-2 md:justify-center">
            <Button>Schedule Appointment</Button>
            <Button variant="outline">View Profile</Button>
          </div>
        </div>
      </CardContent>
    </Card>
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
