import { Link } from "react-router-dom";
import { BookOpen, CircleHelp, Languages, Layers3, Mic, Sparkles } from "lucide-react";

export default function TeacherContentTools() {
  const tools = [
    { to: "/teacher/lessons/new", icon: BookOpen, title: "Create lesson", text: "Build a lesson with text, translated content and audio." },
    { to: "/teacher/quizzes/new", icon: CircleHelp, title: "Create quiz", text: "Prepare questions for classroom practice and assessment." },
    { to: "/teacher/flashcards/new", icon: Layers3, title: "Create flashcards", text: "Make quick revision cards students can use offline." },
  ];
  return <div className="teacher-tools card"><div className="card-head"><div><span className="eyebrow">Content studio</span><h2>Build multilingual learning material</h2><p>Prepare once, then make the same content available in the learner's language.</p></div><Sparkles size={22}/></div><div className="teacher-tools__grid">{tools.map(({to,icon:Icon,title,text}) => <Link className="teacher-tool" to={to} key={to}><span className="teacher-tool__icon"><Icon size={20}/></span><strong>{title}</strong><span>{text}</span><small><Languages size={14}/> Translation + audio ready</small></Link>)}</div><div className="teacher-tools__note"><Mic size={17}/><span>Teachers can prepare written material while the audio/AI layer can be connected to your trained models later.</span></div></div>;
}
