import { useEffect, useState } from "react";
import logo from "@/assets/noma-logo-final.png";

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

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-12 bg-background px-5 transition-opacity duration-500 ease-out ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={logo}
        alt="NOMA Digital Studio"
        draggable={false}
        className={`w-[90%] max-w-[900px] md:w-[85%] lg:w-[70%] h-auto select-none transition-all duration-1000 ease-out ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      />

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
          Crear cuenta
        </button>
        <button
          type="button"
          onClick={() => handle(onLogin)}
          className="w-60 border border-foreground/20 px-10 py-3 text-sm font-light tracking-[0.2em] uppercase text-foreground/70 transition-colors hover:border-foreground/60 hover:text-foreground sm:w-auto"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
