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

export type Technician = {
  image: string;
  name: string;
  specialty: string;
  city: string;
};

const SANTIAGO = { name: "Santiago Guerra", specialty: "Técnico Dental", city: "Guayaquil, Ecuador" };
const RAUL = { name: "Raúl Guerra", specialty: "Técnico Dental", city: "Guayaquil, Ecuador" };
const RICARDO = { name: "Ricardo Malise", specialty: "Técnico Dental", city: "Praia Brava, Brasil" };
const LUIZ = { name: "Luiz Varelas", specialty: "Técnico Dental", city: "Praia Brava, Brasil" };

// Orden mezclado: Ecuador y Brasil intercalados, sin piezas del mismo técnico consecutivas.
export const technicians: Technician[] = [
  { image: arcadaCera, ...SANTIAGO },
  { image: cadArcadaPilar, ...LUIZ },
  { image: cadArcadaAmarillo, ...RAUL },
  { image: tecnicoLupa2, ...RICARDO },
  { image: dosTecnicosLampara, ...SANTIAGO },
  { image: waxUpLineas, ...LUIZ },
  { image: waxUpDetalle, ...RAUL },
  { image: ceramicaRosa, ...RICARDO },
  { image: coronasCentrales, ...SANTIAGO },
  { image: tecnicoPincel, ...LUIZ },
  { image: tecnicoTrabajando, ...RAUL },
  { image: coronasOpalescencia, ...RICARDO },
  { image: arcadaBrillante, ...LUIZ },
  { image: arcadaSuperior, ...RICARDO },
  { image: arcadaRender, ...RAUL },
  { image: coronaPilar, ...RICARDO },
  { image: coronasOpal, ...LUIZ },
];
