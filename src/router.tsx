import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./ui/MainLayout";
import { RequireAuth } from "./ui/RequireAuth";
import { AboutPage } from "./pages/About/AboutPage";
import { AuthLayout } from "./pages/Auth/AuthLayout";
import { SignInPage } from "./pages/Auth/SignInPage";
import { SignUpPage } from "./pages/Auth/SignUpPage";
import { BookingPage } from "./pages/Booking/BookingPage";
import { ContactPage } from "./pages/Contact/ContactPage";
import { CorporatePage } from "./pages/Corporate/CorporatePage";
import { FleetDetailsPage } from "./pages/Fleet/details/FleetDetailsPage";
import { FleetGridPage } from "./pages/Fleet/FleetGridPage";
import { HomePage } from "./pages/Home/HomePage";
import { ServicesPage } from "./pages/Services/ServicesPage";

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
    ],
  },
]);
