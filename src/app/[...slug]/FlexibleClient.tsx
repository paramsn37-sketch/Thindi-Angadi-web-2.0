"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { products, regions } from "@/data/catalog";
import { gifts } from "@/data/gifts";
import { ProductCard } from "@/components/Commerce";
import { useStore } from "@/components/Store";
const pages: Record<string, [string, string, string]> = {
  story: [
    "OUR STORY",
    "A snack is never just a snack.",
    "It carries a place, a pair of hands and a way of making. The verified people and sourcing stories will be added here with care.",
  ],
  makers: [
    "OUR MAKERS",
    "The hands behind the thindi.",
    "A home for verified maker profiles, photographs and production stories when permissions and source information are supplied.",
  ],
  gifting: [
    "GIFTING",
    "Give a little Karnataka.",
    "Considered boxes for celebrations, teams and thoughtful everyday gestures.",
  ],
  stories: [
    "FIELD NOTES",
    "Stories from the route.",
    "Places, snacks and the journey behind the Angadi.",
  ],
  contact: [
    "GET IN TOUCH",
    "Come talk thindi with us.",
    "Business contact details and service hours are awaiting confirmation.",
  ],
  faq: [
    "HELP, CLEARLY",
    "Questions, answered.",
    "Straight answers about ordering, delivery and products.",
  ],
  delivery: [
    "DELIVERY",
    "From our cart to yours.",
    "The launch market is Bengaluru. Exact service areas and policies await business approval.",
  ],
  account: [
    "YOUR ANGADI",
    "Welcome back.",
    "Your addresses, orders and saved snacks will live here.",
  ],
  "account/orders": [
    "ORDER HISTORY",
    "Your journeys.",
    "Past orders and their status will appear after commerce integration.",
  ],
  cart: [
    "YOUR BAG",
    "The cart journey.",
    "Use the Bag button to open the persistent cart drawer.",
  ],
  search: [
    "SEARCH",
    "Find your thindi.",
    "Search the catalogue by product, place or kind.",
  ],
  "order-confirmation": [
    "ORDER STATUS",
    "The route is complete.",
    "Real order details will appear after checkout integration.",
  ],
};
export default function Flexible() {
  const params = useParams<{ slug: string[] }>();
  const key = params.slug.join("/");
  const { setDrawer } = useStore();
  const [giftPage, setGiftPage] = useState(1);
  if (key === "regions")
    return (
      <div className="page">
        <header className="page-hero">
          <span className="eyebrow">OUR KARNATAKA</span>
          <h1>
            Every place has
            <br />
            its own thindi.
          </h1>
          <p>
            Choose a region to meet its landscape, working snack collection and
            story.
          </p>
        </header>
        <div className="region-rail-v2">
          {regions.map((r) => (
            <Link
              className="region-card-v2"
              href={"/regions/" + r.slug}
              key={r.slug}
            >
              <div className="region-photo">
                <img src={r.image} alt={r.name} loading="lazy" decoding="async" />
                <span>Enter the region →</span>
              </div>
              <h3>{r.name}</h3>
              <b>{r.snacks}</b>
            </Link>
          ))}
        </div>
      </div>
    );
  if (key.startsWith("regions/")) {
    const r = regions.find((x) => key.endsWith(x.slug));
    if (!r) return null;
    const list = products.filter((p) => p.region === r.name);
    return (
      <div className={`region-detail region-${r.slug}`}>
        <header>
          <img src={r.image} alt={r.name} />
          <div>
            <span className="eyebrow">A PLACE ON THE ROUTE</span>
            <h1>{r.name}</h1>
            <p>{r.story}</p>
            <div className="region-route">
              <i />
              <span>From this place</span>
              <b>→</b>
              <span>To the Angadi</span>
            </div>
          </div>
        </header>
        <section className="region-notes">
          <div>
            <span>01</span>
            <h2>What lives on the shelf</h2>
            <p>{r.snacks}</p>
          </div>
          {r.flavorProfile && (
            <div>
              <span>02</span>
              <h2>Flavour profile</h2>
              <p>{r.flavorProfile}</p>
            </div>
          )}
          {r.coreIngredients && (
            <div>
              <span>03</span>
              <h2>Ingredient direction</h2>
              <p>{r.coreIngredients}</p>
            </div>
          )}
          {r.snackProfile && (
            <div>
              <span>04</span>
              <h2>Urban snack context</h2>
              <p>{r.snackProfile}</p>
            </div>
          )}
          <div>
            <span>{r.flavorProfile ? "05" : "02"}</span>
            <h2>What remains to verify</h2>
            <p>
              Final maker names, precise sourcing, recipes, nutrition and
              commercial product details.
            </p>
          </div>
        </section>
        <section className="page">
          <div className="section-head">
            <div>
              <span className="eyebrow">FROM THIS REGION</span>
              <h2>Meet the working collection.</h2>
            </div>
            <Link className="text-link" href="/shop">
              See all snacks →
            </Link>
          </div>
          {list.length ? (
            <div className="product-grid">
              {list.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>Products are still being mapped.</h3>
            </div>
          )}
        </section>
      </div>
    );
  }
  const page = pages[key] || [
    "ANGADI STORY",
    "A page from the route.",
    "This editorial detail page is ready for approved business content.",
  ];
  return (
    <div className="page">
      <header className="page-hero">
        <span className="eyebrow">{page[0]}</span>
        <h1>{page[1]}</h1>
        <p>{page[2]}</p>
      </header>
      {key === "contact" && (
        <form
          className="form-grid panel"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Preview form submitted.");
          }}
        >
          <input className="field" required placeholder="Name" />
          <input className="field" required type="email" placeholder="Email" />
          <textarea
            className="field"
            required
            placeholder="How can we help?"
            rows={5}
          />
          <button className="button">Send enquiry</button>
        </form>
      )}
      {key === "faq" && (
        <div className="accordions">
          <details>
            <summary>Where do you deliver?</summary>
            <p>Bengaluru is the launch market. Exact PIN codes are pending.</p>
          </details>
          <details>
            <summary>What is in each product?</summary>
            <p>
              Verified ingredients, allergens, nutrition and pack sizes are
              still required.
            </p>
          </details>
          <details>
            <summary>What is your returns policy?</summary>
            <p>The owner needs to supply and approve the final policy.</p>
          </details>
        </div>
      )}
      {key === "cart" && (
        <button className="button" onClick={() => setDrawer(true)}>
          Open your bag
        </button>
      )}
      {key === "account" && (
        <form className="form-grid panel">
          <input className="field" type="email" placeholder="Email" />
          <input className="field" type="password" placeholder="Password" />
          <button className="button">Sign in preview</button>
          <Link href="/wishlist">View wishlist</Link>
        </form>
      )}
      {key === "stories" && (
        <section className="single-field-note">
          <span className="field-note-number">FIELD NOTE 01</span>
          <div className="field-note-route" aria-hidden="true">
            <i />
            <b>✦</b>
            <i />
          </div>
          <p className="field-note-meta">KARNATAKA · ORIGIN · THE ANGADI</p>
          <h2>Why a snack should keep its place.</h2>
          <p>
            Before the shelf, there is a landscape, a kitchen and a way of
            making. This opening field note looks at why regional context
            belongs beside the food—not hidden behind it.
          </p>
          <Link
            className="button"
            href="/stories/why-a-snack-should-keep-its-place"
          >
            Read the first field note →
          </Link>
        </section>
      )}
      {key === "gifting" && (
        <section className="gifting-catalogue">
          <div className="product-grid gifting-grid">
            {gifts.slice((giftPage - 1) * 9, giftPage * 9).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
          <nav className="pagination gifting-pagination" aria-label="Gifting pages">
            <button disabled={giftPage === 1} onClick={() => setGiftPage(1)}>←</button>
            <button className={giftPage === 1 ? "active" : ""} onClick={() => setGiftPage(1)}>1</button>
            <button className={giftPage === 2 ? "active" : ""} onClick={() => setGiftPage(2)}>2</button>
            <button disabled={giftPage === 2} onClick={() => setGiftPage(2)}>→</button>
          </nav>
        </section>
      )}
    </div>
  );
}
