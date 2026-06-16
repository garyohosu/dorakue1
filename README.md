# dorakue1

`dorakue1` is a small browser RPG prototype built with Phaser, Vite, and JavaScript.

The game title is **暁の小径 / Path of Dawn**. It is an AI-assisted development experiment for testing whether a classic single-player RPG in the spirit of early console RPGs can be specified, implemented, reviewed, and tested through iterative natural-language coding workflows.

## Requirements

- Node.js
- npm

## Setup

```bash
npm install
```

## Development

Start the local Vite dev server:

```bash
npm run dev
```

Build the game:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Tests

Run the gameplay validation script:

```bash
npm test
```

Run the Playwright browser smoke tests:

```bash
npm run test:browser
```

## Project Structure

- `src/` - game source code
- `src/scenes/` - Phaser scenes
- `src/data/` - maps, player data, NPCs, battle data, and save handling
- `src/game/` - constants, config, and generated pixel textures
- `src/ui/` - UI components such as the message box
- `tests/` - Playwright smoke tests
- `scripts/` - validation scripts
- `spec.md` - full game specification
- `code_review.md` - review notes comparing the implementation with the specification

## Notes

The current implementation is an MVP-style playable prototype. Some systems in `spec.md` are intentionally incomplete or simplified, and the known gaps are tracked in `code_review.md`.
