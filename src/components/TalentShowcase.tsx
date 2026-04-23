import { Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { technicians } from "@/data/technicians";
import GalleryItem from "@/components/GalleryItem";

const TalentShowcase = () => {
  const [searchParams] = useSearchParams();
  const activeService = searchParams.get("service");

  const filtered = useMemo(() => {
    if (!activeService) return technicians;
    return technicians.filter((t) => t.services.includes(activeService));
  }, [activeService]);

  return (
    <section aria-label="Talent Showcase" className="w-full">
      <div className="py-4 md:py-6" />

      <div className="px-2 md:px-1">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-sm font-light text-foreground/50">
            No hay técnicos disponibles para este servicio todavía.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((tech, i) => (
              <Link
                key={`${tech.name}-${i}`}
                to={`/tecnico/${tech.slug}`}
                aria-label={`Ver portafolio de ${tech.name}`}
                className="block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
              >
                <GalleryItem tech={tech} index={i} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TalentShowcase;
