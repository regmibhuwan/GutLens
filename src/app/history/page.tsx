"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Trash2,
  ChevronRight,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { AnalysisResults } from "@/components/scanner/AnalysisResults";
import type { ScanHistoryItem } from "@/lib/types";
import { toast } from "sonner";

const SAFETY_ICONS = {
  Green: ShieldCheck,
  Yellow: ShieldAlert,
  Red: ShieldX,
};

const SAFETY_BADGE: Record<string, "green" | "yellow" | "red"> = {
  Green: "green",
  Yellow: "yellow",
  Red: "red",
};

export default function HistoryPage() {
  const { history, removeFromHistory, clearHistory, hydrated } = useAppStore();
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = history.filter((item) =>
    item.analysis.foodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sage-300 border-t-sage-600" />
      </div>
    );
  }

  // Show detail view
  if (selectedItem) {
    return (
      <div className="mx-auto max-w-lg px-5 pt-6 pb-8">
        <AnalysisResults
          analysis={selectedItem.analysis}
          imageDataUrl={selectedItem.imageDataUrl}
          onReset={() => setSelectedItem(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 pt-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-sage-800 dark:text-sage-100">
              Scan History
            </h1>
            <p className="text-sm text-sage-500 dark:text-sage-400">
              {history.length} scan{history.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => {
                clearHistory();
                toast.success("History cleared");
              }}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Search */}
        {history.length > 0 && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sage-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scans..."
              className="w-full rounded-xl border border-sage-200 bg-white py-2.5 pl-10 pr-4 text-sm text-sage-800 placeholder-sage-400 transition-colors focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200 dark:border-sage-700 dark:bg-sage-800 dark:text-sage-100 dark:placeholder-sage-500"
            />
          </div>
        )}

        {/* Empty State */}
        {history.length === 0 && (
          <div className="flex flex-col items-center py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 dark:bg-sage-800">
              <Clock className="h-8 w-8 text-sage-400" />
            </div>
            <h2 className="mb-1 text-lg font-semibold text-sage-700 dark:text-sage-200">
              No scans yet
            </h2>
            <p className="mb-6 text-sm text-sage-500 dark:text-sage-400">
              Your scan results will appear here
            </p>
            <Button asChild>
              <a href="/scan">Start Scanning</a>
            </Button>
          </div>
        )}

        {/* History Grid */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredHistory.map((item, index) => {
              const SafetyIcon = SAFETY_ICONS[item.analysis.safetyRating];
              const badgeVariant = SAFETY_BADGE[item.analysis.safetyRating];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="group cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setSelectedItem(item)}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3 p-3">
                        {/* Thumbnail */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                          <img
                            src={item.imageDataUrl}
                            alt={item.analysis.foodName}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate font-semibold text-sage-800 dark:text-sage-100">
                              {item.analysis.foodName}
                            </h3>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant={badgeVariant} className="text-[10px]">
                              <SafetyIcon className="mr-0.5 h-3 w-3" />
                              {item.analysis.safetyRating}
                            </Badge>
                            <span className="text-xs text-sage-400">
                              {new Date(item.timestamp).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs text-sage-500 dark:text-sage-400">
                            {item.analysis.safePortion}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromHistory(item.id);
                              toast.success("Removed from history");
                            }}
                            className="rounded-lg p-2 text-sage-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <ChevronRight className="h-4 w-4 text-sage-300 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Disclaimer */}
        {history.length > 0 && (
          <div className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-3 dark:bg-amber-900/10">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              Past results are for reference only. Food safety can vary by
              brand, preparation, and your current health state.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
