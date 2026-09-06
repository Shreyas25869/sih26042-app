import { useMemo } from "react";
import { BarChart3, BookOpen, CheckCircle2, CircleHelp, Layers3, TrendingUp, Users, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../../app/AppContext";
import { loadClassroom } from "./classroomStore";

export default function TeacherProgress2Page() {
  const { state } = useApp();
  const classroom = loadClassroom();
  const classes = classroom.classes || [];
  const students = classroom.students || [];
  const assignments = classroom.assignments || [];
  const completed = state.progress.completedLessons.length;
  const quizAttempts = Object.keys(state.progress.quizScores).length;
  const lessonRate = Math.round((completed / Math.max(state.lessons.length, 1)) * 100);
  const quizRate = Math.round((quizAttempts / Math.max(state.quizzes.length, 1)) * 100);
  const assignmentRows = useMemo(() => assignments.map((item) => {
    const lesson = state.lessons.find((value) => value.id === item.contentId);
    const quiz = state.quizzes.find((value) => value.id === item.contentId);
    return { ...item, title: lesson?.title || quiz?.title || item.contentId, type: item.contentType === "quiz" ? "Quiz" : "Lesson" };
  }), [assignments, state.lessons, state.quizzes]);

  return <div className="page teacher-progress2">
    <section className="teacher-progress2-hero"><div><span className="eyebrow">Teacher analytics</span><h1>Progress & insights</h1><p>Understand what has been completed, assigned and prepared on this device.</p></div><div className="teacher-progress2-local"><WifiOff size={18}/><strong>Local analytics</strong><span>Designed for offline classrooms</span></div></section>

    <div className="stats-grid"><ProgressStat icon={TrendingUp} value={`${lessonRate}%`} label="Lesson completion"/><ProgressStat icon={CircleHelp} value={`${quizRate}%`} label="Quiz coverage"/><ProgressStat icon={Users} value={students.length} label="Learners"/><ProgressStat icon={BookOpen} value={assignments.length} label="Assignments"/></div>

    <div className="teacher-progress2-grid">
      <section className="card teacher-progress2-card"><div className="card-head"><div><span className="eyebrow">Learning completion</span><h2>Content progress</h2></div><BarChart3 size={20}/></div><ProgressBar label="Lessons completed" value={completed} total={state.lessons.length}/><ProgressBar label="Quizzes attempted" value={quizAttempts} total={state.quizzes.length}/><ProgressBar label="Flashcards available" value={state.flashcards.length} total={state.flashcards.length}/><div className="teacher-progress2-note"><CheckCircle2 size={17}/><span>All values come from activity currently stored locally. They can later be connected to the classroom sync layer.</span></div></section>

      <section className="card teacher-progress2-card"><div className="card-head"><div><span className="eyebrow">Classrooms</span><h2>Class snapshot</h2></div><Link className="text-link" to="/teacher/classroom">Manage <span>→</span></Link></div>{classes.length ? classes.map((item) => { const count=students.filter((student)=>student.classId===item.id).length; const assigned=assignments.filter((assignment)=>assignment.classId===item.id).length; return <div className="teacher-class-row" key={item.id}><div className="teacher-class-avatar">{item.name.slice(0,1).toUpperCase()}</div><div><strong>{item.name}</strong><span>{item.grade} · {item.language.toUpperCase()}</span></div><div><strong>{count}</strong><span>learners</span></div><div><strong>{assigned}</strong><span>assigned</span></div></div>}) : <Empty icon={Users} title="No classrooms yet" text="Create a classroom to see its learning snapshot." link="/teacher/classroom"/>}</section>
    </div>

    <section className="card teacher-progress2-card"><div className="card-head"><div><span className="eyebrow">Teaching plan</span><h2>Assigned content</h2><p>Assignments currently prepared for local classroom use.</p></div><Link className="btn btn-secondary" to="/teacher/classroom">Manage assignments</Link></div>{assignmentRows.length ? <div className="teacher-assignment-table">{assignmentRows.map((item)=><div className="teacher-assignment-row" key={item.id}><div className="assignment-type">{item.type.toUpperCase()}</div><div><strong>{item.title}</strong><span>{classes.find((c)=>c.id===item.classId)?.name || "Classroom"}</span></div><span className="badge badge-success">Ready</span></div>)}</div> : <Empty icon={Layers3} title="No assigned content" text="Assign a lesson or quiz from Classroom Management." link="/teacher/classroom"/>}</section>
  </div>;
}
function ProgressStat({icon:Icon,value,label}){return <div className="stat"><div className="stat-icon"><Icon size={19}/></div><strong>{value}</strong><span>{label}</span></div>}
function ProgressBar({label,value,total}){const percent=Math.round((value/Math.max(total,1))*100);return <div className="teacher-progress-bar"><div><span>{label}</span><strong>{value}/{total}</strong></div><div className="teacher-progress-track"><i style={{width:`${percent}%`}}/></div></div>}
function Empty({icon:Icon,title,text,link}){return <div className="teacher-progress-empty"><Icon/><strong>{title}</strong><span>{text}</span><Link className="text-link" to={link}>Open workspace →</Link></div>}
