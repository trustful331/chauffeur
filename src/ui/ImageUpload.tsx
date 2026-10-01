import React, { useState, useRef } from "react";
import { UploadCloud, Check, Loader2, AlertCircle, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { compressImageFile, formatBytes } from "src/utils/imageCompressor";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export function ImageUpload({
  value,
  onChange,
  label,
  helperText,
}: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    setUploading(true);
    setProgress(25);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 15));
    }, 50);

    try {
      // Compress image strictly under 55KB so total JSON request body stays safely below backend 100KB limit
      const result = await compressImageFile(file, {
        maxWidth: 850,
        maxHeight: 850,
        quality: 0.7,
        maxTargetKb: 55,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const origSize = formatBytes(result.originalSize);
      const compSize = formatBytes(result.compressedSize);
      setCompressionInfo(
        result.reductionPercentage > 0
          ? `Optimized: ${origSize} → ${compSize} (${result.reductionPercentage}% smaller, safe for server)`
          : `Size: ${compSize}`
      );

      setTimeout(() => {
        onChange(result.dataUrl);
        setUploading(false);
      }, 300);
    } catch (err) {
      clearInterval(progressInterval);
      setUploading(false);
      const errorText =
        err instanceof Error ? err.message : "Failed to process the image.";
      setErrorMessage(errorText);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMessage(null);
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    setUrlInput("");
    setCompressionInfo(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setErrorMessage("Please enter a valid image URL.");
      return;
    }
    onChange(urlInput.trim());
    setCompressionInfo("External Web URL");
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full font-lato">
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">
            {label}
          </label>
        )}

        {!value && (
          <div className="flex items-center gap-1 rounded-lg bg-maseer-cream p-0.5 border border-maseer-line text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("file");
                setErrorMessage(null);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                activeTab === "file"
                  ? "bg-white text-maseer-green shadow-xs font-bold"
                  : "text-maseer-muted hover:text-maseer-green-text"
              }`}
            >
              <ImageIcon className="h-3 w-3" />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("url");
                setErrorMessage(null);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                activeTab === "url"
                  ? "bg-white text-maseer-green shadow-xs font-bold"
                  : "text-maseer-muted hover:text-maseer-green-text"
              }`}
            >
              <LinkIcon className="h-3 w-3" />
              <span>Image URL</span>
            </button>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onClick={(e) => e.stopPropagation()}
      />

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {value ? (
        // Preview state
        <div className="relative group flex flex-col items-center justify-center rounded-2xl border border-maseer-line bg-maseer-cream p-4 text-center">
          <div className="relative w-full h-[180px] rounded-xl overflow-hidden bg-white border border-maseer-line flex items-center justify-center">
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-contain"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleButtonClick}
                className="rounded-lg bg-white px-3 py-1.5 font-lato text-xs font-bold text-maseer-green hover:bg-maseer-gold hover:text-white transition cursor-pointer"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-lg bg-red-600 px-3 py-1.5 font-lato text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1.5 text-xs text-maseer-green font-semibold">
              <Check className="h-4 w-4" />
              Image loaded and ready
            </div>
            {compressionInfo && (
              <span className="text-[11px] text-maseer-muted font-mono">
                {compressionInfo}
              </span>
            )}
          </div>
        </div>
      ) : activeTab === "url" ? (
        // URL Input Form
        <div className="flex flex-col gap-2 rounded-2xl border border-maseer-line bg-maseer-cream p-5">
          <p className="text-xs text-maseer-muted">
            Paste a public image URL (e.g. from Unsplash, Cloudinary, AWS S3, or any CDN):
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 rounded-xl border border-maseer-line bg-white px-3.5 py-2.5 text-xs text-maseer-green-text focus:outline-none focus:ring-1 focus:ring-maseer-gold"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="rounded-xl bg-maseer-green hover:bg-maseer-green-light px-4 py-2.5 text-xs font-bold text-white transition"
            >
              Set Image
            </button>
          </div>
        </div>
      ) : uploading ? (
        // Compressing / Uploading state
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-maseer-gold bg-maseer-surface-card p-8 text-center h-[212px]">
          <Loader2 className="h-10 w-10 animate-spin text-maseer-gold mb-3" />
          <p className="font-lato text-sm font-bold text-maseer-green-text mb-1">
            Optimizing image for server limits...
          </p>
          <p className="font-lato text-xs text-maseer-muted mb-4">
            {progress}% completed
          </p>
          <div className="w-[200px] h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-maseer-gold rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        // Upload drag zone
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition h-[212px] ${
            dragActive
              ? "border-maseer-gold bg-maseer-surface-card"
              : "border-maseer-line bg-maseer-cream hover:border-maseer-gold/60 hover:bg-[#F9FAF9]"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-maseer-surface-card text-maseer-green mb-4">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="font-lato text-sm font-bold text-maseer-green-text mb-1">
            Drag & drop your vehicle image here
          </p>
          <p className="font-lato text-xs text-maseer-muted">
            Supports JPEG, PNG, WebP (Auto-optimized strictly under 55KB)
          </p>
          {helperText && (
            <p className="font-lato text-[11px] text-maseer-muted mt-1">
              {helperText}
            </p>
          )}
          <button
            type="button"
            className="mt-4 rounded-xl border border-maseer-green/20 bg-white px-4 py-2 font-lato text-xs font-bold text-maseer-green hover:border-maseer-gold hover:text-maseer-gold transition shadow-sm"
          >
            Browse Files
          </button>
        </div>
      )}
    </div>
  );
}
