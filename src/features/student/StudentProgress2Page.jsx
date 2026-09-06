import { useMemo, useState } from "react";
import { BarChart3, BookOpen, CheckCircle2, ChevronRight, CircleHelp, Clock3, Flame, Languages, Target, Trophy, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../../app/AppContext";

const ATTEMPTS_KEY = "sih26042:quiz-attempts";
function loadAttempts() { try { return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]"); } catch { return []; } }

export default function StudentProgress2Page() {
  const { state } = useApp();
  const [attempts] = useState(loadAttempts);
  const completedIds = state.progress.completedLessons || [];
  const quizScores = state.progress.quizScores || {};
  const totalLessons = state.lessons.length;
  const completed = completedIds.length;
  const completion = totalLessons ? Math.round(completed / totalLessons * 100) : 0;
  const quizCount = Object.keys(quizScores).length;
  const quizAverage = quizCount ? Math.round(Object.entries(quizScores).reduce((sum, [id, score]) => { const quiz = state.quizzes.find((item) => item.id === id); return sum + score / Math.max(quiz?.questions || 5, 1) * 100; }, 0) / quizCount) : 0;
  const bestScore = quizCount ? Math.max(...Object.entries(quizScores).map(([id, score]) => { const quiz = state.quizzes.find((item) => item.id === id); return Math.round(score / Math.max(quiz?.questions || 5, 1) * 100); })) : 0;
  const nextLesson = state.lessons.find((lesson) => !completedIds.includes(lesson.id));
  const recentAttempts = useMemo(() => attempts.slice(-5).reverse(), [attempts]);
  const streak = completed ? Math.min(completed, 7) : 0;

  return <div className="page student-progress2">
    <div className="student-progress2-head"><div><div className="eyebrow">My learning</div><h1>Progress & growth</h1><p className="muted">See what you have learned, where you are improving, and what to do next.</p></div><div className="progress2-device"><WifiOff size={15}/> Saved on this device</div></div>
    <section className="progress2-hero card"><div className="progress2-ring" style={{ "--progress": `${completion}%` }}><div><strong>{completion}%</strong><span>complete</span></div></div><div className="progress2-hero-copy"><span className="eyebrow">Learning journey</span><h2>{completed === totalLessons && totalLessons > 0 ? "You completed your lesson library!" : nextLesson ? "Keep your learning streak going." : "Start your first lesson."}</h2><p>{completed} of {totalLessons} lessons completed. Small, consistent steps make difficult topics easier.</p><div className="progress2-actions">{nextLesson ? <Link className="btn btn-primary" to={`/student/lessons/${nextLesson.id}`}>Continue learning <ChevronRight size={17}/></Link> : <Link className="btn btn-primary" to="/student/lessons">Review lessons <BookOpen size={17}/></Link>}<Link className="btn btn-secondary" to="/student/quizzes">Practice quiz <CircleHelp size={17}/></Link></div></div></section>
    <div className="progress2-stats"><ProgressStat icon={BookOpen} value={`${completed}/${totalLessons}`} label="Lessons completed"/><ProgressStat icon={Target} value={`${quizAverage}%`} label="Quiz average"/><ProgressStat icon={Trophy} value={`${bestScore}%`} label="Best quiz score"/><ProgressStat icon={Flame} value={streak} label="Learning streak"/></div>
    <div className="progress2-grid">
      <section className="card progress2-section"><div className="progress2-section-head"><div><span className="eyebrow">Lesson engagement</span><h2>Your lessons</h2></div><Link to="/student/lessons">View all <ChevronRight size={15}/></Link></div><div className="progress2-lessons">{state.lessons.map((lesson) => { const done = completedIds.includes(lesson.id); return <Link key={lesson.id} to={`/student/lessons/${lesson.id}`} className="progress2-lesson"><div className={`progress2-lesson-icon ${done ? "done" : ""}`}>{done ? <CheckCircle2 size={19}/> : <BookOpen size={19}/>}</div><div className="progress2-lesson-copy"><strong>{lesson.title}</strong><span>{lesson.level || "Learning content"} · {lesson.minutes || 10} min</span></div><div className="progress2-lesson-status">{done ? "Completed" : "Not started"}</div><ChevronRight size={16}/></Link>; })}</div></section>
      <section className="card progress2-section"><div className="progress2-section-head"><div><span className="eyebrow">Assessment</span><h2>Quiz performance</h2></div><Link to="/student/quizzes">Practice <ChevronRight size={15}/></Link></div>{quizCount === 0 ? <EmptyState/> : <div className="progress2-quiz-list">{state.quizzes.map((quiz) => { const score = quizScores[quiz.id]; if (score === undefined) return <div className="progress2-quiz-row" key={quiz.id}><div className="progress2-quiz-icon"><CircleHelp size={17}/></div><div><strong>{quiz.title}</strong><span>Not attempted</span></div><span className="progress2-quiz-pending">Pending</span></div>; const percent = Math.round(score / Math.max(quiz.questions || 5, 1) * 100); return <div className="progress2-quiz-row" key={quiz.id}><div className="progress2-quiz-icon"><Trophy size={17}/></div><div><strong>{quiz.title}</strong><span>{score}/{quiz.questions || 5} correct</span></div><div className="progress2-score"><strong>{percent}%</strong><div><i style={{ width: `${percent}%` }}/></div></div></div>; })}</div>}</section>
    </div>
    <section className="card progress2-section"><div className="progress2-section-head"><div><span className="eyebrow">Activity</span><h2>Recent quiz attempts</h2></div><span className="progress2-local"><Clock3 size={14}/> Local history</span></div>{recentAttempts.length ? <div className="progress2-activity">{recentAttempts.map((attempt) => { const quiz = state.quizzes.find((item) => item.id === attempt.quizId); const percent = Math.round(attempt.score / Math.max(attempt.total, 1) * 100); return <div className="progress2-activity-row" key={attempt.id}><div className="progress2-activity-icon"><BarChart3 size={17}/></div><div><strong>{quiz?.title || "Quiz"}</strong><span>{new Date(attempt.completedAt).toLocaleDateString()} · {attempt.score}/{attempt.total} correct</span></div><strong>{percent}%</strong></div>; })}</div> : <div className="progress2-empty compact"><Clock3 size={20}/><div><strong>Your activity will appear here</strong><span>Quiz attempts are kept locally so you can review your progress without internet.</span></div></div>}</section>
    <section className="progress2-next card"><div className="progress2-next-icon"><Languages size={21}/></div><div><span className="eyebrow">Keep improving</span><h3>Learn in the language that feels comfortable.</h3><p>Your current language is <strong>{state.language.toUpperCase()}</strong>. Use Language Assistant for translation and audio support.</p></div><Link className="btn btn-secondary" to="/student/languages">Open language tools <ChevronRight size={16}/></Link></section>
    <p className="progress2-note"><WifiOff size={14}/> Progress is calculated from learning activity stored on this device. It can connect to classroom sync later.</p>
  </div>;
}
function ProgressStat({ icon: Icon, value, label }) { return <div className="progress2-stat"><div className="progress2-stat-icon"><Icon size={18}/></div><strong>{value}</strong><span>{label}</span></div>; }
function EmptyState() { return <div className="progress2-empty"><CircleHelp size={22}/><strong>No quiz results yet</strong><span>Complete a quiz to see your performance here.</span><Link className="text-link" to="/student/quizzes">Take your first quiz <ChevronRight size={14}/></Link></div>; }
