# Starling Sprint

Original retro-inspired 2D side-scrolling platformer built with plain HTML5 Canvas, CSS, and JavaScript.

## Files

- `index.html`: entry page
- `styles.css`: layout and UI styles
- `game.js`: game systems, levels, enemies, HUD, audio, and lobby flow

## Controls

- `A/D` or `Left/Right`: move
- `W`, `Up`, or `Space`: jump
- `Enter`: continue after stage clear
- `R`: restart
- `Esc`: open lobby

## Play Locally

Open `index.html` in a browser.

## Deploy

This project is static, so it can be deployed directly to:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

No build step is required.

## Quick Deploy Checklist

1. Upload `index.html`, `styles.css`, and `game.js`.
2. Set the publish directory to the project root.
3. Use `index.html` as the main entry file.
4. After deployment, open the public URL and test:
   - lobby flow
   - difficulty selection
   - stage unlocking
   - audio playback
   - fullscreen/classic screen mode

## Notes

- The game uses browser audio APIs, so some sound effects may not start until the player interacts with the page.
- Game progress now persists in `localStorage`, including local account login, unlocked stages, score, and saved progression data between refreshes.
