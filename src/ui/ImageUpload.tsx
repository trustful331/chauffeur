import React, { useState, useRef } from "react";
import { UploadCloud, Check, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
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

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setUploading(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 80);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setTimeout(() => {
        const base64data = reader.result as string;
        onChange(base64data);
        setUploading(false);
        clearInterval(interval);
      }, 1000); // add a slight delay for realistic mock uploading experience
    };
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
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-bold text-maseer-green-text uppercase tracking-wider">
          {label}
        </label>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        onClick={(e) => e.stopPropagation()}
      />

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
                className="rounded-lg bg-white px-3 py-1.5 font-lato text-xs font-bold text-maseer-green hover:bg-maseer-gold hover:text-white transition"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-lg bg-red-600 px-3 py-1.5 font-lato text-xs font-bold text-white hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-maseer-green font-semibold">
            <Check className="h-4 w-4" />
            Image uploaded successfully
          </div>
        </div>
      ) : uploading ? (
        // Uploading state
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-maseer-gold bg-maseer-surface-card p-8 text-center h-[212px]">
          <Loader2 className="h-10 w-10 animate-spin text-maseer-gold mb-3" />
          <p className="font-lato text-sm font-bold text-maseer-green-text mb-1">
            Uploading your vehicle image...
          </p>
          <p className="font-lato text-xs text-maseer-muted mb-4">{progress}% completed</p>
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
            Supports JPEG, PNG, WebP (Max 5MB)
          </p>
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
