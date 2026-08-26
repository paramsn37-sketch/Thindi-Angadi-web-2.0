import { regions } from "./catalog";

export type Place = {
  slug: string;
  name: string;
  x: number;
  y: number;
  blurb: string;
  regionSlug: string;
};

export const places: Place[] = [
  {
    slug: "bidar",
    name: "Bidar",
    x: 75.3,
    y: 8.6,
    blurb: "Deccan forts and a plains kitchen where grain and ghee do the talking.",
    regionSlug: "north-karnataka",
  },
  {
    slug: "kalaburagi",
    name: "Kalaburagi",
    x: 64.9,
    y: 23.8,
    blurb: "A dry, wide-open district with snacks built for long, busy days.",
    regionSlug: "north-karnataka",
  },
  {
    slug: "vijayapura",
    name: "Vijayapura",
    x: 36,
    y: 30.1,
    blurb: "Domes on the skyline, millets and jowar on the everyday table.",
    regionSlug: "north-karnataka",
  },
  {
    slug: "belagavi",
    name: "Belagavi",
    x: 13.7,
    y: 39.1,
    blurb: "A border town where three food cultures share one snack shelf.",
    regionSlug: "north-karnataka",
  },
  {
    slug: "dharwad",
    name: "Dharwad",
    x: 30.1,
    y: 47,
    blurb: "A university town known for keeping its sweet-and-savoury balance just right.",
    regionSlug: "north-karnataka",
  },
  {
    slug: "mangaluru",
    name: "Mangaluru",
    x: 17.6,
    y: 69.1,
    blurb: "Coconut, curry leaf and a coastline that shapes every tea-time bite.",
    regionSlug: "coastal-karnataka",
  },
  {
    slug: "tumakuru",
    name: "Tumakuru",
    x: 49.1,
    y: 62.8,
    blurb: "The quiet plains stop between the coast, the hills and the capital.",
    regionSlug: "greater-bengaluru",
  },
  {
    slug: "maddur",
    name: "Maddur",
    x: 74,
    y: 70.2,
    blurb: "The highway halt every Bengaluru–Mysuru traveller stops for, by habit.",
    regionSlug: "greater-bengaluru",
  },
  {
    slug: "mysuru",
    name: "Mysuru",
    x: 43.9,
    y: 74.7,
    blurb: "Palace-city memory sits beside home kitchens and busy market shelves.",
    regionSlug: "mysuru",
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    x: 71.4,
    y: 78.1,
    blurb: "Where every regional thindi in Karnataka finally finds a shelf.",
    regionSlug: "greater-bengaluru",
  },
];

export function regionForPlace(place: Place) {
  return regions.find((r) => r.slug === place.regionSlug)!;
}
