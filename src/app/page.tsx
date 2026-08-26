"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/Commerce";
import { products } from "@/data/catalog";
import { places, regionForPlace } from "@/data/places";
import { asset } from "@/lib/paths";

const tasteFilters = [
  {label:"ಸಿಹಿ · Sweet",match:(p:(typeof products)[number])=>p.category==="Sweet"},
  {label:"ಖಾರ · Spicy",match:(p:(typeof products)[number])=>p.heat==="Spicy"},
  {label:"ಕುರುಕು · Savoury",match:(p:(typeof products)[number])=>p.category==="Savoury"},
  {label:"ಚಹಾ ಜೊತೆ · Tea-time",match:(p:(typeof products)[number])=>["Bakery","Mixture"].includes(p.category)},
];
const reviews = [
  {name:"Ananya R.",place:"Indiranagar",product:"Maddur Vade",quote:"The Maddur Vade tasted exactly like the ones from the highway stalls near my hometown. Genuinely surprised."},
  {name:"Karthik S.",place:"Jayanagar",product:"Thindi Box",quote:"Ordered the Thindi Box on a whim. My whole family fought over the Nippattu by evening."},
  {name:"Meera V.",place:"HSR Layout",product:"Kodubale",quote:"Ordered at 3, it was at my door by 7. Still warm-fresh, not stale like the usual packaged stuff."},
];

export default function Home(){
  const[taste,setTaste]=useState(0);
  const[active,setActive]=useState<number|null>(null);
  const tasting=useMemo(()=>products.filter(tasteFilters[taste].match).slice(0,4),[taste]);
  useEffect(()=>{
    if(active===null)return;
    const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")setActive(null)};
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[active]);
  const activePlace=active===null?null:places[active];
  const activeRegion=activePlace?regionForPlace(activePlace):null;
  return <div className="v20-home">
    <section className="v20-hero">
      <div className="v20-hero-copy"><span className="v20-kicker">ಕರ್ನಾಟಕದ ತಿಂಡಿ ಅಂಗಡಿ · BENGALURU</span><h1>Every snack<br/><em>has an address.</em></h1><p>Regional favourites, familiar memories and a cart that brings Karnataka a little closer to home.</p><div className="v20-actions"><Link className="v20-button" href="/shop">Shop the angdi <span>→</span></Link><a href="#places">Follow the route</a></div></div>
      <div className="v20-hero-art"><img className="v20-hero-paper" src={asset("/assets/hero-background-small-circle-v3.webp")} alt="Illustrated Karnataka landscape"/><img className="v20-cart" src={asset("/assets/cart.webp")} alt="The Thindi Angdi snack cart"/><span className="v20-seal">ಊರಿಂದ<br/><b>ನಿಮ್ಮ ಮನೆಗೆ</b></span></div>
      <a className="v20-scroll" href="#quick-shop">ಹೊಸ ತಿಂಡಿ ಹುಡುಕಿ ↓</a>
    </section>

    <section className="v20-section v20-quick" id="quick-shop"><header className="v20-heading"><div><span className="v20-kicker">THE QUICK SHELF · ಬೇಗ ಆಯ್ಕೆ</span><h2>Begin with a favourite.</h2></div><Link href="/shop">See all <span>→</span></Link></header><div className="v20-shelf" aria-label="Popular snacks">{products.slice(0,6).map(p=><ProductCard key={p.id} p={p}/>)}</div></section>

    <section className="v20-proof v20-section"><div className="v20-proof-copy"><span className="v20-kicker">✦ WHY THINDI ANGDI</span><h2>Not just snacks.<br/>A taste of where<br/>they’re from.</h2><p>Every thindi has a place. Every place has its own way of making it. Thindi Angdi brings Karnataka&apos;s regional flavours together in one angdi — while staying rooted in the taste and traditions that made them special.</p><Link className="v20-button red" href="/regions">Explore Karnataka</Link></div><figure className="v20-torn-photo v20-vada-photo"><img src={asset("/assets/why-thindi-angdi-vada.png")} alt="Three crisp vadas served on a banana leaf with curry leaves and onion" loading="lazy"/></figure></section>

    <section className="v20-map-section v20-section" id="places"><header className="v20-heading light"><div><span className="v20-kicker">A CARTOGRAPHY OF TASTE</span><h2>Tap Karnataka.<br/><em>Meet its thindi.</em></h2></div><p>Ten places. Ten ways into the shelf.</p></header>
      <div className="v20-map-wrap">
        <div className="v20-map-stage" onClick={()=>{if(active!==null)setActive(null)}} style={active!==null?{cursor:"pointer"}:undefined}>
          <div className={`v20-map-layer${activePlace?" zoomed":""}`} style={activePlace?{transformOrigin:`${activePlace.x}% ${activePlace.y}%`}:undefined}>
            <img className="v20-map-img" src={asset("/assets/karnataka-map.webp")} alt="Illustrated map of Karnataka marking Bidar, Kalaburagi, Vijayapura, Belagavi, Dharwad, Tumakuru, Mangaluru, Maddur, Mysuru and Bengaluru" loading="lazy" decoding="async"/>
            <div className="v20-pins" aria-hidden={activePlace?"true":"false"}>
              {places.map((p,i)=><button key={p.slug} type="button" className={`v20-pin-btn${active===i?" active":""}`} style={{left:`${p.x}%`,top:`${p.y}%`}} onClick={()=>setActive(active===i?null:i)} aria-label={`${p.name} — see its thindi`} aria-pressed={active===i}><span className="v20-pin-ring"/><span className="v20-pin-core"/></button>)}
            </div>
          </div>
        </div>
        {activePlace&&activeRegion&&<article className="v20-spill" key={activePlace.slug} role="dialog" aria-label={activePlace.name}>
          <span className="v20-stamp">{String((active??0)+1).padStart(2,"0")}</span>
          <img src={activeRegion.image} alt="" loading="lazy"/>
          <h3>{activePlace.name}</h3>
          <p>{activePlace.blurb}</p>
          <b>{activeRegion.snacks}</b>
          <Link href={`/regions/${activeRegion.slug}`}>See the {activeRegion.name} shelf →</Link>
        </article>}
        {activePlace&&<button type="button" className="v20-spill-close" onClick={()=>setActive(null)} aria-label="Close">×</button>}
        <p className="v20-map-hint">Tap a place on the map to open it.</p>
      </div>
    </section>

    <section className="v20-section v20-taste"><header className="v20-heading"><div><span className="v20-kicker">NEW HERE?</span><h2>Choose by craving.</h2></div><p>No map needed. Start with the taste you want.</p></header><div className="v20-tabs" role="tablist" aria-label="Shop by taste">{tasteFilters.map((t,i)=><button role="tab" aria-selected={taste===i} className={taste===i?"active":""} onClick={()=>setTaste(i)} key={t.label}>{t.label}</button>)}</div><div className="v20-shelf taste-shelf">{tasting.map(p=><ProductCard key={p.id} p={p}/>)}</div></section>

    <section className="v20-section v20-reviews"><header className="v20-heading"><div><span className="v20-kicker red">✦ ALREADY SNACKING</span><h2>Bengaluru is already snacking.</h2></div></header><div className="v20-review-grid">{reviews.map(r=><article className="v20-review-card" key={r.name}><span className="v20-review-stars" aria-label="5 out of 5 stars">★★★★★</span><p>{r.quote}</p><div className="v20-review-meta"><b>{r.name}</b><span>{r.place} · {r.product}</span></div></article>)}</div></section>

    <section className="v20-story v20-section"><div><span className="v20-kicker">THE THINDI ANGDI STORY</span><h2>More than snacks.<br/><em>It’s our Karnataka.</em></h2><p>Places, kitchens and small food memories—the longer route behind the shelf.</p><Link className="v20-button gold" href="/story">Explore our story →</Link></div><div className="v20-story-collage"><img src={asset("/assets/story-kitchen-teaching.webp")} alt="Food knowledge shared in a kitchen" loading="lazy"/><img src={asset("/assets/story-journey-v2.webp")} alt="A route through Karnataka" loading="lazy"/><img src={asset("/assets/story-stone-grinding.webp")} alt="Traditional grinding by hand" loading="lazy"/></div></section>
  </div>
}
