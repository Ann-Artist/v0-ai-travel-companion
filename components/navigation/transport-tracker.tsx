"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bus, Train, Clock, MapPin, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TransportInfo {
  id: string
  type: "bus" | "train" | "metro"
  line: string
  destination: string
  arrival: string
  delay?: string
  platform?: string
  status: "on-time" | "delayed" | "cancelled"
}

interface TransportTrackerProps {
  className?: string
  location?: string
}

export function TransportTracker({ className, location = "Current Location" }: TransportTrackerProps) {
  const [transports, setTransports] = useState<TransportInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchTransportData = async () => {
    setIsLoading(true)

    try {
      // Simulate API call to transport service
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockData: TransportInfo[] = [
        {
          id: "1",
          type: "bus",
          line: "Route 42",
          destination: "Downtown Terminal",
          arrival: "2 min",
          status: "on-time",
        },
        {
          id: "2",
          type: "train",
          line: "Blue Line",
          destination: "Airport",
          arrival: "5 min",
          delay: "1 min",
          platform: "Platform 2",
          status: "delayed",
        },
        {
          id: "3",
          type: "metro",
          line: "Red Line",
          destination: "University",
          arrival: "8 min",
          platform: "Platform 1",
          status: "on-time",
        },
        {
          id: "4",
          type: "bus",
          line: "Route 15",
          destination: "Shopping Mall",
          arrival: "12 min",
          status: "on-time",
        },
        {
          id: "5",
          type: "train",
          line: "Green Line",
          destination: "City Center",
          arrival: "15 min",
          status: "cancelled",
        },
      ]

      setTransports(mockData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching transport data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransportData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTransportData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "bus":
        return <Bus className="h-5 w-5" />
      case "train":
      case "metro":
        return <Train className="h-5 w-5" />
      default:
        return <MapPin className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "bg-green-100 text-green-800"
      case "delayed":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Public Transport
          </CardTitle>
          <Button variant="outline" size="sm" onClick={fetchTransportData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Near {location} • Updated {lastUpdated.toLocaleTimeString([], { timeStyle: "short" })}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transports.map((transport) => (
            <div
              key={transport.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full">{getTransportIcon(transport.type)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{transport.line}</p>
                    <Badge variant="outline" className={getStatusColor(transport.status)}>
                      {transport.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">to {transport.destination}</p>
                  {transport.platform && <p className="text-xs text-muted-foreground">{transport.platform}</p>}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="font-bold">{transport.arrival}</span>
                </div>
                {transport.delay && <p className="text-xs text-yellow-600">+{transport.delay} delay</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
