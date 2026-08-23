"use strict";
const fs=require("fs"),vm=require("vm"),assert=require("assert");
const source=fs.readFileSync("js/data.js","utf8")+fs.readFileSync("js/dialogues-v2.js","utf8")+`;globalThis.out={LOCATION_DATA,SCHEDULE_DATA,ITEM_DATA,DAILY_ITEMS,BEST_GIFTS,GIFT_DATA,DIALOGUE_DATA_V2,RELATION_EVENT_DATA};`;
const box={};vm.createContext(box);vm.runInContext(source,box);const d=box.out;
const rulesBox={globalThis:{}};vm.createContext(rulesBox);vm.runInContext(fs.readFileSync("js/rules.js","utf8"),rulesBox);const rules=rulesBox.globalThis.GameRules;
assert.deepStrictEqual([0,19,20,39,40,59,60].map(rules.getRelationship),["陌生","陌生","熟悉","熟悉","朋友","朋友","亲密"]);
assert.deepStrictEqual(Object.keys(d.LOCATION_DATA).sort(),["cafe","emmaHome","leoHome","riverside","square"]);
assert.strictEqual(Object.keys(d.ITEM_DATA).length,15);
assert.strictEqual(new Set(Object.values(d.DAILY_ITEMS).flatMap(x=>Object.values(x))).size,15);
const allOptionSignatures=[];
function calculateMaxFriendshipByDay(npc){let friendship=0;const days=[];for(let day=1;day<=3;day++){
  const conversations=Object.values(d.DIALOGUE_DATA_V2[npc][day]);assert.strictEqual(conversations.length,4);
  for(const c of conversations){assert.strictEqual(c.location,d.SCHEDULE_DATA[day][npc][c.period]);assert.strictEqual(c.choices.length,3);assert.strictEqual(Object.keys(c.opening).length,4);allOptionSignatures.push(c.choices.map(x=>x.text).join("|"));}
  const daylight=conversations.filter(c=>c.period!=="night"),daylightMax=daylight.reduce((s,c)=>s+Math.max(...c.choices.map(x=>x.value)),0);assert.strictEqual(daylightMax,8);
  const giftId=d.BEST_GIFTS[npc][day],giftLocation=Object.keys(d.DAILY_ITEMS[day]).find(loc=>d.DAILY_ITEMS[day][loc]===giftId);assert.ok(["cafe","square","riverside"].includes(giftLocation));
  const giftMax=d.GIFT_DATA[npc][giftId].value;assert.strictEqual(giftMax,10);
  friendship=Math.min(60,friendship+daylightMax+giftMax);
  const nightAllowed=friendship>=20||(daylight.length===3&&giftMax===10);assert.ok(nightAllowed,"optimal route must unlock night");
  const nightMax=Math.max(...conversations.find(c=>c.period==="night").choices.map(x=>x.value));assert.strictEqual(nightMax,2);friendship=Math.min(60,friendship+nightMax);
  days.push({day,dialogueMax:daylightMax+nightMax,giftMax,total:daylightMax+nightMax+giftMax,ending:friendship});
 }return{npc,days,total:friendship};}
const emma=calculateMaxFriendshipByDay("emma"),leo=calculateMaxFriendshipByDay("leo");
assert.strictEqual(new Set(allOptionSignatures).size,24,"every conversation needs unique options");
assert.deepStrictEqual(emma.days.map(x=>x.ending),[20,40,60]);assert.deepStrictEqual(leo.days.map(x=>x.ending),[20,40,60]);
assert.strictEqual(emma.total,60);assert.strictEqual(leo.total,60);
for(const [id,e] of Object.entries(d.RELATION_EVENT_DATA)){assert.strictEqual(e.day,3);assert.strictEqual(d.SCHEDULE_DATA[3][id][e.period],e.location);assert.ok(e.lines.length>=3);}
for(const e of Object.values(d.RELATION_EVENT_DATA)){assert.strictEqual(rules.canTriggerRelationEvent({friendship:39,day:e.day,period:e.period,location:e.location,triggered:false},e),false);assert.strictEqual(rules.canTriggerRelationEvent({friendship:40,day:e.day,period:e.period,location:e.location,triggered:false},e),true);assert.strictEqual(rules.canTriggerRelationEvent({friendship:53,day:e.day,period:e.period,location:"wrong",triggered:false},e),false);}
console.log(JSON.stringify({emma,leo,dialogues:24,uniqueOptionSets:new Set(allOptionSignatures).size,events:Object.keys(d.RELATION_EVENT_DATA)},null,2));

