// Purely cosmetic category -> color mapping for the storefront's product
// tiles, since there are no real product images.

export const CATEGORY_GRADIENT: Record<string, string> = {
  Electronics: "linear-gradient(135deg, #2563a8 0%, #173f6b 100%)",
  Home: "linear-gradient(135deg, #c8912f 0%, #8f6015 100%)",
  Apparel: "linear-gradient(135deg, #b5573f 0%, #7c3626 100%)",
  Fitness: "linear-gradient(135deg, #2f8f63 0%, #1a5c3e 100%)",
  Outdoor: "linear-gradient(135deg, #17705f 0%, #0d443a 100%)",
};

export function gradientFor(category: string): string {
  return CATEGORY_GRADIENT[category] ?? "linear-gradient(135deg, #6f6858 0%, #443f34 100%)";
}
