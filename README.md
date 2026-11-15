# Small Steps — Piano practice

A beginner-friendly 61-key piano practice app for GitHub Pages. Play synthesized keyboard tones, follow highlighted keys, slow down from 120 to 20 quarter-note BPM, practise one hand, repeat a bar, or step through notes manually. Includes two original beginner exercises and the 51-bar Merry Christmas, Mr. Lawrence transcription from the user-supplied Gabriella Lozza arrangement.

## Try locally

Run `npm start`, then open http://127.0.0.1:4173. No package installation or API key is needed. Run `npm test` for the score and timing checks.

## Personal music

Select **Add a practice file** to import a JSON score. Scores stay in browser local storage; there is no server upload. PDFs cannot be automatically transcribed in this app. Upload a PDF in your assistant chat and ask for a **Small Steps practice JSON** instead. The help panel downloads a working example.

File shape:

```json
{
  "title": "My piece",
  "composer": "Composer or arranger",
  "bars": [{
    "meter": "4/4",
    "left": [{"notes": ["C3", "E3"], "duration": 8}],
    "right": [{"notes": ["C4"], "duration": 4}, {"notes": [], "duration": 4}]
  }]
}
```

Durations are eighth-note steps. Each hand must total 6 per 3/4 bar, 8 per 4/4 bar or 12 per 12/8 bar. Half-step durations (0.5) represent sixteenth notes. An empty notes array is a rest; multiple notes form a chord. Notes run from C2 to C7 with sharps/flats, including C#4 and Db4. Maximum 500 bars and 1 MB per file. Imported pieces are capped at 10 per browser. Clearing site data removes imported music: retain your source files.

## GitHub Pages

Push to `main` and set **Settings → Pages → Source → GitHub Actions**. The workflow tests the app and publishes only the six static app assets. All asset URLs are relative, so repository subpaths work. The public source includes the two exercises and the requested Merry Christmas, Mr. Lawrence practice transcription. Other imported scores stay local to the browser.

## Limits

Sound is synthesized rather than a recorded piano. Playback pauses when the tab is hidden. This is a visual/audio practice aid, not microphone or MIDI performance grading. The initial format supports 3/4, 4/4 and 12/8 with sixteenth-note precision. No analytics or external requests are used by the app.
