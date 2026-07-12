# Repository Guidelines

## Project Structure & Module Organization

This is an Angular CLI application for the SpaceIA landing site. Application code lives in `src/app`, with route-level public pages under `src/app/features/public`, reusable layout shells in `src/app/layouts`, and shared app-specific components in `src/app/shared`. Copied spartan/Helm UI components live in `libs/ui` and are imported through `@spartan-ng/helm/*`. Static assets such as logos and favicons belong in `public`. Product and planning notes are kept in `docs`.

## Build, Test, and Development Commands

- `npm ci`: install dependencies from `package-lock.json`; use this for clean local setup and CI parity.
- `npm start`: run the Angular dev server, usually at `http://localhost:4200/`.
- `npm run build`: create the production build in `dist/`.
- `npm run watch`: run a development build in watch mode.
- `npm test`: run Angular unit tests with the configured Vitest-backed test builder.

CI runs on Node.js 24 and executes `npm ci` followed by `npm run build -- --configuration production`.

## Coding Style & Naming Conventions

Use TypeScript, Angular standalone components, and 2-space indentation. The project uses Prettier with `printWidth: 100`, single quotes, Angular HTML parsing, and `prettier-plugin-tailwindcss`; format before submitting changes. Prefer `ChangeDetectionStrategy.OnPush` for presentational components when practical. Name components and files by feature intent, for example `hero.ts`, `cotizador.ts`, or `public-layout.ts`, and keep route/page code near its feature directory.

For UI, prefer existing spartan/Helm components from `libs/ui` before custom markup. Use semantic Tailwind tokens and Helm variants such as `hlmBtn`, and import via `@spartan-ng/helm/button`, `@spartan-ng/helm/card`, etc.

## Testing Guidelines

Unit tests use Angular `TestBed` and `.spec.ts` files; the current baseline is `src/app/app.spec.ts`. Add focused specs beside the code they validate, especially for route behavior, component rendering, and form logic. Run `npm test` before handing off changes that affect behavior, and run `npm run build` for UI or configuration changes.

## Commit & Pull Request Guidelines

Git history follows concise Conventional Commit-style subjects such as `feat(public/cotizador): add 3-step quote wizard`, `fix(ci): pin Node.js to 24`, and `refactor(nosotros): move Lattice Systems logo`. Use the same `type(scope): summary` pattern where possible. Pull requests should describe the user-facing change, note build/test results, link related issues or docs, and include screenshots for visible UI changes.

