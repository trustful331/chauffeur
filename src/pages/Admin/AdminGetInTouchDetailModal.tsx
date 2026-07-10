import { X, Phone, Mail, MessageSquare, Calendar } from "lucide-react";
import { type GetInTouchItem } from "src/api/admin/getInTouch";

type AdminGetInTouchDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: GetInTouchItem | null;
};

export function AdminGetInTouchDetailModal({
  isOpen,
  onClose,
  item,
}: AdminGetInTouchDetailModalProps) {
  if (!isOpen || !item) return null;

  const formattedDate = item.created_at
    ? new Date(item.created_at).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#062111]/70 backdrop-blur-[4px] transition-opacity"
        onClick={onClose}
      />

      {/* Content Card */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-xl transition-all duration-300 max-h-[90vh] flex flex-col font-lato">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-150">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9BB00]/10 text-[#F9BB00]">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-[18px] font-bold text-[#062111]">
                Inquiry Details
              </h3>
              <p className="text-xs text-maseer-muted">
                Callback request information
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-maseer-muted hover:bg-gray-100 hover:text-black transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          {/* User Icon & Full Name */}
          <div className="flex items-center gap-3.5 bg-[#F8FAF8] p-4 rounded-xl border border-gray-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#062111] text-[#F9BB00] font-bold text-lg">
              {item.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-serif text-[16px] font-bold text-[#062111]">
                {item.full_name}
              </h4>
              <p className="text-xs text-maseer-muted">
                Contact Request
              </p>
            </div>
          </div>

          {/* Contact Fields */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-maseer-muted mt-0.5" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                  Phone Number
                </p>
                <a
                  href={`tel:${item.phone_number}`}
                  className="text-[14px] font-semibold text-[#062111] hover:underline"
                >
                  {item.phone_number}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-maseer-muted mt-0.5" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                  Email Address
                </p>
                <a
                  href={`mailto:${item.email_address}`}
                  className="text-[14px] font-semibold text-[#062111] hover:underline"
                >
                  {item.email_address}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-maseer-muted mt-0.5" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-maseer-muted leading-tight">
                  Submitted On
                </p>
                <p className="text-[14px] font-semibold text-[#062111]">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Note Box */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-maseer-muted">
              Message/Note
            </p>
            <div className="rounded-xl border border-gray-150 bg-[#F9FAF9] p-4 text-[13.5px] leading-relaxed text-[#1a2e1f] italic whitespace-pre-wrap">
              {item.note || "No message provided."}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-4 border-t border-gray-150">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#062111] px-5 py-2 font-lato text-sm font-bold text-white transition hover:bg-[#0b331b]"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
