import { useState } from "react";
import { CheckCircle2, Copy, Play, RotateCcw } from "lucide-react";

const DEMO_STEPS = [
  ["teacher", "Teacher creates a lesson", "Create content → save locally → prepare it for offline use."],
  ["offline", "Device goes offline", "The learning package and queued changes remain available on-device."],
  ["student", "Student learns", "Open the lesson, listen, revise and complete the quiz without connectivity."],
  ["progress", "Progress is recorded", "Completion and quiz results stay locally available for the teacher."],
];

export default function DemoModePanel() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const copySummary = async () => {
    const text = DEMO_STEPS.map(([, title, description], i) => `${i + 1}. ${title}: ${description}`).join("\n");
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  };
  return <section className="card demo-panel">
    <div className="demo-panel-head"><div><span className="eyebrow">SIH demo flow</span><h2>End-to-end classroom story</h2><p>Use this guided sequence to demonstrate the core offline-first workflow.</p></div><button className="btn btn-secondary" onClick={copySummary}>{copied ? <CheckCircle2 size={16}/> : <Copy size={16}/>} {copied ? "Copied" : "Copy flow"}</button></div>
    <div className="demo-steps">{DEMO_STEPS.map(([key, title, description], i) => <button key={key} className={`demo-step ${i === active ? "active" : ""} ${i < active ? "done" : ""}`} onClick={() => setActive(i)}><span>{i < active ? <CheckCircle2 size={17}/> : i + 1}</span><div><strong>{title}</strong><small>{description}</small></div></button>)}</div>
    <div className="demo-current"><Play size={18}/><div><strong>Demo step {active + 1}: {DEMO_STEPS[active][1]}</strong><span>{DEMO_STEPS[active][2]}</span></div><button className="btn btn-primary" onClick={() => setActive(value => Math.min(DEMO_STEPS.length - 1, value + 1))}>{active === DEMO_STEPS.length - 1 ? "Complete" : "Next step"}</button><button className="icon-btn" onClick={() => setActive(0)} title="Restart"><RotateCcw size={17}/></button></div>
  </section>;
}
