"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Eye, Loader2 } from "lucide-react"

interface DetectedObject {
  label: string
  confidence: number
  bbox: {
    x: number
    y: number
    width: number
    height: number
  }
}

interface ObjectDetectionProps {
  onDetection?: (objects: DetectedObject[], description: string) => void
  className?: string
}

export function ObjectDetection({ onDetection, className }: ObjectDetectionProps) {
  const [isActive, setIsActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const [description, setDescription] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsActive(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsActive(false)
    setDetectedObjects([])
    setDescription("")
  }

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsProcessing(true)

    // Capture frame from video
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    ctx.drawImage(videoRef.current, 0, 0)

    // Convert to blob for API call
    canvas.toBlob(
      async (blob) => {
        if (!blob) return

        try {
          // Simulate YOLO object detection API call
          // In a real implementation, this would call your YOLO model API
          const mockObjects: DetectedObject[] = [
            {
              label: "person",
              confidence: 0.92,
              bbox: { x: 100, y: 50, width: 150, height: 300 },
            },
            {
              label: "bus",
              confidence: 0.87,
              bbox: { x: 300, y: 100, width: 200, height: 100 },
            },
            {
              label: "traffic light",
              confidence: 0.95,
              bbox: { x: 50, y: 20, width: 30, height: 80 },
            },
          ]

          const mockDescription =
            "I can see a person walking ahead, a bus approaching from the right, and a traffic light showing green. The path ahead appears clear."

          setDetectedObjects(mockObjects)
          setDescription(mockDescription)
          onDetection?.(mockObjects, mockDescription)
        } catch (error) {
          console.error("Error analyzing image:", error)
        } finally {
          setIsProcessing(false)
        }
      },
      "image/jpeg",
      0.8,
    )
  }, [onDetection])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Object Detection
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
          <canvas ref={canvasRef} className="hidden" />
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Camera not active</p>
              </div>
            </div>
          )}
          {/* Overlay detected objects */}
          {isActive && detectedObjects.length > 0 && (
            <div className="absolute inset-0">
              {detectedObjects.map((obj, index) => (
                <div
                  key={index}
                  className="absolute border-2 border-secondary bg-secondary/20"
                  style={{
                    left: `${(obj.bbox.x / (canvasRef.current?.width || 1)) * 100}%`,
                    top: `${(obj.bbox.y / (canvasRef.current?.height || 1)) * 100}%`,
                    width: `${(obj.bbox.width / (canvasRef.current?.width || 1)) * 100}%`,
                    height: `${(obj.bbox.height / (canvasRef.current?.height || 1)) * 100}%`,
                  }}
                >
                  <span className="absolute -top-6 left-0 bg-secondary text-secondary-foreground px-2 py-1 text-xs rounded">
                    {obj.label} ({Math.round(obj.confidence * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isActive ? (
            <Button onClick={startCamera} className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Start Camera
            </Button>
          ) : (
            <>
              <Button onClick={captureAndAnalyze} disabled={isProcessing} className="flex items-center gap-2">
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                Analyze Scene
              </Button>
              <Button variant="destructive" onClick={stopCamera}>
                Stop Camera
              </Button>
            </>
          )}
        </div>

        {description && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Scene Description:</p>
            <p className="text-sm">{description}</p>
          </div>
        )}

        {detectedObjects.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Detected Objects:</p>
            {detectedObjects.map((obj, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="capitalize">{obj.label}</span>
                <span className="text-sm text-muted-foreground">{Math.round(obj.confidence * 100)}% confidence</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
