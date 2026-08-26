# Thindi Angadi 2.0 build checklist

## Non-negotiables

- Work only in `Thindi-Angadi-web-2.0`; keep the original repository unchanged.
- Preserve catalogue, search, filters, pagination, wishlist, local cart, cart drawer, product pages, gifting, stories, checkout and account routes.
- Design mobile first at 405 × 720, then verify 390 × 844 and 1440 × 900.
- Keep product and origin data isolated in mock data files. Do not add unverified maker, sourcing, certification, safety or health claims.
- Respect `prefers-reduced-motion`, keyboard navigation and visible focus.

## Homepage acceptance sequence

- [ ] Hero communicates the brand and offers a direct shop action above the fold.
- [ ] Quick shelf appears immediately after the hero and supports horizontal touch browsing.
- [ ] Compact authenticity proof follows the shelf.
- [ ] Karnataka map has five keyboard-accessible, pulsing locations.
- [ ] Selecting a location zooms the map in the same frame and reveals a parchment/stamp detail panel.
- [ ] Taste-led discovery supports Sweet, Spicy, Savoury and Tea-time shelves.
- [ ] Existing story content and interactions remain available at the end.
- [ ] Scrapbook frames feel handmade without reducing legibility or shopping clarity.

## Visual system

- Warm paper `#fbf4e4`, marigold `#efa927`, deep angdi blue `#06233d`, chilli `#8b2e1b`.
- Lancelot for expressive display headings, Philosopher for readable editorial copy, Space Mono for labels and commerce controls, Noto Sans Kannada for Kannada.
- No more than one expressive display treatment in a single component.
- Product imagery uses consistent warm editorial grading and intentional crops; no watermarks.

## Validation

- [ ] Lint
- [ ] Type check
- [ ] Production/static build
- [ ] Major interactions and routes
- [ ] 405 × 720 screenshot review
- [ ] 390 × 844 screenshot review
- [ ] 1440 × 900 regression review
- [ ] Reduced-motion review
