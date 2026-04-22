import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

        <div className="justify-self-center" aria-hidden="true" />

        <div className="justify-self-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="text-xs font-light tracking-wide text-foreground/40 transition-colors hover:text-foreground/80"
              >
                Acceder
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="text-center sm:text-center">
                <DialogTitle className="text-2xl font-light tracking-tight">
                  Únete a Dentaly
                </DialogTitle>
                <DialogDescription className="text-sm font-light text-foreground/50">
                  Elige cómo quieres participar
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="h-12 w-full font-light tracking-wide"
                  onClick={() => setOpen(false)}
                >
                  Unirme como dentista
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-full font-light tracking-wide"
                  onClick={() => setOpen(false)}
                >
                  Unirme como técnico dental
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
