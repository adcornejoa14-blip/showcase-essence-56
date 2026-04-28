import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SERVICE_CATEGORIES, services } from "@/data/services";

const ServiceSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeService = searchParams.get("service");
  const activeServiceObj = services.find((s) => s.slug === activeService);

  const [query, setQuery] = useState(activeServiceObj?.name ?? "");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(activeServiceObj?.name ?? "");
  }, [activeService, activeServiceObj?.name]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    setHighlight(0);
  }, [query, open]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selectService = (slug: string) => {
    setOpen(false);
    navigate(`/?service=${slug}`);
  };

  const clearAll = () => {
    setQuery("");
    navigate("/");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = suggestions[highlight];
      if (pick) selectService(pick.slug);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <section aria-label="Buscar servicio" className="w-full bg-background">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-16 md:py-24">
        <h2 className="text-center text-2xl font-light tracking-tight text-foreground md:text-3xl">
          ¿Qué necesitas?
        </h2>
        <p className="mt-3 text-center text-sm font-light text-foreground/50">
          Busca un servicio y encuentra técnicos especializados.
        </p>

        <div ref={containerRef} className="relative mt-10 w-full">
          <div className="flex items-center gap-3 border-b border-foreground/20 px-1 py-3 transition-colors focus-within:border-foreground/60">
            <Search strokeWidth={1.25} className="h-4 w-4 text-foreground/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Ej. CAD/CAM Veneers, Wax-Up, Surgical Guide…"
              className="flex-1 bg-transparent text-base font-light text-foreground placeholder:text-foreground/30 focus:outline-none md:text-lg"
            />
            {(query || activeService) && (
              <button
                type="button"
                onClick={clearAll}
                aria-label="Borrar búsqueda"
                className="text-foreground/40 hover:text-foreground"
              >
                <X strokeWidth={1.25} className="h-4 w-4" />
              </button>
            )}
          </div>

          {open && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-y-auto border border-foreground/15 bg-background shadow-lg">
              {SERVICE_CATEGORIES.map((category) => {
                const items = suggestions.filter((s) => s.category === category);
                if (items.length === 0) return null;
                return (
                  <div key={category} className="py-2">
                    <p className="px-4 py-1 text-[10px] font-light uppercase tracking-[0.2em] text-foreground/40">
                      {category}
                    </p>
                    <ul>
                      {items.map((s) => {
                        const idxInAll = suggestions.indexOf(s);
                        const isHighlight = idxInAll === highlight;
                        return (
                          <li key={s.slug}>
                            <button
                              type="button"
                              onMouseEnter={() => setHighlight(idxInAll)}
                              onClick={() => selectService(s.slug)}
                              className={`block w-full px-4 py-2 text-left text-sm font-light transition-colors ${
                                isHighlight
                                  ? "bg-foreground/5 text-foreground"
                                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                              }`}
                            >
                              {s.name}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {open && suggestions.length === 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 border border-foreground/15 bg-background px-4 py-3 text-sm font-light text-foreground/50">
              No hay servicios que coincidan.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceSearch;
