"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImageIcon, Film, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadCaptureProps {
  onCapture: (imageDataUrl: string) => void;
}

export function UploadCapture({ onCapture }: UploadCaptureProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file) return;
    setFileName(file.name);

    if (file.type.startsWith("video/")) {
      // Extract first frame from video
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadeddata = () => {
        video.currentTime = 0.5; // grab frame at 0.5s
      };
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
          setPreview(dataUrl);
        }
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    } else {
      // Image file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const clear = () => {
    setPreview(null);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const confirm = () => {
    if (preview) {
      onCapture(preview);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <img
              src={preview}
              alt="Uploaded food"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="mt-1 px-1">
              <p className="truncate text-xs text-sage-500">{fileName}</p>
            </div>
            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clear}
              >
                <X className="mr-1 h-4 w-4" />
                Remove
              </Button>
              <Button className="flex-1" onClick={confirm}>
                <Check className="mr-1 h-4 w-4" />
                Use This
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
              className={`flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
                isDragging
                  ? "border-sage-500 bg-sage-50 dark:border-sage-400 dark:bg-sage-800/50"
                  : "border-sage-200 bg-sage-50/50 hover:border-sage-300 hover:bg-sage-50 dark:border-sage-700 dark:bg-sage-800/30 dark:hover:border-sage-600"
              }`}
            >
              <motion.div
                animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Upload className="mb-3 h-10 w-10 text-sage-400" />
              </motion.div>
              <p className="mb-1 text-sm font-medium text-sage-700 dark:text-sage-300">
                {isDragging ? "Drop it here!" : "Drag & drop or tap to upload"}
              </p>
              <p className="text-xs text-sage-500 dark:text-sage-400">
                Images or short videos
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-sage-100 px-3 py-1 text-xs text-sage-600 dark:bg-sage-800 dark:text-sage-400">
                  <ImageIcon className="h-3 w-3" />
                  JPG, PNG, WebP
                </div>
                <div className="flex items-center gap-1 rounded-full bg-sage-100 px-3 py-1 text-xs text-sage-600 dark:bg-sage-800 dark:text-sage-400">
                  <Film className="h-3 w-3" />
                  MP4, MOV
                </div>
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleInputChange}
              className="hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
