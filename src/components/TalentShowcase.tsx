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

      {/* Overlay desktop (hover) */}
      <div className="pointer-events-none absolute inset-0 hidden bg-foreground/0 backdrop-blur-0 transition-all duration-300 ease-out group-hover:bg-foreground/15 group-hover:backdrop-blur-[2px] md:block" />

      {/* Info desktop: aparece desde abajo en hover */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 px-4 pb-4 pt-10 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:block">
        <div className="bg-gradient-to-t from-foreground/60 to-transparent absolute inset-0 -z-10" />
        <p className="text-[13px] font-medium leading-tight text-background">
          {tech.name}
        </p>
        <p className="mt-0.5 text-[11px] font-light text-background/75">
          {tech.specialty}
        </p>
        <p className="mt-0.5 text-[10px] font-light tracking-wide text-background/55">
          {tech.city}
        </p>
      </div>

      {/* Info móvil: siempre visible con degradado sutil */}
      <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-12 md:hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-foreground/55 via-foreground/15 to-transparent" />
        <p className="text-[12px] font-medium leading-tight text-background">
          {tech.name}
        </p>
        <p className="text-[10px] font-light text-background/80">
          {tech.specialty}
        </p>
        <p className="text-[9px] font-light tracking-wide text-background/60">
          {tech.city}
        </p>
      </div>
    </div>
  );
};

const TalentShowcase = () => {
  return (
    <section aria-label="Talent Showcase" className="w-full">
      <div className="py-8 md:py-12">
        <p className="text-center text-[10px] font-light uppercase tracking-[0.35em] text-foreground/40">
          Talent Showcase
        </p>
      </div>

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
