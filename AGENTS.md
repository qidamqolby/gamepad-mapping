# Repository Guidelines

## Project Structure & Module Organization

- `src/` contains the React renderer: UI components live in `src/components/`, reusable behavior in `src/hooks/`, and shared values/types in `src/constants/`, `src/utils/`, and `src/types/`.
- `electron/main/` contains the Electron main-process entry point and update handling; `electron/preload/` contains the preload bridge.
- `public/` and `src/assets/` hold static assets. Packaging resources and platform icons are in `build/`; build preparation scripts are in `scripts/`.
- Vite, TypeScript, Tailwind, Electron Builder, and Vitest are configured at the repository root. Generated output such as `release/`, `dist/`, and `dist-electron/` should not be committed.

## Build, Test, and Development Commands

Use Yarn to match the committed `yarn.lock` and CI configuration:

```bash
yarn install             # install dependencies
yarn dev                 # start the Vite development server
yarn test                # run Vitest tests once
yarn build               # type-check, build, and package the Electron app
yarn preview             # preview the Vite production build
```

Run `yarn test -- <pattern>` to narrow a test run. The build may require platform-specific Electron packaging dependencies.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Follow the existing two-space indentation, single-quoted imports/strings, and semicolon-free style. Name React components and component files in PascalCase (`MappingPanel.tsx`), hooks with a `use` prefix (`useGamepad.ts`), and utilities/constants with descriptive camelCase names. Keep renderer, main-process, and preload responsibilities separate. Follow `.eslintrc.cjs`; avoid suppressing lint/type errors without a specific reason.

## Testing Guidelines

Vitest is configured to discover `test/**/*.{test,spec}.?(c|m)[jt]s?(x)`. Add tests under `test/` and use `.test.ts`/`.test.tsx` or `.spec.ts`/`.spec.tsx` names. Prioritize hooks, mapping logic, direction utilities, and other behavior that can be tested without hardware. Run `yarn test` before submitting changes.

## Commit & Pull Request Guidelines

Use Conventional Commit-style messages, matching history examples such as `feat: add modifier support`, `chore: ...`, and `chore(deps-dev): ...`. Keep commits focused. PRs should explain the problem and solution, select the applicable item in `.github/PULL_REQUEST_TEMPLATE.md`, describe tests run, and include screenshots or a short recording for UI changes. Do not modify `yarn.lock` or other lockfiles unless dependency maintenance is explicitly required; CI flags those changes.

## Security & Configuration Tips

Never commit signing certificates, updater credentials, or machine-specific secrets. Release workflows obtain signing and publishing values from GitHub Actions secrets; use local environment configuration only for development.
