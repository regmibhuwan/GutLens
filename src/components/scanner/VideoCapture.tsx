"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Square,
  SwitchCamera,
  Check,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoCaptureProps {
  onCapture: (imageDataUrl: string, description?: string) => void;
}

export function VideoCapture({ onCapture }: VideoCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MAX_DURATION = 10;

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode,
  };

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= MAX_DURATION - 1) {
          stopRecording();
          return MAX_DURATION;
        }
        return prev + 1;
      });
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Capture the current frame
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedFrame(imageSrc);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const retake = () => {
    setCapturedFrame(null);
    setRecordingTime(0);
  };

  const confirm = () => {
    if (capturedFrame) {
      onCapture(
        capturedFrame,
        `This is a frame captured from a ${recordingTime}s video of food being examined.`
      );
    }
  };

  const flipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black">
      <AnimatePresence mode="wait">
        {capturedFrame ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <img
              src={capturedFrame}
              alt="Video frame"
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
                Use Frame
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

            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-500/90 px-3 py-1.5 backdrop-blur-sm">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
                <span className="text-xs font-bold text-white">
                  {recordingTime}s / {MAX_DURATION}s
                </span>
              </div>
            )}

            {/* Progress bar */}
            {isRecording && (
              <div className="absolute inset-x-0 top-0 h-1 bg-white/20">
                <motion.div
                  className="h-full bg-red-500"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${(recordingTime / MAX_DURATION) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}

            {/* Top controls */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
              <div />
              <p className="rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                {isRecording
                  ? "Recording... show the food"
                  : "Tap to start recording (max 10s)"}
              </p>
              <button
                onClick={flipCamera}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md"
                disabled={isRecording}
              >
                <SwitchCamera className="h-5 w-5" />
              </button>
            </div>

            {/* Bottom controls */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent pb-6 pt-12">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={isRecording ? stopRecording : startRecording}
                className="relative flex h-18 w-18 items-center justify-center"
              >
                {isRecording ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-500 bg-red-500/20 backdrop-blur-sm">
                    <Square className="h-6 w-6 text-white" fill="white" />
                  </div>
                ) : (
                  <>
                    <div className="pulse-ring absolute h-[72px] w-[72px] rounded-full border-2 border-red-400/40" />
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-red-500/80 backdrop-blur-sm transition-colors hover:bg-red-500">
                      <Video className="h-7 w-7 text-white" />
                    </div>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
