import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, Download, ExternalLink, ShieldCheck } from "lucide-react";
import { downloadDiagnostics } from "../../services/appDiagnostics";

const ITEMS = [
  ["teacher", "Teacher workflow", "Create a lesson, quiz and flashcard in Content Studio."],
  ["offline", "Offline preparation", "Prepare the learning package before leaving connectivity."],
  ["student", "Student workflow", "Open a lesson, use revision and complete a quiz."],
  ["language", "Language support", "Demonstrate translation and available audio fallback."],
  ["progress", "Progress evidence", "Show completion and quiz results in Progress."],
  ["diagnostics", "Field diagnostics", "Export a device report from Settings."],
];

export default function ShowcaseChecklistPage() {
  const [done, setDone] = useState(() => { try { return JSON.parse(localStorage.getItem("sih26042:showcase-checklist") || "[]"); } catch { return []; } });
  const toggle = id => setDone(current => { const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id]; localStorage.setItem("sih26042:showcase-checklist", JSON.stringify(next)); return next; });
  const percent = Math.round((done.length / ITEMS.length) * 100);
  const remaining = useMemo(() => ITEMS.length - done.length, [done]);
  return <div className="page showcase-page">
    <div className="page-header"><div><div className="eyebrow">Phase 9 · Showcase</div><h1>SIH readiness checklist</h1><p className="muted">A focused final-run checklist for the judging/demo device. Nothing here requires a server.</p></div><button className="btn btn-secondary" onClick={downloadDiagnostics}><Download size={16}/> Export diagnostics</button></div>
    <section className="card showcase-summary"><div className="showcase-score"><div className="showcase-ring"><strong>{percent}%</strong><span>ready</span></div><div><span className="eyebrow">Demo readiness</span><h2>{remaining === 0 ? "Ready for the walkthrough" : `${remaining} checks remaining`}</h2><p>Complete each real workflow on the device you will present with.</p></div></div><div className="showcase-bar"><i style={{ width: `${percent}%` }}/></div></section>
    <section className="showcase-list">{ITEMS.map(([id,title,description], index) => <button className={`card showcase-item ${done.includes(id) ? "done" : ""}`} key={id} onClick={() => toggle(id)}><span className="showcase-number">{done.includes(id) ? <CheckCircle2 size={19}/> : index + 1}</span><span><strong>{title}</strong><small>{description}</small></span><span className="showcase-state">{done.includes(id) ? "Verified" : "Verify"}</span></button>)}</section>
    <section className="card showcase-note"><ShieldCheck size={20}/><div><strong>Judge-facing principle</strong><span>Demonstrate the offline-first workflow honestly: trained model services are optional adapters, while core learning, content, progress and queued changes remain local.</span></div><a href="/student" onClick={() => {}}><ExternalLink size={16}/> Open student app</a></section>
    <div className="showcase-footer"><ClipboardCheck size={16}/> Checklist is saved locally on this device.</div>
  </div>;
}
