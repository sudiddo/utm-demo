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

// Enhanced UTM validation to detect potential "(not set)" causes
export const validateUTMAttribution = (): {
  hasRequiredUTMs: boolean;
  missingCritical: string[];
  warningMessages: string[];
  recommendations: string[];
} => {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  const missingCritical: string[] = [];

  if (typeof window === "undefined") {
    return {
      hasRequiredUTMs: false,
      missingCritical: [],
      warningMessages: [],
      recommendations: [],
    };
  }

  const urlParams = new URLSearchParams(window.location.search);

  // Check for critical UTM parameters
  const criticalParams = ["utm_source", "utm_medium", "utm_campaign"];
  criticalParams.forEach((param) => {
    if (!urlParams.get(param)) {
      missingCritical.push(param);
    }
  });

  // Detect potential "(not set)" scenarios
  if (missingCritical.length > 0) {
    warnings.push(
      `❌ Missing critical UTM parameters: ${missingCritical.join(", ")}`
    );
    warnings.push(
      `⚠️  This will likely result in "(not set)" values in GA4 acquisition reports`
    );

    recommendations.push(
      "Ensure all campaign URLs include utm_source, utm_medium, and utm_campaign"
    );
    recommendations.push(
      "Use a UTM builder tool to generate properly formatted campaign URLs"
    );
  }

  // Check for common UTM issues
  const source = urlParams.get("utm_source");
  const medium = urlParams.get("utm_medium");

  if (source === "direct" || medium === "direct") {
    warnings.push(
      `⚠️  Using 'direct' as utm_source or utm_medium can cause attribution confusion`
    );
    recommendations.push(
      "Use specific source names like 'google', 'facebook', 'newsletter' instead of 'direct'"
    );
  }

  if ((source && source.includes(" ")) || (medium && medium.includes(" "))) {
    warnings.push(
      `⚠️  UTM parameters contain spaces which may cause tracking issues`
    );
    recommendations.push(
      "Replace spaces with underscores or hyphens in UTM parameters"
    );
  }

  // Check session storage for previous UTM data
  try {
    const storedUTMs = sessionStorage.getItem("utm_params");
    if (!storedUTMs && missingCritical.length > 0) {
      warnings.push(
        `⚠️  No UTM parameters in URL and no stored campaign data from previous pages`
      );
      recommendations.push(
        "Consider implementing UTM parameter persistence across page navigation"
      );
    }
  } catch {
    // Session storage not available
  }

  return {
    hasRequiredUTMs: missingCritical.length === 0,
    missingCritical,
    warningMessages: warnings,
    recommendations,
  };
};

// Store UTM parameters in session storage to persist across navigation
export const persistUTMParameters = (): void => {
  if (typeof window === "undefined") return;

  const urlParams = new URLSearchParams(window.location.search);
  const utmData: Record<string, string> = {};

  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_id",
    "gclid",
    "fbclid",
    "msclkid",
  ];

  utmKeys.forEach((key) => {
    const value = urlParams.get(key);
    if (value) {
      utmData[key] = value;
      utmData[`${key}_timestamp`] = new Date().toISOString();
    }
  });

  if (Object.keys(utmData).length > 0) {
    try {
      sessionStorage.setItem("utm_params", JSON.stringify(utmData));
      console.log("GA: UTM parameters stored for session persistence", utmData);
    } catch (e) {
      console.warn("GA: Could not store UTM parameters in session storage", e);
    }
  }
};

// Retrieve stored UTM parameters
export const getStoredUTMParameters = (): Record<string, string> => {
  if (typeof window === "undefined") return {};

  try {
    const stored = sessionStorage.getItem("utm_params");
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.warn("GA: Could not retrieve stored UTM parameters", e);
    return {};
  }
};

// Send page view event - GA4 automatically captures UTM parameters from URL
export const sendPageView = (url: string, title?: string): void => {
  if (!isGAAvailable()) {
    console.warn("GA: gtag not available for page view");
    return;
  }

  try {
    const urlObj = new URL(url);

    // Validate UTM attribution before sending
    const validation = validateUTMAttribution();

    if (!validation.hasRequiredUTMs) {
      console.warn(
        "GA: Sending page_view without complete UTM data - may result in '(not set)' attribution"
      );
      validation.warningMessages.forEach((warning) =>
        console.warn(`GA: ${warning}`)
      );
      validation.recommendations.forEach((rec) =>
        console.info(`GA: 💡 ${rec}`)
      );
    }

    // Persist UTM parameters for session
    persistUTMParameters();

    window.gtag("event", "page_view", {
      page_title: title || document.title,
      page_location: url,
      page_path: urlObj.pathname + urlObj.search,
    });

    console.log("GA: Page view sent", {
      url,
      title,
      hasCompleteUTMs: validation.hasRequiredUTMs,
      missingCritical: validation.missingCritical,
    });
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
  const validation = validateUTMAttribution();

  const eventParams: GtagParams = {
    event_category: "UTM Demo",
    event_label: "Simulated Conversion",
    value: 1,
    // Add attribution validation data (convert boolean to number)
    has_complete_utms: validation.hasRequiredUTMs ? 1 : 0,
    missing_utm_count: validation.missingCritical.length,
    ...additionalParams,
  };

  // Log attribution warnings for conversions
  if (!validation.hasRequiredUTMs) {
    console.warn("GA: Conversion event sent without complete UTM attribution");
    console.warn(
      "GA: This conversion may show as '(not set)' in acquisition reports"
    );
    validation.warningMessages.forEach((warning) =>
      console.warn(`GA: ${warning}`)
    );
  }

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
    } else {
      console.warn("GA: ❌ NO UTM parameters detected in current URL");
      console.warn(
        "GA: ⚠️  This page view will likely show as '(not set)' in GA4 acquisition reports"
      );
      console.info(
        "GA: 💡 To fix this, ensure users access this page with UTM parameters in the URL"
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
  const storedUTMs = getStoredUTMParameters();
  const validation = validateUTMAttribution();

  console.log("=== UTM Debug Info ===");
  console.log("Current URL:", window.location.href);
  console.log("Detected UTM parameters:", currentUTMs);
  console.log("Stored UTM parameters:", storedUTMs);
  console.log("GA4 Status:", isGAAvailable() ? "Ready" : "Not Ready");

  console.log("\n--- Attribution Validation ---");
  console.log("Has Required UTMs:", validation.hasRequiredUTMs);
  console.log("Missing Critical Parameters:", validation.missingCritical);

  if (validation.warningMessages.length > 0) {
    console.log("\n--- Warnings ---");
    validation.warningMessages.forEach((warning) => console.warn(warning));
  }

  if (validation.recommendations.length > 0) {
    console.log("\n--- Recommendations ---");
    validation.recommendations.forEach((rec) => console.info(`💡 ${rec}`));
  }

  console.log("\n--- GA4 Reports Help ---");
  console.log("• Real-time: Reports > Realtime (immediate data)");
  console.log(
    "• Acquisition: Reports > Acquisition > Traffic Acquisition (24-48h delay)"
  );
  console.log("• To reduce '(not set)' values:");
  console.log(
    "  - Ensure all campaign URLs include utm_source, utm_medium, utm_campaign"
  );
  console.log("  - Wait 24-48 hours for full data processing");
  console.log(
    "  - Check that UTM parameters don't contain spaces or special characters"
  );
  console.log("====================");
};

// New function to diagnose "(not set)" issues specifically
export const diagnoseNotSetIssues = (): void => {
  console.log("=== '(not set)' Diagnosis ===");

  const validation = validateUTMAttribution();
  const hasUTMs = Object.keys(logCurrentUTMParams()).length > 0;

  if (!hasUTMs) {
    console.error("🔴 ISSUE FOUND: No UTM parameters detected");
    console.error(
      "   This will result in '(not set)' values in GA4 acquisition reports"
    );
    console.info(
      "✅ SOLUTION: Access this page with UTM parameters in the URL"
    );
    console.info(
      "   Example: ?utm_source=google&utm_medium=cpc&utm_campaign=test"
    );
  } else if (!validation.hasRequiredUTMs) {
    console.warn("🟡 PARTIAL ISSUE: Missing some critical UTM parameters");
    console.warn(`   Missing: ${validation.missingCritical.join(", ")}`);
    console.info(
      "✅ SOLUTION: Include all three: utm_source, utm_medium, utm_campaign"
    );
  } else {
    console.info(
      "✅ UTM parameters look good - should not cause '(not set)' issues"
    );
    console.info("   If you still see '(not set)' in GA4:");
    console.info("   1. Wait 24-48 hours for data processing");
    console.info("   2. Check the date range in your GA4 reports");
    console.info("   3. Verify your GA4 measurement ID is correct");
  }

  console.log("==============================");
};
