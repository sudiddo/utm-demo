// Google Analytics utility functions
type GtagParams = { [key: string]: string | number | undefined };

export const GA_MEASUREMENT_ID = "G-R64CF5TY9M";

// Check if GA is available - updated for @next/third-parties
export const isGAAvailable = (): boolean => {
  return (
    typeof window !== "undefined" &&
    typeof window.gtag === "function" &&
    window.dataLayer &&
    Array.isArray(window.dataLayer)
  );
};

// Wait for GA to be available - optimized for @next/third-parties
export const waitForGA = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isGAAvailable()) {
      resolve(true);
      return;
    }

    let attempts = 0;
    const maxAttempts = 100; // 20 seconds total (more time for @next/third-parties)

    const interval = setInterval(() => {
      attempts++;
      if (isGAAvailable() || attempts >= maxAttempts) {
        clearInterval(interval);
        resolve(isGAAvailable());
      }
    }, 200);
  });
};

// Send page view event - GA4 automatically captures UTM parameters from URL
export const sendPageView = (url: string, title?: string): void => {
  if (!isGAAvailable()) {
    console.warn("GA: gtag not available for page view");
    return;
  }

  try {
    const urlObj = new URL(url);
    window.gtag("event", "page_view", {
      page_title: title || document.title,
      page_location: url,
      page_path: urlObj.pathname + urlObj.search,
    });
    console.log("GA: Page view sent", { url, title });
  } catch (error) {
    console.error("GA: Error sending page view", error);
  }
};

// Send custom event
export const sendEvent = (
  eventName: string,
  parameters: GtagParams = {}
): void => {
  if (!isGAAvailable()) {
    console.warn("GA: gtag not available for event", eventName);
    return;
  }

  try {
    window.gtag("event", eventName, parameters);
    console.log(`GA: Event '${eventName}' sent`, parameters);
  } catch (error) {
    console.error(`GA: Error sending event '${eventName}'`, error);
  }
};

// Send conversion event - GA4 automatically associates UTM data with events
export const sendConversion = (
  eventName: string,
  additionalParams: Record<string, string | number> = {}
): void => {
  const eventParams: GtagParams = {
    event_category: "UTM Demo",
    event_label: "Simulated Conversion",
    value: 1,
    ...additionalParams,
  };

  // Note: GA4 automatically captures UTM parameters from the URL
  // No need to manually add campaign parameters - they're already tracked
  console.log(
    "GA: Sending conversion event. UTM parameters are automatically tracked by GA4 from the current URL."
  );

  sendEvent(eventName, eventParams);
};

// Log current UTM parameters from URL for demonstration
export const logCurrentUTMParams = (): Record<string, string> => {
  const utmParams: Record<string, string> = {};

  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);

    // Standard UTM parameters
    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "utm_id",
    ];

    utmKeys.forEach((key) => {
      const value = urlParams.get(key);
      if (value) {
        utmParams[key] = value;
      }
    });

    if (Object.keys(utmParams).length > 0) {
      console.log("GA: Current UTM parameters detected:", utmParams);
      console.log(
        "GA: These are automatically tracked by GA4 - no manual configuration needed"
      );
    }
  }

  return utmParams;
};

// Check if @next/third-parties GoogleAnalytics is ready
export const isThirdPartyGAReady = (): boolean => {
  return (
    isGAAvailable() &&
    // Additional check for @next/third-parties specific setup
    typeof window !== "undefined" &&
    document.querySelector('script[src*="googletagmanager.com/gtag/js"]') !==
      null
  );
};

// Enhanced logging for UTM parameter debugging
export const debugUTMTracking = (): void => {
  if (!isGAAvailable()) {
    console.warn("GA: Google Analytics not available for UTM debugging");
    return;
  }

  const currentUTMs = logCurrentUTMParams();

  console.log("=== UTM Debug Info ===");
  console.log("Current URL:", window.location.href);
  console.log("Detected UTM parameters:", currentUTMs);
  console.log("GA4 Status:", isGAAvailable() ? "Ready" : "Not Ready");
  console.log("Note: GA4 automatically tracks UTM parameters from page URLs");
  console.log(
    "Check GA4 Reports > Acquisition > Traffic Acquisition for UTM data"
  );
  console.log("====================");
};
