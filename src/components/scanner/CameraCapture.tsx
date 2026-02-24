"use client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  SwitchCamera,
  Zap,
  ZapOff,
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [flashOn, setFlashOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode,
  };

  const capture = useCallback(() => {
    setIsCapturing(true);
    setTimeout(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
      setIsCapturing(false);
    }, 150);
  }, []);

  const retake = () => {
    setCapturedImage(null);
  };

  const confirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const flipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black">
      <AnimatePresence mode="wait">
        {capturedImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <img
              src={capturedImage}
              alt="Captured food"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-6 bg-gradient-to-t from-black/70 to-transparent p-6">
              <Button
                variant="outline"
                size="lg"
                onClick={retake}
                className="rounded-full border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
              >
                <RotateCcw className="mr-1 h-4 w-4" />
                Retake
              </Button>
              <Button
                size="lg"
                onClick={confirm}
                className="rounded-full bg-sage-500 hover:bg-sage-600"
              >
                <Check className="mr-1 h-4 w-4" />
                Use Photo
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.9}
              videoConstraints={videoConstraints}
              className="aspect-[4/3] w-full object-cover"
              mirrored={facingMode === "user"}
            />

            {/* Flash overlay */}
            <AnimatePresence>
              {isCapturing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white"
                  transition={{ duration: 0.15 }}
                />
              )}
            </AnimatePresence>

            {/* Viewfinder overlay */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-[12%] rounded-2xl border-2 border-white/25" />
              <div className="absolute left-[12%] top-[12%] h-8 w-8 rounded-tl-2xl border-l-[3px] border-t-[3px] border-white/60" />
              <div className="absolute right-[12%] top-[12%] h-8 w-8 rounded-tr-2xl border-r-[3px] border-t-[3px] border-white/60" />
              <div className="absolute bottom-[12%] left-[12%] h-8 w-8 rounded-bl-2xl border-b-[3px] border-l-[3px] border-white/60" />
              <div className="absolute bottom-[12%] right-[12%] h-8 w-8 rounded-br-2xl border-b-[3px] border-r-[3px] border-white/60" />
            </div>

            {/* Top controls */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
              <button
                onClick={() => setFlashOn(!flashOn)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/50"
              >
                {flashOn ? (
                  <Zap className="h-5 w-5" />
                ) : (
                  <ZapOff className="h-5 w-5" />
                )}
              </button>
              <p className="rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                Point at your food
              </p>
              <button
                onClick={flipCamera}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/50"
              >
                <SwitchCamera className="h-5 w-5" />
              </button>
            </div>

            {/* Bottom capture button */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent pb-6 pt-12">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={capture}
                className="relative flex h-18 w-18 items-center justify-center"
              >
                <div className="pulse-ring absolute h-[72px] w-[72px] rounded-full border-2 border-white/40" />
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30">
                  <Camera className="h-7 w-7 text-white" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
