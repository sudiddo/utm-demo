"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingBag,
  BarChart3,
  Eye,
  TrendingUp,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  MousePointer,
  Filter,
  Calendar,
  Users,
  Target,
} from "lucide-react";
import Link from "next/link";
import { waitForGA, sendPageView, logCurrentUTMParams } from "@/lib/analytics";

interface UtmParams {
  [key: string]: string;
}

export default function SummerSalePage() {
  const searchParams = useSearchParams();
  const [detectedParams, setDetectedParams] = useState<UtmParams>({});
  const [isGaReady, setIsGaReady] = useState(false);

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
        "gclid",
      ];

      utmKeys.forEach((key) => {
        const value = searchParams.get(key);
        if (value) {
          params[key] = value;
        }
      });

      setDetectedParams(params);

      // Wait for GA and send page view
      const gaReady = await waitForGA();
      setIsGaReady(gaReady);

      if (gaReady) {
        sendPageView(
          window.location.href,
          "Summer Sale - Products Landing Page"
        );
        logCurrentUTMParams();
      }
    };

    initializeTracking();
  }, [searchParams]);

  const expectedParams = {
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "summer_launch",
    utm_term: "beachwear",
    gclid: "Cj0KCQjwgNanBhDUARIsAkhg3di9nS9tC9W4ZzY0",
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to UTM Tracker
            </Button>
          </Link>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-lg border border-blue-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                  Summer Sale - Beachwear Collection
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Google Ads Campaign Landing Page
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {isGaReady ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      GA4 Tracking Active
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
                This page is automatically sending campaign data to Google
                Analytics 4
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Campaign Details */}
          <div className="space-y-6">
            <Card className="shadow-lg border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  Campaign Information
                </CardTitle>
                <CardDescription>
                  Data being tracked for this Google Ads campaign
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
                    {Object.entries(expectedParams).map(([key, expected]) => {
                      const detected = detectedParams[key];
                      const isPresent = !!detected;
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{key}</TableCell>
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
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  What Gets Tracked
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Page View Event</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Automatically captures all UTM parameters
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">
                        User Acquisition Data
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Source: Google, Medium: CPC, Campaign: summer_launch
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">
                        Google Ads Attribution
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        GCLID for precise ad performance tracking
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
                  How to View This Data in GA4
                </CardTitle>
                <CardDescription>
                  Step-by-step instructions to find your campaign data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-300 pl-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                        1
                      </span>
                      Real-time Data (Immediate)
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      <span className="font-medium">Reports</span> →
                      <span className="font-medium">Realtime</span> → Look for
                      this page visit
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-300 pl-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                        2
                      </span>
                      Traffic Acquisition (24-48h)
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      <span className="font-medium">Reports</span> →
                      <span className="font-medium">Acquisition</span> →
                      <span className="font-medium">Traffic acquisition</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Filter by Source/Medium: &ldquo;google / cpc&rdquo;
                    </p>
                  </div>

                  <div className="border-l-4 border-green-300 pl-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                        3
                      </span>
                      Campaign Performance
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      <span className="font-medium">Reports</span> →
                      <span className="font-medium">Acquisition</span> →
                      <span className="font-medium">User acquisition</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Look for campaign: &ldquo;summer_launch&rdquo;
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-300 pl-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">
                        4
                      </span>
                      Custom Dimensions (Advanced)
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      <span className="font-medium">Explore</span> → Create
                      custom report with UTM dimensions
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-sm">Pro Tips</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Data appears in Realtime immediately</li>
                    <li>• Full reports populate within 24-48 hours</li>
                    <li>• Use date ranges to isolate campaign periods</li>
                    <li>• Add secondary dimensions for deeper analysis</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-6 h-6 text-green-600" />
                  Key Metrics to Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Users className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                    <p className="text-sm font-semibold">Users</p>
                    <p className="text-xs text-slate-500">New vs Returning</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <MousePointer className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                    <p className="text-sm font-semibold">Sessions</p>
                    <p className="text-xs text-slate-500">Campaign Sessions</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Calendar className="w-6 h-6 mx-auto text-green-600 mb-2" />
                    <p className="text-sm font-semibold">Engagement</p>
                    <p className="text-xs text-slate-500">Time & Pages</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <TrendingUp className="w-6 h-6 mx-auto text-orange-600 mb-2" />
                    <p className="text-sm font-semibold">Conversions</p>
                    <p className="text-xs text-slate-500">Goals & Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Display (Mock) */}
        <Card className="mt-8 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              🏖️ Summer Beachwear Collection
            </CardTitle>
            <CardDescription>
              Premium beachwear for your perfect summer getaway
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 h-32 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-white font-bold">Swimsuit</span>
                </div>
                <h3 className="font-semibold">Designer Swimsuit</h3>
                <p className="text-sm text-slate-600">$89.99</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="bg-gradient-to-br from-teal-400 to-teal-600 h-32 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-white font-bold">Cover-up</span>
                </div>
                <h3 className="font-semibold">Beach Cover-up</h3>
                <p className="text-sm text-slate-600">$49.99</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 h-32 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-white font-bold">Accessories</span>
                </div>
                <h3 className="font-semibold">Beach Hat</h3>
                <p className="text-sm text-slate-600">$29.99</p>
              </div>
            </div>
            <Button className="mt-6" size="lg">
              Shop Summer Collection
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
