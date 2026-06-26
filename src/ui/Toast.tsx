import { type ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 4500,
          className:
            "!font-lato !text-sm !rounded-xl !shadow-lg !bg-white !border !border-maseer-line/60",
          success: {
            iconTheme: { primary: "#073A0B", secondary: "#fff" },
            style: { borderLeft: "4px solid #073A0B" },
          },
          error: {
            iconTheme: { primary: "#DC2626", secondary: "#fff" },
            style: { borderLeft: "4px solid #DC2626" },
          },
        }}
      />
    </>
  );
}
