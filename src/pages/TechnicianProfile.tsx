import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus, X } from "lucide-react";
import { getTechnicianBySlug } from "@/data/technicians";
import { SERVICE_CATEGORIES, type Service } from "@/data/services";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CaseUploadDialog, type CartItem } from "@/components/case-upload/CaseUploadDialog";

const TechnicianProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const technician = slug ? getTechnicianBySlug(slug) : undefined;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (technician) {
      document.title = `${technician.name} — Portafolio`;
    }
  }, [slug, technician]);

  const servicesByCategory = useMemo(() => {
    if (!technician) return [] as Array<{ category: string; items: Service[] }>;
    return SERVICE_CATEGORIES.map((category) => ({
      category,
      items: technician.resolvedServices.filter((s) => s.category === category),
    })).filter((g) => g.items.length > 0);
  }, [technician]);

  const totalUnits = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);
  const cartMap = useMemo(() => {
    const m = new Map<string, number>();
    cart.forEach((i) => m.set(i.service.slug, i.quantity));
    return m;
  }, [cart]);

  if (!technician) {
    return <Navigate to="/" replace />;
  }

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.service.slug === service.slug);
      if (existing) {
        return prev.map((i) =>
          i.service.slug === service.slug ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const updateQty = (slug: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.service.slug === slug ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (slug: string) => {
    setCart((prev) => prev.filter((i) => i.service.slug !== slug));
  };

  return (
    <main className={`min-h-screen bg-background ${cart.length > 0 ? "pb-32" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6 md:pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-light text-foreground/70 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <header className="mt-8 flex flex-col items-center text-center md:mt-12">
          {technician.profileImage && (
            <img
              src={technician.profileImage}
              alt={`Foto de ${technician.name}`}
              className="mb-6 h-40 w-40 rounded-full object-cover shadow-md md:h-56 md:w-56"
              loading="lazy"
            />
          )}
          <h1 className="text-3xl font-light tracking-tight text-foreground md:text-5xl">
            {technician.name}
          </h1>
          <p className="mt-2 text-sm font-light text-foreground/60 md:text-base">
            {technician.specialty} · {technician.city}
          </p>
        </header>

        {servicesByCategory.length > 0 && (
          <section aria-label="Servicios" className="mt-10 md:mt-14">
            <h2 className="text-xs font-light uppercase tracking-[0.2em] text-foreground/50">
              Servicios
            </h2>
            <div className="mt-4 space-y-6">
              {servicesByCategory.map((group) => (
                <div key={group.category}>
                  <h3 className="text-sm font-light text-foreground/70">{group.category}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.items.map((service) => {
                      const qty = cartMap.get(service.slug) ?? 0;
                      const inCart = qty > 0;
                      return (
                        <button
                          key={service.slug}
                          type="button"
                          onClick={() => addToCart(service)}
                          className={`rounded-full border px-4 py-1.5 text-sm font-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            inCart
                              ? "border-foreground text-foreground"
                              : "border-border text-foreground/80 hover:border-foreground hover:text-foreground"
                          }`}
                        >
                          {service.name}
                          {inCart && (
                            <span className="ml-2 font-light text-foreground/50">· {qty}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <section aria-label={`Portafolio de ${technician.name}`} className="mt-8 w-full md:mt-12">
        <div className="mx-auto max-w-3xl px-0 md:px-6">
          <div className="grid grid-cols-3 gap-1">
            {technician.gallery.map((image, i) => (
              <button
                key={`${technician.slug}-${i}`}
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group relative block aspect-square w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Abrir foto ${i + 1} de ${technician.gallery.length}`}
              >
                <img
                  src={image}
                  alt={`${technician.name} — trabajo ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent className="max-w-3xl border-0 bg-background p-2 md:p-4">
          {openIndex !== null && (
            <div className="flex flex-col items-center gap-3">
              <img
                src={technician.gallery[openIndex]}
                alt={`${technician.name} — trabajo ${openIndex + 1}`}
                className="block h-auto max-h-[85vh] w-full object-contain"
              />
              <p className="text-xs font-light text-foreground/50">
                Foto {openIndex + 1} de {technician.gallery.length}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CaseUploadDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cart={cart}
        technician={{ name: technician.name, city: technician.city }}
        onSubmitted={() => setCart([])}
      />

      {cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:px-6">
            <div className="flex-1 overflow-x-auto">
              <ul className="flex gap-3 md:gap-4">
                {cart.map((item) => (
                  <li
                    key={item.service.slug}
                    className="flex flex-shrink-0 items-center gap-2 rounded-full border border-border px-3 py-1"
                  >
                    <span className="text-sm font-light text-foreground/80">
                      {item.service.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateQty(item.service.slug, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-foreground hover:text-foreground"
                        aria-label="Reducir"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[1.25rem] text-center text-sm font-light tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.service.slug, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-foreground hover:text-foreground"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.service.slug)}
                      className="ml-1 text-foreground/40 transition-colors hover:text-foreground"
                      aria-label="Quitar"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between gap-3 md:justify-end">
              <span className="text-xs font-light uppercase tracking-[0.15em] text-foreground/50">
                {totalUnits} {totalUnits === 1 ? "caso" : "casos"}
              </span>
              <Button onClick={() => setCheckoutOpen(true)}>Solicitar ({totalUnits})</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TechnicianProfile;
