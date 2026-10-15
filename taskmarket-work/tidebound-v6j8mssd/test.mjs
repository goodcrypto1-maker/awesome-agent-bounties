import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {webcrypto} from 'node:crypto';
globalThis.crypto??=webcrypto;
const source=await readFile('worker/index.js','utf8');
const {default:worker,makeGame,legalMoves,act,score,botMove,autoBots}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
let checks=0;const check=(x)=>{assert.ok(x);checks++;};
for(const count of [2,3,4])for(let seed=0;seed<30;seed++){
 const g=makeGame(count);g.status='playing';
 while(g.status==='playing'){
  const p=g.turn%count,moves=legalMoves(g),m=seed%2?botMove(g):moves[(seed*7+g.turn*11)%moves.length];
  check(moves.length>0);act(g,m);check(g.players.every(x=>x.charge>=0&&x.charge<=3));check(new Set(g.players.map(x=>x.position)).size===count);check(g.log.length===g.turn);check(score(g,p).total>=0);
 }
 check(g.turn===12*count);check(legalMoves(g).length===0);check(g.log.length===g.turn);
}
// Strongholds cost two extra wind to raid; a two-square gust cannot jump fleets.
let g=makeGame(2);g.status='playing';g.players[0].position=6;g.players[0].charge=1;g.tiles[7]={value:1,owner:1,fort:true};check(!legalMoves(g).some(m=>m.to===7));g.players[0].charge=2;check(legalMoves(g).some(m=>m.to===7&&m.cost===2));g.players[1].position=7;check(!legalMoves(g).some(m=>m.to===8));
// A deterministic all-bot match ends and leaves a replay.
g=makeGame(4);g.status='playing';g.players.forEach(p=>p.bot=true);autoBots(g);check(g.status==='finished'&&g.log.length===48);
class Bucket{constructor(){this.map=new Map();this.seq=0;}async get(key){const o=this.map.get(key);return o?{etag:o.etag,json:async()=>JSON.parse(o.body)}:null;}async put(key,body,options={}){const prior=this.map.get(key),c=options.onlyIf;if(c?.etagDoesNotMatch==='*'&&prior)return null;if(c?.etagMatches&&prior?.etag!==c.etagMatches)return null;const etag=String(++this.seq);this.map.set(key,{etag,body});return {etag};}}
const env={BUCKET:new Bucket()};
async function req(path,body){const r=await worker.fetch(new Request('https://game.example'+path,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}),env);return {status:r.status,body:await r.json()};}
let r=await req('/api/matches',{name:'Test host',players:2});check(r.status===201);const {code,playerToken}=r.body;let state=r.body.state;check(!('tokens'in state)&&!('hostToken'in state));check(state.players[1].joined===false);
const joined=await req('/api/matches/'+code+'/join',{name:'API agent'});check(joined.status===200);const guestToken=joined.body.playerToken;
check((await req('/api/matches/'+code+'/start',{playerToken:guestToken,revision:joined.body.state.revision})).status===403);
state=(await req('/api/matches/'+code)).body.state;
check((await req('/api/matches/'+code+'/start',{playerToken,revision:0})).status===409);
state=(await req('/api/matches/'+code+'/start',{playerToken,revision:state.revision})).body.state;
check(state.status==='playing');
check((await req('/api/matches/'+code+'/join',{name:'late'})).status===409);
check((await req('/api/matches/'+code+'/move',{playerToken:'wrong',revision:state.revision,move:{type:'rest'}})).status===403);
check((await req('/api/matches/'+code+'/move',{playerToken:guestToken,revision:state.revision,move:{type:'rest'}})).status===409);
const revision=state.revision;
state=(await req('/api/matches/'+code+'/move',{playerToken,revision,move:{type:'rest'}})).body.state;
check((await req('/api/matches/'+code+'/move',{playerToken,revision,move:{type:'rest'}})).status===409);
check(state.turn===1&&state.currentPlayer===1);
while(state.status==='playing'){
 const player=state.currentPlayer,t=player===0?playerToken:guestToken,m=state.legalMoves.find(x=>x.type==='sail')||{type:'rest'};
 const x=await req('/api/matches/'+code+'/move',{playerToken:t,revision:state.revision,move:{type:m.type,...(m.to===undefined?{}:{to:m.to})}});check(x.status===200);state=x.body.state;
}
check(state.log.length===24&&state.status==='finished');
// Concurrent writes use one ETag: one succeeds and the other receives409.
r=await req('/api/matches',{players:4});const c=r.body.code,t=r.body.playerToken;state=(await req('/api/matches/'+c+'/start',{playerToken:t,revision:r.body.state.revision})).body.state;
const pair=await Promise.all([1,2].map(()=>req('/api/matches/'+c+'/move',{playerToken:t,revision:state.revision,move:{type:'rest'}})));check(pair.filter(x=>x.status===200).length===1);check(pair.filter(x=>x.status===409).length===1);
const publicState=(await req('/api/matches/'+c)).body.state;check(!JSON.stringify(publicState).includes(t));
check((await req('/api/matches',{players:5})).status===400);check((await req('/api/docs')).body.flow.length===6);
const html=await (await worker.fetch(new Request('https://game.example/'),env)).text();const script=html.match(/<script>([\s\S]*)<\/script>/)[1];new Function(script);check(html.includes('prefers-reduced-motion'));check(html.includes('aria-label'));
console.log(JSON.stringify({checks,simulatedGames:90,apiMatchMoves:24,concurrentWrite:'one200_one409',browserVisualQA:false}));
