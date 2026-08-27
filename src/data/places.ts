import { regions } from "./catalog";
import { asset } from "@/lib/paths";

export type Place = {
  slug: string;
  name: string;
  x: number;
  y: number;
  blurb: string;
  regionSlug: string;
  image: string;
};

export const places: Place[] = [
  {
    slug: "bidar",
    name: "Bidar",
    x: 74.4,
    y: 11.8,
    blurb: "Deccan forts and a plains kitchen where grain and ghee do the talking.",
    regionSlug: "north-karnataka",
    image: asset("/assets/place-bidar.webp"),
  },
  {
    slug: "kalaburagi",
    name: "Kalaburagi",
    x: 64.6,
    y: 26,
    blurb: "A dry, wide-open district with snacks built for long, busy days.",
    regionSlug: "north-karnataka",
    image: asset("/assets/place-kalaburagi.webp"),
  },
  {
    slug: "vijayapura",
    name: "Vijayapura",
    x: 37.8,
    y: 31.8,
    blurb: "Domes on the skyline, millets and jowar on the everyday table.",
    regionSlug: "north-karnataka",
    image: asset("/assets/place-vijayapura.webp"),
  },
  {
    slug: "belagavi",
    name: "Belagavi",
    x: 17,
    y: 40.2,
    blurb: "A border town where three food cultures share one snack shelf.",
    regionSlug: "north-karnataka",
    image: asset("/assets/place-belagavi.webp"),
  },
  {
    slug: "dharwad",
    name: "Dharwad",
    x: 32.3,
    y: 47.6,
    blurb: "A university town known for keeping its sweet-and-savoury balance just right.",
    regionSlug: "north-karnataka",
    image: asset("/assets/place-dharwad.webp"),
  },
  {
    slug: "mangaluru",
    name: "Mangaluru",
    x: 20.7,
    y: 68.2,
    blurb: "Coconut, curry leaf and a coastline that shapes every tea-time bite.",
    regionSlug: "coastal-karnataka",
    image: asset("/assets/place-mangaluru.webp"),
  },
  {
    slug: "tumakuru",
    name: "Tumakuru",
    x: 50,
    y: 62.4,
    blurb: "The quiet plains stop between the coast, the hills and the capital.",
    regionSlug: "greater-bengaluru",
    image: asset("/assets/place-tumakuru.webp"),
  },
  {
    slug: "maddur",
    name: "Maddur",
    x: 73.2,
    y: 69.2,
    blurb: "The highway halt every Bengaluru–Mysuru traveller stops for, by habit.",
    regionSlug: "greater-bengaluru",
    image: asset("/assets/place-maddur.webp"),
  },
  {
    slug: "mysuru",
    name: "Mysuru",
    x: 45.1,
    y: 73.4,
    blurb: "Palace-city memory sits beside home kitchens and busy market shelves.",
    regionSlug: "mysuru",
    image: asset("/assets/place-mysuru.webp"),
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    x: 70.7,
    y: 76.6,
    blurb: "Where every regional thindi in Karnataka finally finds a shelf.",
    regionSlug: "greater-bengaluru",
    image: asset("/assets/place-bengaluru.webp"),
  },
];

export function regionForPlace(place: Place) {
  return regions.find((r) => r.slug === place.regionSlug)!;
}
