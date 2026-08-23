# Can I Omarchy?

An honest, app-first migration check for people considering Omarchy.

- Live: https://can-i-omarchy.vercel.app
- Source: https://github.com/duclucky/can-i-omarchy

Most distro quizzes ask what you like. This one asks what can stop you from doing your job. Select the apps you rely on and get:

- an instant readiness score;
- a verdict that does not average away hard blockers;
- one-click starter stacks for developers, designers, creators, and founders;
- a shareable four-lane Omarchy Stackprint;
- alternative routes for supported hard blockers;
- the exact Omarchy menu route for each migration step;
- a sourced migration path for every selected app;
- local-only stack persistence for return visits;
- a shareable URL containing only the selected app IDs;
- copy written for sharing the Stackprint on X.

## Product thesis

The growth loop is useful before it is viral:

1. A person who is curious about Omarchy checks their real stack.
2. The result names the blocker and gives a credible route forward.
3. They share a compact score and blocker list.
4. People with missing or unusual apps contribute evidence.
5. The dataset and the creator's authority compound together.

The core editorial rule is **build does not mean test**. A hosted Windows or macOS runner can produce an artifact, but it cannot replace runtime, signing, Simulator, device, installer, GPU, or UI validation.

## Local development

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

The project preserves its original Sites build and also includes a native Next.js build for Vercel:

```bash
npm run build:vercel
```

`vercel.json` selects the Next.js build without changing the existing Sites deployment path.

## Interface system

The interface direction is generated and maintained with [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill). The committed design-system master records the project palette, typography, spacing, motion, accessibility, and responsive rules used by the current UI.

The checker is intentionally consequence-aware: a hard blocker caps readiness at 39, while a stack that requires a bridge caps at 74. This keeps the score aligned with the verdict instead of averaging away the app that can stop someone from doing their job.

## Updating compatibility data

App records currently live in `app/apps.ts`. Every record needs:

- a stable ID and category;
- one of `native`, `web`, `bridge`, or `blocked`;
- a short statement of the actual constraint;
- a migration plan that tells the user what to do;
- an official vendor, platform, or Omarchy documentation link.

Do not mark an app native merely because an unsupported package or Wine recipe exists. Do not mark remote compilation as full platform compatibility. Date drift is expected, so changes should include fresh source verification.

## Independence

Can I Omarchy? is an independent community tool. It is not affiliated with Omarchy, Basecamp, or 37signals.
