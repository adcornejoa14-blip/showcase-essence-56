import { Link } from "react-router-dom";
import { technicians } from "@/data/technicians";
import GalleryItem from "@/components/GalleryItem";

const TalentShowcase = () => {
  return (
    <section aria-label="Talent Showcase" className="w-full">
      <div className="py-4 md:py-6" />

      <div className="px-2 md:px-1">
        <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
          {technicians.map((tech, i) => (
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
      </div>
    </section>
  );
};

export default TalentShowcase;
