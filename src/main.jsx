import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3, BookOpen, Check, ChevronRight, CircleHelp, GraduationCap,
  Home, Languages, Layers3, Menu, Monitor, Plus, RotateCcw, Settings,
  Sparkles, Users, Wifi, WifiOff, X
} from "lucide-react";
import "./styles.css";

const seedSubjects = [
  { id: "evs", name: "Environmental Studies", code: "EVS", icon: "🌿", description: "Nature, water, plants, animals and our environment.", progress: 0 },
  { id: "math", name: "Mathematics", code: "Math", icon: "🔢", description: "Numbers, patterns, shapes and problem solving.", progress: 0 },
];

const seedLessons = [
  { id: "water", subjectId: "evs", title: "Water Around Us", description: "Sources of water, safe water and daily conservation.", minutes: 10, level: "Grade 3", status: "available" },
  { id: "plants", subjectId: "evs", title: "Plants Near Me", description: "Identify common plants and how they help our community.", minutes: 12, level: "Grade 3", status: "available" },
  { id: "numbers", subjectId: "math", title: "Numbers & Place Value", description: "Read, compare and build numbers with place value.", minutes: 12, level: "Grade 3", status: "available" },
];

const seedFlashcards = [
  { id: "fc1", subjectId: "evs", front: "What is a source of water?", back: "A place from which we get water, such as a river, pond or well." },
  { id: "fc2", subjectId: "evs", front: "Why should we save water?", back: "Fresh water is limited and every community needs it for life." },
  { id: "fc3", subjectId: "math", front: "What is place value?", back: "The value of a digit depends on where it is in a number." },
];

const initialState = {
  role: null,
  user: null,
  language: "en",
  lessons: seedLessons,
  quizzes: [{ id: "q1", title: "Water Check", subjectId: "evs", questions: 5, level: "Grade 3" }],
  flashcards: seedFlashcards,
  progress: { completedLessons: [], quizScores: {} },
};

function useLocalState() {
  const [state, setState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sih26042-state")) || initialState;
    } catch {
      return initialState;
    }
  });
  useEffect(() => localStorage.setItem("sih26042-state", JSON.stringify(state)), [state]);
  return [state, setState];
}

function App() {
  const [state, setState] = useLocalState();
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    addEventListener("online", on); addEventListener("offline", off);
    return () => { removeEventListener("online", on); removeEventListener("offline", off); };
  }, []);

  const actions = useMemo(() => ({
    selectRole(role) { setState(s => ({ ...s, role })); },
    setupUser(user) { setState(s => ({ ...s, user })); },
    setLanguage(language) { setState(s => ({ ...s, language })); },
    completeLesson(id) { setState(s => s.progress.completedLessons.includes(id) ? s : ({ ...s, progress: { ...s.progress, completedLessons: [...s.progress.completedLessons, id] } })); },
    saveQuizScore(id, score) { setState(s => ({ ...s, progress: { ...s.progress, quizScores: { ...s.progress.quizScores, [id]: score } } })); },
    addLesson(lesson) { setState(s => ({ ...s, lessons: [...s.lessons, lesson] })); },
    addQuiz(quiz) { setState(s => ({ ...s, quizzes: [...s.quizzes, quiz] })); },
    addFlashcard(card) { setState(s => ({ ...s, flashcards: [...s.flashcards, card] })); },
    reset() { setState(initialState); },
  }), [setState]);

  return (
    <AppContext.Provider value={{ state, actions, online }}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/role" element={<RoleSelection />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/teacher/*" element={<RoleGate role="teacher"><TeacherShell /></RoleGate>} />
        <Route path="/student/*" element={<RoleGate role="student"><StudentShell /></RoleGate>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppContext.Provider>
  );
}

const AppContext = React.createContext(null);
const useApp = () => React.useContext(AppContext);

function Welcome() {
  const nav = useNavigate();
  return <main className="welcome-page">
    <div className="welcome-visual"><div className="brand-mark"><BookOpen size={30}/></div><span>SIH 26042</span><span className="pill"><WifiOff size={14}/> Offline-first</span></div>
    <section className="welcome-card">
      <div className="eyebrow">Learning that keeps going</div>
      <h1>Digital learning for <span>real classrooms.</span></h1>
      <p>Lessons, quizzes, flashcards and progress that stay useful even when the internet does not.</p>
      <div className="feature-list">
        <div><WifiOff/> Works offline</div><div><GraduationCap/> Teacher + student modes</div><div><Languages/> Local-language ready</div>
      </div>
      <button className="btn btn-primary btn-lg" onClick={() => nav("/role")}>Get started <ChevronRight size={19}/></button>
    </section>
    <div className="welcome-footer"><span>Designed for rural and low-connectivity learning environments.</span><span>Data stays on this device.</span></div>
  </main>
}

function RoleSelection() {
  const { actions } = useApp(); const nav = useNavigate();
  const choose = role => { actions.selectRole(role); nav("/setup"); };
  return <main className="center-page"><div className="auth-panel">
    <Link to="/" className="back-link">← Back</Link><div className="eyebrow">Choose your workspace</div><h1>Who is using SIH 26042?</h1><p className="muted">Your role controls the tools and navigation shown on this device.</p>
    <div className="role-grid">
      <button className="role-card" onClick={() => choose("student")}><div className="role-icon student"><GraduationCap/></div><strong>Student</strong><span>Learn lessons, take quizzes, revise and track progress.</span></button>
      <button className="role-card" onClick={() => choose("teacher")}><div className="role-icon teacher"><Users/></div><strong>Teacher</strong><span>Create content, manage a classroom and review progress.</span></button>
    </div>
  </div></main>
}

function Setup() {
  const { state, actions } = useApp(); const nav = useNavigate(); const [name, setName] = useState("");
  const role = state.role || "student";
  const submit = e => { e.preventDefault(); actions.setupUser({ name: name.trim() || (role === "teacher" ? "Teacher" : "Student") }); nav(`/${role}`); };
  return <main className="center-page"><form className="auth-panel form-panel" onSubmit={submit}><Link to="/role" className="back-link">← Change role</Link><div className="eyebrow">Local profile</div><h1>Set up this device</h1><p className="muted">No account or server is required for the core classroom experience.</p><label>Your name<input value={name} onChange={e => setName(e.target.value)} placeholder={role === "teacher" ? "e.g. Anita Ma'am" : "e.g. Ravi"} autoFocus /></label><label>Default language<select value={state.language} onChange={e => actions.setLanguage(e.target.value)}><option value="en">English</option><option value="hi">हिन्दी</option><option value="san">Santhali</option><option value="bn">বাংলা</option></select></label><button className="btn btn-primary btn-lg" type="submit">Open {role} workspace <ChevronRight size={19}/></button></form></main>
}

function RoleGate({ role, children }) { const { state } = useApp(); return state.role === role && state.user ? children : <Navigate to="/" replace />; }

function AppShell({ role, children }) {
  const { state, online } = useApp(); const [mobileOpen, setMobileOpen] = useState(false);
  const nav = role === "teacher" ? [
    ["/teacher", "Dashboard", Home], ["/teacher/content", "Content", BookOpen], ["/teacher/classroom", "Classroom", Users], ["/teacher/progress", "Progress", BarChart3], ["/teacher/languages", "Languages", Languages], ["/teacher/settings", "Settings", Settings]
  ] : [
    ["/student", "Home", Home], ["/student/lessons", "Learn", BookOpen], ["/student/revision", "Revision", Layers3], ["/student/quizzes", "Quizzes", CircleHelp], ["/student/progress", "Progress", BarChart3], ["/student/languages", "Languages", Languages], ["/student/settings", "Settings", Settings]
  ];
  return <div className={`app-shell ${role}`}>
    <header className="topbar"><button className="icon-btn mobile-only" onClick={() => setMobileOpen(v => !v)} aria-label="Menu">{mobileOpen ? <X/> : <Menu/>}</button><Link to={`/${role}`} className="app-logo"><div className="mini-logo"><BookOpen size={18}/></div><div><strong>SIH 26042</strong><span>{role} workspace</span></div></Link><div className="top-actions"><span className={`network ${online ? "ok" : "warn"}`}>{online ? <Wifi size={15}/> : <WifiOff size={15}/>} {online ? "Online" : "Offline"}</span><span className="lang-chip">{state.language.toUpperCase()}</span><span className="avatar">{(state.user?.name || role).slice(0,1).toUpperCase()}</span></div></header>
    <div className="shell-body"><aside className={`sidebar ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(false)}><div className="side-label">Workspace</div>{nav.map(([to,label,Icon]) => <NavLink key={to} to={to} end={to===`/${role}`} className={({isActive}) => `nav-item ${isActive?"active":""}`}><Icon size={18}/><span>{label}</span></NavLink>)}<div className="side-spacer"/><div className="offline-card"><WifiOff size={18}/><div><strong>Offline ready</strong><span>Changes save on-device</span></div></div></aside><main className="main-content">{children}</main></div>
    <nav className="mobile-nav">{nav.slice(0,5).map(([to,label,Icon]) => <NavLink key={to} to={to} end={to===`/${role}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
  </div>
}

function TeacherShell() { return <AppShell role="teacher"><Routes><Route index element={<TeacherDashboard/>}/><Route path="content" element={<TeacherContent/>}/><Route path="classroom" element={<TeacherClassroom/>}/><Route path="progress" element={<TeacherProgress/>}/><Route path="languages" element={<LanguagePage/>}/><Route path="settings" element={<SettingsPage/>}/><Route path="lessons/new" element={<CreateLesson/>}/><Route path="quizzes/new" element={<CreateQuiz/>}/><Route path="flashcards/new" element={<CreateFlashcard/>}/><Route path="*" element={<Navigate to="/teacher" replace/>}/></Routes></AppShell> }
function StudentShell() { return <AppShell role="student"><Routes><Route index element={<StudentDashboard/>}/><Route path="lessons" element={<LessonsPage/>}/><Route path="lessons/:id" element={<LessonPage/>}/><Route path="quizzes" element={<QuizzesPage/>}/><Route path="quizzes/:id" element={<QuizPage/>}/><Route path="revision" element={<RevisionPage/>}/><Route path="progress" element={<StudentProgress/>}/><Route path="languages" element={<LanguagePage/>}/><Route path="settings" element={<SettingsPage/>}/><Route path="*" element={<Navigate to="/student" replace/>}/></Routes></AppShell> }

function PageHeader({ eyebrow, title, description, actions }) { return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p className="muted">{description}</p>}</div>{actions && <div className="header-actions">{actions}</div>}</div> }
function Stat({ icon: Icon, value, label, tone }) { return <div className="stat"><div className={`stat-icon ${tone||""}`}><Icon size={19}/></div><strong>{value}</strong><span>{label}</span></div> }
function Card({ children, className="" }) { return <section className={`card ${className}`}>{children}</section> }
function Empty({ icon: Icon, title, text, action }) { return <div className="empty"><div className="empty-icon"><Icon size={23}/></div><h3>{title}</h3><p>{text}</p>{action}</div> }

function TeacherDashboard() { const { state } = useApp(); const lessons = state.lessons.length; const quizzes = state.quizzes.length; const flashcards = state.flashcards.length; return <div className="page"><PageHeader eyebrow="Teacher workspace" title={`Welcome, ${state.user.name}`} description="Everything you need to run an offline-ready classroom." actions={<Link className="btn btn-primary" to="/teacher/lessons/new"><Plus size={18}/> New lesson</Link>}/><div className="stats-grid"><Stat icon={BookOpen} value={lessons} label="Lessons"/><Stat icon={CircleHelp} value={quizzes} label="Quizzes" tone="purple"/><Stat icon={Layers3} value={flashcards} label="Flashcards" tone="green"/><Stat icon={Users} value="0" label="Students" tone="orange"/></div><div className="dashboard-grid"><Card><div className="card-head"><div><h2>Quick actions</h2><p>Create material once, then use it offline.</p></div></div><div className="action-grid"><Link to="/teacher/lessons/new" className="quick-action"><BookOpen/><strong>Create lesson</strong><span>Teach a topic</span></Link><Link to="/teacher/quizzes/new" className="quick-action"><CircleHelp/><strong>Create quiz</strong><span>Check understanding</span></Link><Link to="/teacher/flashcards/new" className="quick-action"><Layers3/><strong>Create flashcards</strong><span>Build revision sets</span></Link><Link to="/teacher/languages" className="quick-action"><Languages/><strong>Manage languages</strong><span>Choose classroom language</span></Link></div></Card><Card><div className="card-head"><div><h2>Class overview</h2><p>Local classroom analytics</p></div></div><Empty icon={Users} title="No students yet" text="Add students when you are ready to use classroom progress tracking."/></Card></div></div> }

function TeacherContent() { const { state } = useApp(); return <div className="page"><PageHeader eyebrow="Content library" title="Your teaching content" description="Create, review and reuse learning material stored on this device." actions={<Link className="btn btn-primary" to="/teacher/lessons/new"><Plus size={18}/> Create</Link>}/><div className="content-tabs"><span className="active">Lessons ({state.lessons.length})</span><span>Quizzes ({state.quizzes.length})</span><span>Flashcards ({state.flashcards.length})</span></div><Card><div className="list">{state.lessons.map(l => <div className="list-row" key={l.id}><div className="list-main"><div className="list-icon"><BookOpen size={18}/></div><div><strong>{l.title}</strong><span>{l.description}</span></div></div><div className="row-meta"><span className="tag">{l.level}</span><span>{l.minutes} min</span></div></div>)}{state.lessons.length===0 && <Empty icon={BookOpen} title="No lessons" text="Create your first lesson to start building the local library."/>}</div></Card></div> }
function TeacherClassroom() { return <div className="page"><PageHeader eyebrow="Classroom" title="Classroom management" description="Keep a simple local roster and prepare content for shared devices."/><Card><Empty icon={Users} title="Classroom is ready" text="The app is currently running in local-profile mode. Student roster syncing can be connected later without changing the learning experience."/></Card></div> }
function TeacherProgress() { return <div className="page"><PageHeader eyebrow="Analytics" title="Progress" description="At-a-glance learning progress from this device."/><div className="stats-grid"><Stat icon={BarChart3} value="0%" label="Average completion"/><Stat icon={CircleHelp} value="—" label="Average quiz score" tone="purple"/><Stat icon={Users} value="0" label="Active students" tone="orange"/></div><Card><Empty icon={BarChart3} title="Progress appears here" text="Once student activity is recorded, this area will show completion, quiz performance and revision trends."/></Card></div> }

function StudentDashboard() { const { state } = useApp(); const done = state.progress.completedLessons.length; const pct = Math.round((done / Math.max(state.lessons.length,1))*100); return <div className="page"><div className="student-hero"><div><span className="pill bright"><Sparkles size={14}/> Keep learning</span><h1>Hi, {state.user.name}! 👋</h1><p>Your next lesson is ready. Learn at your pace, even without internet.</p><div className="hero-actions"><Link to="/student/lessons" className="btn btn-student">Start learning <ChevronRight size={18}/></Link><Link to="/student/revision" className="btn btn-ghost">Revision</Link></div></div><div className="hero-orbit"><div><BookOpen size={35}/><span>{pct}%</span><small>complete</small></div></div></div><div className="stats-grid"><Stat icon={BookOpen} value={done} label="Lessons done"/><Stat icon={CircleHelp} value={Object.keys(state.progress.quizScores).length} label="Quizzes done" tone="purple"/><Stat icon={BarChart3} value={done ? "100%" : "—"} label="Learning progress" tone="green"/><Stat icon={Sparkles} value="0" label="Day streak" tone="orange"/></div><PageHeader eyebrow="Continue learning" title="Choose a subject" description="Pick a topic and keep moving forward."/><div className="subject-grid">{seedSubjects.map(s => <Link to={`/student/lessons?subject=${s.id}`} className="subject-card" key={s.id}><div className="subject-emoji">{s.icon}</div><div><span className="code">{s.code}</span><h3>{s.name}</h3><p>{s.description}</p></div><div className="subject-bottom"><div className="bar"><span style={{width:`${s.id === "evs" ? pct : 0}%`}}/></div><ChevronRight size={19}/></div></Link>)}</div></div> }

function LessonsPage() { const { state } = useApp(); const params = new URLSearchParams(useLocation().search); const subject = params.get("subject"); const lessons = state.lessons.filter(l => !subject || l.subjectId === subject); return <div className="page"><PageHeader eyebrow="Learn" title="Lessons" description="Small lessons designed for short offline study sessions."/><div className="lesson-grid">{lessons.map(l => { const done=state.progress.completedLessons.includes(l.id); return <Link to={`/student/lessons/${l.id}`} key={l.id} className={`lesson-card ${done?"done":""}`}><div className="lesson-top"><span className="tag">{l.level}</span>{done && <span className="done-badge"><Check size={14}/> Done</span>}</div><div className="lesson-icon"><BookOpen size={21}/></div><h3>{l.title}</h3><p>{l.description}</p><div className="lesson-bottom"><span>{l.minutes} min</span><span>Open <ChevronRight size={16}/></span></div></Link> })}</div>{!lessons.length && <Card><Empty icon={BookOpen} title="No lessons found" text="Try another subject."/></Card>}</div> }

function LessonPage() { const { state, actions } = useApp(); const { id } = useParams(); const lesson = state.lessons.find(l => l.id===id); const [read, setRead]=useState(false); if(!lesson) return <Navigate to="/student/lessons" replace/>; const done=state.progress.completedLessons.includes(id); return <div className="page narrow"><Link to="/student/lessons" className="back-link">← All lessons</Link><div className="lesson-view"><div className="eyebrow">{lesson.level} • {lesson.minutes} min</div><h1>{lesson.title}</h1><p className="lead">{lesson.description}</p><div className="lesson-progress"><span style={{width:done?"100%":read?"70%":"25%"}}/></div><Card><div className="lesson-body"><h2>Learning goal</h2><p>Understand the key idea, connect it to everyday life, and finish with a quick check.</p><div className="callout"><Sparkles size={19}/><div><strong>Offline tip</strong><span>This lesson is saved on your device, so you can continue even when the network is unavailable.</span></div></div><h2>Explore the topic</h2><p>{lesson.title} becomes easier when you look for examples around you. Read the short explanation, think of one local example, and then test yourself with the next step.</p><p>Pause and explain the idea in your own words. Teaching a friend or family member is a great way to remember.</p></div></Card><div className="view-actions">{!read && !done ? <button className="btn btn-primary btn-lg" onClick={()=>setRead(true)}>Mark as read <Check size={18}/></button> : <button className="btn btn-student btn-lg" onClick={()=>actions.completeLesson(id)} disabled={done}>{done?"Lesson completed ✓":"Complete lesson"}</button>}<Link to="/student/quizzes" className="btn btn-secondary">Take a quiz</Link></div></div></div> }

function useParams() { const location=useLocation(); const parts=location.pathname.split("/").filter(Boolean); return { id: parts.at(-1) }; }

function QuizzesPage() { const { state }=useApp(); return <div className="page"><PageHeader eyebrow="Check your learning" title="Quizzes" description="Quick checks with results stored locally."/><div className="quiz-grid">{state.quizzes.map(q => <Link to={`/student/quizzes/${q.id}`} className="quiz-card" key={q.id}><div className="quiz-icon"><CircleHelp size={22}/></div><div><span className="tag">{q.level}</span><h3>{q.title}</h3><p>{q.questions} questions • instant result</p></div><ChevronRight/></Link>)}</div></div> }
function QuizPage() { const {state,actions}=useApp(); const {id}=useParams(); const quiz=state.quizzes.find(q=>q.id===id); const [selected,setSelected]=useState(null); const [submitted,setSubmitted]=useState(false); if(!quiz) return <Navigate to="/student/quizzes" replace/>; const options=["It is used only for drinking","It can come from a river, pond or well","It is always found underground","It cannot be saved"]; const submit=()=>{setSubmitted(true); actions.saveQuizScore(id, selected===1?100:50)}; return <div className="page narrow"><Link to="/student/quizzes" className="back-link">← All quizzes</Link><div className="quiz-view"><div className="eyebrow">{quiz.level} • {quiz.questions} questions</div><h1>{quiz.title}</h1><Card><div className="question"><span className="question-number">1</span><h2>Which statement best describes a source of water?</h2><div className="option-list">{options.map((o,i)=><button key={o} className={`option ${selected===i?"selected":""} ${submitted && i===1?"correct":""}`} onClick={()=>!submitted&&setSelected(i)}>{o}{submitted&&i===1&&<Check size={18}/>}</button>)}</div>{submitted&&<div className="feedback"><Check size={18}/><div><strong>Good work!</strong><span>Your answer has been saved locally.</span></div></div>}<button className="btn btn-student btn-lg full" onClick={submit} disabled={selected===null||submitted}>{submitted?"Submitted ✓":"Submit answer"}</button></div></Card></div></div> }
function RevisionPage() { const {state}=useApp(); return <div className="page"><PageHeader eyebrow="Revision" title="Flashcards" description="Tap a card, think first, then reveal the answer."/><FlashcardDeck cards={state.flashcards}/></div> }
function FlashcardDeck({cards}) { const [i,setI]=useState(0); const [flip,setFlip]=useState(false); if(!cards.length) return <Card><Empty icon={Layers3} title="No flashcards" text="Your revision deck is empty."/></Card>; const c=cards[i%cards.length]; return <div className="flash-wrap"><button className={`flashcard ${flip?"flip":""}`} onClick={()=>setFlip(v=>!v)}><div className="face front"><span>QUESTION</span><h2>{c.front}</h2><small>Tap to reveal</small></div><div className="face back"><span>ANSWER</span><h2>{c.back}</h2><small>Tap to return</small></div></button><div className="flash-controls"><button className="btn btn-secondary" onClick={()=>{setI((i+cards.length-1)%cards.length);setFlip(false)}}><RotateCcw size={17}/> Previous</button><span>{i+1} / {cards.length}</span><button className="btn btn-primary" onClick={()=>{setI((i+1)%cards.length);setFlip(false)}}>Next <ChevronRight size={17}/></button></div></div> }
function LanguagePage() { const {state,actions}=useApp(); const languages=[['en','English'],['hi','हिन्दी'],['san','Santhali'],['bn','বাংলা']]; return <div className="page"><PageHeader eyebrow="Language" title="Learning language" description="Choose the language used across the local profile."/><Card><div className="language-grid">{languages.map(([code,name])=><button key={code} className={`language-card ${state.language===code?"selected":""}`} onClick={()=>actions.setLanguage(code)}><span>{code.toUpperCase()}</span><strong>{name}</strong>{state.language===code&&<Check size={18}/>}</button>)}</div></Card></div> }
function SettingsPage() { const {state,actions}=useApp(); const nav=useNavigate(); return <div className="page"><PageHeader eyebrow="Settings" title="Device settings" description="Simple controls for this offline-first profile."/><div className="settings-grid"><Card><div className="setting-row"><div><strong>Profile</strong><span>{state.user?.name} • {state.role}</span></div><Monitor size={19}/></div><div className="setting-row"><div><strong>Storage</strong><span>Learning data is saved locally in your browser.</span></div><span className="status-dot">Ready</span></div><div className="setting-row"><div><strong>Connectivity</strong><span>Core learning does not depend on a network connection.</span></div></div></Card><Card><div className="setting-danger"><strong>Reset local profile</strong><span>This removes the current name, role and saved progress from this device.</span><button className="btn btn-secondary" onClick={()=>{actions.reset();nav("/")}}>Reset device data</button></div></Card></div></div> }

function CreateLesson() { const {actions}=useApp(); const nav=useNavigate(); const [f,setF]=useState({title:"",description:"",minutes:10,subjectId:"evs"}); const submit=e=>{e.preventDefault(); actions.addLesson({id:`lesson-${Date.now()}`,...f,minutes:Number(f.minutes),level:"Grade 3",status:"available"});nav("/teacher/content")}; return <div className="page narrow"><Link to="/teacher/content" className="back-link">← Content library</Link><form className="form-card" onSubmit={submit}><div className="eyebrow">Create content</div><h1>New lesson</h1><label>Lesson title<input required value={f.title} onChange={e=>setF({...f,title:e.target.value})} placeholder="e.g. Our Local Trees"/></label><label>Description<textarea required value={f.description} onChange={e=>setF({...f,description:e.target.value})} placeholder="What should students learn?"/></label><div className="two-fields"><label>Subject<select value={f.subjectId} onChange={e=>setF({...f,subjectId:e.target.value})}><option value="evs">Environmental Studies</option><option value="math">Mathematics</option></select></label><label>Minutes<input type="number" min="1" max="60" value={f.minutes} onChange={e=>setF({...f,minutes:e.target.value})}/></label></div><button className="btn btn-primary btn-lg" type="submit">Save lesson <Check size={18}/></button></form></div> }
function CreateQuiz() { const {actions}=useApp(); const nav=useNavigate(); const [title,setTitle]=useState(""); const submit=e=>{e.preventDefault(); actions.addQuiz({id:`quiz-${Date.now()}`,title,subjectId:"evs",questions:5,level:"Grade 3"});nav("/teacher/content")}; return <div className="page narrow"><Link to="/teacher" className="back-link">← Dashboard</Link><form className="form-card" onSubmit={submit}><div className="eyebrow">Create content</div><h1>New quiz</h1><label>Quiz title<input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Water basics"/></label><p className="muted">The starter app includes a local quiz runner; richer question authoring can be added without changing the data model.</p><button className="btn btn-primary btn-lg" type="submit">Save quiz <Check size={18}/></button></form></div> }
function CreateFlashcard() { const {actions}=useApp(); const nav=useNavigate(); const [f,setF]=useState({front:"",back:""}); const submit=e=>{e.preventDefault();actions.addFlashcard({id:`fc-${Date.now()}`,subjectId:"evs",...f});nav("/teacher/content")}; return <div className="page narrow"><Link to="/teacher" className="back-link">← Dashboard</Link><form className="form-card" onSubmit={submit}><div className="eyebrow">Create content</div><h1>New flashcard</h1><label>Question<input required value={f.front} onChange={e=>setF({...f,front:e.target.value})} placeholder="Front of card"/></label><label>Answer<textarea required value={f.back} onChange={e=>setF({...f,back:e.target.value})} placeholder="Back of card"/></label><button className="btn btn-primary btn-lg" type="submit">Save flashcard <Check size={18}/></button></form></div> }

createRoot(document.getElementById("root")).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>);
