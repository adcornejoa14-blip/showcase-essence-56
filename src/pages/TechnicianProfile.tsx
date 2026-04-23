import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getTechnicianBySlug } from "@/data/technicians";
import GalleryItem from "@/components/GalleryItem";

const TechnicianProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const technician = slug ? getTechnicianBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (technician) {
      document.title = `${technician.name} — Portafolio`;
    }
  }, [slug, technician]);

  if (!technician) {
    return <Navigate to="/" replace />;
  }

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
      </div>

      <section aria-label={`Portafolio de ${technician.name}`} className="mt-8 w-full md:mt-12">
        <div className="px-2 md:px-1">
          <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
            {technician.gallery.map((image, i) => (
              <GalleryItem
                key={`${technician.slug}-${i}`}
                tech={{
                  image,
                  name: technician.name,
                  specialty: technician.specialty,
                  city: technician.city,
                }}
                index={i}
                showLabel={false}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="py-12" />
    </main>
  );
};

export default TechnicianProfile;
