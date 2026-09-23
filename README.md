# Skills App

A small skills app used in the Pluralsight course **The Art of JavaScript Debugging: Mindset, DevTools, and AI Workflows**.

Team members log in, keep track of their skills and levels, and an admin can see what the whole team knows.
The app is intentionally simple: a Node.js + Express API that stores its data in a JSON file, and a Vite frontend with plain JavaScript modules.
That keeps it easy to follow along, and it leaves plenty of room for bugs. 🐛

## Requirements

- Node.js 22 or 24 (LTS)
- Google Chrome (current stable)
- Visual Studio Code

## Getting started

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173 (Vite)
- API: http://localhost:3000 (Express)

Vite forwards everything under `/api` to the Express server during development.

| Username | Password | Role |
|---|---|---|
| user1 | password1 | team member |
| user2 | password2 | team member (has skills in the old data format) |
| admin | admin | admin |

Not how you'd do logins in a real application, but perfect for debugging practice.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Starts API (with `node --watch`) and frontend together |
| `npm run dev:server` / `npm run dev:client` | Starts only one of them |
| `npm run build` | Bundles the server to `dist/server.js` and builds the frontend, both with source maps |
| `npm run start:dist` | Runs the bundled server, with source-mapped stack traces |
| `npm test` | Runs the tests with the built-in Node.js test runner |
| `node scripts/two-saves.js` | Fires two "add skill" requests at the same time (module 2) |

## Following along with the course

`main` is the working version. Every demo that starts from a broken version has its own branch:

```bash
git switch m3c4-start
```

When you switch branches, reset the data file with `git checkout data/users.json` if the demo changed it.

| Branch | Module / clip | What's broken |
|---|---|---|
| `m1c2-start` | Reading execution flow | The server crashes on start |
| `m1c3-start` | Classifying runtime errors | The admin page is empty, and adding a skill kills the server |
| `m2c1-start` | Setting up VS Code | No debug config, no type checking, no source maps |
| `m2c2-start` | The VS Code debugger | New expert skills are not counted |
| `m2c3-start` | Conditional breakpoints and logpoints | One survey average is missing |
| `m2c4-start` | Async paths | Two saves at the same time: one gets lost |
| `m2c5-start` | AI agents and stack traces | The CSV export crashes |
| `m3c2-start` | DOM and CSS | Layout and badge colors are off |
| `m3c3-start` | Network payloads | Adding a skill says "name is required" |
| `m3c4-start` | Sources panel | Skills don't load, and then the average is wrong |
| `m3c5-start` | Browser breakpoints | Delete does nothing, and new skills vanish |
| `m3c6-start` | Async/await halts | "Saved" while it wasn't, and an endless spinner |
| `m3c7-start` | CORS | Nothing works once we call the API directly |
| `m5c2-start` | Chrome DevTools MCP | The skills page is empty |
| `m5c3-start` | Prompting for a diff | The "top skills" list drops people |

Modules 4 and 5 also use isolated examples in `client/examples/` (open http://localhost:5173/examples/). Each one has a `solution` folder.

Happy debugging!
