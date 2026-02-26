## Cursor Cloud specific instructions

This is a VitePress documentation site (bilingual: Chinese + English). See `README.md` for standard dev/build/preview commands.

- **Dev server**: `yarn docs:dev` (serves at http://localhost:5173). Use `--host 0.0.0.0` to expose on all interfaces.
- **Build caveat**: `yarn docs:build` fails with a dead-link error because `README.md` references `http://localhost:5173`. VitePress treats all `.md` files as pages. This is a pre-existing repo issue; the dev server works fine regardless.
- **No lint/test configuration**: The project has no ESLint config, no test framework, and no git hooks. The only validation is the build itself.
- **Package manager**: Yarn Classic (v1.22.22), pinned via `packageManager` in `package.json`. Always use `yarn`, not npm/pnpm.
