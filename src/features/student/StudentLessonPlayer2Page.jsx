import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bot, CheckCircle2, Clock3, Headphones, Languages, Pause, Play, Volume2, WifiOff } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../app/AppContext";
import { speakText, stopSpeaking } from "../../services/speech";

const lessonSections = (lesson) => [
  { id: "start", label: "Start here", title: "What will you learn?", text: lesson.description || `Today we will learn about ${lesson.title}. Connect the idea to something you see around you.` },
  { id: "learn", label: "Learn", title: "The main idea", text: `Read this idea slowly and think of one example from your own community. ${lesson.title} becomes easier when you connect the concept to everyday life.` },
  { id: "try", label: "Try it", title: "Your turn", text: "Pause and explain the idea in your own words. Then name one thing you can observe, draw or discuss with your teacher." },
];

export default function StudentLessonPlayer2Page() {
  const { state, actions } = useApp();
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = useMemo(() => state.lessons.find((item) => item.id === lessonId) || state.lessons[0], [state.lessons, lessonId]);
  const sections = useMemo(() => lesson ? lessonSections(lesson) : [], [lesson]);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  if (!lesson) return <div className="page"><div className="lesson2-empty"><BookOpenFallback/><h2>No lesson available</h2><p>Create a lesson from the teacher workspace first.</p></div></div>;
  const current = sections[step];
  const done = state.progress.completedLessons.includes(lesson.id);
  const percent = Math.round(((step + 1) / sections.length) * 100);
  const language = state.language === "en" ? "en-IN" : state.language === "san" ? "hi-IN" : `${state.language}-IN`;

  function toggleAudio() { if (playing) { stopSpeaking(); setPlaying(false); return; } const ok = speakText(`${current.title}. ${current.text}`, language); if (ok) setPlaying(true); }
  function complete() { stopSpeaking(); setPlaying(false); actions.completeLesson(lesson.id); }
  function next() { if (step < sections.length - 1) setStep((value) => value + 1); else complete(); }

  return <div className="lesson2 page">
    <div className="lesson2-top"><Link to="/student/lessons" className="back-link"><ArrowLeft size={16}/> All lessons</Link><span className="lesson2-offline"><WifiOff size={14}/> Saved on device</span></div>
    <div className="lesson2-hero"><div><span className="tag">{lesson.level || "Grade 3"}</span><h1>{lesson.title}</h1><p>{lesson.description}</p><div className="lesson2-meta"><span><Clock3 size={15}/> {lesson.minutes || 10} min</span><span><Languages size={15}/> {state.language.toUpperCase()}</span></div></div><div className="lesson2-progress"><strong>{percent}%</strong><span>lesson progress</span><div className="lesson2-progress-track"><i style={{ width: `${percent}%` }}/></div></div></div>
    <div className="lesson2-layout">
      <aside className="card lesson2-outline"><span className="eyebrow">Learning path</span>{sections.map((item, index) => <button key={item.id} className={`lesson2-step ${index === step ? "active" : ""} ${index < step || done ? "complete" : ""}`} onClick={() => setStep(index)}><span>{index < step || done ? <CheckCircle2 size={17}/> : index + 1}</span><div><strong>{item.label}</strong><small>{item.title}</small></div></button>)}<div className="lesson2-ai-note"><Bot size={18}/><div><strong>Need help?</strong><span>Ask the AI Learning Buddy about this lesson.</span><Link to={`/student/tutor?lesson=${encodeURIComponent(lesson.title)}`}>Ask AI <ArrowRight size={14}/></Link></div></div></aside>
      <main className="card lesson2-content"><div className="lesson2-content-head"><div><span className="eyebrow">Step {step + 1} of {sections.length}</span><h2>{current.title}</h2></div><button className={`btn btn-secondary ${playing ? "active" : ""}`} onClick={toggleAudio}>{playing ? <Pause size={17}/> : <Headphones size={17}/>} {playing ? "Stop audio" : "Listen"}</button></div><div className="lesson2-reading"><p>{current.text}</p><div className="lesson2-callout"><Volume2 size={18}/><div><strong>Learn by listening</strong><span>Use audio when reading is difficult or when you want to revise aloud.</span></div></div></div><div className="lesson2-actions">{step > 0 ? <button className="btn btn-secondary" onClick={() => setStep((value) => value - 1)}><ArrowLeft size={17}/> Previous</button> : <span/>}{step === sections.length - 1 ? <button className="btn btn-primary" onClick={complete}><CheckCircle2 size={17}/> {done ? "Completed" : "Complete lesson"}</button> : <button className="btn btn-primary" onClick={next}>Next <ArrowRight size={17}/></button>}</div></main>
    </div>
    <div className="lesson2-footer"><span>Language and audio can be connected to the final trained models later.</span>{done && <span className="badge badge-success">Completed</span>}</div>
  </div>;
}
function BookOpenFallback(){ return <div className="lesson2-fallback-icon"><Play size={18}/></div>; }
