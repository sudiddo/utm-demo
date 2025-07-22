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
  Sparkles,
  BarChart3,
  Eye,
  TrendingUp,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  MousePointer,
  Filter,
  Users,
  Target,
  Share2,
  Heart,
  Star,
} from "lucide-react";
import Link from "next/link";
import { waitForGA, sendPageView, logCurrentUTMParams } from "@/lib/analytics";

interface UtmParams {
  [key: string]: string;
}

export default function EarlyAccessPage() {
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
        "fbclid",
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
          "Early Access - Fashion Lookbook Landing"
        );
        logCurrentUTMParams();
      }
    };

    initializeTracking();
  }, [searchParams]);

  const expectedParams = {
    utm_source: "facebook",
    utm_medium: "social_paid",
    utm_campaign: "q3_lookbook",
    fbclid: "IwAR2-gT8DqXkP6A",
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-100 dark:from-slate-900 dark:to-purple-900 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to UTM Tracker
            </Button>
          </Link>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-lg border border-pink-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="w-8 h-8 text-pink-600" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                  Early Access - Q3 Fashion Lookbook
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Facebook Campaign Landing Page
                </p>
              </div>
            </div>

            <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
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
                This page is automatically sending social media campaign data to
                Google Analytics 4
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Campaign Details */}
          <div className="space-y-6">
            <Card className="shadow-lg border-l-4 border-l-pink-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-pink-600" />
                  Social Campaign Information
                </CardTitle>
                <CardDescription>
                  Data being tracked for this Facebook advertising campaign
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
                        Automatically captures all social media parameters
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">
                        Social Media Attribution
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Source: Facebook, Medium: social_paid, Campaign:
                        q3_lookbook
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Facebook Click ID</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        FBCLID for precise ad performance and conversion
                        tracking
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
                  Step-by-step instructions to find your social media campaign
                  data
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
                      this page visit with Facebook source
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-300 pl-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                        2
                      </span>
                      Social Media Traffic (24-48h)
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      <span className="font-medium">Reports</span> →
                      <span className="font-medium">Acquisition</span> →
                      <span className="font-medium">Traffic acquisition</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Filter by Source/Medium: &ldquo;facebook /
                      social_paid&rdquo;
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
                      Look for campaign: &ldquo;q3_lookbook&rdquo;
                    </p>
                  </div>

                  <div className="border-l-4 border-pink-300 pl-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span className="bg-pink-100 text-pink-800 text-xs font-bold px-2 py-1 rounded">
                        4
                      </span>
                      Social Media Insights
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      <span className="font-medium">Reports</span> →
                      <span className="font-medium">Acquisition</span> →
                      <span className="font-medium">User acquisition</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Add &ldquo;Social network&rdquo; as secondary dimension
                    </p>
                  </div>
                </div>

                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-pink-600" />
                    <span className="font-semibold text-sm">
                      Social Media Tips
                    </span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• Facebook data includes demographic insights</li>
                    <li>• FBCLID enables precise conversion attribution</li>
                    <li>• Compare organic vs paid social performance</li>
                    <li>• Monitor engagement rate and bounce rate</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-6 h-6 text-green-600" />
                  Social Media Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Users className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                    <p className="text-sm font-semibold">Audience</p>
                    <p className="text-xs text-slate-500">
                      Demographics & Interests
                    </p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <MousePointer className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                    <p className="text-sm font-semibold">Engagement</p>
                    <p className="text-xs text-slate-500">
                      Clicks & Interactions
                    </p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Share2 className="w-6 h-6 mx-auto text-pink-600 mb-2" />
                    <p className="text-sm font-semibold">Reach</p>
                    <p className="text-xs text-slate-500">
                      Impressions & Share
                    </p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <TrendingUp className="w-6 h-6 mx-auto text-orange-600 mb-2" />
                    <p className="text-sm font-semibold">Conversions</p>
                    <p className="text-xs text-slate-500">Actions & Goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fashion Lookbook Display (Mock) */}
        <Card className="mt-8 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8" />
              Q3 Fashion Lookbook - Early Access
            </CardTitle>
            <CardDescription>
              Be the first to discover our latest collection
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="bg-gradient-to-br from-pink-400 to-rose-600 h-40 rounded-lg mb-3 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold">Summer Elegance</h3>
                <p className="text-sm text-slate-600">
                  Flowing dresses & light fabrics
                </p>
                <div className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 h-40 rounded-lg mb-3 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold">Urban Chic</h3>
                <p className="text-sm text-slate-600">
                  Modern city style essentials
                </p>
                <div className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="bg-gradient-to-br from-teal-400 to-blue-600 h-40 rounded-lg mb-3 flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold">Weekend Casual</h3>
                <p className="text-sm text-slate-600">
                  Comfortable & stylish basics
                </p>
                <div className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center mt-8">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                Get Early Access
              </Button>
              <Button variant="outline" size="lg">
                Join Waitlist
              </Button>
            </div>
            <p className="text-sm text-slate-500 mt-4">
              🎉 Limited time offer - First 100 customers get 20% off
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
