import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getTechnicianBySlug } from "@/data/technicians";
import { SERVICE_CATEGORIES, type Service } from "@/data/services";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TechnicianProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const technician = slug ? getTechnicianBySlug(slug) : undefined;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (technician) {
      document.title = `${technician.name} — Portafolio`;
    }
  }, [slug, technician]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const servicesByCategory = useMemo(() => {
    if (!technician) return [] as Array<{ category: string; items: Service[] }>;
    return SERVICE_CATEGORIES.map((category) => ({
      category,
      items: technician.resolvedServices.filter((s) => s.category === category),
    })).filter((g) => g.items.length > 0);
  }, [technician]);

  if (!technician) {
    return <Navigate to="/" replace />;
  }

  const handleConfirm = () => {
    if (!selectedService) return;
    toast.success("Solicitud enviada (demo)");
    setSelectedService(null);
  };

  return (
    <main className="min-h-screen bg-background">
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
                    {group.items.map((service) => (
                      <button
                        key={service.slug}
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className="rounded-full border border-border px-4 py-1.5 text-sm font-light text-foreground/80 transition-colors hover:border-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {service.name}
                      </button>
                    ))}
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

      <Dialog
        open={selectedService !== null}
        onOpenChange={(open) => !open && setSelectedService(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-light">Solicitar servicio</DialogTitle>
            <DialogDescription className="font-light">
              ¿Quieres solicitar "{selectedService?.name}" a {technician.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setSelectedService(null)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>Confirmar solicitud</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="py-12" />
    </main>
  );
};

export default TechnicianProfile;
