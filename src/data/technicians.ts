// Santiago Guerra (Guayaquil, Ecuador)
import arcadaCera from "@/assets/gallery/arcada-cera.png";
import dosTecnicosLampara from "@/assets/gallery/dos-tecnicos-lampara.jpg";
import coronasCentrales from "@/assets/gallery/coronas-centrales.png";

// Raúl Guerra (Guayaquil, Ecuador)
import cadArcadaAmarillo from "@/assets/gallery/cad-arcada-amarillo.jpg";
import waxUpDetalle from "@/assets/gallery/wax-up-detalle.jpg";
import tecnicoTrabajando from "@/assets/gallery/tecnico-trabajando.jpg";
import arcadaRender from "@/assets/gallery/arcada-render.png";

// Ricardo Malise (Praia Brava, Brasil)
import tecnicoLupa2 from "@/assets/gallery/tecnico-lupa-2.jpg";
import ceramicaRosa from "@/assets/gallery/ceramica-rosa.jpg";
import coronasOpalescencia from "@/assets/gallery/coronas-opalescencia.jpg";
import arcadaSuperior from "@/assets/gallery/arcada-superior.jpg";
import coronaPilar from "@/assets/gallery/corona-pilar.jpg";

// Luiz Varelas (Praia Brava, Brasil)
import cadArcadaPilar from "@/assets/gallery/cad-arcada-pilar.jpg";
import waxUpLineas from "@/assets/gallery/wax-up-lineas.jpg";
import tecnicoPincel from "@/assets/gallery/tecnico-pincel.jpg";
import arcadaBrillante from "@/assets/gallery/arcada-brillante.jpg";
import coronasOpal from "@/assets/gallery/coronas-opal.jpg";

export type TechnicianInfo = {
  slug: string;
  name: string;
  specialty: string;
  city: string;
};

export type Technician = TechnicianInfo & {
  image: string;
  isPerson?: boolean;
};

const SANTIAGO: TechnicianInfo = { slug: "santiago-guerra", name: "Santiago Guerra", specialty: "Técnico Dental", city: "Guayaquil, Ecuador" };
const RAUL: TechnicianInfo = { slug: "raul-guerra", name: "Raúl Guerra", specialty: "Técnico Dental", city: "Guayaquil, Ecuador" };
const RICARDO: TechnicianInfo = { slug: "ricardo-malise", name: "Ricardo Malise", specialty: "Técnico Dental", city: "Praia Brava, Brasil" };
const LUIZ: TechnicianInfo = { slug: "luiz-varelas", name: "Luiz Varelas", specialty: "Técnico Dental", city: "Praia Brava, Brasil" };

// Orden mezclado: Ecuador y Brasil intercalados, sin piezas del mismo técnico consecutivas.
export const technicians: Technician[] = [
  { image: arcadaCera, ...SANTIAGO },
  { image: cadArcadaPilar, ...LUIZ },
  { image: cadArcadaAmarillo, ...RAUL },
  { image: tecnicoLupa2, ...RICARDO, isPerson: true },
  { image: dosTecnicosLampara, ...SANTIAGO, isPerson: true },
  { image: waxUpLineas, ...LUIZ },
  { image: waxUpDetalle, ...RAUL },
  { image: ceramicaRosa, ...RICARDO },
  { image: coronasCentrales, ...SANTIAGO },
  { image: tecnicoPincel, ...LUIZ, isPerson: true },
  { image: tecnicoTrabajando, ...RAUL, isPerson: true },
  { image: coronasOpalescencia, ...RICARDO },
  { image: arcadaBrillante, ...LUIZ },
  { image: arcadaSuperior, ...RICARDO },
  { image: arcadaRender, ...RAUL },
  { image: coronaPilar, ...RICARDO },
  { image: coronasOpal, ...LUIZ },
];

export type TechnicianProfile = TechnicianInfo & {
  images: string[];
};

const ALL_TECHNICIANS: TechnicianInfo[] = [SANTIAGO, RAUL, RICARDO, LUIZ];

export const getTechnicianBySlug = (slug: string): TechnicianProfile | undefined => {
  const info = ALL_TECHNICIANS.find((t) => t.slug === slug);
  if (!info) return undefined;
  const items = technicians.filter((t) => t.slug === slug);
  const persons = items.filter((t) => t.isPerson);
  const rest = items.filter((t) => !t.isPerson);
  const images = [...persons, ...rest].map((t) => t.image);
  return { ...info, images };
};
