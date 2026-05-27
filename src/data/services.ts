export type ServiceCategory =
  | "Aesthetic Anterior Dentistry"
  | "Posterior Dentistry"
  | "Implant Dentistry";

export type Service = {
  slug: string;
  name: string;
  category: ServiceCategory;
  price_per_unit: number;
};

export const services: Service[] = [
  // Aesthetic Anterior Dentistry
  { slug: "cadcam-veneers", name: "CAD/CAM Veneers Design", category: "Aesthetic Anterior Dentistry", price_per_unit: 85 },
  { slug: "cadcam-crown-anterior", name: "CAD/CAM Crown Design (Anterior)", category: "Aesthetic Anterior Dentistry", price_per_unit: 75 },
  { slug: "mockup-dsd", name: "Mock-Up (Digital Smile Design)", category: "Aesthetic Anterior Dentistry", price_per_unit: 120 },
  { slug: "wax-up", name: "Wax-Up (Diagnostic)", category: "Aesthetic Anterior Dentistry", price_per_unit: 60 },
  // Posterior Dentistry
  { slug: "inlays", name: "Inlays", category: "Posterior Dentistry", price_per_unit: 55 },
  { slug: "onlays", name: "Onlays", category: "Posterior Dentistry", price_per_unit: 65 },
  { slug: "overlays", name: "Overlays", category: "Posterior Dentistry", price_per_unit: 70 },
  // Implant Dentistry
  { slug: "surgical-guide", name: "Surgical Guide (Implant Guide)", category: "Implant Dentistry", price_per_unit: 180 },
  { slug: "surgical-guide-crown", name: "Surgical Guide + Crown Design", category: "Implant Dentistry", price_per_unit: 240 },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Aesthetic Anterior Dentistry",
  "Posterior Dentistry",
  "Implant Dentistry",
];

export const getServicesBySlugs = (slugs: string[]): Service[] =>
  slugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));

export const PLATFORM_FEE_RATE = 0.1;

export const getServicePrice = (slug: string): number =>
  services.find((s) => s.slug === slug)?.price_per_unit ?? 0;
