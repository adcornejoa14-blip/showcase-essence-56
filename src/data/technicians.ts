import cadImplante from "@/assets/gallery/cad-implante.jpg";
import scanSuperior from "@/assets/gallery/scan-superior.png";
import cadArcadaPilar from "@/assets/gallery/cad-arcada-pilar.jpg";
import ceramicaMacro from "@/assets/gallery/ceramica-macro.jpg";
import waxUpFirma from "@/assets/gallery/wax-up-firma.jpg";
import waxUpLineas from "@/assets/gallery/wax-up-lineas.jpg";
import pilarImplante from "@/assets/gallery/pilar-implante.jpg";
import tecnicoLupa from "@/assets/gallery/tecnico-lupa.jpg";
import coronasOpal from "@/assets/gallery/coronas-opal.jpg";
import arcadaPulida from "@/assets/gallery/arcada-pulida.jpg";
import arcadaBrillante from "@/assets/gallery/arcada-brillante.jpg";
import tecnicoPincel from "@/assets/gallery/tecnico-pincel.jpg";

export type Technician = {
  image: string;
  name: string;
  specialty: string;
  city: string;
};

// Orden mezclado: Ecuador y Brasil intercalados, sin piezas del mismo técnico consecutivas.
export const technicians: Technician[] = [
  {
    image: cadImplante,
    name: "Santiago Guerra",
    specialty: "Técnico Dental",
    city: "Guayaquil, Ecuador",
  },
  {
    image: pilarImplante,
    name: "Ricardo Malise",
    specialty: "Técnico Dental",
    city: "Praia Brava, Brasil",
  },
  {
    image: ceramicaMacro,
    name: "Raúl Guerra",
    specialty: "Técnico Dental",
    city: "Guayaquil, Ecuador",
  },
  {
    image: arcadaBrillante,
    name: "Luiz Varelas",
    specialty: "Técnico Dental",
    city: "Praia Brava, Brasil",
  },
  {
    image: scanSuperior,
    name: "Santiago Guerra",
    specialty: "Técnico Dental",
    city: "Guayaquil, Ecuador",
  },
  {
    image: tecnicoLupa,
    name: "Ricardo Malise",
    specialty: "Técnico Dental",
    city: "Praia Brava, Brasil",
  },
  {
    image: waxUpFirma,
    name: "Raúl Guerra",
    specialty: "Técnico Dental",
    city: "Guayaquil, Ecuador",
  },
  {
    image: tecnicoPincel,
    name: "Luiz Varelas",
    specialty: "Técnico Dental",
    city: "Praia Brava, Brasil",
  },
  {
    image: cadArcadaPilar,
    name: "Santiago Guerra",
    specialty: "Técnico Dental",
    city: "Guayaquil, Ecuador",
  },
  {
    image: coronasOpal,
    name: "Ricardo Malise",
    specialty: "Técnico Dental",
    city: "Praia Brava, Brasil",
  },
  {
    image: waxUpLineas,
    name: "Raúl Guerra",
    specialty: "Técnico Dental",
    city: "Guayaquil, Ecuador",
  },
  {
    image: arcadaPulida,
    name: "Luiz Varelas",
    specialty: "Técnico Dental",
    city: "Praia Brava, Brasil",
  },
];
