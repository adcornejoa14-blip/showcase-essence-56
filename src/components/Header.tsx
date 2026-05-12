import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SERVICE_CATEGORIES, services } from "@/data/services";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeService = searchParams.get("service");
  const { session } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const selectService = (slug: string | null) => {
    setMenuOpen(false);
    if (slug) {
      navigate(`/?service=${slug}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="relative grid grid-cols-3 items-center px-5 py-5 md:px-8 md:py-6">
        <div className="justify-self-start">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menú de servicios"
                className="text-foreground/70 transition-colors hover:text-foreground"
              >
                <Menu strokeWidth={1.25} className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-left text-lg font-light tracking-tight">
                  Encuentra técnicos por servicio
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-8">
                <button
                  type="button"
                  onClick={() => selectService(null)}
                  className={`text-sm font-light transition-colors ${
                    !activeService
                      ? "text-foreground"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  Ver todos los técnicos
                </button>

                {SERVICE_CATEGORIES.map((category) => {
                  const items = services.filter((s) => s.category === category);
                  return (
                    <div key={category} className="space-y-3">
                      <h3 className="text-xs font-light uppercase tracking-[0.2em] text-foreground/40">
                        {category}
                      </h3>
                      <ul className="space-y-2">
                        {items.map((s) => {
                          const isActive = activeService === s.slug;
                          return (
                            <li key={s.slug}>
                              <button
                                type="button"
                                onClick={() => selectService(s.slug)}
                                className={`block w-full text-left text-sm font-light transition-colors ${
                                  isActive
                                    ? "text-foreground"
                                    : "text-foreground/60 hover:text-foreground"
                                }`}
                              >
                                {s.name}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="justify-self-center" aria-hidden="true" />

        <div className="justify-self-end">
          {session ? (
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
              }}
              className="text-xs font-light tracking-wide text-foreground/40 transition-colors hover:text-foreground/80"
            >
              Cerrar sesión
            </button>
          ) : (
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
          )}
        </div>
      </div>

      {activeService && (
        <div className="flex items-center justify-center gap-3 border-b border-border/40 bg-muted/20 px-4 py-2 text-xs font-light text-foreground/70">
          <span>
            Filtrando por:{" "}
            <span className="text-foreground">
              {services.find((s) => s.slug === activeService)?.name}
            </span>
          </span>
          <button
            type="button"
            onClick={() => selectService(null)}
            aria-label="Quitar filtro"
            className="flex items-center gap-1 text-foreground/50 hover:text-foreground"
          >
            <X className="h-3 w-3" /> quitar
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
