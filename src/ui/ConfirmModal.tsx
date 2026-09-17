import React, { useEffect } from "react";
import { AlertTriangle, Info, Trash2, X } from "lucide-react";
import { Spinner } from "src/ui/Spinner";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  icon,
}: ConfirmModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  // Variant design configs
  const variantStyles = {
    danger: {
      iconBg: "bg-red-50 text-red-600 border-red-100",
      defaultIcon: <Trash2 className="h-5 w-5" />,
      buttonBg: "bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500",
    },
    warning: {
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      defaultIcon: <AlertTriangle className="h-5 w-5" />,
      buttonBg: "bg-amber-600 hover:bg-amber-700 text-white shadow-sm focus:ring-amber-500",
    },
    info: {
      iconBg: "bg-maseer-tint-green text-maseer-green border-maseer-line",
      defaultIcon: <Info className="h-5 w-5" />,
      buttonBg: "bg-maseer-green hover:bg-maseer-green-light text-white shadow-sm focus:ring-maseer-gold",
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.danger;
  const renderIcon = icon ?? currentVariant.defaultIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-maseer-green-deep/70 backdrop-blur-[4px] transition-opacity"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white border border-maseer-line p-6 shadow-float transition-all duration-300 font-lato">
        {/* Close Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-maseer-muted hover:bg-maseer-surface hover:text-[#1a2e1f] transition disabled:opacity-50"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="flex items-center gap-4">
            {/* Icon Container */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${currentVariant.iconBg}`}
            >
              {renderIcon}
            </div>

            <div>
              <h3 className="font-serif text-[20px] font-bold text-maseer-green-text leading-snug">
                {title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <div className="mt-3 text-sm text-maseer-muted leading-relaxed">
            {description}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 border-t border-maseer-line/80 pt-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="w-full sm:w-auto rounded-xl border border-maseer-line bg-white hover:bg-maseer-surface px-5 py-2.5 font-lato text-sm font-bold text-maseer-muted transition disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => onConfirm()}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-lato text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed ${currentVariant.buttonBg}`}
            >
              {isLoading && <Spinner size="sm" className="text-white" />}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
