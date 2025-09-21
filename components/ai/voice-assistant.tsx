"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Volume2, Loader2, MicOff } from "lucide-react"

interface VoiceAssistantProps {
  onCommand?: (command: string, transcript: string) => void
  className?: string
  autoListen?: boolean
}

export function VoiceAssistant({ onCommand, className, autoListen = false }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const recognitionRef = useRef<any>(null)

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

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          setIsProcessing(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.volume = 1
      speechSynthesis.speak(utterance)
    }
  }

  const handleVoiceInput = async (transcript: string) => {
    setTranscript(transcript)
    setIsProcessing(true)

    try {
      // Simulate AI processing
      const command = processCommand(transcript.toLowerCase())
      const aiResponse = await generateResponse(transcript)

      setResponse(aiResponse)
      speak(aiResponse)
      onCommand?.(command, transcript)
    } catch (error) {
      console.error("Error processing voice input:", error)
      const errorMsg = "Sorry, I couldn't process that command."
      setResponse(errorMsg)
      speak(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  const processCommand = (transcript: string): string => {
    if (transcript.includes("navigate") || transcript.includes("directions")) return "navigate"
    if (transcript.includes("from") || transcript.includes("start")) return "set_from"
    if (transcript.includes("to") || transcript.includes("destination")) return "set_to"
    if (transcript.includes("camera") || transcript.includes("detect")) return "camera"
    if (transcript.includes("transport") || transcript.includes("bus") || transcript.includes("train"))
      return "transport"
    return "general"
  }

  const generateResponse = async (transcript: string): Promise<string> => {
    // Simulate AI response generation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const command = processCommand(transcript.toLowerCase())

    switch (command) {
      case "navigate":
        return "I'll help you start navigation. Please make sure you've set your starting location and destination."
      case "set_from":
        return "I'm ready to set your starting location. Please tell me where you're starting from."
      case "set_to":
        return "I'm ready to set your destination. Where would you like to go?"
      case "camera":
        return "Activating camera for object detection. Point your camera ahead to see what's around you."
      case "transport":
        return "Let me check nearby public transport options for you."
      default:
        return "I heard you say: " + transcript + ". How can I help you with your travel needs?"
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      setTranscript("")
      setResponse("")
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {!isListening ? (
            <Button onClick={startListening} className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Start Listening
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopListening} className="flex items-center gap-2">
              <MicOff className="h-4 w-4" />
              Stop Listening
            </Button>
          )}

          {isListening && (
            <div className="flex items-center gap-2 text-secondary">
              <Mic className="h-4 w-4 animate-pulse" />
              <span className="text-sm">Listening...</span>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          )}
        </div>

        {transcript && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">You said:</p>
            <p className="text-sm">{transcript}</p>
          </div>
        )}

        {response && (
          <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
            <p className="text-sm font-medium mb-1">Assistant:</p>
            <p className="text-sm">{response}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>Try saying:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>"Set my starting location"</li>
            <li>"Navigate to destination"</li>
            <li>"Show me nearby transport"</li>
            <li>"Activate camera detection"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
