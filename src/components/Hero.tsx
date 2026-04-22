import { useEffect, useState } from "react";
import logo from "@/assets/noma-logo.png";

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setLoaded(true), 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section
      aria-label="NOMA Digital Studio"
      className="w-full bg-background"
    >
      <div className="flex items-center justify-center px-5 py-16 md:py-24 lg:py-28">
        <img
          src={logo}
          alt="NOMA Digital Studio"
          className={`w-[90%] max-w-[900px] md:w-[85%] lg:w-[70%] h-auto select-none transition-all duration-1000 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          draggable={false}
        />
      </div>
    </section>
  );
};

export default Hero;
