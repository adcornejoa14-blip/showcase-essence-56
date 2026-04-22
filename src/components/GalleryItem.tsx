import { useEffect, useRef, useState } from "react";

export type GalleryItemData = {
  image: string;
  name: string;
  specialty: string;
  city: string;
};

type Props = {
  tech: GalleryItemData;
  index: number;
  showLabel?: boolean;
};

const GalleryItem = ({ tech, index, showLabel = true }: Props) => {
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
      className={`group relative aspect-square overflow-hidden transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      style={{ transitionDelay: `${(index % 8) * 60}ms` }}
    >
      <img
        src={tech.image}
        alt={`${tech.name} — ${tech.specialty}`}
        loading="lazy"
        className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      />

      {showLabel && (
        <>
          {/* Degradado inferior solo en móvil para legibilidad del nombre */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-foreground/60 to-transparent md:hidden" />

          {/* Overlay sutil oscurecedor en hover desktop */}
          <div className="pointer-events-none absolute inset-0 hidden bg-foreground/0 transition-colors duration-300 ease-out group-hover:bg-foreground/10 md:block" />

          {/* Etiqueta — siempre visible en móvil (solo nombre), hover en desktop (nombre + especialidad + ciudad) */}
          <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] md:translate-y-1 md:opacity-0 md:transition-all md:duration-300 md:ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <p className="text-[11px] font-medium leading-tight tracking-wide text-background md:text-xs [text-shadow:_0_1px_3px_rgb(0_0_0_/_0.7)]">
              {tech.name}
            </p>
            <p className="mt-0.5 hidden text-[11px] font-light leading-tight text-background/90 md:block [text-shadow:_0_1px_3px_rgb(0_0_0_/_0.7)]">
              {tech.specialty}
            </p>
            <p className="hidden text-[10px] font-light leading-tight tracking-wide text-background/75 md:block [text-shadow:_0_1px_3px_rgb(0_0_0_/_0.7)]">
              {tech.city}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default GalleryItem;
