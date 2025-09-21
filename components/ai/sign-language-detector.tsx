"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hand, Camera, Loader2 } from "lucide-react"

interface SignDetection {
  gesture: string
  confidence: number
  timestamp: Date
  translation: string
}

interface SignLanguageDetectorProps {
  onDetection?: (detection: SignDetection) => void
  className?: string
}

export function SignLanguageDetector({ onDetection, className }: SignLanguageDetectorProps) {
  const [isActive, setIsActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [detections, setDetections] = useState<SignDetection[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  const startDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsActive(true)

        // Start continuous detection
        intervalRef.current = setInterval(() => {
          detectSignLanguage()
        }, 2000)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopDetection = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    setIsActive(false)
    setDetections([])
  }

  const detectSignLanguage = useCallback(async () => {
    if (!videoRef.current || isProcessing) return

    setIsProcessing(true)

    try {
      // Simulate sign language detection API call
      // In a real implementation, this would use a trained model
      const mockSigns = [
        { gesture: "hello", translation: "Hello" },
        { gesture: "thank_you", translation: "Thank you" },
        { gesture: "help", translation: "Help" },
        { gesture: "where", translation: "Where?" },
        { gesture: "bus", translation: "Bus" },
        { gesture: "train", translation: "Train" },
        { gesture: "stop", translation: "Stop" },
        { gesture: "go", translation: "Go" },
        { gesture: "left", translation: "Left" },
        { gesture: "right", translation: "Right" },
      ]

      // Randomly detect a sign (simulate detection)
      if (Math.random() > 0.7) {
        const randomSign = mockSigns[Math.floor(Math.random() * mockSigns.length)]
        const detection: SignDetection = {
          gesture: randomSign.gesture,
          confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
          timestamp: new Date(),
          translation: randomSign.translation,
        }

        setDetections((prev) => [...prev.slice(-4), detection])
        onDetection?.(detection)
      }
    } catch (error) {
      console.error("Error detecting sign language:", error)
    } finally {
      setIsProcessing(false)
    }
  }, [isProcessing, onDetection])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand className="h-5 w-5" />
          Sign Language Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
            style={{ display: isActive ? "block" : "none" }}
          />
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Camera not active</p>
              </div>
            </div>
          )}
          {isProcessing && (
            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2">
              <Loader2 className="h-4 w-4 text-white animate-spin" />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isActive ? (
            <Button onClick={startDetection} className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Start Detection
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopDetection}>
              Stop Detection
            </Button>
          )}
        </div>

        {detections.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent Detections:</p>
            {detections.map((detection, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg animate-in slide-in-from-bottom-2"
              >
                <div>
                  <p className="font-medium">{detection.translation}</p>
                  <p className="text-xs text-muted-foreground">
                    {detection.timestamp.toLocaleTimeString([], { timeStyle: "short" })}
                  </p>
                </div>
                <Badge variant="secondary">{Math.round(detection.confidence * 100)}%</Badge>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>Supported signs: Hello, Thank you, Help, Where, Bus, Train, Stop, Go, Left, Right</p>
        </div>
      </CardContent>
    </Card>
  )
}
