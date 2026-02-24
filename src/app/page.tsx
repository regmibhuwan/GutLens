"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  Upload,
  ScanBarcode,
  Video,
  Shield,
  Sparkles,
  Heart,
  Leaf,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const SCAN_OPTIONS = [
  {
    icon: Camera,
    label: "Live Camera",
    desc: "Point & snap",
    tab: "camera",
    color: "bg-sage-500 text-white",
  },
  {
    icon: Video,
    label: "Video",
    desc: "Record & analyze",
    tab: "video",
    color: "bg-teal-500 text-white",
  },
  {
    icon: Upload,
    label: "Upload",
    desc: "Image or video",
    tab: "upload",
    color: "bg-warm-400 text-sage-800",
  },
  {
    icon: ScanBarcode,
    label: "Barcode",
    desc: "Scan package",
    tab: "barcode",
    color: "bg-sage-700 text-white",
  },
];

const TRUST_BADGES = [
  { icon: Shield, text: "Monash FODMAP based" },
  { icon: Sparkles, text: "Powered by GPT-4o" },
  { icon: Heart, text: "Made for IBS warriors" },
  { icon: Leaf, text: "Evidence-based advice" },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-sage-200/40 blur-3xl dark:bg-sage-800/20" />
        <div className="absolute top-60 -left-40 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-900/20" />
        <div className="absolute bottom-20 right-10 h-60 w-60 rounded-full bg-warm-200/30 blur-3xl dark:bg-warm-500/10" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-lg px-5 pt-12 pb-8"
      >
        {/* Logo & Header */}
        <motion.div variants={item} className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sage-100 px-4 py-1.5 text-sm font-medium text-sage-700 dark:bg-sage-800 dark:text-sage-300">
            <Leaf className="h-4 w-4" />
            AI-Powered IBS Food Scanner
          </div>

          <h1 className="mb-3 text-4xl font-bold tracking-tight text-sage-800 dark:text-sage-100">
            Gut
            <span className="text-sage-500">Lens</span>
          </h1>

          <p className="text-lg leading-relaxed text-sage-600 dark:text-sage-400">
            See clearly.{" "}
            <span className="font-semibold text-sage-700 dark:text-sage-300">
              Eat safely
            </span>{" "}
            with IBS.
          </p>

          <p className="mt-2 text-sm text-sage-500 dark:text-sage-500">
            Snap a photo, scan a barcode, or upload — get instant,
            personalized FODMAP guidance.
          </p>
        </motion.div>

        {/* Quick-Start Grid */}
        <motion.div variants={item} className="mb-8">
          <div className="grid grid-cols-2 gap-3">
            {SCAN_OPTIONS.map((opt) => (
              <Link
                key={opt.tab}
                href={`/scan?tab=${opt.tab}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Card className="group cursor-pointer border-sage-100 transition-all hover:shadow-md dark:border-sage-800 dark:hover:border-sage-700">
                    <CardContent className="flex flex-col items-center gap-2 p-5">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${opt.color} shadow-sm transition-transform group-hover:scale-110`}
                      >
                        <opt.icon className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-sage-800 dark:text-sage-100">
                          {opt.label}
                        </p>
                        <p className="text-xs text-sage-500 dark:text-sage-400">
                          {opt.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Primary CTA */}
        <motion.div variants={item} className="mb-10">
          <Link href="/scan">
            <Button size="xl" className="w-full group">
              Start Scanning
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* How It Works */}
        <motion.div variants={item} className="mb-10">
          <h2 className="mb-4 text-center text-lg font-semibold text-sage-700 dark:text-sage-200">
            How it works
          </h2>
          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "Snap or Scan",
                desc: "Take a photo, record video, upload an image, or scan a barcode.",
              },
              {
                step: "2",
                title: "AI Analyzes",
                desc: "Dr. Lena identifies the food and checks FODMAP levels for your IBS type.",
              },
              {
                step: "3",
                title: "Eat Confidently",
                desc: "Get a clear safety rating, safe portion, prep tips & alternatives.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="flex items-start gap-4 rounded-2xl bg-white/60 p-4 dark:bg-sage-800/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-500 text-sm font-bold text-white">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-sage-800 dark:text-sage-100">
                    {s.title}
                  </p>
                  <p className="text-sm text-sage-600 dark:text-sage-400">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div variants={item} className="mb-8">
          <div className="grid grid-cols-2 gap-2.5">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 rounded-xl bg-sage-50 px-3 py-2.5 dark:bg-sage-800/50"
              >
                <badge.icon className="h-4 w-4 text-sage-500" />
                <span className="text-xs font-medium text-sage-600 dark:text-sage-400">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div variants={item} className="mb-8">
          <Card className="overflow-hidden border-sage-100 dark:border-sage-800">
            <CardContent className="p-5">
              <h3 className="mb-3 text-base font-semibold text-sage-800 dark:text-sage-100">
                What you get with every scan
              </h3>
              <div className="space-y-2.5">
                {[
                  "Green / Yellow / Red safety rating",
                  "FODMAP breakdown by category",
                  "Safe portion size for your IBS type",
                  "Preparation tips to reduce triggers",
                  "Better alternatives if it's risky",
                  "Warm, encouraging advice from Dr. Lena",
                ].map((feat) => (
                  <div key={feat} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage-500" />
                    <span className="text-sm text-sage-600 dark:text-sage-400">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Setup Profile CTA */}
        <motion.div variants={item} className="mb-6 text-center">
          <Link href="/profile">
            <Button variant="outline" size="lg">
              <Heart className="h-4 w-4 text-rose-400" />
              Set Up Your IBS Profile
            </Button>
          </Link>
          <p className="mt-2 text-xs text-sage-500 dark:text-sage-500">
            Personalize results by sharing your IBS type & triggers
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div variants={item}>
          <p className="text-center text-[11px] leading-relaxed text-sage-400 dark:text-sage-600">
            GutLens is an AI assistant tool and does not provide medical
            advice. Always consult your doctor or registered dietitian for
            personalized guidance.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
