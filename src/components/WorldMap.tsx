import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { technicians } from "@/data/technicians";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Country = {
  code: string; // our internal code
  geoName: string; // matches topojson "name" property
  label: string;
  rating: number; // 1-5
  coords: [number, number]; // [lng, lat]
};

const COUNTRIES: Country[] = [
  { code: "EC", geoName: "Ecuador", label: "Ecuador", rating: 4.8, coords: [-78.5, -1.5] },
  { code: "BR", geoName: "Brazil", label: "Brasil", rating: 4.9, coords: [-51.9, -14.2] },
];

const NAME_AVAILABLE = new Set(COUNTRIES.map((c) => c.geoName));

const StarRow = ({ value }: { value: number }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < full;
        const isHalf = i === full && half;
        return (
          <div key={i} className="relative h-3 w-3">
            <Star strokeWidth={1} className="absolute inset-0 h-3 w-3 text-foreground/25" />
            {(isFull || isHalf) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: isHalf ? "50%" : "100%" }}
              >
                <Star strokeWidth={1} className="h-3 w-3 fill-foreground text-foreground" />
              </div>
            )}
          </div>
        );
      })}
      <span className="ml-1.5 text-[10px] font-light tracking-wide text-foreground/60">
        {value.toFixed(1)}
      </span>
    </div>
  );
};

const WorldMap = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCountry = searchParams.get("country");
  const [hoverName, setHoverName] = useState<string | null>(null);

  const countriesWithCount = useMemo(() => {
    return COUNTRIES.map((c) => ({
      ...c,
      count: technicians.filter((t) =>
        t.city.toLowerCase().includes(c.label.toLowerCase()),
      ).length,
    }));
  }, []);

  const selectCountry = (code: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (code) params.set("country", code);
    else params.delete("country");
    const qs = params.toString();
    navigate(qs ? `/?${qs}` : "/");
  };

  return (
    <section aria-label="Selecciona un país" className="w-full bg-background">
      <div className="mx-auto max-w-5xl px-5 py-10 md:py-16">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-light uppercase tracking-[0.3em] text-foreground/40">
            Curado por NOMA Digital Studio
          </p>
          <h2 className="mt-3 text-2xl font-light tracking-tight text-foreground md:text-3xl">
            Elige el origen de tus técnicos
          </h2>
          <p className="mt-3 text-sm font-light text-foreground/50">
            Cada país está revisado y puntuado por nuestro equipo.
          </p>
        </div>

        <div className="relative w-full overflow-hidden border border-foreground/10 bg-foreground/[0.015]">
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 165 }}
            width={980}
            height={500}
            style={{ width: "100%", height: "auto" }}
          >
            <ZoomableGroup center={[-30, -10]} zoom={1.1} maxZoom={1.1} minZoom={1.1}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = (geo.properties as { name?: string }).name || "";
                    const isAvailable = NAME_AVAILABLE.has(name);
                    const matchedCode = COUNTRIES.find((c) => c.geoName === name)?.code;
                    const isActive = matchedCode && activeCountry === matchedCode;
                    const isHover = hoverName === name;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => isAvailable && setHoverName(name)}
                        onMouseLeave={() => setHoverName(null)}
                        onClick={() => {
                          if (isAvailable && matchedCode) {
                            selectCountry(isActive ? null : matchedCode);
                          }
                        }}
                        style={{
                          default: {
                            fill: isActive
                              ? "hsl(var(--foreground) / 0.55)"
                              : isAvailable
                                ? isHover
                                  ? "hsl(var(--foreground) / 0.35)"
                                  : "hsl(var(--foreground) / 0.18)"
                                : "hsl(var(--foreground) / 0.06)",
                            stroke: "hsl(var(--background))",
                            strokeWidth: 0.4,
                            outline: "none",
                            cursor: isAvailable ? "pointer" : "default",
                            transition: "fill 200ms ease",
                          },
                          hover: { outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {countriesWithCount.map((c) => {
                const isActive = activeCountry === c.code;
                return (
                  <Marker
                    key={c.code}
                    coordinates={c.coords}
                    onClick={() => selectCountry(isActive ? null : c.code)}
                    style={{
                      default: { cursor: "pointer" },
                      hover: { cursor: "pointer" },
                      pressed: { cursor: "pointer" },
                    }}
                  >
                    <circle
                      r={isActive ? 9 : 7}
                      fill="hsl(var(--foreground) / 0.12)"
                    />
                    <circle
                      r={isActive ? 4 : 3}
                      fill="hsl(var(--foreground))"
                      stroke="hsl(var(--background))"
                      strokeWidth={1}
                    />
                    <text
                      textAnchor="middle"
                      y={-12}
                      style={{
                        fontFamily: "inherit",
                        fontSize: 9,
                        fontWeight: 300,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        fill: "hsl(var(--foreground))",
                      }}
                    >
                      {c.label}
                    </text>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Country cards */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {countriesWithCount.map((c) => {
            const isActive = activeCountry === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => selectCountry(isActive ? null : c.code)}
                className={`group flex items-center justify-between border px-5 py-4 text-left transition-colors ${
                  isActive
                    ? "border-foreground/60 bg-foreground/5"
                    : "border-foreground/15 hover:border-foreground/40"
                }`}
              >
                <div>
                  <p className="text-[10px] font-light uppercase tracking-[0.2em] text-foreground/40">
                    {c.code}
                  </p>
                  <p className="mt-1 text-base font-light text-foreground">{c.label}</p>
                  <p className="mt-1 text-xs font-light text-foreground/50">
                    {c.count} {c.count === 1 ? "técnico" : "técnicos"}
                  </p>
                </div>
                <StarRow value={c.rating} />
              </button>
            );
          })}
        </div>

        {activeCountry && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => selectCountry(null)}
              className="text-xs font-light tracking-wide text-foreground/40 underline-offset-4 hover:text-foreground/70 hover:underline"
            >
              Quitar filtro de país
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorldMap;
