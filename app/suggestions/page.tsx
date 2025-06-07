import { FeatureRequests } from "@/components/suggestions/feature-requests"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuggestionsPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Suggestions & Feedback</h1>
          <p className="mt-2 text-gray-600">Help us improve SecureLife Insurance App with your suggestions</p>
        </div>

        <div className="grid gap-6">
          {/* Development Roadmap */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 Development Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Phase 1: Core Features</span>
                  <span className="text-sm text-gray-500">(Completed)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Phase 2: Payment Integration</span>
                  <span className="text-sm text-gray-500">(In Progress)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="font-medium">Phase 3: Advanced Features</span>
                  <span className="text-sm text-gray-500">(Planned)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Requests */}
          <FeatureRequests />

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-teal-600">25+</div>
                <div className="text-sm text-gray-600">Features Implemented</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">User Requests</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">User Satisfaction</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
