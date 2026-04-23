export type ServiceCategory =
  | "Aesthetic Anterior Dentistry"
  | "Posterior Dentistry"
  | "Implant Dentistry";

export type Service = { slug: string; name: string; category: ServiceCategory };

export const services: Service[] = [
  // Aesthetic Anterior Dentistry
  { slug: "cadcam-veneers", name: "CAD/CAM Veneers Design", category: "Aesthetic Anterior Dentistry" },
  { slug: "cadcam-crown-anterior", name: "CAD/CAM Crown Design (Anterior)", category: "Aesthetic Anterior Dentistry" },
  { slug: "mockup-dsd", name: "Mock-Up (Digital Smile Design)", category: "Aesthetic Anterior Dentistry" },
  { slug: "wax-up", name: "Wax-Up (Diagnostic)", category: "Aesthetic Anterior Dentistry" },
  // Posterior Dentistry
  { slug: "inlays", name: "Inlays", category: "Posterior Dentistry" },
  { slug: "onlays", name: "Onlays", category: "Posterior Dentistry" },
  { slug: "overlays", name: "Overlays", category: "Posterior Dentistry" },
  // Implant Dentistry
  { slug: "surgical-guide", name: "Surgical Guide (Implant Guide)", category: "Implant Dentistry" },
  { slug: "surgical-guide-crown", name: "Surgical Guide + Crown Design", category: "Implant Dentistry" },
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
