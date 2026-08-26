import FlexibleClient from "./FlexibleClient";
import { regions } from "@/data/catalog";

const singlePages = [
  "story",
  "makers",
  "gifting",
  "stories",
  "contact",
  "faq",
  "delivery",
  "account",
  "cart",
  "search",
  "order-confirmation",
  "regions",
];

export function generateStaticParams() {
  const routes = [
    ...singlePages,
    "account/orders",
    "stories/why-a-snack-should-keep-its-place",
    ...regions.map((region) => `regions/${region.slug}`),
  ];
  return routes.map((route) => ({ slug: route.split("/") }));
}

export const dynamicParams = false;

export default function Page() {
  return <FlexibleClient />;
}
