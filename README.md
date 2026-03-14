# shrikarthik

A clean terminal portfolio built with [React](https://react.dev) and [Ink](https://github.com/vadimdemedes/ink). Navigate projects, experience, skills, and socials from the CLI :)

![Screenshot of shrikarthik terminal portfolio](./image.png)

## Run this locally to see the portfolio

```bash
npx shrikarthik
```

npm = https://www.npmjs.com/package/shrikarthik
github = https://github.com/Kart8ik/portfolio-TUI

## Terminal compatibility

This CLI uses animated ANSI rendering and dense Unicode block characters for the portrait.

For the best experience, run it in a modern terminal:

* Windows Terminal
* iTerm2
* Warp
* Kitty
* Alacritty
* GNOME Terminal

The default macOS Terminal.app and some minimal SSH terminals may render the portrait incorrectly.


## Local development (if u wanna check out how it works)


**Requirements:** [Bun](https://bun.sh)

```bash
bun install
bun run dev
```

Build for production:

```bash
bun run build
bun run start
```

## Scripts

| Script | Command |
|--------|---------|
| `dev` | Run with hot reload |
| `build` | Compile to `dist/cli.js` (Node target) |
| `start` | Run built output |
| `prepublishOnly` | Auto-runs before `npm publish` |
