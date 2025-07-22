"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface UtmParams {
  [key: string]: string
}

export default function UtmTracker() {
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [utmParameters, setUtmParameters] = useState<UtmParams>({})
  const [simulatedUrlInput, setSimulatedUrlInput] = useState<string>("")

  // Function to parse UTM parameters from a given URL string
  const parseUtmParams = (url: string): UtmParams => {
    const params: UtmParams = {}
    try {
      const urlObj = new URL(url)
      const searchParams = urlObj.searchParams

      // Common UTM parameters
      const utmKeys = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "utm_id",
        "utm_source_platform",
        "utm_creative_format",
        "utm_marketing_tactic",
      ]

      utmKeys.forEach((key) => {
        if (searchParams.has(key)) {
          params[key] = searchParams.get(key) || ""
        }
      })
    } catch (error) {
      console.error("Invalid URL:", error)
    }
    return params
  }

  // Effect to run on component mount to get initial URL and parse UTMs
  useEffect(() => {
    // In a real browser environment, window.location.href would be available
    // For Next.js server-side rendering, window is not defined initially.
    // We'll use a placeholder for the initial render and update on client-side.
    const initialUrl = typeof window !== "undefined" ? window.location.href : "https://example.com"
    setCurrentUrl(initialUrl)
    setUtmParameters(parseUtmParams(initialUrl))
    setSimulatedUrlInput(initialUrl) // Pre-fill input with current URL
  }, [])

  useEffect(() => {
    // Skip if we don't yet have a valid absolute URL (e.g. first render)
    if (!currentUrl || !/^https?:\/\//.test(currentUrl)) return

    if (typeof window !== "undefined" && (window as any).gtag) {
      try {
        const urlObj = new URL(currentUrl)
        ;(window as any).gtag("event", "page_view", {
          page_path: urlObj.pathname + urlObj.search,
          page_location: currentUrl,
          page_title: document.title,
        })
        console.log("GA: Sent page_view for:", currentUrl)
      } catch (error) {
        console.error(
          "GA Error: Failed to construct URL for page_view event. Skipping GA event.",
          error,
          "URL:",
          currentUrl,
        )
      }
    }
  }, [currentUrl])

  // Handle simulation button click
  const handleSimulateUrl = () => {
    setCurrentUrl(simulatedUrlInput)
    setUtmParameters(parseUtmParams(simulatedUrlInput))
  }

  const sendCustomEvent = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "utm_demo_event", {
        event_category: "UTM Demo",
        event_label: "Simulated Event with UTMs",
        ...utmParameters, // Pass all detected UTM parameters as event parameters
      })
      console.log("GA: Sent custom event with UTMs:", utmParameters)
      alert("Custom event 'utm_demo_event' sent to Google Analytics (check console for details)!")
    } else {
      alert("Google Analytics not loaded. Make sure NEXT_PUBLIC_GA_MEASUREMENT_ID is set.")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle>UTM Parameter Explainer</CardTitle>
          <CardDescription>
            {
              "UTM parameters are like special tags you add to website links. They help you track where visitors come from and which campaigns perform best."
            }
            <br />
            {
              "For example, if someone clicks a link with utm_source=facebook and utm_medium=social, you know they arrived from a Facebook social-media post."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Current URL Being Analyzed:</h3>
            <p className="break-all p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-mono">{currentUrl}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Detected UTM Parameters:</h3>
            {Object.keys(utmParameters).length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Parameter</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(utmParameters).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No UTM parameters found in the current URL.</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-2">Simulate a URL with UTMs:</h3>
            <Label htmlFor="simulate-url">Enter a URL with UTMs:</Label>
            <div className="flex gap-2">
              <Input
                id="simulate-url"
                placeholder="e.g., https://yourwebsite.com/?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale"
                value={simulatedUrlInput}
                onChange={(e) => setSimulatedUrlInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSimulateUrl}>Simulate</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Try pasting a URL like:
              `https://example.com/product?utm_source=newsletter&utm_medium=email&utm_campaign=new_arrivals`
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-2">Simulate Google Analytics Event:</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Click this button to simulate sending a custom event to Google Analytics, including the currently detected
              UTM parameters.
            </p>
            <Button onClick={sendCustomEvent}>Send Custom GA Event</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
