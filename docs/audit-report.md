# VOTIM publication audit — 2026-11-02

## Scope and architecture

Reviewed the complete source/configuration/assets inventory outside generated node_modules/.next. Four App Router screens, shared UI library, wallet and simulated election hooks. No Solidity, Hardhat, ABI, deployment tooling, backend or contract tests exist. npm lockfile is authoritative; original empty pnpm lock retained. Original workspace had no Git history. Publication clone preserves remote initial commit and MIT license.

## Changes

- Preserved existing gradients, cards, layouts, animations and portal workflows; added an explicit demo notice and corrected unsupported homepage/metadata claims.
- Fixed Recharts 3 tooltip/legend and pie-label types; pin Recharts instead of latest; stop mutating candidate arrays when sorting results.
- Removed TypeScript build-error suppression. ESLint remains unconfigured as in the original checkout; it is not a verified gate.
- Wallet account/chain/disconnect listeners with cleanup, verified Amoy selection, surfaced rejected requests, propagated successful connections between hook instances. No transaction signing is implemented.
- Replaced fake generated transaction hashes with demo references. Removed no-op periodic logging.
- Fixed CSV quoting (timestamps contain commas) and formula injection; Blob download/revocation; regression tests.
- Avoid candidate ID reuse after removal; validate demo votes against candidate existence, live status and connection. These client checks do not provide security.
- Browser print/Save as PDF replaces the no-op export. Leading share label corrected; division by zero guarded.
- Optional public demo admin environment configuration retains the original address. Ignore secrets, artifacts, publication clone, caches and logs.
- README rewritten from code evidence; authentic supplied PNGs copied unchanged. No wallet recovery files copied.
- Next.js updated from 14.2.16 to 14.2.35; compatible dependencies updated using npm lockfile.

## Dependency security

Initial npm audit: 8 findings (1 critical, 5 high, 2 moderate). After compatible updates: 3 (1 critical Next.js, high PostCSS and Zod). Full registry report: dependency-audit.json. npm proposes Next.js 16.4.4 and Zod 4.6.7, both major migrations. They were not forced into this bounded publication; evaluate and test those migrations before public hosting. This code publication is not a deployment approval or security clearance.

## Remaining limitations

Election state is isolated per hook and lost on navigation/reload. Admin gating is client-only. Duplicate restrictions are bypassable. No voter identity, eligibility registry, contract authorization, durable results or chain event history. Seed data and winner logic are demonstration only, with no complete tie policy. Shared state/contracts require further implementation, not speculative repair. Unused shadcn library components and duplicate generated hooks/styles remain to avoid unnecessary destructive cleanup; there are no verified broken imports after type fixes.

No blockchain transactions or deployments were executed. No credentials discovered in selected publication source; parent folder contains a wallet recovery image and is explicitly outside the publication set. Rotate credentials if that image has ever been shared.

## Verification

- TypeScript: passed after Recharts fixes and dependency update.
- CSV regression tests: 2 passed.
- First production build: blocked by sandbox Google font DNS access and a build directory EPERM; rerun with network/build permissions (result recorded below).
- Live wallet and testnet interactions: not exercised; no user wallet authorization requested.
- Contract compilation/tests/ABI check: unavailable, source absent.
- Browser visual validation: not performed; screenshots are original supplied captures, not new runtime evidence.

- Build exposed an original Tailwind v4 stylesheet imported into a Tailwind v3 project (including an undeclared tw-animate-css import). Reused the existing compatible styles/globals.css tokens/directives and preserved app scrollbar/animation rules.

- Final production build: PASSED, including TypeScript validation and all routes statically generated. Lint explicitly skipped by existing configuration.
- Publication scan: the initial 64-hex match was a fabricated seeded transaction hash, not a credential; replaced seeded hashes with explicit demo references. No private-key/token patterns otherwise found. No private environment files staged. Largest asset: 331216-byte homepage screenshot.
