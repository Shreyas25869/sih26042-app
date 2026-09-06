import { useEffect, useRef, useState } from "react";
import { Bot, BookOpen, ChevronRight, Lightbulb, Loader2, Mic, Send, Sparkles, Volume2, VolumeX, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../../../app/AppContext";
import { addTutorMessage, loadTutorHistory } from "./tutorStore";
import { askTutor } from "./tutorService";
import { createSpeechRecognition, isSpeechRecognitionSupported, speakText, stopSpeaking } from "../../../services/speech";

const localeMap = { en: "en-IN", hi: "hi-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN", mr: "mr-IN", san: "hi-IN" };
const prompts = ["Explain my current lesson", "Give me a simple example", "Ask me a practice question", "Help me remember this topic"];

export default function AITutorPage() {
  const { state } = useApp();
  const [messages, setMessages] = useState(loadTutorHistory);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const language = state.language || "en";

  useEffect(() => () => { recognitionRef.current?.stop(); stopSpeaking(); }, []);
  const ask = async (preset) => {
    const text = String(preset ?? question).trim();
    if (!text || busy) return;
    setQuestion(""); setBusy(true);
    const userMessage = { role: "user", text };
    const withUser = addTutorMessage(userMessage); setMessages(withUser);
    try {
      const result = await askTutor({ question: text, language, lessonTitle: state.lessons[0]?.title });
      const withAnswer = addTutorMessage({ role: "assistant", text: result?.answer || "I could not answer that yet.", source: result?.source });
      setMessages(withAnswer);
    } catch {
      const withAnswer = addTutorMessage({ role: "assistant", text: "The AI service is unavailable right now. Your question is saved on this device. You can try again when the service is available.", source: "offline" });
      setMessages(withAnswer);
    } finally { setBusy(false); }
  };
  const startVoice = () => {
    if (!isSpeechRecognitionSupported()) return;
    if (listening) { recognitionRef.current?.stop(); return; }
    const recognition = createSpeechRecognition({ language: localeMap[language] || "en-IN", onResult: (text, final) => { setQuestion(text); if (final) setListening(false); }, onError: () => setListening(false), onEnd: () => setListening(false) });
    recognitionRef.current = recognition; if (recognition) { setListening(true); recognition.start(); }
  };
  const read = text => { if (speaking) { stopSpeaking(); setSpeaking(false); return; } if (speakText(text, localeMap[language] || "en-IN")) setSpeaking(true); setTimeout(() => setSpeaking(false), Math.max(1800, String(text).length * 55)); };
  return <div className="page tutor-page">
    <div className="page-header tutor-header"><div><div className="eyebrow">Student AI support</div><h1>AI Learning Buddy</h1><p className="muted">Ask questions, practise concepts and learn in your chosen language.</p></div><div className="tutor-status"><WifiOff size={15}/> Offline-first</div></div>
    <div className="tutor-layout">
      <section className="tutor-main card">
        <div className="tutor-banner"><div className="tutor-bot"><Bot size={24}/></div><div><strong>Your learning buddy</strong><span>Simple explanations • voice ready • device friendly</span></div><span className="language-chip">{language.toUpperCase()}</span></div>
        <div className="tutor-messages">
          {!messages.length && <div className="tutor-welcome"><div className="welcome-icon"><Sparkles/></div><h2>What would you like to learn?</h2><p>Ask in your own words. You can type or use your microphone.</p><div className="prompt-grid">{prompts.map(p => <button key={p} onClick={() => ask(p)}><Lightbulb size={16}/>{p}<ChevronRight size={15}/></button>)}</div></div>}
          {messages.map(m => <div className={`tutor-message ${m.role}`} key={m.id}><div className="message-avatar">{m.role === "assistant" ? <Bot size={16}/> : "You"}</div><div className="message-bubble"><p>{m.text}</p>{m.role === "assistant" && <button className="speak-btn" onClick={() => read(m.text)}>{speaking ? <VolumeX size={15}/> : <Volume2 size={15}/>} {speaking ? "Stop" : "Listen"}</button>}</div></div>)}
          {busy && <div className="tutor-message assistant"><div className="message-avatar"><Bot size={16}/></div><div className="message-bubble thinking"><Loader2 size={16} className="spin"/> Thinking…</div></div>}
        </div>
        <form className="tutor-composer" onSubmit={e => { e.preventDefault(); ask(); }}><textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask your learning buddy…" rows="2"/><div className="composer-actions"><span>{isSpeechRecognitionSupported() ? "Voice input available" : "Type your question"}</span><button type="button" className={`icon-btn ${listening ? "recording" : ""}`} onClick={startVoice} title="Voice input"><Mic size={19}/></button><button className="btn btn-student" disabled={!question.trim() || busy}>Ask <Send size={16}/></button></div></form>
      </section>
      <aside className="tutor-side">
        <section className="card"><div className="card-head"><div><h2>Learn from your lesson</h2><p>Keep the tutor connected to what you're studying.</p></div><BookOpen size={19}/></div>{state.lessons.slice(0,3).map(l => <Link className="tutor-lesson" to="/student/lessons" key={l.id}><span>{l.level}</span><strong>{l.title}</strong><ChevronRight size={16}/></Link>)}</section>
        <section className="card tutor-safety"><strong>Helpful, not a replacement for your teacher</strong><p>Use the buddy to practise, ask for examples and understand difficult ideas.</p></section>
      </aside>
    </div>
  </div>;
}
