import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "./ui/MainLayout";
import { RequireAuth } from "./ui/RequireAuth";
import { AboutPage } from "./pages/About/AboutPage";
import { AuthLayout } from "./pages/Auth/AuthLayout";
import { SignInPage } from "./pages/Auth/SignInPage";
import { SignUpPage } from "./pages/Auth/SignUpPage";
import { ForgotPasswordPage } from "./pages/Auth/ForgotPasswordPage";
import { OtpPage } from "./pages/Auth/OtpPage";
import { ResetPasswordPage } from "./pages/Auth/ResetPasswordPage";
import { BookingPage } from "./pages/Booking/BookingPage";
import { ContactPage } from "./pages/Contact/ContactPage";
import { CorporatePage } from "./pages/Corporate/CorporatePage";
import { FleetDetailsPage } from "./pages/Fleet/details/FleetDetailsPage";
import { FleetGridPage } from "./pages/Fleet/FleetGridPage";
import { HomePage } from "./pages/Home/HomePage";
import { ServicesPage } from "./pages/Services/ServicesPage";
import { AdminAuthLayout } from "./pages/Admin/AdminAuthLayout";
import { AdminDashboardPage } from "./pages/Admin/AdminDashboardPage";
import AdminLoginPage from "./pages/Admin/AdminLoginPage";
import { AdminLayout } from "./ui/AdminLayout";
import { RequireAdmin } from "./ui/RequireAdmin";
import { AdminFleetPage } from "./pages/Admin/AdminFleetPage";
import { AdminServiceCoveragePage } from "./pages/Admin/AdminServiceCoveragePage";
import { AdminCustomerReviewPage } from "./pages/Admin/AdminCustomerReviewPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "fleet", element: <FleetGridPage /> },
      { path: "fleet/:vehicleId", element: <FleetDetailsPage /> },
      { path: "corporate", element: <CorporatePage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "booking", element: <RequireAuth><BookingPage /></RequireAuth> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "otp-verify", element: <OtpPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },
  // ── Admin Auth ────────────────────────────────────────────────────
  {
    path: "admin/login",
    element: <AdminAuthLayout />,
    children: [
      { index: true, element: <AdminLoginPage /> },
    ],
  },
  // ── Admin App (post-login) ────────────────────────────────────────
  {
    path: "admin",
    element: <RequireAdmin><AdminLayout /></RequireAdmin>,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "fleet", element: <AdminFleetPage /> },
      { path: "services", element: <AdminServiceCoveragePage /> },
      { path: "reviews", element: <AdminCustomerReviewPage /> },
    ],
  },
]);
