import { useRouteError, Link } from "react-router-dom";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string; status?: number };
  console.error("App Route Error:", error);

  const is404 = error?.status === 404;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfbfa] px-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <AlertTriangle className="h-9 w-9" />
      </div>

      <h1 className="mt-6 font-serif text-3xl font-bold text-maseer-green-text max-md:text-2xl">
        {is404 ? "Page Not Found" : "Oops! Something went wrong"}
      </h1>
      
      <p className="mt-3 max-w-md text-sm text-maseer-muted leading-relaxed">
        {is404
          ? "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
          : (error?.statusText || error?.message || "An unexpected error occurred while loading this page.")}
      </p>

      <div className="mt-8 flex gap-4 max-md:flex-col max-md:w-full max-md:max-w-xs">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 rounded-xl border border-maseer-line/60 px-6 py-3.5 font-lato text-sm font-bold text-maseer-green-text hover:bg-maseer-cream transition"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 rounded-xl bg-maseer-green px-6 py-3.5 font-lato text-sm font-bold text-white transition hover:bg-maseer-green-deep"
        >
          <Home className="h-4 w-4" /> Home Page
        </Link>
      </div>
    </div>
  );
}
export default ErrorPage;
