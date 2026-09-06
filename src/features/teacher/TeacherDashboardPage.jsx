import { useMemo } from "react";
import { BarChart3, BookOpen, CheckCircle2, ChevronRight, CircleHelp, Clock3, HardDriveDownload, Languages, Layers3, Plus, Users, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../../app/AppContext";

const activity = [
  { icon: BookOpen, title: "Water Around Us", detail: "Lesson available for Grade 3", status: "Ready" },
  { icon: CircleHelp, title: "Water Check", detail: "5-question assessment", status: "Published" },
  { icon: Layers3, title: "Place Value Revision", detail: "Flashcard deck", status: "Ready" },
];

export default function TeacherDashboardPage() {
  const { state, online } = useApp();
  const completed = state.progress.completedLessons.length;
  const quizCount = Object.keys(state.progress.quizScores).length;
  const completion = Math.round((completed / Math.max(state.lessons.length, 1)) * 100);
  const offlineReady = state.lessons.length + state.quizzes.length;
  const nextLesson = useMemo(() => state.lessons.find((lesson) => !state.progress.completedLessons.includes(lesson.id)) || state.lessons[0], [state.lessons, state.progress.completedLessons]);

  return (
    <div className="page teacher-dashboard">
      <section className="teacher-dashboard-hero">
        <div>
          <span className="eyebrow">Teacher workspace</span>
          <h1>Welcome, {state.user.name}</h1>
          <p>Everything you need to prepare, teach and review learning from one classroom dashboard.</p>
          <div className="teacher-hero-actions">
            <Link className="btn btn-primary" to="/teacher/content"><Plus size={17} /> Create content</Link>
            <Link className="btn btn-secondary" to="/teacher/classroom">Open classroom <ChevronRight size={17} /></Link>
          </div>
        </div>
        <div className="teacher-hero-status">
          <div className="status-orb"><WifiOff size={24} /></div>
          <strong>{online ? "Connected" : "Offline mode"}</strong>
          <span>{online ? "Changes can sync when connected." : "Your classroom keeps working locally."}</span>
        </div>
      </section>

      <div className="stats-grid teacher-dashboard-stats">
        <DashboardStat icon={BookOpen} value={state.lessons.length} label="Lessons" hint="Learning content" />
        <DashboardStat icon={CircleHelp} value={state.quizzes.length} label="Quizzes" hint="Assessments" />
        <DashboardStat icon={Layers3} value={state.flashcards.length} label="Flashcards" hint="Revision material" />
        <DashboardStat icon={Users} value="—" label="Students" hint="Classroom roster" />
      </div>

      <div className="teacher-dashboard-grid">
        <section className="card dashboard-progress-card">
          <div className="card-head"><div><span className="eyebrow">Classroom pulse</span><h2>Learning overview</h2><p>Activity currently stored on this device.</p></div><Link className="text-link" to="/teacher/progress">View progress <ChevronRight size={15} /></Link></div>
          <div className="dashboard-progress-main"><div className="progress-ring" style={{ "--progress": `${completion}%` }}><strong>{completion}%</strong><span>complete</span></div><div className="dashboard-metrics"><Metric label="Lessons completed" value={`${completed}/${state.lessons.length}`} /><Metric label="Quizzes attempted" value={quizCount} /><Metric label="Offline items" value={offlineReady} /></div></div>
        </section>

        <section className="card next-lesson-card">
          <div className="card-head"><div><span className="eyebrow">Next up</span><h2>{nextLesson?.title || "No lessons yet"}</h2></div><Clock3 size={20} /></div>
          {nextLesson ? <><p>{nextLesson.description}</p><div className="next-lesson-meta"><span>{nextLesson.level}</span><span>{nextLesson.minutes} min</span></div><Link className="btn btn-primary btn-block" to="/teacher/content">Open Content Studio <ChevronRight size={17} /></Link></> : <Link className="btn btn-primary" to="/teacher/content">Create first lesson</Link>}
        </section>
      </div>

      <div className="teacher-dashboard-grid lower">
        <section className="card">
          <div className="card-head"><div><span className="eyebrow">Recent work</span><h2>Classroom activity</h2></div><Link className="text-link" to="/teacher/classroom">Open classroom <ChevronRight size={15} /></Link></div>
          <div className="activity-list">{activity.map(({ icon: Icon, title, detail, status }) => <div className="activity-row" key={title}><div className="activity-icon"><Icon size={18} /></div><div><strong>{title}</strong><span>{detail}</span></div><span className="activity-status"><CheckCircle2 size={14} /> {status}</span></div>)}</div>
        </section>

        <section className="card dashboard-tools-card">
          <div className="card-head"><div><span className="eyebrow">Quick tools</span><h2>Prepare the classroom</h2></div></div>
          <div className="dashboard-tool-grid">
            <Link to="/teacher/offline" className="dashboard-tool"><HardDriveDownload size={19} /><div><strong>Offline Center</strong><span>Prepare learning for low connectivity</span></div></Link>
            <Link to="/teacher/languages" className="dashboard-tool"><Languages size={19} /><div><strong>Language Hub</strong><span>Translate and preview audio</span></div></Link>
            <Link to="/teacher/progress" className="dashboard-tool"><BarChart3 size={19} /><div><strong>Progress</strong><span>Review learning activity</span></div></Link>
            <Link to="/teacher/content" className="dashboard-tool"><BookOpen size={19} /><div><strong>Content Studio</strong><span>Build lessons and assessments</span></div></Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function DashboardStat({ icon: Icon, value, label, hint }) {
  return <div className="stat"><div className="stat-icon"><Icon size={19} /></div><strong>{value}</strong><span>{label}</span><small>{hint}</small></div>;
}

function Metric({ label, value }) {
  return <div className="dashboard-metric"><strong>{value}</strong><span>{label}</span></div>;
}
