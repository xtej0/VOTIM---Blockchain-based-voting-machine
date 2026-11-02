# Audit plan and initial findings

1. Inventory all source/configuration/assets, excluding generated dependency and build trees.
2. Trace wallet, election state, exports and routes before editing.
3. Fix verified frontend defects without changing visual styling or inventing contracts.
4. Document actual capabilities and missing blockchain sources.
5. Typecheck, build, run regression checks, scan publication files and review staged sizes.
6. Publish through a clone of the existing main branch, preserving its initial commit and license.

Initial findings: no local Git history; Next.js 14/React 18/TypeScript/Tailwind/shadcn frontend; npm lockfile and installed dependencies; empty pnpm dependency lock; no Solidity, Hardhat, ABI or deployment files. Election state is isolated in each hook and resets on navigation. PDF is a console placeholder. Wallet listeners are absent and switch rejection is swallowed. Recharts types fail typechecking, which the build suppresses. Parent-folder wallet recovery image must never be copied.
