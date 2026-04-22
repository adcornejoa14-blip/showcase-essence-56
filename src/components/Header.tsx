import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="relative grid grid-cols-3 items-center px-5 py-5 md:px-8 md:py-6">
        <div className="justify-self-start">
          <button
            type="button"
            aria-label="Abrir menú"
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            <Menu strokeWidth={1.25} className="h-5 w-5" />
          </button>
        </div>

        <div className="justify-self-center">
          {/* Logo placeholder — sustituir por archivo real cuando esté disponible */}
          <span className="select-none text-[15px] font-light tracking-[0.35em] text-foreground/90">
            LOGO
          </span>
        </div>

        <div className="justify-self-end">
          <a
            href="#"
            className="text-xs font-light tracking-wide text-foreground/40 transition-colors hover:text-foreground/80"
          >
            Acceder
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
