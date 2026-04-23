import { services } from "@/data/services";

export const isImplantService = (slug: string): boolean =>
  services.find((s) => s.slug === slug)?.category === "Implant Dentistry";
