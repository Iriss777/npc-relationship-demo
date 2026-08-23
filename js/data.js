"use strict";

const LOCATION_DATA={
  emmaHome:{name:"Emma 的家",icon:"⌂",copy:"书与暖灯的安静角落",description:"书架、小桌和柔和灯光让房间格外安静。"},
  leoHome:{name:"Leo 的家",icon:"⌂",copy:"装满户外回忆的小屋",description:"墙上挂着地图和背包，窗边摆着植物与小收藏。"},
  cafe:{name:"咖啡店",icon:"☕",copy:"咖啡与烤面包香",description:"空气里飘着新鲜咖啡的香气。"},
  square:{name:"广场",icon:"♬",copy:"小镇相遇的中心",description:"树影落在长椅和浅色石砖上。"},
  riverside:{name:"河边",icon:"≈",copy:"吹风散步的好地方",description:"河水缓缓流过，岸边草叶轻响。"}
};

const SCHEDULE_DATA={
  1:{emma:{morning:"cafe",afternoon:"square",dusk:"riverside",night:"emmaHome"},leo:{morning:"square",afternoon:"riverside",dusk:"cafe",night:"leoHome"}},
  2:{emma:{morning:"emmaHome",afternoon:"cafe",dusk:"square",night:"emmaHome"},leo:{morning:"riverside",afternoon:"square",dusk:"square",night:"leoHome"}},
  3:{emma:{morning:"cafe",afternoon:"riverside",dusk:"square",night:"emmaHome"},leo:{morning:"leoHome",afternoon:"riverside",dusk:"square",night:"riverside"}}
};

const NPC_DATA=[
  {id:"emma",name:"Emma",avatar:"E",friendship:0,completedConversations:[],giftedToday:false,giftHistory:{},specialEventTriggered:false,unlockedScheduleLevel:"unknown"},
  {id:"leo",name:"Leo",avatar:"L",friendship:0,completedConversations:[],giftedToday:false,giftHistory:{},specialEventTriggered:false,unlockedScheduleLevel:"unknown"}
];

const ITEM_DATA={
  hotCoffee:{name:"热咖啡",icon:"☕",tags:["warm","drink","quiet"]},daisy:{name:"雏菊",icon:"🌼",tags:["nature","gentle"]},shell:{name:"贝壳",icon:"🐚",tags:["nature","outdoor","collectible"]},oldBook:{name:"旧书",icon:"📖",tags:["reading","quiet"]},feather:{name:"漂亮羽毛",icon:"🪶",tags:["nature","outdoor","collectible"]},
  muffin:{name:"蓝莓松饼",icon:"🫐",tags:["warm","handmade","food"]},postcard:{name:"手工明信片",icon:"💌",tags:["handmade","thoughtful"]},driftwood:{name:"漂流木",icon:"🪵",tags:["nature","outdoor","collectible"]},cookie:{name:"手工饼干",icon:"🍪",tags:["warm","handmade","food"]},chiliCandy:{name:"辣椒糖",icon:"🌶️",tags:["unusual","energetic","spicy"]},
  herbalTea:{name:"香草茶",icon:"🍵",tags:["warm","drink","quiet"]},ribbon:{name:"彩色丝带",icon:"🎀",tags:["colorful","handmade"]},pebble:{name:"光滑鹅卵石",icon:"🪨",tags:["nature","outdoor","collectible"]},photoFrame:{name:"小相框",icon:"🖼️",tags:["handmade","thoughtful","quiet"]},compass:{name:"旧指南针",icon:"🧭",tags:["outdoor","unusual","adventure"]}
};

const DAILY_ITEMS={
  1:{cafe:"hotCoffee",square:"daisy",riverside:"shell",emmaHome:"oldBook",leoHome:"feather"},
  2:{cafe:"muffin",square:"postcard",riverside:"driftwood",emmaHome:"cookie",leoHome:"chiliCandy"},
  3:{cafe:"herbalTea",square:"ribbon",riverside:"pebble",emmaHome:"photoFrame",leoHome:"compass"}
};
const BEST_GIFTS={emma:{1:"hotCoffee",2:"muffin",3:"herbalTea"},leo:{1:"daisy",2:"driftwood",3:"pebble"}};
const RELATION_EVENT_DATA={emma:{title:"广场小憩",day:3,period:"dusk",location:"square",lines:["你最近经常来找我。","其实我很喜欢傍晚待在这里。","如果你不忙的话，要不要一起坐一会儿？"],yes:"那太好了。能这样一起坐着，我很开心。",no:"没关系，下次吧。"},leo:{title:"河边散步",day:3,period:"afternoon",location:"riverside",lines:["我每次来这里都会沿着河走一圈。","今天的风正好，路上应该会看到不少东西。","要不要一起走走？"],yes:"太好了！今天我们慢慢走，把沿路的东西都看清楚。",no:"没问题，下次出发前我再叫你！"}};

const ITEM_MESSAGES={hotCoffee:"你买了一杯热咖啡。",daisy:"你在花坛边发现了一朵雏菊。",shell:"你发现了一枚光滑的贝壳。",oldBook:"Emma 从书架上拿出一本自己看完的旧书送给你。",feather:"Leo 把一根散步时捡到的漂亮羽毛送给你。",muffin:"店员递给你一份刚出炉的蓝莓松饼。",postcard:"你在小摊上得到一张手工明信片。",driftwood:"你在水边找到一小段形状有趣的漂流木。",cookie:"Emma 请你带走一份她做的手工饼干。",chiliCandy:"Leo 笑着递来一颗奇怪的辣椒糖。",herbalTea:"店员为你装好一杯温热的香草茶。",ribbon:"庆典后，你捡到一条漂亮的彩色丝带。",pebble:"你找到一颗被水磨得圆润的鹅卵石。",photoFrame:"Emma 把一个闲置的小相框送给你。",compass:"Leo 把收藏的旧指南针交给你看看。"};

const values={
  emma:{hotCoffee:10,daisy:4,shell:1,oldBook:10,feather:2,muffin:10,postcard:6,driftwood:1,cookie:8,chiliCandy:-4,herbalTea:10,ribbon:4,pebble:1,photoFrame:9,compass:0},
  leo:{hotCoffee:3,daisy:10,shell:8,oldBook:1,feather:10,muffin:6,postcard:4,driftwood:10,cookie:5,chiliCandy:8,herbalTea:2,ribbon:5,pebble:10,photoFrame:2,compass:10}
};
const tier=v=>v>=8?"favorite":v>=5?"like":v>=1?"neutral":"dislike";
const GIFT_REPLIES={emma:{favorite:"这个真的很适合我……谢谢你。",like:"你还挺会挑东西的。",neutral:"谢谢，我会收好的。",dislike:"呃……我可能不太习惯这个。"},leo:{favorite:"哇，这个太棒了！你真懂我！",like:"不错啊，这个很有意思！",neutral:"谢啦，我先收着！",dislike:"哈哈，这个可能不太适合我。"}};
const GIFT_DATA=Object.fromEntries(Object.keys(values).map(npc=>[npc,Object.fromEntries(Object.entries(values[npc]).map(([id,value])=>[id,{value,reply:GIFT_REPLIES[npc][tier(value)]}]))]));

const choice=(text,response,value)=>({text,response,value});
const THEMES={
  emma:[
    ["没有咖啡的话，总觉得一天还没真正开始。","这里安静下来时，我会更容易听见自己的想法。","最近在读一本节奏很慢的书，反而让人放松。"],
    ["我喜欢这里，不只因为咖啡，也因为没人催我说话。","小时候我总在书里躲开太吵闹的下午。","Leo 说我应该偶尔试试没计划的散步。"],
    ["我以前不太习惯主动跟别人聊天。","最近遇见你时，我好像没那么担心冷场了。","三天很短，但有些了解并不需要很久。"]
  ],
  leo:[
    ["早上走一圈，整个人都会醒过来！","河边每次刮风都像换了一条新路。","奇怪的小东西总让我想知道它从哪儿来。"],
    ["我喜欢散步，因为走着走着总会碰见计划外的东西。","待在河边会让我觉得这个镇子比地图上大得多。","我以前总觉得认识一个地方，就是走遍每条路。"],
    ["最近总碰见你，感觉这个镇子都热闹了一点。","我发现一起走过的路，会比一个人走时记得更清楚。","三天里发生了这么多事，挺不可思议的。"]
  ]
};
const LEVEL_OPEN={emma:{"陌生":"她礼貌地看向你。","熟悉":"她看到你，神情放松了一些。","朋友":"她已经为你留出了聊天的位置。","亲密":"她自然地招呼你坐到身边。"},leo:{"陌生":"他爽朗地向你打招呼。","熟悉":"他远远就朝你挥起了手。","朋友":"他迫不及待地想和你分享今天的发现。","亲密":"他已经把你算进今天的计划里。"}};
const BEST=[3,3,4];
const DIALOGUE_DATA={};
for(const npc of ["emma","leo"]){DIALOGUE_DATA[npc]={};for(let day=1;day<=3;day++){DIALOGUE_DATA[npc][day]={};for(let i=0;i<3;i++){const id=`d${day}_${i+1}`,topic=THEMES[npc][day-1][i],best=BEST[i],period=["morning","afternoon","dusk"][i];DIALOGUE_DATA[npc][day][id]={period,location:SCHEDULE_DATA[day][npc][period],opening:Object.fromEntries(["陌生","熟悉","朋友","亲密"].map(level=>[level,`${LEVEL_OPEN[npc][level]} ${topic}`])),choices:npc==="emma"?[choice("我愿意慢慢听你说。","谢谢，你没有急着替我下结论。",best),choice("我大概能理解这种感觉。","嗯，被理解的感觉很好。",2),choice("也许你只是想得太多了。","可能吧，不过我还是想按自己的节奏来。",-1)]:[choice("下次也带上我，一起去看看。","好啊！我就喜欢说走就走。",best),choice("听起来确实很有意思。","对吧？下次我再告诉你更多。",2),choice("我还是觉得待在室内省事。","哈哈，我们喜欢的节奏不太一样。",i===2?-2:0)]};}}}

const REPEAT_DIALOGUE={emma:"我们今天已经聊了不少，剩下的慢慢说吧。",leo:"今天聊得真痛快！剩下的下次继续！"};
const NIGHT_DIALOGUE={emma:{"陌生":"已经有点晚了……我们明天再聊吧。","熟悉":"今天过得怎么样？可以聊一小会儿。","朋友":"其实我晚上一般很少和别人聊天。","亲密":"你来了。今天也一起安静地坐一会儿吧。"},leo:{"陌生":"今天跑了不少地方，明天再一起聊吧！","熟悉":"回来啦？正好听我讲讲今天的发现。","朋友":"进来吧，我刚把今天的路线画在地图上。","亲密":"我正等你呢，今天的最后一段故事留给你。"}};

const DUO_LINE="Emma：Leo 又在说他今天看到的那只奇怪的鸟。　Leo：因为真的很奇怪啊！";
const BALANCE_TABLE=[1,2,3].flatMap(day=>["emma","leo"].map(npc=>({day,npc,dialogueMax:10,giftMax:10,dailyMax:20})));

