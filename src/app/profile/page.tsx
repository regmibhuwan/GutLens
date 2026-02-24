"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Heart,
  CheckCircle2,
  Download,
  Moon,
  Sun,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { COMMON_TRIGGERS, type IBSType } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const IBS_TYPES: { value: IBSType; label: string; desc: string; emoji: string }[] = [
  {
    value: "IBS-C",
    label: "IBS-C",
    desc: "Constipation-predominant",
    emoji: "🔵",
  },
  {
    value: "IBS-D",
    label: "IBS-D",
    desc: "Diarrhea-predominant",
    emoji: "🟠",
  },
  {
    value: "IBS-M",
    label: "IBS-M",
    desc: "Mixed type",
    emoji: "🟣",
  },
  {
    value: "Unsure",
    label: "Unsure",
    desc: "Not yet diagnosed",
    emoji: "⚪",
  },
];

export default function ProfilePage() {
  const { profile, setProfile, isDarkMode, toggleDarkMode, hydrated } =
    useAppStore();
  const [localName, setLocalName] = useState(profile.name);

  useEffect(() => {
    if (hydrated) {
      setLocalName(profile.name);
    }
  }, [hydrated, profile.name]);

  const toggleTrigger = (trigger: string) => {
    const current = profile.triggers;
    const next = current.includes(trigger)
      ? current.filter((t) => t !== trigger)
      : [...current, trigger];
    setProfile({ triggers: next });
  };

  const exportData = () => {
    const data = {
      profile,
      history: useAppStore.getState().history,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gutlens-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage-300 border-t-sage-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 pt-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-sage-800 dark:text-sage-100">
              Your Profile
            </h1>
            <p className="text-sm text-sage-500 dark:text-sage-400">
              Personalize your food safety results
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 dark:bg-sage-800">
            <User className="h-6 w-6 text-sage-500" />
          </div>
        </div>

        {/* Name */}
        <Card className="mb-4">
          <CardContent className="p-5">
            <label className="mb-2 block text-sm font-medium text-sage-700 dark:text-sage-300">
              Your name (optional)
            </label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={() => setProfile({ name: localName })}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-sage-800 placeholder-sage-400 transition-colors focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-sage-700 dark:bg-sage-800 dark:text-sage-100 dark:placeholder-sage-500 dark:focus:border-sage-600 dark:focus:ring-sage-700"
            />
          </CardContent>
        </Card>

        {/* IBS Type Selection */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-4 w-4 text-rose-400" />
              IBS Type
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="grid grid-cols-2 gap-2.5">
              {IBS_TYPES.map((type) => (
                <motion.button
                  key={type.value}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setProfile({ ibsType: type.value })}
                  className={cn(
                    "relative flex flex-col items-start gap-1 rounded-xl border-2 p-3.5 text-left transition-all",
                    profile.ibsType === type.value
                      ? "border-sage-500 bg-sage-50 dark:border-sage-400 dark:bg-sage-800/60"
                      : "border-sage-100 bg-white hover:border-sage-200 dark:border-sage-800 dark:bg-sage-900 dark:hover:border-sage-700"
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-lg">{type.emoji}</span>
                    {profile.ibsType === type.value && (
                      <CheckCircle2 className="h-4 w-4 text-sage-500" />
                    )}
                  </div>
                  <p className="font-semibold text-sage-800 dark:text-sage-100">
                    {type.label}
                  </p>
                  <p className="text-xs text-sage-500 dark:text-sage-400">
                    {type.desc}
                  </p>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Triggers */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Personal Triggers
            </CardTitle>
            <p className="text-xs text-sage-500 dark:text-sage-400">
              Select foods that tend to trigger your symptoms
            </p>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {COMMON_TRIGGERS.map((trigger) => {
                  const isActive = profile.triggers.includes(trigger);
                  return (
                    <motion.button
                      key={trigger}
                      layout
                      whileTap={{ scale: 0.93 }}
                      onClick={() => toggleTrigger(trigger)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                        isActive
                          ? "border-sage-500 bg-sage-500 text-white dark:bg-sage-400 dark:text-sage-900"
                          : "border-sage-200 bg-white text-sage-600 hover:border-sage-300 dark:border-sage-700 dark:bg-sage-800 dark:text-sage-300 dark:hover:border-sage-600"
                      )}
                    >
                      {isActive && "✓ "}
                      {trigger}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
            {profile.triggers.length > 0 && (
              <p className="mt-3 text-xs text-sage-500 dark:text-sage-400">
                {profile.triggers.length} trigger
                {profile.triggers.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mb-4">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="h-5 w-5 text-sage-500" />
                ) : (
                  <Sun className="h-5 w-5 text-sage-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-sage-700 dark:text-sage-200">
                    Dark Mode
                  </p>
                  <p className="text-xs text-sage-500 dark:text-sage-400">
                    Easier on the eyes at night
                  </p>
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Export */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <Button
              variant="outline"
              className="w-full"
              onClick={exportData}
            >
              <Download className="h-4 w-4" />
              Export All Data
            </Button>
            <p className="mt-2 text-center text-xs text-sage-500 dark:text-sage-400">
              Download your profile and scan history as JSON
            </p>
          </CardContent>
        </Card>

        {/* Current Profile Summary */}
        {(profile.ibsType !== "Unsure" || profile.triggers.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-sage-200 bg-sage-50 dark:border-sage-700 dark:bg-sage-800/50">
              <CardContent className="p-5">
                <p className="mb-2 text-sm font-semibold text-sage-700 dark:text-sage-200">
                  Your Profile Summary
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">{profile.ibsType}</Badge>
                  {profile.triggers.slice(0, 5).map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                  {profile.triggers.length > 5 && (
                    <Badge variant="outline">
                      +{profile.triggers.length - 5} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
