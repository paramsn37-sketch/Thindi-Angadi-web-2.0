"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore, CartDrawer } from "./Store";
import { products } from "@/data/catalog";
import { asset } from "@/lib/paths";
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5.5 20c.6-4 2.8-6 6.5-6s5.9 2 6.5 6" />
  </svg>
);
const BagIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.5 8.5h11l1 11h-13l1-11Z" />
    <path d="M9 8.5V6.75a3 3 0 0 1 6 0V8.5" />
  </svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export function Header() {
  const { cart, setDrawer } = useStore();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setSearch(false);
      }
    };
    addEventListener("keydown", f);
    return () => removeEventListener("keydown", f);
  }, []);
  return (
    <>
      <header className="header">
        <Link className="brand brand-round" href="/">
          <img src={asset("/assets/logo-transparent-v2.webp")} alt="The Thindi Angadi" />
        </Link>
        <nav aria-label="Primary">
          <Link href="/shop">Shop</Link>
          <Link href="/story">Our Story</Link>
          <Link href="/regions">Snacks of Karnataka</Link>
          <Link href="/gifting">Gifting</Link>
          <Link href="/stories">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="actions">
          <button
            className="icon search-icon"
            onClick={() => setSearch(true)}
            aria-label="Search"
          >
            <SearchIcon />
          </button>
          <Link className="icon account" href="/account" aria-label="Account">
            <UserIcon />
          </Link>
          <button
            className="bag bag-icon"
            onClick={() => setDrawer(true)}
            aria-label={`Bag with ${count} items`}
          >
            <BagIcon />
            <span>{count}</span>
          </button>
          <button
            className="icon hamburger"
            onClick={() => setMenu(!menu)}
            aria-label="Menu"
          >
            <MenuIcon />
          </button>
        </div>
      </header>
      <div className={"mobile-menu " + (menu ? "open" : "")}>
        <button className="icon" onClick={() => setMenu(false)}>
          ×
        </button>
        {[
          "Shop",
          "Regions",
          "Story",
          "Gifting",
          "Stories",
          "Contact",
          "FAQ",
          "Account",
        ].map((x) => (
          <Link
            key={x}
            onClick={() => setMenu(false)}
            href={"/" + x.toLowerCase()}
          >
            {x}
          </Link>
        ))}
      </div>
      <div
        className={"search-overlay " + (search ? "open" : "")}
        role="dialog"
        aria-modal="true"
      >
        <button className="icon close-search" onClick={() => setSearch(false)}>
          ×
        </button>
        <label htmlFor="site-search">What are you craving for?</label>
        <input
          autoFocus={search}
          id="site-search"
          placeholder="Search snacks, regions, stories…"
        />
        <div className="quick">
          Popular:{" "}
          {products.slice(0, 3).map((p) => (
            <Link
              key={p.id}
              href={"/products/" + p.slug}
              onClick={() => setSearch(false)}
            >
              {p.name}
            </Link>
          ))}
        </div>
      </div>
      <CartDrawer />
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div>
        <Link href="/" aria-label="The Thindi Angadi home">
          <img
            className="footer-logo"
            src={asset("/assets/logo-transparent-v2.webp")}
            alt="The Thindi Angadi"
          />
        </Link>
        <p>From Karnataka&apos;s homes to your doorstep.</p>
      </div>
      <div>
        <b>Explore</b>
        <Link href="/shop">Shop all</Link>
        <Link href="/regions">Regions</Link>
        <Link href="/story">Our story</Link>
        <Link href="/makers">Makers</Link>
      </div>
      <div>
        <b>Help</b>
        <Link href="/faq">FAQ</Link>
        <Link href="/delivery">Delivery</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/account/orders">Orders</Link>
      </div>
      <div>
        <b>Stay in the loop</b>
        <p>Stories, snacks and routes from across Karnataka.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for joining the Angadi.");
          }}
        >
          <input
            required
            type="email"
            aria-label="Email"
            placeholder="Your email"
          />
          <button>→</button>
        </form>
      </div>
      <small>© 2026 The Thindi Angadi. Frontend preview.</small>
    </footer>
  );
}
