"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Heart,
  FlaskConical,
  Apple,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const LOW_FODMAP_SAFE = [
  "Blueberries",
  "Strawberries",
  "Oranges",
  "Grapes",
  "Bananas (firm)",
  "Carrots",
  "Cucumber",
  "Lettuce",
  "Bell peppers",
  "Tomatoes",
  "Potatoes",
  "Rice",
  "Oats",
  "Quinoa",
  "Eggs",
  "Chicken",
  "Fish",
  "Tofu (firm)",
  "Lactose-free milk",
  "Hard cheeses",
];

const HIGH_FODMAP_AVOID = [
  "Garlic",
  "Onion",
  "Wheat (large amounts)",
  "Apples",
  "Pears",
  "Watermelon",
  "Mango",
  "Mushrooms",
  "Cauliflower",
  "Honey",
  "High-fructose corn syrup",
  "Milk (regular)",
  "Soft cheeses",
  "Cashews",
  "Beans & lentils",
];

const FAQ_ITEMS = [
  {
    q: "What is IBS?",
    a: "Irritable Bowel Syndrome (IBS) is a common gut-brain disorder that affects the large intestine. Symptoms include abdominal pain, bloating, gas, diarrhea, and constipation. While not dangerous, it can significantly affect quality of life.",
  },
  {
    q: "What are FODMAPs?",
    a: "FODMAPs stands for Fermentable Oligosaccharides, Disaccharides, Monosaccharides, and Polyols. These are types of short-chain carbohydrates that are poorly absorbed in the small intestine and can cause digestive distress in people with IBS.",
  },
  {
    q: "What is the Low FODMAP Diet?",
    a: "Developed by Monash University, the Low FODMAP diet is a 3-phase elimination diet: 1) Restriction (2-6 weeks), 2) Reintroduction (testing each FODMAP group), 3) Personalization (your long-term balanced diet). It's the most evidence-based dietary approach for managing IBS symptoms.",
  },
  {
    q: "How does GutLens help?",
    a: "GutLens uses AI to quickly identify foods and assess their FODMAP levels based on Monash University research. It gives you a quick safety check, safe portion sizes, preparation tips, and alternatives — like having a dietitian in your pocket.",
  },
  {
    q: "Is the Low FODMAP diet forever?",
    a: "No! The restriction phase is temporary (2-6 weeks). The goal is to reintroduce foods and find YOUR personal tolerance levels. Most people can enjoy many foods in moderate portions. GutLens helps you navigate this journey.",
  },
  {
    q: "Can I trust the AI ratings?",
    a: "GutLens provides helpful guidance based on established FODMAP research, but it's an AI tool — not a replacement for a qualified dietitian. Always consult with your healthcare provider, especially when starting a new dietary approach.",
  },
];

const FODMAP_GROUPS = [
  {
    letter: "F",
    name: "Fermentable",
    desc: "These carbs are fermented by gut bacteria, producing gas",
    icon: FlaskConical,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    letter: "O",
    name: "Oligosaccharides",
    desc: "Fructans & GOS — found in wheat, garlic, onion, legumes",
    icon: Leaf,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    letter: "D",
    name: "Disaccharides",
    desc: "Lactose — found in milk, soft cheese, yogurt",
    icon: HelpCircle,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    letter: "M",
    name: "Monosaccharides",
    desc: "Excess fructose — found in honey, apples, mangoes",
    icon: Apple,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    letter: "P",
    name: "Polyols",
    desc: "Sorbitol & mannitol — found in stone fruits, artificial sweeteners",
    icon: AlertTriangle,
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  },
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-lg px-5 pt-8 pb-8">
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={item} className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-100 dark:bg-sage-800">
              <BookOpen className="h-5 w-5 text-sage-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sage-800 dark:text-sage-100">
                Learn
              </h1>
              <p className="text-sm text-sage-500 dark:text-sage-400">
                IBS & FODMAP essentials
              </p>
            </div>
          </div>
        </motion.div>

        {/* FODMAP Explainer */}
        <motion.div variants={item} className="mb-4">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sage-50 to-teal-50 pb-3 dark:from-sage-800/50 dark:to-teal-900/30">
              <CardTitle className="text-base">
                What does FODMAP mean?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {FODMAP_GROUPS.map((group) => {
                  return (
                    <div key={group.letter} className="flex items-start gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${group.color}`}
                      >
                        {group.letter}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-sage-800 dark:text-sage-100">
                          {group.name}
                        </p>
                        <p className="text-xs text-sage-500 dark:text-sage-400">
                          {group.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Safe Foods */}
        <motion.div variants={item} className="mb-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Low FODMAP Friendly
              </CardTitle>
              <p className="text-xs text-sage-500 dark:text-sage-400">
                Generally safe in normal portions
              </p>
            </CardHeader>
            <CardContent className="pb-5">
              <div className="flex flex-wrap gap-1.5">
                {LOW_FODMAP_SAFE.map((food) => (
                  <Badge key={food} variant="green" className="text-[11px]">
                    {food}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* High FODMAP */}
        <motion.div variants={item} className="mb-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <XCircle className="h-4 w-4 text-red-500" />
                High FODMAP — Watch Portions
              </CardTitle>
              <p className="text-xs text-sage-500 dark:text-sage-400">
                May trigger symptoms in larger amounts
              </p>
            </CardHeader>
            <CardContent className="pb-5">
              <div className="flex flex-wrap gap-1.5">
                {HIGH_FODMAP_AVOID.map((food) => (
                  <Badge key={food} variant="red" className="text-[11px]">
                    {food}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3-Phase Explainer */}
        <motion.div variants={item} className="mb-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Leaf className="h-4 w-4 text-sage-500" />
                The 3-Phase FODMAP Approach
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              <div className="space-y-4">
                {[
                  {
                    phase: "1. Restriction",
                    duration: "2–6 weeks",
                    desc: "Remove all high FODMAP foods to calm symptoms and establish a baseline.",
                    color: "bg-red-100 dark:bg-red-900/20",
                  },
                  {
                    phase: "2. Reintroduction",
                    duration: "6–8 weeks",
                    desc: "Systematically test each FODMAP group to find YOUR triggers and tolerance levels.",
                    color: "bg-amber-100 dark:bg-amber-900/20",
                  },
                  {
                    phase: "3. Personalization",
                    duration: "Ongoing",
                    desc: "Create your long-term balanced diet including well-tolerated foods. Enjoy variety!",
                    color: "bg-emerald-100 dark:bg-emerald-900/20",
                  },
                ].map((phase) => (
                  <div
                    key={phase.phase}
                    className={`rounded-xl ${phase.color} p-4`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sage-800 dark:text-sage-100">
                        {phase.phase}
                      </p>
                      <span className="text-xs text-sage-500 dark:text-sage-400">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-sage-600 dark:text-sage-400">
                      {phase.desc}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ */}
        <motion.div variants={item} className="mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <HelpCircle className="h-4 w-4 text-teal-500" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-2">
              <Accordion type="single" collapsible className="w-full">
                {FAQ_ITEMS.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-sm">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-sage-600 dark:text-sage-400">
                        {faq.a}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* Credit */}
        <motion.div variants={item}>
          <div className="flex items-start gap-2 rounded-xl bg-sage-50 p-4 dark:bg-sage-800/30">
            <Heart className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <p className="text-xs text-sage-600 dark:text-sage-400">
              FODMAP research courtesy of Monash University. GutLens is an
              educational tool — always consult a registered dietitian for
              personalized medical nutrition therapy.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
