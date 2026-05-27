import { useEffect, useState } from "react";
import logo from "@/assets/noma-logo-final.png";
import ScrollHero from "@/components/ScrollHero";

interface WelcomeScreenProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

const WelcomeScreen = ({ onCreateAccount, onLogin }: WelcomeScreenProps) => {
  const [loaded, setLoaded] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setLoaded(true), 50);
    return () => window.clearTimeout(t);
  }, []);

  const handle = (cb: () => void) => {
    setExiting(true);
    window.setTimeout(cb, 400);
  };

  const CTAs = (
    <div
      className={`flex flex-col items-center gap-3 transition-all duration-700 ease-out sm:flex-row sm:gap-4 ${
        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
      style={{ transitionDelay: loaded ? "300ms" : "0ms" }}
    >
      <button
        type="button"
        onClick={() => handle(onCreateAccount)}
        className="w-60 border border-foreground/20 px-10 py-3 text-sm font-light tracking-[0.2em] uppercase text-foreground/70 transition-colors hover:border-foreground/60 hover:text-foreground sm:w-auto"
      >
        Create account
      </button>
      <button
        type="button"
        onClick={() => handle(onLogin)}
        className="w-60 border border-foreground/20 px-10 py-3 text-sm font-light tracking-[0.2em] uppercase text-foreground/70 transition-colors hover:border-foreground/60 hover:text-foreground sm:w-auto"
      >
        Sign in
      </button>
    </div>
  );

  return (
    <div
      className={`min-h-screen w-full bg-background transition-opacity duration-500 ease-out ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Intro viewport — logo + CTAs */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center gap-12 px-5">
        <img
          src={logo}
          alt="NOMA Digital Studio"
          draggable={false}
          className={`w-[90%] max-w-[900px] md:w-[85%] lg:w-[70%] h-auto select-none transition-all duration-1000 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        />
        {CTAs}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-light tracking-[0.3em] uppercase text-foreground/40 transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          Scroll
        </div>
      </section>

      {/* Scroll-driven hero */}
      <ScrollHero />

      {/* Closing CTAs */}
      <section className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-8 px-5 pb-24">
        <p className="max-w-xl text-center text-base font-light text-foreground/60 md:text-lg">
          Join the curated network of dental excellence.
        </p>
        {CTAs}
      </section>
    </div>
  );
};

export default WelcomeScreen;
