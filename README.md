# Small Steps — Piano practice

A beginner-friendly 61-key piano practice app for GitHub Pages. Play synthesized keyboard tones, follow highlighted keys, slow down from 120 to 20 quarter-note BPM, practise one hand, repeat a bar, or step through notes manually. Includes two original beginner exercises and the 51-bar Merry Christmas, Mr. Lawrence transcription from the user-supplied Gabriella Lozza arrangement, plus a 36-bar easy adaptation of One Summer’s Day from the user-supplied Piano Seeds STUDIO score.

## Try locally

Run `npm start`, then open http://127.0.0.1:4173. No package installation or API key is needed. Run `npm test` for the score and timing checks.

## Personal music

Select **Add a practice file** to import a JSON score. Identical copies are merged into one library entry. Scores stay in browser local storage; there is no server upload. PDFs cannot be automatically transcribed in this app. Upload a PDF in your assistant chat and ask for a **Small Steps practice JSON** instead. The help panel downloads a working example.

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

Push to `main` and set **Settings → Pages → Source → GitHub Actions**. The workflow tests the app and publishes only the six static app assets. All asset URLs are relative, so repository subpaths work. The public source includes the two exercises and the requested Merry Christmas, Mr. Lawrence practice transcription and the One Summer’s Day easy adaptation. Other imported scores stay local to the browser.

## Limits

Sound is synthesized rather than a recorded piano. Playback pauses when the tab is hidden. This is a visual/audio practice aid, not microphone or MIDI performance grading. The initial format supports 3/4, 4/4 and 12/8 with sixteenth-note precision. No analytics or external requests are used by the app.

## One Summer’s Day — Easy 61 keys

This is a teaching adaptation of the user's Piano Seeds STUDIO PDF, not an exact performance of that arrangement. It covers the main piece (source bars 5–40); the optional four-bar introduction is omitted. App bar 1 is the opening bass note and the right-hand melody starts in app bar 2. App bar numbers therefore equal source bar numbers minus four.

The right hand plays one melody note at a time, mostly an octave below the score. The low transition in source bar 27 is kept up so the hands do not cross. The left hand plays a single held bass note instead of the source chords and arpeggios. Sixteenth-note decorations and the short triplet are simplified into eighth-note rhythms, and the final rolled/accumulating chord is reduced to a held bass note. Tempo is steady; expressive slowdowns, fermatas and pedal are not reproduced. All notes fit C2–C7.

Choose the piece, start at 30 BPM, and practise the right hand from bar 2. Add the left hand once the melody feels comfortable. The repeat-bar option and separate-hand controls work with this piece.
