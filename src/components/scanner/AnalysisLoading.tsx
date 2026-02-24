"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Search, ShieldCheck, Heart } from "lucide-react";

const LOADING_STEPS = [
  { icon: Search, text: "Identifying food...", color: "text-sage-500" },
  {
    icon: Leaf,
    text: "Checking Monash FODMAP levels...",
    color: "text-teal-500",
  },
  {
    icon: ShieldCheck,
    text: "Evaluating safety for your IBS type...",
    color: "text-sage-600",
  },
  {
    icon: Heart,
    text: "Personalizing advice...",
    color: "text-rose-400",
  },
];

export function AnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) =>
        prev < LOADING_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center py-12">
      {/* Animated spinner */}
      <div className="relative mb-8">
        <motion.div
          className="h-20 w-20 rounded-full border-4 border-sage-200 dark:border-sage-700"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 h-20 w-20 rounded-full border-4 border-transparent border-t-sage-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Leaf className="h-8 w-8 text-sage-500" />
        </div>
      </div>

      {/* Steps */}
      <div className="w-full max-w-xs space-y-3">
        {LOADING_STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isDone = i < currentStep;

          return (
            <AnimatePresence key={i}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: isDone || isActive ? 1 : 0.4,
                  x: 0,
                }}
                className="flex items-center gap-3"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isDone
                      ? "bg-sage-100 dark:bg-sage-800"
                      : isActive
                      ? "bg-sage-500/10 dark:bg-sage-500/20"
                      : "bg-sage-50 dark:bg-sage-800/50"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isDone
                        ? "text-sage-500"
                        : isActive
                        ? step.color
                        : "text-sage-300 dark:text-sage-600"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm ${
                    isActive
                      ? "font-medium text-sage-800 dark:text-sage-100"
                      : isDone
                      ? "text-sage-500 dark:text-sage-400"
                      : "text-sage-400 dark:text-sage-600"
                  }`}
                >
                  {step.text}
                </span>
                {isActive && (
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-sage-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-sage-400 dark:text-sage-500">
        This usually takes 5–10 seconds
      </p>
    </div>
  );
}
