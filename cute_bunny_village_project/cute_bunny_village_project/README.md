# Redleaf Learning Quest

Redleaf Learning Quest is a retro handheld RPG inspired browser game for Year 2 learners.
It now includes:

- A larger top-down adventure with multiple towns, routes, buildings, and indoor lesson spaces
- Generated SVG character sprites and building art created locally for this project
- Year 2 maths practice with addition, subtraction, and simple multiplication
- Reading-understanding questions built around short passages and clue finding
- Eight main quest stamps, bonus practice ribbons, save support, and a long lantern-festival story

## Run

Open `index.html` in a browser.

Everything is local, so no build step or package install is required.

## GitHub Pages

This project is ready for GitHub Pages through the workflow at `.github/workflows/deploy-pages.yml`.

1. Push the whole repository to GitHub.
2. In GitHub, open `Settings` -> `Pages`.
3. Under `Source`, choose `GitHub Actions`.
4. Push to `main` or `master`, or run the workflow manually from the `Actions` tab.

GitHub Pages will publish the contents of this folder:

- `cute_bunny_village_project/`

Your public URL will usually be:

- `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

If your repository is named `YOUR-USERNAME.github.io`, then the site URL will be:

- `https://YOUR-USERNAME.github.io/`

## Controls

- `W A S D` move
- `Arrow keys` move
- `Shift` hold to run
- `R` toggle run
- `E`, `Enter`, or `Space` talk / continue
- `1 2 3 4` answer question choices
- `K` quick save

## Main Files

- `index.html` page layout and UI
- `style.css` retro presentation and responsive layout
- `src/content.js` maps, story data, NPCs, and question packs
- `src/game.js` engine, movement, rendering, save logic, dialogue, and QA checks
- `assets/characters/*_redleaf.svg` generated character sprite sheets
- `assets/buildings/*_redleaf.svg` generated building art

## Notes

- The story content targets roughly 3 or more hours for a Year 2 player pace, depending on reading speed and how much bonus practice they complete.
- The game keeps the classic creature-adventure feel without using Pokemon names, logos, or copied art.
