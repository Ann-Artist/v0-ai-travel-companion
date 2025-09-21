"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VolumeX, EyeOff, Users } from "lucide-react"
import { useRouter } from "next/navigation"

type UserType = "blind" | "deaf" | "normal" | null

export default function HomePage() {
  const router = useRouter()
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null)

  const handleUserTypeSelection = (type: UserType) => {
    setSelectedUserType(type)
    // Navigate to the appropriate interface
    if (type) {
      router.push(`/${type}`)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">AI Travel Companion</h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-balance">
            Your accessible AI-powered guide for seamless travel experiences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-secondary"
            onClick={() => handleUserTypeSelection("blind")}
            role="button"
            tabIndex={0}
            aria-label="Select interface for blind users with voice controls"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleUserTypeSelection("blind")
              }
            }}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-secondary/10 rounded-full w-fit">
                <EyeOff className="h-12 w-12 text-secondary" />
              </div>
              <CardTitle className="text-2xl font-bold">Voice Interface</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" size="lg">
                Start Voice Interface
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-secondary"
            onClick={() => handleUserTypeSelection("deaf")}
            role="button"
            tabIndex={0}
            aria-label="Select interface for deaf users with visual guidance"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleUserTypeSelection("deaf")
              }
            }}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-secondary/10 rounded-full w-fit">
                <VolumeX className="h-12 w-12 text-secondary" />
              </div>
              <CardTitle className="text-2xl font-bold">Visual Interface</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" size="lg">
                Start Visual Interface
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-secondary"
            onClick={() => handleUserTypeSelection("normal")}
            role="button"
            tabIndex={0}
            aria-label="Select standard interface with all features"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleUserTypeSelection("normal")
              }
            }}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-secondary/10 rounded-full w-fit">
                <Users className="h-12 w-12 text-secondary" />
              </div>
              <CardTitle className="text-2xl font-bold">Standard Interface</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" size="lg">
                Start Standard Interface
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
