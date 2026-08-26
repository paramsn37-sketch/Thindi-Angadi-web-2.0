"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/Commerce";
import { products, regions } from "@/data/catalog";
import { asset } from "@/lib/paths";

const mapPoints = [{x:42,y:79},{x:49,y:62},{x:36,y:45},{x:60,y:78},{x:55,y:26}];
const tasteFilters = [
  {label:"ಸಿಹಿ · Sweet",match:(p:(typeof products)[number])=>p.category==="Sweet"},
  {label:"ಖಾರ · Spicy",match:(p:(typeof products)[number])=>p.heat==="Spicy"},
  {label:"ಕುರುಕು · Savoury",match:(p:(typeof products)[number])=>p.category==="Savoury"},
  {label:"ಚಹಾ ಜೊತೆ · Tea-time",match:(p:(typeof products)[number])=>["Bakery","Mixture"].includes(p.category)},
];

export default function Home(){
  const[region,setRegion]=useState(0);const[taste,setTaste]=useState(0);
  const selected=regions[region];
  const tasting=useMemo(()=>products.filter(tasteFilters[taste].match).slice(0,4),[taste]);
  return <div className="v20-home">
    <section className="v20-hero">
      <div className="v20-hero-copy"><span className="v20-kicker">ಕರ್ನಾಟಕದ ತಿಂಡಿ ಅಂಗಡಿ · BENGALURU</span><h1>Every snack<br/><em>has an address.</em></h1><p>Regional favourites, familiar memories and a cart that brings Karnataka a little closer to home.</p><div className="v20-actions"><Link className="v20-button" href="/shop">Shop the angdi <span>→</span></Link><a href="#places">Follow the route</a></div></div>
      <div className="v20-hero-art"><img className="v20-hero-paper" src={asset("/assets/hero-background-small-circle-v3.webp")} alt="Illustrated Karnataka landscape"/><img className="v20-cart" src={asset("/assets/cart.webp")} alt="The Thindi Angdi snack cart"/><span className="v20-seal">ಊರಿಂದ<br/><b>ನಿಮ್ಮ ಮನೆಗೆ</b></span></div>
      <a className="v20-scroll" href="#quick-shop">ಹೊಸ ತಿಂಡಿ ಹುಡುಕಿ ↓</a>
    </section>

    <section className="v20-section v20-quick" id="quick-shop"><header className="v20-heading"><div><span className="v20-kicker">THE QUICK SHELF · ಬೇಗ ಆಯ್ಕೆ</span><h2>Begin with a favourite.</h2></div><Link href="/shop">See all <span>→</span></Link></header><div className="v20-shelf" aria-label="Popular snacks">{products.slice(0,6).map(p=><ProductCard key={p.id} p={p}/>)}</div></section>

    <section className="v20-proof v20-section"><div className="v20-proof-copy"><span className="v20-kicker">WHY THINDI ANGDI</span><h2>Not just snacks.<br/>A taste of <em>where.</em></h2><p>Every thindi has a place. We keep that place visible while confirmed product details stay clear and easy to shop.</p><Link className="v20-button red" href="/story">Our story <span>→</span></Link></div><figure className="v20-torn-photo"><img src={asset("/assets/story-people-v2.webp")} alt="A Karnataka kitchen and the people behind its food" loading="lazy"/><figcaption>ಮನೆಯ ರುಚಿ · memory, method, place</figcaption></figure></section>

    <section className="v20-map-section v20-section" id="places"><header className="v20-heading light"><div><span className="v20-kicker">A CARTOGRAPHY OF TASTE</span><h2>Tap Karnataka.<br/><em>Meet its thindi.</em></h2></div><p>Five places. Five ways into the shelf.</p></header><div className="v20-map-frame">
      <div className="v20-map-stage"><svg className="v20-map" viewBox="0 0 320 470" role="img" aria-label="Interactive map of Karnataka"><path className="v20-map-shape" d="M93 18 147 39l48-5 25 35 25 18-8 43 35 40-18 45 18 49-24 40 5 52-38 42-22 66-55 25-43-24-45-2-8-52-27-36 13-49-24-54 35-35 5-65 41-35-4-52 37-27Z"/><path className="v20-map-river" d="M117 54c42 54-3 93 46 129s-22 79 33 133"/>{regions.map((r,i)=><g key={r.slug} className={region===i?"active":""}><circle className="v20-pulse" cx={mapPoints[i].x*3.2} cy={mapPoints[i].y*4.7} r="13"/><circle className="v20-pin" cx={mapPoints[i].x*3.2} cy={mapPoints[i].y*4.7} r="6"/></g>)}</svg><div className="v20-map-buttons" aria-label="Choose a Karnataka region">{regions.map((r,i)=><button key={r.slug} className={region===i?"active":""} onClick={()=>setRegion(i)} style={{left:`${mapPoints[i].x}%`,top:`${mapPoints[i].y}%`}}><span>{i+1}</span><b>{r.name}</b></button>)}</div></div>
      <article className="v20-parchment" key={selected.slug}><span className="v20-stamp">STOP {String(region+1).padStart(2,"0")}</span><small>FROM THIS PART OF KARNATAKA</small><h3>{selected.name}</h3><img src={selected.image} alt="" loading="lazy"/><p>{selected.story}</p><b>{selected.snacks}</b><Link href={`/regions/${selected.slug}`}>Open the field note →</Link></article>
    </div></section>

    <section className="v20-section v20-taste"><header className="v20-heading"><div><span className="v20-kicker">NEW HERE?</span><h2>Choose by craving.</h2></div><p>No map needed. Start with the taste you want.</p></header><div className="v20-tabs" role="tablist" aria-label="Shop by taste">{tasteFilters.map((t,i)=><button role="tab" aria-selected={taste===i} className={taste===i?"active":""} onClick={()=>setTaste(i)} key={t.label}>{t.label}</button>)}</div><div className="v20-shelf taste-shelf">{tasting.map(p=><ProductCard key={p.id} p={p}/>)}</div></section>

    <section className="v20-story v20-section"><div><span className="v20-kicker">THE THINDI ANGDI STORY</span><h2>More than snacks.<br/><em>It’s our Karnataka.</em></h2><p>Places, kitchens and small food memories—the longer route behind the shelf.</p><Link className="v20-button gold" href="/story">Explore our story →</Link></div><div className="v20-story-collage"><img src={asset("/assets/story-kitchen-teaching.webp")} alt="Food knowledge shared in a kitchen" loading="lazy"/><img src={asset("/assets/story-journey-v2.webp")} alt="A route through Karnataka" loading="lazy"/><img src={asset("/assets/story-stone-grinding.webp")} alt="Traditional grinding by hand" loading="lazy"/></div></section>
  </div>
}
