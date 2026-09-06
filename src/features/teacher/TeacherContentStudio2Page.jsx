import { useMemo, useState } from "react";
import { BookOpen, Check, ChevronRight, FileQuestion, Layers3, Languages, Plus, Save, Sparkles, Trash2, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../../app/AppContext";

const TYPES = [
  { id: "lesson", label: "Lesson", icon: BookOpen, help: "A short guided learning activity" },
  { id: "quiz", label: "Quiz", icon: FileQuestion, help: "A quick check for understanding" },
  { id: "flashcard", label: "Flashcards", icon: Layers3, help: "A compact revision deck" },
];

export default function TeacherContentStudio2Page() {
  const { state, actions } = useApp();
  const [type, setType] = useState("lesson");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Grade 3");
  const [minutes, setMinutes] = useState("10");
  const [questions, setQuestions] = useState(5);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [saved, setSaved] = useState(false);

  const contentCount = useMemo(() => state.lessons.length + state.quizzes.length + state.flashcards.length, [state]);

  function saveContent(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const id = `${type}-${Date.now()}`;
    if (type === "lesson") actions.addLesson({ id, subjectId: "general", title: cleanTitle, description: description.trim() || "Teacher-created learning activity.", minutes: Number(minutes) || 10, level });
    if (type === "quiz") actions.addQuiz({ id, title: cleanTitle, questions: Number(questions) || 5, level });
    if (type === "flashcard") actions.addFlashcard({ id, front: front.trim() || cleanTitle, back: back.trim() || "Add the answer before sharing this card." });
    setSaved(true);
    setTitle(""); setDescription(""); setFront(""); setBack("");
    window.setTimeout(() => setSaved(false), 2200);
  }

  return <div className="content-studio-2 page">
    <div className="studio2-header">
      <div><span className="eyebrow">Teacher workspace</span><h1>Content Studio</h1><p className="muted">Create classroom content once, then prepare it for local-language and offline learning.</p></div>
      <div className="studio2-header-actions"><span className="studio2-count">{contentCount} items on this device</span><Link className="btn btn-secondary" to="/teacher/offline"><WifiOff size={17}/> Offline Center</Link></div>
    </div>

    <div className="studio2-layout">
      <section className="studio2-builder card">
        <div className="studio2-tabs">{TYPES.map(({ id, label, icon: Icon }) => <button key={id} className={type === id ? "active" : ""} onClick={() => setType(id)}><Icon size={17}/>{label}</button>)}</div>
        <form onSubmit={saveContent}>
          <div className="studio2-form-head"><div><span className="eyebrow">Create new</span><h2>{TYPES.find((item) => item.id === type)?.label}</h2></div><span className="draft-badge"><Save size={14}/> Local draft</span></div>
          <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={type === "lesson" ? "e.g. Clean Water at Home" : type === "quiz" ? "e.g. Water Safety Check" : "e.g. Ways to Save Water"} required /></label>
          {type === "lesson" && <>
            <label>Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" placeholder="What should students learn from this activity?" /></label>
            <div className="studio2-field-grid"><label>Grade<select value={level} onChange={(e) => setLevel(e.target.value)}><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option><option>Grade 4</option><option>Grade 5</option></select></label><label>Duration (min)<input type="number" min="1" max="120" value={minutes} onChange={(e) => setMinutes(e.target.value)} /></label></div>
          </>}
          {type === "quiz" && <div className="studio2-field-grid"><label>Grade<select value={level} onChange={(e) => setLevel(e.target.value)}><option>Grade 1</option><option>Grade 2</option><option>Grade 3</option><option>Grade 4</option><option>Grade 5</option></select></label><label>Questions<input type="number" min="1" max="30" value={questions} onChange={(e) => setQuestions(e.target.value)} /></label></div>}
          {type === "flashcard" && <><label>Question / front<textarea value={front} onChange={(e) => setFront(e.target.value)} rows="3" placeholder="Ask one clear question" /></label><label>Answer / back<textarea value={back} onChange={(e) => setBack(e.target.value)} rows="3" placeholder="Write the answer or explanation" /></label></>}
          <div className="studio2-save-row"><div className="studio2-save-note"><Check size={15}/> Saved locally on this device</div><button className="btn btn-primary btn-lg" type="submit">{saved ? "Saved" : "Save content"} {saved ? <Check size={18}/> : <Save size={18}/>}</button></div>
        </form>
      </section>

      <aside className="studio2-side">
        <section className="card studio2-guide"><div className="guide-icon"><Sparkles /></div><span className="eyebrow">Recommended workflow</span><h2>Build once. Adapt everywhere.</h2><p>Create the core content first. Translation, audio and offline packaging can be layered on without changing the lesson itself.</p><div className="guide-list"><GuideItem n="01" icon={Plus} text="Create" /><GuideItem n="02" icon={Languages} text="Translate" /><GuideItem n="03" icon={WifiOff} text="Prepare offline" /></div></section>
        <section className="card studio2-library"><div className="section-heading"><div><span className="eyebrow">Library</span><h2>Recent content</h2></div><Link className="text-link" to="/teacher/progress">Overview <ChevronRight size={15}/></Link></div><div className="studio2-library-list"><LibraryRow icon={BookOpen} label="Lessons" value={state.lessons.length} /><LibraryRow icon={FileQuestion} label="Quizzes" value={state.quizzes.length} /><LibraryRow icon={Layers3} label="Flashcards" value={state.flashcards.length} /></div></section>
      </aside>
    </div>

    <section className="card studio2-language-banner"><div className="language-banner-icon"><Languages /></div><div><span className="eyebrow">Local language ready</span><h2>Translate and preview audio after creating content</h2><p>Use the existing Language Assistant to adapt teacher content for English, Hindi, Santhali, Bengali, Tamil, Telugu and Marathi.</p></div><Link className="btn btn-secondary" to="/teacher/languages">Open language tools <ChevronRight size={17}/></Link></section>
  </div>;
}

function GuideItem({ n, icon: Icon, text }) { return <div className="guide-item"><span>{n}</span><Icon size={17}/><strong>{text}</strong></div>; }
function LibraryRow({ icon: Icon, label, value }) { return <div className="library-row"><Icon size={17}/><span>{label}</span><strong>{value}</strong></div>; }
