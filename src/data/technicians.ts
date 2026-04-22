import cadImplante from "@/assets/gallery/cad-implante.jpg";
import tecnicoPinzas from "@/assets/gallery/tecnico-pinzas.jpg";
import ceramicaMacro from "@/assets/gallery/ceramica-macro.jpg";
import scanSuperior from "@/assets/gallery/scan-superior.png";
import dosTecnicos from "@/assets/gallery/dos-tecnicos.jpg";
import waxUpFirma from "@/assets/gallery/wax-up-firma.jpg";
import tecnicoLupa from "@/assets/gallery/tecnico-lupa.jpg";
import pilarImplante from "@/assets/gallery/pilar-implante.jpg";
import arcadaPulida from "@/assets/gallery/arcada-pulida.jpg";

export type Technician = {
  image: string;
  name: string;
  specialty: string;
  city: string;
};

// Orden mezclado a propósito: render → foto → macro → escaneo → foto…
export const technicians: Technician[] = [
  {
    image: cadImplante,
    name: "Carlos Ruiz",
    specialty: "Diseño CAD/CAM",
    city: "Barcelona",
  },
  {
    image: tecnicoPinzas,
    name: "Javier Soto",
    specialty: "Estratificación Cerámica",
    city: "Sevilla",
  },
  {
    image: ceramicaMacro,
    name: "Laura Vidal",
    specialty: "Estética Dental",
    city: "Bilbao",
  },
  {
    image: scanSuperior,
    name: "Lucía Castro",
    specialty: "Escaneado Intraoral",
    city: "Valladolid",
  },
  {
    image: dosTecnicos,
    name: "Ana López & Hugo Martín",
    specialty: "Trabajo en Equipo",
    city: "Madrid",
  },
  {
    image: waxUpFirma,
    name: "María Fernández",
    specialty: "Wax-Up Diagnóstico",
    city: "Valencia",
  },
  {
    image: tecnicoLupa,
    name: "Pablo Moreno",
    specialty: "Caracterización Bajo Lupa",
    city: "Zaragoza",
  },
  {
    image: pilarImplante,
    name: "Diego Navarro",
    specialty: "Pilares sobre Implante",
    city: "Granada",
  },
  {
    image: arcadaPulida,
    name: "Sara Gómez",
    specialty: "Coronas Zirconio",
    city: "Málaga",
  },
];
