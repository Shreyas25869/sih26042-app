import { useMemo, useRef, useState } from "react";
import { Archive, Check, CloudOff, Download, FileText, Headphones, Languages, RefreshCw, Upload, Wifi, WifiOff } from "lucide-react";
import { useApp } from "../../app/AppContext";
import { loadOfflineState, markOfflineSync, toggleOfflineItem } from "./offlineStore";
import { cacheAppShell, cacheLearningItem, removeLearningItem } from "./offlineCache";
import { exportOfflinePackage, importOfflinePackage } from "./offlineSync";
import { loadClassroom, saveClassroom } from "../teacher/classroomStore";

export default function OfflineCenterPage(){
 const {state,online}=useApp();
 const [offline,setOffline]=useState(loadOfflineState);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const fileRef=useRef(null);
 const items=useMemo(()=>[
  ...state.lessons.map(x=>({id:`lesson:${x.id}`,type:"lesson",title:x.title,meta:`${x.level} · ${x.minutes} min`,icon:FileText,data:x})),
  ...state.quizzes.map(x=>({id:`quiz:${x.id}`,type:"quiz",title:x.title,meta:`${x.level} · ${x.questions} questions`,icon:Archive,data:x})),
  {id:"translations",type:"language",title:"Saved translations",meta:"Offline language packs and translated content",icon:Languages},
  {id:"audio",type:"audio",title:"Audio resources",meta:"Speech-ready learning content",icon:Headphones}
 ],[state.lessons,state.quizzes]);
 const enabled=items.filter(x=>offline.downloads[x.id]);
 const contentCount=items.filter(x=>x.type==="lesson"||x.type==="quiz").length;
 const toggle=async item=>{const ready=!!offline.downloads[item.id];setBusy(true);setMessage("");try{if(!ready&&item.data)await cacheLearningItem(item.data);if(ready&&item.data)await removeLearningItem(item.data.id);setOffline(toggleOfflineItem(item.id,!ready));setMessage(ready?`${item.title} removed from offline library.`:`${item.title} is ready for offline use.`);}catch{setMessage("Could not update the offline library.");}finally{setBusy(false);}};
 const sync=async()=>{setBusy(true);setMessage("");try{const shellReady=await cacheAppShell();const next=markOfflineSync();setOffline(next);setMessage(shellReady?"App shell prepared. Selected content remains available offline.":"Offline preparation was saved; refresh once while online to cache the app shell.");}finally{setBusy(false);}};
 const downloadPackage=()=>{const payload=exportOfflinePackage(state,loadClassroom(),offline);const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`sih26042-offline-package-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);setMessage("Offline package exported. Move this file to another trusted device to continue the local classroom setup.");};
 const chooseImport=()=>fileRef.current?.click();
 const importPackage=async(event)=>{const file=event.target.files?.[0];event.target.value="";if(!file)return;setBusy(true);setMessage("");try{const text=await file.text();const payload=JSON.parse(text);importOfflinePackage(payload);saveClassroom(payload.classroom);setMessage("Offline package imported. Reloading the workspace…");setTimeout(()=>window.location.reload(),500);}catch{setMessage("Import failed. Choose a valid SIH 26042 offline package.");}finally{setBusy(false);}};
 const formatDate=value=>value?new Date(value).toLocaleString([], {dateStyle:"medium",timeStyle:"short"}):"Not checked yet";
 return <div className="page offline-center">
  <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importPackage}/>
  <div className="page-header"><div><div className="eyebrow">Device & connectivity</div><h1>Offline Center</h1><p className="muted">Choose what this device keeps ready when the internet disappears.</p></div><div className={`offline-status ${online?"online":"offline"}`}>{online?<Wifi size={16}/>:<WifiOff size={16}/>} {online?"Connected":"Offline"}</div></div>
  <section className="offline-hero card"><div className="offline-hero-icon"><CloudOff/></div><div><span className="eyebrow">Always available</span><h2>Your classroom should not stop at the network.</h2><p>Prepare the app shell and selected lesson or quiz snapshots before going offline. Local progress remains on this device.</p></div><button className="btn btn-primary" onClick={sync} disabled={busy}>{busy?<RefreshCw className="spin" size={16}/>:<RefreshCw size={16}/>} {busy?"Preparing…":"Prepare offline"}</button></section>
  {message&&<div className="offline-message" role="status"><Check size={16}/>{message}</div>}
  <div className="offline-stats"><div className="card offline-stat"><Download size={18}/><strong>{enabled.length}</strong><span>Items marked ready</span></div><div className="card offline-stat"><FileText size={18}/><strong>{contentCount}</strong><span>Learning items available</span></div><div className="card offline-stat"><Languages size={18}/><strong>7</strong><span>Supported languages</span></div><div className="card offline-stat"><RefreshCw size={18}/><strong>{offline.lastSync?"Ready":"—"}</strong><span>Last local check: {formatDate(offline.lastSync)}</span></div></div>
  <section className="card"><div className="card-head"><div><h2>Offline library</h2><p>Prepare resources that should remain available for learners.</p></div><span className="offline-ready-pill"><Check size={14}/>{enabled.length} ready</span></div><div className="offline-list">{items.map(item=>{const Icon=item.icon;const ready=!!offline.downloads[item.id];return <div className={`offline-item ${ready?"ready":""}`} key={item.id}><div className="offline-item-icon"><Icon size={18}/></div><div className="offline-item-copy"><strong>{item.title}</strong><span>{item.meta}</span></div><button className={`offline-toggle ${ready?"active":""}`} disabled={busy} onClick={()=>toggle(item)} aria-pressed={ready}>{ready?<><Check size={15}/> Ready offline</>:<><Download size={15}/> Make available</>}</button></div>})}</div></section>
  <section className="card offline-transfer"><div><span className="eyebrow">Device transfer</span><h2>Move a classroom package without a server</h2><p>Export local classes, assignments, learning data and offline settings to a JSON package. Import it on another trusted device when you need a simple offline hand-off.</p></div><div className="offline-transfer-actions"><button className="btn btn-secondary" onClick={downloadPackage}><Download size={16}/> Export package</button><button className="btn btn-primary" onClick={chooseImport}><Upload size={16}/> Import package</button></div></section>
  <section className="offline-explainer"><div><strong>Offline engine</strong><p>The production build uses a service worker for the app shell and runtime assets. Selected lessons and quizzes are cached as local content snapshots. The portable package provides a manual sync path until a future network sync service is introduced.</p></div><div className="offline-flow"><span>Prepare</span><b>→</b><span>Learn offline</span><b>→</b><span>Transfer / sync later</span></div></section>
 </div>
}
