"use client";

import { useState, useEffect, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  FileText,
  Link,
  ListTree,
  Send,
  Sparkles,
  TestTube2,
  CheckCircle,
  AlertCircle,
  Bug,
} from "lucide-react";
import {
  waitForGA,
  sendPageView,
  sendConversion,
  logCurrentUTMParams,
  debugUTMTracking,
  isGAAvailable,
} from "@/lib/analytics";

interface UtmParams {
  [key: string]: string;
}

// A more robust list of UTM and common tracking parameters
const TRACKING_KEYS = [
  // Standard UTM
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  // Google Ads
  "gclid", // Google Click ID
  "utm_source_platform",
  "utm_creative_format",
  "utm_marketing_tactic",
  // Facebook
  "fbclid", // Facebook Click ID
  "dclid", // Display Click ID
  // Others
  "msclkid", // Microsoft Click ID
  "mc_cid", // Mailchimp Campaign ID
  "mc_eid", // Mailchimp Email ID
];

const EXAMPLE_URLS = [
  {
    name: "Google Ads",
    url: "https://utm-demo.vercel.app/products/summer-sale?utm_source=google&utm_medium=cpc&utm_campaign=summer_launch&utm_term=beachwear&gclid=Cj0KCQjwgNanBhDUARIsAkhg3di9nS9tC9W4ZzY0",
  },
  {
    name: "Facebook Campaign",
    url: "https://utm-demo.vercel.app/landing/early-access?utm_source=facebook&utm_medium=social_paid&utm_campaign=q3_lookbook&fbclid=IwAR2-gT8DqXkP6A",
  },
  {
    name: "Email Newsletter",
    url: "https://utm-demo.vercel.app/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly_deals_august&mc_cid=a1b2c3d4e5",
  },
];

// Utility function to parse parameters from a URL
const parseTrackingParams = (url: string): UtmParams => {
  const params: UtmParams = {};
  if (!url) return params;

  try {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;

    TRACKING_KEYS.forEach((key) => {
      if (searchParams.has(key)) {
        params[key] = searchParams.get(key) || "";
      }
    });
  } catch {
    // Silently fail for invalid URLs during typing
  }
  return params;
};

export default function UtmTracker() {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [analyzedParams, setAnalyzedParams] = useState<UtmParams>({});
  const [urlInput, setUrlInput] = useState<string>("");
  const [isGtagReady, setIsGtagReady] = useState<boolean>(false);
  const [gaStatus, setGaStatus] = useState<"loading" | "ready" | "failed">(
    "loading"
  );
  const [lastEventSent, setLastEventSent] = useState<string | null>(null);

  // Initialize component and wait for Google Analytics
  useEffect(() => {
    const initializeComponent = async () => {
      const initialUrl =
        typeof window !== "undefined"
          ? window.location.href
          : "https://utm-demo.vercel.app/";

      setUrlInput(initialUrl);
      setCurrentUrl(initialUrl);
      setAnalyzedParams(parseTrackingParams(initialUrl));

      // Wait for Google Analytics to be available (@next/third-parties)
      console.log(
        "GA: Waiting for @next/third-parties Google Analytics to load..."
      );
      setGaStatus("loading");

      const gaReady = await waitForGA();
      setIsGtagReady(gaReady);
      setGaStatus(gaReady ? "ready" : "failed");

      if (gaReady) {
        console.log("GA: @next/third-parties Google Analytics is ready");
        // Log current UTM parameters for debugging
        logCurrentUTMParams();
      } else {
        console.warn("GA: Google Analytics failed to load");
      }
    };

    initializeComponent();
  }, []);

  // Send page_view when URL changes and GA is ready
  useEffect(() => {
    if (!currentUrl || !isGtagReady) {
      console.log("GA: Skipping page_view", {
        currentUrl: !!currentUrl,
        isGtagReady,
      });
      return;
    }

    // Send page view - GA4 automatically captures UTM parameters from URL
    sendPageView(currentUrl, `UTM Demo - ${currentUrl}`);
    setLastEventSent("page_view");

    // Log UTM parameters for demonstration
    const detectedUTMs = logCurrentUTMParams();
    if (Object.keys(detectedUTMs).length > 0) {
      console.log(
        "GA: UTM parameters will be automatically associated with this page view by GA4"
      );
    }
  }, [currentUrl, isGtagReady]);

  const handleSimulate = () => {
    setCurrentUrl(urlInput);
    setAnalyzedParams(parseTrackingParams(urlInput));
  };

  const handleSendCustomEvent = () => {
    if (!isGAAvailable()) {
      alert(
        "Google Analytics not loaded. Make sure your measurement ID is correct."
      );
      return;
    }

    // Send conversion event - GA4 automatically associates current UTM parameters
    sendConversion("utm_demo_conversion", {
      demo_type: "manual_test",
      current_url: currentUrl,
    });

    setLastEventSent("utm_demo_conversion");
    alert(
      "Custom event 'utm_demo_conversion' sent to GA4! UTM parameters from the current URL are automatically tracked. Check the console and your GA4 Realtime reports."
    );
  };

  const handleDebugUTM = () => {
    debugUTMTracking();
    alert(
      "UTM debug info logged to console. Check your browser's developer tools console for detailed information."
    );
  };

  const handleExampleClick = (url: string) => {
    setUrlInput(url);
    setCurrentUrl(url);
    setAnalyzedParams(parseTrackingParams(url));
  };

  const getGAStatusDisplay = () => {
    switch (gaStatus) {
      case "loading":
        return {
          icon: <AlertCircle className="w-4 h-4 text-yellow-500" />,
          text: "Google Analytics loading...",
          color: "text-yellow-600 dark:text-yellow-400",
        };
      case "ready":
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          text: "@next/third-parties GA4 ready",
          color: "text-green-600 dark:text-green-400",
        };
      case "failed":
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-500" />,
          text: "GA failed to load",
          color: "text-red-600 dark:text-red-400",
        };
    }
  };

  const statusDisplay = getGAStatusDisplay();

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            UTM & Ad Parameter Tracker
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            See how GA4 automatically tracks marketing parameters from URLs.
            Paste a URL or use an example to get started.
          </p>

          {/* GA Status Indicator */}
          <div
            className={`mt-4 flex items-center justify-center gap-2 ${statusDisplay.color}`}
          >
            {statusDisplay.icon}
            <span className="text-sm font-medium">{statusDisplay.text}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Simulator */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube2 className="w-6 h-6" />
                <span>URL Simulator</span>
              </CardTitle>
              <CardDescription>
                Enter a URL with tracking parameters to see them analyzed on the
                right.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="simulate-url" className="font-medium">
                  Enter URL to Analyze
                </label>
                <div className="flex gap-2">
                  <Input
                    id="simulate-url"
                    placeholder="e.g., https://utm-demo.vercel.app/products/summer-sale?utm_source=google"
                    value={urlInput}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setUrlInput(e.target.value)
                    }
                    className="flex-1 font-mono text-sm"
                  />
                  <Button onClick={handleSimulate}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Or, try an example:</h4>
                <div className="space-y-2">
                  {EXAMPLE_URLS.map((example) => (
                    <button
                      key={example.name}
                      onClick={() => handleExampleClick(example.url)}
                      className="w-full text-left p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {example.name}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate mt-1">
                        {example.url}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Results */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-6 h-6" />
                  <span>Analyzed URL</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="break-all p-3 bg-slate-100 dark:bg-gray-800 rounded-md text-sm font-mono">
                  {currentUrl || "No URL analyzed yet."}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListTree className="w-6 h-6" />
                  <span>Detected Parameters</span>
                </CardTitle>
                <CardDescription>
                  These parameters are automatically tracked by GA4 when the URL
                  loads
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(analyzedParams).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Parameter</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(analyzedParams).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{key}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                    No tracking parameters found.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-6 h-6" />
                  <span>GA4 Event Testing</span>
                </CardTitle>
                <CardDescription>
                  GA4 automatically associates UTM parameters from the current
                  URL with all events. Check GA4 Reports → Acquisition → Traffic
                  Acquisition.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={handleSendCustomEvent}
                    size="lg"
                    className="flex-1"
                    disabled={gaStatus !== "ready"}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Send Test Event
                    {gaStatus === "ready" && (
                      <CheckCircle className="w-4 h-4 ml-2 text-green-400" />
                    )}
                  </Button>
                  <Button
                    onClick={handleDebugUTM}
                    size="lg"
                    variant="outline"
                    disabled={gaStatus !== "ready"}
                  >
                    <Bug className="w-4 h-4" />
                  </Button>
                </div>
                {lastEventSent && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Last event sent to GA4:
                    <span className="font-semibold ml-1">{lastEventSent}</span>
                  </p>
                )}
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  💡 Pro tip: UTM data appears in GA4 Reports → Acquisition →
                  Traffic Acquisition.
                  <br />
                  Look for &ldquo;Source/Medium&rdquo; and
                  &ldquo;Campaign&rdquo; dimensions.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
