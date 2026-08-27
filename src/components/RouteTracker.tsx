"use client";
import { useEffect, useRef } from "react";

export function RouteTracker() {
  const cartRef = useRef<HTMLDivElement>(null);
  const wheelRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (cartRef.current) {
        cartRef.current.style.top = `${progress * 100}%`;
      }
      const rotation = window.scrollY * 0.6;
      for (const wheel of wheelRefs.current) {
        if (wheel) wheel.style.transform = `rotate(${rotation}deg)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="route-tracker" aria-hidden="true">
      <div className="route-tracker-line" />
      <div className="route-tracker-cart" ref={cartRef}>
        <svg viewBox="0 0 32 28" width="28" height="24">
          <path
            d="M5 6h20l3 9H2l3-9Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line x1="6" y1="6" x2="6" y2="2" stroke="currentColor" strokeWidth="2" />
          <g ref={(el) => { wheelRefs.current[0] = el; }} style={{ transformOrigin: "9px 22px" }}>
            <circle cx="9" cy="22" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="9" y1="18.3" x2="9" y2="25.7" stroke="currentColor" strokeWidth="1.3" />
            <line x1="5.3" y1="22" x2="12.7" y2="22" stroke="currentColor" strokeWidth="1.3" />
          </g>
          <g ref={(el) => { wheelRefs.current[1] = el; }} style={{ transformOrigin: "23px 22px" }}>
            <circle cx="23" cy="22" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="23" y1="18.3" x2="23" y2="25.7" stroke="currentColor" strokeWidth="1.3" />
            <line x1="19.3" y1="22" x2="26.7" y2="22" stroke="currentColor" strokeWidth="1.3" />
          </g>
        </svg>
      </div>
    </div>
  );
}
