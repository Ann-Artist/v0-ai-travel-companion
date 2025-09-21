"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Camera, Mic, Navigation, Volume2, MapPin, Clock, Bus, Train, Hand, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface TransportInfo {
  type: "bus" | "train" | "metro"
  line: string
  arrival: string
  destination: string
}

interface SignLanguageDetection {
  gesture: string
  confidence: number
  timestamp: Date
}

export default function NormalUserInterface() {
  const router = useRouter()
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [isNavigating, setIsNavigating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [currentField, setCurrentField] = useState<"from" | "to" | null>(null)
  const [transportInfo, setTransportInfo] = useState<TransportInfo[]>([])
  const [signLanguageActive, setSignLanguageActive] = useState(false)
  const [detectedSigns, setDetectedSigns] = useState<SignLanguageDetection[]>([])
  const [currentDirection, setCurrentDirection] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const recognitionRef = useRef<any>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          handleVoiceInput(transcript)
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  // Simulate transport data
  useEffect(() => {
    const mockTransport: TransportInfo[] = [
      { type: "bus", line: "Route 42", arrival: "2 min", destination: "Downtown" },
      { type: "train", line: "Blue Line", arrival: "5 min", destination: "Airport" },
      { type: "metro", line: "Red Line", arrival: "8 min", destination: "University" },
      { type: "bus", line: "Route 15", arrival: "12 min", destination: "Mall" },
    ]
    setTransportInfo(mockTransport)
  }, [])

  const handleVoiceInput = (transcript: string) => {
    if (currentField === "from") {
      setFromLocation(transcript)
      setCurrentField(null)
      speak(`From location set to ${transcript}`)
    } else if (currentField === "to") {
      setToLocation(transcript)
      setCurrentField(null)
      speak(`Destination set to ${transcript}`)
    }
  }

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const startVoiceInput = (field: "from" | "to") => {
    if (recognitionRef.current && !isListening) {
      setCurrentField(field)
      setIsListening(true)
      recognitionRef.current.start()
      speak(`Please say your ${field === "from" ? "starting location" : "destination"}`)
    }
  }

  const handleStartNavigation = () => {
    if (!fromLocation || !toLocation) return

    setIsNavigating(true)
    setCurrentDirection("Head north on Main Street for 200 meters, then turn right")
    speak("Navigation started. I will provide both voice and visual directions.")

    // Simulate navigation updates
    setTimeout(() => {
      setCurrentDirection("Turn right onto Oak Avenue and continue for 300 meters")
      speak("Turn right onto Oak Avenue")
    }, 8000)
  }

  const handleStopNavigation = () => {
    setIsNavigating(false)
    setCurrentDirection("")
    speak("Navigation stopped")
  }

  const startSignLanguageDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setSignLanguageActive(true)

        // Simulate sign language detection
        const interval = setInterval(() => {
          const signs = ["Hello", "Thank you", "Help", "Where", "Bus", "Train", "Stop"]
          const randomSign = signs[Math.floor(Math.random() * signs.length)]
          const detection: SignLanguageDetection = {
            gesture: randomSign,
            confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
            timestamp: new Date(),
          }
          setDetectedSigns((prev) => [...prev.slice(-4), detection])
        }, 3000)

        // Store interval ID for cleanup
        ;(videoRef.current as any).detectionInterval = interval
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopSignLanguageDetection = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    if ((videoRef.current as any)?.detectionInterval) {
      clearInterval((videoRef.current as any).detectionInterval)
    }
    setSignLanguageActive(false)
    setDetectedSigns([])
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "bus":
        return <Bus className="h-5 w-5" />
      case "train":
        return <Train className="h-5 w-5" />
      case "metro":
        return <Train className="h-5 w-5" />
      default:
        return <MapPin className="h-5 w-5" />
    }
  }

  const handleGoBack = () => {
    stopSignLanguageDetection()
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="w-full max-w-6xl mx-auto">
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
          <h1 className="text-3xl font-bold text-foreground">Normal</h1>
          <div className="ml-auto flex items-center gap-2">
            {isListening && (
              <Badge variant="secondary" className="animate-pulse">
                <Mic className="h-4 w-4 mr-1" />
                Listening
              </Badge>
            )}
            {signLanguageActive && (
              <Badge variant="secondary">
                <Hand className="h-4 w-4 mr-1" />
                Sign Detection ON
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="navigation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="transport">Public Transport</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility Tools</TabsTrigger>
          </TabsList>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Location Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Travel Planning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="from" className="text-base font-medium">
                      From (Starting Location)
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="from"
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                        placeholder="Enter starting location"
                        className="text-lg p-3"
                        disabled={isNavigating}
                      />
                      <Button
                        variant="outline"
                        onClick={() => startVoiceInput("from")}
                        disabled={isListening || isNavigating}
                        className="px-3"
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="to" className="text-base font-medium">
                      To (Destination)
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="to"
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                        placeholder="Enter destination"
                        className="text-lg p-3"
                        disabled={isNavigating}
                      />
                      <Button
                        variant="outline"
                        onClick={() => startVoiceInput("to")}
                        disabled={isListening || isNavigating}
                        className="px-3"
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="pt-2">
                    {!isNavigating ? (
                      <Button
                        size="lg"
                        onClick={handleStartNavigation}
                        disabled={!fromLocation || !toLocation}
                        className="w-full p-4 text-lg"
                      >
                        <Navigation className="h-6 w-6 mr-2" />
                        Start Navigation
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="lg"
                        onClick={handleStopNavigation}
                        className="w-full p-4 text-lg"
                      >
                        Stop Navigation
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Direction */}
              {isNavigating && (
                <Card className="border-2 border-secondary">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Navigation className="h-6 w-6" />
                      Current Direction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-foreground mb-4">{currentDirection}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => speak(currentDirection)}
                        className="flex items-center gap-2"
                      >
                        <Volume2 className="h-4 w-4" />
                        Repeat Direction
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Public Transport Tab */}
          <TabsContent value="transport" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  Nearby Public Transport
                </CardTitle>
                <p className="text-muted-foreground">Real-time arrival information</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {transportInfo.map((transport, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getTransportIcon(transport.type)}
                        <div>
                          <p className="font-medium">{transport.line}</p>
                          <p className="text-sm text-muted-foreground">to {transport.destination}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{transport.arrival}</p>
                        <p className="text-xs text-muted-foreground">arrival</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accessibility Tools Tab */}
          <TabsContent value="accessibility" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Sign Language Detection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Hand className="h-6 w-6" />
                    Sign Language Recognition
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Point camera at sign language to convert to text</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                      style={{ display: signLanguageActive ? "block" : "none" }}
                    />
                    {!signLanguageActive && (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center">
                          <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Camera not active</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!signLanguageActive ? (
                      <Button onClick={startSignLanguageDetection} className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Start Detection
                      </Button>
                    ) : (
                      <Button variant="destructive" onClick={stopSignLanguageDetection}>
                        Stop Detection
                      </Button>
                    )}
                  </div>
                  {detectedSigns.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Detected Signs:</h4>
                      {detectedSigns.map((sign, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="font-medium">{sign.gesture}</span>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{Math.round(sign.confidence * 100)}%</span>
                            <Clock className="h-3 w-3" />
                            <span>{sign.timestamp.toLocaleTimeString([], { timeStyle: "short" })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Accessibility Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Eye className="h-6 w-6" />
                    Accessibility Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => speak("Voice test")}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Test Text-to-Speech
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => document.body.classList.toggle("high-contrast")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Toggle High Contrast
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => document.body.classList.toggle("large-text")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Toggle Large Text
                    </Button>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Quick Access:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push("/blind")}>
                        Voice Interface
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => router.push("/deaf")}>
                        Visual Interface
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
