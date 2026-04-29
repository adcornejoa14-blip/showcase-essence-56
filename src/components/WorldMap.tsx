import { useMemo } from "react";
import { Star } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { technicians } from "@/data/technicians";

type Country = {
  code: string;
  name: string;
  rating: number; // 1-5
  // Coordinates in the SVG viewBox 1000x500 (equirectangular-ish)
  cx: number;
  cy: number;
};

const COUNTRIES: Country[] = [
  { code: "EC", name: "Ecuador", rating: 4.8, cx: 280, cy: 295 },
  { code: "BR", name: "Brasil", rating: 4.9, cx: 360, cy: 330 },
];

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
            <Star
              strokeWidth={1}
              className="absolute inset-0 h-3 w-3 text-foreground/30"
            />
            {(isFull || isHalf) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: isHalf ? "50%" : "100%" }}
              >
                <Star
                  strokeWidth={1}
                  className="h-3 w-3 fill-foreground text-foreground"
                />
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

  const countriesWithCount = useMemo(() => {
    return COUNTRIES.map((c) => ({
      ...c,
      count: technicians.filter((t) =>
        t.city.toLowerCase().includes(c.name.toLowerCase()),
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

        <div className="relative w-full">
          <svg
            viewBox="0 0 1000 500"
            className="h-auto w-full"
            role="img"
            aria-label="Mapa del mundo"
          >
            {/* Ocean background */}
            <rect width="1000" height="500" fill="hsl(var(--background))" />

            {/* Simplified continents — abstract silhouettes */}
            <g
              fill="hsl(var(--foreground) / 0.08)"
              stroke="hsl(var(--foreground) / 0.25)"
              strokeWidth="0.6"
            >
              {/* North America */}
              <path d="M120,110 L210,95 L260,110 L295,135 L305,175 L280,210 L240,225 L210,215 L180,235 L160,225 L140,200 L125,170 Z" />
              {/* Central America */}
              <path d="M240,235 L270,245 L285,265 L275,280 L255,275 L240,255 Z" />
              {/* South America */}
              <path d="M285,275 L320,275 L360,295 L380,335 L370,395 L335,430 L305,420 L295,380 L280,340 L275,305 Z" />
              {/* Greenland */}
              <path d="M340,75 L385,70 L405,90 L395,115 L365,120 L340,105 Z" />
              {/* Europe */}
              <path d="M460,115 L520,110 L555,125 L560,150 L540,170 L505,170 L475,160 L460,140 Z" />
              {/* Africa */}
              <path d="M475,185 L545,180 L585,205 L595,255 L575,310 L545,345 L515,340 L490,300 L475,250 Z" />
              {/* Middle East / West Asia */}
              <path d="M555,165 L615,160 L640,180 L630,210 L595,215 L560,200 Z" />
              {/* Asia */}
              <path d="M615,115 L730,105 L820,120 L860,145 L865,180 L830,205 L780,210 L730,200 L685,195 L645,180 L620,155 Z" />
              {/* Southeast Asia / India */}
              <path d="M685,205 L730,215 L745,250 L725,275 L695,265 L675,235 Z" />
              {/* Indonesia / Philippines (cluster of small islands) */}
              <path d="M790,260 L820,255 L835,270 L815,285 L790,278 Z" />
              <path d="M845,240 L865,238 L870,255 L850,260 Z" />
              {/* Australia */}
              <path d="M820,335 L880,325 L905,345 L895,380 L855,390 L820,375 Z" />
              {/* New Zealand */}
              <path d="M915,395 L935,390 L940,410 L920,415 Z" />
              {/* Japan */}
              <path d="M870,150 L885,145 L890,170 L875,178 Z" />
              {/* British Isles */}
              <path d="M450,125 L465,123 L468,142 L452,145 Z" />
              {/* Madagascar */}
              <path d="M610,305 L620,300 L625,330 L613,335 Z" />
              {/* Iceland */}
              <path d="M425,90 L445,88 L448,102 L428,105 Z" />
            </g>

            {/* Pins for available countries */}
            {countriesWithCount.map((c) => {
              const isActive = activeCountry === c.code;
              return (
                <g
                  key={c.code}
                  onClick={() => selectCountry(isActive ? null : c.code)}
                  className="cursor-pointer"
                  style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
                >
                  {/* Pulse ring */}
                  <circle
                    cx={c.cx}
                    cy={c.cy}
                    r={isActive ? 18 : 14}
                    fill="hsl(var(--foreground) / 0.08)"
                    className="transition-all duration-300"
                  />
                  <circle
                    cx={c.cx}
                    cy={c.cy}
                    r={isActive ? 7 : 5}
                    fill="hsl(var(--foreground))"
                    stroke="hsl(var(--background))"
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>

          {/* Country cards (rendered as HTML overlays for crisp text) */}
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
                    <p className="mt-1 text-base font-light text-foreground">
                      {c.name}
                    </p>
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
      </div>
    </section>
  );
};

export default WorldMap;
