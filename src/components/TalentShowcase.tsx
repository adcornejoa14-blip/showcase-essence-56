import { useEffect, useRef, useState } from "react";
import { technicians, type Technician } from "@/data/technicians";

const GalleryItem = ({ tech, index }: { tech: Technician; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative mb-1 break-inside-avoid overflow-hidden transition-all duration-700 ease-out md:mb-1 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      style={{ transitionDelay: `${(index % 8) * 60}ms` }}
    >
      <img
        src={tech.image}
        alt={`${tech.name} — ${tech.specialty}`}
        loading="lazy"
        className="block w-full h-auto"
      />

      {/* Degradado inferior solo en móvil para legibilidad del nombre */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-foreground/60 to-transparent md:hidden" />

      {/* Overlay sutil oscurecedor en hover desktop */}
      <div className="pointer-events-none absolute inset-0 hidden bg-foreground/0 transition-colors duration-300 ease-out group-hover:bg-foreground/10 md:block" />

      {/* Etiqueta — siempre visible en móvil (solo nombre), hover en desktop (nombre + especialidad + ciudad) */}
      <div className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] md:translate-y-1 md:opacity-0 md:transition-all md:duration-300 md:ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100">
        <div className="rounded-sm bg-foreground/55 px-2.5 py-1 backdrop-blur-sm">
          <p className="text-[11px] font-medium leading-tight tracking-wide text-background md:text-xs">
            {tech.name}
          </p>
          <p className="mt-0.5 hidden text-[11px] font-light leading-tight text-background/85 md:block">
            {tech.specialty}
          </p>
          <p className="hidden text-[10px] font-light leading-tight tracking-wide text-background/65 md:block">
            {tech.city}
          </p>
        </div>
      </div>
    </div>
  );
};

const TalentShowcase = () => {
  return (
    <section aria-label="Talent Showcase" className="w-full">
      <div className="py-4 md:py-6" />

      <div className="px-2 md:px-1">
        <div className="columns-2 gap-1 md:columns-3 md:gap-1 lg:columns-4">
          {technicians.map((tech, i) => (
            <GalleryItem key={`${tech.name}-${i}`} tech={tech} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TalentShowcase;
