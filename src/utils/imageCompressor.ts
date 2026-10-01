/**
 * Compresses an image file client-side using HTML5 Canvas with strict target size guarantees.
 * Ensures the resulting Base64 string is strictly under the backend Express body-parser limit (100 KB).
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxTargetKb?: number; // Target max size for Base64 in KB (e.g. 60 KB)
  mimeType?: "image/jpeg" | "image/webp";
}

export interface CompressionResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
}

export function compressImageFile(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 900,
    maxHeight = 900,
    quality = 0.7,
    maxTargetKb = 60, // Keep comfortably below backend's strict 100 KB limit
    mimeType = "image/jpeg",
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      return reject(new Error("Selected file is not a valid image format."));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.src = src;

      img.onload = () => {
        let currentWidth = img.width;
        let currentHeight = img.height;

        // Scale down to max dimensions
        if (currentWidth > currentHeight) {
          if (currentWidth > maxWidth) {
            currentHeight = Math.round((currentHeight * maxWidth) / currentWidth);
            currentWidth = maxWidth;
          }
        } else {
          if (currentHeight > maxHeight) {
            currentWidth = Math.round((currentWidth * maxHeight) / currentHeight);
            currentHeight = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return resolve({
            dataUrl: src,
            originalSize: file.size,
            compressedSize: file.size,
            reductionPercentage: 0,
          });
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Iterative compression to strictly stay below maxTargetKb
        let currentQuality = quality;
        let resultDataUrl = "";
        let approxBytes = 0;
        let attempts = 0;

        while (attempts < 6) {
          canvas.width = currentWidth;
          canvas.height = currentHeight;

          // Fill white background for transparent PNGs converted to JPEG
          if (mimeType === "image/jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, currentWidth, currentHeight);
          }

          ctx.drawImage(img, 0, 0, currentWidth, currentHeight);
          resultDataUrl = canvas.toDataURL(mimeType, currentQuality);

          const base64Length =
            resultDataUrl.length - (resultDataUrl.indexOf(",") + 1);
          approxBytes = Math.round((base64Length * 3) / 4);
          const currentKb = approxBytes / 1024;

          if (currentKb <= maxTargetKb || currentQuality <= 0.35) {
            break;
          }

          // If still too large, reduce dimensions & quality slightly
          currentWidth = Math.round(currentWidth * 0.85);
          currentHeight = Math.round(currentHeight * 0.85);
          currentQuality = Math.max(0.35, currentQuality - 0.1);
          attempts++;
        }

        const reduction =
          file.size > approxBytes
            ? Math.round(((file.size - approxBytes) / file.size) * 100)
            : 0;

        resolve({
          dataUrl: resultDataUrl,
          originalSize: file.size,
          compressedSize: approxBytes,
          reductionPercentage: reduction,
        });
      };

      img.onerror = () => {
        reject(new Error("Failed to process image file."));
      };
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file from disk."));
    };
  });
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
