import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getTechnicianBySlug } from "@/data/technicians";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="flex flex-col gap-6 md:gap-10">
            {technician.gallery.map((image, i) => (
              <img
                key={`${technician.slug}-${i}`}
                src={image}
                alt={`${technician.name} — trabajo ${i + 1}`}
                loading="lazy"
                className="block h-auto w-full"
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
