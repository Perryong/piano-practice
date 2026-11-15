import test from 'node:test';
import assert from 'node:assert/strict';
import {noteNumber, validateSong, buildSteps, frequency, exercises} from '../music.js';
const score=()=>({title:'Test',bars:[{meter:'4/4',left:[{notes:['C3','E3'],duration:8}],right:[{notes:['C4'],duration:2},{notes:[],duration:2},{notes:['D4'],duration:4}]}]});
test('61-key range and enharmonic names',()=>{assert.equal(noteNumber('C2'),36);assert.equal(noteNumber('C7'),96);assert.equal(noteNumber('Db4'),61);assert.equal(noteNumber('C#4'),61);assert.throws(()=>noteNumber('A1'));assert.throws(()=>noteNumber('D7'));assert.throws(()=>noteNumber('C4junk'));});
test('timing preserves chords, rests and held notes',()=>{const s=buildSteps(validateSong(score()));assert.equal(s.length,8);assert.deepEqual(s[0].left.notes,['C3','E3']);assert.equal(s[1].right.press,false);assert.equal(s[1].right.remaining,1);assert.deepEqual(s[2].right.notes,[]);assert.equal(s[4].right.press,true);assert.equal(s[7].right.remaining,1);});
test('reject malformed imports',()=>{for(const v of [null,{},[],{title:'x',bars:[]},{...score(),title:'x'.repeat(101)}])assert.throws(()=>validateSong(v));let v=score();v.bars[0].right[0].duration=0;assert.throws(()=>validateSong(v));v=score();v.bars[0].right[0].duration=1;assert.throws(()=>validateSong(v));v=score();v.bars[0].left[0].notes=['C8'];assert.throws(()=>validateSong(v));v=score();v.bars[0].left[0].notes=['C3','C3'];assert.throws(()=>validateSong(v));});
test('exercises validate and tuning is A440',()=>{for(const s of exercises)assert.ok(buildSteps(validateSong(s)).length>0);assert.equal(frequency('A4'),440);assert.equal(frequency('A5'),880);});
test('12/8 is twelve eighth-note steps',()=>{const v=score();v.bars[0].meter='12/8';v.bars[0].left[0].duration=12;v.bars[0].right=[{notes:['G4'],duration:12}];assert.equal(buildSteps(validateSong(v)).length,12);});
test('sixteenth notes retain exact note lengths and playback units',()=>{const v=score();v.bars[0].right=[{notes:['C4'],duration:.5},{notes:['D4'],duration:7.5}];const s=buildSteps(validateSong(v));assert.equal(s.length,16);assert.equal(s[0].unit,.5);assert.equal(s[1].right.press,true);assert.equal(s[2].right.remaining,7);assert.equal(s[15].right.remaining,.5);});
test('three-four meter totals six eighth notes',()=>{const v=score();v.bars[0].meter='3/4';v.bars[0].left[0].duration=6;v.bars[0].right=[{notes:['C4'],duration:6}];assert.equal(buildSteps(validateSong(v)).length,6);});

test('One Summer’s Day easy version covers the main piece within 61 keys',async()=>{
  const {oneSummerDayEasy,merryChristmas}=await import('../pieces.js');
  const song=validateSong(oneSummerDayEasy),steps=buildSteps(song);
  assert.equal(song.bars.length,36);
  assert.equal(merryChristmas.bars.length,51);
  assert.deepEqual(song.bars[1].right.filter(e=>e.notes.length).map(e=>e.notes[0]),['E4','E4','E4','E4','D4','E4','A4']);
  assert.deepEqual(song.bars.at(-1).right.map(e=>e.notes[0]),['A4','B4','E5']);
  for(const bar of song.bars)for(const hand of ['left','right'])for(const event of bar[hand]){
    assert.ok(event.notes.length<=1,'Only one note per hand');
    assert.ok(Number.isInteger(event.duration),'No sixteenth-note or triplet passages');
    for(const note of event.notes)assert.ok(noteNumber(note)>=36&&noteNumber(note)<=96);
  }
  for(const step of steps)if(step.left.notes.length&&step.right.notes.length)assert.ok(noteNumber(step.left.notes[0])<noteNumber(step.right.notes[0]),'Hands never cross');
  assert.equal(steps.length,36*8);
});

test('duplicate practice files match by title and notes, not display credits',async()=>{
  const {sameSong}=await import('../music.js');
  const original=score(),duplicate=structuredClone(original);
  duplicate.composer='Different display credit';
  assert.equal(sameSong(original,duplicate),true);
  duplicate.bars[0].right[0].notes=['E4'];
  assert.equal(sameSong(original,duplicate),false);
});
