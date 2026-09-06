import { useMemo, useState } from "react";
import { BarChart3, BookOpen, CheckCircle2, ChevronRight, Languages, Plus, UserPlus, Users, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../../app/AppContext";
import { addStudent, assignContent, createClassroom, loadClassroom } from "./classroomStore";

export default function ClassroomManagement2Page() {
  const { state } = useApp();
  const [data, setData] = useState(loadClassroom());
  const [activeId, setActiveId] = useState("");
  const [className, setClassName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [contentId, setContentId] = useState("");
  const selected = data.classes.find((item) => item.id === activeId) || data.classes[0];
  const students = useMemo(() => data.students.filter((item) => selected && item.classId === selected.id), [data.students, selected]);
  const assignments = useMemo(() => data.assignments.filter((item) => selected && item.classId === selected.id), [data.assignments, selected]);
  const refresh = () => setData(loadClassroom());

  function create(event) { event.preventDefault(); if (!className.trim()) return; const item = createClassroom({ name: className.trim(), grade: "Grade 3", language: state.language }); setClassName(""); setActiveId(item.id); refresh(); }
  function add(event) { event.preventDefault(); if (!studentName.trim() || !selected) return; addStudent({ name: studentName.trim(), classId: selected.id }); setStudentName(""); refresh(); }
  function assign() { if (!selected || !contentId) return; assignContent({ classId: selected.id, contentId, contentType: state.quizzes.some((q) => q.id === contentId) ? "quiz" : "lesson" }); setContentId(""); refresh(); }

  return <div className="classroom2 page">
    <div className="classroom2-header"><div><span className="eyebrow">Teacher workspace</span><h1>Classroom Management</h1><p className="muted">Manage local classes, learners and learning assignments — even with limited connectivity.</p></div><Link className="btn btn-secondary" to="/teacher/offline"><WifiOff size={17}/> Offline Center</Link></div>

    <div className="classroom2-stats"><MiniStat icon={Users} value={data.classes.length} label="Classes"/><MiniStat icon={UserPlus} value={data.students.length} label="Learners"/><MiniStat icon={BookOpen} value={data.assignments.length} label="Assignments"/><MiniStat icon={BarChart3} value={state.lessons.length + state.quizzes.length} label="Available content"/></div>

    <div className="classroom2-grid">
      <section className="card classroom2-classes"><div className="section-heading"><div><span className="eyebrow">Workspace</span><h2>My classes</h2></div><Users size={20}/></div><div className="classroom2-class-list">{data.classes.length ? data.classes.map((item) => <button key={item.id} className={`classroom2-class ${selected?.id === item.id ? "active" : ""}`} onClick={() => setActiveId(item.id)}><span className="classroom2-class-avatar">{item.name.slice(0, 1).toUpperCase()}</span><span><strong>{item.name}</strong><small>{item.grade} · {item.language.toUpperCase()}</small></span><ChevronRight size={16}/></button>) : <div className="classroom2-empty"><Users/><strong>No classroom yet</strong><span>Create one to start managing learners.</span></div>}</div><form className="classroom2-create" onSubmit={create}><input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="New class name"/><button className="btn btn-primary"><Plus size={17}/> Create</button></form></section>

      <section className="card classroom2-overview"><div className="section-heading"><div><span className="eyebrow">Class overview</span><h2>{selected?.name || "Select a class"}</h2></div>{selected && <span className="badge">{students.length} learners</span>}</div>{selected ? <><div className="classroom2-overview-strip"><div><strong>{students.length}</strong><span>Students</span></div><div><strong>{assignments.length}</strong><span>Assignments</span></div><div><strong>{selected.language.toUpperCase()}</strong><span>Language</span></div></div><form className="classroom2-add" onSubmit={add}><input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name"/><button className="btn btn-secondary"><UserPlus size={17}/> Add learner</button></form><div className="classroom2-roster">{students.length ? students.map((student) => <div className="classroom2-student" key={student.id}><span className="avatar">{student.name.slice(0, 1).toUpperCase()}</span><div><strong>{student.name}</strong><span>Local learner</span></div><CheckCircle2 size={17}/></div>) : <div className="classroom2-empty compact"><UserPlus/><strong>No learners added</strong><span>Add students to build the roster.</span></div>}</div></> : <div className="classroom2-empty large"><Users/><strong>Your classroom starts here</strong><span>Create a class from the left, then add learners and assign content.</span></div>}</section>
    </div>

    {selected && <section className="card classroom2-assignment"><div className="section-heading"><div><span className="eyebrow">Distribution</span><h2>Assign learning</h2><p className="muted">Assignments are stored locally and can be used as the classroom's offline plan.</p></div><CheckCircle2 size={21}/></div><div className="classroom2-assign-form"><select value={contentId} onChange={(e) => setContentId(e.target.value)}><option value="">Choose lesson or quiz</option>{state.lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>Lesson · {lesson.title}</option>)}{state.quizzes.map((quiz) => <option key={quiz.id} value={quiz.id}>Quiz · {quiz.title}</option>)}</select><button className="btn btn-primary" onClick={assign}>Assign to class <ChevronRight size={17}/></button></div><div className="classroom2-assignment-list">{assignments.length ? assignments.map((assignment) => <div className="classroom2-assignment-row" key={assignment.id}><span className="assignment-type">{assignment.contentType === "quiz" ? "QUIZ" : "LESSON"}</span><strong>{state.lessons.find((item) => item.id === assignment.contentId)?.title || state.quizzes.find((item) => item.id === assignment.contentId)?.title || assignment.contentId}</strong><span className="badge badge-success">Assigned</span></div>) : <div className="classroom2-empty compact"><BookOpen/><strong>No assignments yet</strong><span>Choose content above to create the first classroom task.</span></div>}</div></section>}

    <section className="classroom2-bottom"><Link className="card classroom2-link-card" to="/teacher/languages"><Languages/><div><span className="eyebrow">Language support</span><h3>Adapt classroom content</h3><p>Translate and preview audio for local-language learning.</p></div><ChevronRight/></Link><Link className="card classroom2-link-card" to="/teacher/progress"><BarChart3/><div><span className="eyebrow">Progress</span><h3>Review learning activity</h3><p>See the learning data currently available on this device.</p></div><ChevronRight/></Link></section>
  </div>;
}
function MiniStat({ icon: Icon, value, label }) { return <div className="classroom2-stat"><div><Icon size={18}/></div><strong>{value}</strong><span>{label}</span></div>; }
