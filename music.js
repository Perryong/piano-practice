import {merryChristmas,oneSummerDayEasy} from './pieces.js';
export function noteNumber(note) {
  const match = typeof note === 'string' && /^([A-G])([#b]?)([2-7])$/.exec(note);
  if (!match) throw new Error(`Invalid note: ${String(note).slice(0,20)}. Use names like C4 or F#4.`);
  const number = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[match[1]] + (match[2]==='#'?1:match[2]==='b'?-1:0) + 12*(Number(match[3])+1);
  if (number<36 || number>96) throw new Error(`${note} is outside this 61-key keyboard (C2–C7).`);
  return number;
}
const musicalContent = song => song.bars.map(bar => [bar.meter,...['left','right'].map(hand => bar[hand].map(e => [e.notes,e.duration]))]);
export const sameSong = (a,b) => a.title===b.title && JSON.stringify(musicalContent(a))===JSON.stringify(musicalContent(b));
export const noteName = number => ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][number%12]+(Math.floor(number/12)-1);
export const frequency = note => 440 * 2 ** ((noteNumber(note)-69)/12);
export function validateSong(input) {
  if (!input || typeof input!=='object' || typeof input.title!=='string' || !input.title.trim() || input.title.length>100) throw new Error('A practice file needs a title of 1–100 characters.');
  if (!Array.isArray(input.bars) || input.bars.length<1 || input.bars.length>500) throw new Error('A practice file needs 1–500 bars.');
  const bars=input.bars.map((bar,index)=>{
    if (!bar || !['3/4','4/4','12/8'].includes(bar.meter)) throw new Error(`Bar ${index+1}: use 3/4, 4/4 or 12/8.`);
    const total=bar.meter==='3/4'?6:bar.meter==='4/4'?8:12;
    const result={meter:bar.meter};
    for(const hand of ['left','right']) {
      const events=bar[hand];
      if(!Array.isArray(events) || events.length<1 || events.length>total*2) throw new Error(`Bar ${index+1}: missing ${hand}-hand notes.`);
      result[hand]=events.map(event=>{
        if(!event || !Number.isFinite(event.duration) || !Number.isInteger(event.duration*2) || event.duration<0.5 || event.duration>total || !Array.isArray(event.notes) || event.notes.length>10) throw new Error(`Bar ${index+1}: invalid note or duration.`);
        const numbers=event.notes.map(noteNumber);
        if(new Set(numbers).size!==numbers.length) throw new Error(`Bar ${index+1}: a chord repeats the same key.`);
        const result={notes:event.notes.slice(),duration:event.duration};
        if(event.fingers!==undefined){
          if(!Array.isArray(event.fingers)||event.fingers.length!==event.notes.length||event.fingers.some(f=>!Number.isInteger(f)||f<1||f>5)) throw new Error(`Bar ${index+1}: use one finger number (1–5) for each note.`);
          result.fingers=event.fingers.slice();
        }
        return result;
      });
      if(result[hand].reduce((sum,event)=>sum+event.duration,0)!==total) throw new Error(`Bar ${index+1}: ${hand} hand must total ${total} eighth-note steps.`);
    }
    return result;
  });
  return {title:input.title.trim(),composer:typeof input.composer==='string'?input.composer.slice(0,100):'',bars};
}
export function buildSteps(song) {
  const result=[];
  song.bars.forEach((bar,barIndex)=>{
    const resolution=[...bar.left,...bar.right].some(e=>!Number.isInteger(e.duration))?2:1;
    const expand=events=>events.flatMap(event=>Array.from({length:event.duration*resolution},(_,i)=>({notes:event.notes,fingers:event.fingers||[],press:i===0,remaining:event.duration-i/resolution})));
    const left=expand(bar.left),right=expand(bar.right);
    left.forEach((event,tick)=>result.push({bar:barIndex,tick,meter:bar.meter,unit:1/resolution,left:event,right:right[tick]}));
  });
  return result;
}
const event=(note,duration=2)=>({notes:note?[note]:[],duration});
const rest=()=>[event(null,8)];
const five=notes=>({meter:'4/4',left:rest(),right:notes.map(note=>event(note))});
export const exercises=[
  {title:'Your first five notes',composer:'Original beginner exercise',bars:[five(['C4','D4','E4','F4']),five(['G4','F4','E4','D4']),five(['C4','E4','G4','E4']),five(['D4','E4','D4','C4'])]},
  {title:'Two hands, one pattern',composer:'Original coordination exercise',bars:[
    {meter:'4/4',left:[event('C3',8)],right:['C4','E4','G4','E4'].map(n=>event(n))},
    {meter:'4/4',left:[event('F3',8)],right:['C4','F4','A4','F4'].map(n=>event(n))},
    {meter:'4/4',left:[event('G3',8)],right:['D4','G4','B4','G4'].map(n=>event(n))},
    {meter:'4/4',left:[event('C3',8)],right:[event('E4',2),event('D4',2),event('C4',4)]}
  ]},
  merryChristmas,
  oneSummerDayEasy
];

export function handView(step,which,mode='both') {
  const event=step[which],enabled=mode==='both'||mode===which;
  const indices=enabled?event.notes.map((_,i)=>i).filter(i=>!(which==='left'&&mode==='both'&&step.right.notes.some(n=>noteNumber(n)===noteNumber(event.notes[i])))):[];
  return {...event,enabled,shared:enabled&&indices.length<event.notes.length,
    notes:indices.map(i=>event.notes[i]),fingers:event.fingers?.length?indices.map(i=>event.fingers[i]):[]};
}
