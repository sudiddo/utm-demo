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

// Send page view event
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

// Send conversion event with UTM parameters
export const sendConversion = (
  eventName: string,
  utmParams: Record<string, string> = {}
): void => {
  const eventParams: GtagParams = {
    event_category: "UTM Demo",
    event_label: "Simulated Conversion",
    value: 1,
  };

  // Add UTM parameters in GA4 format
  if (utmParams.utm_source) eventParams.campaign_source = utmParams.utm_source;
  if (utmParams.utm_medium) eventParams.campaign_medium = utmParams.utm_medium;
  if (utmParams.utm_campaign)
    eventParams.campaign_name = utmParams.utm_campaign;
  if (utmParams.utm_term) eventParams.campaign_term = utmParams.utm_term;
  if (utmParams.utm_content)
    eventParams.campaign_content = utmParams.utm_content;
  if (utmParams.utm_id) eventParams.campaign_id = utmParams.utm_id;

  // Add other tracking parameters
  if (utmParams.gclid) eventParams.gclid = utmParams.gclid;
  if (utmParams.fbclid) eventParams.fbclid = utmParams.fbclid;
  if (utmParams.mc_cid) eventParams.mc_cid = utmParams.mc_cid;

  sendEvent(eventName, eventParams);
};

// Configure GA with campaign parameters for proper attribution
export const configureWithCampaign = (
  utmParams: Record<string, string>
): void => {
  if (!isGAAvailable()) {
    console.warn("GA: gtag not available for config");
    return;
  }

  if (Object.keys(utmParams).length === 0) return;

  const configParams: GtagParams = {};

  if (utmParams.utm_source) configParams.campaign_source = utmParams.utm_source;
  if (utmParams.utm_medium) configParams.campaign_medium = utmParams.utm_medium;
  if (utmParams.utm_campaign)
    configParams.campaign_name = utmParams.utm_campaign;
  if (utmParams.utm_term) configParams.campaign_term = utmParams.utm_term;
  if (utmParams.utm_content)
    configParams.campaign_content = utmParams.utm_content;
  if (utmParams.utm_id) configParams.campaign_id = utmParams.utm_id;

  try {
    window.gtag("config", GA_MEASUREMENT_ID, configParams);
    console.log("GA: Config updated with campaign params", configParams);
  } catch (error) {
    console.error("GA: Error updating config", error);
  }
};

// New: Check if @next/third-parties GoogleAnalytics is ready
export const isThirdPartyGAReady = (): boolean => {
  return (
    isGAAvailable() &&
    // Additional check for @next/third-parties specific setup
    typeof window !== "undefined" &&
    document.querySelector('script[src*="googletagmanager.com/gtag/js"]') !==
      null
  );
};
