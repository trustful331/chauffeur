import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User, Phone, Mail, Lock, Camera, CheckCircle2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { getProfile, updateProfile, type UserProfile } from "src/api/auth";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { selectAuthUser } from "src/store/slices/auth/selectors";
import { setSession } from "src/store/slices/auth";
import { LoadingButton, Spinner } from "src/ui/Spinner";

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectAuthUser);
  const token = useAppSelector((state) => state.auth.token);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  function handleImageFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setProfileImageUrl(result);
        toast.success("Image selected! Click 'Save Profile Changes' to update.");
      }
    };
    reader.readAsDataURL(file);
  }

  async function loadProfileData() {
    setIsLoading(true);
    try {
      const data = await getProfile();
      setProfile(data);
      setFullName(data.full_name || "");
      setPhoneNumber(data.phone_number || "");
      setProfileImageUrl(data.profile_image_url || "");
    } catch (error) {
      console.warn("Failed to load profile via API, using session data:", error);
      if (authUser && typeof authUser === "object") {
        setFullName(authUser.full_name || "");
        setPhoneNumber(authUser.phone_number || "");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProfileData();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword && !currentPassword) {
      toast.error("Please enter your current password to change password.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: {
        full_name?: string;
        phone_number?: string;
        profile_image_url?: string;
        current_password?: string;
        new_password?: string;
      } = {
        full_name: fullName.trim(),
        phone_number: phoneNumber.trim(),
        profile_image_url: profileImageUrl.trim(),
      };

      if (currentPassword && newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      const updated = await updateProfile(payload);
      setProfile(updated);
      toast.success("Profile updated successfully!");

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");

      // Update Redux state if token exists
      if (token && authUser && typeof authUser === "object") {
        dispatch(
          setSession({
            token,
            user: {
              ...authUser,
              full_name: updated.full_name,
              phone_number: updated.phone_number,
              profile_image_url: updated.profile_image_url,
            },
          })
        );
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  const initial = fullName ? fullName.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 font-lato">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#062111] via-[#0b331b] to-[#04170b] p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar with Upload Overlay */}
            <div className="relative group cursor-pointer">
              <label htmlFor="avatar-file-input" className="cursor-pointer block relative">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-maseer-gold/60 bg-maseer-gold/20 font-serif text-3xl font-bold text-maseer-gold shadow-lg transition group-hover:opacity-90">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt={fullName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </label>
              <input
                id="avatar-file-input"
                type="file"
                accept="image/*"
                onChange={handleImageFileSelect}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {fullName || "User Profile"}
                </h1>
                {profile?.is_email_verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-maseer-cream/75 break-all">
                {profile?.email || (typeof authUser === "object" ? authUser?.email : "")}
              </p>
              <p className="text-xs text-maseer-gold font-medium uppercase tracking-wider">
                Maseer Member Account
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-maseer-line/50 shadow-sm">
            <Spinner size="lg" className="text-maseer-gold" />
            <p className="mt-4 font-lato text-sm font-semibold text-maseer-muted">
              Loading your profile details...
            </p>
          </div>
        ) : (
          /* Profile Form */
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Personal Information Card */}
            <div className="rounded-3xl border border-maseer-line/60 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-150">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-maseer-gold/15 text-maseer-gold">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#062111]">
                    Personal Information
                  </h3>
                  <p className="text-xs text-maseer-muted">
                    Update your account details and contact information
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#062111] uppercase tracking-wider">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm text-[#062111] outline-none transition focus:border-maseer-gold focus:ring-2 focus:ring-maseer-gold/20"
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-maseer-muted" />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#062111] uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+965 5000 0000"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm text-[#062111] outline-none transition focus:border-maseer-gold focus:ring-2 focus:ring-maseer-gold/20"
                    />
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-maseer-muted" />
                  </div>
                </div>

                {/* Email Address (Disabled) */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#062111] uppercase tracking-wider">
                      Email Address
                    </label>
                    <span className="text-[11px] font-semibold text-maseer-muted bg-gray-100 px-2.5 py-0.5 rounded-md">
                      Cannot be changed
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      value={profile?.email || (typeof authUser === "object" ? authUser?.email : "")}
                      className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 text-sm text-maseer-muted font-medium outline-none"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-maseer-muted" />
                  </div>
                </div>

                {/* Profile Photo File Upload */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-[#062111] uppercase tracking-wider">
                    Profile Photo
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <label
                      htmlFor="profile-file-picker"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-maseer-gold bg-maseer-gold/15 px-5 py-3 text-xs font-bold text-[#062111] hover:bg-maseer-gold/30 cursor-pointer transition shadow-2xs"
                    >
                      <Camera className="h-4 w-4 text-maseer-gold" />
                      <span>Choose Image File...</span>
                      <input
                        id="profile-file-picker"
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileSelect}
                        className="hidden"
                      />
                    </label>

                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={profileImageUrl}
                        onChange={(e) => setProfileImageUrl(e.target.value)}
                        placeholder="Or paste photo URL link (https://...)"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs text-[#062111] outline-none transition focus:border-maseer-gold focus:ring-2 focus:ring-maseer-gold/20"
                      />
                    </div>

                    {profileImageUrl && (
                      <button
                        type="button"
                        onClick={() => setProfileImageUrl("")}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-maseer-muted">
                    Supports JPG, PNG, WEBP files under 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="rounded-3xl border border-maseer-line/60 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-150">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#062111]/10 text-[#062111]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#062111]">
                    Security &amp; Password
                  </h3>
                  <p className="text-xs text-maseer-muted">
                    Leave password fields blank if you do not wish to change your password
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#062111] uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter old password"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 pr-11 text-sm text-[#062111] outline-none transition focus:border-maseer-gold focus:ring-2 focus:ring-maseer-gold/20"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-maseer-muted" />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-maseer-muted hover:text-maseer-green"
                    >
                      {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#062111] uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 pr-11 text-sm text-[#062111] outline-none transition focus:border-maseer-gold focus:ring-2 focus:ring-maseer-gold/20"
                    />
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-maseer-muted" />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-maseer-muted hover:text-maseer-green"
                    >
                      {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-2">
              <LoadingButton
                type="submit"
                loading={isSaving}
                loadingText="Saving Profile..."
                className="btn-primary rounded-xl px-8 py-3.5 font-bold text-sm shadow-md"
              >
                Save Profile Changes
              </LoadingButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
