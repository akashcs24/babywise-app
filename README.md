# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Microsoft Clarity (Vercel)

Clarity is integrated via `VITE_CLARITY_PROJECT_ID` in `src/main.jsx`.

1. In Vercel project settings, add env var:
	- Key: `VITE_CLARITY_PROJECT_ID`
	- Value: your Clarity project ID
2. Set it for at least `Preview` and `Production` environments.
3. Redeploy.

If the env var is missing, Clarity does not load.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
