import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json()

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 })
    }

    // Process voice command and generate appropriate response
    const command = processCommand(transcript.toLowerCase())
    const response = generateResponse(command, transcript)

    return NextResponse.json({
      command,
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Voice command processing error:", error)
    return NextResponse.json({ error: "Failed to process voice command" }, { status: 500 })
  }
}

function processCommand(transcript: string): string {
  if (transcript.includes("navigate") || transcript.includes("directions")) return "navigate"
  if (transcript.includes("from") || transcript.includes("start")) return "set_from"
  if (transcript.includes("to") || transcript.includes("destination")) return "set_to"
  if (transcript.includes("camera") || transcript.includes("detect")) return "camera"
  if (transcript.includes("transport") || transcript.includes("bus") || transcript.includes("train")) return "transport"
  if (transcript.includes("help")) return "help"
  return "general"
}

function generateResponse(command: string, transcript: string): string {
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
    case "help":
      return "I can help you with navigation, setting locations, object detection, and finding public transport. What would you like to do?"
    default:
      return `I heard you say: "${transcript}". How can I help you with your travel needs?`
  }
}
