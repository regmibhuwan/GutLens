import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { BottomNav } from "@/components/BottomNav";
import { StoreHydration } from "@/components/StoreHydration";
import { PWARegister } from "@/components/PWARegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "GutLens – AI Food Scanner for IBS",
  description:
    "Instantly check any food for IBS safety. Scan, snap, or upload — get personalized FODMAP advice in seconds.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.svg",
    apple: "/icon-512.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7f3" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2e1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <StoreHydration />
        <PWARegister />
        <main className="min-h-screen pb-20">{children}</main>
        <BottomNav />
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "rounded-xl border-sage-100 dark:border-sage-800",
          }}
          richColors
        />
      </body>
    </html>
  );
}
