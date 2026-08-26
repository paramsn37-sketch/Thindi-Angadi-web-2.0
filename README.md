# The Thindi Angadi 2.0

Mobile-first storefront and regional storytelling experience for The Thindi Angadi. This repository is the 2.0 design track; the original frontend remains unchanged in its own repository.

## Run locally

```bash
npm ci
npm run dev
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

The catalogue is mock data under `src/data/` so the production API can replace it without rebuilding UI components.

See [PROJECT_CHECKLIST.md](PROJECT_CHECKLIST.md) and [DESIGN_PLAN.md](DESIGN_PLAN.md) for the audited requirements and homepage sequence.
