import { services } from "@/data/services";

export const isImplantService = (slug: string): boolean =>
  services.find((s) => s.slug === slug)?.category === "Implant Dentistry";

// Servicios donde la cantidad del carrito = piezas para el mismo paciente
// (en lugar de casos independientes con paciente distinto)
const PER_TOOTH_SLUGS = new Set<string>([
  "cadcam-veneers",
  "cadcam-crown-anterior",
  "mockup-dsd",
  "wax-up",
  "inlays",
  "onlays",
  "overlays",
  "surgical-guide-crown",
]);

export const isPerToothService = (slug: string): boolean => PER_TOOTH_SLUGS.has(slug);
