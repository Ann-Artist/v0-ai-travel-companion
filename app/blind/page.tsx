"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Camera, Mic, Navigation, Volume2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface VoiceRecognition {
  start: () => void
  stop: () => void
  onresult: (event: any) => void
  onerror: (event: any) => void
  onend: () => void
  continuous: boolean
  interimResults: boolean
}

declare global {
  interface Window {
    SpeechRecognition: new () => VoiceRecognition
    webkitSpeechRecognition: new () => VoiceRecognition
  }
}

export default function BlindUserInterface() {
  const router = useRouter()
  const [isListening, setIsListening] = useState(false)
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [currentField, setCurrentField] = useState<"from" | "to" | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Welcome to your voice-controlled travel companion")
  const recognitionRef = useRef<VoiceRecognition | null>(null)

  // Text-to-speech function
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.volume = 1
      speechSynthesis.speak(utterance)
    }
  }

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase()
          handleVoiceCommand(transcript)
        }

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          speak("Sorry, I couldn't understand that. Please try again.")
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    // Welcome message
    setTimeout(() => {
      speak("Welcome to your AI Travel Companion. Tap anywhere to start voice commands, or use the navigation buttons.")
    }, 1000)

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const handleVoiceCommand = (transcript: string) => {
    console.log("Voice command:", transcript)

    if (currentField === "from") {
      setFromLocation(transcript)
      setCurrentField(null)
      speak(`From location set to ${transcript}. Now say your destination.`)
      setStatusMessage(`From: ${transcript}. Say your destination.`)
      setTimeout(() => {
        setCurrentField("to")
        startListening()
      }, 2000)
    } else if (currentField === "to") {
      setToLocation(transcript)
      setCurrentField(null)
      speak(`Destination set to ${transcript}. Ready to start navigation.`)
      setStatusMessage(`To: ${transcript}. Ready to navigate.`)
    } else {
      // General commands
      if (transcript.includes("from") || transcript.includes("start")) {
        setCurrentField("from")
        speak("Please say your starting location")
        setStatusMessage("Listening for starting location...")
        setTimeout(() => startListening(), 1000)
      } else if (transcript.includes("to") || transcript.includes("destination")) {
        setCurrentField("to")
        speak("Please say your destination")
        setStatusMessage("Listening for destination...")
        setTimeout(() => startListening(), 1000)
      } else if (transcript.includes("navigate") || transcript.includes("start journey")) {
        if (fromLocation && toLocation) {
          handleStartNavigation()
        } else {
          speak("Please set both starting location and destination first")
        }
      } else if (transcript.includes("camera") || transcript.includes("detect")) {
        handleCameraDetection()
      } else if (transcript.includes("back") || transcript.includes("home")) {
        router.push("/")
      }
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const handleSetFromLocation = () => {
    setCurrentField("from")
    speak("Please say your starting location")
    setStatusMessage("Listening for starting location...")
    setTimeout(() => startListening(), 1000)
  }

  const handleSetToLocation = () => {
    setCurrentField("to")
    speak("Please say your destination")
    setStatusMessage("Listening for destination...")
    setTimeout(() => startListening(), 1000)
  }

  const handleStartNavigation = () => {
    if (!fromLocation || !toLocation) {
      speak("Please set both starting location and destination first")
      return
    }

    setIsNavigating(true)
    speak(`Starting navigation from ${fromLocation} to ${toLocation}. I will guide you with voice directions.`)
    setStatusMessage("Navigation started. Listen for directions.")

    // Simulate navigation instructions
    setTimeout(() => {
      speak("In 100 meters, turn right onto Main Street")
    }, 3000)
  }

  const handleCameraDetection = () => {
    speak("Camera activated. Point your camera ahead to detect objects and obstacles.")
    setStatusMessage("Camera detection active. Point ahead.")

    // Simulate object detection
    setTimeout(() => {
      speak("I can see a bus stop 50 meters ahead on your right, and a crosswalk directly in front of you.")
    }, 2000)
  }

  const handleGoBack = () => {
    speak("Going back to main menu")
    router.push("/")
  }

  return (
    <main
      className="min-h-screen bg-background p-4"
      onClick={() => {
        if (!isListening && !currentField) {
          speak(
            "Voice commands ready. Say 'from' to set starting location, 'to' for destination, or 'camera' for object detection.",
          )
        }
      }}
    >
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleGoBack}
            className="p-4 bg-transparent"
            aria-label="Go back to main menu"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Voice Interface</h1>
        </div>

        {/* Status Card */}
        <Card className="mb-8 border-2 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Volume2 className="h-6 w-6 text-secondary" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-foreground">{statusMessage}</p>
            {isListening && (
              <div className="flex items-center gap-2 mt-2 text-secondary">
                <Mic className="h-5 w-5 animate-pulse" />
                <span>Listening...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Cards */}
        <div className="grid gap-6 mb-8">
          <Card className="border-2 hover:border-secondary transition-colors">
            <CardHeader>
              <CardTitle className="text-xl">From Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4 min-h-[2rem]">{fromLocation || "Not set - tap button and speak"}</p>
              <Button
                size="lg"
                onClick={handleSetFromLocation}
                className="w-full p-6 text-lg"
                disabled={isListening}
                aria-label="Set starting location with voice"
              >
                <Mic className="h-6 w-6 mr-2" />
                Set Starting Location
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-secondary transition-colors">
            <CardHeader>
              <CardTitle className="text-xl">To Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4 min-h-[2rem]">{toLocation || "Not set - tap button and speak"}</p>
              <Button
                size="lg"
                onClick={handleSetToLocation}
                className="w-full p-6 text-lg"
                disabled={isListening}
                aria-label="Set destination with voice"
              >
                <Mic className="h-6 w-6 mr-2" />
                Set Destination
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid gap-4">
          <Button
            size="lg"
            onClick={handleStartNavigation}
            disabled={!fromLocation || !toLocation || isNavigating}
            className="w-full p-6 text-lg bg-secondary hover:bg-secondary/90"
            aria-label="Start voice-guided navigation"
          >
            <Navigation className="h-6 w-6 mr-2" />
            {isNavigating ? "Navigation Active" : "Start Navigation"}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleCameraDetection}
            className="w-full p-6 text-lg bg-transparent"
            aria-label="Activate camera for object detection"
          >
            <Camera className="h-6 w-6 mr-2" />
            Detect Objects Ahead
          </Button>
        </div>

        {/* Voice Commands Help */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Voice Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Say "from" to set starting location</li>
              <li>• Say "to" or "destination" to set destination</li>
              <li>• Say "navigate" or "start journey" to begin</li>
              <li>• Say "camera" or "detect" for object detection</li>
              <li>• Say "back" or "home" to return to main menu</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
