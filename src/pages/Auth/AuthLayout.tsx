import { Link, Outlet } from "react-router-dom";
import { images } from "../../assets/images";
import { HeroBackground } from "../../ui/HeroBackground";
import { MaseerLogo } from "../../ui/MaseerLogo";

export function AuthLayout() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden min-h-screen overflow-hidden bg-maseer-green-deep lg:flex">
        <HeroBackground
          image={images.home.hero}
          gradient="linear-gradient(180deg, rgba(7,58,11,0.55) 0%, rgba(7,58,11,0.88) 100%)"
        />
        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
          <MaseerLogo />
          <div className="max-w-md">
            <p className="eyebrow !text-primary">MASEER ACCOUNT</p>
            <h1 className="mt-4 font-serif text-[42px] font-semibold leading-[1.15] text-white">
              Luxury mobility, <span className="text-primary">simplified.</span>
            </h1>
            <p className="mt-5 font-lato text-[15px] leading-7 text-white/85">
              Manage bookings, track your chauffeur, and enjoy seamless executive
              travel across Saudi Arabia.
            </p>
          </div>
          <p className="font-lato text-[12px] text-white/60">
            © {new Date().getFullYear()} MASEER Luxury Chauffeur Service
          </p>
        </div>
      </div>

      <div className="flex min-h-screen flex-col bg-maseer-cream px-6 py-10 max-md:px-4 max-md:py-6 sm:px-10 lg:py-12">
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <MaseerLogo />
          <Link
            to="/"
            className="font-lato text-[13px] font-semibold text-maseer-green transition hover:text-maseer-gold"
          >
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[440px]">
            <Outlet />
          </div>
        </div>

        <p className="mt-8 text-center font-lato text-[12px] text-maseer-muted lg:hidden">
          © {new Date().getFullYear()} MASEER Luxury Chauffeur Service
        </p>
      </div>
    </div>
  );
}
