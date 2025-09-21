"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, ArrowUp, Navigation, Volume2, VolumeX, MapPin, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface SoundAlert {
  id: string
  message: string
  timestamp: Date
  type: "announcement" | "warning" | "info"
}

export default function DeafUserInterface() {
  const router = useRouter()
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentDirection, setCurrentDirection] = useState("")
  const [soundAlerts, setSoundAlerts] = useState<SoundAlert[]>([])
  const [isListeningForSounds, setIsListeningForSounds] = useState(false)
  const [nextTransport, setNextTransport] = useState("")
  const alertsEndRef = useRef<HTMLDivElement>(null)

  // Simulate sound detection and conversion to text
  useEffect(() => {
    if (isListeningForSounds) {
      const interval = setInterval(() => {
        // Simulate random sound alerts
        const alerts = [
          { message: "Bus arriving at platform 2", type: "announcement" as const },
          { message: "Next stop: Central Station", type: "info" as const },
          { message: "Mind the gap", type: "warning" as const },
          { message: "Train departing in 2 minutes", type: "announcement" as const },
          { message: "Emergency vehicle approaching", type: "warning" as const },
        ]

        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)]
        const newAlert: SoundAlert = {
          id: Date.now().toString(),
          message: randomAlert.message,
          timestamp: new Date(),
          type: randomAlert.type,
        }

        setSoundAlerts((prev) => [...prev.slice(-4), newAlert])
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isListeningForSounds])

  // Auto-scroll to latest alert
  useEffect(() => {
    alertsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [soundAlerts])

  const handleStartNavigation = () => {
    if (!fromLocation || !toLocation) {
      return
    }

    setIsNavigating(true)
    setCurrentDirection("Head north on Main Street for 200 meters")
    setNextTransport("Bus stop in 150 meters on your right")
    setIsListeningForSounds(true)

    // Simulate navigation updates
    setTimeout(() => {
      setCurrentDirection("Turn right onto Oak Avenue")
      setNextTransport("Metro station 300 meters ahead")
    }, 8000)

    setTimeout(() => {
      setCurrentDirection("Continue straight for 500 meters")
      setNextTransport("Bus stop approaching on left side")
    }, 15000)
  }

  const handleStopNavigation = () => {
    setIsNavigating(false)
    setCurrentDirection("")
    setNextTransport("")
    setIsListeningForSounds(false)
  }

  const handleGoBack = () => {
    router.push("/")
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-destructive text-destructive-foreground"
      case "announcement":
        return "bg-secondary text-secondary-foreground"
      case "info":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getDirectionIcon = (direction: string) => {
    if (direction.toLowerCase().includes("right")) return <ArrowRight className="h-6 w-6" />
    if (direction.toLowerCase().includes("left")) return <ArrowLeft className="h-6 w-6" />
    if (direction.toLowerCase().includes("straight") || direction.toLowerCase().includes("continue"))
      return <ArrowUp className="h-6 w-6" />
    return <Navigation className="h-6 w-6" />
  }

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="lg"
            onClick={handleGoBack}
            className="p-4 bg-transparent"
            aria-label="Go back to main menu"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Visual Interface</h1>
          <div className="ml-auto flex items-center gap-2">
            {isListeningForSounds ? (
              <Badge variant="secondary" className="text-sm">
                <Volume2 className="h-4 w-4 mr-1" />
                Sound Detection ON
              </Badge>
            ) : (
              <Badge variant="outline" className="text-sm">
                <VolumeX className="h-4 w-4 mr-1" />
                Sound Detection OFF
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Navigation Setup */}
          <div className="space-y-6">
            {/* Location Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Travel Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="from" className="text-base font-medium">
                    From (Starting Location)
                  </Label>
                  <Input
                    id="from"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Enter your starting location"
                    className="mt-1 text-lg p-3"
                    disabled={isNavigating}
                  />
                </div>
                <div>
                  <Label htmlFor="to" className="text-base font-medium">
                    To (Destination)
                  </Label>
                  <Input
                    id="to"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Enter your destination"
                    className="mt-1 text-lg p-3"
                    disabled={isNavigating}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Navigation Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Navigation Control</CardTitle>
              </CardHeader>
              <CardContent>
                {!isNavigating ? (
                  <Button
                    size="lg"
                    onClick={handleStartNavigation}
                    disabled={!fromLocation || !toLocation}
                    className="w-full p-4 text-lg"
                  >
                    <Navigation className="h-6 w-6 mr-2" />
                    Start Visual Navigation
                  </Button>
                ) : (
                  <Button variant="destructive" size="lg" onClick={handleStopNavigation} className="w-full p-4 text-lg">
                    Stop Navigation
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Current Direction */}
            {isNavigating && currentDirection && (
              <Card className="border-2 border-secondary">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {getDirectionIcon(currentDirection)}
                    Current Direction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">{currentDirection}</p>
                </CardContent>
              </Card>
            )}

            {/* Next Transport */}
            {isNavigating && nextTransport && (
              <Card className="bg-accent/10 border-accent">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Public Transport
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-foreground">{nextTransport}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sound Alerts */}
          <div className="space-y-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Volume2 className="h-6 w-6" />
                  Live Sound Alerts
                </CardTitle>
                <p className="text-sm text-muted-foreground">Environmental sounds converted to text in real-time</p>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto space-y-3">
                  {soundAlerts.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Volume2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No sound alerts yet</p>
                        <p className="text-sm">Start navigation to begin sound detection</p>
                      </div>
                    </div>
                  ) : (
                    soundAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg border ${getAlertColor(alert.type)} animate-in slide-in-from-bottom-2`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium flex-1">{alert.message}</p>
                          <div className="flex items-center gap-1 text-xs opacity-75">
                            <Clock className="h-3 w-3" />
                            {alert.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                        <Badge variant="outline" size="sm" className="mt-2 text-xs">
                          {alert.type}
                        </Badge>
                      </div>
                    ))
                  )}
                  <div ref={alertsEndRef} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Visual Instructions */}
        <Card className="mt-6 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">How to Use Visual Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Navigation:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Type your starting location and destination</li>
                  <li>• Click "Start Visual Navigation" to begin</li>
                  <li>• Follow the large text directions displayed</li>
                  <li>• Watch for public transport information</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Sound Alerts:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Environmental sounds are converted to text</li>
                  <li>• Announcements appear in real-time</li>
                  <li>• Different colors indicate alert types</li>
                  <li>• Timestamps help track recent sounds</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
