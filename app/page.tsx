"use client";
import { useEffect, useRef, useState } from "react";

type Track = { id:string; name:string; artist_name:string; album_name:string; image:string; audio:string; shareurl:string; duration:number; license_ccurl?:string };
const moods = ["All sounds","Ambient","Electronic","Jazz","Rock","Classical","Instrumental"];
const fmt = (n:number) => Math.floor(n/60)+":"+String(n%60).padStart(2,"0");

export default function Home() {
  const [tracks,setTracks]=useState<Track[]>([]);
  const [query,setQuery]=useState("");
  const [mood,setMood]=useState("All sounds");
  const [offset,setOffset]=useState(0);
  const [loading,setLoading]=useState(true);
  const [configured,setConfigured]=useState(true);
  const [error,setError]=useState("");
  const [current,setCurrent]=useState<Track|null>(null);
  const [playing,setPlaying]=useState(false);
  const [progress,setProgress]=useState(0);
  const audio=useRef<HTMLAudioElement>(null);

  useEffect(()=>{
    let cancelled=false;
    const timer=window.setTimeout(async()=>{
      setLoading(true); setError("");
      try {
        const params=new URLSearchParams({q:query,genre:mood==="All sounds"?"":mood,offset:String(offset)});
        const response=await fetch("/api/tracks?"+params.toString(),{cache:"no-store"});
        const data=await response.json();
        if(!response.ok) throw new Error(data.error||"The music catalog is unavailable.");
        if(cancelled)return;
        setConfigured(data.configured!==false);
        if(offset===0)setTracks(data.tracks||[]);
        else setTracks(existing=>existing.concat(data.tracks||[]));
      } catch(e) { if(!cancelled)setError(e instanceof Error?e.message:"Could not load music."); }
      finally { if(!cancelled)setLoading(false); }
    },250);
    return()=>{cancelled=true;window.clearTimeout(timer)};
  },[query,mood,offset]);

  useEffect(()=>{const player=audio.current;if(!player||!current)return;player.src=current.audio;player.load();},[current]);
  useEffect(()=>{const player=audio.current;if(!player||!current)return;if(playing)void player.play().catch(()=>setPlaying(false));else player.pause();},[playing,current]);
  const play=(track:Track)=>{if(current?.id===track.id){setPlaying(value=>!value);return}setCurrent(track);setProgress(0);setPlaying(true)};
  const next=()=>{if(!tracks.length)return;const i=tracks.findIndex(x=>x.id===current?.id);const track=tracks[(i+1+tracks.length)%tracks.length];setCurrent(track);setProgress(0);setPlaying(true)};
  const selectMood=(value:string)=>{setMood(value);setOffset(0)};
  const search=(value:string)=>{setQuery(value);setOffset(0)};

  return <main className="sonora">
    <header className="masthead"><a href="/" className="wordmark"><span className="mark">s<span>✳</span></span>sonora</a><nav><a className="nav-current" href="#discover">Discover</a><a href="#catalog">The catalog</a><a href="#about">About this project</a></nav><label className="search-field"><span>⌕</span><input value={query} onChange={e=>search(e.target.value)} placeholder="Find an artist, mood, or track"/><kbd>⌘ K</kbd></label><button className="profile-button" aria-label="Your profile">A</button></header>
    <section className="intro" id="discover"><div className="intro-copy"><span className="kicker"><i/> A LISTENING ROOM FOR WHAT'S NEXT</span><h1>Good music.<br/><em>More room to find it.</em></h1><p>Explore independent sounds from artists around the world. Every track leads back to the person who made it.</p><a className="intro-link" href="#catalog">Explore the catalog <span>↓</span></a></div><div className="sound-art" aria-hidden="true"><div className="halo halo-one"/><div className="halo halo-two"/><div className="sound-core"><span>SONORA</span><b>◖</b><small>FIELD NOTES<br/>VOL. 01</small></div><i className="spark spark-a">✳</i><i className="spark spark-b">✳</i><span className="orbit-word">SOUND HAS NO EDGES</span></div><span className="intro-index">INDEPENDENT MUSIC · OPEN DISCOVERY</span></section>
    <section className="mood-section"><div className="section-heading"><div><span className="kicker muted">START WITH A FEELING</span><h2>What sounds like you?</h2></div><span className="heading-note">A little direction, a lot of discovery.</span></div><div className="mood-list">{moods.map((item,i)=><button key={item} className={"mood-chip "+(mood===item?"chosen":"")} onClick={()=>selectMood(item)}><span>{["✳","◒","∿","♬","◈","⌁","◌"][i]}</span>{item}</button>)}</div></section>
    <section className="catalog-section" id="catalog"><div className="section-heading catalog-heading"><div><span className="kicker muted">A WORLD OF INDEPENDENT SOUND</span><h2>{query?"Results for “"+query+"”":mood==="All sounds"?"Freshly found":"The "+mood.toLowerCase()+" shelf"}</h2></div><span className="results-note">{loading?"TUNING IN":tracks.length+" TRACKS ON THIS PAGE"}</span></div>
      {!configured?<div className="setup-panel"><div className="setup-icon">✳</div><div><span className="kicker muted">ONE SMALL SETUP STEP</span><h3>Connect your music catalog</h3><p>This site is wired for a licensed catalog. Add the provider’s server-side API credentials after registering the public app.</p><code>JAMENDO_CLIENT_ID=your_client_id</code><a href="https://developer.jamendo.com/" target="_blank" rel="noreferrer">Open developer portal ↗</a></div></div>:
      error?<div className="empty-panel"><span>!</span><b>We couldn't reach the catalog.</b><p>{error}</p></div>:
      tracks.length===0&&!loading?<div className="empty-panel"><span>◌</span><b>No tracks in this corner yet.</b><p>Try another mood or a different search.</p></div>:
      <div className="track-grid">{tracks.map((item,i)=><article className="track-card" key={item.id}><div className="artwork"><img src={item.image} alt={item.album_name||item.name+" artwork"} loading="lazy"/><span className="art-count">{String(i+1+offset).padStart(2,"0")}</span><button aria-label={playing&&current?.id===item.id?"Pause "+item.name:"Play "+item.name} onClick={()=>play(item)}>{playing&&current?.id===item.id?"Ⅱ":"▶"}</button></div><div className="track-meta"><div><h3>{item.name}</h3><p>{item.artist_name}</p><small>{item.album_name||"Single"} · {fmt(item.duration)}</small></div><a href={item.shareurl} target="_blank" rel="noreferrer" aria-label={"Open "+item.name+" on provider"}>↗</a></div><div className="license-line"><span>INDEPENDENT RELEASE</span><a href={item.license_ccurl||item.shareurl} target="_blank" rel="noreferrer">SOURCE & LICENSE ↗</a></div></article>)}</div>}
      {configured&&tracks.length>0&&<button className="more-button" onClick={()=>setOffset(value=>value+tracks.length)} disabled={loading}>{loading?"Loading…":"Find more music ↓"}</button>}
    </section>
    <footer className="site-footer" id="about"><a href="/" className="wordmark"><span className="mark">s<span>✳</span></span>sonora</a><p>Built around independent artists, clear credits, and a little curiosity.</p><span>MUSIC BY ITS MAKERS · CATALOG VIA JAMENDO · <a href="/privacy">PRIVACY</a></span></footer>
    <audio ref={audio} onTimeUpdate={e=>setProgress(e.currentTarget.currentTime)} onEnded={next} onError={()=>{if(playing)setError("This stream is unavailable right now.");setPlaying(false)}}/>
    <footer className="listening-bar"><div className="active-track">{current?<><img src={current.image} alt=""/><span><b>{current.name}</b><small>{current.artist_name}</small></span><a href={current.shareurl} target="_blank" rel="noreferrer">↗</a></>:<><div className="empty-art">✳</div><span><b>Choose a sound to begin</b><small>Independent music, discovered here</small></span></>}</div><div className="listen-controls"><button onClick={()=>setPlaying(value=>!value)} disabled={!current} aria-label={playing?"Pause":"Play"}>{playing?"Ⅱ":"▶"}</button><div className="seek"><span>{fmt(progress)}</span><input aria-label="Seek track" type="range" min="0" max={current?.duration||1} value={progress} style={{background:"linear-gradient(to right, #7774c7 "+((progress/(current?.duration||1))*100)+"%, #252a3727 "+((progress/(current?.duration||1))*100)+"%)"}} onChange={e=>{const value=Number(e.target.value);setProgress(value);if(audio.current)audio.current.currentTime=value}}/><span>{current?fmt(current.duration):"0:00"}</span></div></div><div className="bar-note"><span className="sound-wave">∿</span><span>PLAYING FROM<br/><b>JAMENDO OPEN CATALOG</b></span></div></footer>
  </main>;
}





