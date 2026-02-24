"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ScanBarcode, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<unknown>(null);

  const startScanner = async () => {
    setError(null);
    setIsScanning(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      if (!scannerRef.current) return;

      const scannerId = "barcode-reader";

      // Ensure the element exists
      let el = document.getElementById(scannerId);
      if (!el && scannerRef.current) {
        el = document.createElement("div");
        el.id = scannerId;
        scannerRef.current.appendChild(el);
      }

      const html5QrCode = new Html5Qrcode(scannerId);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.333,
        },
        (decodedText) => {
          onScan(decodedText);
          html5QrCode.stop().catch(() => {});
          setIsScanning(false);
        },
        () => {
          // Scan failure - ignore, keep scanning
        }
      );
    } catch (err) {
      setError(
        "Could not access camera. Please grant camera permission and try again."
      );
      setIsScanning(false);
      console.error("Barcode scanner error:", err);
    }
  };

  const stopScanner = useCallback(async () => {
    try {
      const scanner = html5QrCodeRef.current as { stop: () => Promise<void> } | null;
      if (scanner) {
        await scanner.stop();
      }
    } catch {
      // Ignore
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  return (
    <div className="w-full">
      {!isScanning ? (
        <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sage-200 bg-sage-50/50 dark:border-sage-700 dark:bg-sage-800/30">
          <ScanBarcode className="mb-3 h-12 w-12 text-sage-400" />
          <p className="mb-1 text-sm font-medium text-sage-700 dark:text-sage-300">
            Scan a barcode
          </p>
          <p className="mb-5 text-xs text-sage-500 dark:text-sage-400">
            Point your camera at the product barcode
          </p>

          {error && (
            <div className="mx-4 mb-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button onClick={startScanner}>
            <ScanBarcode className="mr-1 h-4 w-4" />
            Start Scanning
          </Button>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl bg-black">
          {/* Scanner overlay guide */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative h-[120px] w-[250px]">
              <div className="absolute inset-0 rounded-lg border-2 border-white/40" />
              <div className="absolute left-0 top-0 h-6 w-6 rounded-tl-lg border-l-[3px] border-t-[3px] border-sage-400" />
              <div className="absolute right-0 top-0 h-6 w-6 rounded-tr-lg border-r-[3px] border-t-[3px] border-sage-400" />
              <div className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-lg border-b-[3px] border-l-[3px] border-sage-400" />
              <div className="absolute bottom-0 right-0 h-6 w-6 rounded-br-lg border-b-[3px] border-r-[3px] border-sage-400" />
              {/* Scanning line animation */}
              <motion.div
                className="absolute left-2 right-2 h-0.5 bg-sage-400"
                animate={{ top: ["10%", "90%", "10%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>

          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
            <div />
            <p className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              Align barcode within frame
            </p>
            <div />
          </div>

          <div ref={scannerRef} id="barcode-scanner" className="aspect-[4/3]" />

          <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center bg-gradient-to-t from-black/60 to-transparent p-6">
            <Button
              variant="outline"
              onClick={stopScanner}
              className="rounded-full border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
