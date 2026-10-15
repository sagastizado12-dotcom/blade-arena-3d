# Blade Realm 3D — Meadowbrook (2.5D slice)
HD-2D style playable slice: Three.js tilted perspective world with 3D houses/trees/pond and pixel-art billboard characters.
Open `index.html` (static, no build). Legacy 2D game: `legacy.html` (built from `src/` via `./build.sh`).
Controls: WASD/arrows, J/Space attack, K/Shift dodge; touch joystick + A/B.

## Full open-world 3D build (index.html)
`index.html` now runs the full legacy simulation (`src/` → `src3d/legacy/game3d.js` via `./build3d.sh`) and renders the
outdoor world in 3D with `src3d/world3d.js`: legacy painted terrain chunks on 3D ground, instanced 3D trees/rocks/cliffs,
real 3D houses + town walls/towers, pixel billboards for every character (captured from the legacy chibi renderer),
3D particles for spells/blood, dynamic day/night lighting. Interiors and the intro still use the legacy 2D view.
Adult/flirt modules (`zu_sextag`, `yn_flirt`) and the pregnancy mechanic are excluded from this build.
The earlier 2.5D slice lives at `slice.html`; the original 2D game at `legacy.html`.
