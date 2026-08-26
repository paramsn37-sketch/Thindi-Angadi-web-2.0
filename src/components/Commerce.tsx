"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Product } from "@/data/catalog";
import { useStore } from "./Store";
import { asset } from "@/lib/paths";

export function FrameSnackFall({ seed }: { seed: number }) {
  return (
    <div className="frame-snack-fall" aria-hidden="true" style={{"--snack-sheet":`url(${asset("/assets/snack-confetti-sheet.webp")})`} as React.CSSProperties}>
      {Array.from({ length: 30 }, (_, i) => {
        const cell = (seed + i * 7 + Math.floor(i / 3)) % 20,
          col = cell % 5,
          row = Math.floor(cell / 5);
        const column = i % 10,
          layer = Math.floor(i / 10);
        return (
          <i
            key={i}
            style={
              {
                "--x": `${6 + column * 9.6 + layer * 1.1}%`,
                "--size": `${20 + ((i * 17) % 34)}px`,
                "--delay": `${(i * 43) % 350}ms`,
                "--duration": `${1350 + ((i * 83) % 700)}ms`,
                "--drift": `${(i % 2 ? 1 : -1) * (2 + ((i * 7) % 9))}px`,
                "--spin": `${(i % 2 ? 1 : -1) * (100 + ((i * 37) % 300))}deg`,
                "--pile": `${(i * 7) % 20}px`,
                backgroundPosition: `${col * 25}% ${row * (100 / 3)}%`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { add, setDrawer, wishlist, toggleWish } = useStore();
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shortened =
    p.description.length > 86
      ? p.description.slice(0, 83).trimEnd() + "…"
      : p.description;
  const seed = p.name.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const addFromCard = () => {
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
    <article className="product-card">
      <div className="product-img">
        {p.badge && <span className="badge">{p.badge}</span>}
        <button
          className="heart"
          onClick={() => toggleWish(p.id)}
          aria-label="Toggle wishlist"
        >
          {wishlist.includes(p.id) ? "♥" : "♡"}
        </button>
        <Link href={"/products/" + p.slug}>
          <img src={p.image} alt={p.name} loading="lazy" decoding="async" />
        </Link>
        {burst > 0 && <FrameSnackFall key={burst} seed={seed} />}
      </div>
      <Link className="product-title" href={"/products/" + p.slug}>
        <h3>{p.name}</h3>
      </Link>
      <small>{p.region}</small>
      <div className="product-description">
        <p>
          {shortened}{" "}
          <Link
            href={"/products/" + p.slug}
            aria-label={`Read more about ${p.name}`}
          >
            Read more
          </Link>
        </p>
      </div>
      <div className="product-foot">
        <b>₹{p.price}</b>
        <button onClick={addFromCard}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M6.5 8.5h11l1 11h-13l1-11Z" />
            <path d="M9 8.5V6.75a3 3 0 0 1 6 0V8.5" />
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  );
}
