import {noteNumber,noteName,frequency,validateSong,buildSteps,exercises} from './music.js';
const $=id=>document.getElementById(id);
const STORAGE='small-steps-piano-v1';
let imported=[],saved={};
try { const data=JSON.parse(localStorage.getItem(STORAGE)||'{}');saved=data.settings||{};if(Array.isArray(data.songs))imported=data.songs.slice(0,10).map(s=>validateSong(s)); } catch { /* A corrupt or unavailable cache never prevents practice. */ }
const library=()=>[...exercises,...imported];
let song=library()[Number.isInteger(saved.song)?Math.min(Math.max(0,saved.song),library().length-1):0],steps=buildSteps(song),position=0;
let bpm=Number.isFinite(saved.bpm)?Math.min(120,Math.max(20,saved.bpm)):60;
let hand=['left','right','both'].includes(saved.hand)?saved.hand:'both',repeat=false;
let audio=null,wave=null,playing=false,starting=false,timer=null,voices=new Set(),queue=[],scheduled=0,nextAt=0,finishAt=null,first=true,finished=false,session=0;
function message(text) { $('notice').textContent=text;$('notice').hidden=!text; }
function persist() {
  try { localStorage.setItem(STORAGE,JSON.stringify({songs:imported,settings:{song:library().indexOf(song),bpm,hand}})); }
  catch { message('Your browser could not save these notes. You can still practise; keep your file to import again later.'); }
}
function renderLibrary() {
  $('library').replaceChildren();
  library().forEach((item,i)=>{
    const button=document.createElement('button');button.type='button';button.className='lesson'+(item===song?' active':'');button.setAttribute('aria-current',item===song?'true':'false');
    const number=document.createElement('span');number.className='lesson-number';number.textContent=String(i+1).padStart(2,'0');
    const content=document.createElement('span'),title=document.createElement('strong'),meta=document.createElement('small');title.textContent=item.title;meta.textContent=item.bars.length+' bars · '+(i<2?'Start here':i<exercises.length?'Ready to practise':'Your imported piece');content.append(title,meta);button.append(number,content);button.addEventListener('click',()=>selectSong(item));$('library').append(button);
  });
}
function selectSong(item) {
  stop();song=item;steps=buildSteps(song);position=0;finished=false;
  $('song-title').textContent=song.title;$('song-description').textContent=song.composer||'Your personal practice piece';
  $('bar').replaceChildren(...song.bars.map((_,i)=>new Option(String(i+1),String(i))));renderLibrary();render();persist();
}
function keyboard(element,low,high,left,right,labels=false) {
  const whites=[];for(let n=low;n<=high;n++)if(!noteName(n).includes('#'))whites.push(n);
  const leftSet=new Set(left.map(noteNumber)),rightSet=new Set(right.map(noteNumber));element.replaceChildren();
  const classes=n=>leftSet.has(n)&&rightSet.has(n)?' both':leftSet.has(n)?' lh':rightSet.has(n)?' rh':'';
  whites.forEach(n=>{const key=document.createElement('div');key.className='key-white'+classes(n);if(labels)key.textContent=noteName(n);element.append(key);});
  for(let n=low;n<=high;n++)if(noteName(n).includes('#')){const before=whites.filter(v=>v<n).length,key=document.createElement('div');key.className='key-black'+classes(n);key.style.width=(65/whites.length)+'%';key.style.left=((before-.325)/whites.length*100)+'%';element.append(key);}
  element.setAttribute('role','img');element.setAttribute('aria-label',`Keyboard: left ${left.join(', ')||'rest'}; right ${right.join(', ')||'rest'}.`);
}
function handDisplay(which,event) {
  const enabled=hand==='both'||hand===which,notes=enabled?event.notes:[];
  $(which+'-action').textContent=!enabled?'Not playing':!notes.length?'Rest':event.press?'Press':'Hold';
  $(which+'-note').replaceChildren();
  const text=document.createTextNode(notes.join(' + ')||'—');$(which+'-note').append(text);
  if(notes.length){const meta=document.createElement('small');meta.textContent='key '+notes.map(n=>noteNumber(n)-35).join(' + ');$(which+'-note').append(meta);}
  const preview=notes.length?notes:steps.slice(position).find(s=>s[which].notes.length)?.[which].notes||['C4'];
  const numbers=preview.map(noteNumber),base=Math.min(84,Math.floor(Math.min(...numbers)/12)*12),end=Math.max(base+12,Math.ceil(Math.max(...numbers)/12)*12);
  keyboard($(which+'-keyboard'),base,Math.min(96,end),which==='left'?notes:[],which==='right'?notes:[],true);
}
function countLabel(step) { const t=step.tick*step.unit;return step.meter==='12/8'?(Math.floor(t/3)+1)+(Number.isInteger(t)?['',' and',' a'][t%3]:' +'):(Math.floor(t/2)+1)+['',' e',' and',' a'][Math.round(t*2)%4];}
function render() {
  const s=steps[position];$('bar-count').textContent=`Bar ${s.bar+1} of ${song.bars.length}`;$('bar').value=String(s.bar);
  const percent=Math.round(position/Math.max(1,steps.length-1)*100);$('progress-fill').style.width=percent+'%';document.querySelector('[role=progressbar]').setAttribute('aria-valuenow',String(percent));
  keyboard($('keyboard'),36,96,hand==='right'?[]:s.left.notes,hand==='left'?[]:s.right.notes);
  $('octaves').replaceChildren(...[36,48,60,72,84,96].map((n,i)=>{const label=document.createElement('span');label.style.left=(i===5?100:(i*7+.5)/36*100)+'%';label.textContent=noteName(n)+(n===60?' ★':'');return label;}));
  handDisplay('left',s.left);handDisplay('right',s.right);
  $('count').textContent=(s.meter+' · ')+'Count '+countLabel(s);
  const barSteps=steps.map((step,i)=>({...step,index:i})).filter(step=>step.bar===s.bar);$('steps').classList.toggle('compound',s.meter==='12/8');$('steps').replaceChildren();
  for(const step of barSteps){const button=document.createElement('button');button.type='button';button.className='step'+(step.index===position?' active':'');button.setAttribute('aria-label',`Step ${step.tick+1}, left ${step.left.notes.join(' ')||'rest'}, right ${step.right.notes.join(' ')||'rest'}`);button.setAttribute('aria-current',step.index===position?'step':'false');
    const count=document.createElement('small');count.textContent=countLabel(step);button.append(count);
    for(const which of ['left','right']){const label=document.createElement('span');label.className=which==='left'?'note-l':'note-r';const e=step[which];label.textContent=(which==='left'?'L ':'R ')+(e.notes.length?(e.press?e.notes.join('+'):'Hold'):'—');button.append(label);}
    button.addEventListener('click',()=>{stop();finished=false;position=step.index;render();});$('steps').append(button);
  }
  $('previous').disabled=position===0;$('next').disabled=position===steps.length-1;
}
function stop() {
  session++;playing=false;starting=false;clearInterval(timer);timer=null;queue=[];
  for(const voice of voices){try{voice.stop()}catch{}}voices.clear();
  $('play').replaceChildren(document.createTextNode('▶ '),Object.assign(document.createElement('span'),{textContent:'Play'}));$('play').setAttribute('aria-pressed','false');$('play').disabled=false;
  $('play-status').textContent='Paused · take your time';
}
function sound(note,time,duration) {
  const osc=audio.createOscillator(),gain=audio.createGain();osc.setPeriodicWave(wave);osc.frequency.value=frequency(note);
  const end=time+Math.max(.05,duration-.025),decay=Math.min(.22,(end-time)*.4);
  gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(.10,time+.008);gain.gain.exponentialRampToValueAtTime(.035,time+decay);gain.gain.exponentialRampToValueAtTime(.008,Math.max(time+decay,end-.025));gain.gain.linearRampToValueAtTime(0,end);
  osc.connect(gain);gain.connect(audio.destination);voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();gain.disconnect();};osc.start(time);osc.stop(end+.005);
}
function pump() {
  const now=audio.currentTime,seconds=30/bpm;
  while(!finishAt&&nextAt<now+.12){
    const step=steps[scheduled],notes=new Map();
    for(const which of ['left','right'])if(hand==='both'||hand===which){const e=step[which];if(e.press||first)for(const n of e.notes){const number=noteNumber(n),old=notes.get(number);if(!old||old.duration<e.remaining)notes.set(number,{note:n,duration:e.remaining});}}
    for(const {note,duration} of notes.values())sound(note,Math.max(now+.002,nextAt),duration*seconds);
    queue.push({index:scheduled,at:nextAt});nextAt+=seconds*step.unit;first=false;
    const next=scheduled+1;
    if(repeat&&(next>=steps.length||steps[next].bar!==step.bar)){scheduled=steps.findIndex(s=>s.bar===step.bar);first=true;}
    else if(next<steps.length)scheduled=next;else finishAt=nextAt;
  }
  let changed=false;while(queue.length&&queue[0].at<=now){position=queue.shift().index;changed=true;}if(changed)render();
  if(finishAt&&now>=finishAt){finished=true;stop();$('play-status').textContent='Well done. Play again from the beginning.';}
}
async function start() {
  if(playing||starting)return;const ticket=++session;starting=true;$('play').disabled=true;message('');
  try {
    const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw new Error('Sound is not available in this browser. Try a current version of Chrome, Safari or Edge.');
    if(!audio){audio=new Audio();wave=audio.createPeriodicWave(new Float32Array(5),new Float32Array([0,1,.25,.08,.025]));}
    await audio.resume();if(ticket!==session)return;
    if(audio.state!=='running')throw new Error('Tap Play again to enable sound.');
    if(finished){position=0;finished=false;render();}
    playing=true;scheduled=position;first=true;finishAt=null;queue=[];nextAt=audio.currentTime+.06;
    $('play').replaceChildren(document.createTextNode('Ⅱ '),Object.assign(document.createElement('span'),{textContent:'Pause'}));$('play').setAttribute('aria-pressed','true');$('play-status').textContent='Playing · follow the highlighted keys';pump();timer=setInterval(pump,20);
  } catch(error){if(ticket===session){stop();message(error.message);}}
  finally{if(ticket===session){starting=false;$('play').disabled=false;}}
}
$('play').addEventListener('click',()=>playing?stop():start());
$('previous').addEventListener('click',()=>{stop();finished=false;position=Math.max(0,position-1);render();});
$('next').addEventListener('click',()=>{stop();finished=false;position=Math.min(steps.length-1,position+1);render();});
$('bar').addEventListener('change',e=>{const bar=Number(e.target.value);stop();finished=false;position=steps.findIndex(s=>s.bar===bar);render();});
$('tempo').value=String(bpm);$('tempo-value').value=String(bpm);$('hand').value=hand;
$('tempo').addEventListener('input',()=>{const resume=playing;stop();bpm=Number($('tempo').value);$('tempo-value').value=String(bpm);persist();if(resume)start();});
$('hand').addEventListener('change',()=>{const resume=playing;stop();hand=$('hand').value;render();persist();if(resume)start();});
$('repeat').addEventListener('change',()=>{const resume=playing;stop();repeat=$('repeat').checked;if(resume)start();});
$('import').addEventListener('click',()=>$('file').click());
$('file').addEventListener('change',async()=>{
  const file=$('file').files[0];$('file').value='';if(!file)return;
  try{
    if(file.size>1024*1024)throw new Error('Please use a practice file smaller than 1 MB.');
    const item=validateSong(JSON.parse(await file.text()));
    if(imported.length>=10)throw new Error('This browser already holds 10 imported pieces. Use another browser profile for more.');
    imported.push(item);selectSong(item);message('Added '+item.title+'. Your notes are saved only in this browser.');
  }catch(error){message(error instanceof SyntaxError?'That file is not a practice JSON file. Upload the PDF in your chat first and ask for a Small Steps practice file.':error.message);}
});
$('example').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(exercises[0],null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='small-steps-example.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(playing||starting))stop();});window.addEventListener('pagehide',stop);
selectSong(song);$('play-status').textContent='Ready when you are';
