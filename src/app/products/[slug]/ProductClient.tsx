"use client";
import { useRef, useState } from "react";
import { products } from "@/data/catalog";
import { gifts } from "@/data/gifts";
import { useStore } from "@/components/Store";
import { FrameSnackFall } from "@/components/Commerce";
import { useParams } from "next/navigation";
import Link from "next/link";
export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const p = [...products, ...gifts].find((x) => x.slug === slug);
  const { add, setDrawer, toggleWish, wishlist } = useStore();
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  if (!p)
    return (
      <div className="error-state">
        <h1>Snack not found</h1>
        <Link href="/shop">Return to shop</Link>
      </div>
    );
  const seed = p.name.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const addFromDetail = () => {
    add(p.id, false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawer(true);
      return;
    }
    setBurst((x) => x + 1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setBurst(0);
      setDrawer(true);
    }, 2900);
  };
  return (
    <div className="page">
      <div className="pdp">
        <div className="pdp-image-frame">
          <img src={p.image} alt={p.name} />
          {burst > 0 && <FrameSnackFall key={burst} seed={seed} />}
        </div>
        <div className="pdp-copy">
          <span className="eyebrow">{p.region}</span>
          <h1>{p.name}</h1>
          <b className="price">₹{p.price}</b>
          <p>
            {p.description} This preview avoids unverified ingredient,
            nutrition, sourcing and safety claims until the business catalogue
            is approved.
          </p>
          <button className="button" onClick={addFromDetail}>
            Add to cart
          </button>{" "}
          <button className="field" onClick={() => toggleWish(p.id)}>
            {wishlist.includes(p.id) ? "♥ Saved" : "♡ Save"}
          </button>
          <div className="accordions">
            <details>
              <summary>Product details</summary>
              <p>
                Pack size, ingredients and nutrition are awaiting verified
                business data.
              </p>
            </details>
            <details>
              <summary>Origin story</summary>
              <p>
                This product is grouped under {p.region}. The final maker and
                sourcing story is awaiting approval.
              </p>
            </details>
            <details>
              <summary>Delivery & storage</summary>
              <p>
                Delivery coverage, storage instructions and shelf life will be
                added when verified.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
