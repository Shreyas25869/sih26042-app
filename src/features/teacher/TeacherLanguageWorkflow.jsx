import { useState } from "react";
import { Languages, Mic, Volume2 } from "lucide-react";
import { translateText, saveOfflineTranslation } from "../../services/translator";
import { speakText } from "../../services/speech";

const languages = [["en","English"],["hi","Hindi"],["san","Santhali"],["bn","Bengali"],["ta","Tamil"],["te","Telugu"],["mr","Marathi"]];
const locale = { en:"en-IN", hi:"hi-IN", san:"hi-IN", bn:"bn-IN", ta:"ta-IN", te:"te-IN", mr:"mr-IN" };

export default function TeacherLanguageWorkflow() {
  const [source, setSource] = useState("en");
  const [target, setTarget] = useState("san");
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const run = async () => { if (!text.trim()) return; setLoading(true); try { const result = await translateText({ text, sourceLanguage: source, targetLanguage: target }); setOutput(result); saveOfflineTranslation({ text, translation: result, sourceLanguage: source, targetLanguage: target }); } finally { setLoading(false); } };
  return <section className="card teacher-language-workflow"><div className="card-head"><div><span className="eyebrow">Language preparation</span><h2>Translate teacher content</h2><p>Create a local-language version and preview its audio.</p></div><Languages size={21}/></div><div className="language-flow"><label className="field"><span className="field-label">From</span><select value={source} onChange={e=>setSource(e.target.value)}>{languages.map(([id,name])=><option value={id} key={id}>{name}</option>)}</select></label><label className="field"><span className="field-label">To</span><select value={target} onChange={e=>setTarget(e.target.value)}>{languages.map(([id,name])=><option value={id} key={id}>{name}</option>)}</select></label></div><label className="field"><span className="field-label">Lesson text</span><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste or type the lesson text you want to localise…"/></label><button className="btn btn-primary" onClick={run} disabled={loading || !text.trim()}>{loading ? "Translating…" : "Translate & save offline"}</button>{output && <div className="teacher-language-output"><div><span className="badge badge-success">Local-language version</span><p>{output}</p></div><button className="btn btn-secondary" onClick={()=>speakText(output, locale[target])}><Volume2 size={17}/> Preview audio</button><span className="audio-ready"><Mic size={14}/> Audio layer ready</span></div>}</section>;
}
