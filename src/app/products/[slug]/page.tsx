import ProductClient from "./ProductClient";
import { products } from "@/data/catalog";
import { gifts } from "@/data/gifts";

export function generateStaticParams() {
  return [...products, ...gifts].map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export default function Page() {
  return <ProductClient />;
}
