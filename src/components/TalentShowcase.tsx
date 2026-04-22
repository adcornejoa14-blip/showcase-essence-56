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

      {/* Overlay sutil solo en hover desktop */}
      <div className="pointer-events-none absolute inset-0 hidden bg-foreground/0 transition-colors duration-300 ease-out group-hover:bg-foreground/10 md:block" />

      {/* Etiqueta permanente con nombre — se expande en hover desktop */}
      <div className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] rounded-sm bg-foreground/55 px-2.5 py-1 backdrop-blur-sm transition-all duration-300 ease-out">
        <p className="text-[11px] font-medium leading-tight tracking-wide text-background md:text-xs">
          {tech.name}
        </p>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out md:group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="mt-0.5 text-[10px] font-light leading-tight text-background/85 md:text-[11px]">
              {tech.specialty}
            </p>
            <p className="text-[9px] font-light leading-tight tracking-wide text-background/65 md:text-[10px]">
              {tech.city}
            </p>
          </div>
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
