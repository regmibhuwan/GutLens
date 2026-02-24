"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Leaf,
  Clock,
  ChefHat,
  Lightbulb,
  Heart,
  Save,
  Share2,
  ArrowLeft,
  AlertTriangle,
  Hand,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FoodAnalysis } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AnalysisResultsProps {
  analysis: FoodAnalysis;
  imageDataUrl: string;
  onReset: () => void;
}

const SAFETY_CONFIG = {
  Green: {
    icon: ShieldCheck,
    label: "Safe to Eat",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    gauge: "bg-emerald-500",
    badgeVariant: "green" as const,
  },
  Yellow: {
    icon: ShieldAlert,
    label: "Eat with Caution",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    gauge: "bg-amber-500",
    badgeVariant: "yellow" as const,
  },
  Red: {
    icon: ShieldX,
    label: "Likely Trigger",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    gauge: "bg-red-500",
    badgeVariant: "red" as const,
  },
};

export function AnalysisResults({
  analysis,
  imageDataUrl,
  onReset,
}: AnalysisResultsProps) {
  const { addToHistory } = useAppStore();
  const safety = SAFETY_CONFIG[analysis.safetyRating];
  const SafetyIcon = safety.icon;

  const gaugeWidth =
    analysis.safetyRating === "Green"
      ? "33%"
      : analysis.safetyRating === "Yellow"
      ? "66%"
      : "100%";

  const handleSave = () => {
    addToHistory({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      imageDataUrl,
      analysis,
    });
    toast.success("Saved to history!");
  };

  const handleShare = async () => {
    const text = `🔍 GutLens Analysis: ${analysis.foodName}\n${
      analysis.safetyRating === "Green"
        ? "✅"
        : analysis.safetyRating === "Yellow"
        ? "⚠️"
        : "🔴"
    } ${safety.label}\n📏 Safe portion: ${analysis.safePortion}\n${analysis.ratingExplanation}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "GutLens Result", text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Back button */}
      <motion.div variants={item}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="mb-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Scan Again
        </Button>
      </motion.div>

      {/* Hero: Image + Food Name + Safety */}
      <motion.div variants={item}>
        <Card className={cn("overflow-hidden border-2", safety.border)}>
          <div className="relative">
            <img
              src={imageDataUrl}
              alt={analysis.foodName}
              className="aspect-video w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5 pt-16">
              <Badge variant={safety.badgeVariant} className="mb-2">
                {safety.label}
              </Badge>
              <h2 className="text-2xl font-bold text-white">
                {analysis.foodName}
              </h2>
              <p className="mt-1 text-sm text-white/80">
                {analysis.confidence}% confidence
              </p>
            </div>
          </div>

          <CardContent className="p-5">
            {/* Safety Gauge */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SafetyIcon className={cn("h-5 w-5", safety.color)} />
                  <span
                    className={cn("text-sm font-semibold", safety.color)}
                  >
                    {safety.label}
                  </span>
                </div>
              </div>

              {/* Gauge bar */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-sage-100 dark:bg-sage-800">
                <motion.div
                  className={cn("gauge-fill h-full rounded-full", safety.gauge)}
                  initial={{ width: "0%" }}
                  animate={{ width: gaugeWidth }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-sage-400">
                <span>Safe</span>
                <span>Caution</span>
                <span>Avoid</span>
              </div>
            </div>

            <p className="text-sm text-sage-700 dark:text-sage-300">
              {analysis.ratingExplanation}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* FODMAP Breakdown */}
      {analysis.fodmapBreakdown.length > 0 && (
        <motion.div variants={item}>
          <Card>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-sage-500" />
                <h3 className="text-sm font-semibold text-sage-800 dark:text-sage-100">
                  FODMAP Breakdown
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.fodmapBreakdown.map((item, i) => (
                  <Badge key={i} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Safe Portion */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-100 dark:bg-sage-800">
                <Hand className="h-5 w-5 text-sage-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-sage-800 dark:text-sage-100">
                  Safe Portion
                </h3>
                <p className="mt-0.5 text-lg font-bold text-sage-700 dark:text-sage-200">
                  {analysis.safePortion}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timing */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/30">
                <Clock className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-sage-800 dark:text-sage-100">
                  Best Timing & How
                </h3>
                <p className="mt-0.5 text-sm text-sage-600 dark:text-sage-400">
                  {analysis.bestTimingAndHow}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personalized Note */}
      <motion.div variants={item}>
        <Card className="border-sage-200 bg-sage-50 dark:border-sage-700 dark:bg-sage-800/50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Heart className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              <div>
                <h3 className="mb-1 text-sm font-semibold text-sage-800 dark:text-sage-100">
                  Personalized for You
                </h3>
                <p className="text-sm text-sage-600 dark:text-sage-400">
                  {analysis.personalizedNote}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Expandable Sections */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="px-5 py-2">
            <Accordion type="multiple" className="w-full">
              {/* Preparation Tips */}
              {analysis.preparationTips.length > 0 && (
                <AccordionItem value="tips">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <ChefHat className="h-4 w-4 text-sage-500" />
                      <span className="text-sm font-semibold">
                        Preparation Tips
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {analysis.preparationTips.map((tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sage-600 dark:text-sage-400"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Safer Alternatives */}
              {analysis.saferAlternatives.length > 0 && (
                <AccordionItem value="alternatives">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-semibold">
                        Safer Alternatives
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.saferAlternatives.map((alt, i) => (
                        <Badge key={i} variant="green">
                          {alt}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>

      {/* Encouraging Closing */}
      <motion.div variants={item}>
        <div className="rounded-2xl bg-gradient-to-r from-sage-100 to-teal-50 p-5 dark:from-sage-800/50 dark:to-teal-900/30">
          <p className="text-center text-sm font-medium text-sage-700 dark:text-sage-300">
            💚 {analysis.encouragingClosing}
          </p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={item} className="flex gap-3">
        <Button className="flex-1" onClick={handleSave}>
          <Save className="mr-1 h-4 w-4" />
          Save to History
        </Button>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Disclaimer */}
      <motion.div variants={item}>
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/10">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">
            This is an AI assistant tool, not medical advice. Results are
            based on visual analysis and may not be 100% accurate. Always
            consult your doctor or registered dietitian for personalized
            guidance.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
