# Piano practice app

Goal: carry the existing 61-key play-along guide into a standalone GitHub Pages app for a beginner.

Approach: buildless HTML, CSS and browser JavaScript. Reuse the existing Web Audio approach; no server, account, API key or paid service. A server-based app adds no value to the requested local playback. The repository contains original exercises; transcriptions from the user's PDFs remain separate local import files.

Files: index.html (page), styles.css (responsive layout), music.js (score validation, note mapping, timed steps and original exercises), app.js (rendering, playback and local imports), tests/music.test.mjs (score and timing checks), .github/workflows/pages.yml (GitHub Pages deployment).

Checks: validate imported scores before storage; preserve the active lesson on invalid input; test chord onsets, note releases, exact bar totals, keyboard range and malformed inputs. Browser-check playback, pause, speed, repeat, hand selection, import, reload and narrow layouts. Publishing depends on the user's repository choice.
