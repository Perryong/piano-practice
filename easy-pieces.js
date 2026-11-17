// Teaching adaptations of the two user-supplied PDFs. Durations are eighth notes.
// Each row is melody, held bass, then a phrase-specific right-hand fingering.
const events = (text, fingers) => {
  let i=0;
  return text.split(' ').map(token=>{
    const [note,duration='1']=token.split(':');
    return {notes:note==='-'?[]:[note],duration:Number(duration),fingers:note==='-'?[]:[fingers[i++]]};
  });
};
const edition = (title,composer,meter,rows) => ({title,composer,bars:rows.map(([right,left,fingers])=>({
  meter,right:events(right,fingers.split(' ').map(Number)),
  left:events(left,left.split(' ').filter(t=>!t.startsWith('-')).map(()=>5))
}))});

// Call of Silence: source bars 1–69, Vivace edition. Pad the pickup with a half-rest.
// Octave doublings, inner voices, ornaments and busy bass figures are omitted.
// High peaks and the final melody are lowered by an octave; ties at barlines rearticulate.
const silenceRows = [
  ['-:4 A4:2 C5:2','-:8','1 2'], // 1
  ['E5:4 G5:4','F3:8','1 3'],
  ['G5:4 E5:4','G3:8','3 1'],
  ['G5:2 A5:2 E5:4','A2:8','3 4 1'],
  ['E5:4 C5:2 B4:2','A2:8','4 2 1'],
  ['D5:4 E5:4','F3:8','2 3'],
  ['E5:4 G5:2 E5:2','G3:8','1 3 1'],
  ['G5:2 A5:6','A2:8','3 4'],
  ['A5:8','A2:8','4'],
  ['E5:4 G5:4','F3:8','1 3'], // 10
  ['G5:4 E5:4','G3:8','3 1'],
  ['G5:2 A5:2 E5:4','A2:8','3 4 1'],
  ['E5:4 G5:2 D5:2','A2:8','2 4 1'],
  ['D5:2 C5:6','F3:8','2 1'],
  ['C5:4 E5:2 G5:2','E3:8','1 3 5'],
  ['G5:2 A5:6','A2:8','3 4'],
  ['-:8','A2:8',''],
  ['-:8','A2:8',''],
  ['-:4 A4:2 E5:2','F3:8','1 5'],
  ['E5:4 A5:2 E5 B4','G3:8','1 4 3 1'], // 20
  ['B4:4 G5:2 A4 C5','G3:8','2 5 1 3'],
  ['C5:4 A5:4','A2:8','1 5'],
  ['-:4 A4:2 E5:2','A2:8','1 5'],
  ['E5:4 A5:2 E5 B4','F3:8','1 4 3 1'],
  ['B4:4 G5:2 C5 E5','G3:8','1 5 2 4'],
  ['E5:4 A5:4','A2:8','1 4'],
  ['-:4 A4:2 E5:2','E3:8','1 5'],
  ['E5:4 -:2 E5 B4','F3:8','5 5 1'],
  ['B4:4 -:2 C5 G4','G3:8','3 4 1'],
  ['G4:8','A2:8','1'], // 30
  ['-:4 G4:2 E4 G4','A2:8','3 1 3'],
  ['G4:8','F3:8','3'],
  ['-:4 D5:2 C5 D5','G3:8','3 2 3'],
  ['D5:6 C5 A4','A2:8','4 3 1'],
  ['A4:4 -:4','A2:8','1'],
  ['-:4 A5:4','A2:8','5'],
  ['-:4 E5:2 D5:2','A2:4 G2:4','3 2'],
  ['D5:4 C5:2 G5:2','F3:8','2 1 5'],
  ['C5:4 B4:2 C5:2','G3:8','2 1 2'],
  ['C5:8','A2:8','2'], // 40
  ['-:4 E5:2 D5:2','A2:4 G2:4','3 2'],
  ['D5:2 C5:2 G4:2 E5:2','F3:8','4 3 1 5'],
  ['D5:4 E5:2 C5:2','G3:8','2 3 1'],
  ['C5:8','A2:8','1'],
  ['-:4 E5:2 D5:2','G2:8','3 2'],
  ['D5:2 C5:2 C5:2 G5:2','F3:8','2 1 1 5'],
  ['G5:2 G5:2 D5:2 C5:2','G3:8','5 5 2 1'],
  ['C5:4 -:4','A2:8','1'],
  ['-:4 A4:2 C5:2','A2:4 G2:4','1 2'],
  ['D5:4 D5:2 C5:2','F3:8','3 3 2'], // 50
  ['D5:2 E5:2 D5:2 D5:2','G3:8','3 4 3 3'],
  ['D5:2 C5:4 -:2','A2:8','3 2'],
  ['-:2 C5:2 B4:2 E4 A4','G2:8','4 3 1 2'],
  ['A4:4 -:4','F3:8','2'],
  ['-:2 C5:2 B4:2 E4 C4','G3:8','5 4 2 1'],
  ['C4:2 -:6','A2:8','1'],
  ['-:2 C5:2 B4:2 E4 A4','E3:8','4 3 1 2'],
  ['A4:4 -:2 A4 B4','F3:8','2 2 3'],
  ['B4:4 -:2 D5 C5','G3:8','2 4 3'],
  ['C5:4 -:4','A2:8','3'], // 60
  ['-:2 C5:2 B4:2 E4 A4','A2:8','4 3 1 2'],
  ['A4:8','F3:8','2'],
  ['-:2 C5:2 B4:2 E4 C4','G3:8','5 4 2 1'],
  ['C4:8','A2:8','1'],
  ['-:2 C5:2 B4:2 C5 D5','E3:8','2 1 2 3'],
  ['D5:4 -:2 E5 E5','F3:8','3 4 4'],
  ['E5:4 -:2 C5 B4','G3:8','5 3 2'],
  ['B4:8','A2:8','2'],
  ['B4:8','A2:8','2'] // 69
];
export const callOfSilenceEasy=edition('Call of Silence — Easy 61 keys',
  'Hiroyuki Sawano · Easy melody + bass · 69 bars · Octaves simplified','4/4',silenceRows);

// golden hour: all 80 written bars of Verona's Simplified Piano PDF, in order.
// Sixteenths become one six-note eighth-note pattern; the upper line is lowered.
// No repeat/DS jumps, rolled chords or triplets. Sustained bass replaces arpeggios.
const goldenRows = [
  ['D4 E4 G4 A4 G4 E4','F3:6','1 2 4 5 4 2'], // 1
  ['D4 E4 G4 A4 G4 E4','F3:6','1 2 4 5 4 2'],
  ['C4 E4 G4 A4 G4 E4','E3:6','1 2 4 5 4 2'],
  ['C4 E4 G4 A4 G4 E4','E3:3 Eb3:3','1 2 4 5 4 2'],
  ['C4 D4 F4 G4 F4 D4','D3:6','1 2 4 5 4 2'],
  ['C4 D4 F4 G4 F4 D4','D3:6','1 2 4 5 4 2'],
  ['B3 C4 D4 E4 D4 C4','C3:6','1 2 3 4 3 2'],
  ['B3 C4 D4 E4 D4 C4','C3:6','1 2 3 4 3 2'],
  ['E4 F4 E4 E5 -:2','F3:6','1 2 1 5'],
  ['E4 F4 E4 E4 F4 E4','F3:6','1 2 1 1 2 1'], // 10
  ['E4 F4 E4 E5 -:2','E3:6','1 2 1 5'],
  ['E4 F4 E4 E4 F4 E4','E3:3 Eb3:3','1 2 1 1 2 1'],
  ['E4 F4 E4 D4 D5 -','D3:6','2 3 2 1 5'],
  ['E4 F4 E4 D4 D5 -','D3:6','2 3 2 1 5'],
  ['E4 F4 E4 B4 F4 E4','C3:6','1 2 1 5 2 1'],
  ['C5 F4 E4 D5 F4 E4','C3:6','5 2 1 5 2 1'],
  ['A4:4 A4 B4','F3:3 C3:3','3 3 4'],
  ['C5:4 A4 C5','F3:3 C3:3','5 3 5'],
  ['B4 A4 G4 G4:2 E4','E3:3 B2:3','5 4 3 3 1'],
  ['B4 A4 G4 B4 A4 G4','E3:3 Eb3:3','5 4 3 5 4 3'], // 20
  ['G4 F4:5','D3:6','3 2'],
  ['F4:2 A4 G4 F4 E4','D3:6','2 4 3 2 1'],
  ['E4:3 A4:3','E3:6','1 2'],
  ['C5:3 D5:3','E3:6','3 4'],
  ['E5 E4 G4 A4 G4 E4','F3:6','5 1 3 4 3 1'],
  ['D4 E4 G4 A4 G4 E4','F3:6','1 2 4 5 4 2'],
  ['A4:3 B4:3','F3:3 C3:3','3 4'],
  ['G5:3 F5:3','F3:3 C3:3','5 4'],
  ['E5 C4 D4 E4 D4 C4','C3:6','5 1 2 3 2 1'],
  ['B3 C4 D4 E4 D4 C4','C3:6','1 2 3 4 3 2'], // 30
  ['B3 C4 D4 E4 D4 C4','C3:6','1 2 3 4 3 2'],
  ['B3 C4 D4 E4 D4 C4','C3:6','1 2 3 4 3 2'],
  ['E4:3 B3:3','E3:6','5 1'],
  ['C4 D4 E4:2 G4:2','C3:2 D3:2 E3:2','1 2 3 5'],
  ['A4:4 A4 B4','F3:3 C3:3','3 3 4'],
  ['C5:4 A4 C5','F3:3 C3:3','5 3 5'],
  ['B4 A4 G4 G4:2 E4','E3:3 B2:3','5 4 3 3 1'],
  ['B4 A4 G4 B4 A4 G4','E3:3 Eb3:3','5 4 3 5 4 3'],
  ['G4 F4:5','D3:6','3 2'],
  ['F4:2 A4 G4 F4 E4','D3:6','2 4 3 2 1'], // 40
  ['E4:3 A4:3','E3:6','1 2'],
  ['C5:3 D5:3','E3:6','3 4'],
  ['E5 E4 G4 A4 G4 E4','F3:6','5 1 3 4 3 1'],
  ['D4 E4 G4 A4 G4 E4','F3:6','1 2 4 5 4 2'],
  ['A4:3 B4:3','F3:3 C3:3','3 4'],
  ['G5:3 F5:3','F3:3 C3:3','5 4'],
  ['E5 C4 D4 E4 D4 C4','C3:6','5 1 2 3 2 1'],
  ['B3 C4 D4 E4 D4 C4','C3:6','1 2 3 4 3 2'],
  ['B3 C4 D4 E4 D4 C4','C3:6','1 2 3 4 3 2'],
  ['B3 C4 D4 E4 D4 C4','C3:6','1 2 3 4 3 2'], // 50
  ['E5:6','F3:6','2'],
  ['A4:6','F3:6','2'],
  ['A4:3 B4:3','F3:6','3 4'],
  ['G5:3 F5:3','D3:6','3 2'],
  ['E5:6','C3:6','1'],
  ['B4:6','C3:6','1'],
  ['-:3 B4:3','C3:6','2'],
  ['C5:3 D5:3','C3:6','3 4'],
  ['E5:6','F3:6','5'],
  ['E5:6','F3:6','5'], // 60
  ['A4:3 B4:3','F3:6','1 2'],
  ['G5:3 F5:3','D3:6','5 4'],
  ['E5:6','C3:6','3'],
  ['E5:6','C3:6','3'],
  ['-:3 B4:3','C3:6','1'],
  ['C5:3 D5:3','C3:6','2 3'],
  ['E5:3 C5:3','F3:6','5 3'],
  ['A4:6','F3:6','1'],
  ['E5:3 B4:3','E3:6','5 2'],
  ['G4:6','E3:6','1'], // 70
  ['Db5:3 A4:3','D3:6','4 1'],
  ['Ab4:3 E4:3','D3:6','4 1'],
  ['Db5:3 A4:3','Eb3:6','4 1'],
  ['Ab4:6','Eb3:6','2'],
  ['B4:3 Gb4:3','C3:6','5 2'],
  ['B4:3 D5:3','C3:6','3 5'],
  ['Db5:3 F4 Ab4 Db5','Db3:6','5 1 2 5'],
  ['B4 Db5 B4 F5 Db5 Ab5','Db3:6','1 2 1 3 1 5'],
  ['Ab5:6','Db3:6','5'],
  ['Ab5:6','Db3:6','5'] // 80
];
export const goldenHourEasy=edition('golden hour — Easy 61 keys',
  'JVKE · Easy patterns + bass · 80 written bars · No repeat jumps','6/8',goldenRows);
