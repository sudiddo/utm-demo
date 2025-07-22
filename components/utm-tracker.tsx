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
} from "lucide-react";

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
  } catch (error: unknown) {
    // Silently fail for invalid URLs during typing
    console.log("error", error);
  }
  return params;
};

export default function UtmTracker() {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [analyzedParams, setAnalyzedParams] = useState<UtmParams>({});
  const [urlInput, setUrlInput] = useState<string>("");
  const [isGtagAvailable, setIsGtagAvailable] = useState<boolean>(false);
  const [lastEventSent, setLastEventSent] = useState<string | null>(null);

  // On mount, get the initial URL and check for Google Analytics
  useEffect(() => {
    const initialUrl =
      typeof window !== "undefined"
        ? window.location.href
        : "https://yourshop.com/";
    setUrlInput(initialUrl);
    setCurrentUrl(initialUrl);
    setAnalyzedParams(parseTrackingParams(initialUrl));

    // Check for gtag availability with a more robust approach
    const checkGtag = () => {
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        console.log("GA: gtag detected and available");
        setIsGtagAvailable(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (!checkGtag()) {
      // If not available, check periodically for a few seconds
      console.log(
        "GA: gtag not immediately available, checking periodically..."
      );
      let attempts = 0;
      const maxAttempts = 20; // 4 seconds total

      const interval = setInterval(() => {
        attempts++;
        if (checkGtag() || attempts >= maxAttempts) {
          clearInterval(interval);
          if (attempts >= maxAttempts) {
            console.log("GA: gtag not detected after waiting");
          }
        }
      }, 200); // Check every 200ms
    }
  }, []);

  // Send a page_view event whenever the analyzed URL changes
  useEffect(() => {
    console.log("GA: page_view effect triggered", {
      currentUrl,
      isGtagAvailable,
    });

    if (!currentUrl || !isGtagAvailable) {
      console.log("GA: Skipping page_view - missing requirements", {
        currentUrl: !!currentUrl,
        isGtagAvailable,
      });
      return;
    }

    try {
      const urlObj = new URL(currentUrl);
      const params = parseTrackingParams(currentUrl);

      console.log("GA: Sending page_view event", { currentUrl, params });

      // Send page_view with UTM parameters
      window.gtag("event", "page_view", {
        page_path: urlObj.pathname + urlObj.search,
        page_location: currentUrl,
        page_title: `UTM Demo - ${currentUrl}`,
        // Add UTM parameters as custom dimensions
        campaign_source: params.utm_source,
        campaign_medium: params.utm_medium,
        campaign_name: params.utm_campaign,
        campaign_term: params.utm_term,
        campaign_content: params.utm_content,
        campaign_id: params.utm_id,
      });
      console.log(`GA: Successfully sent page_view for: ${currentUrl}`, params);
      setLastEventSent("page_view");
    } catch (error: unknown) {
      console.error("GA Error: Failed to send page_view.", error);
    }
  }, [currentUrl, isGtagAvailable]);

  const handleSimulate = () => {
    setCurrentUrl(urlInput);
    setAnalyzedParams(parseTrackingParams(urlInput));
  };

  const handleSendCustomEvent = () => {
    if (!isGtagAvailable) {
      alert(
        "Google Analytics not loaded. Make sure NEXT_PUBLIC_GA_MEASUREMENT_ID is set."
      );
      return;
    }

    const eventName = "utm_demo_conversion";

    // Format UTM parameters for GA4
    const eventParams: Record<string, string | undefined> = {
      event_category: "UTM Demo",
      event_label: "Simulated Conversion",
      // Standard GA4 campaign parameters
      campaign_source: analyzedParams.utm_source,
      campaign_medium: analyzedParams.utm_medium,
      campaign_name: analyzedParams.utm_campaign,
      campaign_term: analyzedParams.utm_term,
      campaign_content: analyzedParams.utm_content,
      campaign_id: analyzedParams.utm_id,
      // Additional tracking parameters as custom parameters
      gclid: analyzedParams.gclid,
      fbclid: analyzedParams.fbclid,
      mc_cid: analyzedParams.mc_cid,
    };

    // Remove undefined values
    Object.keys(eventParams).forEach((key) => {
      if (eventParams[key] === undefined) {
        delete eventParams[key];
      }
    });

    window.gtag("event", eventName, eventParams);
    console.log(
      `GA: Sent custom event '${eventName}' with params:`,
      eventParams
    );
    setLastEventSent(eventName);
    alert(
      `Custom event '${eventName}' sent to GA! Check the console and your GA Realtime reports.`
    );
  };

  const handleExampleClick = (url: string) => {
    setUrlInput(url);
    setCurrentUrl(url);
    setAnalyzedParams(parseTrackingParams(url));
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            UTM & Ad Parameter Simulator
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            See how marketing parameters are extracted from a URL and sent to
            analytics. Paste a URL or use an example to get started.
          </p>
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
                    placeholder="e.g., https://yourwebsite.com/?utm_source=google"
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
                  <span>Google Analytics Events</span>
                </CardTitle>
                <CardDescription>
                  This simulates events sent to GA. Check your GA Realtime
                  dashboard to see them appear.
                  {!isGtagAvailable && (
                    <span className="text-yellow-500 block mt-1">
                      GA not detected. Events will only be logged to the
                      console.
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Button
                  onClick={handleSendCustomEvent}
                  size="lg"
                  className="w-full"
                  disabled={!isGtagAvailable}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Send Conversion Event
                </Button>
                {lastEventSent && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Last event sent to GA:
                    <span className="font-semibold ml-1">{lastEventSent}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
