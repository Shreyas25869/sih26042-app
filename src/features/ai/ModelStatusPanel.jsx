import { useState } from "react";
import { BrainCircuit, CheckCircle2, Mic, Save, Settings2, Volume2, Languages } from "lucide-react";
import { getModelConfig, getModelStatus, saveModelConfig } from "../../services/modelAdapter";

export default function ModelStatusPanel() {
  const [config, setConfig] = useState(getModelConfig);
  const [saved, setSaved] = useState(false);
  const status = getModelStatus();
  const update = (key, value) => setConfig((old) => ({ ...old, [key]: value }));
  const save = () => { saveModelConfig(config); setSaved(true); window.setTimeout(() => setSaved(false), 1800); };
  const items = [["aiTutorUrl", "AI Tutor", BrainCircuit, status.aiTutor], ["translatorUrl", "Translator", Languages, status.translator], ["speechRecognitionUrl", "Speech input", Mic, status.speechRecognition], ["speechSynthesisUrl", "Speech output", Volume2, status.speechSynthesis]];
  return <section className="card model-panel"><div className="model-panel-head"><div><span className="eyebrow">Phase 3 integration</span><h2>AI & language models</h2><p>Connect your teammate's trained local or LAN models without changing the learning UI.</p></div><Settings2 size={20}/></div><div className="model-status-grid">{items.map(([key,label,Icon,connected]) => <div className="model-status" key={key}><div className="model-status-icon"><Icon size={18}/></div><div><strong>{label}</strong><span>{connected ? "Connected" : "Using browser/offline fallback"}</span></div>{connected && <CheckCircle2 size={17}/>}</div>)}</div><div className="model-config"><label>AI Tutor endpoint<input value={config.aiTutorUrl} onChange={(e) => update("aiTutorUrl", e.target.value)} placeholder="http://127.0.0.1:8000/tutor" /></label><label>Translator endpoint<input value={config.translatorUrl} onChange={(e) => update("translatorUrl", e.target.value)} placeholder="http://127.0.0.1:8000/translate" /></label><label>Speech input endpoint<input value={config.speechRecognitionUrl} onChange={(e) => update("speechRecognitionUrl", e.target.value)} placeholder="http://127.0.0.1:8000/stt" /></label><label>Speech output endpoint<input value={config.speechSynthesisUrl} onChange={(e) => update("speechSynthesisUrl", e.target.value)} placeholder="http://127.0.0.1:8000/tts" /></label></div><div className="model-panel-footer"><span>{saved ? "Model configuration saved locally." : "Leave endpoints empty to keep browser fallbacks."}</span><button className="btn btn-primary" onClick={save}><Save size={16}/>{saved ? "Saved" : "Save configuration"}</button></div></section>;
}
