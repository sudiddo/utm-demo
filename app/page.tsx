"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import UtmTracker from "@/components/utm-tracker";
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
import {
  Mail,
  BarChart3,
  Eye,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  MousePointer,
  Filter,
  Users,
  Target,
  Zap,
} from "lucide-react";
import { waitForGA, sendPageView, logCurrentUTMParams } from "@/lib/analytics";

interface UtmParams {
  [key: string]: string;
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const [detectedParams, setDetectedParams] = useState<UtmParams>({});
  const [isGaReady, setIsGaReady] = useState(false);
  const [showEmailCampaignInfo, setShowEmailCampaignInfo] = useState(false);

  useEffect(() => {
    const initializeTracking = async () => {
      // Extract UTM parameters
      const params: UtmParams = {};
      const utmKeys = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "mc_cid",
        "mc_eid",
      ];

      utmKeys.forEach((key) => {
        const value = searchParams.get(key);
        if (value) {
          params[key] = value;
        }
      });

      setDetectedParams(params);

      // Check if this is an email campaign
      const isEmailCampaign =
        params.utm_source === "newsletter" && params.utm_medium === "email";
      setShowEmailCampaignInfo(isEmailCampaign);

      // Wait for GA and send page view if parameters present
      if (Object.keys(params).length > 0) {
        const gaReady = await waitForGA();
        setIsGaReady(gaReady);

        if (gaReady) {
          sendPageView(
            window.location.href,
            "UTM Demo - Homepage with Campaign Parameters"
          );
          logCurrentUTMParams();
        }
      }
    };

    initializeTracking();
  }, [searchParams]);

  const expectedEmailParams = {
    utm_source: "newsletter",
    utm_medium: "email",
    utm_campaign: "weekly_deals_august",
    mc_cid: "a1b2c3d4e5",
  };

  if (showEmailCampaignInfo) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-orange-900 min-h-screen">
        <div className="max-w-6xl mx-auto p-6">
          {/* Email Campaign Header */}
          <div className="mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-lg border border-orange-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-8 h-8 text-orange-600" />
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                    Weekly Deals Newsletter
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Email Marketing Campaign Landing
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {isGaReady ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        GA4 Email Tracking Active
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                        GA4 Loading...
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This page visit is being tracked with email campaign data in
                  Google Analytics 4
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column: Campaign Details */}
            <div className="space-y-6">
              <Card className="shadow-lg border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-orange-600" />
                    Email Campaign Information
                  </CardTitle>
                  <CardDescription>
                    Data being tracked for this email marketing campaign
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parameter</TableHead>
                        <TableHead>Expected</TableHead>
                        <TableHead>Detected</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(expectedEmailParams).map(
                        ([key, expected]) => {
                          const detected = detectedParams[key];
                          const isPresent = !!detected;
                          return (
                            <TableRow key={key}>
                              <TableCell className="font-medium">
                                {key}
                              </TableCell>
                              <TableCell className="text-sm font-mono">
                                {expected}
                              </TableCell>
                              <TableCell className="text-sm font-mono">
                                {detected || "—"}
                              </TableCell>
                              <TableCell>
                                {isPresent ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    Email Tracking Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          Email Attribution
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Source: newsletter, Medium: email
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          Mailchimp Integration
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Campaign ID for precise email performance tracking
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          Campaign Performance
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          weekly_deals_august campaign tracking
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: GA4 Instructions */}
            <div className="space-y-6">
              <Card className="shadow-lg border-t-4 border-t-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-6 h-6 text-purple-600" />
                    How to View Email Data in GA4
                  </CardTitle>
                  <CardDescription>
                    Step-by-step instructions to find your email campaign
                    performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-300 pl-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                          1
                        </span>
                        Real-time Email Clicks
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        <span className="font-medium">Reports</span> →
                        <span className="font-medium">Realtime</span> → See
                        immediate clicks from email
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-300 pl-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                          2
                        </span>
                        Email Traffic Analysis
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        <span className="font-medium">Reports</span> →
                        <span className="font-medium">Acquisition</span> →
                        <span className="font-medium">Traffic acquisition</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Filter by Source/Medium: &ldquo;newsletter /
                        email&rdquo;
                      </p>
                    </div>

                    <div className="border-l-4 border-green-300 pl-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                          3
                        </span>
                        Email Campaign Performance
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        <span className="font-medium">Reports</span> →
                        <span className="font-medium">Acquisition</span> →
                        <span className="font-medium">User acquisition</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Look for campaign: &ldquo;weekly_deals_august&rdquo;
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-300 pl-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">
                          4
                        </span>
                        Email ROI Analysis
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        <span className="font-medium">Explore</span> → Create
                        custom reports comparing email campaigns
                      </p>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-sm">
                        Email Marketing Tips
                      </span>
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <li>• Track email open rates vs click-through rates</li>
                      <li>• Monitor email subscriber behavior patterns</li>
                      <li>• Compare newsletter performance over time</li>
                      <li>• Set up email conversion goals in GA4</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-6 h-6 text-green-600" />
                    Email Campaign Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Mail className="w-6 h-6 mx-auto text-orange-600 mb-2" />
                      <p className="text-sm font-semibold">Open Rate</p>
                      <p className="text-xs text-slate-500">Email Opens</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <MousePointer className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                      <p className="text-sm font-semibold">Click Rate</p>
                      <p className="text-xs text-slate-500">Link Clicks</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Users className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                      <p className="text-sm font-semibold">Subscribers</p>
                      <p className="text-xs text-slate-500">List Growth</p>
                    </div>
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <TrendingUp className="w-6 h-6 mx-auto text-green-600 mb-2" />
                      <p className="text-sm font-semibold">Conversions</p>
                      <p className="text-xs text-slate-500">Email ROI</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Newsletter Content Display (Mock) */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Mail className="w-8 h-8 text-orange-600" />
                Weekly Deals - August Edition
              </CardTitle>
              <CardDescription>
                Exclusive offers for our newsletter subscribers
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-orange-800 dark:text-orange-300 mb-2">
                  🎯 Newsletter Exclusive: 25% Off Everything!
                </h3>
                <p className="text-orange-700 dark:text-orange-400">
                  Use code: NEWSLETTER25 at checkout
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border-2 border-dashed border-orange-200 rounded-lg">
                  <div className="text-4xl mb-2">📱</div>
                  <h4 className="font-semibold">Tech Deals</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Up to 40% off electronics
                  </p>
                </div>
                <div className="p-4 border-2 border-dashed border-orange-200 rounded-lg">
                  <div className="text-4xl mb-2">👕</div>
                  <h4 className="font-semibold">Fashion Flash Sale</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Summer collection clearance
                  </p>
                </div>
                <div className="p-4 border-2 border-dashed border-orange-200 rounded-lg">
                  <div className="text-4xl mb-2">🏠</div>
                  <h4 className="font-semibold">Home & Garden</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Seasonal decorations & tools
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <UtmTracker />;
}

function LoadingFallback() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            UTM & Ad Parameter Tracker
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Loading campaign tracking system...
          </p>
        </header>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePageContent />
    </Suspense>
  );
}
