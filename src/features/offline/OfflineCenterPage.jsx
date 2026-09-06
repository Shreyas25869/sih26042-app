import { useMemo, useState } from "react";
import { Archive, Check, CloudOff, Download, FileText, Headphones, Languages, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useApp } from "../../app/AppContext";
import { loadOfflineState, markOfflineSync, toggleOfflineItem } from "./offlineStore";
import { cacheAppShell, cacheLearningItem, removeLearningItem } from "./offlineCache";

export default function OfflineCenterPage(){
 const {state,online}=useApp();
 const [offline,setOffline]=useState(loadOfflineState);
 const [busy,setBusy]=useState(false);
 const items=useMemo(()=>[
  ...state.lessons.map(x=>({id:`lesson:${x.id}`,type:"lesson",title:x.title,meta:`${x.level} · ${x.minutes} min`,icon:FileText,data:x})),
  ...state.quizzes.map(x=>({id:`quiz:${x.id}`,type:"quiz",title:x.title,meta:`${x.level} · ${x.questions} questions`,icon:Archive,data:x})),
  {id:"translations",type:"language",title:"Saved translations",meta:"Offline language packs and translated content",icon:Languages},
  {id:"audio",type:"audio",title:"Audio resources",meta:"Speech-ready learning content",icon:Headphones}
 ],[state.lessons,state.quizzes]);
 const enabled=items.filter(x=>offline.downloads[x.id]);
 const contentCount=items.filter(x=>x.type==="lesson"||x.type==="quiz").length;
 const toggle=async item=>{
   const ready=!!offline.downloads[item.id];
   setBusy(true);
   try {
     if(!ready && item.data) await cacheLearningItem(item.data);
     if(ready && item.data) await removeLearningItem(item.data.id);
     const next=toggleOfflineItem(item.id,!ready);
     setOffline(next);
   } finally { setBusy(false); }
 };
 const sync=async()=>{setBusy(true);await cacheAppShell();const next=markOfflineSync();setOffline(next);setBusy(false)};
 const formatDate=value=>value?new Date(value).toLocaleString([], {dateStyle:"medium",timeStyle:"short"}):"Not checked yet";
 return <div className="page offline-center">
  <div className="page-header"><div><div className="eyebrow">Device & connectivity</div><h1>Offline Center</h1><p className="muted">Choose what this device keeps ready when the internet disappears.</p></div><div className={`offline-status ${online?"online":"offline"}`}>{online?<Wifi size={16}/>:<WifiOff size={16}/>} {online?"Connected":"Offline"}</div></div>
  <section className="offline-hero card"><div className="offline-hero-icon"><CloudOff/></div><div><span className="eyebrow">Always available</span><h2>Your classroom should not stop at the network.</h2><p>Prepare learning on this device before going offline. The app shell and selected lesson or quiz data are cached locally.</p></div><button className="btn btn-primary" onClick={sync} disabled={busy}>{busy?<RefreshCw className="spin" size={16}/>:<RefreshCw size={16}/>} {busy?"Preparing…":"Prepare offline"}</button></section>
  <div className="offline-stats"><div className="card offline-stat"><Download size={18}/><strong>{enabled.length}</strong><span>Items marked ready</span></div><div className="card offline-stat"><FileText size={18}/><strong>{contentCount}</strong><span>Learning items available</span></div><div className="card offline-stat"><Languages size={18}/><strong>7</strong><span>Supported languages</span></div><div className="card offline-stat"><RefreshCw size={18}/><strong>{offline.lastSync?"Ready":"—"}</strong><span>Last local check: {formatDate(offline.lastSync)}</span></div></div>
  <section className="card"><div className="card-head"><div><h2>Offline library</h2><p>Prepare resources that should remain available for learners.</p></div><span className="offline-ready-pill"><Check size={14}/>{enabled.length} ready</span></div><div className="offline-list">{items.map(item=>{const Icon=item.icon;const ready=!!offline.downloads[item.id];return <div className={`offline-item ${ready?"ready":""}`} key={item.id}><div className="offline-item-icon"><Icon size={18}/></div><div className="offline-item-copy"><strong>{item.title}</strong><span>{item.meta}</span></div><button className={`offline-toggle ${ready?"active":""}`} disabled={busy} onClick={()=>toggle(item)} aria-pressed={ready}>{ready?<><Check size={15}/> Ready offline</>:<><Download size={15}/> Make available</>}</button></div>})}</div></section>
  <section className="offline-explainer"><div><strong>Offline engine</strong><p>The production build uses a service worker for the app shell and runtime assets. Selected lessons and quizzes are additionally cached as local content snapshots. Future trained AI, translation and audio assets can plug into the same cache layer.</p></div><div className="offline-flow"><span>Prepare</span><b>→</b><span>Learn offline</span><b>→</b><span>Sync later</span></div></section>
 </div>
}
