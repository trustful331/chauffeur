import type { ReactNode } from "react";

// ─── Field error ──────────────────────────────────────────────────────────────

export function AdminFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 font-lato text-[11px] text-red-500" role="alert">
      {message}
    </p>
  );
}

// ─── Field class helper ───────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function adminFieldClass(hasError: boolean) {
  return [
    "w-full rounded-xl border bg-white px-4 py-3.5 font-lato text-sm text-[#1a2e1f] outline-none transition-colors placeholder:text-[#9CA3AF] focus:ring-2",
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-[#D1D5DB] focus:border-maseer-gold focus:ring-maseer-gold/20",
  ].join(" ");
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

export function AdminField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block font-lato text-[13px] font-semibold text-[#374151]">
        {label}
      </label>
      {children}
      <AdminFieldError message={error} />
    </div>
  );
}
