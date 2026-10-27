"use client";
import { useEffect, useMemo, useState } from "react";

type Track = { title: string; artist: string; album: string; art: string; seconds: number };
const tracks: Track[] = [
  {title:"Midnight City",artist:"M83",album:"Hurry Up, We're Dreaming",art:"photo-1519608487953-e999c86e7455",seconds:244},
  {title:"The Less I Know The Better",artist:"Tame Impala",album:"Currents",art:"photo-1519681393784-d120267933ba",seconds:216},
  {title:"Sunset Lover",artist:"Petit Biscuit",album:"Presence",art:"photo-1500530855697-b586d89ba3ee",seconds:214},
  {title:"Space Song",artist:"Beach House",album:"Depression Cherry",art:"photo-1470252649378-9c29740c9fa8",seconds:320},
  {title:"Tadow",artist:"Masego, FKJ",album:"Lady Lady",art:"photo-1518837695005-2083093ee35b",seconds:325},
  {title:"Electric Feel",artist:"MGMT",album:"Oracular Spectacular",art:"photo-1470225620780-dba8ba36b745",seconds:229},
  {title:"Borderline",artist:"Tame Impala",album:"The Slow Rush",art:"photo-1490730141103-6cac27aaab94",seconds:237},
  {title:"Pink + White",artist:"Frank Ocean",album:"Blonde",art:"photo-1497250681960-ef046c08a56e",seconds:184}
];
const art = (id:string,w=600) => "https://images.unsplash.com/"+id+"?auto=format&fit=crop&w="+w+"&q=85";
const glyph:Record<string,string> = {home:"⌂",search:"⌕",library:"▤",heart:"♡",plus:"+",play:"▶",pause:"Ⅱ",back:"◀",next:"▶",shuffle:"⤨",repeat:"⟳",clock:"◷",more:"•••",volume:"◖",arrow:"↗"};
function I({name}:{name:string}) { return <span aria-hidden="true" className="glyph">{glyph[name]||"•"}</span>; }

export default function Home(){
 const [current,setCurrent]=useState(0),[playing,setPlaying]=useState(false),[progress,setProgress]=useState(37),[query,setQuery]=useState(""),[nav,setNav]=useState("Home"),[liked,setLiked]=useState<number[]>([3,7]),[shuffle,setShuffle]=useState(false),[repeat,setRepeat]=useState(false),[volume,setVolume]=useState(70);
 useEffect(()=>{if(!playing)return;const id=window.setTimeout(()=>{if(progress+1>=tracks[current].seconds){setProgress(0);setCurrent(i=>(i+1)%tracks.length)}else setProgress(progress+1)},1000);return()=>window.clearTimeout(id)},[playing,current,progress]);
 const results=useMemo(()=>tracks.map((t,i)=>({...t,i})).filter(t=>(t.title+" "+t.artist+" "+t.album).toLowerCase().includes(query.toLowerCase())),[query]);
 const play=(i:number)=>{setCurrent(i);setProgress(0);setPlaying(true)};
 const like=(i:number)=>setLiked(a=>a.includes(i)?a.filter(n=>n!==i):[...a,i]);
 const time=(n:number)=>Math.floor(n/60)+":"+String(n%60).padStart(2,"0");
 const t=tracks[current];
 return <main className="app-shell">
  <aside className="sidebar glass">
   <a className="brand" href="#home"><span className="logo-mark"><i/><i/><i/></span>sonora</a>
   <p className="nav-caption">MENU</p>{[{n:"Home",g:"home"},{n:"Search",g:"search"},{n:"Your Library",g:"library"}].map(x=><button key={x.n} className={"nav-link "+(nav===x.n?"active":"")} onClick={()=>{setNav(x.n);if(x.n==="Search")document.getElementById("search")?.focus()}}><I name={x.g}/>{x.n}{nav===x.n&&<i className="nav-light"/>}</button>)}
   <div className="collection-head"><span className="nav-caption">YOUR COLLECTION</span><button className="tiny-button" aria-label="Create playlist"><I name="plus"/></button></div>
   <button className="collection"><span className="cover mini liked"><I name="heart"/></span>Liked Songs<span className="count">24</span></button>
   <button className="collection"><span className="cover mini sunset">✦</span>Late night drive</button>
   <button className="collection"><span className="cover mini blue">◌</span>Soft focus</button>
   <button className="collection"><span className="cover mini orange">♫</span>Sunday mornings</button>
   <div className="sidebar-bottom"><div className="promo"><span>✦</span><strong>Make it yours</strong><p>Your sound, in full color.</p><button>Explore Plus&nbsp; ↗</button></div><div className="profile"><span className="avatar">A</span><span><b>Alex Morgan</b><small>Free account</small></span><I name="more"/></div></div>
  </aside>
  <section className="center" id="home">
   <header className="topbar"><div className="arrows"><button>‹</button><button>›</button></div><label className="search"><I name="search"/><input id="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="What do you want to hear?"/>{query&&<button onClick={()=>setQuery("")}>×</button>}<kbd>⌘ K</kbd></label><button className="plus-pill">Explore Plus ↗</button><button className="avatar small-avatar">A</button></header>
   <div className="scroll-content">
    <div className="greeting"><div><span className="overline"><i/> YOUR PERSONAL SOUNDTRACK</span><h1>{query?"Search results":"Good evening, Alex"} <span>✦</span></h1><p>{query?"A little something for "+query:"A little music makes everything feel better."}</p></div><div className="date"><small>MONDAY</small><b>OCT 27</b><i>◒</i></div></div>
    {!query&&<section className="hero"><div className="hero-bg" style={{backgroundImage:"url("+art("photo-1470225620780-dba8ba36b745",1400)+")"}}/><div className="hero-shade"/><div className="hero-copy"><span className="overline"><i/> MADE FOR YOUR MOMENT</span><h2>Find your<br/><em>after hours.</em></h2><p>Warm lights. Open roads. No rush to get anywhere.</p><button className="hero-button" onClick={()=>play(0)}><I name="play"/> Play your mix <b>→</b></button></div><div className="vinyl"><img src={art("photo-1519608487953-e999c86e7455",480)} alt="After Hours mix artwork"/><i/></div><span className="hero-tag">SONORA SELECTS&nbsp;&nbsp; · &nbsp;&nbsp;01 / 04</span></section>}
    {!query&&<section className="quick-row">{tracks.slice(0,4).map((x,i)=><button className="quick" key={x.title} onClick={()=>play(i)}><img src={art(x.art,130)} alt=""/><b>{x.title}</b><span>▶</span></button>)}</section>}
    <section className="section"><div className="section-title"><div><span className="overline muted">PICKED FOR YOU</span><h2>{query?"Matches for “"+query+"”":"Your daily rotation"}</h2></div><button className="see-all">See all&nbsp; →</button></div>
     {results.length?<div className="album-grid">{results.slice(0,4).map(x=><article className="album" key={x.title}><div className="album-image"><img src={art(x.art)} alt={x.album+" cover"}/><button className="album-play" onClick={()=>play(x.i)} aria-label={"Play "+x.title}>▶</button><button className={"album-like "+(liked.includes(x.i)?"liked-text":"")} onClick={()=>like(x.i)} aria-label="Toggle liked">{liked.includes(x.i)?"♥":"♡"}</button></div><b>{x.title}</b><small>{x.artist} · {x.album}</small></article>)}</div>:<div className="empty"><b>No tracks found</b><span>Try another title or artist.</span></div>}
    </section>
    {!query&&<section className="section recent"><div className="section-title"><div><span className="overline muted">BACK IN YOUR ORBIT</span><h2>Recently played</h2></div><button className="see-all">History&nbsp; →</button></div><div className="table-head"><span>#</span><span>TITLE</span><span>ALBUM</span><span>◷</span><span/></div>{tracks.slice(0,5).map((x,i)=><div className={"track-row "+(current===i?"current":"")} key={x.title}><span className="index">{current===i&&playing?"♫":"0"+(i+1)}</span><button className="track-info" onClick={()=>play(i)}><img src={art(x.art,100)} alt=""/><span><b>{x.title}</b><small>{x.artist}</small></span></button><span className="track-album">{x.album}</span><span className="duration">{time(x.seconds)}</span><button className={"track-like "+(liked.includes(i)?"liked-text":"")} onClick={()=>like(i)} aria-label="Toggle liked">{liked.includes(i)?"♥":"♡"}</button></div>)}</section>}
    <footer className="footer-note"><span>Made for the in-between moments</span><span>SONORA · YOUR SOUND, YOUR SPACE</span></footer>
   </div>
  </section>
  <aside className="right-rail"><div className="rail-label"><span className="overline muted">NOW IN YOUR ORBIT</span><button>•••</button></div><div className="now-card glass"><div className="now-image"><img src={art(t.art,800)} alt={t.album+" artwork"}/><span>SONORA<br/>SESSIONS</span><button>•••</button></div><div className="now-title"><div><h2>{t.title}</h2><p>{t.artist}</p></div><button className="liked-text" onClick={()=>like(current)}>{liked.includes(current)?"♥":"♡"}</button></div><div className="listening"><i/><span><small>YOU'RE LISTENING TO</small><b>Soft edges, open skies</b></span><span>✧</span></div><div className="rail-sep"/><div className="up-next"><div className="up-head"><b>UP NEXT</b><button>Open queue ↗</button></div>{[1,2,3].map(step=>{const i=(current+step)%tracks.length;return <button className="queue" key={tracks[i].title} onClick={()=>play(i)}><img src={art(tracks[i].art,100)} alt=""/><span><b>{tracks[i].title}</b><small>{tracks[i].artist}</small></span><small>{time(tracks[i].seconds)}</small></button>})}</div><div className="share-note"><span>◌</span><div><b>Listening alone?</b><small>Some songs are better shared.</small></div><button>↗</button></div></div></aside>
  <footer className="player glass"><div className="player-track"><img src={art(t.art,120)} alt=""/><span><b>{t.title}</b><small>{t.artist}</small></span><button className={liked.includes(current)?"liked-text":""} onClick={()=>like(current)}>{liked.includes(current)?"♥":"♡"}</button></div><div className="player-center"><div className="controls"><button className={shuffle?"on":""} onClick={()=>setShuffle(!shuffle)}>⤨</button><button onClick={()=>play((current+tracks.length-1)%tracks.length)}>◀</button><button className="play-main" onClick={()=>setPlaying(!playing)}>{playing?"Ⅱ":"▶"}</button><button onClick={()=>play((current+1)%tracks.length)}>▶</button><button className={repeat?"on":""} onClick={()=>setRepeat(!repeat)}>⟳</button></div><div className="progress"><span>{time(progress)}</span><input aria-label="Track progress" type="range" min="0" max={t.seconds} value={progress} onChange={e=>setProgress(Number(e.target.value))}/><span>{time(t.seconds)}</span></div></div><div className="player-tools"><button>▤</button><span>◖</span><input aria-label="Volume" type="range" min="0" max="100" value={volume} onChange={e=>setVolume(Number(e.target.value))}/><button>⛶</button></div></footer>
 </main>;
}


