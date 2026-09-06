import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Download, HardDrive, RefreshCw, ShieldCheck, Wifi, WifiOff, XCircle } from "lucide-react";
import { getAppDiagnostics, downloadDiagnostics } from "../../services/appDiagnostics";
import { getPendingChanges } from "../offline/offlineSync";

export default function ProductionReadinessPanel() {
  const [diagnostics, setDiagnostics] = useState(getAppDiagnostics);
  const [queue, setQueue] = useState(getPendingChanges());
  const refresh = () => { setDiagnostics(getAppDiagnostics()); setQueue(getPendingChanges()); };
  useEffect(() => { const timer = setInterval(refresh, 5000); return () => clearInterval(timer); }, []);
  const checks = useMemo(() => [
    ["Offline storage", diagnostics.storage.bytes >= 0, `${diagnostics.storage.kb} KB currently used`],
    ["Cache Storage", diagnostics.cacheStorage, diagnostics.cacheStorage ? "Browser cache available" : "Unavailable in this browser"],
    ["Service worker", diagnostics.serviceWorker, diagnostics.serviceWorker ? "PWA support detected" : "Not supported"],
    ["Speech input", diagnostics.speechRecognition, diagnostics.speechRecognition ? "Browser speech input available" : "Use configured local STT model"],
    ["Speech output", diagnostics.speechSynthesis, diagnostics.speechSynthesis ? "Browser speech output available" : "Use configured local TTS model"],
  ], [diagnostics]);
  return <section className="card production-panel">
    <div className="production-head"><div><span className="eyebrow">Phase 7 · Production readiness</span><h2>Device health & diagnostics</h2><p>Quick checks for offline capability, storage and browser support. No personal data is uploaded.</p></div><button className="btn btn-secondary" onClick={refresh} title="Refresh diagnostics"><RefreshCw size={16}/> Refresh</button></div>
    <div className="production-network"><div className={`production-network-icon ${diagnostics.connection.online ? "online" : "offline"}`}>{diagnostics.connection.online ? <Wifi size={20}/> : <WifiOff size={20}/>}</div><div><strong>{diagnostics.connection.online ? "Connected" : "Offline mode"}</strong><span>{diagnostics.connection.effectiveType !== "unknown" ? `Network: ${diagnostics.connection.effectiveType}` : "The core experience remains available offline."}</span></div><span className="production-queue"><HardDrive size={15}/> {queue.length} pending changes</span></div>
    <div className="production-checks">{checks.map(([label,ok,detail]) => <div className="production-check" key={label}>{ok ? <CheckCircle2 size={18}/> : <XCircle size={18}/>}<div><strong>{label}</strong><span>{detail}</span></div></div>)}</div>
    <div className="production-actions"><div><ShieldCheck size={18}/><span>Local-first diagnostics · generated {new Date(diagnostics.generatedAt).toLocaleTimeString()}</span></div><button className="btn btn-primary" onClick={downloadDiagnostics}><Download size={16}/> Export diagnostics</button></div>
  </section>;
}
