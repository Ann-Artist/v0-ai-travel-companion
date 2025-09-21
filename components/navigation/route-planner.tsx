"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Navigation, Bus, Train, Scaling as Walking } from "lucide-react"

interface RouteStep {
  id: string
  instruction: string
  distance: string
  duration: string
  type: "walk" | "bus" | "train" | "metro"
  line?: string
}

interface RoutePlannerProps {
  from: string
  to: string
  onRouteGenerated?: (route: RouteStep[]) => void
  className?: string
}

export function RoutePlanner({ from, to, onRouteGenerated, className }: RoutePlannerProps) {
  const [route, setRoute] = useState<RouteStep[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalDuration, setTotalDuration] = useState("")

  const generateRoute = async () => {
    if (!from || !to) return

    setIsLoading(true)

    try {
      // Simulate route planning API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockRoute: RouteStep[] = [
        {
          id: "1",
          instruction: `Walk from ${from} to Main Street Bus Stop`,
          distance: "200m",
          duration: "3 min",
          type: "walk",
        },
        {
          id: "2",
          instruction: "Take Bus Route 42 towards Downtown",
          distance: "2.5 km",
          duration: "8 min",
          type: "bus",
          line: "Route 42",
        },
        {
          id: "3",
          instruction: "Walk to Central Metro Station",
          distance: "150m",
          duration: "2 min",
          type: "walk",
        },
        {
          id: "4",
          instruction: "Take Blue Line Metro towards Airport",
          distance: "5.2 km",
          duration: "12 min",
          type: "metro",
          line: "Blue Line",
        },
        {
          id: "5",
          instruction: `Walk to ${to}`,
          distance: "300m",
          duration: "4 min",
          type: "walk",
        },
      ]

      setRoute(mockRoute)
      setTotalDuration("29 min")
      onRouteGenerated?.(mockRoute)
    } catch (error) {
      console.error("Error generating route:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case "walk":
        return <Walking className="h-5 w-5" />
      case "bus":
        return <Bus className="h-5 w-5" />
      case "train":
      case "metro":
        return <Train className="h-5 w-5" />
      default:
        return <Navigation className="h-5 w-5" />
    }
  }

  const getStepColor = (type: string) => {
    switch (type) {
      case "walk":
        return "bg-green-100 text-green-800 border-green-200"
      case "bus":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "train":
      case "metro":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Route Planner
        </CardTitle>
        {from && to && (
          <div className="text-sm text-muted-foreground">
            <p>From: {from}</p>
            <p>To: {to}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!route.length ? (
          <Button onClick={generateRoute} disabled={!from || !to || isLoading} className="w-full">
            {isLoading ? "Planning Route..." : "Plan Route"}
          </Button>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Total: {totalDuration}</span>
              </div>
              <Button variant="outline" size="sm" onClick={generateRoute} disabled={isLoading}>
                Refresh Route
              </Button>
            </div>

            <div className="space-y-3">
              {route.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full border ${getStepColor(step.type)}`}>{getStepIcon(step.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{step.instruction}</p>
                    {step.line && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {step.line}
                      </Badge>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{step.distance}</span>
                      <span>{step.duration}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{index + 1}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
