"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Camera,
  Video,
  Upload,
  ScanBarcode,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CameraCapture } from "@/components/scanner/CameraCapture";
import { VideoCapture } from "@/components/scanner/VideoCapture";
import { UploadCapture } from "@/components/scanner/UploadCapture";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { AnalysisLoading } from "@/components/scanner/AnalysisLoading";
import { AnalysisResults } from "@/components/scanner/AnalysisResults";
import { useAppStore } from "@/lib/store";
import type { FoodAnalysis } from "@/lib/types";
import { toast } from "sonner";

function ScannerContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "camera";
  const { profile } = useAppStore();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [captureDescription, setCaptureDescription] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(
    null
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleCapture = (imageDataUrl: string, description?: string) => {
    setCapturedImage(imageDataUrl);
    setCaptureDescription(description || "");
    setAnalysisResult(null);
  };

  const handleBarcodeScan = (barcode: string) => {
    toast.info(`Barcode detected: ${barcode}`, {
      description: "Taking a photo for AI analysis...",
    });
    // For barcode, we'll capture with the context of the barcode value
    setCaptureDescription(
      `This is a packaged food product with barcode: ${barcode}. Please identify the product and analyze it.`
    );
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl: capturedImage,
          ibsType: profile.ibsType,
          triggers: profile.triggers,
          description: captureDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysisResult(data.analysis);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error("Analysis failed", {
        description: message,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setCaptureDescription("");
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  // If we have results, show the results screen
  if (analysisResult && capturedImage) {
    return (
      <div className="mx-auto max-w-lg px-5 pt-6 pb-8">
        <AnalysisResults
          analysis={analysisResult}
          imageDataUrl={capturedImage}
          onReset={handleReset}
        />
      </div>
    );
  }

  // If analyzing, show loading
  if (isAnalyzing) {
    return (
      <div className="mx-auto max-w-lg px-5 pt-6 pb-8">
        <AnalysisLoading />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 pt-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-sage-800 dark:text-sage-100">
            Food Scanner
          </h1>
          <p className="text-sm text-sage-500 dark:text-sage-400">
            Choose how you want to scan your food
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid w-full grid-cols-4">
            <TabsTrigger value="camera" className="gap-1 text-xs">
              <Camera className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Photo</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="gap-1 text-xs">
              <Video className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Video</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-1 text-xs">
              <Upload className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="barcode" className="gap-1 text-xs">
              <ScanBarcode className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Barcode</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera">
            <CameraCapture onCapture={handleCapture} />
          </TabsContent>

          <TabsContent value="video">
            <VideoCapture onCapture={handleCapture} />
          </TabsContent>

          <TabsContent value="upload">
            <UploadCapture onCapture={handleCapture} />
          </TabsContent>

          <TabsContent value="barcode">
            <BarcodeScanner onScan={handleBarcodeScan} />
          </TabsContent>
        </Tabs>

        {/* Analyze Button (shows after capture) */}
        {capturedImage && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Button
              size="xl"
              className="w-full"
              onClick={handleAnalyze}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze with AI
            </Button>
            <p className="mt-2 text-center text-xs text-sage-400 dark:text-sage-500">
              Your image will be sent to our AI for FODMAP analysis
            </p>
          </motion.div>
        )}

        {/* Tips */}
        <div className="mt-6 rounded-xl bg-sage-50/80 p-4 dark:bg-sage-800/30">
          <p className="text-xs font-medium text-sage-600 dark:text-sage-400">
            📸 Tips for best results:
          </p>
          <ul className="mt-2 space-y-1 text-xs text-sage-500 dark:text-sage-500">
            <li>• Get close to the food for a clear shot</li>
            <li>• Good lighting helps AI identify ingredients</li>
            <li>• For packaged food, show the ingredient label</li>
            <li>• Multiple items? Try scanning each one</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage-300 border-t-sage-600" />
        </div>
      }
    >
      <ScannerContent />
    </Suspense>
  );
}
